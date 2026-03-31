import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardClient } from "@/components/DashboardClient";
import { getResources, seedResourcesIfEmpty } from "@/lib/firestore/resources";
import type { Resource } from "@/lib/resources";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  let trendingResources: Resource[] = [];
  try {
    await seedResourcesIfEmpty();
    const all = await getResources();
    trendingResources = [...all].sort((a, b) => b.views - a.views).slice(0, 3);
  } catch {
    // If Firestore is unavailable (e.g. env vars not configured), fall back to
    // an empty list — the widget handles this gracefully.
  }

  return <DashboardClient session={session} trendingResources={trendingResources} />;
}
