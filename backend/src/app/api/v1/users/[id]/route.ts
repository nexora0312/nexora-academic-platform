import { NextResponse } from "next/server";
import { successResponse } from "@/lib/api-response";
import { AppError } from "@/server/errors/app-error";
import { handleApiError } from "@/server/errors/error-handler";
import {
  assertTrustedOrigin,
  requireUser,
} from "@/server/middleware/authorize";
import { userService } from "@/server/services/user.service";
import {
  updateUserSchema,
  userIdSchema,
} from "@/server/validators/user.schema";

const USER_MANAGEMENT_ROLES = ["SUPER_ADMIN", "ADMIN"] as const;
type UserRouteContext = { params: Promise<{ id: string }> };

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

async function readUserId(context: UserRouteContext): Promise<string> {
  const { id } = await context.params;
  const parsed = userIdSchema.safeParse(id);
  if (!parsed.success) {
    throw new AppError("User ID must be a valid UUID.", 400);
  }
  return parsed.data;
}

export async function GET(request: Request, context: UserRouteContext) {
  try {
    await requireUser(request, USER_MANAGEMENT_ROLES);
    const user = await userService.getUser(await readUserId(context));
    return NextResponse.json(successResponse(user, "User retrieved"));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: UserRouteContext) {
  try {
    assertTrustedOrigin(request);
    const actor = await requireUser(request, USER_MANAGEMENT_ROLES);
    const id = await readUserId(context);
    const parsed = updateUserSchema.safeParse(await readJsonBody(request));
    if (!parsed.success) {
      throw new AppError(
        "User data is invalid.",
        400,
        parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      );
    }

    const user = await userService.updateUser(id, parsed.data, actor);
    return NextResponse.json(successResponse(user, "User updated"));
  } catch (error) {
    return handleApiError(error);
  }
}
