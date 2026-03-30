"use client";

import { useState } from "react";
import Image from "next/image";
import type { Resource } from "@/lib/resources";

export type { Resource };

interface ResourceCardProps {
  resource: Resource;
}

const MAX_DESC_LENGTH = 120;

export function ResourceCard({ resource }: ResourceCardProps) {
  const [saved, setSaved] = useState(resource.saved ?? false);

  const descriptionTruncated =
    resource.description.length > MAX_DESC_LENGTH
      ? resource.description.slice(0, MAX_DESC_LENGTH).trimEnd() + "…"
      : resource.description;

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border bg-gradient-to-br from-white/5 to-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${resource.categoryColor}`}
    >
      {/* Thumbnail */}
      <div className="relative w-full overflow-hidden rounded-t-2xl bg-white/5" style={{ aspectRatio: "16/9" }}>
        {resource.thumbnail ? (
          <Image
            src={resource.thumbnail}
            alt={resource.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">
            {resource.categoryEmoji}
          </div>
        )}

        {/* Category badge */}
        <span className="absolute left-3 top-3 rounded-full bg-tech-blue/90 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          {resource.categoryEmoji} {resource.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Title */}
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white/90 transition-colors group-hover:text-brand-cyan">
          {resource.title}
        </h3>

        {/* Source / Author */}
        <p className="text-xs text-gray-400">
          From:{" "}
          <span className="text-brand-cyan">{resource.source}</span>
          {resource.author && (
            <>
              {" "}| By:{" "}
              <span className="text-brand-cyan">{resource.author}</span>
            </>
          )}
        </p>

        {/* Description */}
        <p className="flex-1 text-xs leading-relaxed text-gray-200">
          {descriptionTruncated}
          {resource.description.length > MAX_DESC_LENGTH && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-brand-cyan hover:underline"
            >
              Read more...
            </a>
          )}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
          <span>⏱️ {resource.readTime} min read</span>
          <span>👁️ {resource.views.toLocaleString()} views</span>
          <span>📤 {resource.shares} shares</span>
        </div>

        {/* Action buttons */}
        <div className="mt-1 flex items-center gap-2">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg bg-gradient-to-r from-brand-cyan to-brand-purple px-3 py-1.5 text-center text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            Visit Resource
          </a>
          <button
            onClick={() => setSaved((s) => !s)}
            aria-label={saved ? "Unsave resource" : "Save resource"}
            className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
              saved
                ? "border-brand-cyan/60 text-brand-cyan bg-brand-cyan/10"
                : "border-white/20 text-gray-400 hover:border-brand-cyan/60 hover:text-brand-cyan"
            }`}
          >
            {saved ? "♥" : "♡"}
          </button>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open in new tab"
            className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-brand-cyan/60 hover:text-brand-cyan"
          >
            ↗
          </a>
        </div>
      </div>
    </div>
  );
}
