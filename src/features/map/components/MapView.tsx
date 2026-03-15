'use client'

import Script from 'next/script'
import { useState, useEffect } from 'react'
import { useNaverMap } from '../hooks/useNaverMap'
import type { SavedPlaceRecord } from '@/src/features/places/hooks/useSavedPlaces'

interface LatLng {
  lat: number
  lng: number
}

interface MapViewProps {
  currentPosition: LatLng | null
  selectedPlaceCoord: LatLng | null
  recenterCounter: number
  savedPlaces: SavedPlaceRecord[]
  showRedMarker: boolean
  selectedSavedPlaceId: number | null
  onSavedPlaceMarkerClick: (sp: SavedPlaceRecord) => void
}

export function MapView({ currentPosition, selectedPlaceCoord, recenterCounter, savedPlaces, showRedMarker, selectedSavedPlaceId, onSavedPlaceMarkerClick }: MapViewProps) {
  const [isReady, setIsReady] = useState(false)

  // 페이지 복귀 시 스크립트가 이미 로드된 경우 즉시 ready 처리
  useEffect(() => {
    if (typeof window !== 'undefined' && window.naver?.maps) {
      setIsReady(true)
    }
  }, [])

  const { mapRef } = useNaverMap(isReady, currentPosition, selectedPlaceCoord, recenterCounter, savedPlaces, showRedMarker, selectedSavedPlaceId, onSavedPlaceMarkerClick)

  return (
    <>
      <Script
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NCP_MAP_CLIENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => setIsReady(true)}
      />
      <div ref={mapRef} className="w-full h-full" />
    </>
  )
}
