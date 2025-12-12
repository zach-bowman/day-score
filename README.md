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
curl http://localhost:8080/actuator/health  # Backend → {"status":"UP"}
curl http://localhost:3000                  # Frontend → HTML response

```
Or visit http://localhost:3000 in your browser.

## Scripts

| Script | Description |
|--------|-------------|
| `setup.sh` | First-time setup |
| `start.sh` | Build and start all services and database |
| `stop.sh`  | Stop all services and database |
| `clean.sh` | Remove containers, volumes, and images |

## Services

### Backend
- Java 21, Spring Boot 3, Gradle 8
- PostgreSQL 16

```bash
cd backend

./gradlew build          # Build
./gradlew test           # Run tests
./gradlew bootRun        # Start server

./gradlew spotlessCheck  # Check formatting
./gradlew spotlessApply  # Fix formatting
```

### Frontend
- Node.js 22, TypeScript 5, Next.js 16, React 19
- Tailwind CSS 4

```bash
cd frontend

npm run build         # Build
npm run test          # Run tests
npm run lint          # Lint
npm run dev           # Start dev server

npm run format:check  # Check formatting
npm run format        # Fix formatting
```

## Infrastructure
- Docker

## License
MIT
