# 🚀 cPanel Deployment Guide - Shilp Admin Panel

## 📋 Pre-Deployment Checklist

### ✅ Already Done:
- [x] Removed all console.log from client & server
- [x] Environment variables configured
- [x] Database connection ready (MongoDB Atlas)
- [x] API endpoints tested

## 🔧 Step 1: Build Production Files

### Client Build:
```bash
cd client
npm run build
```
This will create a `dist` folder with optimized production files.

### Server Preparation:
Server code is already production-ready. No build needed for Node.js backend.

---

## 📤 Step 2: Upload to cPanel

### Option A: File Manager Upload

#### **Upload Client (Frontend):**
1. Go to cPanel → File Manager
2. Navigate to `public_html` (or your domain's root folder)
3. Upload entire `client/dist` folder contents
4. Directory structure:
   ```
   public_html/
   ├── index.html
   ├── assets/
   │   ├── index-[hash].js
   │   └── index-[hash].css
   └── vite.svg
   ```

#### **Upload Server (Backend):**
1. Create a folder outside `public_html`: 
   - Example: `/home/username/shilp-api` or `api` folder
2. Upload these server files:
   ```
   shilp-api/
   ├── src/
   ├── uploads/
   ├── package.json
   ├── .env
   └── node_modules/ (install on server)
   ```

### Option B: Git Deployment (Recommended)
```bash
# On your cPanel terminal (if available)
cd /home/username/
git clone https://github.com/SandeepTech077/shilp-adminpanel.git
cd shilp-adminpanel/server
npm install --production
```

---

## 🔐 Step 3: Environment Configuration

### Create `.env` file on server:

**Location:** `/home/username/shilp-api/.env`

```env
# Environment
NODE_ENV=production
PORT=8081

# Database (Your MongoDB Atlas URL)
DATABASE_URL=mongodb+srv://jayrajsinhjadavharichtech_db_user:9MvwZLBGlNnYkoft@cluster1.i32wuv3.mongodb.net/shilpadmin
DATABASE_NAME=shilpadmin

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024-shilp-group-secure
JWT_EXPIRES_IN=7d

# CORS (Your actual domain)
CORS_ORIGIN=https://yourdomain.com

# Logging
LOG_LEVEL=error
```

**⚠️ IMPORTANT:** 
- Change `JWT_SECRET` to a strong random string
- Update `CORS_ORIGIN` to your actual domain

---

## 🌐 Step 4: Setup Node.js Application in cPanel

### Using cPanel "Setup Node.js App":

1. **Go to:** cPanel → Software → Setup Node.js App
2. **Click:** Create Application
3. **Configure:**
   - Node.js version: `18.x` or higher
   - Application mode: `Production`
   - Application root: `/home/username/shilp-api`
   - Application URL: `yourdomain.com` or subdomain like `api.yourdomain.com`
   - Application startup file: `src/server.js`
   - Environment variables: Add from `.env` file

4. **Click:** Create

5. **Install Dependencies:**
   - After creating app, click "Run NPM Install"
   - Or use terminal:
     ```bash
     cd /home/username/shilp-api
     npm install --production
     ```

6. **Start Application:**
   - Click "Start App" in cPanel interface

---

## 🔄 Step 5: Configure .htaccess for Client

### For React Router (History Mode):

**Location:** `public_html/.htaccess`

```apache
# React Router Support
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  
  # Rewrite everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>

# CORS Headers for API calls
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
  Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>

# Gzip Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
</IfModule>
```

---

## 🔧 Step 6: Update Client API Configuration

### Update API URL in production build:

**Before building client, update:** `client/.env.production`

```env
VITE_API_BASE_URL=https://yourdomain.com:8081
# OR if using subdomain:
VITE_API_BASE_URL=https://api.yourdomain.com
```

Then rebuild:
```bash
cd client
npm run build
```

---

## 🌍 Step 7: Domain/Subdomain Setup

### Option A: Same Domain (Recommended)
- Frontend: `https://yourdomain.com`
- Backend: `https://yourdomain.com:8081`

### Option B: Subdomain
1. Create subdomain in cPanel: `api.yourdomain.com`
2. Point to backend folder: `/home/username/shilp-api`
3. Update CORS settings

---

## 🔒 Step 8: SSL Certificate

1. **Go to:** cPanel → Security → SSL/TLS Status
2. **Select:** Your domain
3. **Click:** Run AutoSSL
4. Wait for certificate installation

**OR use Let's Encrypt:**
- Most cPanel installations have this built-in
- Free SSL certificate

---

## 🗂️ Step 9: Upload Folder Permissions

Set correct permissions for uploads folder:

```bash
chmod 755 /home/username/shilp-api/uploads
chmod 755 /home/username/shilp-api/uploads/projects
chmod 755 /home/username/shilp-api/uploads/banners
chmod 755 /home/username/shilp-api/uploads/blogs
```

Or in cPanel File Manager: Right-click folder → Change Permissions → 755

---

## 🔍 Step 10: Testing

### Test Backend:
```bash
curl https://yourdomain.com:8081/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Test Frontend:
1. Open: `https://yourdomain.com`
2. Try login page
3. Check browser console for errors

### Test Image Uploads:
1. Login to admin panel
2. Upload a banner image
3. Verify image displays correctly

---

## 🐛 Troubleshooting

### Backend Not Starting:
1. Check Node.js app logs in cPanel
2. Verify `.env` file exists and is correct
3. Check database connection string
4. Ensure port 8081 is not blocked

### CORS Errors:
1. Update `CORS_ORIGIN` in `.env`
2. Restart Node.js application
3. Clear browser cache

### Images Not Loading:
1. Check upload folder permissions (755)
2. Verify image paths in database
3. Check `.htaccess` allows static file access

### Build Errors:
```bash
# Client build issues
cd client
rm -rf node_modules package-lock.json
npm install
npm run build

# Server issues
cd server
rm -rf node_modules package-lock.json
npm install --production
```

---

## 📊 Performance Optimization

### Enable Node.js Application Manager:
1. Use PM2 or Forever for process management
2. Auto-restart on crashes
3. Load balancing

### CDN Setup:
1. Use Cloudflare for static assets
2. Cache images and CSS/JS files

---

## 🔄 Future Deployments

### Quick Update Process:
```bash
# Update client
cd client
npm run build
# Upload dist folder to public_html

# Update server
cd server
# Upload changed files
# Restart Node.js app in cPanel
```

### Git-based Updates:
```bash
cd /home/username/shilp-adminpanel
git pull origin main
cd server
npm install --production
# Restart app
```

---

## 📞 Support Checklist

- [ ] Database accessible from server IP
- [ ] Node.js version 18+ installed
- [ ] SSL certificate active
- [ ] CORS configured correctly
- [ ] Upload folders writable
- [ ] Environment variables set
- [ ] Backend API responding
- [ ] Frontend loading correctly
- [ ] Image uploads working
- [ ] Admin login functional

---

## 🎯 Final Verification

### Test These Features:
1. ✅ Admin Login
2. ✅ Banner Upload/Delete
3. ✅ Project Create/Edit/Delete
4. ✅ Blog Create/Edit/Delete
5. ✅ Image Uploads
6. ✅ Image Deletion
7. ✅ Form Validation
8. ✅ API Response Times

---

## 📝 Important Files Summary

### Client (Frontend):
- Build output: `client/dist/`
- Upload to: `public_html/`
- Config: `.htaccess`

### Server (Backend):
- Application: `server/src/`
- Upload to: `/home/username/shilp-api/`
- Config: `.env`
- Entry point: `src/server.js`

### Database:
- Type: MongoDB Atlas (Cloud)
- No server setup needed
- Already configured

---

## 🚀 You're Ready to Deploy!

Follow steps 1-10 in order, and your application will be live! 🎉
