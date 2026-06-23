# Legal & Compliance Guide — Ghar Pahuch Seva

> Practical checklist for a 3-brother bootstrapped service marketplace in
> Chhindwara, Madhya Pradesh. This is operational guidance, **not** legal advice —
> have a local lawyer/CA review before you go live.

**Estimated total cost to be fully compliant for launch: ₹7,000–10,000 + ~4 weeks of admin.**

---

## TIER 1 — CRITICAL (cannot launch without)

### 1. Business registration
- **Proprietorship** (fastest — just you as owner, brothers as team) **or**
  **Partnership** (all 3 brothers named, joint liability, cleaner if disputes arise).
- **Recommendation:** start as a proprietorship; convert to a registered Partnership
  or LLP once revenue is steady and you want to formalise the 3-way split.
- **UDYAM (MSME) registration** — free, online, ~5 min at https://udyamregistration.gov.in.
  Needs Aadhaar + PAN. Gives you official MSME status (helps with bank account, loans, credit).
- **Local trade licence** from Chhindwara Municipal Corporation (~₹200–500).

### 2. GST registration
- Mandatory once turnover crosses **₹20 lakh/year** for services. At ₹1.5L/month you
  cross this around month 5–6, so register **preemptively** to avoid penalties.
- For a marketplace, GST (18%) applies to **your 25% commission**, not the worker's
  full service charge.
- Register at https://www.gst.gov.in (free; ~₹500 if you use a CA). See `GST checklist` below.

### 3. Terms of Service & Privacy Policy
- ✅ Already live: `web/public/terms.html` and `web/public/privacy.html`.
- ✅ Updated with: real contact email, dispute-resolution process, governing law
  (Chhindwara/MP jurisdiction), independent-contractor clause, DPDP Act 2023 rights,
  and Grievance Officer details.
- **Action:** have a local lawyer skim them once (~₹2–3k) before heavy marketing.

### 4. Payment compliance (Razorpay)
- Razorpay handles PCI-DSS — you are not storing card data, so you're covered.
- When switching from test to **live keys**, Razorpay will ask for your GST certificate
  + business proof. Keep them ready.
- Display the amount clearly before payment (✅ already done in app + web).

---

## TIER 2 — IMPORTANT (before Month 2)

### 5. Worker contracts
- Every Service Professional signs the 1-page agreement in `WORKER_CONTRACT_TEMPLATE.md`.
- Confirms they are **independent contractors**, agree to the 25% commission, own service
  quality, and accept the dispute/rating process.
- One template, lawyer-reviewed once (~₹2k), reused for everyone.

### 6. Data protection (DPDP Act, 2023)
- ✅ Passwords hashed (bcryptjs), HTTPS only, privacy policy live, Grievance Officer named.
- **To add before Month 2:** a "Delete My Account" option in the app/web settings so users
  can exercise their deletion right (policy already promises this within 30 days).

### 7. Insurance
- **Public/third-party liability insurance** — covers damage a worker causes at a customer's
  home (e.g. a plumber floods a flat). ~₹8,000–15,000/year.
- Get a quote now; buy before you scale marketing (~Month 3).

---

## TIER 3 — NICE TO HAVE (Month 3–6)

### 8. Trademark "Ghar Pahuch Seva"
- File at https://ipindia.gov.in (~₹4,500 govt fee for an MSME + agent fees). Protects the brand.

### 9. Worker KYC
- Collect Aadhaar/PAN + verify phone/email for every worker (basic fraud protection).
- Keep copies securely; never share publicly.

---

## CRITICAL GOTCHAS

1. **Never call workers "employees."** Your whole margin depends on them being
   independent contractors. The contract + T&S language protects you.
2. **File GST returns on time.** Late GSTR-1 = ₹50–100/day penalty. Set a reminder for
   the 11th of each month.
3. **Record every booking in the system.** No off-the-books cash jobs — that's tax evasion.
4. **Keep dispute records** (booking + payment + rating). They prove you didn't take money
   without service if a customer complains.
5. **Fix your T&S while you're small.** Patching a loophole at 1,000 bookings is far costlier.

---

## 30-DAY ACTION PLAN

| Week | Task | Cost | Owner |
|------|------|------|-------|
| 1 | UDYAM + municipal trade licence | ₹500 | You / Bro 2 |
| 1–2 | GST registration online | ₹500 | You |
| 2 | Lawyer reviews T&S + worker contract | ₹5–8k | You |
| 2–3 | Get liability insurance quote | ₹0 (quote) | Bro 1 |
| 3 | Publish updated T&S/Privacy with company info | ₹0 | You |
| 4 | Sign first 5 workers on the contract; test bookings | ₹0 | Bro 1 |

See `WORKER_CONTRACT_TEMPLATE.md` and `GST_CHECKLIST.md` for the detailed documents.
