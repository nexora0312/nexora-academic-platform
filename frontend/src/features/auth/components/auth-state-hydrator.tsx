"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth.store";
import type { AuthUser } from "../types/auth.types";

export function AuthStateHydrator({
  user,
  children,
}: {
  user: AuthUser;
  children: ReactNode;
}) {
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  useEffect(() => {
    setCurrentUser(user);
  }, [setCurrentUser, user]);

  return children;
}
