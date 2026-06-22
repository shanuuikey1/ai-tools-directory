# Deployment Guide - Urban Services
## Deploy Frontend to Netlify + Backend to Heroku

Complete guide to get your app live and accessible from anywhere! 🌐

---

## 🎯 What We're Doing

1. **Deploy Backend** → Heroku (free tier with PostgreSQL)
2. **Deploy Frontend** → Netlify (free tier)
3. **Connect them** with proper URLs

**Result:** App accessible at `https://your-site.netlify.app` 🚀

---

## 📋 Prerequisites

1. **GitHub Account** (free at github.com)
2. **Netlify Account** (free at netlify.com)
3. **Heroku Account** (free at heroku.com)

All are free! Let's go! 💪

---

## Part 1: Deploy Backend to Heroku

### Step 1: Create Heroku Account

1. Go to https://www.heroku.com
2. Sign up (free account)
3. Verify email

### Step 2: Create New App on Heroku

1. Go to Heroku Dashboard
2. Click "New" → "Create new app"
3. App name: `urban-services-backend` (or your name)
4. Region: Choose closest to you
5. Click "Create app"

### Step 3: Add PostgreSQL Database

1. Go to "Resources" tab
2. Search for "Heroku Postgres"
3. Click on it and select
4. Choose "Hobby Dev - Free" plan
5. Click "Submit Order Form"
6. Wait 2-3 minutes for database to provision

### Step 4: Set Environment Variables

1. Go to "Settings" tab
2. Click "Reveal Config Vars"
3. Add these variables:

```
DB_HOST = provided by Heroku Postgres
DB_NAME = provided by Heroku Postgres
DB_USER = provided by Heroku Postgres
DB_PASSWORD = provided by Heroku Postgres
DB_PORT = 5432
JWT_SECRET = your_super_secret_key_12345
RAZORPAY_KEY_ID = rzp_test_your_key
RAZORPAY_KEY_SECRET = your_secret_key
NODE_ENV = production
```

**To get PostgreSQL credentials:**
1. Go to "Resources" tab
2. Click on "Heroku Postgres" link
3. Go to "Settings" tab
4. Click "View Credentials"
5. Copy all values

### Step 5: Deploy Backend Code

```bash
# Install Heroku CLI
npm install -g heroku-cli

# Login to Heroku
heroku login

# Navigate to backend folder
cd backend

# Add Heroku remote
heroku git:remote -a urban-services-backend

# Push code to Heroku
git push heroku main
```

**Wait for deployment to complete (2-3 minutes)**

Check logs:
```bash
heroku logs --tail
```

Your backend is now live at:
```
https://urban-services-backend.herokuapp.com/api/health
```

---

## Part 2: Deploy Frontend to Netlify

### Step 1: Create Netlify Account

1. Go to https://www.netlify.com
2. Click "Sign up"
3. Login with GitHub (easier!)

### Step 2: Connect GitHub Repository

1. Click "New site from Git"
2. Choose "GitHub"
3. Authorize Netlify
4. Select `shanuuikey1/ai-tools-directory` repository

### Step 3: Configure Build Settings

When Netlify asks for build settings:

```
Build command: cd web && npm run build
Publish directory: web/dist
```

### Step 4: Add Environment Variables

In Netlify Dashboard:

1. Go to "Site settings"
2. Click "Build & deploy"
3. Click "Environment"
4. Add variable:

```
VITE_API_URL = https://urban-services-backend.herokuapp.com/api
```

### Step 5: Deploy

1. Click "Deploy site"
2. Wait 2-3 minutes for build
3. Once done, you get a URL like:

```
https://your-site-name.netlify.app
```

**Your frontend is now live!** 🎉

---

## Part 3: Connect Frontend to Backend

The `netlify.toml` file already has the correct backend URL configured. 

If it doesn't work:
1. Go to Netlify Settings
2. Build & Deploy → Environment Variables
3. Update `VITE_API_URL` to your Heroku backend URL

---

## 🧪 Test Your Live App

1. Open your Netlify URL in browser:
   ```
   https://your-site.netlify.app
   ```

2. You should see the home page ✓

3. Try the full flow:
   - **Sign up** with new account
   - **Browse services**
   - **Book a service**
   - **Make test payment** (Razorpay)
   - **View bookings**

If everything works → **Congratulations!** 🎉

---

## 🔧 If Something Doesn't Work

### Frontend loads but no services?
**Problem:** Backend API not connected

**Solution:**
```bash
# Check your Heroku backend is running
curl https://urban-services-backend.herokuapp.com/api/health

# Should return: {"message": "Server is running!"}
```

If not running, check Heroku logs:
```bash
heroku logs --tail -a urban-services-backend
```

### Database connection error on backend?
**Solution:**
1. Go to Heroku Dashboard
2. Click your app
3. Go to "Resources"
4. Verify Postgres is attached
5. Click on Postgres and verify credentials in Config Vars match

### Payment not working?
**Solution:**
- Use Razorpay TEST keys (not production)
- Test card: `4111 1111 1111 1111`
- Expiry: `12/25`
- CVV: `123`

### Slow loading?
**Reason:** Free tier Heroku spins down when not used

**Solution:**
- Just wait, it wakes up after first request
- Or upgrade to paid tier ($7/month)

---

## 📱 Access on Your Mobile

Your app is now live! Access anywhere:

**Frontend:**
```
https://your-site.netlify.app
```

**Backend API:**
```
https://urban-services-backend.herokuapp.com/api
```

Just open the Netlify URL on your phone and you're good to go! 📱

---

## 🚀 Custom Domain (Optional)

Want your own domain like `urbanservices.com`?

**For Frontend (Netlify):**
1. Netlify Dashboard → Site settings
2. Click "Change site name" or "Custom domain"
3. Add your domain
4. Follow DNS setup instructions

**For Backend (Heroku):**
1. Heroku App → Settings
2. Add custom domain
3. Update DNS records

---

## 💰 Cost Breakdown

| Service | Cost | Why |
|---------|------|-----|
| Netlify Frontend | FREE | Unlimited free tier |
| Heroku Backend | FREE | Free tier with Postgres |
| Custom Domain | ~$10/year | Optional |
| **Total** | **FREE** | Everything is free! |

---

## 📊 Monitoring Your App

### Netlify
- Dashboard shows all deployments
- Auto-redeploy on git push
- View build logs and errors

### Heroku
```bash
# View logs
heroku logs --tail -a urban-services-backend

# Check app status
heroku apps:info -a urban-services-backend

# Restart app if needed
heroku restart -a urban-services-backend
```

---

## 🔄 Update Your App

### Update Frontend Code
1. Push code to GitHub
2. Netlify auto-deploys (2-3 min)

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

### Update Backend Code
1. Push to Heroku:

```bash
cd backend
git add .
git commit -m "Update backend"
git push heroku main
```

---

## ⚠️ Important Notes

1. **Heroku free tier** - App sleeps after 30 min of inactivity
   - First request wakes it up (slower)
   - Perfectly fine for testing

2. **Database backups** - Heroku Postgres keeps automatic backups

3. **Free tier limits:**
   - Heroku: 550 free dyno hours/month
   - Netlify: Unlimited builds (but rate limited)

4. **Going to production?**
   - Upgrade Heroku dyno ($7/month)
   - Upgrade Heroku Postgres ($9/month)
   - Total: ~$16/month for production

---

## 🎉 You're Live!

Congratulations! Your Urban Services marketplace is now:

✅ Deployed to Netlify (Frontend)
✅ Deployed to Heroku (Backend)
✅ Accessible from anywhere
✅ Live on the internet!

Share your URL:
```
https://your-site.netlify.app
```

---

## 📝 Next Steps

1. **Get custom domain** (optional)
2. **Set up monitoring** (Sentry, LogRocket)
3. **Add more features** (chat, notifications, etc.)
4. **Upgrade to paid tiers** when scaling
5. **Promote your app** to users!

---

## 🆘 Need Help?

**Common Commands:**

```bash
# Check Heroku status
heroku status

# View Netlify builds
netlify deploy --status

# Check backend health
curl https://urban-services-backend.herokuapp.com/api/health

# Check frontend loads
curl https://your-site.netlify.app
```

---

**Your Urban Services marketplace is now LIVE on the internet!** 🌍🚀

Share the link with anyone and they can use it! 📱

---

**Document Version:** 1.0
**Last Updated:** June 2026
**Status:** Production Deployment Ready
