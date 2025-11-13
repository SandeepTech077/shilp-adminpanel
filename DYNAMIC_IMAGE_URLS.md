# 🖼️ Dynamic Image URL Configuration

## Overview
This project now supports dynamic image URL detection based on the access method and environment.

## ✅ Supported URLs

### Development Environment

#### Client Access:
- **localhost**: `http://localhost:5174/`
- **Network IP**: `http://192.168.2.143:5174/`

#### Server API:
- **localhost**: `http://localhost:8081`
- **Network IP**: `http://192.168.2.143:8081`

#### Image URLs:
- **From localhost**: Images served via `http://localhost:8081/uploads/...`
- **From Network IP**: Images served via `http://192.168.2.143:8081/uploads/...`

### Production Environment

#### Client Access:
- **Admin Panel**: `https://admin.shilpgroup.com`

#### Server API:
- **Backend**: `https://mail.shilpgroup.com`

#### Image URLs:
- **Production**: Images served via `https://mail.shilpgroup.com/uploads/...`

## 🔧 Technical Implementation

### Dynamic Detection Logic

#### Client Side (`config.ts` & `imageUtils.ts`):
```typescript
// Automatically detects access method
if (import.meta.env.PROD) {
  return 'https://mail.shilpgroup.com';
}

if (window.location.hostname === '192.168.2.143') {
  return 'http://192.168.2.143:8081';
}

if (window.location.hostname === 'localhost') {
  return 'http://localhost:8081';
}
```

#### Server Side (`server.js`):
```javascript
// Network binding for both localhost and network IP
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Network: http://192.168.2.143:${PORT}`);
  console.log(`🏠 Local: http://localhost:${PORT}`);
});
```

### CORS Configuration
```javascript
const allowedOrigins = [
  'http://localhost:5174',
  'http://192.168.2.143:5174', 
  'http://localhost:5175',
  'http://192.168.2.143:5175',
  // Production
  'https://admin.shilpgroup.com',
  'https://shilpgroup.com'
];
```

## 📁 Updated Files

### Client Files:
- ✅ `client/src/api/config.ts` - Dynamic API URL detection
- ✅ `client/src/api/imageUtils.ts` - Simplified to use config.ts
- ✅ `client/src/api/utils/imageUtils.ts` - Dynamic image URL generation  
- ✅ `client/.env.production` - Production environment variables

### Server Files:
- ✅ `server/src/server.js` - Network binding (0.0.0.0)
- ✅ `server/.env` - Development CORS configuration
- ✅ `server/.env.production` - Production environment with correct database URL

### Database:
- ✅ Banner image paths updated to match existing files
- ✅ All banner sections fixed: homepage, aboutUs, blogsDetail, privacyPolicy

## 🎯 Results

### ✅ Working URLs:
1. **localhost:5174** → API: `localhost:8081` → Images: `localhost:8081/uploads/...`
2. **192.168.2.143:5174** → API: `192.168.2.143:8081` → Images: `192.168.2.143:8081/uploads/...`
3. **admin.shilpgroup.com** → API: `mail.shilpgroup.com` → Images: `mail.shilpgroup.com/uploads/...`

### ✅ Test Results:
- ✅ Server health: `http://192.168.2.143:8081/api/health` - OK
- ✅ Admin login: `http://192.168.2.143:8081/api/admin/login` - OK  
- ✅ Banner API: `http://192.168.2.143:8081/api/banners` - OK
- ✅ Banner images: `http://192.168.2.143:8081/uploads/banners/...` - OK

## 🚀 Usage

### Development:
```bash
# Start server (binds to 0.0.0.0:8081)
cd server && npm start

# Start client (available on both localhost and network IP)
cd client && npm run dev
```

### Production:
```bash
# Build with production environment
./build-production.sh

# Deploy to cPanel
# - Upload dist/ to admin.shilpgroup.com 
# - Upload server/ to mail.shilpgroup.com
```

**Now banner images will work properly on both localhost and network IP access!** 🎯