import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { login } = vi.hoisted(() => ({ login: vi.fn() }));

vi.mock("../../../backend/src/server/services/auth.service", () => ({
  authService: { login },
}));

import { POST as loginRoute } from "../../../backend/src/app/api/v1/auth/login/route";

describe("login API route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("FRONTEND_URL", "http://localhost:3000");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects missing credentials before calling the service", async () => {
    const response = await loginRoute(
      new Request("http://localhost:3001/api/v1/auth/login", {
        method: "POST",
        headers: {
          origin: "http://localhost:3000",
          "content-type": "application/json",
        },
        body: "{}",
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      success: false,
      message: "Login data is invalid.",
    });
    expect(login).not.toHaveBeenCalled();
  });

  it("sets an HTTP-only session cookie and returns only the public user", async () => {
    login.mockResolvedValue({
      sessionId: "2c7d07c5-1966-4f10-a6d5-51cfe0c5d6a4",
      expiresAt: new Date("2026-04-04T20:00:00.000Z"),
      user: {
        id: "user-1",
        email: "person@example.com",
        name: null,
        role: "ADMIN",
      },
    });

    const response = await loginRoute(
      new Request("http://localhost:3001/api/v1/auth/login", {
        method: "POST",
        headers: {
          origin: "http://localhost:3000",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: "person@example.com",
          password: "correct-password",
        }),
      }),
    );

    const body = await response.json();
    const cookie = response.headers.get("set-cookie") ?? "";
    expect(response.status).toBe(200);
    expect(body.data).toEqual({
      id: "user-1",
      email: "person@example.com",
      name: null,
      role: "ADMIN",
    });
    expect(JSON.stringify(body)).not.toContain("sessionId");
    expect(cookie).toContain("campus360_session=");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=lax");
  });
});
