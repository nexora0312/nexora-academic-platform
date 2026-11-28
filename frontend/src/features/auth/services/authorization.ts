import { redirect } from "next/navigation";
import { isAdminRole } from "../permissions";
import { requireServerAuthUser } from "./auth-server";

export async function requireAdminUser() {
  const user = await requireServerAuthUser();
  if (!isAdminRole(user.role)) {
    redirect("/?access=denied");
  }
  return user;
}
