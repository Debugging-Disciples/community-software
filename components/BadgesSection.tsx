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

const colorMap: Record<string, { bg: string; glow: string }> = {
  "brand-cyan": { bg: "rgba(6,182,212,0.2)", glow: "rgba(6,182,212,0.4)" },
  "brand-purple": { bg: "rgba(139,92,246,0.2)", glow: "rgba(139,92,246,0.4)" },
  "tech-blue": { bg: "rgba(59,130,246,0.2)", glow: "rgba(59,130,246,0.4)" },
};

export function BadgesSection({ badges }: BadgesSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {badges.map((badge) => {
        const colors = colorMap[badge.color] ?? colorMap["brand-cyan"];
        const isHovered = hoveredId === badge.id;

        return (
          <div
            key={badge.id}
            className="relative flex-shrink-0"
            onMouseEnter={() => setHoveredId(badge.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl cursor-pointer
                transition-all duration-200 hover:scale-110"
              style={{
                background: colors.bg,
                boxShadow: isHovered ? `0 0 20px ${colors.glow}` : "none",
              }}
            >
              {badge.emoji}
            </div>

            {/* Tooltip */}
            {isHovered && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 p-2 rounded-lg
                bg-tech-darker border border-white/20 text-center z-10 pointer-events-none">
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
