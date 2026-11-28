"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { UserForm, type UserFormValues } from "./user-form";
import type { User } from "../types/user.types";

type UserDialogProps = {
  mode: "create" | "edit" | null;
  user: User | null;
  isLoadingUser: boolean;
  loadError: string | null;
  onClose: () => void;
  onRetryLoad: () => void;
  onSubmit: (values: UserFormValues) => Promise<void>;
};

export function UserDialog({
  mode,
  user,
  isLoadingUser,
  loadError,
  onClose,
  onRetryLoad,
  onSubmit,
}: UserDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (mode && !dialog.open) {
      dialog.showModal();
    } else if (!mode && dialog.open) {
      dialog.close();
    }
  }, [mode]);

  if (!mode) {
    return null;
  }

  return (
    <dialog
      aria-labelledby="user-dialog-title"
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl bg-white p-0 text-slate-950 shadow-2xl backdrop:bg-slate-950/40"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          dialogRef.current?.close();
        }
      }}
      onClose={onClose}
      ref={dialogRef}
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
            User management
          </p>
          <h2 className="mt-1 text-sm font-semibold text-slate-900" id="user-dialog-title">
            {mode === "edit" ? "Edit user account" : "Add a user account"}
          </h2>
        </div>
        <button
          aria-label="Close dialog"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          onClick={() => dialogRef.current?.close()}
          type="button"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>
      <div className="px-6 py-5">
        {mode === "edit" && isLoadingUser ? (
          <p className="py-8 text-center text-sm text-slate-600" role="status">
            Loading user details...
          </p>
        ) : mode === "edit" && loadError ? (
          <div className="py-4">
            <p className="text-sm text-red-700" role="alert">
              {loadError}
            </p>
            <button
              className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
              onClick={onRetryLoad}
              type="button"
            >
              Try again
            </button>
          </div>
        ) : mode === "edit" && user ? (
          <UserForm key={`edit-${user.id}`} user={user} onSubmit={onSubmit} />
        ) : mode === "create" ? (
          <UserForm key="create-user" onSubmit={onSubmit} />
        ) : null}
      </div>
    </dialog>
  );
}
