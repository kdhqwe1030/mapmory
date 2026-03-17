"use client";

import { useState, useRef, useEffect } from "react";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";

export type FilterStatus = "all" | "visited" | "want";

const OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "visited", label: "방문" },
  { value: "want", label: "미방문" },
];

interface FilterDropdownProps {
  value: FilterStatus;
  onChange: (value: FilterStatus) => void;
}

export function FilterDropdown({ value, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected = OPTIONS.find((o) => o.value === value)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-0.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
      >
        {selected.label}
        <KeyboardArrowDownRounded
          sx={{ fontSize: 16 }}
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </button>

      {/* Dropdown */}
      <div
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-6px)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.18s ease, transform 0.18s ease",
        }}
        className="absolute right-0 top-full mt-2 w-28 bg-white rounded-2xl shadow-[0_4px_20px_rgba(58,46,42,0.12)] overflow-hidden z-10"
      >
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-text-primary hover:bg-brand-cream transition-colors"
          >
            {opt.label}
            {value === opt.value && (
              <CheckRounded sx={{ fontSize: 14, color: "#4CAF82" }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
