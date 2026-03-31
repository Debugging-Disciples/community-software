import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteFeaturedCollection } from "@/lib/firestore/resources";
import { isAdminUser } from "@/lib/admin";

/** DELETE /api/resources/collections/[id] — admin only */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!isAdminUser(userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await deleteFeaturedCollection(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[DELETE /api/resources/collections/${id}]`, err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
