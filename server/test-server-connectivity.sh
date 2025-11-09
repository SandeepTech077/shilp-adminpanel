#!/bin/bash

echo "🔍 Testing Server Connectivity and Image Access..."

# Test 1: Check if server is running on port 8080
echo "1. Testing server health on port 8080..."
curl -s http://localhost:8080/api/health || echo "❌ Server not responding on port 8080"

# Test 2: Check if uploads directory is accessible
echo -e "\n2. Testing uploads directory access..."
curl -s -I http://localhost:8080/uploads/ | head -1

# Test 3: List files in uploads directory (requires admin token)
echo -e "\n3. Getting admin token..."
RESPONSE=$(curl -s -X POST http://localhost:8080/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@shilpadmin.com",
    "password": "Admin123!@#"
  }')

TOKEN=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

if [ ! -z "$TOKEN" ]; then
  echo "✅ Got admin token"
  
  echo -e "\n4. Testing debug files endpoint..."
  curl -s -X GET http://localhost:8080/api/banners/debug/files \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" | python3 -m json.tool
    
  echo -e "\n5. Testing direct file access..."
  # Try to access a specific file if it exists
  curl -s -I http://localhost:8080/uploads/banners/ | head -1
else
  echo "❌ Failed to get admin token"
  echo "Response: $RESPONSE"
fi

echo -e "\n6. Testing CORS headers..."
curl -s -I -H "Origin: http://localhost:5173" http://localhost:8080/uploads/ | grep -i "access-control"

echo -e "\n✅ Test completed!"