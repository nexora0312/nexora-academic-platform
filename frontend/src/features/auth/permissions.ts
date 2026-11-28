import type { UserRole } from "../users/schemas/user.schema";

export function isAdminRole(role: UserRole): boolean {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}
