import { describe, expect, it } from "vitest";
import {
  createUserSchema as frontendCreateUserSchema,
  updateUserSchema as frontendUpdateUserSchema,
} from "../../../frontend/src/features/users/schemas/user.schema";
import {
  createUserSchema as backendCreateUserSchema,
  updateUserSchema as backendUpdateUserSchema,
} from "../../../backend/src/server/validators/user.schema";
import { assertCanManageRole } from "../../../backend/src/server/services/user.service";
import { AppError } from "../../../backend/src/server/errors/app-error";

describe("User Management schemas", () => {
  it("normalizes emails and enforces the initial password requirement", () => {
    const result = backendCreateUserSchema.safeParse({
      email: "PERSON@EXAMPLE.COM",
      password: "long-enough-password",
      roleName: "STUDENT",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("person@example.com");
      expect(result.data.isActive).toBe(true);
    }

    expect(
      frontendCreateUserSchema.safeParse({
        email: "person@example.com",
        password: "short",
        roleName: "STUDENT",
        isActive: true,
      }).success,
    ).toBe(false);
  });

  it("requires at least one update field and rejects unknown properties", () => {
    expect(backendUpdateUserSchema.safeParse({}).success).toBe(false);
    expect(
      backendUpdateUserSchema.safeParse({ isActive: false, extra: true }).success,
    ).toBe(false);
    expect(
      frontendUpdateUserSchema.safeParse({ roleName: "LECTURER" }).success,
    ).toBe(true);
  });
});

describe("User Management role policy", () => {
  it("prevents administrators from managing administrator roles", () => {
    expect(() => assertCanManageRole("ADMIN", "SUPER_ADMIN")).toThrow(AppError);
    expect(() => assertCanManageRole("ADMIN", "ADMIN")).toThrow(AppError);
    expect(() => assertCanManageRole("ADMIN", "STUDENT")).not.toThrow();
    expect(() => assertCanManageRole("SUPER_ADMIN", "ADMIN")).not.toThrow();
  });
});
