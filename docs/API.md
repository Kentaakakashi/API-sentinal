# API contract

## Implemented endpoints

### GET /health/live
Process liveness; independent of PostgreSQL and Redis.

### GET /health/ready
Checks PostgreSQL and Redis. Returns HTTP 200 when both respond, otherwise HTTP 503.

Example:
```json
{
  "status": "ready",
  "checks": { "database": "ok", "redis": "ok" },
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## Planned routes (not implemented)
| Method | Route | Purpose |
|---|---|---|
| POST | /v1/auth/register | Create account |
| POST | /v1/auth/login | Start session |
| POST | /v1/auth/logout | Revoke session |
| GET | /v1/monitors | List owned monitors |
| POST | /v1/monitors | Create monitor |
| GET | /v1/monitors/:id | Read owned monitor |
| PATCH | /v1/monitors/:id | Update owned monitor |
| DELETE | /v1/monitors/:id | Soft-delete owned monitor |
| GET | /v1/monitors/:id/checks | Read check history |
| GET | /v1/incidents | List incidents |

All user resources must be scoped to account ownership. Public arbitrary-URL probe endpoints are out of scope.
