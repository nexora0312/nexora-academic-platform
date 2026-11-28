"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "../hooks/use-auth";

export function AccountControls() {
  const router = useRouter();
  const { currentUser, isSigningOut, error, logout } = useAuth();

  async function handleSignOut() {
    if (await logout()) {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <div className="space-y-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-900">
          {currentUser?.name || currentUser?.email || "Signed in"}
        </p>
        {currentUser?.role && (
          <p className="mt-0.5 text-xs text-slate-500">
            {currentUser.role.replaceAll("_", " ")}
          </p>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-700" role="alert">
          {error}
        </p>
      )}
      <button
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSigningOut}
        onClick={() => void handleSignOut()}
        type="button"
      >
        <LogOut aria-hidden="true" className="size-4" />
        {isSigningOut ? "Signing out..." : "Sign out"}
      </button>
    </div>
  );
}
