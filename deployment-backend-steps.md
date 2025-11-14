# Backend Deployment Steps - Shilp Group

## 🎯 Domain: mail.shilpgroup.com

## 🚀 Upload Backend Files to cPanel:

### A) Upload Files:
1. **File Manager** में जाएं
2. Navigate to: `/home/username/mail.shilpgroup.com/`
3. Upload ये files/folders from `server/`:
   ```
   ✅ src/ (complete folder with all subfolders)
   ✅ package.json
   ✅ package-lock.json
   ```

### B) Create Environment File:
File Manager में new file बनाएं: `.env`

Content:
```env
# Environment
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=mongodb+srv://shilpgroup47_db_user:vQ9tE9XlbMCcEZUC@cluster0.chfkuy8.mongodb.net/?appName=adminshilp
DATABASE_NAME=shilpadmin

# JWT
JWT_SECRET=dfgdfgdfgdgdgdgdfgd-ghgfhfhfgh5gtr5yrhyeyye5e
JWT_EXPIRES_IN=7d

# CORS - Production domains
CORS_ORIGIN=https://admin.shilpgroup.com,https://shilpgroup.com

# Rate Limiting (disabled for unlimited requests)
# RATE_LIMIT_WINDOW_MS=900000
# RATE_LIMIT_MAX_REQUESTS=unlimited

# Logging
LOG_LEVEL=info
```

## ⚙️ Setup Node.js Application:

### In cPanel:
1. Go to **Software** → **Setup Node.js App**
2. Click **Create Application**
3. Configure:
   ```
   Node.js version: 18.x या latest
   Application mode: Production
   Application root: mail.shilpgroup.com
   Application startup file: src/server.js
   ```
4. Click **Create**

### Install Dependencies:
1. Application बनने के बाद **Open App Terminal** click करें
2. Run: `npm install`

## 🔄 Start Application:
1. Application settings में जाकर **Restart App** करें
2. या Terminal में: `npm start`

## ✅ Backend Test करें:
- Test API: `https://mail.shilpgroup.com/api/health`
- Expected response: `{"status": "OK", "timestamp": "..."}`

## 🔧 Important Notes:
- अगर आपको Node.js app option नहीं दिखता तो hosting provider से contact करें
- Some shared hosting providers don't support Node.js
- Alternative: Use services like Railway, Render, or Heroku for backend