# Database design

The backend uses Prisma Client with the MySQL provider. Docker Compose specifies `mysql:8.4`,
InnoDB, and `utf8mb4` in the SQL reference DDL. The Prisma schema is
[`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma); Prisma migrations are the
only approved schema-change mechanism.

The current schema is a small foundation for roles, users, departments, courses, student and
lecturer profiles, sessions, and password-reset tokens. It does not yet include enrollment,
attendance, academic-year, assignment, payment, or LMS data models. See the
[database schema](./database-schema.md) and [relationships](./relationships.md).

The repository currently has no migration files. Baseline/adoption of any existing database is
**To Be Confirmed**. Do not infer that the SQL reference scripts are migration history.
