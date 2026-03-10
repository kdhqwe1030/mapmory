'use client'

import { useState } from 'react'
import { MapView } from '@/src/features/map/components/MapView'
import { PlaceSearchBar } from '@/src/features/places/components/PlaceSearchBar'
import { PlaceCard } from '@/src/features/places/components/PlaceCard'
import { BottomSheet } from '@/src/components/ui/BottomSheet'
import { FilterDropdown, FilterStatus } from '@/src/components/ui/FilterDropdown'

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

export default function Home() {
  const [filter, setFilter] = useState<FilterStatus>('all')

  const filtered = MOCK_PLACES.filter((p) => {
    if (filter === 'all') return true
    if (filter === 'visited') return p.status === 'visited'
    return p.status === 'want'
  })

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* 지도 */}
      <MapView />

      {/* 검색바 (지도 위 floating) */}
      <PlaceSearchBar />

      {/* 바텀시트 */}
      <BottomSheet>
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
      </BottomSheet>
    </main>
  )
}
