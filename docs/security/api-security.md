# API security

## Implemented

- `GET /api/v1/health` is intentionally unauthenticated and performs a database `SELECT 1`.
- The User Management reference endpoints authenticate the existing session cookie, require an
  active account with `ADMIN` or `SUPER_ADMIN`, validate request bodies, and use the shared
  response/error helpers.
- User Management mutations check `Origin` against `FRONTEND_URL` (default
  `http://localhost:3000`).
- The backend Next.js configuration sets CORS response headers for `/api/v1/*`, using
  `FRONTEND_URL` (or `http://localhost:3000`) as the allowed origin.
- Shared response and error helpers exist. The health handler logs a database-check failure
  and returns a generic `503 Database unavailable` response.

## Pending

- Login, session issuance/revocation, and rate limiting remain unimplemented.
- `shouldRateLimit()` always returns false.
- The complete CSRF controls (including the approved double-submit token approach) are not
  implemented. CORS and an Origin check alone are not a complete CSRF defense.

When adding routes, validate inputs at the boundary, avoid exposing internal exception details,
protect state-changing operations, and test unauthenticated, unauthorized, malformed, and
rate-limited cases. Refer to the [API conventions](../api/api-conventions.md) for response
formats.
