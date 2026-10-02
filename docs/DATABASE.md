# Database model

The initial Prisma schema defines:
- `User`: account identity and ownership root.
- `Session`: hashed session token and expiry.
- `Monitor`: target configuration and scheduling policy.
- `CheckResult`: append-oriented measurement history.
- `Incident`: outage lifecycle.
- `AlertChannel`: notification channel metadata.
- `NotificationDelivery`: delivery attempts.
- `AuditEvent`: security-relevant actions.

## Constraints
- Passwords are stored as hashes, never plaintext.
- Session tokens are stored as hashes.
- Notification credentials must be encrypted or held in a secret manager before alert channels are exposed.
- Every monitor query must enforce ownership.
- Retention and partitioning must be planned before high-volume production use.

Use `pnpm db:generate` after schema changes and `pnpm db:migrate` for local development migrations. Review generated SQL before production deployment.
