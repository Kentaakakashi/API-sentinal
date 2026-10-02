# Architecture

## Status
This document describes the intended boundaries and the foundation currently present. It does not claim every component is implemented.

## Services
- **Web (planned):** React client. It must never connect directly to PostgreSQL or Redis.
- **API:** Fastify owns HTTP ingress, authentication, validation, authorization, and monitor configuration. The initial implementation exposes liveness and readiness only.
- **Worker:** BullMQ workers consume background jobs. Probe execution belongs outside the API process. The current worker intentionally rejects jobs until safe transport and persistence exist.
- **PostgreSQL:** Source of truth for accounts, monitors, results, incidents, alert channels, and audit events.
- **Redis:** BullMQ backing service; never the source of truth for monitor configuration or history.

## Target data flow
1. An authenticated user creates a monitor.
2. The API validates and persists it.
3. A scheduler enqueues a due check.
4. A worker validates the destination and performs a bounded request.
5. The worker stores a result.
6. An incident evaluator opens or resolves an incident.
7. Notification jobs are queued.

## Reliability requirements
- Jobs must be idempotent.
- Retries use bounded exponential backoff and jitter.
- A monitor must not have overlapping checks unless explicitly supported.
- Worker shutdown must stop accepting new work.
- Incident transitions and result writes use transactions where needed.
- Redis loss must not destroy persistent monitor data.

## Scaling path
Start with one API and one worker. Scale workers only after queue lag, probe duration, and database pressure are observable. Multi-region probes are a later extension.
