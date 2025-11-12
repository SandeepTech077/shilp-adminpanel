# 🚀 Production URLs Summary

## Live URLs:

### Frontend:
- **Admin Panel**: https://admin.shilpgroup.com
- **Main Website**: https://shilpgroup.com

### Backend:
- **API Server**: https://mail.shilpgroup.com
- **Health Check**: https://mail.shilpgroup.com/api/health

### Database:
- **MongoDB Atlas** (Cloud-hosted)
- Connection configured in `.env`

---

## Configuration Files:

### Client (.env.production):
```env
VITE_API_BASE_URL=https://mail.shilpgroup.com
VITE_IMAGE_BASE_URL=https://admin.shilpgroup.com
```

### Server (.env.production):
```env
CORS_ORIGIN=https://admin.shilpgroup.com,https://shilpgroup.com
DATABASE_URL=mongodb+srv://...
PORT=8081
```

---

## Deployment Structure:

```
cPanel File Structure:
├── /public_html/                    # Main website (shilpgroup.com)
├── /admin.shilpgroup.com/           # Admin panel frontend
│   ├── index.html
│   ├── assets/
│   └── .htaccess
└── /mail.shilpgroup.com/            # Backend API
    ├── src/
    ├── uploads/
    ├── package.json
    └── .env
```

---

## Quick Build & Deploy:

```bash
# 1. Build production files
./build-production.sh

# 2. Upload to cPanel
# - client/dist/* → /admin.shilpgroup.com/
# - server/* → /mail.shilpgroup.com/

# 3. Configure & Start Node.js app in cPanel

# 4. Test
curl https://mail.shilpgroup.com/api/health
```

---

## Support Domains:

Both these domains can access the admin panel:
- ✅ admin.shilpgroup.com (primary)
- ✅ shilpgroup.com (allowed via CORS)

---

For detailed deployment steps, see: **DEPLOY_TO_CPANEL.md**
