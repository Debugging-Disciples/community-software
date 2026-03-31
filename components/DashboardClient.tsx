"use client";

import { Session } from "next-auth";
import { StatsGrid } from "@/components/StatsGrid";
import { BadgesSection } from "@/components/BadgesSection";
import { ActivityFeed } from "@/components/ActivityFeed";
import { EngagementScore } from "@/components/EngagementScore";
import { Navbar } from "@/components/Navbar";

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

// All badge types grouped by category
const mockBadges = [
  // Engagement Badges
  { id: "e1", emoji: "🔥", name: "On Fire", description: "10+ day engagement streak", color: "brand-cyan" },
  { id: "e2", emoji: "🙏", name: "Prayer Warrior", description: "10+ prayer requests shared", color: "brand-purple" },
  { id: "e3", emoji: "❓", name: "Question Master", description: "Asked 5+ great questions", color: "tech-blue" },
  { id: "e4", emoji: "💬", name: "Community Voice", description: "150+ messages sent", color: "gradient-cyan-purple" },
  { id: "e5", emoji: "👑", name: "Longest Member", description: "One of the founding members", color: "gradient-gold" },
  // Achievement Badges
  { id: "a1", emoji: "📖", name: "Bible Scholar", description: "20+ Bible study sessions", color: "brand-purple" },
  { id: "a2", emoji: "💼", name: "Career Builder", description: "Shared career guidance resources", color: "tech-blue" },
  { id: "a3", emoji: "🤝", name: "Mentor", description: "Actively mentored community members", color: "brand-cyan" },
  { id: "a4", emoji: "🌱", name: "New to DD", description: "Recently joined the community", color: "outline-cyan" },
  { id: "a5", emoji: "🎓", name: "First Prayer Request", description: "Shared your first prayer request", color: "brand-cyan-glow" },
  // Role Badges
  { id: "r1", emoji: "👨‍💼", name: "Community Leader", description: "Recognized community leader", color: "brand-purple" },
  { id: "r2", emoji: "🛠️", name: "Core Team", description: "Part of the core team", color: "gradient-cyan-blue" },
  { id: "r3", emoji: "✨", name: "Member Spotlight", description: "Featured community spotlight", color: "gradient-purple-cyan-animated" },
];

const mockScoreBreakdown = {
  prayers: 12,
  questions: 8,
  bibleStudy: 23,
  comments: 156,
};

interface DashboardClientProps {
  session: Session;
}

export function DashboardClient({ session }: DashboardClientProps) {
  const user = session.user;
  const joinDate = "March 2024"; // In production, comes from Slack API

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

      <Navbar user={user} />

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Welcome banner */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-brand-cyan/10 to-brand-purple/10 border border-white/10">
          <h1 className="text-3xl font-bold mb-1">
            <span className="bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">
              Welcome back, {user?.name?.split(" ")[0] ?? "Disciple"} 🚀
            </span>
          </h1>
          <p className="text-gray-400">Member since {joinDate}</p>
        </div>

        {/* Stats Grid */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Your Engagement</h2>
          <StatsGrid stats={mockStats} />
        </section>

        {/* Engagement Score */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Engagement Score</h2>
          <EngagementScore
            score={mockStats.engagementScore}
            breakdown={mockScoreBreakdown}
            monthlyRank={8}
            allTimeRank={23}
            weeklyTopN={5}
          />
        </section>

        {/* Badges */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Your Badges</h2>
          <BadgesSection badges={mockBadges} />
        </section>

        {/* Activity Feed */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <ActivityFeed activities={mockActivities} />
        </section>
      </main>
    </div>
  );
}
