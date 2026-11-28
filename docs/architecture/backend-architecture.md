# Backend Architecture

The standalone Next.js API application lives in `backend/`; all public endpoints are under
`backend/src/app/api/v1`. Route Handlers validate input and delegate to server services. Services
contain application rules; repositories isolate Prisma queries. Authentication, authorization,
validation, errors, and email code remain in `backend/src/server`. Prisma schema, seed scripts, and
migrations belong to `backend/prisma`.
