# Frontend Architecture

The standalone Next.js frontend lives in `frontend/`. Route groups organize public, authentication,
and role-dashboard pages; feature folders group components, hooks, services, schemas, and types.
Shared UI belongs in `frontend/src/components`. UI text should use locale keys rather than hardcoded
strings. Frontend requests use the HTTP client in `frontend/src/services` and the
`NEXT_PUBLIC_API_URL` environment variable; frontend code must not import Prisma or access MySQL.
