interface Stats {
  prayerRequests: number;
  questionsAsked: number;
  sessionsAttended: number;
  engagementScore: number;
  messagesSent: number;
  currentStreak: number;
}

interface StatsGridProps {
  stats: Stats;
}

const statCards = [
  {
    key: "prayerRequests" as keyof Stats,
    icon: "🙏",
    label: "Prayer Requests",
    theme: "purple",
    borderColor: "#8b5cf6",
    gradientFrom: "#8b5cf6",
    gradientTo: "#06b6d4",
  },
  {
    key: "questionsAsked" as keyof Stats,
    icon: "❓",
    label: "Questions Asked",
    theme: "blue",
    borderColor: "#3b82f6",
    gradientFrom: "#3b82f6",
    gradientTo: "#06b6d4",
  },
  {
    key: "sessionsAttended" as keyof Stats,
    icon: "📖",
    label: "Sessions Attended",
    theme: "cyan",
    borderColor: "#06b6d4",
    gradientFrom: "#06b6d4",
    gradientTo: "#06b6d4",
  },
  {
    key: "engagementScore" as keyof Stats,
    icon: "📈",
    label: "Engagement Score",
    theme: "gradient",
    borderColor: "transparent",
    gradientFrom: "#06b6d4",
    gradientTo: "#8b5cf6",
    gradientBorder: true,
  },
  {
    key: "messagesSent" as keyof Stats,
    icon: "💬",
    label: "Messages",
    theme: "gray",
    borderColor: "#9ca3af",
    gradientFrom: "#9ca3af",
    gradientTo: "#d1d5db",
  },
  {
    key: "currentStreak" as keyof Stats,
    icon: "🔥",
    label: "Current Streak",
    theme: "streak",
    borderColor: "#06b6d4",
    gradientFrom: "#06b6d4",
    gradientTo: "#f97316",
    suffix: " days",
  },
];

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((card) => (
        <div
          key={card.key}
          className="group relative p-5 rounded-2xl bg-gradient-to-br from-white/5 to-white/10
            border-l-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
          style={{
            borderLeftColor: card.borderColor,
            boxShadow: `0 0 0 1px rgba(255,255,255,0.05)`,
          }}
        >
          {/* Gradient border for engagement score */}
          {card.gradientBorder && (
            <div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
              style={{
                background: `linear-gradient(to bottom, ${card.gradientFrom}, ${card.gradientTo})`,
              }}
            />
          )}

          <div className="flex items-start justify-between">
            <div>
              <div
                className="text-4xl font-bold mb-1 bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${card.gradientFrom}, ${card.gradientTo})`,
                }}
              >
                {stats[card.key].toLocaleString()}
                {card.suffix ?? ""}
              </div>
              <div className="text-gray-400 text-sm">{card.label}</div>
            </div>
            <div
              className="text-3xl"
              style={{
                filter: `drop-shadow(0 0 8px ${card.borderColor}80)`,
              }}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
