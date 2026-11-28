export function authorizeRole(userRole: string, allowedRoles: readonly string[]): boolean {
  return allowedRoles.includes(userRole);
}
