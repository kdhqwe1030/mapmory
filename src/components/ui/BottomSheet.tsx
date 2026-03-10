"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";

const PEEK_HEIGHT = 280;
const FULL_THRESHOLD = 0.8;

export function BottomSheet({ children }: { children: React.ReactNode }) {
  const [height, setHeight] = useState(PEEK_HEIGHT);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(PEEK_HEIGHT);
  const heightRef = useRef(PEEK_HEIGHT);

  const getWH = () =>
    typeof window !== "undefined" ? window.innerHeight : 800;

  const enterFullScreen = useCallback(() => {
    setIsFullScreen(true);
    const wh = getWH();
    setHeight(wh);
    heightRef.current = wh;
    history.pushState({ bottomSheet: "full" }, "");
  }, []);

  const exitFullScreen = useCallback(() => {
    setIsFullScreen(false);
    setHeight(PEEK_HEIGHT);
    heightRef.current = PEEK_HEIGHT;
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setIsFullScreen((prev) => {
        if (prev) {
          setHeight(PEEK_HEIGHT);
          heightRef.current = PEEK_HEIGHT;
          return false;
        }
        return prev;
      });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const onDragStart = useCallback((clientY: number) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    startYRef.current = clientY;
    startHeightRef.current = heightRef.current;
  }, []);

  const onDragMove = useCallback((clientY: number) => {
    if (!isDraggingRef.current) return;
    const delta = startYRef.current - clientY;
    const newHeight = Math.max(
      60,
      Math.min(getWH(), startHeightRef.current + delta),
    );
    heightRef.current = newHeight;
    setHeight(newHeight);
  }, []);

  const onDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    const wh = getWH();
    if (heightRef.current >= wh * FULL_THRESHOLD) {
      enterFullScreen();
    }
    // 그 외엔 현재 높이 그대로 유지
  }, [enterFullScreen]);

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) => onDragMove(e.clientY);
    const onMouseUp = () => onDragEnd();
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, onDragMove, onDragEnd]);

  return (
    <div
      style={{
        height: isFullScreen ? "100dvh" : `${height}px`,
        transition: isDragging
          ? "none"
          : "height 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}
      className={`absolute bottom-0 left-0 right-0 bg-white shadow-[0_-4px_24px_rgba(58,46,42,0.08)] z-[400] flex flex-col overflow-hidden ${
        isFullScreen ? "" : "rounded-t-3xl"
      }`}
    >
      {isFullScreen ? (
        <div className="flex items-center px-4 pt-4 pb-3 flex-shrink-0">
          <button
            onClick={() => history.back()}
            className="text-sm text-[#6B5B56] hover:text-[#3A2E2A] flex items-center gap-1"
          >
            <ArrowBackRounded sx={{ fontSize: 20 }} />
            <span>뒤로</span>
          </button>
        </div>
      ) : (
        <div
          className="flex justify-center pt-3 pb-1 flex-shrink-0 touch-none select-none cursor-grab active:cursor-grabbing"
          onTouchStart={(e) => onDragStart(e.touches[0].clientY)}
          onTouchMove={(e) => onDragMove(e.touches[0].clientY)}
          onTouchEnd={onDragEnd}
          onMouseDown={(e) => onDragStart(e.clientY)}
        >
          <div className="w-10 h-1 rounded-full bg-[#EAD9D0]" />
        </div>
      )}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {children}
      </div>
    </div>
  );
}
