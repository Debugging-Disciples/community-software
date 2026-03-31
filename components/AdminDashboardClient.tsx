"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Session } from "next-auth";

// ── Mock data ─────────────────────────────────────────────────────────────────

const mockOverview = {
  totalMembers: 342,
  weeklyActiveUsers: 128,
  weeklyActiveTrend: +12, // percent
  prayerRequestsThisWeek: 47,
  questionsAskedThisWeek: 31,
};

const mockEngagementOverTime = [40, 55, 48, 62, 70, 65, 80, 75, 90, 85, 95, 100];
const mockPrayerTopics = [
  { label: "Career", value: 30, color: "#8b5cf6" },
  { label: "Health", value: 25, color: "#a78bfa" },
  { label: "Family", value: 20, color: "#c4b5fd" },
  { label: "Faith", value: 15, color: "#6d28d9" },
  { label: "Other", value: 10, color: "#4c1d95" },
];
const mockQuestionTopics = [
  { label: "React", value: 14, color: "#3b82f6" },
  { label: "Node.js", value: 9, color: "#60a5fa" },
  { label: "Career", value: 5, color: "#93c5fd" },
  { label: "Other", value: 3, color: "#bfdbfe" },
];

const mockFlaggedMessages = [
  { id: "f1", user: "@devdisciple42", content: "Inappropriate link shared in #general", time: "10 min ago" },
  { id: "f2", user: "@techbro99", content: "Spam message in #prayer-requests", time: "1 hour ago" },
  { id: "f3", user: "@anon_user", content: "Off-topic self-promotion in #bible-study", time: "3 hours ago" },
];

const mockMembers = [
  { id: "m1", name: "Alex Johnson", handle: "alexj", role: "Core Team", status: "active" },
  { id: "m2", name: "Jordan Lee", handle: "jlee", role: "Member", status: "active" },
  { id: "m3", name: "Sam Rivera", handle: "samr", role: "Member", status: "muted" },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function OverviewCard({
  label,
  value,
  color,
  trend,
  icon,
}: {
  label: string;
  value: number | string;
  color: string;
  trend?: number;
  icon: string;
}) {
  return (
    <div
      className="p-5 rounded-2xl border border-white/10 flex items-start justify-between"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.10))",
        backdropFilter: "blur(10px)",
      }}
    >
      <div>
        <div
          className="text-4xl font-bold bg-clip-text text-transparent mb-1"
          style={{ backgroundImage: `linear-gradient(to right, ${color}, ${color}cc)` }}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <div className="text-gray-400 text-sm">{label}</div>
        {trend !== undefined && (
          <div
            className={`text-xs mt-1 font-medium ${trend >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}% vs last week
          </div>
        )}
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  );
}

function MiniLineGraph({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 40;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-10" preserveAspectRatio="none">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  if (segments.length === 0 || total <= 0) {
    return <p className="text-gray-500 text-sm">No data</p>;
  }

  const r = 36;
  const cx = 50;
  const cy = 50;
  const circ = 2 * Math.PI * r;

  // Pre-compute cumulative offsets so we don't mutate a variable during render
  const segmentsWithOffset = segments.map((seg, i) => {
    const prevTotal = segments.slice(0, i).reduce((s, p) => s + p.value, 0);
    const dash = (seg.value / total) * circ;
    const gap = circ - dash;
    const rotation = (prevTotal / total) * 360 - 90;
    return { ...seg, dash, gap, rotation };
  });

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="w-24 h-24 flex-shrink-0">
        {segmentsWithOffset.map((seg) => (
          <circle
            key={seg.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="16"
            strokeDasharray={`${seg.dash} ${seg.gap}`}
            transform={`rotate(${seg.rotation} ${cx} ${cy})`}
          />
        ))}
        <circle cx={cx} cy={cy} r="27" fill="#0a0a0a" />
      </svg>
      <ul className="space-y-1">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center gap-2 text-xs text-gray-300">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
            {seg.label} ({seg.value}%)
          </li>
        ))}
      </ul>
    </div>
  );
}

function StackedBar({ items }: { items: { label: string; value: number; color: string }[] }) {
  if (items.length === 0) {
    return <p className="text-gray-500 text-sm">No data</p>;
  }
  const max = Math.max(...items.map((i) => i.value));
  const safeMax = max > 0 ? max : 1;
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-16 text-xs text-gray-400 flex-shrink-0">{item.label}</span>
          <div className="flex-1 h-5 rounded bg-white/10 overflow-hidden">
            <div
              className="h-full rounded transition-all duration-700"
              style={{ width: `${(item.value / safeMax) * 100}%`, background: item.color }}
            />
          </div>
          <span className="text-xs w-5 text-right" style={{ color: item.color }}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

interface AdminDashboardClientProps {
  session: Session;
}

export function AdminDashboardClient({ session }: AdminDashboardClientProps) {
  // approved = flag removed, message kept; deleted = message removed entirely
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const [deleted, setDeleted] = useState<Set<string>>(new Set());
  const [muted, setMuted] = useState<Set<string>>(new Set());

  const activeFlagged = mockFlaggedMessages.filter(
    (m) => !approved.has(m.id) && !deleted.has(m.id),
  );

  return (
    <div className="min-h-screen bg-tech-dark text-white">
      {/* Background pattern */}
      <div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(59,130,246,0.15) 1px, transparent 0), radial-gradient(circle at 75px 75px, rgba(139,92,246,0.15) 1px, transparent 0)",
          backgroundSize: "100px 100px",
        }}
      />

      <Navbar user={session.user} />

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8 space-y-10">
        {/* Page title */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Community overview and management tools</p>
        </div>

        {/* ── Overview ────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <OverviewCard
              label="Total Members"
              value={mockOverview.totalMembers}
              color="#06b6d4"
              icon="👥"
            />
            <OverviewCard
              label="Weekly Active Users"
              value={mockOverview.weeklyActiveUsers}
              color="#06b6d4"
              trend={mockOverview.weeklyActiveTrend}
              icon="⚡"
            />
            <OverviewCard
              label="Prayer Requests This Week"
              value={mockOverview.prayerRequestsThisWeek}
              color="#8b5cf6"
              icon="🙏"
            />
            <OverviewCard
              label="Questions Asked This Week"
              value={mockOverview.questionsAskedThisWeek}
              color="#3b82f6"
              icon="❓"
            />
            {/* Engagement Trend mini card */}
            <div
              className="p-5 rounded-2xl border border-white/10 sm:col-span-2 lg:col-span-1"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.10))",
              }}
            >
              <div className="text-gray-400 text-sm mb-2">Engagement Trend</div>
              <MiniLineGraph data={mockEngagementOverTime} color="#06b6d4" />
            </div>
            {/* Member Growth mini card */}
            <div
              className="p-5 rounded-2xl border border-white/10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.10))",
              }}
            >
              <div className="text-gray-400 text-sm mb-2">Member Growth</div>
              <MiniLineGraph data={[10, 20, 28, 35, 50, 65, 80, 100, 120, 150, 200, 342]} color="#8b5cf6" />
            </div>
          </div>
        </section>

        {/* ── Analytics ───────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement Over Time */}
            <div
              className="p-6 rounded-2xl border border-white/10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.10))",
              }}
            >
              <div className="text-white font-semibold mb-4">Engagement Over Time</div>
              <div className="relative h-32">
                <svg viewBox="0 0 120 40" className="w-full h-full" preserveAspectRatio="none">
                  {/* Area fill */}
                  <defs>
                    <linearGradient id="engGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {(() => {
                    const data = mockEngagementOverTime;
                    const max = Math.max(...data);
                    const w = 120;
                    const h = 40;
                    const pts = data.map((v, i) => {
                      const x = (i / (data.length - 1)) * w;
                      const y = h - (v / max) * (h - 4) - 2;
                      return [x, y] as [number, number];
                    });
                    const polyline = pts.map(([x, y]) => `${x},${y}`).join(" ");
                    const areaPath = [
                      `M ${pts[0][0]},${h}`,
                      ...pts.map(([x, y]) => `L ${x},${y}`),
                      `L ${pts[pts.length - 1][0]},${h}`,
                      "Z",
                    ].join(" ");
                    return (
                      <>
                        <path d={areaPath} fill="url(#engGradient)" />
                        <polyline
                          points={polyline}
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>

            {/* Prayer Requests by Topic */}
            <div
              className="p-6 rounded-2xl border border-white/10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.10))",
              }}
            >
              <div className="text-white font-semibold mb-4">Prayer Requests by Topic</div>
              <DonutChart segments={mockPrayerTopics} />
            </div>

            {/* Questions by Topic */}
            <div
              className="p-6 rounded-2xl border border-white/10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.10))",
              }}
            >
              <div className="text-white font-semibold mb-4">Questions by Topic</div>
              <StackedBar items={mockQuestionTopics} />
            </div>

            {/* User Retention */}
            <div
              className="p-6 rounded-2xl border border-white/10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.10))",
              }}
            >
              <div className="text-white font-semibold mb-2">User Retention</div>
              <p className="text-gray-400 text-xs mb-3">% of members active each week</p>
              <div className="relative h-24">
                <svg viewBox="0 0 120 36" className="w-full h-full" preserveAspectRatio="none">
                  {(() => {
                    const data = [70, 72, 68, 75, 80, 78, 83, 82, 85, 88, 90, 92];
                    const max = 100;
                    const h = 36;
                    const w = 120;
                    const pts = data.map((v, i) => {
                      const x = (i / (data.length - 1)) * w;
                      const y = h - (v / max) * (h - 4) - 2;
                      return `${x},${y}`;
                    });
                    return (
                      <polyline
                        points={pts.join(" ")}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    );
                  })()}
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ── Moderation ──────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Moderation</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Flagged Messages */}
            <div className="rounded-2xl border border-white/10 overflow-hidden bg-tech-darker">
              <div className="px-5 py-3 border-b border-white/10">
                <span className="text-white font-semibold text-sm">Flagged Messages</span>
                {activeFlagged.length > 0 && (
                  <span className="ml-2 text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                    {activeFlagged.length}
                  </span>
                )}
              </div>
              {activeFlagged.length === 0 ? (
                <div className="px-5 py-6 text-center text-gray-500 text-sm">No flagged messages</div>
              ) : (
                activeFlagged.map((msg) => (
                  <div
                    key={msg.id}
                    className="flex items-start gap-4 px-5 py-4 border-b border-white/5 border-l-4"
                    style={{ borderLeftColor: "#ef4444" }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-brand-cyan text-xs font-medium mb-0.5">{msg.user}</div>
                      <p className="text-gray-300 text-sm">{msg.content}</p>
                      <span className="text-gray-500 text-xs">{msg.time}</span>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 mt-0.5">
                      <button
                        onClick={() => setApproved((d) => new Set([...d, msg.id]))}
                        className="text-xs px-3 py-1 rounded-lg border border-brand-cyan text-brand-cyan hover:bg-brand-cyan hover:text-black transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setDeleted((d) => new Set([...d, msg.id]))}
                        className="text-xs px-3 py-1 rounded-lg border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* User Management */}
            <div className="rounded-2xl border border-white/10 overflow-hidden bg-tech-darker">
              <div className="px-5 py-3 border-b border-white/10">
                <span className="text-white font-semibold text-sm">User Management</span>
              </div>
              {mockMembers.map((member) => {
                const isMuted = muted.has(member.id);
                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 px-5 py-3 border-b border-white/5"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, rgba(6,182,212,0.3), rgba(139,92,246,0.3))",
                      }}
                    >
                      {member.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium">{member.name}</div>
                      <div className="text-gray-500 text-xs">
                        @{member.handle} · {member.role}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() =>
                          setMuted((m) => {
                            const next = new Set(m);
                            if (isMuted) {
                              next.delete(member.id);
                            } else {
                              next.add(member.id);
                            }
                            return next;
                          })
                        }
                        className="text-xs px-3 py-1 rounded-lg border border-brand-cyan text-brand-cyan hover:bg-brand-cyan hover:text-black transition-colors"
                      >
                        {isMuted ? "Unmute" : "Mute"}
                      </button>
                      <button className="text-xs px-3 py-1 rounded-lg border border-red-500/60 text-red-400 hover:bg-red-500 hover:text-white transition-colors">
                        Ban
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Quick Actions ────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              className="px-5 py-2.5 rounded-xl font-medium text-white text-sm transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #06b6d4, #8b5cf6)" }}
            >
              📢 Send Announcement
            </button>
            <button
              className="px-5 py-2.5 rounded-xl font-medium text-white text-sm transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}
            >
              ⭐ Feature Member
            </button>
            <button
              className="px-5 py-2.5 rounded-xl font-medium text-black text-sm transition-opacity hover:opacity-90"
              style={{ background: "#06b6d4" }}
            >
              🏅 Award Badge
            </button>
            <button
              className="px-5 py-2.5 rounded-xl font-medium text-black text-sm transition-opacity hover:opacity-90"
              style={{ background: "#06b6d4" }}
            >
              📅 Create Event
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
