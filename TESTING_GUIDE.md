# Phase 4: Test & Create Admin User

After backend is on Render and frontend is updated in Vercel, complete this phase.

---

## Step 1: Test Backend Connection

1. Visit **https://salary-manager-app.vercel.app**
2. You should see the **Login** page with form
3. Open DevTools (F12) → **Network** tab
4. Try login with any credentials (e.g., test/test)
5. In Network tab, you should see:
   - **POST /api/auth/login** request
   - Response shows 401 error (not found in DB yet) - **This is GOOD** ✅
   - No CORS errors or "failed to fetch" - **This is GOOD** ✅

---

## Step 2: Create Admin User in Firestore

The backend is connected, but we need to create the ARUN user in Firestore database.

### Option A: Firebase Console UI (Easiest)

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click your project
3. Go to **Firestore Database** (left sidebar)
4. Click **"Start Collection"**
5. Create collection: `users`
6. Click **"Add Document"**

Enter these fields:

| Field | Type | Value |
|-------|------|-------|
| `username` | String | `ARUN` |
| `password` | String | `welcome` |
| `role` | String | `ADMIN` |
| `userGroup` | String | `ADMIN` |
| `createdAt` | Date/Time | Now |

7. Click **"Save"**

✅ Document created!

### Option B: Using Firebase CLI (Alternative)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Add user document
firebase firestore:delete users/[auto-id] --recursive
```

---

## Step 3: Test Login

1. Visit **https://salary-manager-app.vercel.app**
2. Clear browser cache (Ctrl+Shift+Delete)
3. Enter credentials:
   - **Username:** `ARUN`
   - **Password:** `welcome`
4. Click **Login**

### Expected Result:

✅ Login successful  
✅ Redirected to **Dashboard** page  
✅ Sidebar shows "Admin Settings"  
✅ User name "ARUN" displays in navbar  

### If login fails:

1. Check DevTools → Network tab
   - Look for POST /api/auth/login response
   - Should get status 200 (success)
   - Check response body for errors

2. Check Firestore:
   - Make sure document was created with correct fields
   - Field names are case-sensitive (username not Username)
   - Password is exact match

3. Check Render logs:
   - Go to Render dashboard → salary-manager-api
   - Click "Logs" tab
   - Look for error messages

---

## Step 4: Test Admin Features

After successful login as ARUN:

### Test 1: Access Admin Settings
1. Click **"Admin Settings"** in sidebar
2. Should load page with **"User Management"** component
3. Should see form to create new users

### Test 2: Create Another User

In User Management form:

| Field | Value |
|-------|-------|
| Username | `john` |
| Password | `john123` |
| Role | `EMPLOYEE` |
| User Group | `REGULAR` |

Click **"Create User"**  
Should see success message: "User created successfully"

### Test 3: Logout & Switch User

1. Click user name in navbar → **"Logout"**
2. Should return to **Login** page
3. Login with new user: `john` / `john123`
4. Should see **Dashboard** without Admin Settings

### Test 4: Verify Non-Admin Restrictions

As user `john`:
1. Try to access URL: `/admin-settings`
2. Should see message or redirect (authorization check)

---

## Step 5: Test Employee CRUD (Admin Only)

As ARUN (ADMIN user):

1. Click **Employees** in sidebar
2. Click **"Add Employee"** (or similar button)
3. Fill employee details and save
4. Should see success message
5. Employee should appear in list

As john (EMPLOYEE user):
1. Login as john
2. Click Employees
3. Should see list but NO ADD/EDIT/DELETE buttons
4. If you try to manually POST to backend, should get 403 (Forbidden)

---

## Verification Checklist

Complete all items:

- [ ] Backend URL in Vercel is set to Render URL
- [ ] Vercel deployment shows "Ready" status
- [ ] Login page displays without errors
- [ ] Network request to /api/auth/login completes
- [ ] Admin user ARUN exists in Firestore
- [ ] Can login with ARUN/welcome
- [ ] Dashboard shows "Admin Settings" link
- [ ] Can access Admin Settings page
- [ ] Can create new user in Admin Settings
- [ ] Can logout and login as different user
- [ ] Non-admin users don't see "Admin Settings"
- [ ] Can create employees (ADMIN only)
- [ ] Cannot create employees (non-admin users)

---

## Troubleshooting

### "Invalid username or password" on login

**Check:**
1. Firestore document exists with exact field names
2. Username is `ARUN`, not `arun` (case-sensitive)
3. Password is `welcome`, exactly
4. Did you save the Firestore document?

**Fix:**
- Add console.log in backend near line 30 in `server/routes/auth.js`:
  ```javascript
  console.log('Looking for user:', username);
  console.log('Snapshot empty:', userSnapshot.empty);
  ```
- Check Render logs for these messages

### "failed to fetch" on login

**Check:**
1. Is Render backend showing "Live" in dashboard?
2. Can you visit the Render URL directly in browser?
3. Is CORS_ORIGIN in Render environment variables set correctly?

**Fix:**
- Verify CORS_ORIGIN: `https://salary-manager-app.vercel.app` (exact case)
- Restart service in Render dashboard

### Admin Settings not showing after login

**Check:**
1. Is user role `ADMIN` in Firestore?
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check DevTools → Console for JavaScript errors

**Fix:**
- Edit user in Firestore: ensure role = "ADMIN"
- Hard refresh (Ctrl+Shift+R)

---

## Production Deployment Summary

You now have:

✅ Backend running on Render.com (auto-scales, auto-deploys from GitHub)  
✅ Frontend on Vercel.com (auto-deploys on push)  
✅ Database on Firebase Firestore (scalable, serverless)  
✅ Role-based access control (ADMIN vs EMPLOYEE)  
✅ Secure authentication with Bearer tokens  

**All with free tier services!**

---

## Monitoring & Maintenance

### Regular Checks:

1. **Render Dashboard**: Check service status weekly
2. **Vercel Dashboard**: Monitor deployment logs
3. **Firebase Firestore**: Check data usage (very low cost)

### If Something Breaks:

1. Check Render logs first
2. Check Vercel deployment logs
3. Check browser DevTools Console
4. Verify environment variables are correct
5. Restart Render service or redeploy Vercel

---

## Next Steps

Continue with:
- Add more admin users
- Test all CRUD operations
- Add more employees
- Generate payslips
- Test other features

For any issues: Check [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) and [VERCEL_SETUP.md](./VERCEL_SETUP.md) troubleshooting sections.
