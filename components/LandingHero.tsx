"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function LandingHero() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      {/* Logo/Icon */}
      <div className="mb-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-cyan to-brand-purple flex items-center justify-center text-4xl shadow-lg shadow-brand-cyan/20 mx-auto">
          🐛
        </div>
      </div>

      {/* Headline */}
      <h1
        className="font-bold mb-6 leading-tight"
        style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}
      >
        <span className="bg-gradient-to-r from-white via-brand-cyan to-brand-purple bg-clip-text text-transparent">
          Debugging Disciples
        </span>
        <br />
        <span className="text-white text-4xl font-semibold">Community Hub</span>
      </h1>

      {/* Subheading */}
      <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
        Track your engagement, celebrate contributions, and connect with your
        fellow disciples. Your community journey starts here. 🚀
      </p>

      {/* Sign In with Slack Button */}
      <button
        onClick={() => signIn("slack")}
        disabled={status === "loading"}
        className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-white text-lg
          bg-gradient-to-r from-brand-cyan to-brand-purple
          shadow-lg shadow-brand-cyan/30
          hover:shadow-xl hover:shadow-brand-cyan/50
          hover:-translate-y-0.5
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {/* Slack logo SVG */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
        </svg>
        {status === "loading" ? "Loading..." : "Sign in with Slack"}
      </button>

      {/* Tagline */}
      <p className="mt-6 text-gray-400 text-sm">
        Members only · Powered by your Slack activity
      </p>
    </section>
  );
}
