# Relationships

| Parent | Child | Cardinality | Foreign key / behavior |
|---|---|---|---|
| `Role` | `User` | One-to-many | `User.roleId → Role.id`; delete restricted |
| `Department` | `Course` | One-to-many | `Course.departmentId → Department.id`; delete restricted |
| `User` | `StudentProfile` | Optional one-to-one | Unique `StudentProfile.userId → User.id`; delete cascades |
| `User` | `LecturerProfile` | Optional one-to-one | Unique `LecturerProfile.userId → User.id`; delete cascades |
| `User` | `Session` | One-to-many | `Session.userId → User.id`; delete cascades |
| `User` | `PasswordResetToken` | One-to-many | `PasswordResetToken.userId → User.id`; delete cascades |

The user model has two optional profile relations; the schema does not enforce that a user has
exactly one of those profiles. No other relationships are present in the current
[Prisma schema](../../backend/prisma/schema.prisma).
