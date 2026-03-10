type Status = 'want' | 'visited'

interface PlaceCardProps {
  name: string
  category: string
  address: string
  status: Status
  emoji?: string
}

const statusDot: Record<Status, string> = {
  visited: 'bg-[#4CAF82]',
  want: 'bg-[#FFDCDC]',
}

export function PlaceCard({ name, category, address, status, emoji = '🗺️' }: PlaceCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white shadow-sm">
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl bg-[#FFF2EB] flex-shrink-0 flex items-center justify-center text-2xl">
        {emoji}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#3A2E2A] text-sm truncate flex items-center gap-1.5">
          {name}
          <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${statusDot[status]}`} />
        </p>
        <p className="text-xs text-[#6B5B56] mt-0.5">{category}</p>
        <p className="text-xs text-[#9B8B84] truncate mt-0.5">{address}</p>
      </div>
    </div>
  )
}
