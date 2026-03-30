interface Activity {
  id: string;
  type: "prayer" | "question" | "bible_study" | "achievement";
  content: string;
  time: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const typeConfig = {
  prayer: {
    icon: "🙏",
    color: "#8b5cf6",
    label: "Prayer",
  },
  question: {
    icon: "❓",
    color: "#3b82f6",
    label: "Question",
  },
  bible_study: {
    icon: "📖",
    color: "#06b6d4",
    label: "Bible Study",
  },
  achievement: {
    icon: "🏆",
    color: "#8b5cf6",
    label: "Achievement",
  },
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 overflow-hidden">
      {activities.map((activity, index) => {
        const config = typeConfig[activity.type];
        return (
          <div
            key={activity.id}
            className={`flex items-start gap-4 p-4 ${
              index !== activities.length - 1 ? "border-b" : ""
            }`}
            style={{
              borderColor: `${config.color}30`,
            }}
          >
            {/* Left divider accent */}
            <div
              className="w-1 self-stretch rounded-full flex-shrink-0"
              style={{ backgroundColor: config.color }}
            />

            <div className="text-2xl">{config.icon}</div>

            <div className="flex-1 min-w-0">
              <p className="text-gray-200 text-sm">{activity.content}</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: `${config.color}20`,
                    color: config.color,
                  }}
                >
                  {config.label}
                </span>
                <span className="text-gray-500 text-xs">{activity.time}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
