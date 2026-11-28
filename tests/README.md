# Test suite

- `unit/`: Vitest unit tests, currently grouped by service.
- `integration/`: integration-test location.
- `e2e/`: Playwright end-to-end test location.

Run the unit suite with `npm test`. The Playwright command is available as `npm run test:e2e`,
but no Playwright configuration or test specifications exist yet.
