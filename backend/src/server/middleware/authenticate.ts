export type AuthenticationResult =
  | { authenticated: true; userId: string }
  | { authenticated: false; message: string };

export function authenticateRequest(): AuthenticationResult {
  return { authenticated: false, message: "Authentication foundation not implemented." };
}
