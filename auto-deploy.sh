#!/bin/bash

# 🚀 Auto Deploy Script for Shilp Admin Panel
# Run: ./auto-deploy.sh

echo "🚀 Starting Auto Deployment..."
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "client" ] && [ ! -d "server" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Build production files
echo "📦 Building production files..."
./build-production.sh

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Stopping deployment."
    exit 1
fi

# Create deployment package
echo "📁 Creating deployment package..."
mkdir -p deploy-temp/frontend
mkdir -p deploy-temp/backend

# Copy frontend files
echo "📱 Packaging frontend..."
cp -r client/dist/* deploy-temp/frontend/
cp client/.htaccess deploy-temp/frontend/

# Copy backend files  
echo "🚀 Packaging backend..."
cp -r server/src deploy-temp/backend/
cp server/package.json deploy-temp/backend/
cp server/package-lock.json deploy-temp/backend/
cp server/.env.production deploy-temp/backend/.env

echo "✅ Deployment package ready!"
echo ""
echo "📤 Upload Instructions:"
echo "======================="
echo "1. Frontend: Upload 'deploy-temp/frontend/*' to '/public_html/admin/'"
echo "2. Backend: Upload 'deploy-temp/backend/*' to '/home/username/mail.shilpgroup.com/'"
echo ""
echo "🔧 cPanel Steps:"
echo "1. Go to File Manager"
echo "2. Upload the files to respective directories"
echo "3. Go to Node.js Apps and restart the application"
echo ""
echo "🧪 Test URLs:"
echo "- Frontend: https://admin.shilpgroup.com"
echo "- Backend: https://mail.shilpgroup.com/api/health"
echo ""
echo "🎉 Ready for deployment!"

# Optionally zip the files for easy upload
if command -v zip &> /dev/null; then
    echo "📦 Creating zip files..."
    cd deploy-temp
    zip -r ../frontend-deploy.zip frontend/
    zip -r ../backend-deploy.zip backend/
    cd ..
    echo "✅ Zip files created: frontend-deploy.zip, backend-deploy.zip"
fi