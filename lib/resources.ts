// ---------------------------------------------------------------------------
// Shared resource types, mock data, and helpers
// ---------------------------------------------------------------------------

export interface Resource {
  id: string;
  title: string;
  category: ResourceCategory;
  categoryEmoji: string;
  categoryColor: string;
  source: string;
  author: string;
  description: string;
  thumbnail?: string;
  url: string;
  readTime: number;
  views: number;
  shares: number;
  bookmarks?: number;
  comments?: number;
  saved?: boolean;
  pinned?: boolean;
  /** ISO date string */
  addedAt: string;
}

export type ResourceCategory =
  | "Career & Growth"
  | "Faith & Theology"
  | "Faith & Work Integration"
  | "Learning & Skill Development"
  | "Books & Reading"
  | "Videos & Podcasts";

export interface PendingResource extends Omit<Resource, "views" | "shares" | "bookmarks" | "comments" | "pinned"> {
  submittedBy: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  rejectReason?: RejectReason;
}

export type RejectReason =
  | "low_quality"
  | "duplicate"
  | "wrong_category"
  | "adult_content";

export const REJECT_REASON_LABELS: Record<RejectReason, string> = {
  low_quality: "Low quality",
  duplicate: "Duplicate",
  wrong_category: "Wrong category",
  adult_content: "Adult content",
};

export interface FeaturedCollection {
  id: string;
  title: string;
  description: string;
  resourceIds: string[];
}

// ---------------------------------------------------------------------------
// Category meta
// ---------------------------------------------------------------------------

export const CATEGORY_META: Record<
  ResourceCategory,
  { emoji: string; color: string }
> = {
  "Career & Growth": { emoji: "📚", color: "border-tech-blue/30 hover:border-tech-blue" },
  "Faith & Theology": { emoji: "✝️", color: "border-brand-purple/30 hover:border-brand-purple" },
  "Faith & Work Integration": { emoji: "💼", color: "border-brand-cyan/30 hover:border-brand-cyan" },
  "Learning & Skill Development": { emoji: "🎓", color: "border-tech-blue/30 hover:border-tech-blue" },
  "Books & Reading": { emoji: "📖", color: "border-brand-purple/30 hover:border-brand-purple" },
  "Videos & Podcasts": { emoji: "🎥", color: "border-brand-cyan/30 hover:border-brand-cyan" },
};

// ---------------------------------------------------------------------------
// Mock resource data (in production, fetched from database)
// ---------------------------------------------------------------------------

export const MOCK_RESOURCES: Resource[] = [
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
    views: 1203,
    shares: 98,
    bookmarks: 74,
    comments: 21,
    addedAt: "2025-03-20T10:00:00Z",
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
    bookmarks: 53,
    comments: 14,
    addedAt: "2025-03-18T09:00:00Z",
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
    views: 752,
    shares: 53,
    bookmarks: 41,
    comments: 9,
    addedAt: "2025-03-15T14:00:00Z",
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
    views: 618,
    shares: 74,
    bookmarks: 62,
    comments: 7,
    addedAt: "2025-03-12T11:00:00Z",
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
    views: 514,
    shares: 41,
    bookmarks: 35,
    comments: 11,
    addedAt: "2025-03-10T08:00:00Z",
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
    views: 427,
    shares: 35,
    bookmarks: 28,
    comments: 6,
    addedAt: "2025-03-08T15:00:00Z",
  },
  {
    id: "7",
    title: "Podcast: Technology, Ethics & the Christian Mind",
    category: "Videos & Podcasts",
    categoryEmoji: "🎥",
    categoryColor: "border-brand-cyan/30 hover:border-brand-cyan",
    source: "Rise & Fall of Mars Hill",
    author: "Mike Cosper",
    description:
      "Episode exploring how Christians in tech can engage ethically with AI, social media algorithms, and the digital commons. Thoughtful and convicting.",
    url: "#",
    readTime: 45,
    views: 388,
    shares: 28,
    bookmarks: 19,
    comments: 5,
    addedAt: "2025-03-05T12:00:00Z",
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
    views: 342,
    shares: 23,
    bookmarks: 17,
    comments: 4,
    addedAt: "2025-03-03T10:00:00Z",
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
    views: 263,
    shares: 19,
    bookmarks: 14,
    comments: 3,
    addedAt: "2025-02-28T09:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// Mock pending submissions
// ---------------------------------------------------------------------------

export const MOCK_PENDING: PendingResource[] = [
  {
    id: "p1",
    title: "How to Lead With Servant Leadership in a Remote Team",
    category: "Career & Growth",
    categoryEmoji: "📚",
    categoryColor: "border-tech-blue/30 hover:border-tech-blue",
    source: "Harvard Business Review",
    author: "Various",
    description:
      "Research-backed frameworks for leading distributed teams while keeping gospel values at the centre of management decisions.",
    url: "https://hbr.org/example",
    readTime: 11,
    submittedBy: "Marcus W.",
    submittedAt: "2025-03-29T08:30:00Z",
    status: "pending",
    addedAt: "2025-03-29T08:30:00Z",
  },
  {
    id: "p2",
    title: "YT Video: React for Absolute Beginners",
    category: "Learning & Skill Development",
    categoryEmoji: "🎓",
    categoryColor: "border-tech-blue/30 hover:border-tech-blue",
    source: "YouTube",
    author: "Fireship",
    description: "Quick intro to React hooks and component patterns.",
    url: "https://youtube.com/example",
    readTime: 12,
    submittedBy: "priya.dev",
    submittedAt: "2025-03-28T19:00:00Z",
    status: "pending",
    addedAt: "2025-03-28T19:00:00Z",
  },
  {
    id: "p3",
    title: "Book: The Bible and Work Ethics",
    category: "Faith & Theology",
    categoryEmoji: "✝️",
    categoryColor: "border-brand-purple/30 hover:border-brand-purple",
    source: "Crossway",
    author: "D.A. Carson",
    description: "Explores Old and New Testament perspectives on labor, vocation, and rest.",
    url: "#",
    readTime: 15,
    submittedBy: "elijah.code",
    submittedAt: "2025-03-27T11:00:00Z",
    status: "pending",
    addedAt: "2025-03-27T11:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// Mock featured collections
// ---------------------------------------------------------------------------

export const MOCK_COLLECTIONS: FeaturedCollection[] = [
  {
    id: "c1",
    title: "New Christian Engineer Starter Pack",
    description: "Essential reads for engineers just starting their faith-at-work journey.",
    resourceIds: ["1", "2", "3", "5"],
  },
  {
    id: "c2",
    title: "Navigating Your First Tech Job",
    description: "Practical career wisdom grounded in Christian principles.",
    resourceIds: ["1", "4", "9"],
  },
  {
    id: "c3",
    title: "Building a Values-Aligned Career",
    description: "Resources to help you design a career that reflects your deepest values.",
    resourceIds: ["2", "3", "6", "7"],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns the top N resources by views */
export function getTopByViews(n: number, resources: Resource[] = MOCK_RESOURCES): Resource[] {
  return [...resources].sort((a, b) => b.views - a.views).slice(0, n);
}

/** Returns the top N resources by bookmarks */
export function getTopByBookmarks(n: number, resources: Resource[] = MOCK_RESOURCES): Resource[] {
  return [...resources]
    .sort((a, b) => (b.bookmarks ?? 0) - (a.bookmarks ?? 0))
    .slice(0, n);
}

/** Returns the top N resources by comments */
export function getTopByComments(n: number, resources: Resource[] = MOCK_RESOURCES): Resource[] {
  return [...resources]
    .sort((a, b) => (b.comments ?? 0) - (a.comments ?? 0))
    .slice(0, n);
}
