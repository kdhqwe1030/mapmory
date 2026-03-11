'use client'

import { useState, useEffect, useCallback } from 'react'
import { MapView } from '@/src/features/map/components/MapView'
import { PlaceSearchBar, SearchResult } from '@/src/features/places/components/PlaceSearchBar'
import { PlaceCard } from '@/src/features/places/components/PlaceCard'
import { PlaceDetail, SelectedPlace } from '@/src/features/places/components/PlaceDetail'
import { BottomSheet } from '@/src/components/ui/BottomSheet'
import { FilterDropdown, FilterStatus } from '@/src/components/ui/FilterDropdown'
import MyLocationRounded from '@mui/icons-material/MyLocationRounded'

const MOCK_PLACES = [
  {
    id: '1',
    name: 'Le Petit Café',
    category: 'Café / Dessert',
    address: '123 Romantic Street, Hongdae',
    status: 'want' as const,
    emoji: '☕',
  },
  {
    id: '2',
    name: '한강 노을공원',
    category: 'Park / Outdoor',
    address: '여의도 한강공원, 서울',
    status: 'visited' as const,
    emoji: '🌅',
  },
  {
    id: '3',
    name: 'N서울타워',
    category: 'Landmark / View',
    address: '남산공원길 105, 용산구',
    status: 'want' as const,
    emoji: '🗼',
  },
]

interface LatLng {
  lat: number
  lng: number
}

export default function Home() {
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null)
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(null)
  const [recenterCounter, setRecenterCounter] = useState(0)

  // 현재 위치 얻기
  const fetchCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      },
      () => {},
      { enableHighAccuracy: true },
    )
  }, [])

  useEffect(() => {
    fetchCurrentPosition()
  }, [fetchCurrentPosition])

  const handleSelectPlace = useCallback((place: SearchResult) => {
    setSelectedPlace(place)
  }, [])

  const handleBack = useCallback(() => {
    setSelectedPlace(null)
  }, [])

  const handleRecenter = useCallback(() => {
    fetchCurrentPosition()
    setRecenterCounter((c) => c + 1)
  }, [fetchCurrentPosition])

  const selectedPlaceCoord =
    selectedPlace?.mapx && selectedPlace?.mapy
      ? {
          lat: parseInt(selectedPlace.mapy) / 1e7,
          lng: parseInt(selectedPlace.mapx) / 1e7,
        }
      : null

  const filtered = MOCK_PLACES.filter((p) => {
    if (filter === 'all') return true
    if (filter === 'visited') return p.status === 'visited'
    return p.status === 'want'
  })

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* 지도 */}
      <MapView
        currentPosition={currentPosition}
        selectedPlaceCoord={selectedPlaceCoord}
        recenterCounter={recenterCounter}
      />

      {/* 검색바 */}
      <PlaceSearchBar
        onSelectPlace={handleSelectPlace}
        currentPosition={currentPosition}
      />

      {/* 현재 위치 재검색 버튼 (검색바 아래 우측) */}
      <button
        onClick={handleRecenter}
        className="absolute right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-[0_4px_20px_rgba(58,46,42,0.12)] flex items-center justify-center hover:bg-white transition-colors"
        style={{ top: '80px' }}
      >
        <MyLocationRounded sx={{ fontSize: 20, color: '#6B5B56' }} />
      </button>

      {/* 바텀시트 */}
      <BottomSheet onBack={selectedPlace ? handleBack : undefined}>
        {selectedPlace ? (
          <PlaceDetail place={selectedPlace} />
        ) : (
          <div className="px-4 pt-2 pb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-[#3A2E2A]">근처 스팟</h2>
              <FilterDropdown value={filter} onChange={setFilter} />
            </div>
            <div className="flex flex-col gap-2">
              {filtered.map((place) => (
                <PlaceCard key={place.id} {...place} />
              ))}
            </div>
          </div>
        )}
      </BottomSheet>
    </main>
  )
}
