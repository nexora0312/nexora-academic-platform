import { beforeEach, describe, expect, it, vi } from "vitest";

const { redirect, requireServerAuthUser } = vi.hoisted(() => ({
  redirect: vi.fn(),
  requireServerAuthUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({ redirect }));
vi.mock("../../../frontend/src/features/auth/services/auth-server", () => ({
  requireServerAuthUser,
}));

import { requireAdminUser } from "../../../frontend/src/features/auth/services/authorization";

describe("admin authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    redirect.mockImplementation((destination: string) => {
      throw new Error(`NEXT_REDIRECT:${destination}`);
    });
  });

  it("redirects an authenticated non-admin role away from admin routes", async () => {
    requireServerAuthUser.mockResolvedValue({
      id: "user-1",
      email: "student@example.com",
      name: null,
      role: "STUDENT",
    });

    await expect(requireAdminUser()).rejects.toThrow(
      "NEXT_REDIRECT:/?access=denied",
    );
    expect(redirect).toHaveBeenCalledWith("/?access=denied");
  });

  it("allows an administrator to reach protected routes", async () => {
    const user = {
      id: "user-1",
      email: "admin@example.com",
      name: null,
      role: "ADMIN",
    } as const;
    requireServerAuthUser.mockResolvedValue(user);

    await expect(requireAdminUser()).resolves.toEqual(user);
    expect(redirect).not.toHaveBeenCalled();
  });
});
