# Setup Guide

1. Copy `frontend/.env.example` to `frontend/.env.local` and
   `backend/.env.example` to `backend/.env`; set local credentials as needed.
2. Run `docker compose up -d mysql` to start MySQL 8.4 with its persistent volume.
3. Run `npm ci` at the repository root to install both workspace applications.
4. Run `npm run prisma:validate` and `npm run prisma:generate`.
5. Start the API and frontend independently in separate terminals with `npm run dev:backend` and
   `npm run dev:frontend`.

The frontend listens on port 3000 and the API on port 3001. The frontend calls the API base URL
configured by `NEXT_PUBLIC_API_URL`. `npm run build` builds both applications; `npm run typecheck`,
`npm run lint`, and `npm test` validate the workspaces.
