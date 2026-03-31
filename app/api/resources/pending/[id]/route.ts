import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { approveSubmission, rejectSubmission } from "@/lib/firestore/resources";
import { isAdminUser } from "@/lib/admin";
import type { RejectReason } from "@/lib/resources";

/**
 * PATCH /api/resources/pending/[id]
 *
 * Body: { action: "approve" } | { action: "reject"; reason: RejectReason }
 */
export async function PATCH(
  request: NextRequest,
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
  const body: { action: string; reason?: RejectReason } = await request.json();

  try {
    if (body.action === "approve") {
      await approveSubmission(id);
      return NextResponse.json({ ok: true });
    }

    if (body.action === "reject") {
      if (!body.reason) {
        return NextResponse.json({ error: "reason is required" }, { status: 400 });
      }
      await rejectSubmission(id, body.reason);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error(`[PATCH /api/resources/pending/${id}]`, err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
