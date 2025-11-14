#!/bin/bash

# Manual Backend Deployment to cPanel
echo "🚀 Manual Backend Deployment Script"
echo "=================================="

# Create deployment directory
echo "📁 Creating deployment files..."
rm -rf deploy-manual
mkdir -p deploy-manual

# Copy backend files
echo "📋 Copying server files..."
cp -r server/src deploy-manual/
cp server/package.json deploy-manual/
cp server/package-lock.json deploy-manual/
cp server/.env.production deploy-manual/.env

# Create uploads directories
echo "📁 Creating upload directories..."
mkdir -p deploy-manual/uploads/{banners,blogs,projects,projecttree}

# Copy existing uploads if they exist
if [ -d "server/uploads" ]; then
    echo "📷 Copying existing uploads..."
    cp -r server/uploads/* deploy-manual/uploads/ 2>/dev/null || true
fi

echo "✅ Files prepared in 'deploy-manual' directory"
echo ""
echo "📤 Now upload 'deploy-manual' folder contents to:"
echo "   cPanel File Manager → /home/shilfmfe/site/mail.shilpgroup.com/"
echo ""
echo "🔧 After upload, go to cPanel → Node.js Apps → Restart Application"
echo ""
echo "🌐 Test URL: https://mail.shilpgroup.com/api/health"