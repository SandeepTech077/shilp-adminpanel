# 🚀 Complete cPanel Deployment Guide - Shilp Admin Panel

## 🎯 Target Domains:
- **Frontend (Admin Panel)**: admin.shilpgroup.com
- **Backend (API Server)**: mail.shilpgroup.com
- **Database**: MongoDB Atlas (Already configured)

## ⚡ Quick Start - One Command Deploy

```bash
# Run this single command to prepare everything
./auto-deploy.sh
```

---

## 📦 Step 1: Build Production Files

```bash
# From project root directory
cd /path/to/shilp-adminpanel
./build-production.sh
```

**यह करेगा:**
- Client build → `client/dist/`
- Server production dependencies install
- Production files ready

---

## 🌐 Step 2: cPanel Setup

### A) Subdomains बनाएं:

1. **cPanel Login** करें
2. **Subdomains** section में जाएं
3. Create करें:
   ```
   ✅ admin.shilpgroup.com → /public_html/admin/
   ✅ mail.shilpgroup.com → /home/username/mail.shilpgroup.com/
   ```

### B) DNS Verification:
- Wait 5-10 minutes for DNS propagation
- Test: `ping admin.shilpgroup.com`

---

## 📱 Step 3: Frontend Deployment

### Upload Files:
1. **cPanel File Manager** खोलें
2. Navigate to: `/public_html/admin/`
3. Upload these files from `client/dist/`:
   ```
   ✅ index.html
   ✅ assets/ (complete folder)
   ✅ vite.svg
   ✅ chunks/ (if exists)
   ```

### Create .htaccess:
File Manager में new file: `.htaccess`
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css application/xml application/xhtml+xml application/rss+xml application/javascript application/x-javascript
</IfModule>
```

### Test Frontend:
- Open: `https://admin.shilpgroup.com`
- Should show login page

---

## 🚀 Step 4: Backend Deployment

### A) Upload Server Files:
1. Navigate to: `/home/username/mail.shilpgroup.com/`
2. Upload from `server/`:
   ```
   ✅ src/ (complete folder with all subfolders)
   ✅ package.json
   ✅ package-lock.json
   ```

### B) Create .env File:
File Manager में new file: `.env`
```env
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=mongodb+srv://shilpgroup47_db_user:vQ9tE9XlbMCcEZUC@cluster0.chfkuy8.mongodb.net/?appName=adminshilp
DATABASE_NAME=shilpadmin

# JWT
JWT_SECRET=dfgdfgdfgdgdgdgdfgd-ghgfhfhfgh5gtr5yrhyeyye5e
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://admin.shilpgroup.com,https://shilpgroup.com

# Logging
LOG_LEVEL=info
```

### C) Setup Node.js App:
1. **cPanel** → **Software** → **Setup Node.js App**
2. **Create Application**:
   ```
   Node.js version: 18.x या latest
   Application mode: Production
   Application root: mail.shilpgroup.com
   Application startup file: src/server.js
   Application URL: https://mail.shilpgroup.com
   ```
3. **Create** button click करें

### D) Install Dependencies:
1. Application बनने के बाद **Open App Terminal**
2. Run commands:
   ```bash
   npm install
   npm start
   ```

### E) Create uploads Directory:
```bash
mkdir -p uploads/banners
mkdir -p uploads/blogs  
mkdir -p uploads/projects
mkdir -p uploads/projecttree
chmod 755 uploads/
chmod 755 uploads/*
```

---

## 🧪 Step 5: Testing

### Frontend Test:
1. Open: `https://admin.shilpgroup.com`
2. Should load login page
3. Check console for errors

### Backend Test:
1. Test API: `https://mail.shilpgroup.com/api/health`
2. Expected response: `{"status": "OK", "timestamp": "..."}`

### Login Test:
```
Email: shilpgroup47@gmail.com
Password: ShilpGroup@RealState11290
```

### Full Integration Test:
1. Login to admin panel
2. Try uploading an image
3. Create a test blog/project
4. Verify data saves

---

## 🔧 Troubleshooting

### Common Issues:

#### 1. **Frontend Loading Issues:**
```
❌ Blank page → Check .htaccess file
❌ Assets not loading → Check file paths
❌ CORS errors → Check backend CORS settings
```

#### 2. **Backend Issues:**
```
❌ API not responding → Check Node.js app status
❌ Database errors → Check MongoDB connection
❌ Permission errors → Check uploads folder permissions
```

#### 3. **File Upload Issues:**
```bash
# Set correct permissions
chmod 755 uploads/
chmod 755 uploads/*
chown username:username uploads/
```

#### 4. **Node.js App Issues:**
- **Restart App**: cPanel → Node.js Apps → Restart
- **Check Logs**: Application logs में errors check करें
- **Port Issues**: Make sure PORT=3000 in .env

---

## 🔄 Future Updates

### Quick Update Process:
```bash
# 1. Make changes locally
# 2. Build production
./build-production.sh

# 3. Upload only changed files via File Manager
# 4. Restart Node.js app if backend changes
```

---

## 📞 Support

### Hosting Provider:
- Contact if Node.js support not available
- Request subdomain setup help
- Ask for file permission assistance

### Alternative Backend Hosting:
If cPanel doesn't support Node.js:
- Use Railway.app (free tier)
- Use Render.com (free tier)
- Use Heroku (paid)

Update client API URL accordingly.

---

## ✅ Deployment Checklist

- [ ] Production build completed
- [ ] Subdomains created in cPanel
- [ ] Frontend files uploaded to `/public_html/admin/`
- [ ] .htaccess file created
- [ ] Backend files uploaded to `/home/username/mail.shilpgroup.com/`
- [ ] .env file created with correct settings
- [ ] Node.js app created and configured
- [ ] Dependencies installed
- [ ] uploads directories created with permissions
- [ ] Frontend loads: https://admin.shilpgroup.com
- [ ] Backend responds: https://mail.shilpgroup.com/api/health
- [ ] Login works with admin credentials
- [ ] File uploads work
- [ ] All admin features tested