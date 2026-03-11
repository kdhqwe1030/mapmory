'use client'

import { useState, useEffect } from 'react'
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded'
import PhoneRounded from '@mui/icons-material/PhoneRounded'
import LocationOnRounded from '@mui/icons-material/LocationOnRounded'

export interface SelectedPlace {
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

interface PlaceDetailProps {
  place: SelectedPlace
}

export function PlaceDetail({ place }: PlaceDetailProps) {
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    const lastCategory = place.category ? (place.category.split('>').pop()?.trim() ?? '') : ''
    const q = lastCategory ? `${place.title} ${lastCategory}` : place.title
    fetch(`/api/images?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => {
        const urls: string[] = (data.items ?? [])
          .map((item: Record<string, string>) => item.link ?? '')
          .filter(Boolean)
        setImages(urls)
      })
      .catch(() => {})
  }, [place.title, place.category])

  return (
    <div className="px-4 pt-3 pb-8">
      {/* 헤더 */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#3A2E2A] leading-tight">{place.title}</h2>
        {place.category && (
          <p className="text-xs text-[#9B8B84] mt-1">{place.category}</p>
        )}
      </div>

      {/* 사진 가로 스크롤 */}
      {images.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide">
          {images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt=""
              className="w-[120px] h-[120px] rounded-xl object-cover flex-shrink-0"
              onError={(e) => {
                ;(e.target as HTMLImageElement).parentElement?.removeChild(
                  e.target as HTMLImageElement,
                )
              }}
            />
          ))}
        </div>
      ) : (
        <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-[#FFF2EB] to-[#FFDCDC] flex items-center justify-center mb-4">
          <span className="text-4xl">🗺️</span>
        </div>
      )}

      {/* 정보 목록 */}
      <div className="flex flex-col gap-3">
        {(place.roadAddress || place.address) && (
          <div className="flex items-start gap-2.5">
            <LocationOnRounded sx={{ fontSize: 16, color: '#9B8B84', flexShrink: 0, mt: '1px' }} />
            <p className="text-sm text-[#6B5B56] leading-snug">
              {place.roadAddress || place.address}
            </p>
          </div>
        )}
        {place.telephone && (
          <div className="flex items-center gap-2.5">
            <PhoneRounded sx={{ fontSize: 16, color: '#9B8B84', flexShrink: 0 }} />
            <p className="text-sm text-[#6B5B56]">{place.telephone}</p>
          </div>
        )}
        {place.link && (
          <div className="flex items-center gap-2.5">
            <OpenInNewRounded sx={{ fontSize: 16, color: '#9B8B84', flexShrink: 0 }} />
            <a
              href={place.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#6B5B56] hover:text-[#3A2E2A] underline underline-offset-2 transition-colors truncate"
            >
              {place.link}
            </a>
          </div>
        )}
        {place.description && (
          <p className="text-sm text-[#9B8B84] leading-relaxed mt-1">{place.description}</p>
        )}
      </div>
    </div>
  )
}
