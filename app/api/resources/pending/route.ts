import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPendingSubmissions } from "@/lib/firestore/resources";
import { isAdminUser } from "@/lib/admin";

/** GET /api/resources/pending — admin only */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!isAdminUser(userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const pending = await getPendingSubmissions();
    return NextResponse.json(pending);
  } catch (err) {
    console.error("[GET /api/resources/pending]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
