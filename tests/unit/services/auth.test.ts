import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sessionId = "2c7d07c5-1966-4f10-a6d5-51cfe0c5d6a4";
const {
  authenticateRequest,
  createSession,
  deleteSession,
  findById,
  findUserForAuthentication,
  hashPassword,
  verifyPassword,
} = vi.hoisted(() => ({
  authenticateRequest: vi.fn(),
  createSession: vi.fn(),
  deleteSession: vi.fn(),
  findById: vi.fn(),
  findUserForAuthentication: vi.fn(),
  hashPassword: vi.fn(),
  verifyPassword: vi.fn(),
}));

vi.mock("../../../backend/src/server/repositories/user.repository", () => ({
  userRepository: {
    createSession,
    deleteSession,
    findById,
    findUserForAuthentication,
  },
}));

vi.mock("../../../backend/src/server/middleware/authenticate", () => ({
  authenticateRequest,
}));

vi.mock("../../../backend/src/server/auth/password", () => ({
  hashPassword,
  verifyPassword,
}));

import { authService } from "../../../backend/src/server/services/auth.service";
import { AppError } from "../../../backend/src/server/errors/app-error";
import {
  createSessionExpiry,
  isSessionValid,
} from "../../../backend/src/server/auth/session";
import { loginSchema } from "../../../backend/src/server/validators/auth.schema";

const account = {
  id: "user-1",
  email: "person@example.com",
  passwordHash: "stored-hash",
  isActive: true,
  role: { name: "ADMIN" },
  studentProfile: null,
  lecturerProfile: { displayName: "Campus Admin" },
};

beforeEach(() => {
  vi.clearAllMocks();
  findUserForAuthentication.mockResolvedValue(account);
  hashPassword.mockResolvedValue("dummy-hash");
  verifyPassword.mockImplementation(
    async (password: string, encodedHash: string) =>
      password === "correct-password" && encodedHash === "stored-hash",
  );
  createSession.mockResolvedValue({
    id: sessionId,
    expiresAt: new Date("2026-04-04T20:00:00.000Z"),
  });
  deleteSession.mockResolvedValue({ count: 1 });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("authentication service", () => {
  it("validates login input and creates a session without returning secrets", async () => {
    expect(loginSchema.safeParse({}).success).toBe(false);

    const result = await authService.login({
      email: "person@example.com",
      password: "correct-password",
    });

    expect(createSession).toHaveBeenCalledWith(
      account.id,
      expect.any(Date),
    );
    expect(result).toEqual({
      sessionId,
      expiresAt: expect.any(Date),
      user: {
        id: "user-1",
        email: "person@example.com",
        name: "Campus Admin",
        role: "ADMIN",
      },
    });
    expect(JSON.stringify(result)).not.toContain("passwordHash");
    expect(JSON.stringify(result)).not.toContain("stored-hash");
  });

  it("rejects an incorrect password with the generic authentication error", async () => {
    await expect(
      authService.login({
        email: "person@example.com",
        password: "wrong-password",
      }),
    ).rejects.toMatchObject({
      message: "Invalid email or password.",
      statusCode: 401,
    });
    expect(createSession).not.toHaveBeenCalled();
  });

  it("uses a timing-equalized dummy hash for an unknown account", async () => {
    findUserForAuthentication.mockResolvedValue(null);

    await expect(
      authService.login({
        email: "unknown@example.com",
        password: "wrong-password",
      }),
    ).rejects.toBeInstanceOf(AppError);
    expect(verifyPassword).toHaveBeenCalledWith(
      "wrong-password",
      "dummy-hash",
    );
    expect(createSession).not.toHaveBeenCalled();
  });

  it("invalidates the supplied session on logout", async () => {
    const request = new Request("http://localhost", {
      headers: { cookie: `campus360_session=${sessionId}` },
    });

    await authService.logout(request);

    expect(deleteSession).toHaveBeenCalledWith(sessionId);
  });

  it("returns the current user only for an authenticated request", async () => {
    authenticateRequest.mockResolvedValue({
      authenticated: true,
      userId: "user-1",
      role: "ADMIN",
    });
    findById.mockResolvedValue({
      id: "user-1",
      email: "person@example.com",
      isActive: true,
      name: "Campus Admin",
      role: { name: "ADMIN" },
    });

    await expect(
      authService.getCurrentUser(new Request("http://localhost")),
    ).resolves.toEqual({
      id: "user-1",
      email: "person@example.com",
      name: "Campus Admin",
      role: "ADMIN",
    });

    authenticateRequest.mockResolvedValue({
      authenticated: false,
      message: "Authentication required.",
    });
    await expect(
      authService.getCurrentUser(new Request("http://localhost")),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it("expires sessions at the defined deadline", () => {
    const now = new Date("2026-04-04T12:00:00.000Z");
    const expiresAt = createSessionExpiry(now);

    expect(expiresAt.getTime()).toBe(now.getTime() + 8 * 60 * 60 * 1000);
    expect(isSessionValid({ userId: "user-1", role: "ADMIN", expiresAt }, now)).toBe(
      true,
    );
    expect(
      isSessionValid(
        {
          userId: "user-1",
          role: "ADMIN",
          expiresAt: new Date(now.getTime()),
        },
        now,
      ),
    ).toBe(false);
  });
});
