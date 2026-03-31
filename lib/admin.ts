/**
 * Returns true if the given user id is allowed to access admin features.
 *
 * In production, set the ADMIN_USER_IDS environment variable to a
 * comma-separated list of Slack user ids that should have admin access.
 * e.g. ADMIN_USER_IDS=U012AB3CD,U098ZY7WX
 *
 * When ADMIN_USER_IDS is not set, admin access is allowed in non-production
 * environments (development / preview) and denied in production.
 */
export function isAdminUser(userId: string | undefined): boolean {
  const adminIds = (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (adminIds.length > 0) {
    return userId !== undefined && adminIds.includes(userId);
  }

  return process.env.NODE_ENV !== "production";
}
