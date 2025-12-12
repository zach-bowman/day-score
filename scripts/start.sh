#!/bin/bash
set -e

# DayScore Start Script
# Run from project root: ./scripts/start.sh

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

echo "Starting DayScore services..."
echo ""

$COMPOSE_CMD up -d --build --wait

echo ""
echo "All services healthy."
echo ""
echo "Backend:  http://localhost:8080"
echo "Frontend: http://localhost:3000"
echo ""
echo "View logs: docker compose logs -f"
echo "Stop:      ./scripts/stop.sh"
echo ""
