import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LeaderboardClient } from "@/components/LeaderboardClient";

export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return <LeaderboardClient session={session} />;
}
