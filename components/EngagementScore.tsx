"use client";

import { useState } from "react";

interface ScoreBreakdown {
  prayers: number;
  questions: number;
  bibleStudy: number;
  comments: number;
}

interface EngagementScoreProps {
  score: number;
  breakdown: ScoreBreakdown;
  monthlyRank: number;
  weeklyTopN?: number;
}

export function EngagementScore({
  score,
  breakdown,
  monthlyRank,
  weeklyTopN,
}: EngagementScoreProps) {
  const [period, setPeriod] = useState<"month" | "alltime">("month");

  // All-time values are cumulative (roughly 12× the monthly snapshot for mock purposes)
  const allTimeMultiplier = 12;
  const displayBreakdown: ScoreBreakdown =
    period === "alltime"
      ? {
          prayers: breakdown.prayers * allTimeMultiplier,
          questions: breakdown.questions * allTimeMultiplier,
          bibleStudy: breakdown.bibleStudy * allTimeMultiplier,
          comments: breakdown.comments * allTimeMultiplier,
        }
      : breakdown;
  const displayScore = period === "alltime" ? score * allTimeMultiplier : score;

  const total =
    displayBreakdown.prayers +
    displayBreakdown.questions +
    displayBreakdown.bibleStudy +
    displayBreakdown.comments;

  const barData = [
    { label: "Prayers", value: displayBreakdown.prayers, color: "#8b5cf6", barColor: "rgba(139,92,246,0.7)" },
    { label: "Questions", value: displayBreakdown.questions, color: "#3b82f6", barColor: "rgba(59,130,246,0.7)" },
    { label: "Bible Study", value: displayBreakdown.bibleStudy, color: "#06b6d4", barColor: "rgba(6,182,212,0.7)" },
    { label: "Comments", value: displayBreakdown.comments, color: "#9ca3af", barColor: "rgba(156,163,175,0.6)" },
  ];

  return (
    <div
      className="rounded-2xl p-6 border border-white/10"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.10) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          {/* Main score */}
          <div
            className="text-6xl font-bold bg-clip-text text-transparent engagement-score-value leading-tight"
            style={{
              backgroundImage: "linear-gradient(to right, #06b6d4, #8b5cf6, #3b82f6)",
            }}
          >
            {displayScore.toLocaleString()}
          </div>
          <div className="text-gray-300 text-sm mt-1">Engagement Score</div>
        </div>

        {/* Period toggle */}
        <div className="flex gap-4 text-sm mt-1">
          <button
            onClick={() => setPeriod("month")}
            className={`pb-1 transition-colors ${
              period === "month"
                ? "text-brand-cyan border-b-2 border-brand-cyan font-semibold"
                : "text-gray-400 border-b-2 border-transparent"
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setPeriod("alltime")}
            className={`pb-1 transition-colors ${
              period === "alltime"
                ? "text-brand-cyan border-b-2 border-brand-cyan font-semibold"
                : "text-gray-400 border-b-2 border-transparent"
            }`}
          >
            All-Time
          </button>
        </div>
      </div>

      {/* Leaderboard position */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span className="text-brand-cyan font-medium text-sm">
          You&apos;re ranked #{monthlyRank} this month
        </span>
        {weeklyTopN !== undefined && (
          <span className="text-brand-purple font-medium text-sm">
            Top {weeklyTopN} member this week!
          </span>
        )}
      </div>

      {/* Score breakdown */}
      <div className="space-y-3">
        {barData.map((item) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div key={item.label} className="flex items-center gap-3">
              <span className="w-24 text-xs text-gray-400 flex-shrink-0">{item.label}</span>
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: item.barColor,
                  }}
                />
              </div>
              <span className="w-6 text-right text-xs" style={{ color: item.color }}>
                {item.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
        <span className="text-gray-400 text-sm">Total activities</span>
        <span
          className="text-xl font-bold text-brand-cyan"
        >
          {total}
        </span>
      </div>
    </div>
  );
}
