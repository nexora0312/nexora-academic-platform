# Getting started

## Requirements

- Node.js 24 and npm (the CI workflows use Node.js 24).
- Docker Engine with Docker Compose if you want to run the bundled MySQL service.

## Install and configure

From the repository root, install both npm workspaces:

```bash
npm ci
```

Copy the example files to their local names (PowerShell):

```powershell
Copy-Item frontend\.env.example frontend\.env.local
Copy-Item backend\.env.example backend\.env
```

Replace example values with local configuration. See the
[environment setup](./environment-setup.md) guide.

## Start database and applications

Start the Compose MySQL service:

```bash
docker compose up -d mysql
```

The current repository has no checked-in Prisma migration files. Review
[migration status and safety](../database/migrations.md) before attempting to initialize or
baseline a database.

Run each app in its own terminal:

```bash
npm run dev:backend
npm run dev:frontend
```

The backend listens on port 3001 and the frontend on port 3000. The backend health endpoint is
`http://localhost:3001/api/v1/health`. For the complete command list, see
[development workflow](./development-workflow.md).
