# Frontend architecture

The frontend is an independent Next.js App Router application in `frontend/`. The root page
demonstrates the User Management reference feature. Authentication and other dashboard areas are
not implemented.

| Area | Current contents/status |
|---|---|
| `frontend/src/app/` | Root page, layout, global styles, favicon |
| `frontend/src/components/` | Empty placeholder |
| `frontend/src/features/users/` | User Management reference form, list, schemas, API service, and hook |
| `frontend/src/hooks/` | Empty placeholder |
| `frontend/src/services/api-client.ts` | Shared HTTP request helper used by User Management |
| `frontend/src/lib/` | `cn` class-name helper |
| `frontend/src/locales/` | English and Sinhala JSON foundations; no runtime i18n integration |
| `frontend/src/types/` | Empty placeholder |

The browser-facing backend base URL is `NEXT_PUBLIC_API_URL`; it is public configuration, not a
secret. Frontend source does not import Prisma or database credentials. Other dashboard features,
client-side authentication, and runtime i18n remain pending.
