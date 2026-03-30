"use client";

import { useState, useMemo } from "react";
import { Session } from "next-auth";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ResourceCard } from "@/components/ResourceCard";
import { MOCK_RESOURCES, type ResourceCategory } from "@/lib/resources";

// ---------------------------------------------------------------------------
// Category definitions
// ---------------------------------------------------------------------------

const CATEGORIES: { id: string; label: string; emoji: string }[] = [
  { id: "all", label: "All Resources", emoji: "" },
  { id: "Career & Growth", label: "Career & Growth", emoji: "📚" },
  { id: "Faith & Theology", label: "Faith & Theology", emoji: "✝️" },
  { id: "Faith & Work Integration", label: "Faith & Work Integration", emoji: "💼" },
  { id: "Learning & Skill Development", label: "Learning & Skill Development", emoji: "🎓" },
  { id: "Books & Reading", label: "Books & Reading", emoji: "📖" },
  { id: "Videos & Podcasts", label: "Videos & Podcasts", emoji: "🎥" },
];

type SortKey = "recent" | "views" | "shares";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "recent", label: "Recently Added" },
  { key: "views", label: "Most Viewed" },
  { key: "shares", label: "Most Shared" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ResourcesClientProps {
  session: Session;
  isAdmin?: boolean;
}

export function ResourcesClient({ session, isAdmin = false }: ResourcesClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = MOCK_RESOURCES;

    if (activeCategory !== "all") {
      result = result.filter((r) => r.category === (activeCategory as ResourceCategory));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.author.toLowerCase().includes(q) ||
          r.source.toLowerCase().includes(q)
      );
    }

    const sorted = [...result];
    if (sortKey === "views") sorted.sort((a, b) => b.views - a.views);
    else if (sortKey === "shares") sorted.sort((a, b) => b.shares - a.shares);
    // "recent" — addedAt descending
    else sorted.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

    return sorted;
  }, [activeCategory, sortKey, search]);

  return (
    <div className="min-h-screen bg-tech-dark text-white">
      {/* Circuit pattern background */}
      <div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(59,130,246,0.15) 1px, transparent 0), radial-gradient(circle at 75px 75px, rgba(139,92,246,0.15) 1px, transparent 0)",
          backgroundSize: "100px 100px",
        }}
      />

      <Navbar user={session.user} />

      {/* Sticky sub-nav */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-tech-darker/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          {/* Hub title + sort + admin row */}
          <div className="flex items-center justify-between gap-4 py-3 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-white/80 shrink-0">Resources Hub</span>
              {isAdmin && (
                <Link
                  href="/resources/admin"
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-brand-purple/20 text-brand-purple hover:bg-brand-purple/30 transition-colors font-medium"
                >
                  ⚙️ Admin
                </Link>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500 shrink-0">Sort:</span>
              {SORT_OPTIONS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSortKey(key)}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                    sortKey === key
                      ? "bg-brand-cyan/15 text-brand-cyan font-medium"
                      : "text-gray-400 hover:text-brand-cyan"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-2">
            {CATEGORIES.map(({ id, label, emoji }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeCategory === id
                    ? "bg-brand-cyan/15 text-brand-cyan"
                    : "text-gray-400 hover:bg-white/5 hover:text-brand-cyan"
                }`}
              >
                {emoji && <span>{emoji}</span>}
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Page header + search */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">
                Resources Hub
              </span>
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Curated articles, books, podcasts, and more for the Debugging Disciples community.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input
              type="search"
              placeholder="Search resources…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/30"
            />
          </div>
        </div>

        {/* Results count */}
        <p className="mb-4 text-xs text-gray-500">
          Showing {filtered.length} resource{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "all" && (
            <> in <span className="text-brand-cyan">{activeCategory}</span></>
          )}
          {search.trim() && (
            <> matching &ldquo;<span className="text-brand-cyan">{search}</span>&rdquo;</>
          )}
        </p>

        {/* Cards grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <span className="text-5xl">🔍</span>
            <p className="text-lg font-semibold text-white/70">No resources found</p>
            <p className="text-sm text-gray-500">Try a different search term or category.</p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
              }}
              className="mt-2 rounded-lg border border-white/20 px-4 py-2 text-sm text-gray-400 transition-colors hover:border-brand-cyan/60 hover:text-brand-cyan"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
