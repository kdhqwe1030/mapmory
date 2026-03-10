'use client'

import SearchRounded from '@mui/icons-material/SearchRounded'
import TuneRounded from '@mui/icons-material/TuneRounded'

export function PlaceSearchBar() {
  return (
    <div className="absolute top-4 left-4 right-4 z-10">
      <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-4 py-3 shadow-[0_4px_20px_rgba(58,46,42,0.12)]">
        <SearchRounded sx={{ fontSize: 20, color: '#9B8B84', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="장소를 검색해보세요"
          className="flex-1 text-sm text-[#3A2E2A] placeholder:text-[#9B8B84] outline-none bg-transparent"
        />
        <button className="w-8 h-8 rounded-full bg-[#FFDCDC] flex items-center justify-center flex-shrink-0">
          <TuneRounded sx={{ fontSize: 16, color: '#3A2E2A' }} />
        </button>
      </div>
    </div>
  )
}
