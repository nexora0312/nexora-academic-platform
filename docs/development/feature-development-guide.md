# Feature development guide

This guide uses the User Management reference implementation as the project example. Frontend and
backend are separate Next.js applications in their own workspaces; connect them only through the
versioned HTTP API.

## Organization and naming

- Add UI modules under `frontend/src/features/<feature>/`.
- Keep feature components, hooks, API services, schemas, and types in their respective
  `components/`, `hooks/`, `services/`, `schemas/`, and `types/` folders.
- Add backend Route Handlers below `backend/src/app/api/v1/<resource>/`.
- Keep input schemas in `backend/src/server/validators/`, business rules in
  `backend/src/server/services/`, and database queries in
  `backend/src/server/repositories/`.
- Use lowercase kebab-case file names (`user.schema.ts`, `user.service.ts`) and PascalCase for
  React components and TypeScript types (`UserForm`, `User`).
- Use named exports for feature modules and explicit input/output types.

## Create a frontend feature

1. Define the feature's Zod request schema and TypeScript types.
2. Put HTTP operations in a feature service using `frontend/src/services/api-client.ts`.
3. Use a feature hook for loading and mutation state; keep rendering in reusable components.
4. Provide visible loading, error, empty, and success states.
5. Mount the feature from the relevant page or app composition point.
6. Configure `NEXT_PUBLIC_API_URL` to the backend `/api/v1` base URL. It is public configuration,
   never a place for database credentials or private secrets.

The User Management page at `/admin/users` mounts reusable feature components from an App Router
Server Component. The client API service validates the API envelope instead of assuming that a
TypeScript generic proves the JSON response is valid. The form schema and server request schema
both validate untrusted values. Search is applied client-side to the API's bounded list response.

The Authentication reference feature at `/login` follows the same feature structure. Its client
service uses the shared credentialed API client; its auth hook updates only public user display
state in Zustand. A server-only helper forwards the HTTP-only session cookie to `/auth/me`, and
the admin layout makes a server-side authentication and role decision before rendering protected
pages.

## Create a backend API

1. Add Route Handler methods for the resource and keep them limited to boundary concerns.
2. Parse path and body input with Zod; return a 400 response for invalid requests.
3. Authenticate the request and perform server-side authorization for every protected method.
4. Delegate work to a service that owns business decisions and maps expected conflicts to
   `AppError`.
5. Add repository functions for Prisma reads/writes; select only fields safe to return.
6. Return the shared response envelope and map unexpected errors to a generic response while
   logging only safe diagnostic metadata.
7. Add focused tests and update the endpoint documentation.

Do not treat CORS, hidden buttons, or client-side validation as authorization. State-changing
cookie-authenticated routes must also enforce the project's CSRF/origin policy.

## Add Zod validation

Use separate create/update schemas when their requirements differ. Strict object schemas prevent
unexpected fields from silently becoming part of the API contract. Normalize data such as email
addresses in the schema and apply the same validation on both sides of the network boundary.

The User Management API accepts a `roleName` and resolves its ID from the existing `Role` model;
the browser does not need hard-coded database identifiers. Zod schemas should reject invalid
values rather than returning success-shaped fallbacks.

For authentication, validate credentials with a strict backend schema and normalize email before
the service lookup. Keep password verification and session issuance in the service, and session
queries in the repository. Return a public user object only; never return a password hash or
session identifier. Authentication responses use the common `{ success, message, data, meta }`
envelope, and invalid credentials should not reveal whether an account exists.

## Use a Prisma Repository

Repositories own Prisma queries and select public data explicitly. Services should not import
Prisma to perform routine data access, and Route Handlers should not query the database. Keep
secrets and database URLs in backend-only environment variables. Do not change models or
migrations unless the requested behavior cannot be implemented with the existing schema.

## Connect and verify

The frontend uses `apiRequest` with `credentials: "include"` so the browser sends the session
cookie. The backend checks that cookie against the session table and applies role-based access
before calling the feature service. Configure the matching backend `FRONTEND_URL` for allowed
browser origins. When an authenticated page request returns 401, redirect the user to `/login`;
feature-level API states may show an authentication-required message. Never issue a fake session or
bypass backend checks.

Run focused checks first, then the relevant workspace checks:

```bash
npm test
npm run typecheck --workspace frontend
npm run typecheck --workspace backend
npm run lint
npm run prisma:validate
npm run build:frontend
npm run build:backend
```

Use `npm run prisma:generate` only when client generation is required. Do not reset a shared
database. The repository currently has no end-to-end Playwright suite; do not claim browser
coverage until one exists.

## Reference implementation limits

Authentication uses eight-hour server-side sessions and the existing `Session` model. A fixed
session expiry means no refresh route is needed. Login throttling, MFA, password reset, email
verification, full CSRF-token protection, and role-specific portals beyond administration remain
unimplemented. Deployment-level login throttling and a reviewed CSRF strategy are required before
public exposure. User search remains limited to the existing 100-user API response; account
deletion remains unsupported.
