import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ResourcesClient } from "@/components/ResourcesClient";

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

  return <ResourcesClient session={session} />;
}
