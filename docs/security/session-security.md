# Session security

## Current implementation

The `campus360_session` cookie contains the UUID of a server-side Prisma `Session` row. Successful
login creates a session with a fixed eight-hour expiration; authentication checks both expiry and
the user's active status. Logout deletes the matching session row and expires the browser cookie.
There is no refresh route or sliding expiry.

The cookie is `HttpOnly`, `SameSite=Lax`, `Path=/`, and `Secure` in production. No session id is
returned in API response bodies. Cookie-authenticated login/logout mutations require a trusted
`Origin`; frontend and API deployments should remain same-site for Lax cookies to be sent.

## Approved direction and pending controls

The implementation does not yet include login throttling, session rotation on privilege changes,
concurrent-session controls, or revocation on password changes (password-change endpoints do not
exist). SameSite and Origin checks are not complete CSRF protection. Add a reviewed CSRF-token
strategy and deployment-level login throttling before exposing authentication to the public
internet. Preserve the assumption in [assumptions](../assumptions.md).
