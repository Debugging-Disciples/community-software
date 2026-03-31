"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Resource } from "@/lib/resources";

interface TrendingResourcesWidgetProps {
  resources: Resource[];
}

export function TrendingResourcesWidget({ resources }: TrendingResourcesWidgetProps) {
  const [current, setCurrent] = useState(0);

  if (resources.length === 0) return null;

  const resource = resources[current];

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-brand-cyan/5 to-brand-purple/5 overflow-hidden">
      {/* Widget header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-brand-cyan text-lg">📚</span>
          <span className="text-sm font-semibold text-white">Trending Resources This Week</span>
        </div>
        <Link
          href="/resources"
          className="text-xs text-brand-cyan hover:underline"
        >
          View all →
        </Link>
      </div>

      {/* Card area */}
      <div className="p-4">
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div
            className="relative shrink-0 rounded-xl overflow-hidden bg-white/5"
            style={{ width: 96, height: 54 }}
          >
            {resource.thumbnail ? (
              <Image
                src={resource.thumbnail}
                alt={resource.title}
                fill
                className="object-cover"
                sizes="96px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl">
                {resource.categoryEmoji}
              </div>
            )}
          </div>

          {/* Text */}
          <div className="flex flex-1 flex-col gap-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-snug line-clamp-2">
              {resource.title}
            </p>
            <p className="text-xs text-gray-400 line-clamp-2">{resource.description}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-gray-500">👁️ {resource.views.toLocaleString()} views</span>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-xs px-3 py-1 rounded-lg bg-gradient-to-r from-brand-cyan to-brand-purple text-white font-medium hover:opacity-90 transition-opacity shrink-0"
              >
                View
              </a>
            </div>
          </div>
        </div>

        {/* Carousel dots */}
        {resources.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {resources.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`View resource ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === current ? "bg-brand-cyan" : "bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
