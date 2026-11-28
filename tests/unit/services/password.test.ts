import { describe, expect, it } from "vitest";
import {
  hashPassword,
  verifyPassword,
} from "../../../backend/src/server/auth/password";

describe("password hashing", () => {
  it("uses a unique salted scrypt hash instead of returning the password", async () => {
    const password = "correct horse battery staple";
    const firstHash = await hashPassword(password);
    const secondHash = await hashPassword(password);

    expect(firstHash).toMatch(/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/);
    expect(firstHash).not.toContain(password);
    expect(secondHash).not.toBe(firstHash);
  });

  it("verifies the existing scrypt format and rejects wrong or malformed values", async () => {
    const password = "correct horse battery staple";
    const encodedHash = await hashPassword(password);

    await expect(verifyPassword(password, encodedHash)).resolves.toBe(true);
    await expect(verifyPassword("incorrect password", encodedHash)).resolves.toBe(
      false,
    );
    await expect(verifyPassword(password, "not-a-valid-hash")).resolves.toBe(
      false,
    );
  });
});
