#!/bin/bash
set -e

# DayScore Cleanup Script
# Run from project root: ./scripts/clean.sh

# Detect Docker Compose command
get_compose_cmd() {
    if docker compose version &> /dev/null; then
        echo "docker compose"
    elif command -v docker-compose &> /dev/null; then
        echo "docker-compose"
    else
        echo "Docker Compose not found." >&2
        exit 1
    fi
}

COMPOSE_CMD=$(get_compose_cmd)

echo "Cleaning DayScore services (backend, frontend)..."
echo ""
echo "This will remove:"
echo "  - All Docker containers and volumes (database data will be lost)"
echo "  - Backend build artifacts"
echo "  - Frontend build artifacts and node_modules"
echo ""
read -p "Are you sure? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cleanup cancelled."
    exit 0
fi

echo ""

# Kill any running processes on port 8080
if lsof -ti:8080 &> /dev/null; then
    echo "Stopping service: backend..."
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true
fi

# Kill any running processes on port 3000
if lsof -ti:3000 &> /dev/null; then
    echo "Stopping service: frontend..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
fi

# Stop and remove Docker containers and volumes
echo "Removing Docker containers and volumes..."
$COMPOSE_CMD down -v 2>/dev/null || true

# Clean Gradle build
echo "Cleaning service: backend..."
( cd backend && ./gradlew clean 2>/dev/null ) || true

# Clean frontend
echo "Cleaning service: frontend..."
rm -rf frontend/.next frontend/node_modules 2>/dev/null || true

echo ""
echo "Cleanup complete!"
echo ""
