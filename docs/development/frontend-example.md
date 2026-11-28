# Frontend reference: User Management and Authentication

The login UI is available at `/login`. Authenticated administrators can manage accounts at
`/admin/users`; the home page sends administrators there and shows a role-aware landing state to
other authenticated roles. Unauthenticated users are redirected to `/login`. User Management
lists, searches, creates, and edits user accounts. Feature code is grouped under
[`frontend/src/features/users/`](../../frontend/src/features/users/); the frontend calls the
backend over HTTP and never imports Prisma or connects to MySQL.

## Feature layout

```text
frontend/src/features/users/
  components/user-management.tsx
  components/user-dialog.tsx
  components/user-form.tsx
  components/user-list.tsx
  components/user-table.tsx
  hooks/use-users.ts
  schemas/user.schema.ts
  services/user-api.ts
  types/user.types.ts
```

The authentication feature is organized separately:

```text
frontend/src/app/(auth)/login/page.tsx
frontend/src/app/(dashboard)/admin/layout.tsx
frontend/src/features/auth/
  components/account-controls.tsx
  components/auth-state-hydrator.tsx
  components/login-form.tsx
  hooks/use-auth.ts
  schemas/auth.schema.ts
  services/auth-api.ts
  services/auth-server.ts
  services/authorization.ts
  types/auth.types.ts
```

The App Router page is a Server Component that mounts `UserManagement`, a focused Client Component
for loading state, search, dialog flow, and mutations. `UserList` filters the API response locally
by profile name or email, and `UserTable` displays status, role, creation date, and an edit action.
The API returns at most 100 recent records, so the summary cards are explicitly counts of the
loaded results, not global database totals. The User model has no name column; the backend derives
a display name from an existing student or lecturer profile when one is present.

### Validate form values

The create and update schemas use Zod. Email addresses are normalized before they are sent to the
server, and the create schema enforces the example password length:

```ts
export const createUserSchema = z.object({
  email: z.email().max(255).transform((email) => email.toLowerCase()),
  password: z.string().min(12).max(128),
  roleName: userRoleSchema,
  isActive: z.boolean(),
});
```

`UserForm` validates before calling its submit handler and shows field-level validation and API
errors. The create fields are email, password, role, and active status; edit supports email, role,
and active status. Name and password changes are not accepted by the existing update endpoint.
`UserList` exposes loading, authentication-required, API error, empty, and populated states.

### Connect to the API

`useUsers` owns request and authentication state and delegates all network work to `userApi`. The
service calls the shared `apiRequest` helper, which reads the public `NEXT_PUBLIC_API_URL`, includes
credentials, and retains HTTP status on API errors so a 401 can be explained as an authentication
requirement. Configure the variable as the backend API base URL, normally ending in `/api/v1`.

```ts
async function getUser(id: string): Promise<User> {
  const response = await apiRequest<ApiEnvelope<unknown>>(
    `/users/${encodeURIComponent(id)}`,
  );
  return parseResponse(response, userResponseSchema).data;
}
```

The API response is parsed with Zod before it is used. Do not treat browser-side validation as an
authorization control: the backend validates every request again.

## Sign in and restore the session

The login page at `frontend/src/app/(auth)/login/page.tsx` submits email and password through
`features/auth/hooks/use-auth.ts` and `features/auth/services/auth-api.ts`. The shared
`apiRequest` helper includes credentials; the browser receives the backend's HTTP-only
`campus360_session` cookie and never reads or stores its value. `auth.store.ts` contains only the
public current-user display data and UI state.

On server renders, `features/auth/services/auth-server.ts` reads the incoming cookie and forwards
it to `GET /api/v1/auth/me`. The `/admin` layout requires that authenticated user and allows only
`SUPER_ADMIN` and `ADMIN`; other roles are sent to the role-aware home page. The `/login` page
redirects an already authenticated user. All six existing roles can authenticate; role-specific
portals other than administration are outside this reference feature.

The login form validates locally for usability, while the backend independently validates the
request. API errors are displayed without inventing account details or exposing credentials.
There is no remember-me option because sessions have a fixed eight-hour lifetime. The hook's
`restore` method is available for client-driven restoration; normal App Router restoration uses the
server `/auth/me` check so protected content is not rendered before authorization.

## UI dependencies

The frontend uses accessible native form controls, HTML dialog semantics, Tailwind CSS, Lucide React,
and Zod. It does not add a second UI component framework.

## Run and test

From the repository root:

```bash
npm run dev:frontend
npm run typecheck --workspace frontend
npm run build:frontend
npm test
```

Set `frontend/.env.local`'s `NEXT_PUBLIC_API_URL` to the reachable backend API, normally ending in
`/api/v1`. Login and user-management browser tests require an existing active user with a seeded
role and a reachable database. User search runs in the browser over the latest users returned by
the existing list API; it does not claim to search beyond those records.
