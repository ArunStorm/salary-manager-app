# Phase 3: Connect Frontend (Vercel) to Backend (Render)

After your backend is **Live** on Render, update your Vercel deployment to use the Render URL.

---

## Step 1: Get Your Render Backend URL

From [render.com](https://render.com):
1. Go to your **salary-manager-api** service dashboard
2. Copy the **Public URL** (e.g., `https://salary-manager-api.onrender.com`)
3. Keep it in your clipboard

---

## Step 2: Update Vercel Environment Variables

1. Go to [vercel.com](https://vercel.com) dashboard
2. Click on your **salary-manager-app** project
3. Go to **Settings** → **Environment Variables**
4. Look for `REACT_APP_API_URL`
   - If it exists: Click to edit it
   - If not: Click **"Add New"** to create it

---

## Step 3: Set the Variable

**Field:** `REACT_APP_API_URL`  
**Value:** `https://your-render-service-url.onrender.com` (exact URL from Step 1)

**Example:**
```
REACT_APP_API_URL=https://salary-manager-api.onrender.com
```

**Environment:** Select all (or at minimum: **Production**)

Click **"Save"**

---

## Step 4: Trigger Redeploy

Your change is saved, but the frontend needs to rebuild with the new environment variable.

### Option A: Automatic Trigger (Easiest)
1. Go to your GitHub repo: [github.com/ArunStorm/salary-manager-app](https://github.com/ArunStorm/salary-manager-app)
2. Go to **Actions** tab
3. Find the latest workflow
4. Click **"Re-run failed jobs"** or **"Re-run all jobs"**
5. Wait for build to complete (2-3 minutes)

### Option B: Manual Trigger
1. In Vercel dashboard → salary-manager-app
2. Scroll to **"Deployments"** section
3. Find the latest deployment
4. Click the **three dots (...)** menu
5. Select **"Redeploy"**
6. Wait for build to complete

### Option C: Push Empty Commit
Open PowerShell and run:
```powershell
cd d:\salary-manager-app
git add .
git commit --allow-empty -m "Trigger redeploy with Render backend URL"
git push origin main
```

---

## Step 5: Verify Deployment

1. In Vercel, wait for status to show **"Ready"** (green checkmark)
2. Go to your live site: **https://salary-manager-app.vercel.app**
3. The page should load normally
4. Try logging in with ARUN/welcome
5. Check browser console (F12) for errors

---

## Expected Result

✅ Login form displays  
✅ No "failed to fetch" errors  
✅ Successfully logs in with ARUN/welcome  
✅ Dashboard displays after login  
✅ Can logout and re-login as different user  

---

## Troubleshooting

### Still getting "failed to fetch"?

1. **Check Render backend is running**
   - Visit `https://your-render-url.onrender.com/` in browser
   - Should see the API health message
   - If not, go back to [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

2. **Check Vercel environment variable was saved**
   - Vercel → Settings → Environment Variables
   - Verify `REACT_APP_API_URL` is there with correct value
   - Verify you redeployed AFTER saving

3. **Check browser cache**
   - Open DevTools (F12)
   - Go to **Network** tab
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Try login again

4. **Check CORS error in console**
   - Open DevTools → **Console** tab
   - Look for error mentioning CORS
   - If you see CORS error, the Render backend's CORS_ORIGIN setting is wrong
   - Go back to Render dashboard → Settings → Environment Variables
   - Check `CORS_ORIGIN=https://salary-manager-app.vercel.app` (exact case)

### Render service is "spinning down"?

This is normal on the free tier. First request takes ~30 seconds as the service starts. Subsequent requests are fast. 

To test:
1. Wait 15 minutes without using the app
2. Try to login
3. First attempt might take 30 seconds
4. That's the service waking up - it's working!

---

## Verification Checklist

Before considering this complete:

- [ ] Render backend status is "Live" (green in dashboard)
- [ ] Vercel `REACT_APP_API_URL` is set to Render URL
- [ ] Vercel deployment status is "Ready" (green checkmark)
- [ ] Browser shows no errors in DevTools Console
- [ ] Can successfully login with ARUN/welcome
- [ ] Dashboard displays after login
- [ ] Can logout and return to login screen
- [ ] Can login again with different credentials

If all checkmarks pass, you're ready for Phase 4!

---

## Next Steps

[→ Phase 4: Test Login & Create Admin User](./TESTING_GUIDE.md)
