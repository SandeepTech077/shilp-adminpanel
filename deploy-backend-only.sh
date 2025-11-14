#!/bin/bash

# 🚀 Backend Only Deployment Script for cPanel
# Usage: ./deploy-backend-only.sh

echo "🚀 Backend-Only Deployment for Shilp Admin Panel"
echo "=============================================="

# Configuration
REPO_URL="https://github.com/SandeepTech077/shilp-adminpanel.git"
TEMP_DIR="/home/shilfmfe/temp-deploy-backend"
BACKEND_DIR="/home/shilfmfe/mail.shilpgroup.com"
LOG_FILE="/home/shilfmfe/backend-deployment.log"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

log_message "🚀 Starting backend-only deployment..."

# Clean temp directory
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

# Clone latest code
log_message "📥 Cloning repository..."
cd $TEMP_DIR
git clone $REPO_URL .

if [ $? -ne 0 ]; then
    log_message "❌ Failed to clone repository"
    exit 1
fi

# Stop existing Node.js process
log_message "🛑 Stopping existing Node.js application..."
pkill -f "node.*src/server.js" || true
sleep 3

# Backup current backend (optional)
log_message "💾 Creating backup..."
cp -r $BACKEND_DIR $BACKEND_DIR.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

# Deploy backend files
log_message "🚀 Deploying backend files..."
cp -r server/src/* $BACKEND_DIR/src/
cp server/package.json $BACKEND_DIR/
cp server/.env.production $BACKEND_DIR/.env

# Install dependencies
log_message "📦 Installing dependencies..."
cd $BACKEND_DIR
npm install --production

if [ $? -ne 0 ]; then
    log_message "❌ Failed to install dependencies"
    exit 1
fi

# Create uploads directories if they don't exist
log_message "📁 Setting up upload directories..."
mkdir -p uploads/{banners,blogs,projects,projecttree}
chmod -R 755 uploads/

# Start Node.js application
log_message "🔄 Starting Node.js application..."
cd $BACKEND_DIR
nohup npm start > /dev/null 2>&1 &

# Wait a moment and check if process started
sleep 3
if pgrep -f "node.*src/server.js" > /dev/null; then
    log_message "✅ Node.js application started successfully!"
else
    log_message "⚠️  Warning: Node.js application may not have started properly"
fi

# Cleanup
log_message "🧹 Cleaning up..."
rm -rf $TEMP_DIR

log_message "✅ Backend deployment completed!"

echo ""
echo "🧪 Test your backend:"
echo "URL: https://mail.shilpgroup.com/api/health"
echo "Expected: {\"status\": \"OK\", \"timestamp\": \"...\"}"
echo ""
echo "📋 Check logs: $LOG_FILE"