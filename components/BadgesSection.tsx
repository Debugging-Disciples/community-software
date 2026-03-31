"use client";

import { useState } from "react";

interface Badge {
  id: string;
  emoji: string;
  name: string;
  description: string;
  color: string;
}

interface BadgesSectionProps {
  badges: Badge[];
}

interface ColorConfig {
  bg: string;
  border?: string;
  glow: string;
  isOutline?: boolean;
  animated?: string;
}

const colorMap: Record<string, ColorConfig> = {
  // Solid backgrounds
  "brand-cyan": { bg: "rgba(6,182,212,0.25)", glow: "rgba(6,182,212,0.5)" },
  "brand-purple": { bg: "rgba(139,92,246,0.25)", glow: "rgba(139,92,246,0.5)" },
  "tech-blue": { bg: "rgba(59,130,246,0.25)", glow: "rgba(59,130,246,0.5)" },
  // Gradient backgrounds
  "gradient-cyan-purple": {
    bg: "linear-gradient(135deg, rgba(6,182,212,0.35), rgba(139,92,246,0.35))",
    glow: "rgba(139,92,246,0.5)",
  },
  "gradient-gold": {
    bg: "linear-gradient(135deg, rgba(251,191,36,0.35), rgba(249,115,22,0.35))",
    glow: "rgba(251,191,36,0.5)",
  },
  "gradient-cyan-blue": {
    bg: "linear-gradient(135deg, rgba(6,182,212,0.35), rgba(59,130,246,0.35))",
    glow: "rgba(6,182,212,0.5)",
  },
  "gradient-purple-cyan-animated": {
    bg: "linear-gradient(135deg, rgba(139,92,246,0.4), rgba(6,182,212,0.4), rgba(139,92,246,0.4))",
    glow: "rgba(139,92,246,0.5)",
    animated: "badge-gradient-animated",
  },
  // Outline only
  "outline-cyan": {
    bg: "transparent",
    border: "rgba(6,182,212,0.5)",
    glow: "rgba(6,182,212,0.3)",
    isOutline: true,
  },
  // Cyan with extra glow
  "brand-cyan-glow": { bg: "rgba(6,182,212,0.25)", glow: "rgba(6,182,212,0.7)" },
};

export function BadgesSection({ badges }: BadgesSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-4 pb-2">
      {badges.map((badge) => {
        const colors = colorMap[badge.color] ?? colorMap["brand-cyan"];
        const isHovered = hoveredId === badge.id;
        const isFlame = badge.emoji === "🔥";
        const extraClass = colors.animated ?? "";

        return (
          <div
            key={badge.id}
            className="relative flex-shrink-0"
            onMouseEnter={() => setHoveredId(badge.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div
            className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl cursor-pointer
                transition-all duration-200 hover:scale-110 ${isFlame && isHovered ? "badge-flame" : ""} ${extraClass}`}
              tabIndex={0}
              role="button"
              aria-label={`${badge.name}: ${badge.description}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setHoveredId(isHovered ? null : badge.id);
                }
              }}
              onClick={() => {
                setHoveredId(isHovered ? null : badge.id);
              }}
              style={{
                background: colors.bg,
                border: colors.isOutline ? `2px solid ${colors.border}` : undefined,
                boxShadow: isHovered
                  ? `0 0 20px ${colors.glow}, 0 0 40px ${colors.glow}50`
                  : isFlame
                    ? `0 0 10px ${colors.glow}80`
                    : "none",
              }}
            >
              {badge.emoji}
            </div>

            {/* Tooltip */}
            {isHovered && (
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 p-2 rounded-lg
                bg-tech-darker border border-white/20 text-center z-10 pointer-events-none"
              >
                <div className="text-white font-semibold text-sm">{badge.name}</div>
                <div className="text-gray-400 text-xs mt-1">{badge.description}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
