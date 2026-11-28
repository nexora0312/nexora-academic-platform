import { NextResponse } from "next/server";
import { successResponse } from "@/lib/api-response";
import { AppError } from "@/server/errors/app-error";
import { handleApiError } from "@/server/errors/error-handler";
import {
  assertTrustedOrigin,
  requireUser,
} from "@/server/middleware/authorize";
import { userService } from "@/server/services/user.service";
import { createUserSchema } from "@/server/validators/user.schema";

const USER_MANAGEMENT_ROLES = ["SUPER_ADMIN", "ADMIN"] as const;

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

export async function GET(request: Request) {
  try {
    await requireUser(request, USER_MANAGEMENT_ROLES);
    const users = await userService.listUsers();
    return NextResponse.json(successResponse(users, "Users retrieved"));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    assertTrustedOrigin(request);
    const actor = await requireUser(request, USER_MANAGEMENT_ROLES);
    const parsed = createUserSchema.safeParse(await readJsonBody(request));
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

    const user = await userService.createUser(parsed.data, actor);
    return NextResponse.json(successResponse(user, "User created"), {
      status: 201,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
