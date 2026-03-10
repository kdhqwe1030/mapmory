'use client'

import Script from 'next/script'
import { useState } from 'react'
import { useNaverMap } from '../hooks/useNaverMap'

export function MapView() {
  const [isReady, setIsReady] = useState(false)
  const { mapRef } = useNaverMap(isReady)

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
