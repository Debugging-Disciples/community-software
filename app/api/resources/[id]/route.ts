import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  updateResource,
  deleteResource,
  incrementResourceViews,
  incrementResourceShares,
  incrementResourceBookmarks,
  decrementResourceBookmarks,
} from "@/lib/firestore/resources";
import { isAdminUser } from "@/lib/admin";

/**
 * PATCH /api/resources/[id]
 *
 * Body (all fields optional):
 *   { action: "increment_views" | "increment_shares" | "bookmark" | "unbookmark" }
 *   { description, pinned, category, source, author, title, url, readTime, thumbnail }
 *   Admin-only: description, pinned, category, source, author, title, url, readTime, thumbnail
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;
  const body: Record<string, unknown> = await request.json();
  const userId = (session.user as { id?: string }).id;

  try {
    const { action, ...patch } = body;

    if (action === "increment_views") {
      await incrementResourceViews(id);
      return NextResponse.json({ ok: true });
    }

    if (action === "increment_shares") {
      await incrementResourceShares(id);
      return NextResponse.json({ ok: true });
    }

    if (action === "bookmark") {
      await incrementResourceBookmarks(id);
      return NextResponse.json({ ok: true });
    }

    if (action === "unbookmark") {
      await decrementResourceBookmarks(id);
      return NextResponse.json({ ok: true });
    }

    // Admin-only metadata edits
    if (!isAdminUser(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await updateResource(id, patch as Parameters<typeof updateResource>[1]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[PATCH /api/resources/${id}]`, err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** DELETE /api/resources/[id] — admin only */
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
    await deleteResource(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[DELETE /api/resources/${id}]`, err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
