# Security Guidelines

Store passwords only as strong Argon2 or bcrypt hashes. Use secure HTTP-only session cookies,
CSRF protections for state-changing requests, server-side RBAC, rate limiting, and strict Zod
validation. Never commit real credentials or environment files.
