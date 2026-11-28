"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Plus,
  ShieldCheck,
  UserCheck,
  UsersRound,
} from "lucide-react";
import { UserDialog } from "./user-dialog";
import { UserList } from "./user-list";
import { useUsers } from "../hooks/use-users";
import { AccountControls } from "@/features/auth/components/account-controls";
import type { UserFormValues } from "./user-form";
import type { User } from "../types/user.types";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to load user details.";
}

export function UserManagement() {
  const {
    users,
    isLoading,
    error,
    authenticationRequired,
    refresh,
    getUser,
    createUser,
    updateUser,
  } = useUsers();
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [editLoadError, setEditLoadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const editRequestId = useRef(0);

  const activeUsers = users.filter((user) => user.isActive).length;
  const roleCounts = users.reduce<Record<string, number>>((counts, user) => {
    counts[user.role.name] = (counts[user.role.name] ?? 0) + 1;
    return counts;
  }, {});
  const canManageUsers = !isLoading && !error && !authenticationRequired;

  async function loadUserDetails(user: User) {
    const requestId = ++editRequestId.current;
    setSelectedUser(user);
    setEditingUser(null);
    setIsLoadingEdit(true);
    setEditLoadError(null);
    try {
      const details = await getUser(user.id);
      if (editRequestId.current === requestId) {
        setEditingUser(details);
      }
    } catch (requestError) {
      if (editRequestId.current === requestId) {
        setEditLoadError(getErrorMessage(requestError));
      }
    } finally {
      if (editRequestId.current === requestId) {
        setIsLoadingEdit(false);
      }
    }
  }

  function openCreateDialog() {
    setSuccessMessage(null);
    setSelectedUser(null);
    setEditingUser(null);
    setEditLoadError(null);
    setDialogMode("create");
  }

  function openEditDialog(user: User) {
    setSuccessMessage(null);
    setDialogMode("edit");
    void loadUserDetails(user);
  }

  function closeDialog() {
    editRequestId.current += 1;
    setDialogMode(null);
    setSelectedUser(null);
    setEditingUser(null);
    setIsLoadingEdit(false);
    setEditLoadError(null);
  }

  async function saveUser(values: UserFormValues) {
    if (dialogMode === "edit") {
      if ("password" in values || !editingUser) {
        throw new Error("User details are not ready to update.");
      }
      await updateUser(editingUser.id, values);
      setSuccessMessage("User account updated successfully.");
    } else {
      if (!("password" in values)) {
        throw new Error("An initial password is required to create a user.");
      }
      await createUser(values);
      setSuccessMessage("User account created successfully.");
    }
    closeDialog();
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      <aside className="border-b border-slate-200 bg-white md:min-h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex items-center gap-3 px-5 py-5 md:px-6 md:py-7">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-700 text-white">
            <ShieldCheck aria-hidden="true" className="size-5" />
          </div>
          <div>
            <p className="font-semibold tracking-tight text-slate-950">Nexora</p>
            <p className="text-xs text-slate-500">Campus360</p>
          </div>
        </div>
        <nav aria-label="Admin navigation" className="px-3 pb-4 md:px-4">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Administration
          </p>
          <Link
            aria-current="page"
            className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-800"
            href="/admin/users"
          >
            <UsersRound aria-hidden="true" className="size-4" />
            User management
          </Link>
        </nav>
        <div className="border-t border-slate-200 px-5 py-4 md:mx-4 md:px-0">
          <AccountControls />
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-7">
          <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Administration</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                User Management
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Manage account access, roles, and active status for your campus.
              </p>
            </div>
            <button
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canManageUsers}
              onClick={openCreateDialog}
              type="button"
            >
              <Plus aria-hidden="true" className="size-4" />
              Add user
            </button>
          </header>

          {successMessage && (
            <p
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
              role="status"
            >
              {successMessage}
            </p>
          )}

          {canManageUsers && (
            <section aria-label="User summary" className="grid gap-4 sm:grid-cols-3">
              <SummaryCard
                icon={<UsersRound aria-hidden="true" className="size-5" />}
                label="Users returned"
                note="From the current API results"
                value={users.length}
              />
              <SummaryCard
                icon={<UserCheck aria-hidden="true" className="size-5" />}
                label="Active accounts"
                note="Among users returned"
                value={activeUsers}
              />
              <RoleSummaryCard counts={roleCounts} />
            </section>
          )}

          <UserList
            authenticationRequired={authenticationRequired}
            error={error}
            isLoading={isLoading}
            onEdit={openEditDialog}
            onRetry={() => void refresh()}
            users={users}
          />
        </div>
      </main>

      <UserDialog
        isLoadingUser={isLoadingEdit}
        loadError={editLoadError}
        mode={dialogMode}
        onClose={closeDialog}
        onRetryLoad={() => {
          if (selectedUser) {
            void loadUserDetails(selectedUser);
          }
        }}
        onSubmit={saveUser}
        user={editingUser}
      />
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  note,
  value,
}: {
  icon: ReactNode;
  label: string;
  note: string;
  value: number;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-xs text-slate-500">{note}</p>
    </article>
  );
}

function RoleSummaryCard({ counts }: { counts: Record<string, number> }) {
  const roles = Object.entries(counts).sort(([first], [second]) =>
    first.localeCompare(second),
  );

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-600">Role distribution</p>
          <div
            aria-label="User counts by role"
            className="mt-3 flex flex-wrap gap-1.5"
          >
            {roles.length ? (
              roles.map(([role, count]) => (
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
                  key={role}
                >
                  {role.replaceAll("_", " ")}
                  <strong className="font-semibold">{count}</strong>
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-400">No users returned</span>
            )}
          </div>
        </div>
        <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <ShieldCheck aria-hidden="true" className="size-5" />
        </span>
      </div>
      <p className="mt-3 text-xs text-slate-500">Among users returned</p>
    </article>
  );
}
