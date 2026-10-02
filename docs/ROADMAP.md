# Roadmap

This roadmap is directional. A checkbox is marked complete only after implementation and verification.

## Foundation
- [x] Monorepo and TypeScript workspace structure
- [x] Fastify API liveness and readiness routes
- [x] Initial Prisma relational schema
- [x] Shared monitor input schema
- [x] Initial target URL policy and unit tests
- [ ] Verify clean install, build, lint, and tests in CI

## Monitoring core
- [ ] SSRF-hardened HTTP transport with DNS pinning
- [ ] Persistent monitor CRUD with ownership enforcement
- [ ] BullMQ scheduler and idempotent job keys
- [ ] Probe execution and check-result persistence
- [ ] Incident state machine and deduplication

## Product
- [ ] Authentication and session lifecycle
- [ ] React dashboard
- [ ] Uptime and latency analytics
- [ ] Discord notifications
- [ ] Email notifications

## Operations
- [ ] Production Docker images
- [ ] Metrics, structured logs, and tracing
- [ ] Retention and archival jobs
- [ ] Deployment and backup runbooks
