# day-score

> **Status:** In Development

DayScore: A simple daily rating tool to track your entries and see your trends over time.

## Getting Started

```bash
./scripts/setup.sh  # First-time setup
./scripts/start.sh  # Start services
```

Verify services are running:
```bash
curl http://localhost:8080/actuator/health  # Backend
curl http://localhost:3000                  # Frontend
```

## Scripts

| Script | Description |
|--------|-------------|
| `setup.sh` | First-time setup |
| `build.sh` | Build services (backend, frontend) |
| `test.sh` | Run tests |
| `start.sh` | Start services (backend, frontend) |
| `stop.sh` | Stop services (backend, frontend) |
| `clean.sh` | Remove containers, volumes, and build artifacts |

## Services

### Backend
- Java 21, Spring Boot 3, Gradle 8
- PostgreSQL 16

```bash
cd backend
./gradlew build     # Build
./gradlew test      # Run tests
./gradlew bootRun   # Start server
```

### Frontend
- Node.js 22, TypeScript 5, Next.js 16, React 19
- Tailwind CSS 4

```bash
cd frontend
npm run build       # Build
npm run lint        # Lint
npm run dev         # Start dev server
```

## Infrastructure
- Docker

## License
MIT
