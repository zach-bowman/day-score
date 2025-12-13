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
    return 0
}

COMPOSE_CMD=$(get_compose_cmd)

echo "Stopping DayScore services..."
echo ""

$COMPOSE_CMD down

echo ""
echo "Services stopped. Data is preserved."
echo ""
