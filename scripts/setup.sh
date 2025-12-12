#!/bin/bash
set -e

# DayScore Development Setup
# Run from project root: ./scripts/setup.sh

echo "Setting up DayScore development environment..."
echo ""

# Check Docker
echo "Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "  Docker not found. Please install Docker Desktop."
    exit 1
fi
if ! docker info &> /dev/null; then
    echo "  Docker is not running. Please start Docker Desktop."
    exit 1
fi
echo "  Docker is ready."

# Check Docker Compose
echo "Checking Docker Compose..."
if ! docker compose version &> /dev/null && ! command -v docker-compose &> /dev/null; then
    echo "  Docker Compose not found. Please install Docker Compose."
    exit 1
fi
echo "  Docker Compose is ready."

# Set script permissions
echo "Setting script permissions..."
chmod +x scripts/*.sh
echo "  Scripts are executable."

# Verify Gradle wrapper
echo "Checking Gradle wrapper..."
if [ ! -f "backend/gradlew" ]; then
    echo "  Generating Gradle wrapper..."
    ( cd backend && gradle wrapper )
fi
chmod +x backend/gradlew
echo "  Gradle wrapper is ready."

# Install frontend dependencies
echo "Installing frontend dependencies..."
( cd frontend && npm install )
echo "  Frontend dependencies installed."

echo ""
echo "Setup complete!"
echo ""
echo "Available commands:"
echo "  ./scripts/build.sh  - Build services"
echo "  ./scripts/test.sh   - Run tests"
echo "  ./scripts/start.sh  - Start services"
echo "  ./scripts/stop.sh   - Stop services"
echo "  ./scripts/clean.sh  - Clean up everything"
echo ""
