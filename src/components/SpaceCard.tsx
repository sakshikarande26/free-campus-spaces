import type { StudySpace } from '../types/database'
import type { OccupancyInfo } from '../lib/occupancy'

interface SpaceCardProps {
  space: StudySpace
  occupancyInfo: OccupancyInfo
  isSelected: boolean
  hasActiveReservation: boolean
  onClick: () => void
}

const barColors: Record<OccupancyInfo['color'], string> = {
  green: 'bg-emerald-600',
  amber: 'bg-amber-500',
  red: 'bg-rose-600',
  gray: 'bg-gray-300',
}

const pillColors: Record<OccupancyInfo['color'], string> = {
  green: 'text-emerald-700',
  amber: 'text-amber-700',
  red: 'text-rose-700',
  gray: 'text-gray-500',
}

export default function SpaceCard({
  space,
  occupancyInfo,
  isSelected,
  hasActiveReservation,
  onClick,
}: SpaceCardProps) {
  const isReservable = space.type === 'reservable'
  const location = [space.building, space.floor].filter(Boolean).join(' · ')

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left bg-white px-3 py-3 relative transition-colors border-b border-gray-100 hover:bg-gray-50 ${
        isSelected
          ? 'border-l-[3px] border-l-[#881c1c] bg-[#fff8f8] pl-[calc(0.75rem-3px)]'
          : ''
      }`}
    >
      {hasActiveReservation && (
        <span className="absolute top-2 right-2 text-[9px] font-semibold uppercase tracking-wide bg-[#881c1c] text-white rounded-full px-2 py-0.5">
          Reserved
        </span>
      )}

      <div className="text-[13px] font-semibold text-gray-900 leading-tight">
        {space.name}
      </div>
      {location && (
        <div className="text-[11px] text-gray-500 mt-0.5">{location}</div>
      )}

      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <span
          className={`text-[10px] font-semibold uppercase tracking-wide ${
            isReservable ? 'text-[#881c1c]' : 'text-emerald-700'
          }`}
        >
          {isReservable ? 'Reservable' : 'Free space'}
        </span>
        <span className="text-[10px] text-gray-300">·</span>
        {isReservable ? (
          <span className="text-[11px] text-gray-500">Book a slot</span>
        ) : (
          <span className={`text-[11px] ${pillColors[occupancyInfo.color]}`}>
            {occupancyInfo.label}
          </span>
        )}
      </div>

      {!isReservable && occupancyInfo.percentage !== null && (
        <div className="mt-2 h-[3px] rounded-full bg-gray-200 overflow-hidden">
          <div
            className={`h-full ${barColors[occupancyInfo.color]}`}
            style={{ width: `${occupancyInfo.percentage}%` }}
          />
        </div>
      )}
    </button>
  )
}
