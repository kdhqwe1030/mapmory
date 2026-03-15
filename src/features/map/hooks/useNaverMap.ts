"use client";

import { useEffect, useRef } from "react";
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM } from "@/src/lib/naver-map";
import type { SavedPlaceRecord } from "@/src/features/places/hooks/useSavedPlaces";

interface LatLng {
  lat: number;
  lng: number;
}

export function useNaverMap(
  isReady: boolean,
  currentPosition: LatLng | null,
  selectedPlaceCoord: LatLng | null,
  recenterCounter: number,
  savedPlaces: SavedPlaceRecord[],
  showRedMarker: boolean,
  selectedSavedPlaceId: number | null,
  onSavedPlaceMarkerClick: (sp: SavedPlaceRecord) => void,
) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<naver.maps.Map | null>(null);
  const currentMarker = useRef<naver.maps.Marker | null>(null);
  const selectedMarker = useRef<naver.maps.Marker | null>(null);
  const savedMarkersRef = useRef<naver.maps.Marker[]>([]);

  // 지도 초기화
  useEffect(() => {
    if (!isReady || !mapRef.current || mapInstance.current) return;
    mapInstance.current = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(
        MAP_DEFAULT_CENTER.lat,
        MAP_DEFAULT_CENTER.lng,
      ),
      zoom: MAP_DEFAULT_ZOOM,
    });
  }, [isReady]);

  // 현재 위치 마커
  useEffect(() => {
    if (!mapInstance.current || !currentPosition) return;
    const pos = new naver.maps.LatLng(currentPosition.lat, currentPosition.lng);
    if (currentMarker.current) {
      currentMarker.current.setPosition(pos);
    } else {
      currentMarker.current = new naver.maps.Marker({
        position: pos,
        map: mapInstance.current,
        icon: {
          content: `
            <div style="
              width:16px;height:16px;
              background:#4285F4;
              border:3px solid #fff;
              border-radius:50%;
              box-shadow:0 2px 8px rgba(66,133,244,0.5);
            "></div>`,
          anchor: new naver.maps.Point(8, 8),
        },
        zIndex: 10,
      });
    }
  }, [currentPosition]);

  // 선택된 장소로 지도 이동 (showRedMarker 여부와 무관)
  useEffect(() => {
    if (!mapInstance.current || !selectedPlaceCoord) return;
    const pos = new naver.maps.LatLng(
      selectedPlaceCoord.lat,
      selectedPlaceCoord.lng,
    );
    mapInstance.current.panTo(pos, { duration: 400, easing: "easeOutCubic" });
  }, [selectedPlaceCoord]);

  // 선택된 장소 빨간 마커 (검색 결과이고 저장되지 않은 경우만)
  useEffect(() => {
    if (!mapInstance.current) return;
    if (!selectedPlaceCoord || !showRedMarker) {
      selectedMarker.current?.setMap(null);
      selectedMarker.current = null;
      return;
    }
    const pos = new naver.maps.LatLng(
      selectedPlaceCoord.lat,
      selectedPlaceCoord.lng,
    );
    if (selectedMarker.current) {
      selectedMarker.current.setPosition(pos);
    } else {
      selectedMarker.current = new naver.maps.Marker({
        position: pos,
        map: mapInstance.current,
        icon: {
          content: `
            <div style="
              width:28px;height:28px;
              background:#FF6B6B;
              border:3px solid #fff;
              border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);
              box-shadow:0 3px 10px rgba(255,107,107,0.4);
            "></div>`,
          anchor: new naver.maps.Point(14, 28),
        },
        zIndex: 20,
      });
    }
  }, [selectedPlaceCoord, showRedMarker]);

  // 현재 위치로 재이동
  useEffect(() => {
    if (!mapInstance.current || !currentPosition || recenterCounter === 0)
      return;
    const pos = new naver.maps.LatLng(currentPosition.lat, currentPosition.lng);
    mapInstance.current.panTo(pos, { duration: 400, easing: "easeOutCubic" });
    mapInstance.current.setZoom(MAP_DEFAULT_ZOOM, true);
  }, [recenterCounter]);

  // 저장된 장소 마커
  useEffect(() => {
    if (!mapInstance.current) return;
    // Clear existing saved markers
    savedMarkersRef.current.forEach((m) => m.setMap(null));
    savedMarkersRef.current = [];
    // Create new markers
    savedPlaces.forEach((sp) => {
      const { lat, lng, name } = sp.places;
      if (!lat || !lng) return;
      const icon = sp.categories?.icon ?? "📍";
      const color = sp.categories?.color ?? "#FFDCDC";
      const pos = new naver.maps.LatLng(lat, lng);
      const isSelected = sp.id === selectedSavedPlaceId;
      const size = isSelected ? 29 : 26;
      const border = isSelected ? "3px solid #fff" : "2px solid #fff";
      const iconLabel = icon === "default" ? "📁" : icon;
      const innerDiv = `<div style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;background:${color};border:${border};border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.15);"><span style="transform:rotate(45deg);font-size:12px;line-height:1;">${iconLabel}</span></div>`;
      const innerContent = isSelected
        ? `<style>@keyframes selPulse{0%,100%{transform:scale(1);}50%{transform:scale(1.2);}}</style><div style="animation:selPulse 2s ease-in-out infinite;">${innerDiv}</div>`
        : innerDiv;;
      const marker = new naver.maps.Marker({
        position: pos,
        map: mapInstance.current!,
        icon: {
          content: innerContent,
          anchor: new naver.maps.Point(Math.round(size / 2), size),
        },
        title: name,
        zIndex: isSelected ? 16 : 15,
      });
      naver.maps.Event.addListener(marker, "click", () => {
        onSavedPlaceMarkerClick(sp);
      });
      savedMarkersRef.current.push(marker);
    });
  }, [savedPlaces, isReady, selectedSavedPlaceId, onSavedPlaceMarkerClick]);

  return { mapRef };
}
