import { NextResponse } from "next/server";
import { successResponse } from "@/lib/api-response";
import { AppError } from "@/server/errors/app-error";
import { handleApiError } from "@/server/errors/error-handler";
import { setSessionCookie } from "@/server/auth/session-cookie";
import { assertTrustedOrigin } from "@/server/middleware/authorize";
import { authService } from "@/server/services/auth.service";
import { loginSchema } from "@/server/validators/auth.schema";

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new AppError("Request body must be valid JSON.", 400);
    }
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    assertTrustedOrigin(request);
    const parsed = loginSchema.safeParse(await readJsonBody(request));
    if (!parsed.success) {
      throw new AppError(
        "Login data is invalid.",
        400,
        parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      );
    }

    const result = await authService.login(parsed.data);
    const response = NextResponse.json(
      successResponse(result.user, "Signed in"),
    );
    setSessionCookie(response, result.sessionId, result.expiresAt);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
