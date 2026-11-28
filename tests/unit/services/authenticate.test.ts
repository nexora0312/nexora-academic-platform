import { afterEach, describe, expect, it, vi } from "vitest";

const { findSessionActor } = vi.hoisted(() => ({
  findSessionActor: vi.fn(),
}));

vi.mock("../../../backend/src/server/repositories/user.repository", () => ({
  userRepository: { findSessionActor },
}));

import { authenticateRequest } from "../../../backend/src/server/middleware/authenticate";

describe("session authentication", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("rejects requests without the session cookie", async () => {
    const result = await authenticateRequest(new Request("http://localhost"));

    expect(result).toEqual({
      authenticated: false,
      message: "Authentication required.",
    });
    expect(findSessionActor).not.toHaveBeenCalled();
  });

  it("loads the actor for the existing session cookie", async () => {
    findSessionActor.mockResolvedValue({
      id: "user-1",
      role: "ADMIN",
    });
    const request = new Request("http://localhost", {
      headers: {
        cookie:
          "other=value; campus360_session=2c7d07c5-1966-4f10-a6d5-51cfe0c5d6a4",
      },
    });

    await expect(authenticateRequest(request)).resolves.toEqual({
      authenticated: true,
      userId: "user-1",
      role: "ADMIN",
    });
    expect(findSessionActor).toHaveBeenCalledWith(
      "2c7d07c5-1966-4f10-a6d5-51cfe0c5d6a4",
    );
  });
});
