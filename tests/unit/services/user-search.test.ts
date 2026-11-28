import { describe, expect, it } from "vitest";
import { filterUsers } from "../../../frontend/src/features/users/components/user-list";
import type { User } from "../../../frontend/src/features/users/types/user.types";

const users: User[] = [
  {
    id: "user-1",
    name: "Alex Student",
    email: "alex@example.com",
    isActive: true,
    role: { id: "role-1", name: "STUDENT" },
    createdAt: "2025-01-02T03:04:05.000Z",
    updatedAt: "2025-01-02T03:04:05.000Z",
  },
  {
    id: "user-2",
    name: null,
    email: "admin@example.com",
    isActive: true,
    role: { id: "role-2", name: "ADMIN" },
    createdAt: "2025-01-02T03:04:05.000Z",
    updatedAt: "2025-01-02T03:04:05.000Z",
  },
];

describe("user list search", () => {
  it("matches names and email addresses without case sensitivity", () => {
    expect(filterUsers(users, " alex ")).toEqual([users[0]]);
    expect(filterUsers(users, "ADMIN@EXAMPLE")).toEqual([users[1]]);
  });

  it("returns all loaded users for an empty search", () => {
    expect(filterUsers(users, "  ")).toEqual(users);
  });
});
