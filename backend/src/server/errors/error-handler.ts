import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-response";
import { AppError } from "./app-error";

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(errorResponse(error.message, error.errors), {
      status: error.statusCode,
    });
  }
  return NextResponse.json(errorResponse("Internal server error"), { status: 500 });
}
