# day-score

> **Status:** In Development

DayScore: A simple daily rating tool to track your entries and see your trends over time.

## Getting Started

```bash
./scripts/setup.sh   # First-time setup
./scripts/start.sh   # Start services (backend)
```

Verify the backend service running:
```bash
curl http://localhost:8080/actuator/health
```

## Scripts

| Script | Description |
|--------|-------------|
| `setup.sh` | First-time setup |
| `build.sh` | Build services (backend) |
| `test.sh` | Run tests |
| `start.sh` | Start services (backend) |
| `stop.sh` | Stop services (backend) |
| `clean.sh` | Remove containers, volumes, and build artifacts |

## Services

### Backend
- Java 21, Spring Boot 3.3, Gradle
- PostgreSQL 16

```bash
cd backend
./gradlew build      # Build
./gradlew test       # Run tests
./gradlew bootRun    # Start server
```

## Infrastructure
- Docker

## License
MIT
