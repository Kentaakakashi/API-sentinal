# API Sentinel

<p align="center"><strong>API observability and reliability, built in the open.</strong><br/>Monitor HTTP endpoints, measure latency, detect incidents, and understand service reliability.</p>

<p align="center">
<img alt="Status" src="https://img.shields.io/badge/status-early%20development-orange"/><img alt="License" src="https://img.shields.io/badge/license-MIT-blue"/><img alt="Node" src="https://img.shields.io/badge/Node.js-22%2B-339933?logo=node.js&logoColor=white"/><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white"/>
</p>

> **Stage: foundation / pre-alpha.** The workspace foundation, service health endpoints, initial database schema, shared validation, and target URL policy are being established. Full monitoring, authentication, incident processing, and the dashboard are not shipped yet.

## Planned capabilities
- Scheduled HTTP checks and latency measurements.
- Historical uptime and response-time analytics.
- Incident creation, deduplication, and recovery tracking.
- Discord and email notifications.
- Multi-user monitor ownership and audit history.
- Security controls for user-supplied monitoring targets.

## Current implementation

| Area | State |
|---|---|
| TypeScript workspace | Foundation |
| Fastify API | Liveness and dependency readiness |
| Worker | Queue consumer foundation; no production probe processor |
| PostgreSQL / Prisma | Initial relational schema |
| Redis / BullMQ | Queue connection foundation |
| Shared validation | Monitor input schema |
| Target URL policy | Scheme, hostname, resolved-IP checks |
| Dashboard / authentication / scheduled checks | Planned |

## Architecture

```text
React dashboard (planned)
       |
Fastify API ---- PostgreSQL
       |
      Redis
       |
BullMQ monitoring workers
```

The API and worker are separate processes. PostgreSQL is the source of truth; Redis is used for background job delivery.

## Requirements
- Node.js 22+
- pnpm 10
- Docker Engine + Docker Compose

## Local development
1. Clone the repository.
2. Run `pnpm install`.
3. Copy `.env.example` to `.env`.
4. Start dependencies: `docker compose up -d postgres redis`.
5. Generate Prisma Client: `pnpm db:generate`.
6. Start the API: `pnpm --filter @sentinel/api dev`.
7. Start the worker: `pnpm --filter @sentinel/worker dev`.

The API listens on `http://localhost:4000`.

## Health endpoints
- `GET /health/live` — process liveness.
- `GET /health/ready` — verifies PostgreSQL and Redis connectivity.

These are operational health endpoints only. Monitor CRUD and public probing endpoints are not implemented.

## Security
Monitoring arbitrary URLs is SSRF-sensitive. The initial URL policy rejects unsafe schemes, local hostnames, and non-public resolved IPs. **DNS validation alone is not a complete SSRF boundary.** Before public probe execution, the transport must pin validated DNS results, revalidate every redirect, and run behind restrictive egress firewall rules. See [SECURITY.md](docs/SECURITY.md).

## Documentation
- [Architecture](docs/ARCHITECTURE.md)
- [API contract](docs/API.md)
- [Database model](docs/DATABASE.md)
- [Security model](docs/SECURITY.md)
- [Contributing](docs/CONTRIBUTING.md)

## Engineering principles
No fabricated uptime data. No committed secrets. No unbounded retries or response bodies. Every user-owned resource must be scoped to its owner. Security-sensitive behaviour needs tests.

MIT licensed. See [LICENSE](LICENSE).
