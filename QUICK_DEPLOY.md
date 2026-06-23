# ⚡ Quick Deploy in 5 Minutes

**For the impatient!** Deploy to Netlify + Heroku in 5 steps. 🚀

---

## Step 1: Push to GitHub ✓

```bash
git push origin claude/urban-company-chhindwara-ywd8k9
```

**Status:** Code uploaded to GitHub

---

## Step 2: Deploy Backend to Heroku (3 min)

### Create Heroku App
```bash
npm install -g heroku-cli
heroku login
cd backend
heroku create ghar-pahuch-seva-backend
```

### Add PostgreSQL
```bash
heroku addons:create heroku-postgresql:hobby-dev -a ghar-pahuch-seva-backend
```

### Set Config Variables
```bash
heroku config:set \
  JWT_SECRET=your_super_secret_key_12345 \
  RAZORPAY_KEY_ID=rzp_test_your_key \
  RAZORPAY_KEY_SECRET=your_secret_key \
  NODE_ENV=production \
  -a ghar-pahuch-seva-backend
```

### Deploy
```bash
git push heroku main
```

**Status:** Backend live at `https://ghar-pahuch-seva-backend.herokuapp.com` ✓

---

## Step 3: Deploy Frontend to Netlify (2 min)

### Option A: GitHub Connected Deploy
1. Go to https://netlify.com
2. Login with GitHub
3. Click "New site from Git"
4. Select your repository
5. Build command: `cd web && npm run build`
6. Publish: `web/dist`
7. Set env var: `VITE_API_URL=https://ghar-pahuch-seva-backend.herokuapp.com/api`
8. Click "Deploy"

**Status:** Frontend live at `https://your-site.netlify.app` ✓

### Option B: CLI Deploy
```bash
npm install -g netlify-cli
cd web
netlify deploy --prod --dir=dist
```

---

## Step 4: Update Frontend API URL

In web app on Netlify:

**Settings → Build & Deploy → Environment**

Add:
```
VITE_API_URL = https://ghar-pahuch-seva-backend.herokuapp.com/api
```

Then redeploy.

---

## Step 5: Test!

Open: `https://your-site.netlify.app`

- Sign up ✓
- Browse services ✓
- Book & pay ✓
- View bookings ✓

**Done!** 🎉

---

## Your Live URLs

**Frontend:** `https://your-site.netlify.app`
**Backend:** `https://ghar-pahuch-seva-backend.herokuapp.com/api`

Share the frontend URL with anyone! 📱

---

## Cost

**Total: ₹0** (Everything free!)

- Netlify: FREE
- Heroku: FREE (tier)
- Domain: FREE (netlify.app subdomain)

---

## Troubleshooting

### Not working?

```bash
# Check backend
curl https://ghar-pahuch-seva-backend.herokuapp.com/api/health

# Check frontend loads
curl https://your-site.netlify.app

# Check Heroku logs
heroku logs --tail -a ghar-pahuch-seva-backend
```

### Need help?
See `DEPLOYMENT_GUIDE.md` for detailed instructions

---

**🎉 You're live!**
