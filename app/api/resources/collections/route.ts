import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getFeaturedCollections,
  createFeaturedCollection,
} from "@/lib/firestore/resources";
import { isAdminUser } from "@/lib/admin";

/** GET /api/resources/collections — returns all featured collections */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    const collections = await getFeaturedCollections();
    return NextResponse.json(collections);
  } catch (err) {
    console.error("[GET /api/resources/collections]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/resources/collections — admin only
 * Body: { title: string; description: string; resourceIds?: string[] }
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!isAdminUser(userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body: { title?: string; description?: string; resourceIds?: string[] } =
    await request.json();

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  try {
    const id = await createFeaturedCollection({
      title: body.title.trim(),
      description: body.description?.trim() ?? "",
      resourceIds: body.resourceIds ?? [],
    });
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/resources/collections]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
