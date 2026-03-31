import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EventsCalendar } from "@/components/EventsCalendar";
import { Navbar } from "@/components/Navbar";

export default async function EventsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const userRole = (session.user as { role?: string }).role ?? "Member";
  const isAdmin = userRole === "Admin" || userRole === "Leader";

  return (
    <div className="min-h-screen bg-tech-dark text-white">
      <div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(59,130,246,0.15) 1px, transparent 0), radial-gradient(circle at 75px 75px, rgba(139,92,246,0.15) 1px, transparent 0)",
          backgroundSize: "100px 100px",
        }}
      />
      <Navbar user={session.user} />
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">
            <span className="bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">
              Events &amp; Calendar
            </span>
          </h1>
          <p className="text-gray-400">
            Bible studies, AMAs, dinners, and career events — all in one place.
            {isAdmin && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(139,92,246,0.2)", color: "#8b5cf6" }}>
                Admin View
              </span>
            )}
          </p>
        </div>
        <EventsCalendar isAdmin={isAdmin} />
      </main>
    </div>
  );
}
