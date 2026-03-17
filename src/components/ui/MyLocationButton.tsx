"use client";

import MyLocationRounded from "@mui/icons-material/MyLocationRounded";

interface MyLocationButtonProps {
  onClick: () => void;
  top?: string | number;
}

export function MyLocationButton({
  onClick,
  top = "110px",
}: MyLocationButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-[0_4px_20px_rgba(58,46,42,0.12)] flex items-center justify-center hover:bg-white transition-colors"
      style={{ top }}
    >
      <MyLocationRounded sx={{ fontSize: 20, color: "#6B5B56" }} />
    </button>
  );
}
