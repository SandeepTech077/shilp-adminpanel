#!/bin/bash

# Project API Test Script
echo "Testing Project API Endpoints..."

BASE_URL="http://localhost:5000/api/projects"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Get all projects (should work without auth)
echo -e "${BLUE}Testing GET /api/projects (Public)${NC}"
curl -s -w "\nStatus Code: %{http_code}\n" "$BASE_URL" | head -10

echo -e "\n${BLUE}Testing GET /api/projects/stats (Public)${NC}"
curl -s -w "\nStatus Code: %{http_code}\n" "$BASE_URL/stats"

echo -e "\n${BLUE}Testing GET /api/projects/state/on-going (Public)${NC}"
curl -s -w "\nStatus Code: %{http_code}\n" "$BASE_URL/state/on-going"

echo -e "\n${BLUE}Testing GET /api/projects/type/residential (Public)${NC}"
curl -s -w "\nStatus Code: %{http_code}\n" "$BASE_URL/type/residential"

echo -e "\n${BLUE}Testing POST /api/projects (Should require auth)${NC}"
curl -s -w "\nStatus Code: %{http_code}\n" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"projectTitle":"Test Project"}' \
  "$BASE_URL"

echo -e "\n${GREEN}Project API test completed!${NC}"
echo -e "${BLUE}Note: POST requests will fail without admin authentication token${NC}"