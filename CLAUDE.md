# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository shape: two unrelated projects in one repo

This repo contains **two completely separate, unrelated projects**. Check which one a task belongs to before touching files.

1. **AI Tools Directory** (repo root) — the original project. A static site (`index.html`) listing AI tools, kept up to date by a daily GitHub Action.
2. **Ghar Pahuch Seva** (`backend/`, `web/`, `mobile/`) — an Urban-Company-style local services marketplace for Chhindwara, built on top of this repo afterward. Has its own backend API, React web app, and Flutter mobile app.

Don't assume context from one project applies to the other — they share a git history but nothing else.

---

## Project 1: AI Tools Directory

- `index.html` — the live static site.
- `tools_config.json` — tool definitions with version-check regexes.
- `tools_monitor.py` — daily monitoring script: checks all tool URLs for 404s/redirects/errors, auto-fixes permanent redirects (301/308) directly in `index.html`, flags version drift, generates `check_report.md`.
- `.github/workflows/daily-check.yml` — runs `tools_monitor.py` daily at 06:00 UTC (and on manual dispatch) and commits changes back to the repo.
- `requirements.txt` — Python deps for `tools_monitor.py`.

Run the monitor locally with:
```bash
pip install -r requirements.txt
python tools_monitor.py
```

---

## Project 2: Ghar Pahuch Seva (services marketplace)

Three independent apps that share a domain model but are deployed separately:

```
backend/   Node/Express + Sequelize/PostgreSQL REST API
web/       React 18 + Vite + Tailwind customer-facing site
mobile/    Flutter app (offline-first, Material 3)
```

### Commands

**Backend** (`backend/`):
```bash
npm install
npm run dev     # nodemon src/app.js, auto-restart
npm start        # node src/app.js, production
npm run seed     # backend/src/seed/seed.js — idempotent (matches providers by email, services by name+category; updates instead of duplicating)
```
No test suite is configured (`npm test` is a placeholder).

**Web** (`web/`):
```bash
npm install
npm run dev       # vite dev server
npm run build     # vite build -> dist/
npm run preview   # preview production build
```
No lint/test scripts configured.

**Mobile** (`mobile/`):
```bash
flutter pub get
flutter run                          # local dev
flutter build apk --release          # unsigned/test APK
flutter build apk --release          # signed, once android/key.properties exists (see APK_BUILD_GUIDE.md)
flutter test                         # run mobile/test/widget_test.dart
```
Signing is automatic via `android/key.properties` (git-ignored) — there is no `--sign-android` flag; see `APK_BUILD_GUIDE.md` for the full keystore setup.

### Backend architecture

- `backend/src/app.js` is the composition root: builds the Express app, wires CORS, JSON body parsing, the auth rate limiter, routes, error handler, and 404 handler, then calls `sequelize.sync()` before listening.
- **Sequelize associations are declared centrally in `app.js`**, not in the model files. If you add a new model relation, declare `belongsTo`/`hasMany` here — controllers eager-load relations (e.g. `include: [{ model: ServiceProvider }, { model: Service }]`) and will throw `EagerLoadingError` at request time if the association isn't registered in `app.js`.
- `backend/src/config/database.js`: picks connection strategy based on environment — if `DATABASE_URL` is set (Render/Heroku/Railway-style managed Postgres), connects via that URI with `ssl: { rejectUnauthorized: false }`; otherwise falls back to discrete `DB_HOST`/`DB_USER`/`DB_PASSWORD`/`DB_NAME` vars for local dev. All models use `underscored: true` + `timestamps: true` globally.
- Auth: JWT, 7-day expiry. `backend/src/middleware/auth.js` exposes separate `authenticateCustomer` / provider middleware that check `user.type` — don't let a provider token hit a customer-only route or vice versa.
- Admin-protected routes (e.g. creating services) require an `x-admin-key` header checked against `ADMIN_API_KEY` env var — there's no admin user/login flow, just a shared secret.
- **Pricing is always server-side authoritative.** `bookingController.createBooking` looks up `Service.base_price` from the DB and ignores any price sent by the client. `paymentController` re-validates the Razorpay order amount against `booking.service_price`, not client input. Never trust a price/amount field from `req.body`.
- Commission model: 25% platform / 75% provider, computed server-side at booking creation. The customer-facing UI never shows the commission split — only a single all-inclusive "Total Amount". Don't reintroduce a "platform fee" line item in customer-facing UI.
- Error responses to clients are generic (`"Internal server error"`); real errors go to `console.error` server-side only — don't leak `error.message` (e.g. DB connection strings, table names) to the client.
- `DELETE /api/auth/delete-account` (DPDP Act 2023 compliance): re-authenticates with password, deletes non-paid bookings, **anonymizes** (does not hard-delete) the user if they have paid bookings (tax record retention — email becomes `deleted+{id}@deleted.gharpahuchseva.com`), hard-deletes only if no paid bookings exist. Wrapped in a transaction.

### Web architecture

- React Router v6, pages live flat in `web/src/pages/`, single `Navbar` component, `AuthContext` holds the logged-in user/token.
- `web/src/services/api.js` is the only place that talks to the backend (axios). `VITE_API_URL` is injected per Netlify context in `netlify.toml` — keep it pointed at the real deployed backend URL, not a placeholder.
- Section anchors (`#about`, `#how-it-works`, `#contact`) only exist on `Home.jsx`. Other pages must navigate to `/` first and then scroll — see `goToSection()` in `Navbar.jsx`, which does `navigate('/')` + delayed `scrollIntoView` when not already on the home page. Don't add a bare `href="#section"` link on a non-Home page; it will silently do nothing.
- Logo: both `Navbar.jsx` and the `Home.jsx` footer read `/logo.png` from `web/public/`, with an `onError` fallback to a gradient house icon. `index.html`'s favicon also points at `/logo.png`. Dropping a `logo.png` into `web/public/` updates the logo everywhere; no code changes needed.
- Clash Display font is loaded globally via Fontshare `<link>` tags in `web/index.html`.

### Mobile architecture

- Offline-first: `app_state.dart` (Provider pattern) holds app state and a bundled `sample_data.dart` catalogue so the app is usable with no backend configured. `api_service.dart` is only consulted when `isOnline` and a backend URL has been configured (`server_settings_screen.dart`).
- `theme.dart` sets `fontFamily: 'ClashDisplay'` globally (Material 3); buttons re-assert it explicitly since `ElevatedButton` styling can override the theme default.
- Android `applicationId`/`namespace` is `com.gharpahuchseva.app` — **this is permanent once anything is uploaded to the Play Store**, do not change it casually.
- `mobile/lib/screens/profile_screen.dart` delete-account flow mirrors the backend: password confirmation only shown when online, distinguishes `ApiException` (backend-reported error) from generic exceptions, uses `context.mounted` guards before `Navigator.pop` inside async callbacks.

### Deployment

- `render.yaml` — Render Blueprint: provisions the backend (`rootDir: backend`, `node src/app.js`) + a free Postgres DB in one step. `JWT_SECRET` and `ADMIN_API_KEY` are auto-generated by Render; `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` must be set manually in the dashboard after first deploy.
- `netlify.toml` (root) — `base = "web"`, builds the web app; `VITE_API_URL` is set per-context (production/deploy-preview/branch-deploy) and must point at the live Render backend URL.
- Razorpay has separate test/live key pairs — swapping to live mode is just an env var change, no code change.

### Naming

The product is **Ghar Pahuch Seva** — older code/docs may still reference the original placeholder name "Urban Services" (package names, DB names, etc.); if you find a stray `urban_services`/`urban-services`/`UrbanServices` reference, it's leftover from before the rename and should be corrected, not treated as intentional.

### Reference docs

Business/legal/ops docs at the repo root (`BUSINESS_PLAN.md`, `FINANCIAL_PROJECTIONS.md`, `LEGAL_COMPLIANCE.md`, `GST_CHECKLIST.md`, `WORKER_CONTRACT_TEMPLATE.md`, `APK_BUILD_GUIDE.md`, `DEPLOYMENT_GUIDE.md`, `GO_LIVE_CHECKLIST.md`, etc.) capture product/business decisions already made — check these before re-deriving pricing, commission, or legal-compliance logic from scratch.
