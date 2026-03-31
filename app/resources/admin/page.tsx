import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ResourcesAdminClient } from "@/components/ResourcesAdminClient";
import {
  getResources,
  getPendingSubmissions,
  getFeaturedCollections,
  seedResourcesIfEmpty,
} from "@/lib/firestore/resources";
import { isAdminUser } from "@/lib/admin";
import { MOCK_RESOURCES, MOCK_PENDING, MOCK_COLLECTIONS } from "@/lib/resources";
import type { Resource, PendingResource, FeaturedCollection } from "@/lib/resources";

export const metadata = {
  title: "Resources Admin | Debugging Disciples",
  description: "Moderation, curation, and analytics for the Resources Hub.",
};

export default async function ResourcesAdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const userId = (session.user as { id?: string }).id;

  if (!isAdminUser(userId)) {
    redirect("/resources");
  }

  let resources: Resource[] = MOCK_RESOURCES;
  let pending: PendingResource[] = MOCK_PENDING;
  let collections: FeaturedCollection[] = MOCK_COLLECTIONS;

  try {
    await seedResourcesIfEmpty();
    [resources, pending, collections] = await Promise.all([
      getResources(),
      getPendingSubmissions(),
      getFeaturedCollections(),
    ]);
  } catch {
    // Firestore unavailable — fall back to mock data.
  }

  return (
    <ResourcesAdminClient
      session={session}
      initialResources={resources}
      initialPending={pending}
      initialCollections={collections}
    />
  );
}
