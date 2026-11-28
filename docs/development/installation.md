# Installation

## Prerequisites

| Tool | Use |
|---|---|
| Node.js 24 | Runtime and CI version |
| npm | Root workspace installation and scripts |
| Docker Compose | Optional local MySQL 8.4 and app containers |

## Install dependencies

The root manifest declares `frontend` and `backend` as npm workspaces. Install from the repository
root so the root lockfile stays authoritative:

```bash
npm ci
```

Do not run separate `npm install` commands inside the workspaces unless intentionally changing
dependencies. After changing a manifest, update the root lockfile with `npm install`, review the
lockfile, and verify with `npm ci`.

Configure local environment files using the [environment guide](./environment-setup.md), then
follow [getting started](./getting-started.md).
