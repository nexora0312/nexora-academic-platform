import { apiRequest } from "../../../services/api-client";
import { loginSchema, authUserResponseSchema, logoutResponseSchema } from "../schemas/auth.schema";
import type { AuthUser } from "../types/auth.types";
import type { LoginInput } from "../schemas/auth.schema";

export function parseAuthUserResponse(response: unknown): AuthUser {
  const parsed = authUserResponseSchema.safeParse(response);
  if (!parsed.success) {
    throw new Error("The authentication API returned an invalid response.");
  }
  return parsed.data.data;
}

export const authApi = {
  async login(input: LoginInput): Promise<AuthUser> {
    const payload = loginSchema.parse(input);
    const response = await apiRequest<unknown>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return parseAuthUserResponse(response);
  },

  async logout(): Promise<void> {
    const response = await apiRequest<unknown>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const parsed = logoutResponseSchema.safeParse(response);
    if (!parsed.success) {
      throw new Error("The authentication API returned an invalid response.");
    }
  },

  async me(): Promise<AuthUser> {
    return parseAuthUserResponse(await apiRequest<unknown>("/auth/me"));
  },
};
