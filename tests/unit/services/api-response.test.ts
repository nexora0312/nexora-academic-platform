import { describe, expect, it } from "vitest";
import { errorResponse, successResponse } from "@/lib/api-response";

describe("API response helpers", () => {
  it("creates a success response", () => {
    expect(successResponse({ id: "1" }, "Created", { page: 1 })).toEqual({
      success: true,
      message: "Created",
      data: { id: "1" },
      meta: { page: 1 },
    });
  });

  it("creates an error response", () => {
    expect(errorResponse("Invalid request", ["email"])).toMatchObject({
      success: false,
      message: "Invalid request",
      data: null,
      errors: ["email"],
    });
  });
});
