# Database schema

This reference reflects the current
[`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma). The model is the authority;
the migration history directory is empty. All IDs are Prisma `String` values with UUID defaults
and explicit MySQL `CHAR(36)` types. Date/time fields use Prisma `DateTime`; the SQL reference DDL
uses `DATETIME(3)`.

## Tables and columns

| Table | Columns (Prisma type; explicit native type where declared) |
|---|---|
| `roles` | `id String @db.Char(36)` (UUID primary key); `name String @db.VarChar(50)`; `createdAt DateTime`; `updatedAt DateTime` |
| `users` | `id String @db.Char(36)` (UUID primary key); `email String @db.VarChar(255)`; `passwordHash String @db.VarChar(255)`; `isActive Boolean` (default `true`); `roleId String @db.Char(36)`; `createdAt DateTime`; `updatedAt DateTime` |
| `departments` | `id String @db.Char(36)` (UUID primary key); `code String @db.VarChar(20)`; `name String @db.VarChar(255)`; `createdAt DateTime`; `updatedAt DateTime` |
| `courses` | `id String @db.Char(36)` (UUID primary key); `code String @db.VarChar(20)`; `title String @db.VarChar(255)`; `departmentId String @db.Char(36)`; `createdAt DateTime`; `updatedAt DateTime` |
| `student_profiles` | `id String @db.Char(36)` (UUID primary key); `userId String @db.Char(36)`; `studentCode String @db.VarChar(50)`; `displayName String @db.VarChar(255)`; `createdAt DateTime`; `updatedAt DateTime` |
| `lecturer_profiles` | `id String @db.Char(36)` (UUID primary key); `userId String @db.Char(36)`; `employeeCode String @db.VarChar(50)`; `displayName String @db.VarChar(255)`; `createdAt DateTime`; `updatedAt DateTime` |
| `sessions` | `id String @db.Char(36)` (UUID primary key); `userId String @db.Char(36)`; `expiresAt DateTime`; `createdAt DateTime`; `updatedAt DateTime` |
| `password_reset_tokens` | `id String @db.Char(36)` (UUID primary key); `userId String @db.Char(36)`; `tokenHash String @db.Char(64)`; `expiresAt DateTime`; `usedAt DateTime?`; `createdAt DateTime` |

The SQL reference DDL uses MySQL `BOOLEAN` for `isActive`; the remaining Prisma `String` and
`DateTime` native mappings should be taken from migrations when they exist. All fields are
required except `PasswordResetToken.usedAt` and the optional `User.studentProfile` /
`User.lecturerProfile` relations.

## Unique constraints and indexes

| Table | Unique | Additional indexes |
|---|---|---|
| `roles` | `name` | — |
| `users` | `email` | `roleId` |
| `departments` | `code` | — |
| `courses` | `code` | `departmentId` |
| `student_profiles` | `userId`, `studentCode` | — |
| `lecturer_profiles` | `userId`, `employeeCode` | — |
| `sessions` | — | `userId`, `expiresAt` |
| `password_reset_tokens` | `tokenHash` | `userId`, `expiresAt` |

All eight tables use mapped snake_case names. Relation details and delete behavior are in
[relationships](./relationships.md). The reference DDL is split between
[`01_initial_schema.sql`](../../database/sql/01_initial_schema.sql) and
[`03_authentication_tables.sql`](../../database/sql/03_authentication_tables.sql); it is for
review and operations, not a substitute for Prisma migrations.
