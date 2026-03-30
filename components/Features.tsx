export function Features() {
  const features = [
    {
      icon: "📊",
      title: "Track Engagement",
      description: "See your activity stats, streaks, and engagement score all in one place.",
      color: "brand-cyan",
    },
    {
      icon: "🏆",
      title: "Earn Badges",
      description: "Get recognized for your contributions — from prayer warrior to question master.",
      color: "brand-purple",
    },
    {
      icon: "📖",
      title: "Bible Study Hub",
      description: "Track your Bible study attendance and stay connected with your faith journey.",
      color: "tech-blue",
    },
    {
      icon: "🤝",
      title: "Community Profiles",
      description: "Discover fellow members, see their journeys, and celebrate together.",
      color: "brand-cyan",
    },
    {
      icon: "🙏",
      title: "Prayer Requests",
      description: "Keep track of prayer requests shared in the community.",
      color: "brand-purple",
    },
    {
      icon: "🔥",
      title: "Accountability Streaks",
      description: "Build habits and stay accountable with your community engagement streaks.",
      color: "brand-cyan",
    },
  ];

  const colorMap: Record<string, string> = {
    "brand-cyan": "#06b6d4",
    "brand-purple": "#8b5cf6",
    "tech-blue": "#3b82f6",
  };

  return (
    <section className="px-6 pb-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">
            Everything You Need
          </span>
        </h2>
        <p className="text-gray-400 text-center mb-12 text-lg">
          Your community engagement, all in one place
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10
                backdrop-blur-sm hover:border-white/20 transition-all duration-200 hover:-translate-y-1"
            >
              <div
                className="text-4xl mb-4 w-14 h-14 rounded-xl flex items-center justify-center"
                style={{
                  background: `${colorMap[feature.color]}20`,
                  boxShadow: `0 0 20px ${colorMap[feature.color]}20`,
                }}
              >
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
