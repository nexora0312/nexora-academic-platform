import { afterEach, describe, expect, it, vi } from "vitest";
import { userApi } from "../../../frontend/src/features/users/services/user-api";

describe("user API service", () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;
  const user = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Alex Student",
    email: "alex@example.com",
    isActive: true,
    role: {
      id: "550e8400-e29b-41d4-a716-446655440001",
      name: "STUDENT",
    },
    createdAt: "2025-01-02T03:04:05.000Z",
    updatedAt: "2025-01-02T03:04:05.000Z",
  };

  afterEach(() => {
    vi.unstubAllGlobals();
    if (originalApiUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_URL;
    } else {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    }
  });

  it("uses the existing list, detail, create, and update endpoints", async () => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001/api/v1";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: true,
            message: "Users retrieved",
            data: [user],
            meta: null,
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: true,
            message: "User retrieved",
            data: user,
            meta: null,
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: true,
            message: "User created",
            data: user,
            meta: null,
          }),
          { status: 201 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: true,
            message: "User updated",
            data: user,
            meta: null,
          }),
          { status: 200 },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(userApi.list()).resolves.toEqual([user]);
    await expect(userApi.get(user.id)).resolves.toEqual(user);
    await expect(
      userApi.create({
        email: "alex@example.com",
        password: "a-secure-password",
        roleName: "STUDENT",
        isActive: true,
      }),
    ).resolves.toEqual(user);
    await expect(
      userApi.update(user.id, { isActive: false }),
    ).resolves.toEqual(user);

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      "http://localhost:3001/api/v1/users",
      `http://localhost:3001/api/v1/users/${user.id}`,
      "http://localhost:3001/api/v1/users",
      `http://localhost:3001/api/v1/users/${user.id}`,
    ]);
    expect(fetchMock.mock.calls.map(([, init]) => init?.method ?? "GET")).toEqual([
      "GET",
      "GET",
      "POST",
      "PATCH",
    ]);
    expect(fetchMock.mock.calls.every(([, init]) => init?.credentials === "include")).toBe(
      true,
    );
  });

  it("rejects invalid create data before making a request", async () => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001/api/v1";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      userApi.create({
        email: "not-an-email",
        password: "short",
        roleName: "STUDENT",
        isActive: true,
      }),
    ).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
