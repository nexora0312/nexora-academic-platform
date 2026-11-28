# Database

Prisma migrations are the authoritative mechanism for schema changes. SQL files under
`sql/` provide reviewable reference and operational scripts and must remain synchronized.
The Prisma schema and seed script are located in `backend/prisma/`. The source repository had
an empty `prisma/migrations/` directory and no migration files, so no migration history was
available to move; this restructuring did not create migrations or modify/reset a database.
