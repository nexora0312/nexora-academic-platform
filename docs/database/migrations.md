# Prisma migrations

## Authority and current status

Prisma migrations are the authoritative schema-change mechanism. At documentation time,
`backend/prisma/migrations/` contains no migration files. The existing schema is documented in
[`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma); SQL files under
`database/sql/` are reference/operational material, not migration history.

The migration baseline for any pre-existing database is **To Be Confirmed**. Do not run a
first-time migration against a populated database until its current schema and migration
baseline have been reviewed. Do not use `prisma migrate reset` or `db push` as a substitute.

## Developer workflow

Set `DATABASE_URL` in `backend/.env`, then, from the repository root, create a named migration:

```bash
npm exec --workspace backend -- prisma migrate dev --schema prisma/schema.prisma --name descriptive_change
```

Review the generated SQL and schema diff, keep the migration directory in version control, and
validate/generate the client:

```bash
npm run prisma:validate
npm run prisma:generate
```

For a deployment pipeline, apply checked-in migrations without creating new ones:

```bash
npm exec --workspace backend -- prisma migrate deploy --schema prisma/schema.prisma
```

These are documented Prisma commands; no migration script is currently defined in the package
manifests. Database deployment and the initial baseline remain **To Be Confirmed**.
