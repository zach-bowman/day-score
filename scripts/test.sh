#!/bin/bash
set -e

# DayScore Test Script
# Run from project root: ./scripts/test.sh

echo "Running DayScore tests (backend, frontend)..."
echo ""

# Backend tests
echo "Testing service: backend..."
( cd backend && ./gradlew test )

# Frontend tests
echo "Testing service: frontend..."
( cd frontend && npm run lint )

echo ""
echo "All tests passed!"
echo ""
