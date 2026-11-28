"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff, LoaderCircle, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginSchema } from "../schemas/auth.schema";
import { useAuth } from "../hooks/use-auth";

const fieldClassName =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | undefined>
  >({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});

    const result = loginSchema.safeParse({ email, password });
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

    const user = await login(result.data);
    if (user) {
      router.replace(
        user.role === "SUPER_ADMIN" || user.role === "ADMIN"
          ? "/admin/users"
          : "/",
      );
      router.refresh();
    }
  }

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit}>
      <div>
        <label
          className="block text-sm font-medium text-slate-800"
          htmlFor="login-email"
        >
          Email address
        </label>
        <input
          aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
          aria-invalid={Boolean(fieldErrors.email)}
          autoComplete="username"
          className={fieldClassName}
          id="login-email"
          maxLength={255}
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
        {fieldErrors.email && (
          <p className="mt-1 text-sm text-red-700" id="login-email-error">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label
          className="block text-sm font-medium text-slate-800"
          htmlFor="login-password"
        >
          Password
        </label>
        <div className="relative">
          <input
            aria-describedby={
              fieldErrors.password ? "login-password-error" : undefined
            }
            aria-invalid={Boolean(fieldErrors.password)}
            autoComplete="current-password"
            className={`${fieldClassName} pr-12`}
            id="login-password"
            maxLength={128}
            onChange={(event) => setPassword(event.target.value)}
            required
            type={showPassword ? "text" : "password"}
            value={password}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-blue-700"
            onClick={() => setShowPassword((visible) => !visible)}
            type="button"
          >
            {showPassword ? (
              <EyeOff aria-hidden="true" className="size-4" />
            ) : (
              <Eye aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="mt-1 text-sm text-red-700" id="login-password-error">
            {fieldErrors.password}
          </p>
        )}
      </div>

      {error && (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? (
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <LockKeyhole aria-hidden="true" className="size-4" />
        )}
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
