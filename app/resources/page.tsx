import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ResourcesClient } from "@/components/ResourcesClient";
import { getResources, seedResourcesIfEmpty } from "@/lib/firestore/resources";
import { isAdminUser } from "@/lib/admin";
import { MOCK_RESOURCES } from "@/lib/resources";
import type { Resource } from "@/lib/resources";

export const metadata = {
  title: "Resources Hub | Debugging Disciples",
  description:
    "Curated articles, books, podcasts, and more for the Debugging Disciples community.",
};

export default async function ResourcesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const userId = (session.user as { id?: string }).id;

  let resources: Resource[] = MOCK_RESOURCES;
  try {
    await seedResourcesIfEmpty();
    resources = await getResources();
  } catch {
    // Firestore unavailable — fall back to mock data so the page still renders.
  }

  return (
    <ResourcesClient
      session={session}
      isAdmin={isAdminUser(userId)}
      initialResources={resources}
    />
  );
}
