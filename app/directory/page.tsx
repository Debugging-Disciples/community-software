import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CommunityDirectory } from "@/components/CommunityDirectory";
import { Navbar } from "@/components/Navbar";

export default async function DirectoryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

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
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">
            <span className="bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">
              Community Directory
            </span>
          </h1>
          <p className="text-gray-400">
            Connect with fellow Debugging Disciples across faith, tech, and career.
          </p>
        </div>
        <CommunityDirectory />
      </main>
    </div>
  );
}
