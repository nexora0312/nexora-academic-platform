"use client";

import { useState, type FormEvent } from "react";
import {
  createUserSchema,
  USER_ROLES,
  updateUserSchema,
  userRoleSchema,
} from "../schemas/user.schema";
import type { UserRole } from "../schemas/user.schema";
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
} from "../types/user.types";

export type UserFormValues = CreateUserInput | UpdateUserInput;

type UserFormProps = {
  user?: User;
  onSubmit: (values: UserFormValues) => Promise<void>;
};

const fieldClassName =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export function UserForm({ user, onSubmit }: UserFormProps) {
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [roleName, setRoleName] = useState<UserRole>(
    user?.role.name ?? "STUDENT",
  );
  const [isActive, setIsActive] = useState(user?.isActive ?? true);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    setFieldErrors({});

    const result = user
      ? updateUserSchema.safeParse({ email, roleName, isActive })
      : createUserSchema.safeParse({ email, password, roleName, isActive });

    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit(result.data);
    } catch (requestError) {
      setSubmitError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to save this user.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div>
        <h2 className="text-lg font-semibold text-slate-950">
          {user ? "Edit user" : "Add a user"}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {user
            ? "Update the account email, role, or active status."
            : "Create an account with an initial password."}
        </p>
      </div>

      <label className="block text-sm font-medium text-slate-800" htmlFor="user-email">
        Email address
        <input
          aria-describedby={fieldErrors.email ? "user-email-error" : undefined}
          aria-invalid={Boolean(fieldErrors.email)}
          autoComplete="email"
          className={fieldClassName}
          id="user-email"
          maxLength={255}
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
        {fieldErrors.email && (
          <span className="mt-1 block text-sm font-normal text-red-700" id="user-email-error">
            {fieldErrors.email}
          </span>
        )}
      </label>

      {!user && (
        <label className="block text-sm font-medium text-slate-800" htmlFor="user-password">
          Initial password
          <input
            aria-describedby={
              fieldErrors.password
                ? "user-password-error"
                : "user-password-help"
            }
            aria-invalid={Boolean(fieldErrors.password)}
            autoComplete="new-password"
            className={fieldClassName}
            id="user-password"
            maxLength={128}
            minLength={12}
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
          {fieldErrors.password ? (
            <span className="mt-1 block text-sm font-normal text-red-700" id="user-password-error">
              {fieldErrors.password}
            </span>
          ) : (
            <span className="mt-1 block text-xs font-normal text-slate-500" id="user-password-help">
              Use 12–128 characters. The backend hashes this password before storage.
            </span>
          )}
        </label>
      )}

      <label className="block text-sm font-medium text-slate-800" htmlFor="user-role">
        Role
        <select
          aria-describedby={fieldErrors.roleName ? "user-role-error" : undefined}
          aria-invalid={Boolean(fieldErrors.roleName)}
          className={fieldClassName}
          id="user-role"
          onChange={(event) => {
            const result = userRoleSchema.safeParse(event.target.value);
            if (result.success) {
              setRoleName(result.data);
            }
          }}
          value={roleName}
        >
          {USER_ROLES.map((role) => (
            <option key={role} value={role}>
              {role.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        {fieldErrors.roleName && (
          <span className="mt-1 block text-sm font-normal text-red-700" id="user-role-error">
            {fieldErrors.roleName}
          </span>
        )}
      </label>

      <label className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-sm text-slate-800">
        <input
          checked={isActive}
          className="mt-0.5 size-4 accent-blue-700"
          onChange={(event) => setIsActive(event.target.checked)}
          type="checkbox"
        />
        <span>
          <span className="block font-medium">Active account</span>
          <span className="mt-0.5 block text-xs text-slate-500">
            Inactive accounts cannot start a session.
          </span>
        </span>
      </label>

      {submitError && (
        <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-800" role="alert">
          {submitError}
        </p>
      )}

      <button
        className="w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSaving}
        type="submit"
      >
        {isSaving ? "Saving..." : user ? "Save changes" : "Create user"}
      </button>
    </form>
  );
}
