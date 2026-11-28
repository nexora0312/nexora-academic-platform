import { NextResponse } from "next/server";
import { successResponse } from "@/lib/api-response";
import { handleApiError } from "@/server/errors/error-handler";
import { clearSessionCookie } from "@/server/auth/session-cookie";
import { assertTrustedOrigin } from "@/server/middleware/authorize";
import { authService } from "@/server/services/auth.service";

export async function POST(request: Request) {
  try {
    assertTrustedOrigin(request);
    await authService.logout(request);
    const response = NextResponse.json(
      successResponse({ loggedOut: true }, "Signed out"),
    );
    clearSessionCookie(response);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
