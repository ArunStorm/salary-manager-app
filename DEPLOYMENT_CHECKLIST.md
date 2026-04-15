# 🚀 Backend to Render Deployment Checklist

Complete this checklist step-by-step to get production login working.

---

## 📋 Phase 1: Backend Preparation ✅

**Status**: Complete - No action needed

Your backend is ready for deployment:
- ✅ `package.json` has `npm start` script  
- ✅ `firebase.js` supports environment variables  
- ✅ `CORS_ORIGIN` configured with env var  
- ✅ `serviceAccountKey.json` in .gitignore  

---

## 📋 Phase 2: Deploy Backend to Render (10 mins)

**Follow**: [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

### Checklist:

- [ ] Create account at [render.com](https://render.com) with GitHub
- [ ] Click "New" → "Web Service"
- [ ] Connect `salary-manager-app` repository
- [ ] Set **Name**: `salary-manager-api`
- [ ] Set **Start Command**: `npm start`
- [ ] Add environment variables:
  - [ ] `CORS_ORIGIN` = `https://salary-manager-app.vercel.app`
  - [ ] `NODE_ENV` = `production`
  - [ ] `PORT` = `5000`
  - [ ] `FIREBASE_KEY` = (minified JSON from serviceAccountKey.json)
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (1-2 mins)
- [ ] Service status shows **"Live"** ✅
- [ ] Copy the service URL (e.g., `https://salary-manager-api.onrender.com`)
- [ ] Test health endpoint:
  ```
  https://your-service-url.onrender.com/
  Should return JSON with "success": true
  ```

**Result**: Backend is live on Render ✅

---

## 📋 Phase 3: Connect Frontend to Backend (5 mins)

**Follow**: [VERCEL_SETUP.md](./VERCEL_SETUP.md)

### Checklist:

- [ ] Go to [vercel.com](https://vercel.com) dashboard
- [ ] Click **salary-manager-app** project
- [ ] Go to **Settings** → **Environment Variables**
- [ ] Find or create `REACT_APP_API_URL`
- [ ] Set value to your Render service URL:
  ```
  https://your-render-service-url.onrender.com
  ```
- [ ] Click **"Save"**
- [ ] Trigger redeploy using one of these:
  - Option A: Run empty commit:
    ```powershell
    cd d:\salary-manager-app
    git commit --allow-empty -m "Trigger redeploy"
    git push origin main
    ```
  - Option B: Vercel dashboard → Deployments → Redeploy
  - Option C: GitHub Actions → Re-run workflow
- [ ] Wait for build to complete (status shows "Ready") ✅

**Result**: Frontend connected to backend ✅

---

## 📋 Phase 4: Create Admin User & Test (5 mins)

**Follow**: [TESTING_GUIDE.md](./TESTING_GUIDE.md)

### Checklist:

- [ ] Go to [Firebase Console](https://console.firebase.google.com)
- [ ] Click your project
- [ ] Go to **Firestore Database**
- [ ] Create collection: `users`
- [ ] Add document with fields:
  ```
  username: ARUN
  password: welcome
  role: ADMIN
  userGroup: ADMIN
  createdAt: (current timestamp)
  ```
- [ ] Visit **https://salary-manager-app.vercel.app**
- [ ] Login with **ARUN** / **welcome**
- [ ] Verify:
  - [ ] No "failed to fetch" errors
  - [ ] Dashboard loads successfully
  - [ ] "Admin Settings" visible in sidebar
  - [ ] Can logout and re-login

**Result**: Production login working end-to-end ✅

---

## 🎯 Quick Links

| Step | Document | Time |
|------|----------|------|
| Backend deploy | [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) | 10 min |
| Frontend update | [VERCEL_SETUP.md](./VERCEL_SETUP.md) | 5 min |
| Testing & setup | [TESTING_GUIDE.md](./TESTING_GUIDE.md) | 5 min |
| **Total** | | **20 min** |

---

## 🔑 Key URLs

After completing all phases:

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://salary-manager-app.vercel.app |
| Backend (Render) | https://salary-manager-api.onrender.com |
| Firebase Console | https://console.firebase.google.com |
| Render Dashboard | https://dashboard.render.com |
| Vercel Dashboard | https://vercel.com/dashboard |

---

## ⚠️ Important Notes

### Firebase Key Extraction (for Render)

You need to convert `server/serviceAccountKey.json` to a single line for Render:

**PowerShell (Windows):**
```powershell
cd d:\salary-manager-app\server
(Get-Content serviceAccountKey.json -Raw) | Set-Clipboard
```
Then paste into Render's FIREBASE_KEY field.

### Free Tier Limitations

- **Render free tier**: 750 compute hours/month
  - First request after 15 min inactivity: ~30 seconds (service spinning up)
  - Subsequent requests: Fast
  - Normal for free tier!

- **Firebase free tier**: 
  - 1GB storage (plenty)
  - 100 operations/second (enough for testing)

---

## ✅ Success Criteria

Your deployment is successful when:

1. ✅ Can visit https://salary-manager-app.vercel.app
2. ✅ See login page (no errors)
3. ✅ Network shows POST to `/api/auth/login`
4. ✅ Can login with ARUN/welcome
5. ✅ Dashboard displays
6. ✅ "Admin Settings" link visible
7. ✅ Can logout and re-login
8. ✅ Can create employees (ADMIN only)

---

## 🐛 Troubleshooting

### Step 1: Check Backend
```
Visit: https://your-render-url.onrender.com/
Should see: {"success": true, "message": "Salary Management API is running..."}
If not: Check Render dashboard Logs
```

### Step 2: Check Frontend → Backend Connection
```
DevTools (F12) → Network tab → Login attempt
Should see: POST /api/auth/login
If not: Check Vercel REACT_APP_API_URL setting
```

### Step 3: Check Firestore
```
Firebase Console → Firestore → users collection
Should see: Document with username=ARUN
If not: Create it manually (see Phase 4)
```

### Step 4: Check CORS
```
DevTools → Console
If CORS error: Render environment CORS_ORIGIN is wrong
Fix: Should be exactly: https://salary-manager-app.vercel.app
```

---

## 📞 Getting Help

If something fails:

1. Read the specific phase guide (see links above)
2. Check the troubleshooting section
3. Check service logs:
   - **Render**: Dashboard → salary-manager-api → Logs
   - **Vercel**: Dashboard → salary-manager-app → Deployments → view logs
   - **Browser**: F12 → Console tab
4. Verify all environment variables are set correctly
5. Try restarting services or redeploying

---

## 🎉 Next Steps After Successful Deployment

Once login is working:

1. Create additional admin users
2. Test employee CRUD operations
3. Test the employee management features
4. Add departments/positions
5. Generate payslips
6. Set up attendance tracking
7. Customize for your organization

---

**Estimated total time: 20-30 minutes**

Ready to start? → Go to [Phase 2: RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
