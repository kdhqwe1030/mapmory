'use client'

import { useRef, useState, useEffect } from 'react'
import SearchRounded from '@mui/icons-material/SearchRounded'
import LocationOnRounded from '@mui/icons-material/LocationOnRounded'

export interface SearchResult {
  title: string
  address: string
  roadAddress: string
  category: string
  description: string
  telephone: string
  mapx: string
  mapy: string
  link: string
}

interface LatLng {
  lat: number
  lng: number
}

interface PlaceSearchBarProps {
  onSelectPlace: (place: SearchResult) => void
  currentPosition: LatLng | null
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, '')
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}

export function PlaceSearchBar({ onSelectPlace, currentPosition }: PlaceSearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastCallRef = useRef(0)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const search = async (q: string) => {
    if (!q.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      const items: SearchResult[] = (data.items ?? []).map((item: Record<string, string>) => ({
        title: stripHtml(item.title ?? ''),
        address: item.address ?? '',
        roadAddress: item.roadAddress ?? '',
        category: item.category ?? '',
        description: item.description ?? '',
        telephone: item.telephone ?? '',
        mapx: item.mapx ?? '',
        mapy: item.mapy ?? '',
        link: item.link ?? '',
      }))
      setResults(items)
      setIsOpen(items.length > 0)
    } catch {
      setResults([])
      setIsOpen(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    if (!val.trim()) {
      setResults([])
      setIsOpen(false)
      if (throttleRef.current) clearTimeout(throttleRef.current)
      return
    }
    const now = Date.now()
    const THROTTLE = 500
    if (now - lastCallRef.current >= THROTTLE) {
      lastCallRef.current = now
      search(val)
    } else {
      if (throttleRef.current) clearTimeout(throttleRef.current)
      throttleRef.current = setTimeout(
        () => {
          lastCallRef.current = Date.now()
          search(val)
        },
        THROTTLE - (now - lastCallRef.current),
      )
    }
  }

  const getDistance = (item: SearchResult): string | null => {
    if (!currentPosition || !item.mapx || !item.mapy) return null
    const lng = parseInt(item.mapx) / 1e7
    const lat = parseInt(item.mapy) / 1e7
    if (isNaN(lat) || isNaN(lng)) return null
    const d = haversineDistance(currentPosition.lat, currentPosition.lng, lat, lng)
    return formatDistance(d)
  }

  return (
    <div ref={wrapperRef} className="absolute top-4 left-4 right-4 z-10">
      <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-4 py-3 shadow-[0_4px_20px_rgba(58,46,42,0.12)]">
        <SearchRounded sx={{ fontSize: 20, color: '#9B8B84', flexShrink: 0 }} />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="장소를 검색해보세요"
          className="flex-1 text-sm text-[#3A2E2A] placeholder:text-[#9B8B84] outline-none bg-transparent"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="mt-2 bg-white rounded-2xl shadow-[0_4px_20px_rgba(58,46,42,0.12)] overflow-hidden">
          {results.map((item, i) => {
            const dist = getDistance(item)
            return (
              <button
                key={i}
                onClick={() => {
                  setQuery(item.title)
                  setIsOpen(false)
                  onSelectPlace(item)
                }}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[#FFF2EB] transition-colors text-left"
              >
                <LocationOnRounded
                  sx={{ fontSize: 18, color: '#9B8B84', flexShrink: 0, mt: '1px' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#3A2E2A] truncate">{item.title}</p>
                  <p className="text-xs text-[#9B8B84] truncate mt-0.5">
                    {item.roadAddress || item.address}
                  </p>
                </div>
                {dist && (
                  <span className="text-xs text-[#C4B4AE] flex-shrink-0 mt-0.5">{dist}</span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
