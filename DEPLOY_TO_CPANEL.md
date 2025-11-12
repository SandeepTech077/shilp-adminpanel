# 🚀 Deployment Instructions for Shilp Group

## ✅ URLs Configuration:
- **Frontend (Admin Panel)**: `https://admin.shilpgroup.com`
- **Frontend (Main Site)**: `https://shilpgroup.com`
- **Backend (API Server)**: `https://mail.shilpgroup.com`
- **Database**: MongoDB Atlas (Cloud)

## ✅ Configuration Already Done:
- Client API URL: `https://mail.shilpgroup.com`
- CORS: Both `admin.shilpgroup.com` and `shilpgroup.com` allowed
- Environment files configured

---

## 📦 Step 1: Build Production Files

```bash
# Run from project root
./build-production.sh
```

This will:
- Build client → `client/dist/`
- Install server production dependencies

---

## 📤 Step 2: Upload to cPanel

### Login to cPanel:
- URL: Your cPanel login URL
- Username: Your cPanel username
- Password: Your cPanel password

### A) Upload Frontend (Client):

1. Go to **File Manager** in cPanel
2. Navigate to subdomain root: `/home/username/admin.shilpgroup.com/` or `/public_html/admin/`
   - (cPanel creates this folder when you add subdomain)
3. Upload ALL files from `client/dist/` folder:
   ```
   ✓ index.html
   ✓ assets/ (entire folder)
   ✓ vite.svg
   ```
4. Upload `.htaccess` from `client/` folder

**Your frontend structure should look like:**
```
/home/username/admin.shilpgroup.com/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
├── vite.svg
└── .htaccess
```

### B) Upload Backend (Server):

1. Backend will be on **mail.shilpgroup.com** subdomain
2. In cPanel File Manager, navigate to: `/home/username/mail.shilpgroup.com/`
   - (If subdomain folder doesn't exist, create subdomain first)
3. Upload these server files:
   ```
   ✓ src/ (entire folder with all subfolders)
   ✓ package.json
   ✓ package-lock.json
   ```
4. Create `.env` file (copy content from `.env.production` and rename)

**Your backend structure should look like:**
```
/home/username/mail.shilpgroup.com/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   └── server.js
├── package.json
├── package-lock.json
└── .env
```

---

## 🔧 Step 3: Setup Node.js Application

### In cPanel:

1. Go to **Software** → **Setup Node.js App**
2. Click **Create Application**
3. Configure:
   ```
   Node.js version: 18.x or higher
   Application mode: Production
   Application root: /home/username/mail.shilpgroup.com
   Application URL: mail.shilpgroup.com
   Application startup file: src/server.js
   ```
4. Click **Create**

### Install Dependencies:

After app is created:
1. Click **Run NPM Install** button
   OR
2. Use Terminal (if available):
   ```bash
   cd /home/username/mail.shilpgroup.com
   npm install --production
   ```

---

## 📁 Step 4: Create Upload Folders

Using **Terminal** in cPanel or **File Manager**:

```bash
cd /home/username/mail.shilpgroup.com
mkdir -p uploads/projects uploads/banners uploads/blogs
chmod 755 uploads uploads/projects uploads/banners uploads/blogs
```

**Or in File Manager:**
1. Go to `/home/username/mail.shilpgroup.com/`
2. Create folder: `uploads`
3. Inside `uploads`, create: `projects`, `banners`, `blogs`
4. Right-click each folder → Permissions → Set to `755`

---

## 🔐 Step 5: Verify .env File

Edit `/home/username/mail.shilpgroup.com/.env` and verify:

```env
NODE_ENV=production
PORT=8081

DATABASE_URL=mongodb+srv://jayrajsinhjadavharichtech_db_user:9MvwZLBGlNnYkoft@cluster1.i32wuv3.mongodb.net/shilpadmin
DATABASE_NAME=shilpadmin

JWT_SECRET=hdjshdjshdjshjds-sadsjadhshdkjahsjkdhaskdhjaskdkasdksadas
JWT_EXPIRES_IN=7d

CORS_ORIGIN=https://admin.shilpgroup.com,https://shilpgroup.com

LOG_LEVEL=error
UPLOAD_DIR=uploads
```

**⚠️ Important:** Multiple CORS origins are comma-separated!

---

## 🚀 Step 6: Start Application

In cPanel Node.js App interface:
1. Find your app (mail.shilpgroup.com)
2. Click **Start App** button
3. Wait for "Running" status

---

## 🔒 Step 7: Enable SSL Certificate

### Using cPanel SSL:

1. Go to **Security** → **SSL/TLS Status**
2. Find all domains:
   - `admin.shilpgroup.com`
   - `mail.shilpgroup.com`
   - `shilpgroup.com`
3. Click **Run AutoSSL** for each
4. Wait 5-10 minutes for certificates to install

**Or Let's Encrypt:**
- Most cPanel installations have this built-in
- Automatically activates for subdomains

---

## 🌐 Step 8: Configure Subdomains (if not done)

Create these subdomains in cPanel:

### 1. Admin Panel Subdomain:
1. Go to **Domains** → **Subdomains**
2. Create subdomain:
   ```
   Subdomain: admin
   Domain: shilpgroup.com
   Document Root: /home/username/admin.shilpgroup.com
   ```
3. Click **Create**

### 2. API/Mail Subdomain:
1. Create subdomain:
   ```
   Subdomain: mail
   Domain: shilpgroup.com
   Document Root: /home/username/mail.shilpgroup.com
   ```
2. Click **Create**

---

## ✅ Step 9: Test Your Deployment

### Test Backend API:
```bash
curl https://mail.shilpgroup.com/api/health
```
Should return: `{"status":"ok","timestamp":"..."}`

### Test Frontend (Admin):
1. Open browser: `https://admin.shilpgroup.com`
2. Should see login page
3. No errors in browser console (F12)

### Test Login:
1. Login with admin credentials
2. Test banner upload
3. Test project creation
4. Verify images load correctly

---

## 🐛 Troubleshooting

### Backend Not Accessible:
1. Check Node.js app is running in cPanel
2. Verify `mail.shilpgroup.com` subdomain exists
3. Check SSL certificate is installed
4. Test API endpoint: `https://mail.shilpgroup.com/api/health`

### CORS Errors:
- Verify `.env` has both domains: `CORS_ORIGIN=https://admin.shilpgroup.com,https://shilpgroup.com`
- No spaces after commas in CORS_ORIGIN
- Restart Node.js app after changing .env
- Clear browser cache

### Images Not Loading:
- Check upload folder permissions (755)
- Verify path: `/uploads/projects/...`
- Check `.htaccess` doesn't block uploads

### 404 on Routes:
- Verify `.htaccess` is uploaded
- Check RewriteEngine On
- Clear browser cache

---

## 📊 After Deployment Checklist

- [ ] Frontend loads: https://admin.shilpgroup.com ✓
- [ ] Backend responds: https://admin.shilpgroup.com:8081/api/health ✓
- [ ] SSL certificate active (HTTPS) ✓
- [ ] Admin login works ✓
- [ ] Banner upload/delete works ✓
- [ ] Project create/edit works ✓
- [ ] Blog create/edit works ✓
- [ ] Images display correctly ✓
- [ ] No console errors ✓
- [ ] Mobile responsive ✓

---

## 🔄 Quick Update Process

When you need to update:

```bash
# 1. Build locally
./build-production.sh

# 2. Upload to cPanel
# - Frontend: Upload client/dist/* to admin.shilpgroup.com folder
# - Backend: Upload changed files to /shilp-api/src/

# 3. Restart Node.js app
# cPanel → Node.js App → Restart

# Done! ✅
```

---

## 📞 Support

**Common Commands:**
```bash
# Check Node.js app status
# cPanel → Node.js App → View status

# View logs
# cPanel → Node.js App → View Logs

# Restart app
# cPanel → Node.js App → Restart
```

**Your URLs:**
- Admin Panel: https://admin.shilpgroup.com
- Main Site: https://shilpgroup.com  
- Backend API: https://mail.shilpgroup.com
- API Health: https://mail.shilpgroup.com/api/health

---

## 🎉 You're Ready!

Your admin panel is now live at: **https://admin.shilpgroup.com**

Database is already configured (MongoDB Atlas), so no additional database setup needed!
