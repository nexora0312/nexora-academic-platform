# Assumptions

- The initial deployment targets one campus.
- English and Sinhala are supported as locale foundations.
- Prisma migrations are the sole schema-change mechanism.
- Authentication and LMS/finance workflows remain future implementation work.

## Approved decisions preserved

- UUID identifiers are stored as `CHAR(36)`. This matches the current Prisma schema.
- MFA uses TOTP.
- Deployment uses a single reverse proxy and exposes the UI and API under the same public origin.
- CSRF protection is intended to combine SameSite cookies, Origin checks, and double-submit tokens.
- All UI text uses i18n keys. English is the initial language; Sinhala is a supported locale
  foundation.

These are approved design assumptions, not statements that the corresponding controls or
features have been implemented. Local development currently exposes the frontend and backend on
separate ports; no reverse-proxy configuration is present. The locale JSON files are not wired to
a runtime i18n library, and CSRF, TOTP MFA, and authentication are pending.

## Open decisions

The User Management reference uses Node scrypt for initial password hashes and checks the existing
session cookie; verification, cookie attributes, session lifetime/rotation policy, reverse-proxy
configuration, MFA recovery flow, and existing-database migration baseline remain **To Be
Confirmed** (**ATI/technical to confirm**). Keep this marker for other undecided approved
assumptions rather than silently selecting a behavior.
