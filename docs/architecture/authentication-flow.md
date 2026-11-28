# Authentication flow

## Implemented flow

Login, logout, and current-user routes use the existing session model and cookie name. MFA and
password reset are not implemented; see [authentication security](../security/authentication-security.md).

```mermaid
sequenceDiagram
  actor User
  participant UI as Frontend
  participant API as Backend Route Handler
  participant Auth as Auth service
  participant DB as Prisma/MySQL
  User->>UI: Submit credentials
  UI->>API: POST /api/v1/auth/login
  API->>Auth: Validate credentials and authenticate
  Auth->>DB: Read user / persist 8-hour session
  DB-->>Auth: User and session result
  Auth-->>API: Authentication result
  API-->>UI: Public user and HttpOnly session cookie
  UI->>API: Later credentialed API request
```

Logout invalidates the session row; `/auth/me` validates the cookie and returns the current public
user. The server-side admin layout calls `/auth/me` before rendering protected pages. Origin
checks and SameSite cookies are implemented, but a full CSRF-token strategy and login throttling
remain pending. See [assumptions](../assumptions.md) and
[session security](../security/session-security.md).
