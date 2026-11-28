# Security documentation

The pages below distinguish implemented foundations from approved design decisions and controls
that are still pending. Approved assumptions are recorded in [assumptions](../assumptions.md).

| Page | Purpose |
|---|---|
| [Authentication security](./authentication-security.md) | Current auth implementation status and target |
| [Authorization and RBAC](./authorization-rbac.md) | Roles, enforcement status, and access-control expectations |
| [Password security](./password-security.md) | Password storage status and required safeguards |
| [Session security](./session-security.md) | Implemented session cookie behavior and pending controls |
| [API security](./api-security.md) | Validation, CORS, error handling, and route protection |
| [Environment security](./environment-security.md) | Secret and database credential handling |

No page should be read as evidence that a control is implemented unless it is explicitly marked
as implemented.
