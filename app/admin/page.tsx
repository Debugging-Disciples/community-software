import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  // TODO: Add role-based authorization once user roles are stored in the session.
  // Only users with an "admin" or "Leader" role should be allowed to access this page.
  // Example: if (session.user.role !== "admin") redirect("/dashboard");

  return <AdminDashboardClient session={session} />;
}
