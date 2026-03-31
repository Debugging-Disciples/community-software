"use client";

import { useState } from "react";
import Image from "next/image";
import { Session } from "next-auth";
import { Navbar } from "@/components/Navbar";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = "recent" | "most_prayed" | "my_requests";

type Category = "personal" | "family" | "work" | "faith" | "other";

interface Reply {
  id: string;
  authorName: string;
  authorImage: string | null;
  text: string;
  time: string;
  likes: number;
}

interface PrayerRequest {
  id: string;
  authorName: string;
  authorImage: string | null;
  date: string;
  text: string;
  category: Category;
  prayerCount: number;
  hasPrayed: boolean;
  replies: Reply[];
  isOwn?: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<Category, { label: string; emoji: string; color: string }> = {
  personal: { label: "Personal", emoji: "🙏", color: "#8b5cf6" },
  family:   { label: "Family",   emoji: "👨‍👩‍👧", color: "#ec4899" },
  work:     { label: "Work",     emoji: "💼", color: "#3b82f6" },
  faith:    { label: "Faith",    emoji: "✝️", color: "#a78bfa" },
  other:    { label: "Other",    emoji: "❓", color: "#9ca3af" },
};

const mockRequests: PrayerRequest[] = [
  {
    id: "1",
    authorName: "Amara Osei",
    authorImage: null,
    date: "2 days ago",
    text: "Please pray for wisdom as I navigate a major career decision. I've been offered two great opportunities and I'm seeking God's guidance on which path to take. I want to be where He wants me to be, not just where it looks good on paper.",
    category: "work",
    prayerCount: 23,
    hasPrayed: false,
    replies: [
      { id: "r1", authorName: "Marcus Rivera", authorImage: null, text: "Praying for clarity and peace as you seek God's will, Amara!", time: "1 day ago", likes: 5 },
      { id: "r2", authorName: "Priya Nair", authorImage: null, text: "Trusting God's timing and plan. You've got this! 🙏", time: "22 hours ago", likes: 3 },
    ],
  },
  {
    id: "2",
    authorName: "Devon Clark",
    authorImage: null,
    date: "4 days ago",
    text: "Asking for prayers for my sister who is recovering from surgery. The doctors say she's doing well but it's been a tough week for our family. Thank you for your love and support.",
    category: "family",
    prayerCount: 31,
    hasPrayed: true,
    isOwn: true,
    replies: [
      { id: "r3", authorName: "Jordan Lee", authorImage: null, text: "Standing in prayer with you and your family. Sending love!", time: "3 days ago", likes: 7 },
    ],
  },
  {
    id: "3",
    authorName: "Marcus Rivera",
    authorImage: null,
    date: "1 week ago",
    text: "Lord, please guide our community as we grow. I'm believing for more members who genuinely seek You and want to see their faith integrated with their careers in tech. Let this be a place of real transformation.",
    category: "faith",
    prayerCount: 45,
    hasPrayed: false,
    replies: [],
  },
  {
    id: "4",
    authorName: "Sofia Hernandez",
    authorImage: null,
    date: "1 week ago",
    text: "Struggling with loneliness in this season of life. Remote work can be isolating and I'm praying for deeper community connections. Thank you for this space.",
    category: "personal",
    prayerCount: 18,
    hasPrayed: false,
    replies: [
      { id: "r4", authorName: "Amara Osei", authorImage: null, text: "You're not alone! Let's connect this week. DM me!", time: "6 days ago", likes: 4 },
    ],
  },
  {
    id: "5",
    authorName: "Kwame Asante",
    authorImage: null,
    date: "2 weeks ago",
    text: "Praise report! God answered our prayers from last month - I got the job offer I was hoping for at a mission-aligned company. Thank you all for praying with me! 🎉",
    category: "work",
    prayerCount: 56,
    hasPrayed: false,
    replies: [],
  },
];

// ─── Helper components ────────────────────────────────────────────────────────

function Avatar({ image, name, size = 36 }: { image: string | null; name: string; size?: number }) {
  const initials = name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className="relative flex-shrink-0 rounded-full overflow-hidden border-2 border-brand-cyan"
      style={{ width: size, height: size, boxShadow: "0 0 0 1px rgba(6,182,212,0.2)" }}
    >
      {image ? (
        <Image src={image} alt={name} fill className="object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-cyan/20 to-brand-purple/20 text-brand-cyan font-bold text-xs">
          {initials}
        </div>
      )}
    </div>
  );
}

function CategoryBadge({ category }: { category: Category }) {
  const cfg = CATEGORY_CONFIG[category];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium"
      style={{ background: `${cfg.color}20`, color: cfg.color }}
    >
      {cfg.emoji} {cfg.label}
    </span>
  );
}

// ─── New Prayer Request Modal ─────────────────────────────────────────────────

function NewPrayerModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] = useState<Category>("personal");
  const [isPublic, setIsPublic] = useState(true);
  const MAX_CHARS = 500;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production, submit to API
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.6))" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden border border-white/10"
        style={{ background: "#0a0a0a", borderTop: "4px solid #06b6d4" }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">🙏 New Prayer Request</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-xl leading-none">×</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief title for your request…"
                className="w-full px-4 py-2.5 rounded-lg text-gray-100 placeholder-gray-600 text-sm outline-none transition-all
                  border-b-2 border-white/10 focus:border-brand-cyan"
                style={{ background: "rgba(255,255,255,0.05)" }}
                required
              />
            </div>

            {/* Request Text */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                Prayer Request
                <span className="ml-2 text-gray-600 text-xs">{text.length}/{MAX_CHARS}</span>
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                placeholder="Share what's on your heart…"
                rows={5}
                className="w-full px-4 py-2.5 rounded-lg text-gray-100 placeholder-gray-600 text-sm outline-none transition-all resize-none
                  border-b-2 border-white/10 focus:border-brand-cyan"
                style={{ background: "rgba(255,255,255,0.05)" }}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-4 py-2.5 rounded-lg text-gray-100 text-sm outline-none transition-all appearance-none cursor-pointer"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: CATEGORY_CONFIG[category].color }}
              >
                {(Object.keys(CATEGORY_CONFIG) as Category[]).map((key) => (
                  <option key={key} value={key} style={{ background: "#0a0a0a" }}>
                    {CATEGORY_CONFIG[key].emoji} {CATEGORY_CONFIG[key].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Public toggle */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-gray-200">Public request</p>
                <p className="text-xs text-gray-500">Visible to all community members</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className="relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0"
                style={{ background: isPublic ? "#06b6d4" : "rgba(255,255,255,0.1)" }}
                aria-pressed={isPublic}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200"
                  style={{ left: isPublic ? "calc(100% - 20px - 2px)" : 2 }}
                />
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-sm text-black transition-all duration-300
                bg-gradient-to-r from-brand-cyan to-brand-purple hover:shadow-lg hover:opacity-90"
              style={{ boxShadow: "0 0 20px rgba(6,182,212,0.3)" }}
            >
              Share Prayer Request 🙏
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Prayer Request Card ──────────────────────────────────────────────────────

function PrayerCard({ request, onPray }: { request: PrayerRequest; onPray: (id: string) => void }) {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");

  return (
    <div
      className="rounded-2xl overflow-hidden border border-white/10 border-l-[3px]"
      style={{
        background: "linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(255,255,255,0.1))",
        borderLeftColor: "#8b5cf6",
      }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <Avatar image={request.authorImage} name={request.authorName} />
            <div>
              <button className="text-brand-cyan hover:text-white transition-colors text-sm font-medium">
                {request.authorName}
              </button>
              <p className="text-gray-400 text-xs">{request.date}</p>
            </div>
          </div>
          <CategoryBadge category={request.category} />
        </div>

        {/* Body */}
        <p className="text-gray-200 text-sm leading-relaxed mb-4">{request.text}</p>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Pray button */}
          <button
            onClick={() => onPray(request.id)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200
              ${request.hasPrayed
                ? "bg-brand-cyan border-brand-cyan text-black"
                : "border-brand-cyan text-brand-cyan hover:bg-brand-cyan hover:text-black"
              }`}
            style={request.hasPrayed ? { boxShadow: "0 0 12px rgba(6,182,212,0.4)" } : {}}
          >
            ❤️ I prayed for this
          </button>

          <span className="text-gray-400 text-sm">
            <span className="text-brand-cyan font-bold">{request.prayerCount}</span> people prayed
          </span>

          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-brand-cyan hover:text-white text-sm transition-colors"
          >
            💬 Reply{request.replies.length > 0 ? ` (${request.replies.length})` : ""}
          </button>

          <button className="text-gray-400 hover:text-brand-cyan text-sm transition-colors ml-auto">
            📤 Share
          </button>
        </div>
      </div>

      {/* Replies */}
      {showReplies && (
        <div className="border-t border-white/5 bg-white/3 px-5 pb-4 pt-3 space-y-3">
          {request.replies.map((reply) => (
            <div key={reply.id} className="flex gap-2.5 pl-3 border-l border-white/10">
              <Avatar image={reply.authorImage} name={reply.authorName} size={28} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-100 text-xs font-medium">{reply.authorName}</span>
                  <span className="text-gray-500 text-xs">{reply.time}</span>
                </div>
                <p className="text-gray-200 text-sm mt-0.5">{reply.text}</p>
                <button className="text-gray-500 hover:text-brand-cyan text-xs mt-0.5 transition-colors">
                  ♡ {reply.likes}
                </button>
              </div>
            </div>
          ))}

          {/* Reply input */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply…"
              className="flex-1 px-3 py-1.5 rounded-lg text-gray-100 placeholder-gray-600 text-xs outline-none
                border border-white/10 focus:border-brand-cyan transition-all"
              style={{ background: "rgba(255,255,255,0.05)" }}
            />
            <button
              onClick={() => {
                if (replyText.trim()) {
                  // In production, submit reply to API endpoint
                  setReplyText("");
                }
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-brand-cyan border border-brand-cyan hover:bg-brand-cyan hover:text-black transition-all"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface PrayerClientProps {
  session: Session;
}

export function PrayerClient({ session }: PrayerClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("recent");
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState(mockRequests);

  const handlePray = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, hasPrayed: !r.hasPrayed, prayerCount: r.hasPrayed ? r.prayerCount - 1 : r.prayerCount + 1 }
          : r
      )
    );
  };

  const filteredRequests = requests
    .filter((r) => {
      const matchesSearch =
        !searchQuery ||
        r.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.authorName.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeTab === "my_requests") {
        return !!r.isOwn && matchesSearch;
      }

      return matchesSearch;
    })
    .sort((a, b) => {
      if (activeTab === "most_prayed") return b.prayerCount - a.prayerCount;
      return 0; // "recent" keeps original order
    });
  const TABS: { key: TabKey; label: string }[] = [
    { key: "recent", label: "Recent" },
    { key: "most_prayed", label: "Most Prayed For" },
    { key: "my_requests", label: "My Requests" },
  ];

  return (
    <>
      {showModal && <NewPrayerModal onClose={() => setShowModal(false)} />}

      <div className="min-h-screen text-white" style={{ background: "linear-gradient(to bottom, #0a0a0a, #000000)" }}>
        {/* Circuit pattern overlay */}
        <div
          className="fixed inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25px 25px, rgba(59,130,246,0.15) 1px, transparent 0), radial-gradient(circle at 75px 75px, rgba(139,92,246,0.15) 1px, transparent 0)",
            backgroundSize: "100px 100px",
          }}
        />

        <Navbar user={session.user} />

        <main className="relative z-10 max-w-3xl mx-auto px-6 py-8">
          {/* Page header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">🙏 Prayer Requests</h1>
              <p className="text-gray-400 text-sm mt-1">Lift each other up in prayer</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm text-black transition-all duration-300
                bg-gradient-to-r from-brand-cyan to-brand-purple hover:opacity-90"
              style={{ boxShadow: "0 0 16px rgba(6,182,212,0.3)" }}
            >
              + New Request
            </button>
          </div>

          {/* Filter / Sort bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Tabs */}
            <div className="flex gap-1">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 flex-shrink-0
                      ${isActive
                        ? "border-brand-cyan text-white"
                        : "border-transparent text-gray-300 hover:text-brand-purple"
                      }`}
                    style={isActive ? { boxShadow: "0 2px 8px rgba(6,182,212,0.4)" } : {}}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search requests…"
                className="w-full px-4 py-2 rounded-lg text-gray-100 placeholder-gray-600 text-sm outline-none transition-all
                  border-b-2 border-white/10 focus:border-brand-cyan"
                style={{ background: "#0a0a0a" }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-cyan text-sm">🔍</span>
            </div>
          </div>

          {/* Request list */}
          <div className="space-y-4">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <PrayerCard key={request.id} request={request} onPray={handlePray} />
              ))
            ) : (
              <div className="text-center py-16 text-gray-500">
                {activeTab === "my_requests"
                  ? "You haven't shared any prayer requests yet."
                  : "No requests match your search."}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
