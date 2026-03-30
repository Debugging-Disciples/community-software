"use client";

import { useState } from "react";
import Image from "next/image";
import { StatsGrid } from "@/components/StatsGrid";
import { BadgesSection } from "@/components/BadgesSection";
import { ActivityFeed } from "@/components/ActivityFeed";

type ActivityType = "prayer" | "question" | "bible_study" | "achievement";

interface Profile {
  id: string;
  name: string;
  slackHandle: string;
  image: string | null;
  joinDate: string;
  role: "Leader" | "Admin" | "Core Team" | "Member";
  bio: string;
  title: string;
  company: string;
  faithJourney: string;
  stats: {
    prayerRequests: number;
    questionsAsked: number;
    sessionsAttended: number;
    engagementScore: number;
    messagesSent: number;
    currentStreak: number;
  };
  badges: Array<{
    id: string;
    emoji: string;
    name: string;
    description: string;
    color: string;
  }>;
  activities: Array<{
    id: string;
    type: ActivityType;
    content: string;
    time: string;
  }>;
}

const roleStyles: Record<string, { bg: string; text: string; label: string }> = {
  Leader: { bg: "#8b5cf6", text: "white", label: "Leader" },
  Admin: { bg: "#06b6d4", text: "#000", label: "Admin" },
  "Core Team": { bg: "linear-gradient(to right, #06b6d4, #8b5cf6)", text: "white", label: "Core Team" },
  Member: { bg: "rgba(255,255,255,0.1)", text: "#d1d5db", label: "Member" },
};

export function ProfileClient({ profile, isOwnProfile }: { profile: Profile; isOwnProfile: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(profile.bio);
  const role = roleStyles[profile.role] ?? roleStyles.Member;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="relative p-8 rounded-2xl bg-gradient-to-br from-tech-dark via-brand-cyan/10 to-brand-purple/10 border border-white/10 overflow-hidden">
        {/* Edit button */}
        {isOwnProfile && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-4 right-4 px-4 py-2 rounded-lg border border-brand-cyan text-brand-cyan text-sm
              hover:bg-gradient-to-r hover:from-brand-cyan hover:to-brand-purple hover:text-white hover:border-transparent
              transition-all duration-200"
          >
            {isEditing ? "Save Profile" : "Edit Profile"}
          </button>
        )}

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Picture */}
          <div className="group relative flex-shrink-0">
            <div
              className="w-28 h-28 rounded-full overflow-hidden border-[3px] border-brand-cyan
                group-hover:border-brand-purple transition-all duration-300"
              style={{ boxShadow: "0 0 20px rgba(6,182,212,0.3)" }}
            >
              {profile.image ? (
                <Image
                  src={profile.image}
                  alt={profile.name}
                  width={112}
                  height={112}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-cyan to-brand-purple flex items-center justify-center text-4xl font-bold text-white">
                  {profile.name[0]}
                </div>
              )}
            </div>
          </div>

          {/* Name & Identity */}
          <div className="text-center md:text-left flex-1">
            <h1
              className="text-3xl font-bold mb-1 bg-gradient-to-r from-white via-brand-cyan to-brand-purple bg-clip-text text-transparent"
            >
              {profile.name}
            </h1>
            <p className="text-gray-300 mb-2">
              <span className="text-brand-cyan">@</span>
              {profile.slackHandle}
            </p>
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
              <span
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  background: role.bg,
                  color: role.text,
                }}
              >
                {role.label}
              </span>
              <span
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: "rgba(6,182,212,0.15)",
                  color: "#06b6d4",
                }}
              >
                Member since {profile.joinDate}
              </span>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-6 pt-6 border-t border-white/10 border-b-2 pb-6" style={{ borderBottomColor: "#06b6d4" }}>
          <h3 className="text-white font-semibold mb-3">About</h3>
          {isEditing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-tech-darker text-gray-200 rounded-lg p-3 border border-white/10 focus:border-brand-cyan outline-none resize-none text-sm"
              rows={3}
            />
          ) : (
            <p className="text-gray-200 text-sm leading-relaxed">{bio}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-3 text-sm">
            <span className="text-gray-300">
              {profile.title}{" "}
              <span className="text-brand-purple">@ {profile.company}</span>
            </span>
          </div>
          <blockquote className="mt-3 text-gray-200 italic text-sm">
            <span className="text-brand-cyan text-xl leading-none">&ldquo;</span>
            {profile.faithJourney.replace(/^"|"$/g, "")}
            <span className="text-brand-cyan text-xl leading-none">&rdquo;</span>
          </blockquote>
        </div>
      </div>

      {/* Stats */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Engagement Stats</h2>
        <StatsGrid stats={profile.stats} />
      </section>

      {/* Badges */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Badges</h2>
        <BadgesSection badges={profile.badges} />
      </section>

      {/* Activity Feed */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <ActivityFeed activities={profile.activities} />
      </section>
    </div>
  );
}
