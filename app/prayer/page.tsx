import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrayerClient } from "@/components/PrayerClient";

export default async function PrayerPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return <PrayerClient session={session} />;
}
