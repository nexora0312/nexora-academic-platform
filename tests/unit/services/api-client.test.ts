import { afterEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "../../../frontend/src/services/api-client";

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
});
