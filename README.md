# day-score

[![CI](https://github.com/zach-bowman/day-score/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/zach-bowman/day-score/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=zach-bowman_day-score&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=zach-bowman_day-score)
[![GitHub tag](https://img.shields.io/github/v/tag/zach-bowman/day-score?label=version)](https://github.com/zach-bowman/day-score/tags)

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

## Contributing

### Workflow

1. Create a feature branch
2. Make changes and commit (commits are validated locally)
3. Open a PR with a conventional commit title
4. CI runs all checks
5. Squash and merge when approved

### Code Quality

| Check | Local | CI |
|-------|-------|-----|
| Prettier (frontend) | pre-commit | ✓ |
| ESLint (frontend) | pre-commit | ✓ |
| Spotless (backend) | pre-commit | ✓ |
| Tests | manual | ✓ |
| Build | manual | ✓ |
| Docker health checks | manual | ✓ |
| SonarCloud analysis | — | ✓ |
| Commit message | pre-commit | ✓ |
| PR title | — | ✓ |

### Commit Messages

Follow [Conventional Commits](https://conventionalcommits.org). PR titles must match this format since we squash merge.

```
type: description
```

**Allowed types:**

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `refactor` | Code improvement |
| `test` | Test changes |
| `build` | Build/CI changes |
| `chore` | Maintenance |
| `revert` | Reverts |

**Breaking changes:** Add `!` after type or include `BREAKING CHANGE:` in the body

```
feat!: remove old API
```
```
feat: remove old API

BREAKING CHANGE: This removes the v1 endpoints
```

### Versioning

Version tags (e.g., `v0.1.0`) are created automatically when commits are pushed to main and CI passes:

| Commit Type | Version Bump |
|-------------|--------------|
| `fix`, `refactor`, `build`, `chore`, `revert` | Patch (v0.1.0 → v0.1.1) |
| `feat` | Minor (v0.1.0 → v0.2.0) |
| `feat!` or `BREAKING CHANGE:` | Major (v0.1.0 → v1.0.0) |
| `docs`, `test` | No tag |

## License
MIT
