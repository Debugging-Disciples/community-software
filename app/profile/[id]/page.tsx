import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProfileClient } from "@/components/ProfileClient";
import { Navbar } from "@/components/Navbar";

// Mock profile data - in production comes from database
const getMockProfile = (id: string) => ({
  id,
  name: "Alex Johnson",
  slackHandle: "alexj",
  image: null,
  joinDate: "March 2024",
  role: "Core Team" as const,
  bio: "Software engineer passionate about faith and technology. Building tools that help communities thrive.",
  title: "Senior Engineer",
  company: "TechCorp",
  faithJourney: "Walking this coding journey with faith as my foundation.",
  stats: {
    prayerRequests: 12,
    questionsAsked: 8,
    sessionsAttended: 23,
    engagementScore: 847,
    messagesSent: 156,
    currentStreak: 14,
  },
  badges: [
    { id: "1", emoji: "🔥", name: "On Fire", description: "10+ day engagement streak", color: "brand-cyan" },
    { id: "2", emoji: "🙏", name: "Prayer Warrior", description: "10+ prayer requests shared", color: "brand-purple" },
    { id: "3", emoji: "📖", name: "Bible Scholar", description: "20+ Bible study sessions", color: "brand-purple" },
    { id: "4", emoji: "❓", name: "Question Master", description: "Asked 5+ great questions", color: "tech-blue" },
    { id: "5", emoji: "👑", name: "Longest Member", description: "One of the founding members", color: "brand-cyan" },
  ],
  activities: [
    { id: "1", type: "prayer" as const, content: "Shared a prayer request for the community", time: "2 hours ago" },
    { id: "2", type: "question" as const, content: "Asked about React Server Components best practices", time: "Yesterday" },
    { id: "3", type: "bible_study" as const, content: "Attended Bible Study session", time: "3 days ago" },
    { id: "4", type: "achievement" as const, content: "Earned the 'Prayer Warrior' badge 🙏", time: "1 week ago" },
  ],
});

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const { id } = await params;
  const profile = getMockProfile(id);
  const isOwnProfile = (session.user as { id?: string }).id === id;

  return (
    <div className="min-h-screen bg-tech-dark text-white">
      <div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(59,130,246,0.15) 1px, transparent 0), radial-gradient(circle at 75px 75px, rgba(139,92,246,0.15) 1px, transparent 0)",
          backgroundSize: "100px 100px",
        }}
      />
      <Navbar user={session.user} />
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        <ProfileClient profile={profile} isOwnProfile={isOwnProfile} />
      </main>
    </div>
  );
}
