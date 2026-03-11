"use client";

import { useRef, useState, useEffect } from "react";
import SearchRounded from "@mui/icons-material/SearchRounded";
import TuneRounded from "@mui/icons-material/TuneRounded";
import LocationOnRounded from "@mui/icons-material/LocationOnRounded";

interface SearchResult {
  title: string;
  address: string;
  roadAddress: string;
  category: string;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "");
}

export function PlaceSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCallRef = useRef(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      const items: SearchResult[] = (data.items ?? []).map(
        (item: Record<string, string>) => ({
          title: stripHtml(item.title ?? ""),
          address: item.address ?? "",
          roadAddress: item.roadAddress ?? "",
          category: item.category ?? "",
        }),
      );
      setResults(items);
      setIsOpen(items.length > 0);
    } catch {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (!val.trim()) {
      setResults([]);
      setIsOpen(false);
      if (throttleRef.current) clearTimeout(throttleRef.current);
      return;
    }

    const now = Date.now();
    const THROTTLE = 500;

    if (now - lastCallRef.current >= THROTTLE) {
      // 충분한 시간이 지났으면 즉시 호출
      lastCallRef.current = now;
      search(val);
    } else {
      // 아니면 trailing 호출 예약
      if (throttleRef.current) clearTimeout(throttleRef.current);
      throttleRef.current = setTimeout(
        () => {
          lastCallRef.current = Date.now();
          search(val);
        },
        THROTTLE - (now - lastCallRef.current),
      );
    }
  };

  return (
    <div ref={wrapperRef} className="absolute top-4 left-4 right-4 z-10">
      <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-4 py-3 shadow-[0_4px_20px_rgba(58,46,42,0.12)]">
        <SearchRounded sx={{ fontSize: 20, color: "#9B8B84", flexShrink: 0 }} />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="장소를 검색해보세요"
          className="flex-1 text-sm text-[#3A2E2A] placeholder:text-[#9B8B84] outline-none bg-transparent"
        />
        <button className="w-8 h-8 rounded-full bg-[#FFDCDC] flex items-center justify-center flex-shrink-0">
          <TuneRounded sx={{ fontSize: 16, color: "#3A2E2A" }} />
        </button>
      </div>

      {/* 검색 결과 드롭다운 */}
      {isOpen && results.length > 0 && (
        <div className="mt-2 bg-white rounded-2xl shadow-[0_4px_20px_rgba(58,46,42,0.12)] overflow-hidden">
          {results.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(item.title);
                setIsOpen(false);
              }}
              className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[#FFF2EB] transition-colors text-left"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#3A2E2A] truncate">
                  {item.title}
                </p>
                <p className="text-xs text-[#9B8B84] truncate mt-0.5">
                  {item.roadAddress || item.address}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
