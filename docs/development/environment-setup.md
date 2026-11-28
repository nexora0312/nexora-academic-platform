# Environment setup

Each Next.js app loads environment files from its own project root. Keep real local files
untracked; `.env.example` files contain examples only.

## Frontend

`frontend/.env.example` defines:

| Variable | Purpose | Exposure |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL, normally ending in `/api/v1` | Public; bundled into browser code |

Set this to the externally reachable API URL for the environment. Public-prefixed values are
inlined at build time, so provide the production value when building the frontend image.

## Backend

`backend/.env.example` contains:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Prisma MySQL connection string |
| `SESSION_SECRET` | Reserved server-side secret; authentication code does not currently use it |
| `FRONTEND_URL` | Origin used by the backend Next.js CORS headers |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | Email configuration placeholders; email delivery is not configured |

Only backend code/configuration should read `DATABASE_URL` and `SESSION_SECRET`. Never rename
these to `NEXT_PUBLIC_*` or place them in frontend environment files.

`getServerEnv()` validates optional values with Zod if called, but is not currently used by the
health handler; environment enforcement is therefore incomplete. The backend `.env.example`
contains development examples, not production credentials. Replace them locally and use managed
secrets in deployed environments.

Compose also supports variables such as database credentials and `SESSION_SECRET` through
interpolation. Its defaults are for local development only. See the
[Compose file](../../docker-compose.yml) and [environment security](../security/environment-security.md).
