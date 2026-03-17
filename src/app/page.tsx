"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { MapView } from "@/src/features/map/components/MapView";
import {
  PlaceSearchBar,
  SearchResult,
} from "@/src/features/places/components/PlaceSearchBar";
import { PlaceCard } from "@/src/features/places/components/PlaceCard";
import {
  PlaceDetail,
  SelectedPlace,
} from "@/src/features/places/components/PlaceDetail";
import { BottomSheet } from "@/src/components/ui/BottomSheet";
import { CategoryFilterDropdown } from "@/src/components/ui/CategoryFilterDropdown";
import MyLocationRounded from "@mui/icons-material/MyLocationRounded";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import { FloatingNavButton } from "@/src/components/ui/FloatingNavButton";
import { useSavedPlaces } from "@/src/features/places/hooks/useSavedPlaces";

interface LatLng {
  lat: number;
  lng: number;
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Home() {
  const { data: savedPlaces = [] } = useSavedPlaces();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(
    null,
  );
  const [recenterCounter, setRecenterCounter] = useState(0);
  const [showRedMarker, setShowRedMarker] = useState(true);
  const [selectedSavedPlaceId, setSelectedSavedPlaceId] = useState<
    number | null
  >(null);

  // 현재 위치 얻기
  const fetchCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {},
      { enableHighAccuracy: true },
    );
  }, []);

  useEffect(() => {
    fetchCurrentPosition();
  }, [fetchCurrentPosition]);

  const handleSelectPlace = useCallback(
    (place: SearchResult) => {
      setSelectedPlace(place);
      // 검색한 장소가 이미 저장된 마커인지 확인 (좌표 매칭)
      const match = savedPlaces.find((sp) => {
        if (!sp.places.lat || !sp.places.lng) return false;
        return (
          String(Math.round(sp.places.lng * 1e7)) === place.mapx &&
          String(Math.round(sp.places.lat * 1e7)) === place.mapy
        );
      });
      if (match) {
        setShowRedMarker(false);
        setSelectedSavedPlaceId(match.id);
      } else {
        setShowRedMarker(true);
        setSelectedSavedPlaceId(null);
      }
    },
    [savedPlaces],
  );

  const handleBack = useCallback(() => {
    setSelectedPlace(null);
    setShowRedMarker(true);
    setSelectedSavedPlaceId(null);
  }, []);

  const handleRecenter = useCallback(() => {
    fetchCurrentPosition();
    setRecenterCounter((c) => c + 1);
  }, [fetchCurrentPosition]);

  const handleSavedPlaceClick = useCallback(
    (sp: (typeof filteredPlaces)[0]) => {
      if (!sp.places.lat || !sp.places.lng) return;
      const fakeSelectedPlace: SelectedPlace = {
        title: sp.places.name,
        address: sp.places.address ?? "",
        roadAddress: sp.places.address ?? "",
        category: sp.places.naver_category ?? "",
        description: "",
        telephone: "",
        mapx: String(Math.round(sp.places.lng * 1e7)),
        mapy: String(Math.round(sp.places.lat * 1e7)),
        link: "",
      };
      setSelectedPlace(fakeSelectedPlace);
      setShowRedMarker(false);
      setSelectedSavedPlaceId(sp.id);
    },
    [],
  );

  const handleMapMarkerClick = useCallback(
    (sp: (typeof savedPlaces)[0]) => {
      if (!sp.places.lat || !sp.places.lng) return;
      const fakeSelectedPlace: SelectedPlace = {
        title: sp.places.name,
        address: sp.places.address ?? "",
        roadAddress: sp.places.address ?? "",
        category: sp.places.naver_category ?? "",
        description: "",
        telephone: "",
        mapx: String(Math.round(sp.places.lng * 1e7)),
        mapy: String(Math.round(sp.places.lat * 1e7)),
        link: "",
      };
      setSelectedPlace(fakeSelectedPlace);
      setShowRedMarker(false);
      setSelectedSavedPlaceId(sp.id);
    },
    [savedPlaces],
  );

  const selectedPlaceCoord =
    selectedPlace?.mapx && selectedPlace?.mapy
      ? {
          lat: parseInt(selectedPlace.mapy) / 1e7,
          lng: parseInt(selectedPlace.mapx) / 1e7,
        }
      : null;

  const nearbySavedPlaces = useMemo(() => {
    if (!currentPosition) return savedPlaces;
    return savedPlaces
      .map((sp) => {
        const { lat, lng } = sp.places;
        if (!lat || !lng) return { ...sp, _dist: Infinity };
        const d = haversineDistance(
          currentPosition.lat,
          currentPosition.lng,
          lat,
          lng,
        );
        return { ...sp, _dist: d };
      })
      .filter((sp) => sp._dist <= 5000)
      .sort((a, b) => a._dist - b._dist);
  }, [savedPlaces, currentPosition]);

  const nearbyCategories = useMemo(() => {
    const seen = new Set<number>();
    const cats: { id: number; name: string; icon: string }[] = [];
    nearbySavedPlaces.forEach((sp) => {
      if (sp.categories && !seen.has(sp.categories.id)) {
        seen.add(sp.categories.id);
        cats.push(sp.categories);
      }
    });
    return cats;
  }, [nearbySavedPlaces]);

  const filteredPlaces = useMemo(() => {
    if (selectedCategoryId === null) return nearbySavedPlaces;
    return nearbySavedPlaces.filter(
      (sp) => sp.category_id === selectedCategoryId,
    );
  }, [nearbySavedPlaces, selectedCategoryId]);

  const sheetContent = selectedPlace ? (
    <PlaceDetail place={selectedPlace} />
  ) : (
    <div className="px-4 pt-2 pb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-text-primary">근처 스팟</h2>
        {/* 카테고리 필터 - 카테고리가 있을 때만 표시 */}
        {nearbyCategories.length > 0 && (
          <CategoryFilterDropdown
            categories={nearbyCategories}
            value={selectedCategoryId}
            onChange={setSelectedCategoryId}
          />
        )}
      </div>
      <div className="flex flex-col gap-2">
        {filteredPlaces.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">
            {currentPosition
              ? "5km 내 저장된 장소가 없어요"
              : "저장된 장소가 없어요"}
          </p>
        ) : (
          filteredPlaces.map((sp) => (
            <button
              key={sp.id}
              onClick={() => handleSavedPlaceClick(sp)}
              className="w-full text-left"
            >
              <PlaceCard
                name={sp.places.name}
                category={sp.categories?.name ?? "기타"}
                address={sp.places.address ?? ""}
                status={sp.visit_status === "visited" ? "visited" : "want"}
                emoji={
                  sp.categories?.icon === "default"
                    ? "📁"
                    : (sp.categories?.icon ?? "📍")
                }
                naverCategory={sp.places.naver_category ?? undefined}
                categoryColor={sp.categories?.color ?? "#FFDCDC"}
              />
            </button>
          ))
        )}
      </div>
    </div>
  );

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      {/* Desktop sidebar - hidden on mobile */}
      <aside className="hidden md:flex md:flex-col w-80 shrink-0 h-full bg-white shadow-[2px_0_24px_rgba(58,46,42,0.08)] z-400 overflow-hidden">
        {selectedPlace && (
          <div className="flex items-center px-4 pt-4 pb-3 shrink-0 border-b border-border">
            <button
              onClick={handleBack}
              className="text-sm text-text-secondary hover:text-text-primary flex items-center gap-1"
            >
              <ArrowBackRounded sx={{ fontSize: 18 }} />
              <span>뒤로</span>
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {sheetContent}
        </div>
      </aside>

      {/* Map area - full width on mobile, remaining on desktop */}
      <div className="flex-1 relative h-full overflow-hidden">
        <MapView
          currentPosition={currentPosition}
          selectedPlaceCoord={selectedPlaceCoord}
          recenterCounter={recenterCounter}
          savedPlaces={savedPlaces}
          showRedMarker={showRedMarker}
          selectedSavedPlaceId={selectedSavedPlaceId}
          onSavedPlaceMarkerClick={handleMapMarkerClick}
        />

        {/* 검색바 */}
        <PlaceSearchBar
          onSelectPlace={handleSelectPlace}
          currentPosition={currentPosition}
          onClear={handleBack}
        />

        {/* 현재 위치 재검색 버튼 (검색바 아래 우측) */}
        <button
          onClick={handleRecenter}
          className="absolute right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-[0_4px_20px_rgba(58,46,42,0.12)] flex items-center justify-center hover:bg-white transition-colors"
          style={{ top: "80px" }}
        >
          <MyLocationRounded sx={{ fontSize: 20, color: "#6B5B56" }} />
        </button>

        {/* 페이지 전환 버튼 */}
        <FloatingNavButton />

        {/* 바텀시트 - mobile only */}
        <div className="md:hidden">
          <BottomSheet onBack={selectedPlace ? handleBack : undefined}>
            {sheetContent}
          </BottomSheet>
        </div>
      </div>
    </main>
  );
}
