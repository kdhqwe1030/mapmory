"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuBookRounded from "@mui/icons-material/MenuBookRounded";
import MapRounded from "@mui/icons-material/MapRounded";

export function FloatingNavButton() {
  const pathname = usePathname();
  const isMapPage = pathname === "/";

  return (
    <Link
      href={isMapPage ? "/record" : "/"}
      className="fixed bottom-6 right-4 z-[500] w-14 h-14 rounded-full bg-[#FFDCDC] flex items-center justify-center shadow-[0_4px_20px_rgba(58,46,42,0.12)] hover:scale-105 hover:bg-[#FFD6BA] hover:shadow-[0_6px_24px_rgba(58,46,42,0.2)] active:scale-95 transition-all duration-200"
      aria-label={isMapPage ? "기록 페이지로 이동" : "지도로 이동"}
    >
      <span
        className={`absolute transition-all duration-200 ${isMapPage ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
      >
        <MenuBookRounded sx={{ fontSize: 24, color: "#7A6F6A" }} />
      </span>
      <span
        className={`absolute transition-all duration-200 ${!isMapPage ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
      >
        <MapRounded sx={{ fontSize: 24, color: "#7A6F6A" }} />
      </span>
    </Link>
  );
}
