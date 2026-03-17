"use client";

import { useState, useEffect } from "react";

interface CalendarBottomSheetProps {
  isOpen: boolean;
  defaultDate?: string; // ISO "2024-01-15", 없으면 오늘
  onConfirm: (date: string) => void; // ISO date string 반환
  onClose: () => void;
}

const DAYS_OF_WEEK = ["일", "월", "화", "수", "목", "금", "토"];

function toISODateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1).getDay(); // 0=일
  const lastDate = new Date(year, month + 1, 0).getDate();
  const days: (Date | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let d = 1; d <= lastDate; d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

export function CalendarBottomSheet({
  isOpen,
  defaultDate,
  onConfirm,
  onClose,
}: CalendarBottomSheetProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initialDate = defaultDate ? parseDate(defaultDate) : today;

  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  // isOpen이 바뀔 때마다 날짜 초기화
  useEffect(() => {
    if (isOpen) {
      const d = defaultDate ? parseDate(defaultDate) : new Date();
      d.setHours(0, 0, 0, 0);
      setSelectedDate(d);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [isOpen, defaultDate]);

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleConfirm = () => {
    onConfirm(toISODateString(selectedDate));
    onClose();
  };

  const calendarDays = getCalendarDays(viewYear, viewMonth);

  return (
    <>
      {/* 오버레이 */}
      <div
        className={`fixed inset-0 z-490 bg-black/40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* 바텀시트 */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-500 bg-white rounded-t-3xl shadow-[0_-4px_24px_rgba(58,46,42,0.12)] transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* 드래그 핸들 */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="px-5 pb-6">
          {/* 월 네비게이션 */}
          <div className="flex items-center justify-between py-3">
            <button
              onClick={goToPrevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-brand-cream text-text-secondary transition-colors"
              aria-label="이전 달"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 12L6 8l4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <span className="text-base font-semibold text-text-primary">
              {viewYear}년 {viewMonth + 1}월
            </span>

            <button
              onClick={goToNextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-brand-cream text-text-secondary transition-colors"
              aria-label="다음 달"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS_OF_WEEK.map((day, i) => (
              <div
                key={day}
                className={`text-center text-xs font-medium py-1 ${
                  i === 0
                    ? "text-red-400"
                    : i === 6
                      ? "text-blue-400"
                      : "text-text-muted"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-y-1">
            {calendarDays.map((date, idx) => {
              if (!date) {
                return <div key={`empty-${idx}`} />;
              }

              const isSelected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, today);
              const dayOfWeek = date.getDay();

              let textColor = "text-text-primary";
              if (dayOfWeek === 0) textColor = "text-red-400";
              else if (dayOfWeek === 6) textColor = "text-blue-400";

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`relative flex flex-col items-center justify-center h-9 rounded-full text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-[#FFDCDC] text-text-primary font-semibold"
                      : `${textColor} hover:bg-brand-cream`
                  }`}
                >
                  {date.getDate()}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FFDCDC]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* 선택된 날짜 표시 */}
          <p className="text-center text-xs text-text-muted mt-3">
            {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월{" "}
            {selectedDate.getDate()}일
          </p>

          {/* 버튼 영역 */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border  text-sm font-medium text-text-secondary hover:bg-brand-cream transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 h-11 rounded-xl bg-text-primary text-sm font-medium text-white hover:bg-[#2a201c] transition-colors"
            >
              완료
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
