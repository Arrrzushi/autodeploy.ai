#!/bin/bash

# AutoDeploy.AI Cleanup Script
# Removes temporary files and cleans up Docker resources

set -e

echo "🧹 AutoDeploy.AI Cleanup Script"
echo "================================"
echo ""

read -p "This will remove all Docker containers, volumes, and temporary files. Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cleanup cancelled."
    exit 0
fi

echo ""
echo "Stopping Docker containers..."
docker-compose down

echo ""
read -p "Remove database volumes? This will DELETE ALL DATA! (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Removing volumes..."
    docker-compose down -v
    echo "✅ Volumes removed"
else
    echo "⏭️  Keeping volumes"
fi

echo ""
echo "Cleaning up temporary files..."
find . -type d -name "node_modules" -prune -exec rm -rf {} \; 2>/dev/null || true
find . -type d -name "dist" -prune -exec rm -rf {} \; 2>/dev/null || true
find . -type d -name "build" -prune -exec rm -rf {} \; 2>/dev/null || true
find /tmp -type d -name "repo-*" -exec rm -rf {} \; 2>/dev/null || true
echo "✅ Temporary files cleaned"

echo ""
echo "Cleaning Docker images..."
docker image prune -f
echo "✅ Unused Docker images removed"

echo ""
echo "🎉 Cleanup complete!"
echo ""
echo "To rebuild and start fresh, run:"
echo "  docker-compose up --build"





