#!/bin/bash
set -e

# DayScore Test Script
# Run from project root: ./scripts/test.sh

echo "Running DayScore tests (backend)..."
echo ""

# Backend tests
echo "Testing service: backend..."
( cd backend && ./gradlew test )

echo ""
echo "All tests passed!"
echo ""
