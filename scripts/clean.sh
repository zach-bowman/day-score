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
    return 0
}

COMPOSE_CMD=$(get_compose_cmd)

echo "Cleaning DayScore..."
echo ""
echo "This will remove all DayScore Docker containers, volumes, and images:"
echo "  - Containers: day-score-db, day-score-backend, day-score-frontend"
echo "  - Volumes: day-score_postgres_data (database data will be lost)"
echo "  - Images: day-score-backend, day-score-frontend"
echo ""
read -p "Are you sure? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cleanup cancelled."
    exit 0
fi

echo ""

# Stop and remove containers, volumes, and images
echo "Removing Docker containers, volumes, and images..."
$COMPOSE_CMD down -v --rmi local 2>/dev/null || true

echo ""
echo "Cleanup complete!"
echo ""
