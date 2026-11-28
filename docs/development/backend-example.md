# Backend reference: User Management and Authentication

The User Management and Authentication APIs demonstrate the backend's Route Handler → validator →
service → repository → Prisma flow. The existing Prisma `User`, `Role`, `Session`,
`StudentProfile`, and
`LecturerProfile` models are reused without schema or migration changes. Password hashes are
excluded from every repository result.

## File organization

```text
backend/src/app/api/v1/users/route.ts
backend/src/app/api/v1/users/[id]/route.ts
backend/src/server/validators/user.schema.ts
backend/src/server/services/user.service.ts
backend/src/server/repositories/user.repository.ts
backend/src/server/errors/app-error.ts
backend/src/lib/api-response.ts
backend/src/app/api/v1/auth/login/route.ts
backend/src/app/api/v1/auth/logout/route.ts
backend/src/app/api/v1/auth/me/route.ts
backend/src/server/validators/auth.schema.ts
backend/src/server/services/auth.service.ts
```

### Route Handler

Handlers parse input, enforce authentication/origin checks, delegate to the service, and map errors
to the common response envelope:

```ts
const parsed = createUserSchema.safeParse(await readJsonBody(request));
if (!parsed.success) {
  throw new AppError("User data is invalid.", 400, parsed.error.issues);
}
const user = await userService.createUser(parsed.data, actor);
return NextResponse.json(successResponse(user, "User created"), {
  status: 201,
});
```

### Validation and business rules

`user.schema.ts` validates request bodies and UUID path parameters with Zod. The service hashes the
initial password, checks that the requested seeded role exists, maps duplicate emails to HTTP 409,
and prevents non-super-administrators from assigning or managing `ADMIN` and `SUPER_ADMIN` roles.
Only `SUPER_ADMIN` and `ADMIN` can access the routes; administrators cannot disable or change the
role of their own account.

### Repository and Prisma

The repository is the only layer in this feature that performs Prisma queries. It selects public
user fields, role data, and the optional related profile display names. Its response mapper exposes
the selected profile name as a nullable `name`, without exposing profile internals:

```ts
const userSelect = {
  id: true,
  email: true,
  isActive: true,
  role: { select: { id: true, name: true } },
  createdAt: true,
  updatedAt: true,
  studentProfile: { select: { displayName: true } },
  lecturerProfile: { select: { displayName: true } },
} as const satisfies Prisma.UserSelect;
```

New database access belongs in a repository method. Do not query Prisma from a Route Handler or
frontend module, and do not return password hashes.

## Endpoints

| Method | Path | Access | Behavior |
|---|---|---|---|
| GET | `/api/v1/users` | SUPER_ADMIN, ADMIN | Return up to 100 newest users |
| GET | `/api/v1/users/{id}` | SUPER_ADMIN, ADMIN | Return one user or 404 |
| POST | `/api/v1/users` | SUPER_ADMIN, ADMIN | Create a user; password is scrypt-hashed server-side |
| PATCH | `/api/v1/users/{id}` | SUPER_ADMIN, ADMIN | Update email, role, or active status |

Responses use the existing `{ success, message, data, meta }` envelope. Errors use the matching
error envelope and do not expose database details. Mutations require an `Origin` matching
`FRONTEND_URL` (or `http://localhost:3000` in local development). The list endpoint returns at most
the 100 newest records; the frontend searches within that response.

## Authentication and scope

The handlers validate the `campus360_session` cookie against an unexpired Prisma `Session` and an
active user. The authentication API is implemented using the existing schema; no migration is
required.

There is deliberately no DELETE route. The schema has dependent profiles, sessions, and password
reset tokens, and the project has no approved account-deletion/retention policy. The role list is
the seeded list in `backend/prisma/seed.ts`; seed those roles before creating accounts.

## Login and session endpoints

| Method | Path | Access | Behavior |
|---|---|---|---|
| POST | `/api/v1/auth/login` | Public, trusted Origin required | Validate credentials, verify the existing scrypt hash, create an eight-hour session, and set the session cookie |
| POST | `/api/v1/auth/logout` | Trusted Origin required | Invalidate the matching session if present and clear the cookie |
| GET | `/api/v1/auth/me` | Valid session required | Return the authenticated user's public id, email, optional profile name, and role |

`auth.schema.ts` validates login data and UUID session identifiers with Zod. Route Handlers enforce
the Origin policy and shared error envelope; `auth.service.ts` owns credential verification and
session decisions; `user.repository.ts` is the only layer that queries Prisma. Login looks up only
the necessary account fields, verifies the existing
`scrypt$<salt-hex>$<derived-key-hex>` format with constant-time key comparison, and uses a dummy
scrypt hash for unknown accounts. Invalid, inactive, and unknown accounts receive the same 401
message. Neither password hashes nor session ids appear in the response body.

The existing `Session` model stores a UUID session id, user id, and expiration. No schema or
migration change was needed. Cookie options are `HttpOnly`, `SameSite=Lax`, `Path=/`, and `Secure`
in production, with an eight-hour expiration. Logout deletes only the matching session row and is
safe to repeat. There is no refresh endpoint because sessions have a fixed expiry and are not
renewed. `/auth/me` accepts all six seeded roles; administrative authorization remains on the
protected feature routes.

Cookie-authenticated mutations check `Origin` against `FRONTEND_URL`. Deploy the browser and API
on the same site so `SameSite=Lax` cookies accompany credentialed API calls. Origin checking and
SameSite are not a complete CSRF program; a reviewed CSRF-token strategy, login throttling, MFA,
password reset, and account-recovery processes remain outstanding before public exposure.

The frontend's server-side admin layout forwards the session cookie to `/auth/me` before rendering
admin pages. The frontend must never import Prisma or store a cookie/session id in Zustand or
localStorage.

## Name and password fields

`User` stores email, password hash, status, role, and timestamps; it has no name field. When an
account has a student or lecturer profile, the repository derives a display name from that profile.
Other roles have no name in the current schema. User creation accepts email, password, role, and
active status. The existing PATCH schema supports email, role, and active status, not name or
password changes. These limits are reflected in the frontend form.

## Run and test

```bash
npm run typecheck --workspace backend
npm run prisma:validate
npm test
npm run build:backend
```

Prisma validation/generation needs the configured backend `DATABASE_URL`; these checks do not reset
or migrate the database.
