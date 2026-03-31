import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getResources,
  seedResourcesIfEmpty,
} from "@/lib/firestore/resources";

/** GET /api/resources — list all approved resources */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    await seedResourcesIfEmpty();
    const resources = await getResources();
    return NextResponse.json(resources);
  } catch (err) {
    console.error("[GET /api/resources]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
