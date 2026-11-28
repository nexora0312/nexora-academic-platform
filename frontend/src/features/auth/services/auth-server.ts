import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME } from "@/features/auth/constants";
import { ApiRequestError, getApiUrl } from "../../../services/api-client";
import { parseAuthUserResponse } from "./auth-api";
import type { AuthUser } from "../types/auth.types";

function getErrorMessage(payload: unknown, status: number): string {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }
  return `API request failed with status ${status}.`;
}

export async function getServerAuthUser(): Promise<AuthUser> {
  const sessionId = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const response = await fetch(getApiUrl("/auth/me"), {
    ...(sessionId
      ? {
          headers: {
            cookie: `${SESSION_COOKIE_NAME}=${encodeURIComponent(sessionId)}`,
          },
        }
      : {}),
    cache: "no-store",
  });

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    payload = null;
    if (response.ok) {
      throw new Error("API returned an invalid JSON response.");
    }
  }

  if (!response.ok) {
    throw new ApiRequestError(
      getErrorMessage(payload, response.status),
      response.status,
    );
  }

  return parseAuthUserResponse(payload);
}

export async function requireServerAuthUser(): Promise<AuthUser> {
  try {
    return await getServerAuthUser();
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      redirect("/login");
    }
    throw error;
  }
}
