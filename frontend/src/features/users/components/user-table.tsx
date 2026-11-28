"use client";

import { Pencil } from "lucide-react";
import type { User } from "../types/user.types";

type UserTableProps = {
  users: User[];
  onEdit: (user: User) => void;
};

function formatCreatedDate(value: string): string {
  return new Date(value).toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function UserTable({ users, onEdit }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[700px] w-full text-left text-sm">
        <caption className="sr-only">User accounts and account actions</caption>
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-3.5" scope="col">Name and email</th>
            <th className="px-5 py-3.5" scope="col">Role</th>
            <th className="px-5 py-3.5" scope="col">Status</th>
            <th className="px-5 py-3.5" scope="col">Created</th>
            <th className="px-5 py-3.5 text-right" scope="col">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => (
            <tr className="hover:bg-slate-50/70" key={user.id}>
              <td className="px-5 py-4">
                <p className="font-medium text-slate-900">
                  {user.name?.trim() || "—"}
                </p>
                <p className="mt-0.5 text-slate-500">{user.email}</p>
              </td>
              <td className="px-5 py-4">
                <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800">
                  {user.role.name.replaceAll("_", " ")}
                </span>
              </td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                    user.isActive ? "text-emerald-700" : "text-slate-500"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`size-1.5 rounded-full ${
                      user.isActive ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                <time dateTime={user.createdAt}>
                  {formatCreatedDate(user.createdAt)}
                </time>
              </td>
              <td className="px-5 py-4 text-right">
                <button
                  aria-label={`Edit ${user.email}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  onClick={() => onEdit(user)}
                  type="button"
                >
                  <Pencil aria-hidden="true" className="size-3.5" />
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
