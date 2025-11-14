# 🎯 Separate Server & Client Deployment - cPanel Setup

## 🏗️ Architecture (cPanel Only):
- **Client (Frontend)**: cPanel - admin.shilpgroup.com
- **Server (Backend)**: cPanel - mail.shilpgroup.com (separate subdomain)
- **Database**: MongoDB Atlas (already configured)
- **Git Push**: Automatic deployment to both places via GitHub Actions

---

## 🚀 cPanel Separate Deployment Setup

### Step 1: cPanel Subdomains Configuration

1. **Frontend Subdomain**:
   ```
   Subdomain: admin
   Domain: shilpgroup.com
   Document Root: /home/shilfmfe/public_html/admin.shilpgroup.com
   ```

2. **Backend Subdomain**:
   ```
   Subdomain: mail
   Domain: shilpgroup.com  
   Document Root: /home/shilfmfe/mail.shilpgroup.com
   ```

### Step 2: Node.js App Setup (Backend Only)

1. **cPanel** → **Software** → **Setup Node.js App**
2. **Create Application**:
   ```
   Node.js version: 18.x या latest
   Application mode: Production
   Application root: mail.shilpgroup.com
   Application startup file: src/server.js
   Application URL: https://mail.shilpgroup.com
   ```

### Step 3: Environment Variables (Backend)

Create `.env` in `/home/shilfmfe/mail.shilpgroup.com/`:
```env
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=mongodb+srv://shilpgroup47_db_user:vQ9tE9XlbMcEZUC@cluster0.chfkuy8.mongodb.net/?appName=adminshilp
DATABASE_NAME=shilpadmin

# JWT
JWT_SECRET=dfgdfgdfgdgdgdgdfgd-ghgfhfhfgh5gtr5yrhyeyye5e
JWT_EXPIRES_IN=7d

# CORS - Allow frontend domain
CORS_ORIGIN=https://admin.shilpgroup.com,https://shilpgroup.com

# Logging
LOG_LEVEL=info
```

---

## 🔧 Step 4: GitHub Actions for Separate Deployment

Create separate workflows for frontend and backend:

### Frontend-Only Deployment Workflow

Create `.github/workflows/deploy-frontend.yml`:
```yaml
name: Deploy Frontend to cPanel

on:
  push:
    branches: [ main ]
    paths: [ 'client/**' ]
  workflow_dispatch:

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache-dependency-path: client/package-lock.json
    
    - name: Build Frontend
      working-directory: ./client
      run: |
        npm ci
        npm run build
    
    - name: Deploy Frontend via FTP
      uses: SamKirkland/FTP-Deploy-Action@v4.3.4
      with:
        server: ${{ secrets.FTP_SERVER }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./client/dist/
        server-dir: /home/shilfmfe/public_html/admin.shilpgroup.com/
        exclude: |
          **/.git*
          **/.git*/**
```

### Backend-Only Deployment Workflow

Create `.github/workflows/deploy-backend.yml`:
```yaml
name: Deploy Backend to cPanel

on:
  push:
    branches: [ main ]
    paths: [ 'server/**' ]
  workflow_dispatch:

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache-dependency-path: server/package-lock.json
    
    - name: Prepare Backend
      working-directory: ./server
      run: |
        npm ci --omit=dev
        cp .env.production .env
    
    - name: Deploy Backend via FTP
      uses: SamKirkland/FTP-Deploy-Action@v4.3.4
      with:
        server: ${{ secrets.FTP_SERVER }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./server/
        server-dir: /home/shilfmfe/mail.shilpgroup.com/
        exclude: |
          **/.git*
          **/.git*/**
          **/node_modules/**
          **/.env.production
```

---

## 🔐 Step 5: GitHub Secrets Configuration

Add these secrets in GitHub repository:

```
FTP_SERVER: ftp.shilpgroup.com
FTP_USERNAME: shilfmfe
FTP_PASSWORD: your-cpanel-password
```

---

## 🧪 Step 6: Testing & Verification

### Frontend Test:
1. URL: `https://admin.shilpgroup.com`
2. Should load login page
3. Check browser console for API calls

### Backend Test:
1. URL: `https://mail.shilpgroup.com/api/health`
2. Expected: `{"status": "OK", "timestamp": "..."}`

### Integration Test:
1. Login with: `shilpgroup47@gmail.com` / `ShilpGroup@RealState11290`
2. Test all admin functions
3. Check file uploads work

---

## 🔄 Automatic Deployment Process

### Frontend Changes:
```bash
# Edit client files
git add client/
git commit -m "Update frontend"
git push origin main
# → Only frontend deploys to admin.shilpgroup.com
```

### Backend Changes:
```bash
# Edit server files
git add server/
git commit -m "Update backend"  
git push origin main
# → Only backend deploys to mail.shilpgroup.com + auto restart
```

### Both Changes:
```bash
# Edit both client and server
git add .
git commit -m "Update both frontend and backend"
git push origin main
# → Both deploy automatically
```

---

## 🎯 Quick Setup Commands

### 1. Add GitHub Secrets:
```
Repository → Settings → Secrets → Actions:
- FTP_SERVER: ftp.shilpgroup.com
- FTP_USERNAME: shilfmfe  
- FTP_PASSWORD: your-cpanel-password
```

### 2. Test Frontend Deployment:
```bash
echo "Frontend test" >> client/README.md
git add client/
git commit -m "Test frontend deployment"
git push origin main
# → Only frontend deploys
```

### 3. Test Backend Deployment:
```bash
echo "Backend test" >> server/README.md
git add server/
git commit -m "Test backend deployment"  
git push origin main
# → Only backend deploys
```

### 4. Manual Restart (if needed):
- cPanel → Node.js Apps → Restart application

---

## 📋 Deployment Checklist

- [ ] Frontend subdomain created: admin.shilpgroup.com
- [ ] Backend subdomain created: mail.shilpgroup.com  
- [ ] Node.js app configured for backend
- [ ] GitHub secrets added
- [ ] Frontend workflow tested
- [ ] Backend workflow tested
- [ ] Integration testing completed

---

## 🔧 Troubleshooting

### Common Issues:

**Frontend not loading:**
```bash
# Check .htaccess file exists
# Clear browser cache
# Check FTP deployment logs
```

**Backend API not responding:**
```bash
# Check Node.js app status in cPanel
# Restart application manually
# Check deployment logs in GitHub Actions
```

**CORS errors:**
```bash
# Verify CORS_ORIGIN in backend .env
# Should include: https://admin.shilpgroup.com
```

---

## 🎉 Expected Results

✅ **After complete setup:**

1. **Frontend**: https://admin.shilpgroup.com
   - Static React app served from cPanel
   - Loads instantly

2. **Backend**: https://mail.shilpgroup.com/api/health
   - Node.js API running on cPanel
   - Separate subdomain

3. **Automatic deployment on git push**
   - Client changes → Frontend deploys only
   - Server changes → Backend deploys only
   - Mixed changes → Both deploy

4. **Zero manual work after setup!**

**Login credentials:**
- Email: shilpgroup47@gmail.com
- Password: ShilpGroup@RealState11290
```typescript
// client/src/api/config.ts
const getBaseUrl = (): string => {
  if (import.meta.env.PROD) {
    return 'https://your-app.railway.app'; // Railway backend URL
  }
  // ... rest of development config
}
```

### Step 2: GitHub Actions for Client-Only Deployment
```yaml
# .github/workflows/deploy-client.yml
name: Deploy Client to cPanel

on:
  push:
    branches: [ main ]
    paths: [ 'client/**' ]  # Only trigger on client changes
  workflow_dispatch:

jobs:
  deploy-client:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'

    - name: Install and build client
      working-directory: ./client
      run: |
        npm ci
        npm run build

    - name: Deploy to cPanel via FTP
      uses: SamKirkland/FTP-Deploy-Action@v4.3.4
      with:
        server: ${{ secrets.FTP_SERVER }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./client/dist/
        server-dir: /home/shilfmfe/public_html/admin.shilpgroup.com/
```

---

## 🔧 Method 3: Complete Automatic Deployment

### Step 1: Update Environment Files

**client/.env.production:**
```env
VITE_API_BASE_URL=https://your-app.railway.app
VITE_IMAGE_BASE_URL=https://your-app.railway.app
VITE_APP_NAME="Shilp Admin Panel"
```

### Step 2: GitHub Actions for Both
```yaml
# .github/workflows/deploy-separate.yml
name: Deploy to Separate Hosts

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    if: contains(github.event.head_commit.modified, 'server/')
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Deploy to Railway
      uses: railway-deploy@v1.0.0
      with:
        token: ${{ secrets.RAILWAY_TOKEN }}
        
  deploy-frontend:
    runs-on: ubuntu-latest
    if: contains(github.event.head_commit.modified, 'client/')
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'

    - name: Build client
      working-directory: ./client
      run: |
        npm ci
        npm run build

    - name: Deploy to cPanel
      uses: SamKirkland/FTP-Deploy-Action@v4.3.4
      with:
        server: ${{ secrets.FTP_SERVER }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./client/dist/
        server-dir: /home/shilfmfe/public_html/admin.shilpgroup.com/
```

---

## 🌐 Method 4: Alternative - Render for Backend

### Step 1: Render Account
1. Visit: https://render.com
2. **Sign up** with GitHub
3. **New Web Service**
4. Connect: `SandeepTech077/shilp-adminpanel`
5. **Settings**:
   ```
   Name: shilp-backend
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   ```

### Step 2: Environment Variables (Render)
Same as Railway configuration above.

---

## 📋 Complete Setup Steps

### Step 1: Choose Backend Platform
```
✅ Railway (recommended - easy)
✅ Render (good free tier)  
✅ Heroku (paid but reliable)
✅ DigitalOcean (advanced)
```

### Step 2: Update Client Configuration
```bash
# Update API URL in client
./scripts/update-api-url.sh https://your-backend-url.com
```

### Step 3: Setup GitHub Secrets
```
RAILWAY_TOKEN: your-railway-token
FTP_SERVER: ftp.shilpgroup.com
FTP_USERNAME: shilfmfe
FTP_PASSWORD: your-password
```

### Step 4: Test Deployment
```bash
# Backend changes
git add server/
git commit -m "Backend update"
git push origin main
# → Deploys to Railway automatically

# Frontend changes  
git add client/
git commit -m "Frontend update"
git push origin main
# → Deploys to cPanel automatically
```

---

## 🎯 Final Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client        │    │    Server        │    │   Database      │
│   cPanel        │◄──►│   Railway        │◄──►│  MongoDB Atlas  │
│ admin.shilp...  │    │ your-app.rail... │    │   Cloud         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

**Advantages:**
- 🚀 Server on professional hosting (better performance)
- 💰 Client on cPanel (cost-effective)
- 🔄 Automatic deployment for both
- 📈 Scalable backend
- 🛡️ Better security
- ⚡ Faster API responses

**URLs:**
- **Frontend**: https://admin.shilpgroup.com
- **Backend**: https://your-app.railway.app
- **API Health**: https://your-app.railway.app/api/health
