"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type ViewMode = "grid" | "list";
type Role = "All" | "Leader" | "Admin" | "Core Team" | "Member";
type Interest = "Bible Study" | "Career" | "Tech" | "Prayer" | "Mentorship";

interface Member {
  id: string;
  name: string;
  title: string;
  company: string;
  joinDate: string;
  joinMonths: number;
  role: Exclude<Role, "All">;
  prayerCount: number;
  questionCount: number;
  engagementScore: number;
  interests: Interest[];
  bio: string;
  featured: boolean;
  featuredStory: string;
}

const mockMembers: Member[] = [
  {
    id: "user-1",
    name: "Sarah Mitchell",
    title: "Senior Software Engineer",
    company: "Google",
    joinDate: "Sep 2022",
    joinMonths: 18,
    role: "Core Team",
    prayerCount: 24,
    questionCount: 15,
    engagementScore: 920,
    interests: ["Bible Study", "Tech", "Mentorship"],
    bio: "Building with purpose and faith as my foundation.",
    featured: true,
    featuredStory:
      "Sarah has been instrumental in shaping our tech mentorship program and leads our weekly Bible study with passion and depth.",
  },
  {
    id: "user-2",
    name: "Marcus Johnson",
    title: "Engineering Manager",
    company: "Microsoft",
    joinDate: "Jan 2023",
    joinMonths: 14,
    role: "Leader",
    prayerCount: 31,
    questionCount: 8,
    engagementScore: 1040,
    interests: ["Prayer", "Career", "Mentorship"],
    bio: "Leading teams with servant leadership principles.",
    featured: true,
    featuredStory:
      "Marcus founded our career coaching sessions and has helped 12 members land their dream roles while staying true to their faith.",
  },
  {
    id: "user-3",
    name: "Rachel Chen",
    title: "Product Designer",
    company: "Figma",
    joinDate: "Mar 2023",
    joinMonths: 12,
    role: "Member",
    prayerCount: 10,
    questionCount: 22,
    engagementScore: 740,
    interests: ["Tech", "Bible Study"],
    bio: "Designing beautiful things that serve people well.",
    featured: false,
    featuredStory: "",
  },
  {
    id: "user-4",
    name: "Daniel Okafor",
    title: "Full-Stack Developer",
    company: "Stripe",
    joinDate: "Nov 2022",
    joinMonths: 16,
    role: "Core Team",
    prayerCount: 18,
    questionCount: 30,
    engagementScore: 870,
    interests: ["Tech", "Career", "Prayer"],
    bio: "Building APIs for the Kingdom one commit at a time.",
    featured: true,
    featuredStory:
      "Daniel created the community's Slack bot that powers our engagement tracking and keeps everyone connected.",
  },
  {
    id: "user-5",
    name: "Priya Nair",
    title: "Data Scientist",
    company: "Meta",
    joinDate: "Jun 2023",
    joinMonths: 9,
    role: "Member",
    prayerCount: 7,
    questionCount: 11,
    engagementScore: 510,
    interests: ["Tech", "Bible Study", "Career"],
    bio: "Analyzing data by day, studying scripture by night.",
    featured: false,
    featuredStory: "",
  },
  {
    id: "user-6",
    name: "Thomas Webb",
    title: "DevOps Engineer",
    company: "AWS",
    joinDate: "Feb 2023",
    joinMonths: 13,
    role: "Member",
    prayerCount: 14,
    questionCount: 9,
    engagementScore: 620,
    interests: ["Prayer", "Tech"],
    bio: "Infrastructure for His glory.",
    featured: false,
    featuredStory: "",
  },
  {
    id: "user-7",
    name: "Aisha Kamara",
    title: "Community Manager",
    company: "Slack",
    joinDate: "Aug 2022",
    joinMonths: 19,
    role: "Admin",
    prayerCount: 40,
    questionCount: 5,
    engagementScore: 1100,
    interests: ["Prayer", "Mentorship", "Bible Study"],
    bio: "Connecting people and nurturing community with grace.",
    featured: true,
    featuredStory:
      "Aisha keeps our community thriving through thoughtful moderation, weekly encouragements, and an always-open door for members in need.",
  },
  {
    id: "user-8",
    name: "James Park",
    title: "iOS Developer",
    company: "Apple",
    joinDate: "Apr 2023",
    joinMonths: 11,
    role: "Member",
    prayerCount: 9,
    questionCount: 17,
    engagementScore: 590,
    interests: ["Tech", "Career"],
    bio: "Crafting apps that make lives better.",
    featured: false,
    featuredStory: "",
  },
];

const roleColors: Record<Exclude<Role, "All">, { bg: string; text: string }> = {
  Leader: { bg: "rgba(139,92,246,0.2)", text: "#8b5cf6" },
  Admin: { bg: "rgba(6,182,212,0.2)", text: "#06b6d4" },
  "Core Team": { bg: "rgba(99,102,241,0.2)", text: "#818cf8" },
  Member: { bg: "rgba(255,255,255,0.08)", text: "#d1d5db" },
};

const allInterests: Interest[] = [
  "Bible Study",
  "Career",
  "Tech",
  "Prayer",
  "Mentorship",
];

function MemberAvatar({
  name,
  size = 48,
}: {
  name: string;
  size?: number;
}) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white border-2 group-hover:border-brand-purple transition-colors duration-300 flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
        borderColor: "#06b6d4",
        fontSize: size * 0.35,
      }}
    >
      {(() => {
        const parts = name.trim().split(/\s+/);
        return parts.length >= 2
          ? parts.slice(0, 2).map((n) => n[0]).join("")
          : name.slice(0, 2);
      })()}
    </div>
  );
}

export function CommunityDirectory() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [nameSearch, setNameSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role>("All");
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [minMonths, setMinMonths] = useState(0);
  const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null);

  const roles: Role[] = ["All", "Leader", "Admin", "Core Team", "Member"];

  const featuredMembers = useMemo(
    () => mockMembers.filter((m) => m.featured),
    []
  );

  const filteredMembers = useMemo(() => {
    return mockMembers.filter((m) => {
      const matchesName =
        !nameSearch ||
        m.name.toLowerCase().includes(nameSearch.toLowerCase()) ||
        m.company.toLowerCase().includes(nameSearch.toLowerCase());
      const matchesRole = roleFilter === "All" || m.role === roleFilter;
      const matchesInterests =
        selectedInterests.length === 0 ||
        selectedInterests.every((i) => m.interests.includes(i));
      const matchesDate = m.joinMonths >= minMonths;
      return matchesName && matchesRole && matchesInterests && matchesDate;
    });
  }, [nameSearch, roleFilter, selectedInterests, minMonths]);

  function toggleInterest(interest: Interest) {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  }

  return (
    <div className="space-y-8">
      {/* Featured Members Spotlight */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">
          ✨ Spotlight Members
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredMembers.map((member) => {
            const rc = roleColors[member.role];
            return (
              <div
                key={member.id}
                className="group relative p-5 rounded-2xl overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.1))",
                  outline: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <MemberAvatar name={member.name} size={64} />
                  <div>
                    <Link
                      href={`/profile/${member.id}`}
                      className="text-brand-cyan font-semibold hover:text-brand-purple transition-colors"
                    >
                      {member.name}
                    </Link>
                    <p className="text-gray-300 text-xs mt-0.5">
                      {member.title}
                    </p>
                    <span
                      className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
                      style={{ background: rc.bg, color: rc.text }}
                    >
                      {member.role}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {member.featuredStory}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Filters + Directory */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
        <aside className="lg:w-56 flex-shrink-0 space-y-5">
          <div
            className="p-4 rounded-2xl space-y-5"
            style={{
              background: "rgba(255,255,255,0.04)",
              outline: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Name Search */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">
                Search
              </label>
              <input
                type="text"
                placeholder="Name or company…"
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                className="w-full bg-tech-darker text-gray-200 placeholder-gray-500 rounded-lg px-3 py-2 text-sm border border-white/10 outline-none focus:border-brand-cyan transition-colors"
              />
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">
                Role
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as Role)}
                className="w-full bg-tech-darker text-gray-200 rounded-lg px-3 py-2 text-sm border border-white/10 outline-none focus:border-brand-cyan transition-colors"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Join Date */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">
                Min. months in community:{" "}
                <span style={{ color: "#06b6d4" }}>{minMonths}</span>
              </label>
              <input
                type="range"
                min={0}
                max={24}
                value={minMonths}
                onChange={(e) => setMinMonths(Number(e.target.value))}
                className="w-full accent-brand-cyan"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>24</span>
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">
                Interests
              </label>
              <div className="space-y-1.5">
                {allInterests.map((interest) => {
                  const active = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className="flex items-center gap-2 w-full text-left text-sm transition-colors"
                      style={{ color: active ? "#8b5cf6" : "#9ca3af" }}
                    >
                      <span
                        className="w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center text-xs"
                        style={{
                          borderColor: active ? "#8b5cf6" : "#374151",
                          background: active
                            ? "rgba(139,92,246,0.2)"
                            : "transparent",
                        }}
                      >
                        {active && "✓"}
                      </span>
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Member List / Grid */}
        <div className="flex-1 min-w-0">
          {/* View Toggle */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">
              {filteredMembers.length} member
              {filteredMembers.length !== 1 ? "s" : ""}
            </p>
            <div
              className="flex rounded-lg overflow-hidden border"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            >
              {(["grid", "list"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className="px-4 py-1.5 text-sm transition-all"
                  style={{
                    background:
                      viewMode === mode
                        ? "rgba(6,182,212,0.15)"
                        : "rgba(255,255,255,0.03)",
                    color: viewMode === mode ? "#06b6d4" : "#9ca3af",
                  }}
                >
                  {mode === "grid" ? "⊞ Grid" : "☰ List"}
                </button>
              ))}
            </div>
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              No members match your filters.
            </div>
          )}

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member) => {
                const rc = roleColors[member.role];
                return (
                  <div
                    key={member.id}
                    className="group p-5 rounded-2xl flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.08))",
                      outline: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <MemberAvatar name={member.name} size={48} />
                      <div className="min-w-0">
                        <Link
                          href={`/profile/${member.id}`}
                          className="block text-brand-cyan font-semibold hover:text-brand-purple transition-colors truncate"
                        >
                          {member.name}
                        </Link>
                        <p className="text-gray-300 text-xs truncate">
                          {member.title}
                        </p>
                        <p className="text-gray-400 text-xs truncate">
                          @ {member.company}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: rc.bg, color: rc.text }}
                      >
                        {member.role}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {member.joinMonths} months
                      </span>
                    </div>

                    <div className="flex gap-4 text-sm">
                      <span style={{ color: "#8b5cf6" }}>
                        🙏 <span className="font-semibold">{member.prayerCount}</span>
                      </span>
                      <span style={{ color: "#3b82f6" }}>
                        ❓ <span className="font-semibold">{member.questionCount}</span>
                      </span>
                    </div>

                    <Link
                      href={`/profile/${member.id}`}
                      className="mt-auto block text-center py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      style={{
                        border: hoveredMemberId === member.id ? "1px solid transparent" : "1px solid #06b6d4",
                        background:
                          hoveredMemberId === member.id
                            ? "linear-gradient(to right, #06b6d4, #8b5cf6)"
                            : "transparent",
                        color: hoveredMemberId === member.id ? "white" : "#06b6d4",
                      }}
                      onMouseEnter={() => setHoveredMemberId(member.id)}
                      onMouseLeave={() => setHoveredMemberId(null)}
                    >
                      View Profile
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div
              className="rounded-2xl overflow-hidden"
              style={{ outline: "1px solid rgba(255,255,255,0.08)" }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {["Name", "Title", "Join Date", "Prayers", "Questions", "Score", ""].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member, i) => {
                    const rc = roleColors[member.role];
                    return (
                      <tr
                        key={member.id}
                        style={{
                          background:
                            i % 2 === 0
                              ? "rgba(255,255,255,0.02)"
                              : "transparent",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <MemberAvatar name={member.name} size={28} />
                            <div>
                              <Link
                                href={`/profile/${member.id}`}
                                className="text-brand-cyan hover:text-brand-purple transition-colors font-medium"
                              >
                                {member.name}
                              </Link>
                              <span
                                className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
                                style={{ background: rc.bg, color: rc.text }}
                              >
                                {member.role}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {member.title}
                        </td>
                        <td
                          className="px-4 py-3 text-sm"
                          style={{ color: "#06b6d4" }}
                        >
                          {member.joinDate}
                        </td>
                        <td
                          className="px-4 py-3 font-semibold"
                          style={{ color: "#8b5cf6" }}
                        >
                          {member.prayerCount}
                        </td>
                        <td
                          className="px-4 py-3 font-semibold"
                          style={{ color: "#3b82f6" }}
                        >
                          {member.questionCount}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="font-bold text-sm bg-clip-text text-transparent"
                            style={{
                              backgroundImage:
                                "linear-gradient(to right, #06b6d4, #8b5cf6)",
                            }}
                          >
                            {member.engagementScore}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            className="text-gray-400 hover:text-brand-cyan transition-colors text-lg"
                            title="More options"
                          >
                            ⋮
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
