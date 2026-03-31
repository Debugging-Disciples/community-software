"use client";

import { useState } from "react";
import Image from "next/image";
import { Session } from "next-auth";
import { Navbar } from "@/components/Navbar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BaseMember {
  id: string;
  name: string;
  image: string | null;
  title?: string;
  company?: string;
  isCurrentUser?: boolean;
}

interface LongestMember extends BaseMember {
  tenure: string;
  contributions: number;
}

interface EngagedMember extends BaseMember {
  score: number;
  prayers: number;
  questions: number;
  bibleSessions: number;
  messages: number;
}

interface PrayerWarrior extends BaseMember {
  prayerCount: number;
  latestPrayer: string;
  reactionCount: number;
}

interface QuestionMaster extends BaseMember {
  questionCount: number;
  topics: { label: string; color: string }[];
  latestTopic: string;
}

interface BibleRegular extends BaseMember {
  streak: number;
  currentStreak: string;
  nextMeeting: string;
  allTimeRecord: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const longestMembers: LongestMember[] = [
  { id: "1", name: "Marcus Rivera", image: null, title: "Software Engineer", company: "Google", tenure: "3+ years", contributions: 342, isCurrentUser: false },
  { id: "2", name: "Priya Nair", image: null, title: "Product Manager", company: "Meta", tenure: "2.5 years", contributions: 289 },
  { id: "3", name: "Jordan Lee", image: null, title: "Backend Dev", company: "Stripe", tenure: "2+ years", contributions: 201 },
  { id: "4", name: "Amara Osei", image: null, title: "Designer", company: "Figma", tenure: "18 months", contributions: 178 },
  { id: "5", name: "Devon Clark", image: null, title: "Data Scientist", company: "Palantir", tenure: "14 months", contributions: 132, isCurrentUser: true },
  { id: "6", name: "Sofia Hernandez", image: null, title: "Frontend Dev", company: "Vercel", tenure: "12 months", contributions: 98 },
  { id: "7", name: "Kwame Asante", image: null, title: "DevOps Engineer", company: "AWS", tenure: "10 months", contributions: 84 },
];

const engagedMembers: EngagedMember[] = [
  { id: "1", name: "Priya Nair", image: null, score: 1247, prayers: 34, questions: 21, bibleSessions: 18, messages: 312 },
  { id: "2", name: "Marcus Rivera", image: null, score: 1089, prayers: 28, questions: 15, bibleSessions: 22, messages: 267 },
  { id: "3", name: "Amara Osei", image: null, score: 934, prayers: 19, questions: 30, bibleSessions: 12, messages: 198 },
  { id: "4", name: "Jordan Lee", image: null, score: 812, prayers: 22, questions: 12, bibleSessions: 14, messages: 189 },
  { id: "5", name: "Sofia Hernandez", image: null, score: 748, prayers: 15, questions: 18, bibleSessions: 10, messages: 167, isCurrentUser: true },
  { id: "6", name: "Devon Clark", image: null, score: 691, prayers: 11, questions: 24, bibleSessions: 8, messages: 143 },
  { id: "7", name: "Kwame Asante", image: null, score: 584, prayers: 9, questions: 16, bibleSessions: 11, messages: 121 },
];

const prayerWarriors: PrayerWarrior[] = [
  { id: "1", name: "Amara Osei", image: null, prayerCount: 67, latestPrayer: "Praying for wisdom in my career transition and peace for my family…", reactionCount: 43 },
  { id: "2", name: "Marcus Rivera", image: null, prayerCount: 54, latestPrayer: "Lord, guide our community as we navigate these uncertain times…", reactionCount: 38 },
  { id: "3", name: "Priya Nair", image: null, prayerCount: 48, latestPrayer: "Grateful for answered prayers! Sharing praise for my new role…", reactionCount: 31 },
  { id: "4", name: "Jordan Lee", image: null, prayerCount: 41, latestPrayer: "Seeking God's direction for this next season of life…", reactionCount: 27 },
  { id: "5", name: "Devon Clark", image: null, prayerCount: 33, latestPrayer: "Please keep my sister in your prayers as she recovers…", reactionCount: 23, isCurrentUser: true },
  { id: "6", name: "Sofia Hernandez", image: null, prayerCount: 29, latestPrayer: "Interceding for our tech industry to be a force for good…", reactionCount: 19 },
];

const questionMasters: QuestionMaster[] = [
  { id: "1", name: "Devon Clark", image: null, questionCount: 89, topics: [{ label: "Bible", color: "#8b5cf6" }, { label: "Career", color: "#3b82f6" }], latestTopic: "Bible", isCurrentUser: true },
  { id: "2", name: "Kwame Asante", image: null, questionCount: 74, topics: [{ label: "Faith", color: "#06b6d4" }, { label: "Tech", color: "#9ca3af" }], latestTopic: "Faith" },
  { id: "3", name: "Sofia Hernandez", image: null, questionCount: 61, topics: [{ label: "Career", color: "#3b82f6" }, { label: "Bible", color: "#8b5cf6" }], latestTopic: "Career" },
  { id: "4", name: "Priya Nair", image: null, questionCount: 58, topics: [{ label: "Bible", color: "#8b5cf6" }, { label: "Faith", color: "#06b6d4" }], latestTopic: "Bible" },
  { id: "5", name: "Jordan Lee", image: null, questionCount: 47, topics: [{ label: "Tech", color: "#9ca3af" }, { label: "Career", color: "#3b82f6" }], latestTopic: "Tech" },
  { id: "6", name: "Marcus Rivera", image: null, questionCount: 39, topics: [{ label: "Faith", color: "#06b6d4" }], latestTopic: "Faith" },
];

const bibleRegulars: BibleRegular[] = [
  { id: "1", name: "Marcus Rivera", image: null, streak: 24, currentStreak: "24 weeks", nextMeeting: "Wed 7 PM", allTimeRecord: 24 },
  { id: "2", name: "Priya Nair", image: null, streak: 18, currentStreak: "18 weeks", nextMeeting: "Wed 7 PM", allTimeRecord: 22 },
  { id: "3", name: "Amara Osei", image: null, streak: 14, currentStreak: "14 weeks", nextMeeting: "Wed 7 PM", allTimeRecord: 18 },
  { id: "4", name: "Devon Clark", image: null, streak: 4, currentStreak: "4 weeks", nextMeeting: "Wed 7 PM", allTimeRecord: 12, isCurrentUser: true },
  { id: "5", name: "Jordan Lee", image: null, streak: 3, currentStreak: "3 weeks", nextMeeting: "Wed 7 PM", allTimeRecord: 9 },
  { id: "6", name: "Kwame Asante", image: null, streak: 2, currentStreak: "2 weeks", nextMeeting: "Wed 7 PM", allTimeRecord: 7 },
];

// ─── Helper components ────────────────────────────────────────────────────────

const RANK_MEDALS = ["🥇", "🥈", "🥉"];

function RankBadge({ rank, animated }: { rank: number; animated?: boolean }) {
  if (rank <= 3) {
    const glows = ["rgba(251,191,36,0.6)", "rgba(156,163,175,0.6)", "rgba(180,83,9,0.5)"];
    return (
      <span
        className={`text-2xl flex-shrink-0 ${animated && rank === 1 ? "animate-pulse" : ""}`}
        style={{ filter: `drop-shadow(0 0 8px ${glows[rank - 1]})` }}
      >
        {RANK_MEDALS[rank - 1]}
      </span>
    );
  }
  return (
    <span className="w-8 h-8 flex-shrink-0 rounded-full bg-white/10 flex items-center justify-center text-gray-400 text-sm font-bold">
      {rank}
    </span>
  );
}

function Avatar({ image, name, size = 40 }: { image: string | null; name: string; size?: number }) {
  const initials = name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className="relative flex-shrink-0 rounded-full overflow-hidden border-2 border-brand-cyan"
      style={{ width: size, height: size, boxShadow: "0 0 0 1px rgba(6,182,212,0.3)" }}
    >
      {image ? (
        <Image src={image} alt={name} fill className="object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-cyan/20 to-brand-purple/20 text-brand-cyan font-bold text-xs">
          {initials}
        </div>
      )}
    </div>
  );
}

function GradientAvatar({ image, name, size = 40 }: { image: string | null; name: string; size?: number }) {
  const initials = name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className="relative flex-shrink-0 rounded-full overflow-hidden"
      style={{
        width: size + 4,
        height: size + 4,
        padding: 2,
        background: "linear-gradient(to bottom right, #06b6d4, #8b5cf6)",
      }}
    >
      <div className="w-full h-full rounded-full overflow-hidden">
        {image ? (
          <Image src={image} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-brand-cyan font-bold text-xs">
            {initials}
          </div>
        )}
      </div>
    </div>
  );
}

function DownloadButton() {
  return (
    <button className="px-4 py-2 rounded-lg border border-brand-cyan text-brand-cyan text-sm font-medium
      hover:bg-gradient-to-r hover:from-brand-cyan hover:to-brand-purple hover:text-black hover:border-transparent
      transition-all duration-300">
      ⬇ Download
    </button>
  );
}

// ─── Individual Leaderboard Panels ────────────────────────────────────────────

function LongestMembersPanel() {
  const currentUserRank = longestMembers.findIndex((m) => m.isCurrentUser) + 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-3xl font-bold bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(to right, #fff, #06b6d4, #8b5cf6)" }}
        >
          Longest Members
        </h2>
        <DownloadButton />
      </div>

      {currentUserRank > 0 && (
        <p className="text-sm text-brand-cyan mb-4">
          You&apos;re ranked #{currentUserRank} by tenure
        </p>
      )}

      <div className="rounded-2xl overflow-hidden border border-white/10">
        {longestMembers.map((member, idx) => {
          const rank = idx + 1;
          return (
            <div
              key={member.id}
              className={`group flex items-center gap-4 px-5 py-4 cursor-pointer transition-all duration-200
                ${idx !== longestMembers.length - 1 ? "border-b border-white/5" : ""}
                ${member.isCurrentUser
                  ? "border-l-[3px] border-l-brand-cyan bg-brand-cyan/5"
                  : "hover:bg-gradient-to-r hover:from-brand-cyan/5 hover:to-transparent"
                }`}
            >
              <RankBadge rank={rank} />
              <Avatar image={member.image} name={member.name} />
              <div className="flex-1 min-w-0">
                {member.isCurrentUser && (
                  <span className="text-xs text-brand-cyan font-medium">Your rank</span>
                )}
                <p className="text-gray-100 font-medium group-hover:text-brand-cyan transition-colors truncate">
                  {member.name}
                </p>
                {(member.company || member.title) && (
                  <p className="text-gray-300 text-sm truncate">
                    {[member.title, member.company].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-brand-cyan font-semibold text-sm">{member.tenure}</p>
                <p className="text-xs">
                  <span className="text-brand-purple font-bold">{member.contributions}</span>
                  <span className="text-gray-400"> contributions</span>
                </p>
              </div>
              <span className="text-brand-cyan opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">→</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MostEngagedPanel() {
  const resetDate = "April 1";
  const currentUserRank = engagedMembers.findIndex((m) => m.isCurrentUser) + 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl font-bold text-white">Most Engaged This Month</h2>
        <DownloadButton />
      </div>
      <p className="text-gray-300 text-sm mb-1">
        Score resets monthly · Next reset:{" "}
        <span className="text-brand-cyan">{resetDate}</span>
      </p>

      {currentUserRank > 0 && (
        <p className="text-sm text-brand-cyan mb-4">
          You&apos;re ranked #{currentUserRank} this month
        </p>
      )}

      <div className="rounded-2xl overflow-hidden border border-white/10 mt-4">
        {engagedMembers.map((member, idx) => {
          const rank = idx + 1;
          return (
            <div
              key={member.id}
              className={`group flex items-center gap-4 px-5 py-4 cursor-pointer transition-all duration-200
                ${idx !== engagedMembers.length - 1 ? "border-b border-white/5" : ""}
                ${member.isCurrentUser
                  ? "border-l-[3px] border-l-brand-cyan border border-brand-cyan/30"
                  : "hover:bg-gradient-to-r hover:from-brand-purple/5 hover:to-transparent"
                }`}
            >
              <RankBadge rank={rank} animated />
              <GradientAvatar image={member.image} name={member.name} />
              <div className="flex-1 min-w-0">
                <p className="text-gray-100 font-medium group-hover:text-brand-cyan transition-colors truncate">
                  {member.name}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs">
                  <span><span className="text-brand-purple font-semibold">{member.prayers}</span> 🙏</span>
                  <span><span className="text-tech-blue font-semibold">{member.questions}</span> ❓</span>
                  <span><span className="text-brand-cyan font-semibold">{member.bibleSessions}</span> 📖</span>
                  <span><span className="text-gray-400 font-semibold">{member.messages}</span> 💬</span>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <p
                  className="text-2xl font-bold bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(to right, #06b6d4, #8b5cf6)", filter: "drop-shadow(0 0 8px rgba(6,182,212,0.4))" }}
                >
                  {member.score.toLocaleString()}
                </p>
                <p className="text-gray-400 text-xs">score</p>
              </div>
              <span className="text-brand-cyan opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">→</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PrayerWarriorsPanel() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-3xl font-bold bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(to right, #8b5cf6, #a78bfa)" }}
        >
          🙏 Prayer Warriors
        </h2>
        <DownloadButton />
      </div>

      <div className="rounded-2xl overflow-hidden border border-white/10">
        {prayerWarriors.map((member, idx) => {
          const rank = idx + 1;
          return (
            <div
              key={member.id}
              className={`group flex items-center gap-4 px-5 py-4 cursor-pointer transition-all duration-200
                ${idx !== prayerWarriors.length - 1 ? "border-b border-white/5" : ""}
                ${member.isCurrentUser
                  ? "border-l-[3px] border-l-brand-cyan bg-brand-cyan/5"
                  : "hover:bg-gradient-to-r hover:from-brand-purple/5 hover:to-transparent"
                }`}
            >
              <RankBadge rank={rank} />
              <Avatar image={member.image} name={member.name} />
              <div className="flex-1 min-w-0">
                {member.isCurrentUser && (
                  <span className="text-xs text-brand-cyan font-medium">Your rank</span>
                )}
                <p className="text-gray-100 font-medium group-hover:text-brand-cyan transition-colors truncate">
                  {member.name}
                </p>
                <p className="text-gray-300 text-xs mt-0.5 truncate">
                  <span className="text-brand-cyan">&quot;</span>
                  {member.latestPrayer}
                  <span className="text-brand-cyan">&quot;</span>
                </p>
                <p className="text-gray-200 text-xs mt-0.5">{member.reactionCount} prayed for this</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p
                  className="text-3xl font-bold text-brand-purple"
                  style={{ textShadow: "0 0 12px rgba(139,92,246,0.6)" }}
                >
                  {member.prayerCount}
                </p>
                <p className="text-gray-400 text-xs">prayers</p>
              </div>
              <span className="text-brand-cyan opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">→</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuestionMastersPanel() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-3xl font-bold bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(to right, #3b82f6, #06b6d4)" }}
        >
          ❓ Question Masters
        </h2>
        <DownloadButton />
      </div>

      <div className="rounded-2xl overflow-hidden border border-white/10">
        {questionMasters.map((member, idx) => {
          const rank = idx + 1;
          return (
            <div
              key={member.id}
              className={`group flex items-center gap-4 px-5 py-4 cursor-pointer transition-all duration-200
                ${idx !== questionMasters.length - 1 ? "border-b border-white/5" : ""}
                ${member.isCurrentUser
                  ? "border-l-[3px] border-l-brand-cyan bg-brand-cyan/5"
                  : "hover:bg-gradient-to-r hover:from-tech-blue/5 hover:to-transparent"
                }`}
            >
              <RankBadge rank={rank} />
              <Avatar image={member.image} name={member.name} />
              <div className="flex-1 min-w-0">
                {member.isCurrentUser && (
                  <span className="text-xs text-brand-cyan font-medium">Your rank</span>
                )}
                <p className="text-gray-100 font-medium group-hover:text-brand-cyan transition-colors truncate">
                  {member.name}
                </p>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  {member.topics.map((t) => (
                    <span
                      key={t.label}
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: `${t.color}20`, color: t.color }}
                    >
                      {t.label}
                    </span>
                  ))}
                  <span className="text-gray-400 text-xs">· {member.latestTopic}</span>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <p
                  className="text-3xl font-bold text-tech-blue"
                  style={{ textShadow: "0 0 12px rgba(59,130,246,0.5)" }}
                >
                  {member.questionCount}
                </p>
                <p className="text-gray-400 text-xs">questions</p>
              </div>
              <span className="text-brand-cyan opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">→</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BibleStudyRegularsPanel() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-3xl font-bold bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(to right, #06b6d4, #a78bfa)" }}
        >
          📖 Bible Study Regulars
        </h2>
        <DownloadButton />
      </div>

      <div className="rounded-2xl overflow-hidden border border-white/10">
        {bibleRegulars.map((member, idx) => {
          const rank = idx + 1;
          const isOnStreak = member.streak > 0;
          return (
            <div
              key={member.id}
              className={`group flex items-center gap-4 px-5 py-4 cursor-pointer transition-all duration-200
                ${idx !== bibleRegulars.length - 1 ? "border-b border-white/5" : ""}
                ${member.isCurrentUser
                  ? "border-l-[3px] border-l-brand-cyan bg-brand-cyan/5"
                  : "hover:bg-gradient-to-r hover:from-brand-cyan/5 hover:to-transparent"
                }`}
            >
              <RankBadge rank={rank} />
              <Avatar image={member.image} name={member.name} />
              <div className="flex-1 min-w-0">
                {member.isCurrentUser && (
                  <span className="text-xs text-brand-cyan font-medium">Your rank</span>
                )}
                <p className="text-gray-100 font-medium group-hover:text-brand-cyan transition-colors truncate">
                  {member.name}
                </p>
                <p className="text-gray-300 text-xs mt-0.5">Next: {member.nextMeeting}</p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "#8b5cf6" }}
                >
                  All-time record: {member.allTimeRecord} weeks
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p
                  className="text-3xl font-bold text-brand-cyan flex items-center gap-1 justify-end"
                  style={{ textShadow: "0 0 12px rgba(6,182,212,0.5)" }}
                >
                  {member.streak}
                  <span className={isOnStreak ? "animate-pulse" : "opacity-50"}>🔥</span>
                </p>
                <p className="text-white text-xs">{member.currentStreak}</p>
              </div>
              <span className="text-brand-cyan opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">→</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { key: "longest", label: "Longest Members" },
  { key: "engaged", label: "Most Engaged This Month" },
  { key: "prayer", label: "Prayer Warriors" },
  { key: "questions", label: "Question Masters" },
  { key: "bible", label: "Bible Study Regulars" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ─── Main Component ────────────────────────────────────────────────────────────

interface LeaderboardClientProps {
  session: Session;
}

export function LeaderboardClient({ session }: LeaderboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("longest");

  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(to bottom, #0a0a0a, #000000)" }}>
      {/* Circuit pattern overlay */}
      <div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(59,130,246,0.15) 1px, transparent 0), radial-gradient(circle at 75px 75px, rgba(139,92,246,0.15) 1px, transparent 0)",
          backgroundSize: "100px 100px",
        }}
      />

      <Navbar user={session.user} />

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        {/* Tab Bar */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-8">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 flex-shrink-0
                  ${isActive
                    ? "border-brand-cyan text-white"
                    : "border-transparent text-gray-300 hover:text-brand-purple"
                  }`}
                style={isActive ? { boxShadow: "0 2px 8px rgba(6,182,212,0.4)" } : {}}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div>
          {activeTab === "longest" && <LongestMembersPanel />}
          {activeTab === "engaged" && <MostEngagedPanel />}
          {activeTab === "prayer" && <PrayerWarriorsPanel />}
          {activeTab === "questions" && <QuestionMastersPanel />}
          {activeTab === "bible" && <BibleStudyRegularsPanel />}
        </div>
      </main>
    </div>
  );
}
