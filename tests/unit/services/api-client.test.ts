import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ApiRequestError,
  apiRequest,
} from "../../../frontend/src/services/api-client";

describe("frontend API client", () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  afterEach(() => {
    vi.unstubAllGlobals();
    if (originalApiUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_URL;
    } else {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    }
  });

  it("requests endpoints from the configured backend API", async () => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001/api/v1/";
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: "ok" }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiRequest<{ status: string }>("/health")).resolves.toEqual({
      status: "ok",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/api/v1/health",
      { credentials: "include" },
    );
  });

  it("surfaces non-success backend responses", async () => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001/api/v1";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 503 })),
    );

    await expect(apiRequest("/health")).rejects.toThrow(
      "API request failed with status 503.",
    );
  });

  it("sends JSON requests with credentials and surfaces API error messages", async () => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001/api/v1";
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          message: "A user with this email already exists.",
        }),
        { status: 409 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      apiRequest("/users", {
        method: "POST",
        body: JSON.stringify({ email: "person@example.com" }),
      }),
    ).rejects.toThrow("A user with this email already exists.");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/api/v1/users",
      expect.objectContaining({ credentials: "include" }),
    );
    const requestInit = fetchMock.mock.calls[0]?.[1];
    expect(new Headers(requestInit?.headers).get("Content-Type")).toBe(
      "application/json",
    );
  });

  it("preserves 401 status for the authentication-required UI", async () => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001/api/v1";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: false,
            message: "Authentication required.",
          }),
          { status: 401 },
        ),
      ),
    );

    const requestError = await apiRequest("/users").then(
      () => null,
      (error: unknown) => error,
    );
    expect(requestError).toBeInstanceOf(ApiRequestError);
    expect(requestError).toMatchObject({
      message: "Authentication required.",
      status: 401,
    });
  });
});
