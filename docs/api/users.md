# Users API

**Status: Reference implementation.**

The API reuses the existing Prisma `User` and `Role` models. See the [backend example](../development/backend-example.md)
for the layer responsibilities and known limitations.

| Method | Path | Purpose | Success |
|---|---|---|---|
| GET | `/api/v1/users` | List at most 100 newest users | 200 |
| GET | `/api/v1/users/{id}` | Get one user by UUID | 200 |
| POST | `/api/v1/users` | Create a user | 201 |
| PATCH | `/api/v1/users/{id}` | Update email, role, or active status | 200 |

All four endpoints require an unexpired session in the `campus360_session` cookie and an active
user with the `SUPER_ADMIN` or `ADMIN` role. Mutations additionally require a trusted `Origin`.
The shared success/error envelopes are documented in [error handling](./error-handling.md).

Create accepts `{ "email", "password", "roleName", "isActive" }`; the password is hashed server
side. Patch accepts one or more of `{ "email", "roleName", "isActive" }`. Role names must be seeded
values from `backend/prisma/seed.ts`. Non-super-administrators cannot create, edit, or assign
administrator accounts. Password hashes are never returned.

DELETE is intentionally not exposed: the schema contains dependent user profiles and sessions,
and an account retention/deletion policy has not been approved. Login/session issuance, password
reset, and other account workflows remain out of scope.
