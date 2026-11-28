"use client";

import { useCallback, useState } from "react";
import { ApiRequestError } from "../../../services/api-client";
import { useAuthStore } from "@/stores/auth.store";
import { authApi } from "../services/auth-api";
import type { LoginInput } from "../schemas/auth.schema";
import type { AuthUser } from "../types/auth.types";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Authentication request failed.";
}

export function useAuth() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const isSigningOut = useAuthStore((state) => state.isSigningOut);
  const setSigningOut = useAuthStore((state) => state.setSigningOut);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (input: LoginInput): Promise<AuthUser | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const user = await authApi.login(input);
        setCurrentUser(user);
        return user;
      } catch (requestError) {
        setCurrentUser(null);
        setError(getErrorMessage(requestError));
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [setCurrentUser],
  );

  const restore = useCallback(async (): Promise<AuthUser | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authApi.me();
      setCurrentUser(user);
      return user;
    } catch (requestError) {
      setCurrentUser(null);
      if (requestError instanceof ApiRequestError && requestError.status === 401) {
        return null;
      }
      setError(getErrorMessage(requestError));
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }, [setCurrentUser]);

  const logout = useCallback(async (): Promise<boolean> => {
    setSigningOut(true);
    setError(null);
    try {
      await authApi.logout();
      setCurrentUser(null);
      return true;
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      return false;
    } finally {
      setSigningOut(false);
    }
  }, [setCurrentUser, setSigningOut]);

  return {
    currentUser,
    isLoading,
    isSigningOut,
    error,
    login,
    restore,
    logout,
  };
}
