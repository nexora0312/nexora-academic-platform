# Monorepo architecture

The repository uses npm workspaces for the `frontend` and `backend` Next.js applications.
The frontend owns UI concerns and calls the versioned backend API. The backend owns
authentication, authorization, validation, business services, repositories, and Prisma access.

Shared source code is not stored in a root `src/` directory. `database/` holds reviewable SQL
reference material, while `backend/prisma/migrations/` remains the authoritative schema-change
mechanism.
