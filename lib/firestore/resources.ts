import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase-admin";
import {
  Resource,
  PendingResource,
  FeaturedCollection,
  RejectReason,
  CATEGORY_META,
  MOCK_RESOURCES,
  MOCK_PENDING,
  MOCK_COLLECTIONS,
  type ResourceCategory,
} from "@/lib/resources";

// ---------------------------------------------------------------------------
// Collection names
// ---------------------------------------------------------------------------

const COL_RESOURCES = "resources";
const COL_PENDING = "pending_resources";
const COL_COLLECTIONS = "featured_collections";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Converts a Firestore document snapshot to a Resource, filling derived fields. */
function docToResource(
  doc: FirebaseFirestore.DocumentSnapshot
): Resource {
  const data = doc.data() ?? {};
  const category = (data.category ?? "Career & Growth") as ResourceCategory;
  const meta = CATEGORY_META[category] ?? CATEGORY_META["Career & Growth"];
  return {
    id: doc.id,
    title: data.title ?? "",
    category,
    categoryEmoji: meta.emoji,
    categoryColor: meta.color,
    source: data.source ?? "",
    author: data.author ?? "",
    description: data.description ?? "",
    thumbnail: data.thumbnail,
    url: data.url ?? "#",
    readTime: data.readTime ?? 0,
    views: data.views ?? 0,
    shares: data.shares ?? 0,
    bookmarks: data.bookmarks ?? 0,
    comments: data.comments ?? 0,
    pinned: data.pinned ?? false,
    saved: false, // client-side state; not persisted per-user yet
    addedAt:
      data.addedAt instanceof Object && "toDate" in data.addedAt
        ? (data.addedAt as FirebaseFirestore.Timestamp).toDate().toISOString()
        : (data.addedAt ?? new Date().toISOString()),
  };
}

function docToPending(
  doc: FirebaseFirestore.DocumentSnapshot
): PendingResource {
  const data = doc.data() ?? {};
  const category = (data.category ?? "Career & Growth") as ResourceCategory;
  const meta = CATEGORY_META[category] ?? CATEGORY_META["Career & Growth"];
  return {
    id: doc.id,
    title: data.title ?? "",
    category,
    categoryEmoji: meta.emoji,
    categoryColor: meta.color,
    source: data.source ?? "",
    author: data.author ?? "",
    description: data.description ?? "",
    thumbnail: data.thumbnail,
    url: data.url ?? "#",
    readTime: data.readTime ?? 0,
    submittedBy: data.submittedBy ?? "",
    submittedAt:
      data.submittedAt instanceof Object && "toDate" in data.submittedAt
        ? (data.submittedAt as FirebaseFirestore.Timestamp).toDate().toISOString()
        : (data.submittedAt ?? new Date().toISOString()),
    status: data.status ?? "pending",
    rejectReason: data.rejectReason,
    addedAt:
      data.addedAt instanceof Object && "toDate" in data.addedAt
        ? (data.addedAt as FirebaseFirestore.Timestamp).toDate().toISOString()
        : (data.addedAt ?? new Date().toISOString()),
  };
}

function docToCollection(
  doc: FirebaseFirestore.DocumentSnapshot
): FeaturedCollection {
  const data = doc.data() ?? {};
  return {
    id: doc.id,
    title: data.title ?? "",
    description: data.description ?? "",
    resourceIds: data.resourceIds ?? [],
  };
}

// ---------------------------------------------------------------------------
// Seed (run once to populate from mock data when the collection is empty)
// ---------------------------------------------------------------------------

/**
 * Writes mock resources, pending submissions, and featured collections to
 * Firestore if the `resources` collection is empty.  Safe to call on every
 * cold start — it is a no-op once data exists.
 */
export async function seedResourcesIfEmpty(): Promise<void> {
  const db = getDb();
  const snap = await db.collection(COL_RESOURCES).limit(1).get();
  if (!snap.empty) return;

  const batch = db.batch();

  for (const r of MOCK_RESOURCES) {
    const { id, categoryEmoji: _e, categoryColor: _c, saved: _s, ...rest } = r;
    batch.set(db.collection(COL_RESOURCES).doc(id), rest);
  }

  for (const p of MOCK_PENDING) {
    const { id, categoryEmoji: _e, categoryColor: _c, ...rest } = p;
    batch.set(db.collection(COL_PENDING).doc(id), rest);
  }

  for (const col of MOCK_COLLECTIONS) {
    const { id, ...rest } = col;
    batch.set(db.collection(COL_COLLECTIONS).doc(id), rest);
  }

  await batch.commit();
}

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------

/** Returns all approved resources ordered by addedAt desc. */
export async function getResources(): Promise<Resource[]> {
  const db = getDb();
  const snap = await db
    .collection(COL_RESOURCES)
    .orderBy("addedAt", "desc")
    .get();
  return snap.docs.map(docToResource);
}

/** Returns a single resource by id, or null if not found. */
export async function getResourceById(id: string): Promise<Resource | null> {
  const db = getDb();
  const doc = await db.collection(COL_RESOURCES).doc(id).get();
  if (!doc.exists) return null;
  return docToResource(doc);
}

/** Creates a new resource document.  Returns the generated id. */
export async function createResource(
  data: Omit<Resource, "id" | "categoryEmoji" | "categoryColor" | "saved">
): Promise<string> {
  const db = getDb();
  const ref = await db.collection(COL_RESOURCES).add({
    ...data,
    addedAt: new Date().toISOString(),
    views: 0,
    shares: 0,
    bookmarks: 0,
    comments: 0,
    pinned: false,
  });
  return ref.id;
}

/**
 * Partial-updates a resource.
 * Only `description`, `pinned`, `category`, `source`, `author`, `title`,
 * `url`, `readTime`, and `thumbnail` may be changed post-creation.
 */
export async function updateResource(
  id: string,
  patch: Partial<
    Pick<
      Resource,
      "description" | "pinned" | "category" | "source" | "author" | "title" | "url" | "readTime" | "thumbnail"
    >
  >
): Promise<void> {
  const db = getDb();
  await db.collection(COL_RESOURCES).doc(id).update(patch);
}

/** Deletes a resource permanently. */
export async function deleteResource(id: string): Promise<void> {
  const db = getDb();
  await db.collection(COL_RESOURCES).doc(id).delete();
}

/** Atomically increments the view counter for a resource. */
export async function incrementResourceViews(id: string): Promise<void> {
  const db = getDb();
  await db
    .collection(COL_RESOURCES)
    .doc(id)
    .update({ views: FieldValue.increment(1) });
}

/** Atomically increments the share counter for a resource. */
export async function incrementResourceShares(id: string): Promise<void> {
  const db = getDb();
  await db
    .collection(COL_RESOURCES)
    .doc(id)
    .update({ shares: FieldValue.increment(1) });
}

/** Atomically increments the bookmark counter for a resource. */
export async function incrementResourceBookmarks(id: string): Promise<void> {
  const db = getDb();
  await db
    .collection(COL_RESOURCES)
    .doc(id)
    .update({ bookmarks: FieldValue.increment(1) });
}

/** Atomically decrements the bookmark counter (min 0). */
export async function decrementResourceBookmarks(id: string): Promise<void> {
  const db = getDb();
  // Firestore does not support clamped decrements natively; a transaction is safest.
  const ref = db.collection(COL_RESOURCES).doc(id);
  await db.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    const current = (doc.data()?.bookmarks ?? 0) as number;
    tx.update(ref, { bookmarks: Math.max(0, current - 1) });
  });
}

// ---------------------------------------------------------------------------
// Pending submissions
// ---------------------------------------------------------------------------

/** Returns all pending submissions ordered by submittedAt desc. */
export async function getPendingSubmissions(): Promise<PendingResource[]> {
  const db = getDb();
  const snap = await db
    .collection(COL_PENDING)
    .orderBy("submittedAt", "desc")
    .get();
  return snap.docs.map(docToPending);
}

/**
 * Submits a new resource for admin review.
 * The document is created in the `pending_resources` collection with
 * `status: "pending"`.
 */
export async function submitPendingResource(
  data: Omit<PendingResource, "id" | "categoryEmoji" | "categoryColor" | "status" | "submittedAt" | "addedAt">
): Promise<string> {
  const db = getDb();
  const now = new Date().toISOString();
  const ref = await db.collection(COL_PENDING).add({
    ...data,
    status: "pending",
    submittedAt: now,
    addedAt: now,
  });
  return ref.id;
}

/**
 * Approves a pending submission:
 *  1. Copies it into the `resources` collection (with the same id).
 *  2. Updates its status to "approved" in `pending_resources`.
 */
export async function approveSubmission(id: string): Promise<void> {
  const db = getDb();
  const pendingRef = db.collection(COL_PENDING).doc(id);
  const pendingDoc = await pendingRef.get();

  if (!pendingDoc.exists) {
    throw new Error(`Pending submission ${id} not found`);
  }

  const { submittedBy, submittedAt, status, rejectReason, ...resourceData } =
    pendingDoc.data() as Record<string, unknown>;
  // submittedBy, submittedAt, status, and rejectReason are submission-only
  // fields and must not be copied into the approved resource document.
  void submittedBy; void submittedAt; void status; void rejectReason;

  const batch = db.batch();
  batch.set(db.collection(COL_RESOURCES).doc(id), {
    ...resourceData,
    views: 0,
    shares: 0,
    bookmarks: 0,
    comments: 0,
    pinned: false,
  });
  batch.update(pendingRef, { status: "approved" });
  await batch.commit();
}

/**
 * Rejects a pending submission, recording the reason.
 */
export async function rejectSubmission(
  id: string,
  reason: RejectReason
): Promise<void> {
  const db = getDb();
  await db.collection(COL_PENDING).doc(id).update({
    status: "rejected",
    rejectReason: reason,
  });
}

// ---------------------------------------------------------------------------
// Featured collections
// ---------------------------------------------------------------------------

/** Returns all featured collections. */
export async function getFeaturedCollections(): Promise<FeaturedCollection[]> {
  const db = getDb();
  const snap = await db.collection(COL_COLLECTIONS).get();
  return snap.docs.map(docToCollection);
}

/**
 * Creates a new featured collection.  Returns the generated id.
 */
export async function createFeaturedCollection(
  data: Omit<FeaturedCollection, "id">
): Promise<string> {
  const db = getDb();
  const ref = await db.collection(COL_COLLECTIONS).add(data);
  return ref.id;
}

/** Deletes a featured collection by id. */
export async function deleteFeaturedCollection(id: string): Promise<void> {
  const db = getDb();
  await db.collection(COL_COLLECTIONS).doc(id).delete();
}
