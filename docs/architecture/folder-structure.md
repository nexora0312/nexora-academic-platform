# Folder structure

```text
frontend/
  src/app/          Next.js UI routes and layout
  src/components/   Shared UI placeholder
  src/features/     Feature placeholder
  src/hooks/        Hook placeholder
  src/services/     HTTP API client
  src/lib/          Frontend utilities
  src/types/        Frontend type placeholder
  src/locales/      English and Sinhala JSON foundations
  public/           Static assets
backend/
  src/app/api/v1/   Versioned Next.js Route Handlers (health only today)
  src/server/       Auth, middleware, error, and email helpers/stubs
  src/lib/          API envelopes, env, logger, Prisma client, constants
  src/types/        Backend type placeholder
  prisma/           Schema and seed; migration directory currently has no files
database/
  sql/              SQL reference and operational scripts
docs/               Architecture, API, database, development, security guides
tests/              Vitest unit tests and future test placeholders
.github/workflows/  CI and pull-request checks
```

The root `package.json` manages the `frontend` and `backend` npm workspaces. There is no root
application `src/` directory and no third application. Empty directories are retained through
`.gitkeep` markers where the repository requires them.

See the [frontend](./frontend-architecture.md) and [backend](./backend-architecture.md) pages for
implementation status.
