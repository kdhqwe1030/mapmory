'use client'

import { useEffect, useRef } from 'react'
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM } from '@/src/lib/naver-map'

interface LatLng {
  lat: number
  lng: number
}

export function useNaverMap(
  isReady: boolean,
  currentPosition: LatLng | null,
  selectedPlaceCoord: LatLng | null,
  recenterCounter: number,
) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<naver.maps.Map | null>(null)
  const currentMarker = useRef<naver.maps.Marker | null>(null)
  const selectedMarker = useRef<naver.maps.Marker | null>(null)

  // 지도 초기화
  useEffect(() => {
    if (!isReady || !mapRef.current || mapInstance.current) return
    mapInstance.current = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng),
      zoom: MAP_DEFAULT_ZOOM,
    })
  }, [isReady])

  // 현재 위치 마커
  useEffect(() => {
    if (!mapInstance.current || !currentPosition) return
    const pos = new naver.maps.LatLng(currentPosition.lat, currentPosition.lng)
    if (currentMarker.current) {
      currentMarker.current.setPosition(pos)
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
      })
    }
  }, [currentPosition])

  // 선택된 장소 마커
  useEffect(() => {
    if (!mapInstance.current) return
    if (!selectedPlaceCoord) {
      selectedMarker.current?.setMap(null)
      selectedMarker.current = null
      return
    }
    const pos = new naver.maps.LatLng(selectedPlaceCoord.lat, selectedPlaceCoord.lng)
    if (selectedMarker.current) {
      selectedMarker.current.setPosition(pos)
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
      })
    }
    mapInstance.current.panTo(pos, { duration: 400, easing: 'easeOutCubic' })
  }, [selectedPlaceCoord])

  // 현재 위치로 재이동
  useEffect(() => {
    if (!mapInstance.current || !currentPosition || recenterCounter === 0) return
    const pos = new naver.maps.LatLng(currentPosition.lat, currentPosition.lng)
    mapInstance.current.panTo(pos, { duration: 400, easing: 'easeOutCubic' })
    mapInstance.current.setZoom(MAP_DEFAULT_ZOOM, true)
  }, [recenterCounter])

  return { mapRef }
}
