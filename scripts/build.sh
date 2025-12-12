#!/bin/bash
set -e

# DayScore Build Script
# Run from project root: ./scripts/build.sh

echo "Building DayScore services (backend, frontend)..."
echo ""

# Build backend
echo "Building service: backend..."
( cd backend && ./gradlew build -x test )
echo "  Backend build complete."

# Build frontend
echo "Building service: frontend..."
( cd frontend && npm run build )
echo "  Frontend build complete."

echo ""
echo "Build complete!"
echo ""
