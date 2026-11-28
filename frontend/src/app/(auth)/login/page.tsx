import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ApiRequestError } from "../../../services/api-client";
import { LoginForm } from "../../../features/auth/components/login-form";
import { isAdminRole } from "../../../features/auth/permissions";
import { getServerAuthUser } from "../../../features/auth/services/auth-server";
import type { AuthUser } from "../../../features/auth/types/auth.types";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main
          aria-live="polite"
          className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-sm text-slate-600"
        >
          Checking your session...
        </main>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}

async function LoginPageContent() {
  let user: AuthUser | null = null;
  try {
    user = await getServerAuthUser();
  } catch (error) {
    if (!(error instanceof ApiRequestError && error.status === 401)) {
      throw error;
    }
  }

  if (user) {
    redirect(isAdminRole(user.role) ? "/admin/users" : "/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:min-h-[600px] lg:grid-cols-2">
        <section className="hidden flex-col justify-between bg-blue-800 p-10 text-white lg:flex">
          <div>
            <p className="text-sm font-semibold tracking-wide text-blue-100">
              NEXORA
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Campus360
            </h1>
          </div>
          <div>
            <p className="text-2xl font-semibold leading-snug">
              A clearer view of your campus.
            </p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-blue-100">
              Sign in to securely access the tools and information available
              for your role.
            </p>
          </div>
          <p className="text-xs text-blue-200">
            Nexora Campus360 administration
          </p>
        </section>

        <section className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
          <div className="mb-8 lg:hidden">
            <p className="text-sm font-semibold tracking-wide text-blue-700">
              NEXORA
            </p>
            <p className="mt-1 text-xl font-bold text-slate-950">Campus360</p>
          </div>
          <div className="mb-7">
            <p className="text-sm font-medium text-blue-700">Welcome back</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use your campus email and password to continue.
            </p>
          </div>
          <LoginForm />
          <p className="mt-7 text-center text-xs leading-5 text-slate-500">
            Access is protected by your campus account and assigned role.
          </p>
        </section>
      </div>
    </main>
  );
}
