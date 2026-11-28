# API conventions

## Prefix and routing

Versioned routes belong below `backend/src/app/api/v1/`; the API prefix is `/api/v1/`. Next.js
Route Handlers use Web `Request`/`Response` APIs. Route-specific handler files—not empty
directories—define the available endpoints.

## Methods and payloads

The health endpoint supports `GET`; the User Management endpoints support `GET`, `POST`, and
`PATCH`. Next.js Route Handlers also support `PUT`, `DELETE`, `HEAD`, and `OPTIONS`; methods for
other resources are **To Be Confirmed**.

For JSON endpoints:

- Keep read-only operations on `GET`; use request bodies for create/update operations where
  appropriate.
- Validate untrusted path, query, and JSON body values before business logic using Zod.
- Keep database reads/writes in repositories and business rules in services. The health check is
  an exception and queries Prisma directly.
- Return HTTP status codes and the response envelopes described in
  [error handling](./error-handling.md).

## CORS and authentication

The backend Next.js config adds CORS headers to `/api/v1/:path*`, allowing the configured
`FRONTEND_URL` (defaulting to the local frontend origin), credentials, and listed methods/headers.
This is not authentication or complete CSRF protection. User Management requires an authenticated
session and applies an Origin check on mutations; other routes may have different access rules.
See [API security](../security/api-security.md).
