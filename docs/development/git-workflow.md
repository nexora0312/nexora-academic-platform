# Git workflow

1. Create a focused feature branch from the repository's default branch.
2. Keep changes scoped; do not commit `.env` files, credentials, generated builds, or local
   database data.
3. Before opening a pull request, run the relevant commands from the
   [development workflow](./development-workflow.md).
4. Open a pull request with a concise summary and validation evidence. The repository template
   asks for a summary and Prisma, TypeScript, lint, and test checkboxes:
   [pull request template](../../.github/PULL_REQUEST_TEMPLATE.md).
5. Request review, address feedback, and ensure the CI checks pass before merging.

Branch naming, merge strategy, approval count, and release process are **To Be Confirmed**.
