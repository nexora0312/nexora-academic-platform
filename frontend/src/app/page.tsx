import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AccountControls } from "../features/auth/components/account-controls";
import { AuthStateHydrator } from "../features/auth/components/auth-state-hydrator";
import { isAdminRole } from "../features/auth/permissions";
import { requireServerAuthUser } from "../features/auth/services/auth-server";

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ access?: string }>;
}) {
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
      <AuthenticatedHome searchParams={searchParams} />
    </Suspense>
  );
}

async function AuthenticatedHome({
  searchParams,
}: {
  searchParams: Promise<{ access?: string }>;
}) {
  const user = await requireServerAuthUser();
  if (isAdminRole(user.role)) {
    redirect("/admin/users");
  }

  const { access } = await searchParams;

  return (
    <AuthStateHydrator user={user}>
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
        <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
          <p className="text-sm font-semibold tracking-wide text-blue-700">
            NEXORA CAMPUS360
          </p>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
            You’re signed in
          </h1>
          {access === "denied" ? (
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your account does not have permission to access the administration
              dashboard. Contact your campus administrator if you need access.
            </p>
          ) : (
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The available campus portal for your role is not configured in
              this reference implementation.
            </p>
          )}
          <div className="mt-7 border-t border-slate-200 pt-5">
            <AccountControls />
          </div>
        </section>
      </main>
    </AuthStateHydrator>
  );
}
