"use client";

import { useState, useRef, useEffect } from "react";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface CategoryFilterDropdownProps {
  categories: Category[];
  value: number | null;
  onChange: (id: number | null) => void;
}

export function CategoryFilterDropdown({
  categories,
  value,
  onChange,
}: CategoryFilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected =
    value === null ? null : categories.find((c) => c.id === value);
  const label = selected
    ? `${selected.icon === "default" ? "📁" : selected.icon} ${selected.name}`
    : "전체";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-0.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
      >
        {label}
        <KeyboardArrowDownRounded
          sx={{ fontSize: 16 }}
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </button>

      <div
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-6px)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.18s ease, transform 0.18s ease",
        }}
        className="absolute right-0 top-full mt-2 min-w-30 bg-white rounded-2xl shadow-[0_4px_20px_rgba(58,46,42,0.12)] overflow-hidden z-10"
      >
        {/* 전체 옵션 */}
        <button
          onClick={() => {
            onChange(null);
            setOpen(false);
          }}
          className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-text-primary hover:bg-brand-cream transition-colors"
        >
          전체
          {value === null && (
            <CheckRounded sx={{ fontSize: 14, color: "#4CAF82" }} />
          )}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              onChange(cat.id);
              setOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-text-primary hover:bg-brand-cream transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <span>{cat.icon === "default" ? "📁" : cat.icon}</span>
              <span>{cat.name}</span>
            </span>
            {value === cat.id && (
              <CheckRounded sx={{ fontSize: 14, color: "#4CAF82" }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
