"use client";

import { useState, useEffect } from "react";
import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import PhoneRounded from "@mui/icons-material/PhoneRounded";
import LocationOnRounded from "@mui/icons-material/LocationOnRounded";
import { useCategories } from "@/src/features/categories/hooks/useCategories";
import {
  useSavedPlaces,
  useSavePlace,
  useRemoveSavedPlace,
} from "@/src/features/places/hooks/useSavedPlaces";

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

  const externalId = `${place.mapx}_${place.mapy}`;
  const lat = parseInt(place.mapy) / 1e7;
  const lng = parseInt(place.mapx) / 1e7;

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: savedPlaces } = useSavedPlaces();
  const savePlace = useSavePlace();
  const removePlace = useRemoveSavedPlace();

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
  console.log(place);
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
          {images.filter((src) => !failedUrls.has(src)).map((src) => (
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

      <div className="mt-8 pt-4">
        <p className="text-xs font-semibold text-mauve-800 mb-2">방문기록</p>
      </div>
    </div>
  );
}
