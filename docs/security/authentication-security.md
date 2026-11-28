# Authentication security

## Current implementation

`POST /api/v1/auth/login` verifies the existing scrypt password hash, rejects inactive accounts,
and creates an eight-hour server-side session. The session UUID is sent only in the HTTP-only
`campus360_session` cookie. `POST /api/v1/auth/logout` invalidates that session;
`GET /api/v1/auth/me` returns the public user profile for a valid session. All six existing roles
are supported; protected user-management APIs and the admin UI separately restrict access to
`SUPER_ADMIN` and `ADMIN`.

The Prisma schema contains `User`, `Session`, and `PasswordResetToken` models, but the presence of
these models does not implement authentication. See the [authentication flow](../architecture/authentication-flow.md).

## Approved direction

Session-based authentication is implemented without schema changes. Cookie attributes are
HttpOnly, SameSite=Lax, Secure in production, and Path=/. Login and logout enforce the configured
`FRONTEND_URL` Origin. A CSRF-token mechanism, login throttling, TOTP MFA, password reset, session
rotation on privilege changes, and recovery controls remain unimplemented. These controls are
required before broad public exposure; preserve the
[assumption marker](../assumptions.md) “ATI/technical to confirm.”
