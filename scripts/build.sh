#!/bin/bash
set -e

# DayScore Build Script
# Run from project root: ./scripts/build.sh

echo "Building DayScore services (backend)..."
echo ""

# Build backend
echo "Building service: backend..."
( cd backend && ./gradlew build -x test )
echo "  Backend build complete."

echo ""
echo "Build complete!"
echo ""
