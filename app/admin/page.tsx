import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  // Temporary authorization: restrict access to a configured allowlist of admin emails.
  // When roles are available on the session (e.g., session.user.role), replace this with a role check.
  const adminEmails =
    process.env.ADMIN_EMAILS
      ?.split(",")
      .map((email) => email.trim())
      .filter(Boolean) ?? [];

  const userEmail = session.user?.email;

  if (!userEmail || (adminEmails.length > 0 && !adminEmails.includes(userEmail))) {
    redirect("/");
  }

  return <AdminDashboardClient session={session} />;
}
