import { Suspense, type ReactNode } from "react";
import { AuthStateHydrator } from "../../../features/auth/components/auth-state-hydrator";
import { requireAdminUser } from "../../../features/auth/services/authorization";

export default function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  return (
    <Suspense
      fallback={
        <main
          aria-live="polite"
          className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-sm text-slate-600"
        >
          Checking your access...
        </main>
      }
    >
      <AdminAccess>{children}</AdminAccess>
    </Suspense>
  );
}

async function AdminAccess({ children }: { children: ReactNode }) {
  const user = await requireAdminUser();
  return <AuthStateHydrator user={user}>{children}</AuthStateHydrator>;
}
