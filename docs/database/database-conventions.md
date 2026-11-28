# Database conventions

- Keep Prisma as the schema authority and make schema changes through versioned Prisma
  migrations.
- Use UUID primary keys stored as MySQL `CHAR(36)`, matching the current models and approved
  assumption.
- Map model/table names to lower snake_case; existing Prisma field names are camelCase and map
  directly to their SQL column names.
- Declare unique constraints and indexes in the Prisma schema when they are part of the data
  model.
- Specify referential actions on relations; current restrictions and cascades are listed in
  [relationships](./relationships.md).
- Retain SQL scripts as synchronized references; do not apply them as an alternate migration
  mechanism.
- Avoid adding models for planned SMS/LMS features until the requirements and schema are approved.

Collation and exact database-wide charset should be aligned between Prisma-generated migrations
and the SQL references when a migration baseline is established (**To Be Confirmed**).
