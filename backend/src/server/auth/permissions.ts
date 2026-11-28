export function hasRequiredRole(userRole: string, allowedRoles: readonly string[]): boolean {
  return allowedRoles.includes(userRole);
}
