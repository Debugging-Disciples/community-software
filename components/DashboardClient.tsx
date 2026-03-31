"use client";

import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import { StatsGrid } from "@/components/StatsGrid";
import { BadgesSection } from "@/components/BadgesSection";
import { ActivityFeed } from "@/components/ActivityFeed";
import { Navbar } from "@/components/Navbar";
import { TrendingResourcesWidget } from "@/components/TrendingResourcesWidget";
import type { Resource } from "@/lib/resources";

// Mock data for demonstration - in production this comes from Slack bot
const mockStats = {
  prayerRequests: 12,
  questionsAsked: 8,
  sessionsAttended: 23,
  engagementScore: 847,
  messagesSent: 156,
  currentStreak: 14,
};

const mockActivities = [
  { id: "1", type: "prayer" as const, content: "Shared a prayer request for the community", time: "2 hours ago" },
  { id: "2", type: "question" as const, content: "Asked about React Server Components best practices", time: "Yesterday" },
  { id: "3", type: "bible_study" as const, content: "Attended Bible Study session", time: "3 days ago" },
  { id: "4", type: "achievement" as const, content: "Earned the 'Prayer Warrior' badge 🙏", time: "1 week ago" },
  { id: "5", type: "prayer" as const, content: "Shared a praise report", time: "1 week ago" },
];

const mockBadges = [
  { id: "1", emoji: "🔥", name: "On Fire", description: "10+ day engagement streak", color: "brand-cyan" },
  { id: "2", emoji: "🙏", name: "Prayer Warrior", description: "10+ prayer requests shared", color: "brand-purple" },
  { id: "3", emoji: "📖", name: "Bible Scholar", description: "20+ Bible study sessions", color: "brand-purple" },
  { id: "4", emoji: "❓", name: "Question Master", description: "Asked 5+ great questions", color: "tech-blue" },
];

const upcomingEvents = [
  { id: "1", icon: "📖", title: "Bible Study", datetime: "Wed 7 PM", link: "#" },
  { id: "2", icon: "🎤", title: "AMA Session", datetime: "Fri 6 PM", link: "#" },
  { id: "3", icon: "🍽️", title: "Faith & Tech Dinner", datetime: "Next Sunday", link: "#" },
];

const communityFeed = [
  {
    id: "1",
    section: "prayer",
    dividerColor: "#8b5cf6",
    title: "Recent Prayer Requests",
    items: [
      { id: "p1", name: "Amara Osei", text: "Please pray for wisdom as I navigate a major career decision…", meta: "23 people prayed for this", metaColor: "#8b5cf6" },
      { id: "p2", name: "Devon Clark", text: "Asking for prayers for my sister who is recovering from surgery…", meta: "31 people prayed for this", metaColor: "#8b5cf6" },
    ],
  },
  {
    id: "2",
    section: "questions",
    dividerColor: "#3b82f6",
    title: "Recent Questions",
    items: [
      { id: "q1", name: "Kwame Asante", text: "How do you maintain your faith and integrity while working at a startup?", meta: "5 people voted helpful", metaColor: "#3b82f6" },
      { id: "q2", name: "Sofia Hernandez", text: "What Bible passages inspire you in your tech career?", meta: "8 people voted helpful", metaColor: "#3b82f6" },
    ],
  },
  {
    id: "3",
    section: "wins",
    dividerColor: "#06b6d4",
    title: "Wins Shared",
    items: [
      { id: "w1", name: "Carlos M.", text: "Carlos got an offer at Google! 🎉", meta: "15 reactions", metaColor: "#06b6d4" },
      { id: "w2", name: "Priya N.", text: "Priya launched her first SaaS product! 🚀", meta: "22 reactions", metaColor: "#06b6d4" },
    ],
  },
  {
    id: "4",
    section: "members",
    dividerColor: "#06b6d4",
    title: "New Members Joined",
    items: [
      { id: "m1", name: "", text: "Welcome Sarah, Jessica, and 2 others! 👋", meta: "", metaColor: "#06b6d4" },
    ],
  },
];

const topMembers = [
  { rank: 1, name: "Priya Nair", score: 1247, image: null },
  { rank: 2, name: "Marcus Rivera", score: 1089, image: null },
  { rank: 3, name: "Amara Osei", score: 934, image: null },
  { rank: 4, name: "Jordan Lee", score: 812, image: null },
  { rank: 5, name: "Sofia Hernandez", score: 748, image: null },
];

const RANK_LABELS = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

const ctaCards = [
  {
    id: "1",
    icon: "📖",
    title: "Join Bible Study This Week",
    description: "Grow in community around the Word",
    accent: "#06b6d4",
    buttonStyle: "gradient" as const,
    buttonLabel: "See Details →",
    href: "/prayer",
  },
  {
    id: "2",
    icon: "🙏",
    title: "Share a Prayer Request",
    description: "Let the community lift you up in prayer",
    accent: "#8b5cf6",
    buttonStyle: "outline-purple" as const,
    buttonLabel: "Start Praying Together",
    href: "/prayer",
  },
  {
    id: "3",
    icon: "❓",
    title: "Ask a Question",
    description: "Get wisdom from the community",
    accent: "#3b82f6",
    buttonStyle: "outline-blue" as const,
    buttonLabel: "Get Wisdom from Community",
    href: "#",
  },
  {
    id: "update-profile",
    icon: "👤",
    title: "Update Your Profile",
    description: "Help others get to know you better",
    accent: "#06b6d4",
    buttonStyle: "outline-cyan" as const,
    buttonLabel: "Complete Your Profile",
    href: "#",
  },
];

interface DashboardClientProps {
  session: Session;
  trendingResources: Resource[];
}

function MiniAvatar({ image, name }: { image: string | null; name: string }) {
  const initials = name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className="w-7 h-7 rounded-full overflow-hidden border-2 border-brand-cyan flex-shrink-0 relative"
      style={{ boxShadow: "0 0 0 1px rgba(6,182,212,0.2)" }}
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

export function DashboardClient({ session, trendingResources }: DashboardClientProps) {
  const user = session.user;
  const userId = (user as { id?: string }).id;
  const joinDate = "March 2024"; // In production, comes from Slack API

  const resolvedCtaCards = ctaCards.map((card) =>
    card.id === "update-profile" ? { ...card, href: userId ? `/profile/${userId}` : "#" } : card
  );

  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(160deg, #0f172a 0%, #0b1628 50%, #0f172a 100%)" }}>
      {/* Subtle background texture */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(59,130,246,0.10) 1px, transparent 0), radial-gradient(circle at 75px 75px, rgba(139,92,246,0.08) 1px, transparent 0)",
          backgroundSize: "100px 100px",
        }}
      />

      <Navbar user={user} />

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome card */}
        <div
          className="p-6 rounded-2xl border border-white/10"
          style={{ background: "linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))", backdropFilter: "blur(12px)" }}
        >
          <h1 className="text-3xl font-bold mb-1">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(to right, #06b6d4, #8b5cf6)", filter: "drop-shadow(0 0 8px rgba(6,182,212,0.3))" }}
            >
              Welcome back, {user?.name?.split(" ")[0] ?? "Disciple"}! 👋
            </span>
          </h1>
          <p className="text-gray-300">Member since {joinDate}</p>
        </div>

        {/* Your Stats card */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Your Engagement</h2>
          <div
            className="p-6 rounded-2xl"
            style={{
              background: "rgba(30,41,59,0.7)",
              border: "1px solid rgba(6,182,212,0.25)",
              borderRadius: 16,
            }}
          >
            {/* Engagement score */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Engagement Score</p>
                <p
                  className="text-5xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(to right, #06b6d4, #8b5cf6)",
                    filter: "drop-shadow(0 0 12px rgba(6,182,212,0.4))",
                  }}
                >
                  {mockStats.engagementScore.toLocaleString()}
                </p>
              </div>
              <p
                className="text-brand-cyan font-semibold text-sm"
                style={{ textShadow: "0 0 8px rgba(6,182,212,0.5)" }}
              >
                🔥 {mockStats.currentStreak}-Week Streak
              </p>
            </div>
            {/* Three sub-stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-purple">{mockStats.prayerRequests}</p>
                <p className="text-brand-purple text-xs mt-0.5">🙏 Prayers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-tech-blue">{mockStats.questionsAsked}</p>
                <p className="text-tech-blue text-xs mt-0.5">❓ Questions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-cyan">{mockStats.sessionsAttended}</p>
                <p className="text-brand-cyan text-xs mt-0.5">📖 Bible</p>
              </div>
            </div>
          </div>
        </section>

        {/* Full stats grid */}
        <section>
          <StatsGrid stats={mockStats} />
        </section>

        {/* Two-column layout: events + mini leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Upcoming Community Events</h2>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-xl border border-white/10 flex items-center gap-3"
                  style={{ background: "rgba(30,41,59,0.6)", backdropFilter: "blur(8px)" }}
                >
                  <span className="text-2xl flex-shrink-0">{event.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">{event.title}</p>
                    <p className="text-gray-300 text-xs flex items-center gap-1 mt-0.5">
                      <span className="text-brand-cyan">🕐</span> {event.datetime}
                    </p>
                  </div>
                  <a
                    href={event.link}
                    className="px-3 py-1.5 rounded-lg border border-brand-cyan text-brand-cyan text-xs font-medium flex-shrink-0
                      hover:bg-gradient-to-r hover:from-brand-cyan hover:to-brand-purple hover:text-black hover:border-transparent transition-all duration-200"
                  >
                    RSVP
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Mini Leaderboard */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xl font-semibold bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(to right, #06b6d4, #8b5cf6)" }}
              >
                🏆 Top Members This Month
              </h2>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/10" style={{ background: "rgba(30,41,59,0.5)" }}>
              {topMembers.map((member, idx) => (
                <div
                  key={member.rank}
                  className={`group flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors
                    ${idx !== topMembers.length - 1 ? "border-b border-white/5" : ""}`}
                >
                  <span className="text-lg flex-shrink-0">{RANK_LABELS[idx]}</span>
                  <MiniAvatar image={member.image} name={member.name} />
                  <span className="flex-1 text-sm text-gray-200 group-hover:text-brand-cyan transition-colors truncate">
                    {member.name}
                  </span>
                  <span className="text-brand-cyan text-sm font-semibold flex-shrink-0">{member.score.toLocaleString()}</span>
                </div>
              ))}
              <div className="px-4 py-3 border-t border-white/5 text-center">
                <Link
                  href="/leaderboard"
                  className="text-brand-cyan text-sm hover:underline decoration-brand-purple"
                >
                  View Full Leaderboard →
                </Link>
              </div>
            </div>
          </section>
        </div>
        {/* Trending Resources */}
        <section className="mb-8">
          <TrendingResourcesWidget resources={trendingResources} />
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Your Badges</h2>
          <BadgesSection badges={mockBadges} />
        </section>

        {/* Community Activity Feed */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Community Activity</h2>
          <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: "rgba(30,41,59,0.5)" }}>
            {communityFeed.map((section, sIdx) => (
              <div key={section.id}>
                {/* Section divider */}
                <div
                  className="px-5 py-2 flex items-center gap-2 border-b border-white/5"
                  style={{ borderLeftWidth: 3, borderLeftColor: section.dividerColor, borderLeftStyle: "solid" }}
                >
                  <span className="text-sm font-semibold text-white">{section.title}</span>
                </div>
                {section.items.map((item, iIdx) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 px-5 py-3
                      ${sIdx === communityFeed.length - 1 && iIdx === section.items.length - 1 ? "" : "border-b border-white/5"}`}
                  >
                    {item.name && (
                      <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-brand-cyan flex-shrink-0 bg-gradient-to-br from-brand-cyan/20 to-brand-purple/20 flex items-center justify-center text-xs text-brand-cyan font-bold mt-0.5">
                        {item.name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {item.name && (
                        <button className="text-brand-cyan text-xs font-medium hover:text-white transition-colors">{item.name}</button>
                      )}
                      <p className="text-gray-200 text-sm mt-0.5">{item.text}</p>
                      {item.meta && (
                        <p className="text-xs mt-1" style={{ color: item.metaColor }}>{item.meta}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Suggested Actions */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Suggested Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resolvedCtaCards.map((card) => (
              <div
                key={card.id}
                className="p-5 rounded-2xl border border-white/10 flex flex-col gap-3"
                style={{
                  background: "rgba(30,41,59,0.6)",
                  backdropFilter: "blur(8px)",
                  borderLeftWidth: 3,
                  borderLeftColor: card.accent,
                  borderLeftStyle: "solid",
                }}
              >
                <div className="text-3xl">{card.icon}</div>
                <div>
                  <p className="text-white font-semibold text-sm">{card.title}</p>
                  <p className="text-gray-300 text-xs mt-0.5">{card.description}</p>
                </div>
                <Link
                  href={card.href}
                  className={`mt-auto px-4 py-2 rounded-lg text-sm font-medium text-center transition-all duration-200
                    ${card.buttonStyle === "gradient"
                      ? "bg-gradient-to-r from-brand-cyan to-brand-purple text-black"
                      : card.buttonStyle === "outline-purple"
                        ? "border border-brand-purple text-brand-purple hover:bg-gradient-to-r hover:from-brand-purple hover:to-brand-cyan hover:text-white hover:border-transparent"
                        : card.buttonStyle === "outline-blue"
                          ? "border border-tech-blue text-tech-blue hover:bg-gradient-to-r hover:from-tech-blue hover:to-brand-cyan hover:text-white hover:border-transparent"
                          : "border border-brand-cyan text-brand-cyan hover:bg-gradient-to-r hover:from-brand-cyan hover:to-brand-purple hover:text-black hover:border-transparent"
                    }`}
                >
                  {card.buttonLabel}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Your Recent Activity</h2>
          <ActivityFeed activities={mockActivities} />
        </section>
      </main>
    </div>
  );
}
