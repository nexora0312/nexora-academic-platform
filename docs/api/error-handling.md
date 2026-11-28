# API error handling

## Implemented response helpers

`backend/src/lib/api-response.ts` defines a common success envelope and error envelope:

```ts
type ApiSuccess<T, M> = {
  success: true;
  message: string;
  data: T;
  meta: M;
};

type ApiError = {
  success: false;
  message: string;
  data: null;
  errors: unknown[];
  meta: unknown;
};
```

The health handler returns the success shape on HTTP 200 and the error shape with HTTP 503 when
its database query fails. See the [endpoint contract](./api-overview.md#implemented-endpoint).

`backend/src/server/errors/error-handler.ts` maps `AppError` to its `statusCode` and error list;
other errors become a generic HTTP 500 response and log safe error-name metadata. User Management
Route Handlers call this helper; it is not a globally applied error boundary.

## Endpoint guidance

Use the shared envelope for future JSON endpoints. Return an appropriate HTTP status as well as
the envelope. Do not send stack traces, SQL details, credentials, or internal exception messages
to clients. Log unexpected server errors without exposing sensitive connection data. Error codes,
field-error structure, and pagination metadata are **To Be Confirmed**.
