# Frontend Deployment Steps - Shilp Group

## 🎯 Domain: admin.shilpgroup.com

## 📱 Upload Frontend Files to cPanel:

1. **File Manager** में जाएं
2. Navigate to: `/public_html/admin/` या `/home/username/admin.shilpgroup.com/`
3. Upload ये files `client/dist/` से:
   ```
   ✅ index.html
   ✅ assets/ (complete folder)
   ✅ vite.svg
   ```

## 📝 .htaccess File बनाएं:

File Manager में new file बनाएं: `.htaccess`

Content:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Handle Angular and React Router
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

## ✅ Frontend Test करें:
- Open: `https://admin.shilpgroup.com`
- Login with: `shilpgroup47@gmail.com` / `ShilpGroup@RealState11290`