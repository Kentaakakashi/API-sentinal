# Contributing

Thanks for helping improve API Sentinel.

## Setup
1. Install Node.js 22+ and pnpm 10.
2. Clone the repository and run `pnpm install`.
3. Copy `.env.example` to `.env`.
4. Start dependencies: `docker compose up -d postgres redis`.
5. Generate Prisma Client: `pnpm db:generate`.

## Before a pull request
- Run `pnpm lint`, `pnpm test`, and `pnpm build`.
- Add tests for changed behaviour.
- Update docs when contracts or operations change.
- Never include secrets, personal data, or real customer URLs.

Prefer small modules and explicit boundaries. Validate external input at the boundary. Do not suppress errors without actionable context. Security-sensitive changes require tests and a threat-model update.
