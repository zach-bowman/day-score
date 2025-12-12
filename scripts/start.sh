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

echo "Starting DayScore services (backend, frontend)..."
echo ""

# Start PostgreSQL
echo "Starting PostgreSQL..."
$COMPOSE_CMD up -d db
echo "  Waiting for PostgreSQL to be ready..."
sleep 3

# Start backend
echo "Starting service: backend..."
( cd backend && ./gradlew bootRun ) &
BACKEND_PID=$!
sleep 5

# Start frontend
echo "Starting service: frontend..."
echo ""
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop"
echo ""
( cd frontend && npm run dev )

# Cleanup backend when frontend stops
kill $BACKEND_PID 2>/dev/null || true
