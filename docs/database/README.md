# Database documentation

The [Prisma schema](../../backend/prisma/schema.prisma) defines the current eight models. Prisma
migrations are the authoritative mechanism for future schema changes; the migrations directory
currently contains no migration files.

| Page | Purpose |
|---|---|
| [Database design](./database-design.md) | Engine, schema authority, and design summary |
| [Database schema](./database-schema.md) | Models, fields, constraints, and indexes |
| [Relationships](./relationships.md) | Foreign-key relationships and delete behavior |
| [Migrations](./migrations.md) | Safe workflow and current baseline status |
| [Database conventions](./database-conventions.md) | Naming and schema rules |

Review the root [`database/README.md`](../../database/README.md) for SQL reference-file notes.
