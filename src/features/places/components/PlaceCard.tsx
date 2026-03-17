"use client";

import { useState, useEffect } from "react";
import { getCategoryTextColor } from "@/src/features/categories/categoryColors";

type Status = "want" | "visited";

interface PlaceCardProps {
  name: string;
  category: string;
  address: string;
  status: Status;
  emoji?: string;
  naverCategory?: string;
  categoryColor?: string;
}

const statusDot: Record<Status, string> = {
  visited: "bg-[#4CAF82]",
  want: "bg-[#FFDCDC]",
};

export function PlaceCard({
  name,
  category,
  address,
  status,
  emoji = "🗺️",
  naverCategory,
  categoryColor,
}: PlaceCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const lastCategory = category
      ? (category.split(">").pop()?.trim() ?? "")
      : "";
    const q = lastCategory ? `${name} ${lastCategory}` : name;
    fetch(`/api/images?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const first = data.items?.[0]?.link;
        if (first) setImageUrl(first);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [name, category]);

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white shadow-sm">
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl bg-brand-cream shrink-0 flex items-center justify-center text-2xl overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover"
            onError={() => setImageUrl(null)}
          />
        ) : (
          emoji
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text-primary text-sm truncate flex items-center gap-1.5">
          {name}
          <span
            className={`inline-block w-2 h-2 rounded-full shrink-0 ${statusDot[status]}`}
          />
        </p>
        {naverCategory && (
          <p className="text-xs text-text-muted truncate mt-0.5">
            {naverCategory}
          </p>
        )}
        <p className="text-xs text-text-muted truncate mt-0.5">{address}</p>
        <span
          className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
          style={{
            background: categoryColor ?? "#FFDCDC",
            color: getCategoryTextColor(categoryColor ?? "#FFDCDC"),
          }}
        >
          {emoji} {category}
        </span>
      </div>
    </div>
  );
}
