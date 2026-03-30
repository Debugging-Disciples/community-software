"use client";

import { useState, useMemo } from "react";
import { Session } from "next-auth";
import { Navbar } from "@/components/Navbar";
import { ResourceCard, Resource } from "@/components/ResourceCard";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_RESOURCES: Resource[] = [
  {
    id: "1",
    title: "10 Career Lessons Every Christian Engineer Should Know",
    category: "Career & Growth",
    categoryEmoji: "📚",
    categoryColor: "border-tech-blue/30 hover:border-tech-blue",
    source: "Gospel Coalition",
    author: "Tim Keller",
    description:
      "Practical wisdom on navigating your engineering career with faith and integrity. Learn how to make decisions that honor God in a competitive industry.",
    url: "#",
    readTime: 8,
    views: 342,
    shares: 23,
  },
  {
    id: "2",
    title: "The Theology of Work: Why Your Job Matters to God",
    category: "Faith & Theology",
    categoryEmoji: "✝️",
    categoryColor: "border-brand-purple/30 hover:border-brand-purple",
    source: "Desiring God",
    author: "John Piper",
    description:
      "Exploring the biblical foundation for why ordinary work has eternal significance. A deep dive into vocation, calling, and the Christian's role in culture.",
    url: "#",
    readTime: 12,
    views: 891,
    shares: 67,
  },
  {
    id: "3",
    title: "Faith at Work: Integrating Your Beliefs Into the Office",
    category: "Faith & Work Integration",
    categoryEmoji: "💼",
    categoryColor: "border-brand-cyan/30 hover:border-brand-cyan",
    source: "Christianity Today",
    author: "Amy Sherman",
    description:
      "Practical strategies for bringing your whole self to the workplace — faith included. From lunch conversations to ethical dilemmas, real examples and guidance.",
    url: "#",
    readTime: 6,
    views: 514,
    shares: 41,
  },
  {
    id: "4",
    title: "Free Resources for Learning System Design in 2025",
    category: "Learning & Skill Development",
    categoryEmoji: "🎓",
    categoryColor: "border-tech-blue/30 hover:border-tech-blue",
    source: "roadmap.sh",
    author: "Community",
    description:
      "A curated list of free system design resources, videos, articles, and practice problems to level up your engineering skills this year.",
    url: "#",
    readTime: 5,
    views: 1203,
    shares: 98,
  },
  {
    id: "5",
    title: "Every Good Endeavor — Book Summary",
    category: "Books & Reading",
    categoryEmoji: "📖",
    categoryColor: "border-brand-purple/30 hover:border-brand-purple",
    source: "Medium",
    author: "Sarah Mitchell",
    description:
      "A thorough summary of Tim Keller's landmark book on connecting your faith with your work. Perfect for those short on time but long on curiosity.",
    url: "#",
    readTime: 10,
    views: 427,
    shares: 35,
  },
  {
    id: "6",
    title: "Interview: How I Kept My Faith While Scaling a Startup",
    category: "Faith & Work Integration",
    categoryEmoji: "💼",
    categoryColor: "border-brand-cyan/30 hover:border-brand-cyan",
    source: "Praxis Journal",
    author: "David Park",
    description:
      "A candid founder interview exploring the tensions between growth-at-all-costs culture and values-driven leadership. Honest, raw, and inspiring.",
    url: "#",
    readTime: 7,
    views: 263,
    shares: 19,
  },
  {
    id: "7",
    title: "Podcast: Technology, Ethics & the Christian Mind",
    category: "Videos & Podcasts",
    categoryEmoji: "🎥",
    categoryColor: "border-brand-cyan/30 hover:border-brand-cyan",
    source: "The Rise & Fall of Mars Hill",
    author: "Mike Cosper",
    description:
      "Episode exploring how Christians in tech can engage ethically with AI, social media algorithms, and the digital commons. Thoughtful and convicting.",
    url: "#",
    readTime: 45,
    views: 752,
    shares: 53,
  },
  {
    id: "8",
    title: "The Ruthless Elimination of Hurry — Review",
    category: "Books & Reading",
    categoryEmoji: "📖",
    categoryColor: "border-brand-purple/30 hover:border-brand-purple",
    source: "Gospel-Centered Life",
    author: "Mark Chen",
    description:
      "A review of John Mark Comer's spiritual formation book and its lessons for burnt-out Christian engineers. Rest, sabbath, and sustainable work rhythms.",
    url: "#",
    readTime: 9,
    views: 388,
    shares: 28,
  },
  {
    id: "9",
    title: "Getting a Tech Job After a Career Break — A Christian's Story",
    category: "Career & Growth",
    categoryEmoji: "📚",
    categoryColor: "border-tech-blue/30 hover:border-tech-blue",
    source: "LinkedIn",
    author: "Jessica Torres",
    description:
      "How one Debugging Disciples member trusted God through a year of unemployment, then landed their dream role. Encouragement and practical tips.",
    url: "#",
    readTime: 4,
    views: 618,
    shares: 74,
  },
];

// ---------------------------------------------------------------------------
// Category definitions
// ---------------------------------------------------------------------------

const CATEGORIES = [
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
}

export function ResourcesClient({ session }: ResourcesClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = MOCK_RESOURCES;

    if (activeCategory !== "all") {
      result = result.filter((r) => r.category === activeCategory);
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
    // "recent" preserves insertion order (index order = most recently added first)

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
          {/* Hub title + sort row */}
          <div className="flex items-center justify-between gap-4 py-3">
            <span className="text-sm font-semibold text-white/80 shrink-0">Resources Hub</span>
            <div className="flex items-center gap-2">
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
            <p className="text-sm text-gray-500">
              Try a different search term or category.
            </p>
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
