export type ServerSession = {
  userId: string;
  role: string;
  expiresAt: Date;
};

export function isSessionValid(session: ServerSession | null, now = new Date()): boolean {
  return Boolean(session && session.expiresAt.getTime() > now.getTime());
}
