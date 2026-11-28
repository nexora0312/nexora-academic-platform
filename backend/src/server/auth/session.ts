import { SESSION_COOKIE_NAME } from "@/lib/constants";
import { sessionIdSchema } from "@/server/validators/auth.schema";

export type ServerSession = {
  userId: string;
  role: string;
  expiresAt: Date;
};

export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;
export const SESSION_DURATION_MS = SESSION_MAX_AGE_SECONDS * 1000;

export function isSessionValid(session: ServerSession | null, now = new Date()): boolean {
  return Boolean(session && session.expiresAt.getTime() > now.getTime());
}

export function createSessionExpiry(now = new Date()): Date {
  return new Date(now.getTime() + SESSION_DURATION_MS);
}

export function readSessionId(request: Request): string | null {
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`));
  const sessionId = cookie?.slice(SESSION_COOKIE_NAME.length + 1);
  const parsed = sessionIdSchema.safeParse(sessionId);
  return parsed.success ? parsed.data : null;
}
