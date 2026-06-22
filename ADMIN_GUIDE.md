# Admin Guide — Running Urban Services

How to manage workers, services, bookings and payouts day-to-day.
There is no admin web dashboard yet, so management is done via the
**Render Shell** (`psql` + the seed script). Everything below is copy-paste.

---

## Opening a database shell

1. Render dashboard → your **urban-services-backend** service → **Shell** tab
2. Connect to Postgres:
   ```bash
   psql $DATABASE_URL
   ```
   You're now at a `urban=>` prompt. Type `\q` to exit.

---

## 1. Adding workers & services (bulk)

The easiest way is the seed file you already have:

1. Edit `backend/src/seed/seedData.js`, commit, push (Render auto-redeploys)
2. Render Shell → `npm run seed`

Re-running is safe — it updates existing rows, never duplicates.

---

## 2. Verifying a worker

New workers (whether self-signed-up or seeded with `pending`) must be
verified before you trust them. To approve one:

```sql
UPDATE service_providers
SET verification_status = 'verified'
WHERE email = 'worker@example.com';
```

To see who's waiting for approval:

```sql
SELECT id, name, phone, service_categories, verification_status
FROM service_providers
WHERE verification_status = 'pending';
```

To deactivate a worker (hides them, keeps their history):

```sql
UPDATE service_providers SET is_active = false WHERE id = 5;
```

---

## 3. Adding a single service quickly

```sql
INSERT INTO services (name, category, base_price, description, is_active, created_at, updated_at)
VALUES ('Sofa Cleaning', 'Cleaning', 699, 'Deep cleaning of sofa and upholstery.', true, NOW(), NOW());
```

Categories must be one of: `Cleaning, Plumbing, Electrical, Beauty,
AC Repair, Carpentry, Painting, Pest Control`.

To disable a service without deleting it:

```sql
UPDATE services SET is_active = false WHERE name = 'Sofa Cleaning';
```

---

## 4. Watching bookings

All bookings, newest first:

```sql
SELECT id, customer_id, provider_id, service_id, status,
       service_price, platform_commission, provider_earning,
       service_date, payment_status
FROM bookings
ORDER BY created_at DESC
LIMIT 20;
```

Booking status flow: `pending → accepted → completed` (or `cancelled`).
The 25% / 75% split is stored on every booking:
`platform_commission` = your cut, `provider_earning` = the worker's.

---

## 5. Money: revenue & payouts

**Your total earnings (completed jobs):**

```sql
SELECT COUNT(*) AS jobs,
       SUM(service_price)        AS gross,
       SUM(platform_commission)  AS your_revenue,
       SUM(provider_earning)     AS owed_to_workers
FROM bookings
WHERE status = 'completed';
```

**What you owe each worker (payout sheet):**

```sql
SELECT sp.name, sp.bank_account, sp.ifsc_code,
       COUNT(b.id)             AS jobs,
       SUM(b.provider_earning) AS payout
FROM bookings b
JOIN service_providers sp ON sp.id = b.provider_id
WHERE b.status = 'completed' AND b.payment_status = 'completed'
GROUP BY sp.id, sp.name, sp.bank_account, sp.ifsc_code
ORDER BY payout DESC;
```

Pay workers their 75% to the listed bank account/IFSC (manually via UPI/
bank transfer at first; automate with Razorpay Payouts later).

---

## 6. Security to-dos before scaling

These are known gaps to close as you grow (not blockers for launch):

- **`POST /api/services` has no auth** — anyone who knows the URL could add
  a service. Add an admin check or an `ADMIN_API_KEY` header before
  advertising the API publicly.
- **No admin role/dashboard** — management is via this shell. A simple admin
  page can be added to the React web app later.
- Set a strong `JWT_SECRET` (Render's Blueprint auto-generates one).
- Switch Razorpay to **live keys** only when you're ready to collect real money.

---

## Quick reference

| Task | Where |
|------|-------|
| Add many workers/services | edit `seedData.js` → `npm run seed` |
| Verify / disable a worker | `psql` UPDATE (section 2) |
| See pending workers | `psql` SELECT (section 2) |
| View bookings | `psql` SELECT (section 4) |
| Revenue & payouts | `psql` SELECT (section 5) |
| Health check | open `/api/health` in a browser |
