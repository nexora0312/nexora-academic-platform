# Coding standards

- Use strict TypeScript and the app-local `@/*` alias (`src/*`).
- Keep UI code in `frontend/`; frontend code must not import Prisma or access database
  credentials.
- Keep server-only code in `backend/`. Route Handlers should remain small; business logic belongs
  in services and persistence belongs in repositories. User Management is the reference flow.
- Validate untrusted request input with Zod before business logic. The User Management endpoints
  are an example; other API request validation remains pending.
- Follow the approved i18n-key assumption for new UI text. Runtime localization is not wired yet,
  and the current scaffold page still contains literal English text.
- Use descriptive names, explicit response/status handling, and avoid returning internal errors
  or credentials to clients.
- Add focused tests for new behavior. Clearly document which account/authentication flows remain
  incomplete; do not describe placeholders as complete features.

Existing ESLint, TypeScript, and Vitest configurations are at the repository root and in each
app. See the [testing guide](./testing-guide.md).
