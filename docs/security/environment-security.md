# Environment security

- Keep real `.env` and `.env.local` files out of version control; the repository ignores local
  environment files. Use the app-specific `.env.example` files only as templates.
- Keep `DATABASE_URL`, `SESSION_SECRET`, and SMTP credentials in the backend environment only.
  Never prefix them with `NEXT_PUBLIC_`; that prefix exposes values to browser bundles.
- `NEXT_PUBLIC_API_URL` is intentionally public and must contain only the API base URL.
- Use unique, strong secrets and least-privilege database credentials outside local development.
  Do not reuse the example Compose credentials in a deployed environment.
- Restrict access to CI/deployment secrets and rotate them if exposed. Never put secrets in source,
  logs, screenshots, or pull-request evidence.
- The backend environment schema accepts optional values and is not currently called by the
  health route. Do not assume missing/malformed variables will be consistently rejected at
  startup yet.
- Prisma/database access belongs in the backend. The frontend must communicate over HTTP and
  must not receive database credentials.

See [environment setup](../development/environment-setup.md) for variable purposes and local
configuration.
