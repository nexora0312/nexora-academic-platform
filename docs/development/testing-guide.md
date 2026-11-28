# Testing guide

## Available checks

Run these at the repository root:

```bash
npm test
npm run typecheck
npm run lint
npm run build
npm run prisma:validate
```

`npm test` invokes Vitest. The unit suite covers the API response helper, frontend API client,
User Management schemas and role policy, session authentication, and password hashing. Add
focused tests alongside related behavior when introducing functionality.

## End-to-end tests

The root manifest exposes `npm run test:e2e`, which invokes the Playwright runner script.
However, there is no Playwright configuration or E2E spec suite currently. The script is not
evidence of browser test coverage; E2E coverage is pending.

## Database checks

```bash
npm run prisma:validate
npm run prisma:generate
```

These require a backend `DATABASE_URL` where required by Prisma. See the
[migration guide](../database/migrations.md) before applying schema changes. The current health
handler can be checked at `http://localhost:3001/api/v1/health` when the backend and database
are running; it reports 503 when the database check fails.

CI is defined by the [workflow](../../.github/workflows/ci.yml), which runs the same validation
and build checks on pushes and pull requests.
