#!/usr/bin/env python3
"""AI Tools Directory Monitor - Checks URLs daily for 404s, redirects, version changes."""
import json, re, sys, time
from pathlib import Path
import requests
from bs4 import BeautifulSoup

HTML_FILE = Path("index.html")
CONFIG_FILE = Path("tools_config.json")
REPORT_FILE = Path("check_report.md")
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    "DNT": "1",
    "Connection": "keep-alive",
}
TIMEOUT = 15
DELAY = 2.5
MAX_CONTENT = 120_000

def log(msg): print(msg, flush=True)

def load_config():
    if not CONFIG_FILE.exists(): return None
    with open(CONFIG_FILE, "r", encoding="utf-8") as f: return json.load(f)

def save_config(cfg):
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(cfg, f, indent=2, ensure_ascii=False)

def parse_html():
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        return BeautifulSoup(f.read(), "html.parser")

def save_html(soup):
    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(str(soup))

def extract_tools(soup):
    tools = []
    for row in soup.select(".tool-row"):
        num_el = row.select_one(".tool-num")
        link_el = row.select_one("a.tool-link")
        desc_el = row.select_one(".tool-desc")
        if not link_el: continue
        tools.append({
            "num": num_el.text.strip() if num_el else "",
            "name": link_el.get_text(strip=True).replace("↗", "").strip(),
            "url": link_el.get("href", "").strip(),
            "desc": desc_el.text.strip() if desc_el else "",
            "element": link_el,
        })
    return tools

def bootstrap_config(tools):
    return {
        "meta": {
            "generated": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "note": "Set check_version=true and fill current_version / version_regex to enable version monitoring."
        },
        "tools": [
            {
                "name": t["name"], "url": t["url"], "status": "active",
                "check_version": False, "current_version": "",
                "version_regex": "", "last_seen_ok": "",
                "suggested_version": "", "needs_review": False,
            }
            for t in tools
        ]
    }

def fetch(url, method="HEAD", allow_redirects=True):
    try:
        if method == "HEAD":
            r = requests.head(url, headers=HEADERS, timeout=TIMEOUT, allow_redirects=allow_redirects)
        else:
            r = requests.get(url, headers=HEADERS, timeout=TIMEOUT, allow_redirects=allow_redirects, stream=True)
            if method == "GET":
                content = b""
                for chunk in r.iter_content(chunk_size=8192):
                    content += chunk
                    if len(content) >= MAX_CONTENT: break
                r._content = content
                r.close()
        return r
    except Exception as e:
        class FakeResp:
            status_code = 0
            url = url
            history = []
            headers = {}
            text = ""
            error = str(e)
        return FakeResp()

def check_url(tool, cfg):
    url = cfg.get("url", tool["url"])
    findings = []
    updated = False
    resp = fetch(url, method="HEAD", allow_redirects=True)
    time.sleep(DELAY)
    if resp.status_code in (405, 501, 503) or resp.status_code == 0:
        resp = fetch(url, method="GET", allow_redirects=True)
        time.sleep(DELAY)
    final_url = getattr(resp, "url", url)
    status = getattr(resp, "status_code", 0)
    if resp.history:
        for h in resp.history:
            if h.status_code in (301, 308):
                findings.append(f"🔀 Permanent redirect: {url} -> {final_url}")
                tool["element"]["href"] = final_url
                cfg["url"] = final_url
                updated = True
                break
        else:
            findings.append(f"↪️ Temporary redirect chain ({len(resp.history)} hops) for {url}")
    if status == 404 or status == 410:
        findings.append(f"❌ Dead ({status}): {url}")
        cfg["status"] = "dead"
    elif status == 403:
        findings.append(f"⚠️ Blocked (403) — may need manual check: {url}")
    elif status == 0:
        findings.append(f"💥 Unreachable: {url} — {getattr(resp, 'error', 'unknown error')}")
    elif status >= 500:
        findings.append(f"🔥 Server error {status}: {url}")
    elif status == 200:
        cfg["last_seen_ok"] = time.strftime("%Y-%m-%d")
        cfg["status"] = "active"
    else:
        findings.append(f"ℹ️ Unexpected status {status}: {url}")
    return findings, updated, cfg

def check_version(tool, cfg):
    if not cfg.get("check_version"): return [], False, cfg
    url = cfg["url"]
    current = cfg.get("current_version", "").strip()
    regex = cfg.get("version_regex", "").strip()
    findings = []
    resp = fetch(url, method="GET", allow_redirects=True)
    time.sleep(DELAY)
    if getattr(resp, "status_code", 0) != 200 or not hasattr(resp, "text"): return findings, False, cfg
    text = resp.text
    if current and current.lower() in text.lower(): return findings, False, cfg
    if regex:
        try: matches = list(set(re.findall(regex, text)))
        except re.error: matches = []
        new_matches = [m for m in matches if m != current]
        if new_matches:
            latest = sorted(new_matches, reverse=True)[0]
            findings.append(f"📢 Version drift suspected for {tool['name']}: found '{latest}' (expected '{current}')")
            cfg["suggested_version"] = latest
            cfg["needs_review"] = True
    return findings, False, cfg

def generate_report(findings_map, changes_made):
    lines = [
        "# 🔍 AI Tools Daily Check Report",
        f"**Date:** {time.strftime('%Y-%m-%d %H:%M UTC')}",
        f"**Tools checked:** {len(findings_map)}",
        f"**Auto-changes (URL updates):** {changes_made}",
        "", "## Summary", "",
    ]
    dead, blocked, redirects, versions, healthy = [], [], [], [], []
    for name, items in findings_map.items():
        if not items: healthy.append(name); continue
        for it in items:
            if it.startswith("❌"): dead.append((name, it))
            elif it.startswith("⚠️"): blocked.append((name, it))
            elif it.startswith("🔀"): redirects.append((name, it))
            elif it.startswith("📢"): versions.append((name, it))
    lines.append(f"- ✅ Healthy: {len(healthy)}")
    lines.append(f"- 🔀 Auto-fixed redirects: {len(redirects)}")
    lines.append(f"- ⚠️ Blocked / needs manual check: {len(blocked)}")
    lines.append(f"- 📢 Version drift flagged: {len(versions)}")
    lines.append(f"- ❌ Dead tools: {len(dead)}")
    lines.append("")
    if dead:
        lines.append("## ☠️ Dead Tools"); lines.append("")
        for name, it in dead: lines.append(f"- **{name}**: {it}")
        lines.append("")
    if versions:
        lines.append("## 📢 Version Drift (Needs Review)"); lines.append("")
        for name, it in versions: lines.append(f"- **{name}**: {it}")
        lines.append("")
    if blocked:
        lines.append("## ⚠️ Blocked / Manual Review"); lines.append("")
        for name, it in blocked: lines.append(f"- **{name}**: {it}")
        lines.append("")
    if redirects:
        lines.append("## 🔀 Auto-Fixed Redirects"); lines.append("")
        for name, it in redirects: lines.append(f"- **{name}**: {it}")
        lines.append("")
    if not (dead or blocked or versions or redirects): lines.append("✅ All tools healthy. No action required.")
    lines.append(""); lines.append("---")
    lines.append("*This report is auto-generated. Review `tools_config.json` for suggested_version flags.*")
    with open(REPORT_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

def main():
    log("🔍 AI Tools Directory Monitor starting...")
    soup = parse_html()
    tools = extract_tools(soup)
    log(f"📋 Found {len(tools)} tools in HTML")
    cfg = load_config()
    if cfg is None:
        log("🆕 Bootstrapping tools_config.json from HTML...")
        cfg = bootstrap_config(tools)
        save_config(cfg)
        log("💾 Config saved. Edit tools_config.json to enable version checks, then re-run.")
    config_tools = cfg.get("tools", [])
    findings_map = {}
    changes_made = 0
    config_dirty = False
    for tool in tools:
        name = tool["name"]
        cfg_entry = next((c for c in config_tools if c.get("url") == tool["url"] or c.get("name") == name), None)
        if cfg_entry is None:
            cfg_entry = {"name": name, "url": tool["url"], "status": "active", "check_version": False, "current_version": "", "version_regex": "", "last_seen_ok": "", "suggested_version": "", "needs_review": False}
            config_tools.append(cfg_entry)
            config_dirty = True
        findings = []
        updated = False
        f, u, cfg_entry = check_url(tool, cfg_entry)
        findings.extend(f)
        if u: updated = True
        f, u, cfg_entry = check_version(tool, cfg_entry)
        findings.extend(f)
        if updated: changes_made += 1; config_dirty = True
        findings_map[name] = findings
    if changes_made:
        log(f"✏️ {changes_made} URL auto-update(s) applied to HTML")
        save_html(soup)
    if config_dirty:
        cfg["tools"] = config_tools
        save_config(cfg)
    generate_report(findings_map, changes_made)
    log(f"📝 Report written to {REPORT_FILE}")
    dead = sum(1 for c in config_tools if c.get("status") == "dead")
    review = sum(1 for c in config_tools if c.get("needs_review"))
    if dead: log(f"☠️ {dead} dead tool(s) detected — review report.")
    if review: log(f"📢 {review} tool(s) flagged for version review — check tools_config.json.")
    log("✅ Done.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
