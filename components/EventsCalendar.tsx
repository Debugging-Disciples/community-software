"use client";

import { useState, useMemo } from "react";

type CalendarView = "month" | "week";
type EventType = "Bible Study" | "AMA" | "Faith & Tech Dinner" | "Career Event";

interface Attendee {
  id: string;
  name: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: string; // ISO date string YYYY-MM-DD
  startTime: string; // "HH:MM"
  endTime: string;
  location: string;
  zoomLink?: string;
  description: string;
  attendees: Attendee[];
  planToAttend: number;
  googleCalendarUrl?: string;
  userRsvpd: boolean;
}

const eventTypeConfig: Record<
  EventType,
  { emoji: string; color: string; bg: string; gradient?: string }
> = {
  "Bible Study": {
    emoji: "📖",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.15)",
  },
  AMA: {
    emoji: "🎤",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.15)",
  },
  "Faith & Tech Dinner": {
    emoji: "🍽️",
    color: "#a78bfa",
    bg: "rgba(139,92,246,0.1)",
    gradient: "linear-gradient(135deg,rgba(6,182,212,0.15),rgba(139,92,246,0.15))",
  },
  "Career Event": {
    emoji: "💼",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.15)",
  },
};

/** Number of days ahead to look when building the Upcoming Events list. */
const UPCOMING_EVENTS_DAYS = 90;

// Build dates around today for realistic mock data (negative offset = past dates)
function buildDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const initialEvents: CalendarEvent[] = [
  {
    id: "evt-1",
    title: "Weekly Bible Study",
    type: "Bible Study",
    date: buildDate(2),
    startTime: "19:00",
    endTime: "20:30",
    location: "Zoom",
    zoomLink: "https://zoom.us/j/example",
    description:
      "Join us as we dive into the book of Proverbs, exploring wisdom for modern life and tech careers. All levels welcome.",
    attendees: [
      { id: "u1", name: "Sarah M." },
      { id: "u2", name: "Marcus J." },
      { id: "u3", name: "Rachel C." },
    ],
    planToAttend: 14,
    userRsvpd: false,
  },
  {
    id: "evt-2",
    title: "AMA: Faith & Engineering at Big Tech",
    type: "AMA",
    date: buildDate(7),
    startTime: "18:00",
    endTime: "19:30",
    location: "Zoom",
    zoomLink: "https://zoom.us/j/example2",
    description:
      "Ask Marcus Johnson (Engineering Manager at Microsoft) anything about navigating faith in a secular workplace, leading with integrity, and servant leadership at scale.",
    attendees: [
      { id: "u4", name: "Daniel O." },
      { id: "u5", name: "Priya N." },
    ],
    planToAttend: 28,
    userRsvpd: false,
  },
  {
    id: "evt-3",
    title: "Faith & Tech Dinner — SF Bay Area",
    type: "Faith & Tech Dinner",
    date: buildDate(14),
    startTime: "18:30",
    endTime: "21:00",
    location: "The Commons, San Francisco, CA",
    description:
      "An evening of fellowship, great food, and meaningful conversation at the intersection of faith and technology. Network with other Christians in tech from Bay Area companies.",
    attendees: [
      { id: "u6", name: "Thomas W." },
      { id: "u7", name: "Aisha K." },
      { id: "u1", name: "Sarah M." },
      { id: "u2", name: "Marcus J." },
    ],
    planToAttend: 22,
    userRsvpd: false,
  },
  {
    id: "evt-4",
    title: "Career Workshop: Negotiating with Integrity",
    type: "Career Event",
    date: buildDate(10),
    startTime: "12:00",
    endTime: "13:30",
    location: "Zoom",
    zoomLink: "https://zoom.us/j/example3",
    description:
      "Learn practical salary negotiation strategies grounded in biblical principles of fairness, wisdom, and stewardship. Featuring live mock negotiations and Q&A.",
    attendees: [
      { id: "u3", name: "Rachel C." },
      { id: "u8", name: "James P." },
    ],
    planToAttend: 19,
    userRsvpd: false,
  },
  {
    id: "evt-5",
    title: "Weekly Bible Study",
    type: "Bible Study",
    date: buildDate(9),
    startTime: "19:00",
    endTime: "20:30",
    location: "Zoom",
    zoomLink: "https://zoom.us/j/example",
    description:
      "Continuing our series through Proverbs. This week: chapters 8-12.",
    attendees: [{ id: "u1", name: "Sarah M." }],
    planToAttend: 11,
    userRsvpd: false,
  },
  {
    id: "evt-6",
    title: "AMA: Building Startups as a Person of Faith",
    type: "AMA",
    date: buildDate(21),
    startTime: "18:00",
    endTime: "19:30",
    location: "Zoom",
    description:
      "Exploring the unique opportunities and challenges of founding a company while keeping faith at the center.",
    attendees: [],
    planToAttend: 35,
    userRsvpd: false,
  },
];

// Computed once at module load — stable reference avoids useMemo instability
const TODAY = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
})();

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface EventDetailModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onRsvp: (id: string) => void;
  isAdmin: boolean;
}

function EventDetailModal({
  event,
  onClose,
  onRsvp,
  isAdmin,
}: EventDetailModalProps) {
  const cfg = eventTypeConfig[event.type];
  const [gcUrl, setGcUrl] = useState(event.googleCalendarUrl ?? "");
  const [gcSaved, setGcSaved] = useState(false);

  function handleSaveGcUrl() {
    // In production this would persist to the database
    setGcSaved(true);
    setTimeout(() => setGcSaved(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 space-y-5"
        style={{
          background: "#0a0a0a",
          outline: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl leading-none"
        >
          ✕
        </button>

        {/* Title */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{cfg.emoji}</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: cfg.bg, color: cfg.color }}
            >
              {event.type}
            </span>
          </div>
          <h2
            className="text-2xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage: cfg.gradient ?? `linear-gradient(to right, ${cfg.color}, #8b5cf6)`,
            }}
          >
            {event.title}
          </h2>
        </div>

        {/* Meta */}
        <div className="space-y-2 text-sm">
          <p style={{ color: "#06b6d4" }}>
            📅 {formatDate(event.date)} · {formatTime(event.startTime)} –{" "}
            {formatTime(event.endTime)}
          </p>
          <p style={{ color: "#06b6d4" }}>
            📍{" "}
            {event.zoomLink ? (
              <a
                href={event.zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-brand-purple transition-colors"
              >
                {event.location}
              </a>
            ) : (
              event.location
            )}
          </p>
          <p className="text-gray-300">
            👥 <span className="font-semibold">{event.planToAttend}</span> plan to attend
          </p>
        </div>

        {/* Description */}
        <div
          className="rounded-xl p-4 text-gray-200 text-sm leading-relaxed"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          {event.description}
        </div>

        {/* Attendees */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-2">Attendees</h3>
          {event.attendees.length === 0 ? (
            <p className="text-gray-400 text-sm">Be the first to RSVP!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {event.attendees.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
                  style={{ background: "rgba(6,182,212,0.1)", border: "1px solid #06b6d4" }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#06b6d4,#8b5cf6)" }}
                  >
                    {a.name[0]}
                  </span>
                  <span className="text-gray-200">{a.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin: Google Calendar URL */}
        {isAdmin && (
          <div
            className="rounded-xl p-4 space-y-3"
            style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}
          >
            <h3 className="text-white font-semibold text-sm">
              🔧 Admin: Google Calendar Integration
            </h3>
            <p className="text-gray-400 text-xs">
              Add a Google Calendar URL to create/link a community calendar event.
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={gcUrl}
                onChange={(e) => setGcUrl(e.target.value)}
                placeholder="https://calendar.google.com/calendar/r/eventedit?..."
                className="flex-1 bg-tech-darker text-gray-200 placeholder-gray-500 rounded-lg px-3 py-2 text-xs border border-white/10 outline-none focus:border-brand-purple transition-colors"
              />
              <button
                onClick={handleSaveGcUrl}
                className="px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                style={{
                  background: gcSaved
                    ? "rgba(6,182,212,0.3)"
                    : "rgba(139,92,246,0.2)",
                  color: gcSaved ? "#06b6d4" : "#8b5cf6",
                  border: gcSaved
                    ? "1px solid #06b6d4"
                    : "1px solid #8b5cf6",
                }}
              >
                {gcSaved ? "✓ Saved" : "Save"}
              </button>
            </div>
            {gcUrl && (
              <a
                href={gcUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-cyan underline hover:text-brand-purple transition-colors"
              >
                Open Google Calendar event →
              </a>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={() => onRsvp(event.id)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: event.userRsvpd
                ? "rgba(6,182,212,0.2)"
                : "linear-gradient(to right, #06b6d4, #8b5cf6)",
              color: event.userRsvpd ? "#06b6d4" : "white",
              border: event.userRsvpd ? "1px solid #06b6d4" : "none",
            }}
          >
            {event.userRsvpd ? "✓ You're attending!" : "RSVP"}
          </button>
          <button
            className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              border: "1px solid #06b6d4",
              color: "#06b6d4",
            }}
          >
            🔗 Share
          </button>
        </div>
      </div>
    </div>
  );
}

export function EventsCalendar({ isAdmin }: { isAdmin: boolean }) {
  const today = TODAY;

  const [calView, setCalView] = useState<CalendarView>("month");
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - d.getDay());
    return d;
  });
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  function handleRsvp(id: string) {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const joining = !e.userRsvpd;
        return {
          ...e,
          userRsvpd: joining,
          planToAttend: joining ? e.planToAttend + 1 : e.planToAttend - 1,
          attendees: joining
            ? [...e.attendees, { id: "me", name: "You" }]
            : e.attendees.filter((a) => a.id !== "me"),
        };
      })
    );
    // Update selectedEvent too
    setSelectedEvent((prev) => {
      if (!prev || prev.id !== id) return prev;
      const joining = !prev.userRsvpd;
      return {
        ...prev,
        userRsvpd: joining,
        planToAttend: joining ? prev.planToAttend + 1 : prev.planToAttend - 1,
        attendees: joining
          ? [...prev.attendees, { id: "me", name: "You" }]
          : prev.attendees.filter((a) => a.id !== "me"),
      };
    });
  }

  // ── Month View ──────────────────────────────────────────────────────────────
  const monthDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const cells: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [currentMonth, currentYear]);

  function getEventsForDay(day: number) {
    const iso = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === iso);
  }

  function isToday(day: number) {
    return (
      today.getFullYear() === currentYear &&
      today.getMonth() === currentMonth &&
      today.getDate() === day
    );
  }

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }
  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  // ── Week View ───────────────────────────────────────────────────────────────
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [currentWeekStart]);

  function prevWeek() {
    setCurrentWeekStart((d) => {
      const nd = new Date(d);
      nd.setDate(nd.getDate() - 7);
      return nd;
    });
  }
  function nextWeek() {
    setCurrentWeekStart((d) => {
      const nd = new Date(d);
      nd.setDate(nd.getDate() + 7);
      return nd;
    });
  }

  function getEventsForDate(d: Date) {
    const iso = d.toISOString().slice(0, 10);
    return events.filter((e) => e.date === iso);
  }

  function isTodayDate(d: Date) {
    return d.toDateString() === today.toDateString();
  }

  // Upcoming events (sorted by date ascending, next 30 days)
  const upcomingEvents = useMemo(() => {
    const future = new Date(today);
    future.setDate(future.getDate() + UPCOMING_EVENTS_DAYS);
    return events
      .filter((e) => {
        const d = new Date(e.date + "T00:00:00");
        return d >= today && d <= future;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [events, today]);

  return (
    <div className="space-y-8">
      {/* Calendar Section */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ outline: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Calendar Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={calView === "month" ? prevMonth : prevWeek}
              className="text-gray-400 hover:text-brand-cyan transition-colors text-lg"
            >
              ‹
            </button>
            <h2 className="text-white font-semibold min-w-[180px] text-center">
              {calView === "month"
                ? `${MONTH_NAMES[currentMonth]} ${currentYear}`
                : `${weekDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${weekDays[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
            </h2>
            <button
              onClick={calView === "month" ? nextMonth : nextWeek}
              className="text-gray-400 hover:text-brand-cyan transition-colors text-lg"
            >
              ›
            </button>
          </div>

          {/* View Toggle */}
          <div
            className="flex rounded-lg overflow-hidden border"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            {(["month", "week"] as CalendarView[]).map((v) => (
              <button
                key={v}
                onClick={() => setCalView(v)}
                className="px-4 py-1.5 text-sm capitalize transition-all"
                style={{
                  background:
                    calView === v
                      ? "rgba(6,182,212,0.15)"
                      : "rgba(255,255,255,0.03)",
                  color: calView === v ? "#06b6d4" : "#9ca3af",
                  borderRight:
                    v === "month" ? "1px solid rgba(255,255,255,0.1)" : "none",
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Month View */}
        {calView === "month" && (
          <div>
            {/* Day Headers */}
            <div className="grid grid-cols-7" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {DAY_NAMES.map((d) => (
                <div
                  key={d}
                  className="text-center text-xs text-gray-500 py-2 uppercase tracking-wider"
                >
                  {d}
                </div>
              ))}
            </div>
            {/* Day Cells */}
            <div className="grid grid-cols-7">
              {monthDays.map((day, i) => {
                const dayEvents = day ? getEventsForDay(day) : [];
                const todayFlag = day ? isToday(day) : false;
                return (
                  <div
                    key={i}
                    className="min-h-[80px] p-1.5 border-b border-r"
                    style={{
                      borderColor: "rgba(255,255,255,0.05)",
                      background: todayFlag
                        ? "rgba(139,92,246,0.06)"
                        : "transparent",
                    }}
                  >
                    {day && (
                      <>
                        <span
                          className="text-xs font-medium block mb-1 w-6 h-6 flex items-center justify-center rounded-full"
                          style={{
                            color: todayFlag ? "white" : "#9ca3af",
                            border: todayFlag
                              ? "2px solid #8b5cf6"
                              : "2px solid transparent",
                          }}
                        >
                          {day}
                        </span>
                        <div className="space-y-0.5">
                          {dayEvents.slice(0, 2).map((ev) => {
                            const cfg = eventTypeConfig[ev.type];
                            return (
                              <button
                                key={ev.id}
                                onClick={() => setSelectedEvent(ev)}
                                className="w-full text-left text-xs px-1 py-0.5 rounded truncate transition-opacity hover:opacity-80"
                                style={{
                                  background: cfg.gradient ?? cfg.bg,
                                  color: cfg.color,
                                }}
                              >
                                {cfg.emoji} {ev.title}
                              </button>
                            );
                          })}
                          {dayEvents.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{dayEvents.length - 2} more
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Week View */}
        {calView === "week" && (
          <div>
            <div className="grid grid-cols-7" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {weekDays.map((d, i) => {
                const todayFlag = isTodayDate(d);
                return (
                  <div
                    key={i}
                    className="py-3 text-center"
                    style={{
                      borderRight:
                        i < 6 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    }}
                  >
                    <div className="text-xs text-gray-500 uppercase">
                      {DAY_NAMES[d.getDay()]}
                    </div>
                    <div
                      className="mx-auto mt-1 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold"
                      style={{
                        background: todayFlag
                          ? "linear-gradient(135deg,#06b6d4,#8b5cf6)"
                          : "transparent",
                        color: todayFlag ? "white" : "#d1d5db",
                      }}
                    >
                      {d.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-7 min-h-[200px]">
              {weekDays.map((d, i) => {
                const dayEvents = getEventsForDate(d);
                const todayFlag = isTodayDate(d);
                return (
                  <div
                    key={i}
                    className="p-2 space-y-1"
                    style={{
                      borderRight:
                        i < 6 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      background: todayFlag
                        ? "rgba(139,92,246,0.04)"
                        : "transparent",
                    }}
                  >
                    {dayEvents.map((ev) => {
                      const cfg = eventTypeConfig[ev.type];
                      return (
                        <button
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className="w-full text-left text-xs p-1.5 rounded-lg transition-opacity hover:opacity-80"
                          style={{
                            background: cfg.gradient ?? cfg.bg,
                            color: cfg.color,
                          }}
                        >
                          <div className="font-medium truncate">
                            {cfg.emoji} {ev.title}
                          </div>
                          <div className="opacity-75">
                            {formatTime(ev.startTime)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Event Type Legend */}
      <div className="flex flex-wrap gap-3">
        {(Object.keys(eventTypeConfig) as EventType[]).map((type) => {
          const cfg = eventTypeConfig[type];
          return (
            <span
              key={type}
              className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
              style={{ background: cfg.bg, color: cfg.color }}
            >
              {cfg.emoji} {type}
            </span>
          );
        })}
      </div>

      {/* Upcoming Events List */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">
          Upcoming Events
        </h2>
        <div className="space-y-4">
          {upcomingEvents.map((event) => {
            const cfg = eventTypeConfig[event.type];
            return (
              <div
                key={event.id}
                className="p-5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: cfg.gradient ?? "rgba(255,255,255,0.04)",
                  outline: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{cfg.emoji}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        {event.type}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm mb-1" style={{ color: "#06b6d4" }}>
                      📅 {formatDate(event.date)} · {formatTime(event.startTime)} –{" "}
                      {formatTime(event.endTime)}
                    </p>
                    <p className="text-sm mb-2" style={{ color: "#06b6d4" }}>
                      📍{" "}
                      {event.zoomLink ? (
                        <a
                          href={event.zoomLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-brand-purple transition-colors"
                        >
                          {event.location}
                        </a>
                      ) : (
                        event.location
                      )}
                    </p>
                    <p className="text-gray-200 text-sm leading-relaxed line-clamp-2 mb-3">
                      {event.description}
                    </p>

                    {/* Attendee Avatars + Count */}
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {event.attendees.slice(0, 4).map((a) => (
                          <div
                            key={a.id}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white border-2"
                            style={{
                              background:
                                "linear-gradient(135deg,#06b6d4,#8b5cf6)",
                              borderColor: "#06b6d4",
                            }}
                            title={a.name}
                          >
                            {a.name[0]}
                          </div>
                        ))}
                      </div>
                      <span className="text-gray-300 text-sm">
                        <span
                          className="font-semibold"
                          style={{ color: "#06b6d4" }}
                        >
                          {event.planToAttend}
                        </span>{" "}
                        plan to attend
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex sm:flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleRsvp(event.id)}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                      style={{
                        background: event.userRsvpd
                          ? "rgba(6,182,212,0.15)"
                          : "linear-gradient(to right, #06b6d4, #8b5cf6)",
                        color: event.userRsvpd ? "#06b6d4" : "white",
                        border: event.userRsvpd ? "1px solid #06b6d4" : "none",
                      }}
                    >
                      {event.userRsvpd ? "✓ Attending" : "RSVP"}
                    </button>
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
                      style={{
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#06b6d4",
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {upcomingEvents.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              No upcoming events in the next 90 days.
            </div>
          )}
        </div>
      </section>

      {/* Admin Panel */}
      {isAdmin && (
        <section
          className="p-6 rounded-2xl space-y-4"
          style={{
            background: "rgba(139,92,246,0.06)",
            outline: "1px solid rgba(139,92,246,0.2)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🔧</span>
            <h2 className="text-white font-semibold">Admin: Calendar Settings</h2>
          </div>
          <p className="text-gray-400 text-sm">
            As an admin, you can manage calendar visibility and link community
            Google Calendar events. Members can view the calendar; only admins
            can edit events.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="p-4 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h3 className="text-white text-sm font-semibold mb-2">
                📅 Community Google Calendar
              </h3>
              <p className="text-gray-400 text-xs mb-3">
                Paste a Google Calendar event creation URL to add events to the
                community calendar that members can subscribe to.
              </p>
              <input
                type="url"
                placeholder="https://calendar.google.com/calendar/r/eventedit?..."
                className="w-full bg-tech-darker text-gray-200 placeholder-gray-500 rounded-lg px-3 py-2 text-xs border border-white/10 outline-none focus:border-brand-purple transition-colors"
              />
              <button
                className="mt-2 w-full py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  background: "linear-gradient(to right, #06b6d4, #8b5cf6)",
                  color: "white",
                }}
              >
                Add to Community Calendar
              </button>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h3 className="text-white text-sm font-semibold mb-2">
                👥 Calendar Visibility
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Members can view calendar", enabled: true },
                  { label: "Members can RSVP to events", enabled: true },
                  { label: "Members can add events", enabled: false },
                  { label: "Public calendar (non-members)", enabled: false },
                ].map((setting) => (
                  <div
                    key={setting.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-300 text-xs">
                      {setting.label}
                    </span>
                    <div
                      className="relative w-9 h-5 rounded-full transition-colors cursor-pointer"
                      style={{
                        background: setting.enabled
                          ? "#06b6d4"
                          : "rgba(255,255,255,0.1)",
                      }}
                    >
                      <div
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        style={{
                          transform: setting.enabled
                            ? "translateX(18px)"
                            : "translateX(2px)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onRsvp={handleRsvp}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
