# 📋 Deployment Checklist - Shilp Group

## 🎯 Domains:
- **Frontend**: admin.shilpgroup.com
- **Backend**: mail.shilpgroup.com

## ✅ Pre-Deployment:
- [x] Production build completed 
- [x] Admin user created (shilpgroup47@gmail.com)
- [x] MongoDB connection working
- [x] Domain configuration removed from hardcode
- [ ] DNS configured for both subdomains

## 📱 Frontend Deployment:
- [ ] Subdomain configured: `admin.shilpgroup.com`
- [ ] Files uploaded from `client/dist/` to subdomain folder
- [ ] `.htaccess` file created for React routing
- [ ] Test: `https://admin.shilpgroup.com` loads correctly

## 🚀 Backend Deployment:
- [ ] Subdomain configured: `mail.shilpgroup.com` 
- [ ] Files uploaded from `server/` (src/, package.json)
- [ ] `.env` file created with production settings
- [ ] Node.js app configured in cPanel
- [ ] Dependencies installed (`npm install`)
- [ ] App started/restarted
- [ ] Test: `https://mail.shilpgroup.com/api/health`

## 🔧 Configuration Updates:

### ✅ Already Configured:
- Client API URL: Uses environment variables
- Server CORS: Updated with production domains
- Environment files: `.env.production` ready

## 🧪 Testing:
1. [ ] Frontend loads: `https://admin.shilpgroup.com`
2. [ ] API responds: `https://mail.shilpgroup.com/api/health`
3. [ ] Login works with: `shilpgroup47@gmail.com`
4. [ ] Admin panel functions working
5. [ ] File uploads working (images, etc.)

## 🆘 Troubleshooting:

### Common Issues:
1. **CORS Error**: Check CORS_ORIGIN in `.env`
2. **API Not Found**: Verify Node.js app is running
3. **Database Connection**: Check MongoDB Atlas network access
4. **File Upload Fails**: Check folder permissions (755 or 777)

### cPanel Specific:
- Some shared hosting doesn't support Node.js
- Alternative: Deploy backend to Railway/Render/Heroku
- Use cPanel only for frontend (static files)

## 📞 Support:
- Check cPanel documentation for Node.js setup
- Contact hosting provider if Node.js not available
- MongoDB Atlas connection should work from anywhere

---
**Note**: All domain configurations are now properly set up using environment variables. No hardcoded URLs remaining.