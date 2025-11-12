#!/bin/bash

# 🚀 Production Build Script for cPanel Deployment
# Run this before uploading to cPanel

echo "🔨 Starting Production Build..."
echo "================================"

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this from project root directory"
    exit 1
fi

# Build Client
echo ""
echo "📦 Building Client (Frontend)..."
cd client || exit

# Install dependencies
echo "Installing dependencies..."
npm install

# Build for production
echo "Building production bundle..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Client build successful!"
    echo "📁 Build output: client/dist/"
else
    echo "❌ Client build failed!"
    exit 1
fi

# Back to root
cd ..

# Prepare Server
echo ""
echo "📦 Preparing Server (Backend)..."
cd server || exit

# Install production dependencies
echo "Installing production dependencies..."
npm install --production

if [ $? -eq 0 ]; then
    echo "✅ Server dependencies installed!"
else
    echo "❌ Server dependency installation failed!"
    exit 1
fi

cd ..

# Create deployment package info
echo ""
echo "📋 Deployment Package Ready!"
echo "================================"
echo ""
echo "📤 Upload Instructions:"
echo "1. Client: Upload 'client/dist/*' to 'public_html/'"
echo "2. Server: Upload 'server/*' to '/home/username/shilp-api/'"
echo "3. Don't forget to create .env file on server"
echo ""
echo "📝 Files to upload:"
echo "   ✓ client/dist/ → public_html/"
echo "   ✓ server/src/ → /home/username/shilp-api/src/"
echo "   ✓ server/package.json"
echo "   ✓ server/.env.production → .env (rename)"
echo ""
echo "🎉 Build Complete! Ready for deployment."
