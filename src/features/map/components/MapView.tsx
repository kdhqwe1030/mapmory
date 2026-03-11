'use client'

import Script from 'next/script'
import { useState } from 'react'
import { useNaverMap } from '../hooks/useNaverMap'

interface LatLng {
  lat: number
  lng: number
}

interface MapViewProps {
  currentPosition: LatLng | null
  selectedPlaceCoord: LatLng | null
  recenterCounter: number
}

export function MapView({ currentPosition, selectedPlaceCoord, recenterCounter }: MapViewProps) {
  const [isReady, setIsReady] = useState(false)
  const { mapRef } = useNaverMap(isReady, currentPosition, selectedPlaceCoord, recenterCounter)

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
