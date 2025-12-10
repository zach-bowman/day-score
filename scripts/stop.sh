#!/bin/bash
set -e

# DayScore Stop Script
# Run from project root: ./scripts/stop.sh

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

echo "Stopping DayScore services (backend)..."
echo ""

# Kill any running Gradle/Java processes on port 8080
if lsof -ti:8080 &> /dev/null; then
    echo "Stopping service: backend..."
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true
fi

# Stop Docker containers (keeps volumes)
echo "Stopping Docker containers..."
$COMPOSE_CMD down

echo ""
echo "Services stopped. Data is preserved."
echo ""
