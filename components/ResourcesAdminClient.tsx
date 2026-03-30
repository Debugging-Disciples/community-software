"use client";

import { useState } from "react";
import { Session } from "next-auth";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  MOCK_RESOURCES,
  MOCK_PENDING,
  MOCK_COLLECTIONS,
  REJECT_REASON_LABELS,
  getTopByViews,
  getTopByBookmarks,
  getTopByComments,
  type PendingResource,
  type RejectReason,
  type Resource,
  type FeaturedCollection,
} from "@/lib/resources";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AdminTab = "moderation" | "curation" | "analytics";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

// ── Moderation ──────────────────────────────────────────────────────────────

function ModerationDashboard() {
  const [items, setItems] = useState<PendingResource[]>(MOCK_PENDING);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<RejectReason>("low_quality");

  const pending = items.filter((i) => i.status === "pending");
  const reviewed = items.filter((i) => i.status !== "pending");

  function approve(id: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "approved" } : i))
    );
  }

  function reject(id: string) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: "rejected", rejectReason: selectedReason } : i
      )
    );
    setRejectTarget(null);
  }

  return (
    <div className="space-y-6">
      {/* Pending */}
      <div>
        <h3 className="text-base font-semibold text-white mb-3">
          Pending Submissions{" "}
          <span className="ml-1 rounded-full bg-yellow-500/20 text-yellow-400 px-2 py-0.5 text-xs">
            {pending.length}
          </span>
        </h3>

        {pending.length === 0 ? (
          <p className="text-sm text-gray-500">No pending submissions. 🎉</p>
        ) : (
          <div className="space-y-3">
            {pending.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.categoryEmoji} {item.category} · Submitted by{" "}
                      <span className="text-brand-cyan">{item.submittedBy}</span> on{" "}
                      {formatDate(item.submittedAt)}
                    </p>
                    <p className="text-xs text-gray-300 mt-1 line-clamp-2">{item.description}</p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-cyan hover:underline break-all"
                    >
                      {item.url}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => approve(item.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors font-medium"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => setRejectTarget(item.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium"
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>

                {/* Reject reason picker */}
                {rejectTarget === item.id && (
                  <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-white/10">
                    <span className="text-xs text-gray-400 shrink-0">Reason:</span>
                    <select
                      value={selectedReason}
                      onChange={(e) => setSelectedReason(e.target.value as RejectReason)}
                      className="rounded-lg border border-white/10 bg-tech-darker text-xs text-white px-2 py-1.5 outline-none focus:border-brand-cyan/50"
                    >
                      {(Object.keys(REJECT_REASON_LABELS) as RejectReason[]).map((key) => (
                        <option key={key} value={key}>
                          {REJECT_REASON_LABELS[key]}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => reject(item.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium"
                    >
                      Confirm Reject
                    </button>
                    <button
                      onClick={() => setRejectTarget(null)}
                      className="text-xs text-gray-500 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently reviewed */}
      {reviewed.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-white mb-3">Recently Reviewed</h3>
          <div className="space-y-2">
            {reviewed.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <p className="text-sm text-white truncate min-w-0">{item.title}</p>
                <span
                  className={`shrink-0 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    item.status === "approved"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {item.status === "approved"
                    ? "✓ Approved"
                    : `✕ Rejected: ${REJECT_REASON_LABELS[item.rejectReason ?? "low_quality"]}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing resource management */}
      <div>
        <h3 className="text-base font-semibold text-white mb-3">Manage Existing Resources</h3>
        <ExistingResourcesTable />
      </div>
    </div>
  );
}

function ExistingResourcesTable() {
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [editId, setEditId] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState("");

  function startEdit(r: Resource) {
    setEditId(r.id);
    setEditDesc(r.description);
  }

  function saveEdit(id: string) {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, description: editDesc } : r))
    );
    setEditId(null);
  }

  function togglePin(id: string) {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, pinned: !r.pinned } : r))
    );
  }

  function deleteResource(id: string) {
    setResources((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="space-y-2">
      {resources.map((r) => (
        <div
          key={r.id}
          className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {r.pinned && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan font-medium">
                    📌 Pinned
                  </span>
                )}
                <p className="text-sm font-semibold text-white truncate">{r.title}</p>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {r.categoryEmoji} {r.category} · {r.source}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                onClick={() => startEdit(r)}
                className="text-xs px-2.5 py-1 rounded-lg border border-white/20 text-gray-400 hover:text-brand-cyan hover:border-brand-cyan/60 transition-colors"
              >
                ✎ Edit
              </button>
              <button
                onClick={() => togglePin(r.id)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                  r.pinned
                    ? "border-brand-cyan/60 text-brand-cyan bg-brand-cyan/10"
                    : "border-white/20 text-gray-400 hover:text-brand-cyan hover:border-brand-cyan/60"
                }`}
              >
                📌 {r.pinned ? "Unpin" : "Pin"}
              </button>
              <button
                onClick={() => deleteResource(r.id)}
                className="text-xs px-2.5 py-1 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
              >
                🗑 Delete
              </button>
            </div>
          </div>

          {editId === r.id && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-tech-darker text-xs text-white px-3 py-2 outline-none focus:border-brand-cyan/50 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => saveEdit(r.id)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-brand-cyan/20 text-brand-cyan hover:bg-brand-cyan/30 transition-colors font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditId(null)}
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Curation ─────────────────────────────────────────────────────────────────

function CurationTools() {
  const [collections, setCollections] = useState<FeaturedCollection[]>(MOCK_COLLECTIONS);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  function addCollection() {
    if (!newTitle.trim()) return;
    setCollections((prev) => [
      ...prev,
      {
        id: `c${Date.now()}`,
        title: newTitle.trim(),
        description: newDesc.trim(),
        resourceIds: [],
      },
    ]);
    setNewTitle("");
    setNewDesc("");
    setCreating(false);
  }

  function deleteCollection(id: string) {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Featured Collections */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-white">Featured Collections</h3>
          <button
            onClick={() => setCreating(true)}
            className="text-xs px-3 py-1.5 rounded-lg bg-brand-cyan/20 text-brand-cyan hover:bg-brand-cyan/30 transition-colors font-medium"
          >
            + New Collection
          </button>
        </div>

        {/* Create form */}
        {creating && (
          <div className="mb-4 rounded-xl border border-brand-cyan/30 bg-brand-cyan/5 p-4 space-y-3">
            <p className="text-sm font-semibold text-white">New Collection</p>
            <input
              type="text"
              placeholder="Collection title…"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-tech-darker text-sm text-white px-3 py-2 outline-none focus:border-brand-cyan/50"
            />
            <input
              type="text"
              placeholder="Short description…"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-tech-darker text-sm text-white px-3 py-2 outline-none focus:border-brand-cyan/50"
            />
            <div className="flex gap-2">
              <button
                onClick={addCollection}
                className="text-xs px-3 py-1.5 rounded-lg bg-brand-cyan/20 text-brand-cyan hover:bg-brand-cyan/30 transition-colors font-medium"
              >
                Create
              </button>
              <button
                onClick={() => setCreating(false)}
                className="text-xs text-gray-500 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {collections.map((col) => {
            const colResources = MOCK_RESOURCES.filter((r) =>
              col.resourceIds.includes(r.id)
            );
            return (
              <div
                key={col.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{col.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{col.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {colResources.length} resource{colResources.length !== 1 ? "s" : ""}
                      {colResources.length > 0 && (
                        <> · {colResources.map((r) => r.categoryEmoji).join(" ")}</>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteCollection(col.id)}
                    className="shrink-0 text-xs px-2.5 py-1 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pinned resources summary */}
      <div>
        <h3 className="text-base font-semibold text-white mb-3">Pinned Resources</h3>
        {MOCK_RESOURCES.filter((r) => r.pinned).length === 0 ? (
          <p className="text-sm text-gray-500">
            No resources are pinned yet. Pin a resource from the Moderation tab to surface it at
            the top of its category.
          </p>
        ) : (
          <div className="space-y-2">
            {MOCK_RESOURCES.filter((r) => r.pinned).map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-3"
              >
                <span className="text-brand-cyan">📌</span>
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{r.title}</p>
                  <p className="text-xs text-gray-400">{r.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Analytics ────────────────────────────────────────────────────────────────

function AnalyticsDashboard() {
  const topViewed = getTopByViews(5);
  const topBookmarked = getTopByBookmarks(5);
  const topCommented = getTopByComments(5);

  return (
    <div className="space-y-8">
      <AnalyticsSection
        title="Most Viewed (Last 30 Days)"
        emoji="👁️"
        resources={topViewed}
        valueKey="views"
        valueLabel="views"
        barColor="bg-brand-cyan"
        maxValue={topViewed[0]?.views ?? 1}
      />
      <AnalyticsSection
        title="Most Bookmarked"
        emoji="🔖"
        resources={topBookmarked}
        valueKey="bookmarks"
        valueLabel="bookmarks"
        barColor="bg-brand-purple"
        maxValue={topBookmarked[0]?.bookmarks ?? 1}
      />
      <AnalyticsSection
        title="Most Commented"
        emoji="💬"
        resources={topCommented}
        valueKey="comments"
        valueLabel="comments"
        barColor="bg-tech-blue"
        maxValue={topCommented[0]?.comments ?? 1}
      />
    </div>
  );
}

interface AnalyticsSectionProps {
  title: string;
  emoji: string;
  resources: Resource[];
  valueKey: "views" | "bookmarks" | "comments";
  valueLabel: string;
  barColor: string;
  maxValue: number;
}

function AnalyticsSection({
  title,
  emoji,
  resources,
  valueKey,
  valueLabel,
  barColor,
  maxValue,
}: AnalyticsSectionProps) {
  return (
    <div>
      <h3 className="text-base font-semibold text-white mb-3">
        {emoji} {title}
      </h3>
      <div className="space-y-3">
        {resources.map((r, i) => {
          const value = (r[valueKey] as number) ?? 0;
          const pct = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
          return (
            <div key={r.id} className="space-y-1">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0 text-xs font-bold text-gray-500 w-4">{i + 1}</span>
                  <p className="text-sm text-white truncate">{r.title}</p>
                </div>
                <span className="shrink-0 text-xs text-gray-400">
                  {value.toLocaleString()} {valueLabel}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full ${barColor} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main admin component
// ---------------------------------------------------------------------------

interface ResourcesAdminClientProps {
  session: Session;
}

const TABS: { id: AdminTab; label: string; emoji: string }[] = [
  { id: "moderation", label: "Moderation", emoji: "🛡️" },
  { id: "curation", label: "Curation", emoji: "✨" },
  { id: "analytics", label: "Analytics", emoji: "📊" },
];

export function ResourcesAdminClient({ session }: ResourcesAdminClientProps) {
  const [tab, setTab] = useState<AdminTab>("moderation");
  const pendingCount = MOCK_PENDING.filter((p) => p.status === "pending").length;

  return (
    <div className="min-h-screen bg-tech-dark text-white">
      {/* Background */}
      <div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(59,130,246,0.15) 1px, transparent 0), radial-gradient(circle at 75px 75px, rgba(139,92,246,0.15) 1px, transparent 0)",
          backgroundSize: "100px 100px",
        }}
      />

      <Navbar user={session.user} />

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/resources"
                className="text-xs text-gray-500 hover:text-brand-cyan transition-colors"
              >
                ← Resources Hub
              </Link>
            </div>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">
                Admin Controls
              </span>
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Moderation, curation, and analytics for the Resources Hub.
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-center">
              <p className="text-xl font-bold text-yellow-400">{pendingCount}</p>
              <p className="text-xs text-gray-400">Pending</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center">
              <p className="text-xl font-bold text-white">{MOCK_RESOURCES.length}</p>
              <p className="text-xs text-gray-400">Resources</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center">
              <p className="text-xl font-bold text-white">{MOCK_COLLECTIONS.length}</p>
              <p className="text-xs text-gray-400">Collections</p>
            </div>
          </div>
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 mb-6 border-b border-white/10 pb-0">
          {TABS.map(({ id, label, emoji }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors rounded-t-lg ${
                tab === id
                  ? "text-brand-cyan bg-brand-cyan/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{emoji}</span>
              <span>{label}</span>
              {id === "moderation" && pendingCount > 0 && (
                <span className="ml-1 rounded-full bg-yellow-500 text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
              {tab === id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-cyan rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {tab === "moderation" && <ModerationDashboard />}
          {tab === "curation" && <CurationTools />}
          {tab === "analytics" && <AnalyticsDashboard />}
        </div>
      </main>
    </div>
  );
}
