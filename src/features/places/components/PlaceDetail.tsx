"use client";

import { useState, useEffect } from "react";
import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import PhoneRounded from "@mui/icons-material/PhoneRounded";
import LocationOnRounded from "@mui/icons-material/LocationOnRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import { useCategories } from "@/src/features/categories/hooks/useCategories";
import {
  useSavedPlaces,
  useSavePlace,
  useRemoveSavedPlace,
} from "@/src/features/places/hooks/useSavedPlaces";
import {
  useVisits,
  useAddVisit,
  useUpdateVisit,
  useDeleteVisit,
} from "@/src/features/places/hooks/useVisits";
import { CalendarBottomSheet } from "@/src/components/ui/CalendarBottomSheet";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import EventNoteRounded from "@mui/icons-material/EventNoteRounded";
import EditRounded from "@mui/icons-material/EditRounded";

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${y}년 ${parseInt(m)}월 ${parseInt(d)}일`;
}

function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export interface SelectedPlace {
  title: string;
  address: string;
  roadAddress: string;
  category: string;
  description: string;
  telephone: string;
  mapx: string;
  mapy: string;
  link: string;
}

interface PlaceDetailProps {
  place: SelectedPlace;
}

export function PlaceDetail({ place }: PlaceDetailProps) {
  const [images, setImages] = useState<string[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [editingVisitId, setEditingVisitId] = useState<number | null>(null);
  const [editingDate, setEditingDate] = useState<string | undefined>(undefined);

  const externalId = `${place.mapx}_${place.mapy}`;
  const lat = parseInt(place.mapy) / 1e7;
  const lng = parseInt(place.mapx) / 1e7;

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: savedPlaces } = useSavedPlaces();
  const savePlace = useSavePlace();
  const removePlace = useRemoveSavedPlace();

  const placeRecord = (savedPlaces ?? []).find(
    (sp) => sp.places?.external_id === externalId,
  );
  const placeId = placeRecord?.places.id ?? null;

  const { data: visits } = useVisits(placeId ?? 0);
  const addVisit = useAddVisit();
  const updateVisit = useUpdateVisit();
  const deleteVisit = useDeleteVisit();

  const today = todayISO();
  const todayVisit = (visits ?? []).find((v) => v.visited_at === today);
  const pastVisits = (visits ?? []).filter((v) => v.visited_at !== today);

  useEffect(() => {
    setImagesLoading(true);
    setImages([]);
    setFailedUrls(new Set());
    const lastCategory = place.category
      ? (place.category.split(">").pop()?.trim() ?? "")
      : "";
    const q = lastCategory ? `${place.title} ${lastCategory}` : place.title;
    fetch(`/api/images?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => {
        const urls: string[] = (data.items ?? [])
          .map((item: Record<string, string>) => item.link ?? "")
          .filter(Boolean);
        setImages(urls);
        setImagesLoading(false);
      })
      .catch(() => {
        setImagesLoading(false);
      });
  }, [place.title, place.category]);

  return (
    <div className="px-4 pt-3 pb-8">
      {/* 헤더 */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#3A2E2A] leading-tight">
          {place.title}
        </h2>
        {place.category && (
          <p className="text-xs text-[#9B8B84] mt-1">{place.category}</p>
        )}
      </div>

      {/* 사진 가로 스크롤 */}
      {imagesLoading ? (
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-[120px] h-[120px] rounded-xl bg-[#F5EDE8] animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      ) : images.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide">
          {images
            .filter((src) => !failedUrls.has(src))
            .map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                className="w-[120px] h-[120px] rounded-xl object-cover flex-shrink-0"
                onError={() => setFailedUrls((prev) => new Set([...prev, src]))}
              />
            ))}
        </div>
      ) : (
        <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-[#FFF2EB] to-[#FFDCDC] flex items-center justify-center mb-4">
          <span className="text-4xl">🗺️</span>
        </div>
      )}

      {/* 정보 목록 */}
      <div className="flex flex-col gap-3">
        {(place.roadAddress || place.address) && (
          <div className="flex items-start gap-2.5">
            <LocationOnRounded
              sx={{ fontSize: 16, color: "#9B8B84", flexShrink: 0, mt: "1px" }}
            />
            <p className="text-sm text-[#6B5B56] leading-snug">
              {place.roadAddress || place.address}
            </p>
          </div>
        )}
        {place.telephone && (
          <div className="flex items-center gap-2.5">
            <PhoneRounded
              sx={{ fontSize: 16, color: "#9B8B84", flexShrink: 0 }}
            />
            <p className="text-sm text-[#6B5B56]">{place.telephone}</p>
          </div>
        )}
        {place.link && (
          <div className="flex items-center gap-2.5">
            <OpenInNewRounded
              sx={{ fontSize: 16, color: "#9B8B84", flexShrink: 0 }}
            />
            <a
              href={place.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#6B5B56] hover:text-[#3A2E2A] underline underline-offset-2 transition-colors truncate"
            >
              {place.link}
            </a>
          </div>
        )}
        {place.description && (
          <p className="text-sm text-[#9B8B84] leading-relaxed mt-1">
            {place.description}
          </p>
        )}
      </div>

      {/* 카테고리 저장 */}
      <div className="mt-8 pt-4">
        <p className="text-xs font-semibold text-mauve-800 mb-2">카테고리</p>
        {categoriesLoading ? (
          <p className="text-xs text-[#9B8B84]">불러오는 중...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(categories ?? []).map((cat) => {
              const savedRecord = (savedPlaces ?? []).find(
                (sp) =>
                  sp.places?.external_id === externalId &&
                  sp.category_id === cat.id,
              );
              const isSaved = !!savedRecord;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (isSaved) {
                      removePlace.mutate(savedRecord.id);
                    } else {
                      savePlace.mutate({
                        name: place.title,
                        address: place.roadAddress || place.address,
                        external_id: externalId,
                        lat,
                        lng,
                        naver_category: place.category,
                        category_id: cat.id,
                      });
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    isSaved
                      ? "bg-[#FFDCDC] border-[#FFDCDC] text-[#3A2E2A]"
                      : "bg-white border-[#EAD9D0] text-[#6B5B56]"
                  }`}
                >
                  <span>{cat.icon === "default" ? "📁" : cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      {placeId !== null && (
        <div className="mt-8 pt-4">
          <p className="text-xs font-semibold tracking-[0.08em] text-[#9B8B84] mb-3">
            방문 기록
          </p>

          {/* 오늘 방문 버튼 — todayVisit 없을 때만 표시 */}
          {!todayVisit && (
            <button
              type="button"
              onClick={() =>
                addVisit.mutate({ place_id: placeId, visited_at: today })
              }
              className="w-full rounded-2xl px-4 py-4 flex items-center justify-center gap-2 text-sm font-semibold transition-all shadow-sm bg-[#F56F86] text-white mb-4"
            >
              <CheckCircleRounded sx={{ fontSize: 18 }} />
              <span>오늘 방문했어요</span>
            </button>
          )}

          {/* 방문 기록 리스트 섹션 */}
          {(visits ?? []).length > 0 ? (
            <div className="rounded-2xl border border-[#EAD9D0] overflow-hidden">
              {/* 오늘 방문 — 최상단, 강조 스타일 */}
              {todayVisit && (
                <div
                  className={`px-4 py-3 flex items-center justify-between bg-[#FFF2EB] border-[#FFDCDC]${pastVisits.length > 0 ? " border-b" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFDCDC]">
                      <CheckCircleRounded
                        sx={{ fontSize: 18, color: "#F56F86" }}
                      />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#F56F86]">
                        오늘
                      </p>
                      <p className="text-xs text-[#9B8B84]">
                        {formatDate(todayVisit.visited_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingVisitId(todayVisit.id);
                        setEditingDate(todayVisit.visited_at);
                        setIsCalendarOpen(true);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#FFDCDC] transition-colors"
                    >
                      <EditRounded sx={{ fontSize: 16, color: "#A89A93" }} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        deleteVisit.mutate({
                          id: todayVisit.id,
                          place_id: placeId,
                        })
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#FFDCDC] transition-colors"
                    >
                      <DeleteOutlineRounded
                        sx={{ fontSize: 16, color: "#C97B7B" }}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* 이전 방문 목록 */}
              {pastVisits.map((visit, index) => (
                <div
                  key={visit.id}
                  className={`px-4 py-3 flex items-center justify-between${index < pastVisits.length - 1 ? " border-b border-[#F5EDE8]" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F5F7]">
                      <EventNoteRounded
                        sx={{ fontSize: 18, color: "#94A3B8" }}
                      />
                    </div>
                    <p className="text-[15px] font-semibold text-[#5B5560]">
                      {formatDate(visit.visited_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingVisitId(visit.id);
                        setEditingDate(visit.visited_at);
                        setIsCalendarOpen(true);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#FFF2EB] transition-colors"
                    >
                      <EditRounded sx={{ fontSize: 16, color: "#A89A93" }} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        deleteVisit.mutate({
                          id: visit.id,
                          place_id: placeId,
                        })
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#FFF2EB] transition-colors"
                    >
                      <DeleteOutlineRounded
                        sx={{ fontSize: 16, color: "#C97B7B" }}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#9B8B84] text-center py-4">
              아직 방문 기록이 없어요
            </p>
          )}
        </div>
      )}

      <CalendarBottomSheet
        isOpen={isCalendarOpen}
        defaultDate={editingDate}
        onConfirm={(date) => {
          if (placeId === null) return;
          if (editingVisitId !== null) {
            updateVisit.mutate({
              id: editingVisitId,
              place_id: placeId,
              visited_at: date,
            });
          } else {
            addVisit.mutate({ place_id: placeId, visited_at: date });
          }
        }}
        onClose={() => {
          setIsCalendarOpen(false);
          setEditingVisitId(null);
          setEditingDate(undefined);
        }}
      />
    </div>
  );
}
