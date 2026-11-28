import { randomBytes } from "node:crypto";
import { authenticateRequest } from "@/server/middleware/authenticate";
import { userRepository } from "@/server/repositories/user.repository";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { createSessionExpiry, readSessionId } from "@/server/auth/session";
import { AppError } from "@/server/errors/app-error";
import type { LoginInput } from "@/server/validators/auth.schema";

let dummyPasswordHash: Promise<string> | undefined;

function getDummyPasswordHash(): Promise<string> {
  dummyPasswordHash ??= hashPassword(randomBytes(32).toString("hex"));
  return dummyPasswordHash;
}

export const authService = {
  async login(input: LoginInput) {
    const account = await userRepository.findUserForAuthentication(input.email);
    const passwordHash =
      account?.passwordHash ?? (await getDummyPasswordHash());
    const passwordMatches = await verifyPassword(input.password, passwordHash);

    if (!account || !account.isActive || !passwordMatches) {
      throw new AppError("Invalid email or password.", 401);
    }

    const expiresAt = createSessionExpiry();
    const session = await userRepository.createSession(account.id, expiresAt);
    const name =
      account.studentProfile?.displayName ??
      account.lecturerProfile?.displayName ??
      null;

    return {
      sessionId: session.id,
      expiresAt: session.expiresAt,
      user: {
        id: account.id,
        email: account.email,
        name,
        role: account.role.name,
      },
    };
  },

  async logout(request: Request): Promise<void> {
    const sessionId = readSessionId(request);
    if (sessionId) {
      await userRepository.deleteSession(sessionId);
    }
  },

  async getCurrentUser(request: Request) {
    const authentication = await authenticateRequest(request);
    if (!authentication.authenticated) {
      throw new AppError(authentication.message, 401);
    }

    const user = await userRepository.findById(authentication.userId);
    if (!user || !user.isActive) {
      throw new AppError("Authentication required.", 401);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name,
    };
  },
};
