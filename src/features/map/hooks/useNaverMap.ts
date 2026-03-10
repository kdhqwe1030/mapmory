'use client'

import { useEffect, useRef } from 'react'
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM } from '@/src/lib/naver-map'

export function useNaverMap(isReady: boolean) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<naver.maps.Map | null>(null)

  useEffect(() => {
    if (!isReady || !mapRef.current || mapInstance.current) return

    mapInstance.current = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng),
      zoom: MAP_DEFAULT_ZOOM,
    })
  }, [isReady])

  return { mapRef, mapInstance }
}
