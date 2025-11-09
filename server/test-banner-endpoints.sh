#!/bin/bash

# Test Banner API Endpoints
echo "🧪 Testing Banner API Endpoints..."

# Check if server is running
echo "📡 Checking server health..."
curl -X GET http://localhost:8080/api/health

echo -e "\n\n📋 Testing GET /api/banners..."
curl -X GET http://localhost:8080/api/banners \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE" \
  -H "Content-Type: application/json"

echo -e "\n\n🔍 Available endpoints:"
echo "GET    /api/banners                     - Get all banners"
echo "POST   /api/banners/:section/:field     - Upload banner image"
echo "PATCH  /api/banners/:section/alt        - Update alt text"
echo "DELETE /api/banners/:section/:field     - Delete banner image"

echo -e "\n\n📝 Example sections:"
echo "- homepageBanner"
echo "- aboutUs" 
echo "- commercialBanner"
echo "- plotBanner"
echo "- residentialBanner"
echo "- contactBanners"
echo "- careerBanner"
echo "- ourTeamBanner"
echo "- termsConditionsBanner"
echo "- privacyPolicyBanner"

echo -e "\n\n📝 Available fields:"
echo "- banner (for desktop)"
echo "- mobilebanner (for mobile)"

echo -e "\n\n🚀 Ready to test! Make sure to:"
echo "1. Start the backend server: npm start"
echo "2. Get an admin token by logging in"
echo "3. Use the token in the Authorization header"
echo "4. Start the frontend: npm run dev"