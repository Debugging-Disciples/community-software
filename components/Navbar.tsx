"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const navLinks = [
  { href: "/dashboard", label: "Home" },
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/prayers", label: "Prayers" },
  { href: "/questions", label: "Questions" },
  { href: "/resources", label: "Resources" },
  { href: "/directory", label: "Directory" },
  { href: "/events", label: "Events" },
];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="relative z-20 border-b border-white/10 bg-tech-darker/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🐛</span>
          <span className="font-bold text-white">Debugging Disciples</span>
        </Link>

        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none mx-4">
          {navLinks.map(({ href, label }) => {
            const isActive =
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(href + "/"));
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-brand-cyan bg-brand-cyan/10 font-medium"
                    : "text-gray-400 hover:text-brand-cyan hover:bg-white/5"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {user && (
          <div className="flex items-center gap-3 shrink-0">
            {user.image && (
              <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-brand-cyan/50">
                <Image
                  src={user.image}
                  alt={user.name ?? "User"}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
