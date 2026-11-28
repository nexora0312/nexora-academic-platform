# Authorization and RBAC

## Current implementation

The Prisma schema relates each `User` to one `Role`, and the seed script defines the initial role
records. The User Management reference endpoints load the existing session and role from Prisma,
allow only `SUPER_ADMIN` and `ADMIN` at the route boundary, and prevent regular administrators from
managing or assigning `ADMIN` and `SUPER_ADMIN` accounts. The health endpoint remains public.

This is a narrow example policy for User Management, not a complete platform permission matrix.
The remaining role-to-permission mapping and fine-grained resource rules are **To Be Confirmed**.

## Required when adding authorization

- Authenticate the request before evaluating permissions.
- Enforce authorization server-side on every protected operation; hiding UI controls is not
  access control.
- Deny access by default and distinguish authentication failures from forbidden actions.
- Validate ownership and resource scope in addition to coarse role checks.
- Add tests for allowed and denied roles, including direct API requests.

Do not treat a seeded role or a client-side control as authorization for other resources.
