"use client";

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

interface DashboardClientProps {
  session: Session;
  trendingResources: Resource[];
}

export function DashboardClient({ session, trendingResources }: DashboardClientProps) {
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

        {/* Trending Resources */}
        <section className="mb-8">
          <TrendingResourcesWidget resources={trendingResources} />
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
