import { NextResponse } from "next/server";
import { successResponse } from "@/lib/api-response";
import { handleApiError } from "@/server/errors/error-handler";
import { authService } from "@/server/services/auth.service";

export async function GET(request: Request) {
  try {
    const user = await authService.getCurrentUser(request);
    return NextResponse.json(successResponse(user, "Current user retrieved"));
  } catch (error) {
    return handleApiError(error);
  }
}
