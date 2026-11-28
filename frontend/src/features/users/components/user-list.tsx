"use client";

import { useState } from "react";
import { AlertCircle, Search, ShieldAlert } from "lucide-react";
import type { User } from "../types/user.types";
import { UserTable } from "./user-table";

type UserListProps = {
  users: User[];
  isLoading: boolean;
  error: string | null;
  authenticationRequired: boolean;
  onRetry: () => void;
  onEdit: (user: User) => void;
};

export function filterUsers(users: User[], search: string): User[] {
  const normalizedSearch = search.trim().toLowerCase();
  if (!normalizedSearch) {
    return users;
  }

  return users.filter((user) =>
    `${user.name ?? ""} ${user.email}`.toLowerCase().includes(normalizedSearch),
  );
}

export function UserList({
  users,
  isLoading,
  error,
  authenticationRequired,
  onRetry,
  onEdit,
}: UserListProps) {
  const [search, setSearch] = useState("");
  const filteredUsers = filterUsers(users, search);

  return (
    <section
      aria-busy={isLoading}
      aria-labelledby="user-list-heading"
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950" id="user-list-heading">
            All users
          </h2>
          {!isLoading && !error && !authenticationRequired && (
            <p className="mt-1 text-sm text-slate-500" aria-live="polite">
              Showing {filteredUsers.length} of {users.length} loaded{" "}
              {users.length === 1 ? "account" : "accounts"}
            </p>
          )}
        </div>
        <label className="relative block w-full sm:max-w-xs">
          <span className="sr-only">Search users by name or email</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          />
          <input
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or email"
            type="search"
            value={search}
          />
        </label>
      </div>

      {isLoading ? (
        <div className="px-5 py-14 text-center" role="status">
          <span className="mx-auto block size-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-700" />
          <p className="mt-3 text-sm text-slate-600">Loading users...</p>
        </div>
      ) : authenticationRequired ? (
        <div className="mx-auto max-w-xl px-5 py-12 text-center">
          <ShieldAlert aria-hidden="true" className="mx-auto size-10 text-amber-600" />
          <h3 className="mt-4 text-base font-semibold text-slate-950">
            Authentication required
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            User management requires a valid <code>campus360_session</code> and
            the SUPER_ADMIN or ADMIN role. This project does not yet include a
            login or session-creation flow, so no session is created here.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            To test this feature end to end, provision a valid session through
            an approved authentication flow, then reload this page.
          </p>
          <button
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            onClick={onRetry}
            type="button"
          >
            <AlertCircle aria-hidden="true" className="size-4" />
            Check again
          </button>
        </div>
      ) : error ? (
        <div className="px-5 py-12 text-center">
          <AlertCircle aria-hidden="true" className="mx-auto size-9 text-red-600" />
          <h3 className="mt-3 font-semibold text-slate-950">Could not load users</h3>
          <p className="mt-1 text-sm text-red-700" role="alert">
            {error}
          </p>
          <button
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={onRetry}
            type="button"
          >
            Try again
          </button>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="px-5 py-14 text-center">
          <p className="font-medium text-slate-900">
            {users.length === 0 ? "No users yet" : "No users match your search"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {users.length === 0
              ? "Add a user to get started."
              : "Try another name or email address."}
          </p>
        </div>
      ) : (
        <UserTable users={filteredUsers} onEdit={onEdit} />
      )}
    </section>
  );
}
