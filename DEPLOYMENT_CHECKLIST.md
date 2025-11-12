# 🚀 Quick Deployment Checklist

## Before Building:

### 1. Update Environment Files

**Client** (`client/.env.production`):
```bash
VITE_API_BASE_URL=https://your-actual-domain.com:8081
# Or subdomain: https://api.your-domain.com
```

**Server** (`server/.env.production`):
```bash
# Update CORS_ORIGIN to your domain
CORS_ORIGIN=https://your-actual-domain.com

# Change JWT_SECRET to a strong random string
JWT_SECRET=generate-a-strong-random-key-here
```

---

## Build Production Files:

```bash
# Run build script
./build-production.sh

# Or manually:
cd client && npm install && npm run build
cd ../server && npm install --production
```

---

## Upload to cPanel:

### Frontend (client/dist → public_html):
```
Upload these files to public_html/:
✓ index.html
✓ assets/ folder
✓ vite.svg
✓ .htaccess (from client folder)
```

### Backend (server → shilp-api):
```
Upload to /home/username/shilp-api/:
✓ src/ folder
✓ package.json
✓ .env (copy from .env.production and update)
✓ uploads/ folder (create empty)
```

---

## cPanel Configuration:

### 1. Setup Node.js App:
- Path: `/home/username/shilp-api`
- Entry: `src/server.js`
- Port: `8081`
- Mode: `Production`
- Node: `18.x+`

### 2. Install Dependencies:
```bash
cd /home/username/shilp-api
npm install --production
```

### 3. Create Upload Folders:
```bash
mkdir -p uploads/projects uploads/banners uploads/blogs
chmod 755 uploads uploads/projects uploads/banners uploads/blogs
```

### 4. Start Application:
- Click "Start App" in cPanel Node.js interface

---

## SSL Certificate:

1. cPanel → SSL/TLS Status
2. Run AutoSSL for your domain
3. Wait 5-10 minutes

---

## Test Deployment:

### Backend Test:
```bash
curl https://your-domain.com:8081/api/health
# Should return: {"status":"ok"}
```

### Frontend Test:
1. Open: https://your-domain.com
2. Login page should load
3. No console errors

### Upload Test:
1. Login to admin
2. Upload a banner image
3. Verify image displays

---

## Common Issues & Fixes:

### "Cannot connect to API":
- Check Node.js app is running in cPanel
- Verify API URL in client build matches server domain
- Check firewall allows port 8081

### "CORS Error":
- Update CORS_ORIGIN in server .env
- Restart Node.js application
- Clear browser cache

### "Images not loading":
- Check uploads folder permissions (755)
- Verify image paths start with /uploads/
- Check .htaccess allows static files

### "500 Internal Error":
- Check Node.js app logs in cPanel
- Verify .env file exists and has correct values
- Check database connection string

---

## Post-Deployment:

- [ ] Test admin login
- [ ] Test banner upload/delete
- [ ] Test project create/edit
- [ ] Test blog create/edit
- [ ] Check mobile responsiveness
- [ ] Monitor error logs
- [ ] Setup automated backups

---

## Quick Update Process:

```bash
# 1. Build new version locally
./build-production.sh

# 2. Upload changed files to cPanel
# - Frontend: Upload client/dist/* to public_html/
# - Backend: Upload changed files in server/src/

# 3. Restart Node.js app in cPanel
# Click "Restart" button

# Done! ✅
```

---

## Support Files:

- Full Guide: `DEPLOYMENT_GUIDE.md`
- Build Script: `build-production.sh`
- .htaccess: `client/.htaccess`
- Env Templates: `.env.production` files

---

## 📞 Need Help?

Check logs:
- cPanel → Node.js App → View Logs
- Browser Console (F12)
- cPanel Error Logs

Your app is ready to go live! 🎉
