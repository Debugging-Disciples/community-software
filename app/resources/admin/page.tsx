import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ResourcesAdminClient } from "@/components/ResourcesAdminClient";

export const metadata = {
  title: "Resources Admin | Debugging Disciples",
  description: "Moderation, curation, and analytics for the Resources Hub.",
};

/**
 * Mock admin check — in production, look up the user's role from the database.
 * Only "Leader" and "Admin" roles may access this page.
 */
function isAdminUser(userId: string | undefined): boolean {
  // In production, replace with a real database role lookup.
  const ADMIN_IDS = (process.env.ADMIN_USER_IDS ?? "").split(",").filter(Boolean);
  if (ADMIN_IDS.length > 0 && userId) {
    return ADMIN_IDS.includes(userId);
  }
  // Default: allow access in development / when ADMIN_USER_IDS is not configured.
  return process.env.NODE_ENV !== "production";
}

export default async function ResourcesAdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const userId = (session.user as { id?: string }).id;

  if (!isAdminUser(userId)) {
    redirect("/resources");
  }

  return <ResourcesAdminClient session={session} />;
}
