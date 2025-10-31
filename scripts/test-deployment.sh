#!/bin/bash

# AutoDeploy.AI Test Deployment Script
# Tests the deployment with sample repositories

set -e

echo "🧪 AutoDeploy.AI Deployment Test"
echo "================================="
echo ""

API_URL="${VITE_API_URL:-http://localhost:5000}"

echo "Testing API health..."
if curl -f -s "${API_URL}/health" > /dev/null; then
    echo "✅ API is healthy"
else
    echo "❌ API is not responding"
    exit 1
fi

echo ""
echo "Testing repository analysis..."
echo "Using sample repo: https://github.com/expressjs/express"

RESPONSE=$(curl -s -X POST "${API_URL}/api/analyze-repo" \
  -H "Content-Type: application/json" \
  -d '{"repoUrl":"https://github.com/expressjs/express"}')

if echo "$RESPONSE" | grep -q "analysis"; then
    echo "✅ Repository analysis successful"
    echo "Response preview:"
    echo "$RESPONSE" | head -c 200
    echo "..."
else
    echo "❌ Repository analysis failed"
    echo "Response: $RESPONSE"
    exit 1
fi

echo ""
echo "🎉 Basic tests passed!"
echo ""
echo "Manual testing steps:"
echo "1. Visit http://localhost:5173"
echo "2. Paste a GitHub URL"
echo "3. Click 'Analyze Repository'"
echo "4. Review generated Dockerfile"
echo "5. Click 'Deploy to NodeOps'"
echo "6. Monitor dashboard"





