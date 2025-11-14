#!/bin/bash

# 🚀 Auto Deploy Script for Shilp Admin Panel - cPanel
# Usage: ./auto-deploy.sh

echo "🚀 cPanel Deployment Preparation"
echo "==============================="

# Check if we're in the right directory
if [ ! -d "client" ] || [ ! -d "server" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf deploy-package/
rm -f frontend-files.zip backend-files.zip

# Build production files
echo "📦 Building production files..."
./build-production.sh

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Stopping preparation."
    exit 1
fi

# Create organized deployment package
echo "📁 Creating deployment package..."
mkdir -p deploy-package/frontend
mkdir -p deploy-package/backend

# Frontend files
echo "📱 Packaging frontend files..."
cp -r client/dist/* deploy-package/frontend/
cp client/.htaccess deploy-package/frontend/

# Backend files  
echo "🚀 Packaging backend files..."
cp -r server/src deploy-package/backend/
cp server/package.json deploy-package/backend/
cp server/package-lock.json deploy-package/backend/
cp server/.env.production deploy-package/backend/.env

# Create zip files for easy upload
if command -v zip &> /dev/null; then
    echo "📦 Creating zip files for easy upload..."
    cd deploy-package
    zip -r ../frontend-files.zip frontend/
    zip -r ../backend-files.zip backend/
    cd ..
    echo "✅ Created: frontend-files.zip & backend-files.zip"
fi

echo ""
echo "✅ Deployment Package Ready!"
echo "============================"
echo ""
echo "📤 cPanel Upload Steps:"
echo "1. Frontend: Upload 'frontend-files.zip' to '/public_html/admin/' and extract"
echo "2. Backend: Upload 'backend-files.zip' to '/home/username/mail.shilpgroup.com/' and extract"
echo ""
echo "🔧 cPanel Configuration:"
echo "1. Create subdomains: admin.shilpgroup.com & mail.shilpgroup.com"
echo "2. Setup Node.js App for backend (port 3000, startup: src/server.js)"
echo "3. Install dependencies: npm install"
echo "4. Create uploads folders with permissions"
echo ""
echo "🧪 Test URLs:"
echo "- Frontend: https://admin.shilpgroup.com"
echo "- Backend: https://mail.shilpgroup.com/api/health"
echo "- Login: shilpgroup47@gmail.com / ShilpGroup@RealState11290"
echo ""
echo "📋 Complete guide: See CPANEL_DEPLOYMENT_GUIDE.md"