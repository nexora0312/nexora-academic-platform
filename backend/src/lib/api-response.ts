export type ApiSuccess<T = unknown, M = unknown> = {
  success: true;
  message: string;
  data: T;
  meta: M;
};

export type ApiError = {
  success: false;
  message: string;
  data: null;
  errors: unknown[];
  meta: unknown;
};

export function successResponse<T, M = unknown>(
  data: T,
  message = "Success",
  meta = null as M,
): ApiSuccess<T, M> {
  return { success: true, message, data, meta };
}

export function errorResponse(
  message: string,
  errors: unknown[] = [],
  meta: unknown = null,
): ApiError {
  return { success: false, message, data: null, errors, meta };
}
