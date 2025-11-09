#!/bin/bash

echo "Testing Admin Login API..."

# Test admin login
curl -X POST http://localhost:8080/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@shilpadmin.com",
    "password": "Admin123!@#"
  }' \
  | python3 -m json.tool

echo -e "\n\nTesting token verification..."

# Save token for verification test (you'll need to update this with actual token)
TOKEN="your-token-here"

curl -X POST http://localhost:8080/api/admin/verify-token \
  -H "Content-Type: application/json" \
  -d "{
    \"token\": \"$TOKEN\"
  }" \
  | python3 -m json.tool