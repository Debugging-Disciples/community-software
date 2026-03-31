"use client";

import { useState } from "react";

const CODE_BLOCK_REGEX = /```[\s\S]*?```/g;

type Topic = "All" | "Bible" | "Faith" | "Career" | "Tech";
type SortOption = "Most Recent" | "Most Helpful" | "Trending";

interface Comment {
  id: string;
  author: string;
  avatar: string | null;
  text: string;
  helpfulVotes: number;
  time: string;
}

interface QAItem {
  id: string;
  topic: Exclude<Topic, "All">;
  question: string;
  answer: string;
  askedBy: string;
  askedById: string;
  avatar: string | null;
  date: string;
  helpfulCount: number;
  comments: Comment[];
  userVoted: "helpful" | "not_helpful" | null;
}

const topicConfig: Record<
  Exclude<Topic, "All">,
  { emoji: string; color: string; bg: string; pill: string }
> = {
  Bible: {
    emoji: "📖",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.15)",
    pill: "🔵 Bible",
  },
  Faith: {
    emoji: "✝️",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.15)",
    pill: "🟣 Faith",
  },
  Career: {
    emoji: "💼",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.15)",
    pill: "🔷 Career",
  },
  Tech: {
    emoji: "💻",
    color: "#9ca3af",
    bg: "rgba(156,163,175,0.15)",
    pill: "⬜ Tech",
  },
};

const mockQA: QAItem[] = [
  {
    id: "1",
    topic: "Bible",
    question: "What does Proverbs 3:5-6 mean by 'lean not on your own understanding'?",
    answer:
      "This passage is calling us to surrender our own limited perspective and trust in God's infinite wisdom. Leaning on our own understanding means relying solely on our human intellect and experience, which is inherently limited. When we trust in the Lord with all our heart, we acknowledge that His ways are higher than our ways (Isaiah 55:9). Practically, this means bringing our decisions to God in prayer, seeking counsel from scripture, and remaining open to outcomes different from what we planned. The promise is that He will 'make your paths straight' — not necessarily easy, but aligned with His perfect will.",
    askedBy: "Sarah M.",
    askedById: "user-1",
    avatar: null,
    date: "3 days ago",
    helpfulCount: 12,
    userVoted: null,
    comments: [
      {
        id: "c1",
        author: "James T.",
        avatar: null,
        text: "Great answer! I'd also add that the original Hebrew word for 'trust' (batach) implies a full reliance, like leaning all your weight on something.",
        helpfulVotes: 4,
        time: "2 days ago",
      },
      {
        id: "c2",
        author: "Lisa K.",
        avatar: null,
        text: "This helped me so much. I've been wrestling with a career decision and this gives me peace.",
        helpfulVotes: 2,
        time: "1 day ago",
      },
    ],
  },
  {
    id: "2",
    topic: "Tech",
    question: "How do I handle async state in React without race conditions?",
    answer:
      "Race conditions in async React code typically happen when multiple async operations complete in an unpredictable order. The most reliable pattern is using a cleanup flag inside `useEffect`:\n\n```js\nuseEffect(() => {\n  let cancelled = false;\n  fetchData().then(data => {\n    if (!cancelled) setState(data);\n  });\n  return () => { cancelled = true; };\n}, []);\n```\n\nFor more complex scenarios, consider using React Query or SWR which handle cancellation, caching, and deduplication for you. AbortController is also useful for cancelling fetch requests specifically.",
    askedBy: "Dev Johnson",
    askedById: "user-2",
    avatar: null,
    date: "1 week ago",
    helpfulCount: 24,
    userVoted: null,
    comments: [
      {
        id: "c3",
        author: "Mike R.",
        avatar: null,
        text: "React Query is a game changer for this. Highly recommend it!",
        helpfulVotes: 7,
        time: "6 days ago",
      },
    ],
  },
  {
    id: "3",
    topic: "Career",
    question: "How do I negotiate salary as a Christian without feeling greedy?",
    answer:
      "Negotiating fair compensation is not greed — it's wise stewardship. Consider these principles: First, know your market value through research (Glassdoor, Levels.fyi, LinkedIn). Second, frame negotiations around the value you bring to the organization, not just personal need. Third, pray and seek counsel before negotiations so you enter with peace rather than anxiety. Remember that fair compensation enables generous giving and serving your family well. Proverbs 31 celebrates the virtuous woman's business acumen. You can negotiate firmly and graciously without compromising integrity.",
    askedBy: "Rachel B.",
    askedById: "user-3",
    avatar: null,
    date: "2 weeks ago",
    helpfulCount: 18,
    userVoted: null,
    comments: [],
  },
  {
    id: "4",
    topic: "Faith",
    question: "How do you maintain your faith identity in a secular workplace?",
    answer:
      "This is one of the most common challenges for Christians in tech. A few strategies that have helped our community: (1) Start your day with devotional time before work begins. (2) Be authentic but not preachy — let your character speak. (3) Find one or two believers in your workplace for accountability. (4) Use lunch breaks for reflection or scripture reading. (5) Join communities like ours to stay spiritually connected. Your faith doesn't need to be hidden, but wisdom about context and timing matters. Daniel in Babylon is a great biblical model.",
    askedBy: "Chris P.",
    askedById: "user-4",
    avatar: null,
    date: "5 days ago",
    helpfulCount: 31,
    userVoted: null,
    comments: [
      {
        id: "c4",
        author: "Maria G.",
        avatar: null,
        text: "The Daniel example is perfect. He excelled at his work AND maintained his faith. We don't have to choose.",
        helpfulVotes: 9,
        time: "4 days ago",
      },
      {
        id: "c5",
        author: "Tom W.",
        avatar: null,
        text: "Finding even one other believer at work has been transformative for me.",
        helpfulVotes: 5,
        time: "3 days ago",
      },
    ],
  },
  {
    id: "5",
    topic: "Bible",
    question: "What are the best resources for studying the Old Testament as a developer?",
    answer:
      "Great question from a tech perspective! Some excellent resources: (1) BibleProject — free animated videos that give incredible context to each book. (2) 'The Bible Tells Me So' by Peter Enns for understanding literary genre. (3) ESV Study Bible for detailed footnotes. (4) Blue Letter Bible for original Hebrew word studies. For developers specifically, thinking of the OT as a codebase with layers of history, refactoring, and inherited patterns can be illuminating — Paul actually uses this kind of metaphor in Galatians when discussing the Law.",
    askedBy: "Nathan L.",
    askedById: "user-5",
    avatar: null,
    date: "3 weeks ago",
    helpfulCount: 9,
    userVoted: null,
    comments: [],
  },
];

const tabStyles: Record<Topic, { border: string; text: string }> = {
  All: { border: "#06b6d4", text: "#06b6d4" },
  Bible: { border: "#8b5cf6", text: "#8b5cf6" },
  Faith: { border: "#06b6d4", text: "#06b6d4" },
  Career: { border: "#3b82f6", text: "#3b82f6" },
  Tech: { border: "#9ca3af", text: "#9ca3af" },
};

export function QAHub({ isAdmin }: { isAdmin: boolean }) {
  const [activeTopic, setActiveTopic] = useState<Topic>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("Most Recent");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [qaItems, setQaItems] = useState<QAItem[]>(mockQA);

  const topics: Topic[] = ["All", "Bible", "Faith", "Career", "Tech"];
  const sortOptions: SortOption[] = ["Most Recent", "Most Helpful", "Trending"];

  const filtered = qaItems
    .filter((item) => {
      const matchesTopic = activeTopic === "All" || item.topic === activeTopic;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.askedBy.toLowerCase().includes(q);
      return matchesTopic && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "Most Helpful") return b.helpfulCount - a.helpfulCount;
      if (sortBy === "Trending") return b.comments.length - a.comments.length;
      return 0; // Most Recent — already in mock order
    });

  function handleVote(id: string, vote: "helpful" | "not_helpful") {
    setQaItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (item.userVoted === vote) {
          // Undo vote
          return {
            ...item,
            helpfulCount:
              vote === "helpful" ? item.helpfulCount - 1 : item.helpfulCount,
            userVoted: null,
          };
        }
        const prevWasHelpful = item.userVoted === "helpful";
        return {
          ...item,
          helpfulCount:
            vote === "helpful"
              ? item.helpfulCount + 1
              : prevWasHelpful
              ? item.helpfulCount - 1
              : item.helpfulCount,
          userVoted: vote,
        };
      })
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 space-y-4">
        {/* Topic Tabs */}
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => {
            const isActive = activeTopic === topic;
            const style = tabStyles[topic];
            return (
              <button
                key={topic}
                onClick={() => setActiveTopic(topic)}
                className="px-4 py-1.5 text-sm font-medium transition-all duration-200"
                style={{
                  color: isActive ? style.text : "#9ca3af",
                  borderBottom: isActive ? `2px solid ${style.border}` : "2px solid transparent",
                }}
              >
                {topic}
              </button>
            );
          })}
        </div>

        {/* Search + Sort Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-tech-darker text-gray-200 placeholder-gray-500 rounded-lg px-4 py-2 text-sm border border-white/10 outline-none focus:border-brand-cyan transition-colors"
          />
          <div className="flex gap-2">
            {sortOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setSortBy(opt)}
                className="px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                style={{
                  background: sortBy === opt ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.05)",
                  color: sortBy === opt ? "#06b6d4" : "#9ca3af",
                  border: sortBy === opt ? "1px solid #06b6d4" : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Q&A Cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No questions found matching your search.
          </div>
        )}
        {filtered.map((item) => {
          const cfg = topicConfig[item.topic];
          const isExpanded = expandedId === item.id;
          const snippetText = item.answer.replace(CODE_BLOCK_REGEX, "[code block]");
          const snippet = snippetText.length > 200 ? snippetText.slice(0, 200) + "…" : snippetText;

          return (
            <div
              key={item.id}
              className="rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border-l-[3px] overflow-hidden"
              style={{ borderLeftColor: "#3b82f6", outline: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Card Header */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-gray-100 text-lg font-semibold leading-snug flex-1">
                    {item.question}
                  </h3>
                  <span
                    className="flex-shrink-0 text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    {cfg.pill}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border"
                      style={{
                        background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
                        borderColor: "#3b82f6",
                      }}
                    >
                      {item.askedBy[0]}
                    </div>
                    <span className="text-tech-blue font-medium">{item.askedBy}</span>
                  </div>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-300">{item.date}</span>
                </div>

                {/* Answer Snippet */}
                <p className="text-gray-200 text-sm leading-relaxed mb-4">{snippet}</p>

                {/* Stats Row */}
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5" style={{ color: "#3b82f6" }}>
                    👍 <span className="font-semibold">{item.helpfulCount}</span>{" "}
                    <span className="text-gray-300 font-normal">found this helpful</span>
                  </span>
                  <span className="text-gray-300">
                    💬 {item.comments.length} comment{item.comments.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Expand / Collapse */}
              <div className="px-5 pb-3">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="text-xs font-medium transition-colors"
                  style={{ color: "#06b6d4" }}
                >
                  {isExpanded ? "▲ Collapse" : "▼ Read full answer & comments"}
                </button>
              </div>

              {/* Expanded Full View */}
              {isExpanded && (
                <div className="border-t border-white/10 p-5 space-y-5">
                  {/* Full Answer */}
                  <div>
                    <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                      Full Answer
                    </h4>
                    <div className="space-y-3">
                      {item.answer.split(new RegExp(`(${CODE_BLOCK_REGEX.source})`, "g")).map((part, i) => {
                        if (part.startsWith("```") && part.endsWith("```")) {
                          const code = part.slice(3, -3).replace(/^[a-z]+\n/, "");
                          return (
                            <pre
                              key={i}
                              className="rounded-lg p-4 text-xs text-gray-200 overflow-x-auto"
                              style={{
                                background: "#0a0a0a",
                                border: "1px solid #06b6d4",
                              }}
                            >
                              <code>{code}</code>
                            </pre>
                          );
                        }
                        return (
                          <p key={i} className="text-gray-200 text-sm leading-relaxed">
                            {part}
                          </p>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleVote(item.id, "helpful")}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      style={{
                        border: "1px solid #3b82f6",
                        background:
                          item.userVoted === "helpful"
                            ? "#3b82f6"
                            : "transparent",
                        color:
                          item.userVoted === "helpful" ? "white" : "#3b82f6",
                      }}
                    >
                      👍 Helpful
                    </button>
                    <button
                      onClick={() => handleVote(item.id, "not_helpful")}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      style={{
                        border: "1px solid #3b82f6",
                        background:
                          item.userVoted === "not_helpful"
                            ? "#3b82f6"
                            : "transparent",
                        color:
                          item.userVoted === "not_helpful"
                            ? "white"
                            : "#3b82f6",
                      }}
                    >
                      👎 Not Helpful
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-gray-300 hover:text-brand-cyan"
                      style={{ border: "1px solid #374151" }}
                    >
                      🔗 Share
                    </button>
                    {!isAdmin && (
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-red-400 hover:bg-red-900/20"
                        style={{ border: "1px solid #ef4444" }}
                      >
                        🚩 Report
                      </button>
                    )}
                  </div>

                  {/* Comments */}
                  {item.comments.length > 0 && (
                    <div>
                      <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                        Comments
                      </h4>
                      <div className="space-y-3">
                        {item.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <div
                              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2"
                              style={{
                                background: "linear-gradient(135deg,#06b6d4,#8b5cf6)",
                                borderColor: "#06b6d4",
                              }}
                            >
                              {comment.author[0]}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className="text-sm font-medium"
                                  style={{ color: "#06b6d4" }}
                                >
                                  {comment.author}
                                </span>
                                <span className="text-gray-500 text-xs">
                                  {comment.time}
                                </span>
                              </div>
                              <p className="text-gray-200 text-sm">
                                {comment.text}
                              </p>
                              <span
                                className="text-xs mt-1 inline-block"
                                style={{ color: "#3b82f6" }}
                              >
                                👍 {comment.helpfulVotes}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Questions */}
                  <div>
                    <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                      Related Questions
                    </h4>
                    <div className="space-y-2">
                      {mockQA
                        .filter(
                          (q) =>
                            q.id !== item.id &&
                            (q.topic === item.topic ||
                              q.question
                                .toLowerCase()
                                .split(" ")
                                .filter((w) => w.length >= 4)
                                .some((w) =>
                                  item.question.toLowerCase().includes(w)
                                ))
                        )
                        .slice(0, 2)
                        .map((rel) => (
                          <button
                            key={rel.id}
                            onClick={() => setExpandedId(rel.id)}
                            className="block w-full text-left text-sm text-gray-300 hover:text-brand-cyan transition-colors py-1"
                          >
                            → {rel.question}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
