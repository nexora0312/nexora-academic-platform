# Authentication API

Authentication reuses the existing Prisma `User`, `Role`, and `Session` models. No schema or
migration changes were required. Success responses use
`{ success, message, data, meta }`; errors use the existing error envelope.

## `POST /api/v1/auth/login`

Requires a request `Origin` matching `FRONTEND_URL` (defaults to
`http://localhost:3000` for local development). The strict request body is:

```json
{ "email": "admin@example.com", "password": "your-password" }
```

Email is normalized to lowercase. Password length is 1–128 characters. Invalid JSON or input
returns 400. Incorrect credentials, unknown users, inactive accounts, or a wrong password return
the same 401 response: `Invalid email or password.` On success, response data contains only `id`,
`email`, nullable `name`, and `role`.

The server creates an eight-hour session and sets `campus360_session` as an HTTP-only cookie with
`SameSite=Lax`, `Path=/`, and `Secure` in production. The session id is never included in JSON.

## `POST /api/v1/auth/logout`

Requires a trusted `Origin`. Deletes the current session row when a valid session cookie is
present, clears the cookie, and returns `{ "loggedOut": true }`. Logout is idempotent; an absent or
invalid cookie does not prevent clearing the browser cookie.

## `GET /api/v1/auth/me`

Requires a valid, unexpired session belonging to an active user. Returns `id`, `email`, nullable
profile-derived `name`, and the existing role. All six seeded roles are recognized. Missing,
expired, invalid, or inactive-user sessions return 401.

There is no refresh endpoint: sessions have a fixed eight-hour expiry and are not renewed. There
are no registration, MFA, or password-reset endpoints. A production deployment still needs
login throttling and a reviewed CSRF-token strategy; Origin checks and SameSite cookies are not
complete substitutes.
