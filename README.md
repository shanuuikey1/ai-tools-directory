# AI Tools Directory 2026

AI Tools Directory with 65 tools across 12 categories. Auto-updated daily via GitHub Actions.

## Files

- `index.html` — The live website
- `tools_monitor.py` — Daily monitoring script
- `tools_config.json` — Tool configurations with version regexes
- `.github/workflows/daily-check.yml` — GitHub Actions workflow
- `requirements.txt` — Python dependencies

## How It Works

Every day at 06:00 UTC, GitHub Actions runs `tools_monitor.py` which:
1. Checks all 65 tool URLs for 404s, redirects, and server errors
2. Auto-fixes permanent redirects (301/308) in `index.html`
3. Flags version drift for high-churn tools
4. Commits changes back to the repo
5. Generates `check_report.md`

## Setup

1. Enable GitHub Actions: **Settings → Actions → General → Workflow permissions → Read and write permissions**
2. The workflow runs automatically daily, or manually via **Actions → Daily AI Tools Check → Run workflow**

## Cost

$0 — Uses GitHub Actions free tier (2,000 minutes/month). This workflow uses ~90 min/month.
