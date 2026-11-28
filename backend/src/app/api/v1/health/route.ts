import { NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      successResponse(
        { status: "ok", timestamp: new Date().toISOString() },
        "Campus360 API is available",
      ),
    );
  } catch (error) {
    logger.error("API health check failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json(errorResponse("Database unavailable"), {
      status: 503,
    });
  }
}
