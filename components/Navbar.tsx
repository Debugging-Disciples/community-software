"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const navLinks = [
  { href: "/dashboard", label: "Home" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/prayer", label: "Prayers" },
  { href: "/resources", label: "Resources" },
];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <nav className="relative z-20 border-b border-white/10 bg-tech-darker/90 backdrop-blur-md sticky top-0">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <span className="text-xl">🐛</span>
          <span className="font-bold text-white text-sm sm:text-base tracking-tight">Debugging Disciples</span>
        </Link>

        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
          {navLinks.map(({ href, label }) => {
            const isExact = pathname === href;
            const isNested = pathname.startsWith(`${href}/`);
            const isActive = href === "/dashboard" ? isExact : isExact || isNested;

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-brand-cyan bg-brand-cyan/10 font-medium"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {user && (
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors group"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              {user.image ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-brand-cyan/40 flex-shrink-0">
                  <Image
                    src={user.image}
                    alt={user.name ?? "User"}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-brand-cyan/40 bg-gradient-to-br from-brand-cyan/20 to-brand-purple/20 flex items-center justify-center text-brand-cyan font-bold text-xs flex-shrink-0">
                  {(user.name ?? "U").trim().split(/\s+/).filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="hidden sm:block text-sm text-slate-200 font-medium max-w-[120px] truncate group-hover:text-white transition-colors">
                {user.name?.trim().split(/\s+/)[0] ?? "User"}
              </span>
              <svg
                className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 shadow-2xl z-50 overflow-hidden"
                style={{ background: "rgba(11,18,32,0.97)", backdropFilter: "blur(16px)" }}
              >
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                  {user.email && <p className="text-slate-400 text-xs mt-0.5 truncate">{user.email}</p>}
                </div>
                <div className="p-1.5">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
