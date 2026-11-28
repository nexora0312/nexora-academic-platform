# Development workflow

Run commands from the repository root unless noted.

## Start and build

```bash
npm run dev:frontend
npm run dev:backend
npm run build
npm run start
npm run start:backend
```

Development uses ports 3000 and 3001. Production `start` commands use the standalone build
outputs, so run `npm run build` first.

## Prisma

```bash
npm run prisma:validate
npm run prisma:generate
npm run prisma:seed
```

The backend `.env` must provide `DATABASE_URL` for schema validation and database operations.
The seed inserts the predefined roles with duplicate skipping. Schema changes must use Prisma
migrations; consult [migration guidance](../database/migrations.md) before touching a database.

## Quality checks

```bash
npm run typecheck
npm run lint
npm test
npm run test:e2e
```

The unit test command currently runs Vitest. The E2E command exists in the root manifest, but
there is no Playwright config/spec suite yet; see the [testing guide](./testing-guide.md).
CI runs install, Prisma validation/generation, typecheck, lint, tests, and builds as configured
in the [CI workflow](../../.github/workflows/ci.yml).
