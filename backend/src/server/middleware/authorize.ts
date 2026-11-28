import { AppError } from "@/server/errors/app-error";
import { authenticateRequest } from "@/server/middleware/authenticate";

export function authorizeRole(userRole: string, allowedRoles: readonly string[]): boolean {
  return allowedRoles.includes(userRole);
}

export async function requireUser(
  request: Request,
  allowedRoles: readonly string[],
) {
  const authentication = await authenticateRequest(request);
  if (!authentication.authenticated) {
    throw new AppError(authentication.message, 401);
  }
  if (!authorizeRole(authentication.role, allowedRoles)) {
    throw new AppError("You do not have permission to manage users.", 403);
  }
  return { id: authentication.userId, role: authentication.role };
}

export function assertTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) {
    throw new AppError("A trusted request origin is required.", 403);
  }

  const trustedOrigin = new URL(
    process.env.FRONTEND_URL ?? "http://localhost:3000",
  ).origin;
  if (origin !== trustedOrigin) {
    throw new AppError("This request origin is not allowed.", 403);
  }
}
