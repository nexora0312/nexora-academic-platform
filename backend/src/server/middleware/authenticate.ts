export type AuthenticationResult =
  | { authenticated: true; userId: string; role: string }
  | { authenticated: false; message: string };

import { userRepository } from "@/server/repositories/user.repository";
import { readSessionId } from "@/server/auth/session";

export async function authenticateRequest(
  request: Request,
): Promise<AuthenticationResult> {
  const sessionId = readSessionId(request);
  if (!sessionId) {
    return { authenticated: false, message: "Authentication required." };
  }

  const actor = await userRepository.findSessionActor(sessionId);
  if (!actor) {
    return { authenticated: false, message: "Authentication required." };
  }

  return {
    authenticated: true,
    userId: actor.id,
    role: actor.role,
  };
}
