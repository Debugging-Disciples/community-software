"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Navbar({ user }: NavbarProps) {
  return (
    <nav className="relative z-20 border-b border-white/10 bg-tech-darker/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">🐛</span>
          <span className="font-bold text-white">Debugging Disciples</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-gray-400 hover:text-brand-cyan transition-colors text-sm"
          >
            Dashboard
          </Link>
          <Link
            href="/qa"
            className="text-gray-400 hover:text-brand-cyan transition-colors text-sm"
          >
            Q&amp;A
          </Link>
          <Link
            href="/directory"
            className="text-gray-400 hover:text-brand-cyan transition-colors text-sm"
          >
            Directory
          </Link>
          <Link
            href="/events"
            className="text-gray-400 hover:text-brand-cyan transition-colors text-sm"
          >
            Events
          </Link>

          {user && (
            <div className="flex items-center gap-3">
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
      </div>
    </nav>
  );
}
