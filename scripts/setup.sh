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

echo ""
echo "Setup complete!"
echo ""
echo "Available commands:"
echo "  ./scripts/start.sh  - Build and start all services"
echo "  ./scripts/stop.sh   - Stop all services"
echo "  ./scripts/clean.sh  - Remove containers, volumes, and images"
echo ""
