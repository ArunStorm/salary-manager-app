# Deploying Backend to Render.com

## Quick Overview
This guide walks you through hosting the Node.js backend on Render.com's free tier (750 compute hours/month).

---

## Step 1: Sign Up to Render

1. Go to [render.com](https://render.com)
2. Click **"Sign Up"** in top right
3. Choose **"Sign up with GitHub"** (easier for auto-deployment)
4. Authorize Render to access your GitHub account
5. You'll be redirected to Render dashboard

---

## Step 2: Create a Web Service

1. Click **"+ New"** button (top right)
2. Select **"Web Service"**
3. Under "Connect a repository", search for **salary-manager-app**
4. Click **"Connect"** next to your repo
5. A form will appear with service configuration

---

## Step 3: Configure the Service

Fill in the following fields:

| Field | Value |
|-------|-------|
| **Name** | `salary-manager-api` (or your preferred name) |
| **Environment** | `Node` |
| **Region** | Choose closest to you (e.g., `Oregon`, `Frankfurt`) |
| **Branch** | `main` |
| **Build Command** | (leave empty, Render will use `npm install`) |
| **Start Command** | `npm start` |

---

## Step 4: Add Environment Variables

After filling the basic config, scroll down to **"Environment"** section:

### A. Click "Add Environment Variable"

Add each of these variables:

#### 1. CORS_ORIGIN (for your Vercel frontend)
```
Key: CORS_ORIGIN
Value: https://salary-manager-app.vercel.app
```

#### 2. PORT (optional but recommended)
```
Key: PORT
Value: 5000
```

#### 3. NODE_ENV
```
Key: NODE_ENV
Value: production
```

#### 4. FIREBASE_KEY (Firebase Service Account)

**Important**: You need to convert your `serviceAccountKey.json` to a single-line JSON string.

**Option A: Quick way (Windows PowerShell)**
1. Open PowerShell in server directory
2. Run:
```powershell
(Get-Content serviceAccountKey.json -Raw) | ConvertTo-Json -Compress | Set-Clipboard
```
3. Paste into Render's value field

**Option B: Manual way**
1. Open `server/serviceAccountKey.json` 
2. Copy entire content
3. Go to online tool: [jsoncrush.com](https://jsoncrush.com)
4. Paste JSON, click "Crush"
5. Copy the minified version
6. In Render, add:
```
Key: FIREBASE_KEY
Value: [paste minified JSON here]
```

---

## Step 5: Deploy

1. Click **"Create Web Service"** button (bottom of form)
2. Render will:
   - Build your Node.js app (1-2 mins)
   - Start the server
   - Assign you a URL like `https://salary-manager-api.onrender.com`

3. Wait for status to turn **"Live"** (green)
4. **Copy the service URL** (you'll need it for Vercel)

---

## Step 6: Test Backend (Optional but Recommended)

Open your browser and visit:
```
https://your-service-url.onrender.com/
```

You should see:
```json
{
  "success": true,
  "message": "Salary Management API is running 🚀",
  "timestamp": "2026-04-15T..."
}
```

If you see this, your backend is live! ✅

---

## Troubleshooting

### "Build failed" or "Service failed to start"
1. Check the **"Logs"** tab in Render dashboard
2. Common issues:
   - Missing `npm start` script → Fixed in package.json ✅
   - Firebase credentials invalid → Check FIREBASE_KEY value
   - Port conflicts → Not an issue on Render

### "Failed to initialize Firebase"
1. Double-check FIREBASE_KEY is a valid JSON string
2. Try jsoncrush.com to validate the minified JSON
3. Ensure the JSON has all required fields (type, project_id, private_key, etc.)

### Backend is live but login still fails
1. Check **next section** for Vercel setup
2. Make sure CORS_ORIGIN is set to your exact Vercel URL (case-sensitive)

---

## What's Next?

After your backend is **Live** on Render:
1. Copy the service URL (e.g., `https://salary-manager-api.onrender.com`)
2. Go to [next section: Update Frontend](./FRONTEND_VERCEL_UPDATE.md)
3. Add the backend URL to Vercel environment variables
4. Test login on production

---

## Free Tier Notes

⚠️ **Important**: Render's free tier automatically spins down after 15 minutes of inactivity.
- **First request is slow** (~30 seconds) as the server starts
- This is normal! After spinning up, it's fast
- To keep it awake during testing, make a request every 10 minutes
- For production, consider upgrading to paid tier ($7/month) for always-on

---

## Key Environment Variables Reference

Your Render app needs these to work properly:

```env
# Server
PORT=5000
NODE_ENV=production

# Frontend URL (IMPORTANT: exact URL from Vercel)
CORS_ORIGIN=https://salary-manager-app.vercel.app

# Firebase (minified JSON string from serviceAccountKey.json)
FIREBASE_KEY={...minified JSON...}
```

---

## Firebase Credentials Security

✅ **This is secure because:**
- Firebase credentials in environment variables are never visible in code
- Render encrypts environment variables at rest
- Only your deployed service can access them
- Your local `.env` file stays on your machine

---

## Auto-Deployment

✅ **Auto-deployment is enabled by default**
- Every push to `main` branch triggers a new deploy
- Render rebuilds and restarts your service
- Takes ~1-2 minutes
- You'll see deployment logs in Render dashboard

---

## Support

If you get stuck:
1. Check Render docs: [render.com/docs](https://render.com/docs)
2. Check server logs in Render dashboard → "Logs" tab
3. Verify all environment variables are set correctly
4. Try restarting the service (Dashboard → "Restart" button)
