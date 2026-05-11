import { MapPin, Users, CalendarCheck, Volume2, VolumeX, Star } from 'lucide-react'
import type { StudySpace } from '../types/database'
import type { OccupancyInfo } from '../lib/occupancy'

interface SpaceCardProps {
  space: StudySpace
  occupancyInfo: OccupancyInfo
  isSelected: boolean
  hasActiveReservation: boolean
  isFavorite?: boolean
  onClick: () => void
  onToggleFavorite?: () => void
}

const barColors: Record<OccupancyInfo['color'], string> = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-rose-500',
  gray: 'bg-slate-300',
}

const dotColors: Record<OccupancyInfo['color'], string> = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-rose-500',
  gray: 'bg-slate-300',
}

const labelColors: Record<OccupancyInfo['color'], string> = {
  green: 'text-emerald-700',
  amber: 'text-amber-700',
  red: 'text-rose-700',
  gray: 'text-slate-500',
}

export default function SpaceCard({
  space,
  occupancyInfo,
  isSelected,
  hasActiveReservation,
  isFavorite = false,
  onClick,
  onToggleFavorite,
}: SpaceCardProps) {
  const isReservable = space.type === 'reservable'
  const location = [space.building, space.floor].filter(Boolean).join(' · ')

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`group w-full text-left bg-white rounded-xl px-3.5 py-3 mb-2 relative transition-all duration-300 ease-out border cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#881c1c]/30 ${
        isSelected
          ? 'border-[#881c1c] shadow-[0_4px_12px_rgba(136,28,28,0.12)] ring-1 ring-[#881c1c]/10'
          : 'border-slate-200/70 hover:border-slate-300 hover:shadow-lg hover:-translate-y-1'
      }`}
    >
      <div className="absolute top-2 right-2 flex items-center gap-1.5">
        {hasActiveReservation && (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-[#881c1c] text-white rounded-full px-2 py-0.5 shadow-sm">
            <CalendarCheck size={10} strokeWidth={2.5} />
            Booked
          </span>
        )}
        {onToggleFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite()
            }}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`inline-flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
              isFavorite
                ? 'text-amber-500 hover:bg-amber-50'
                : 'text-slate-300 hover:text-amber-500 hover:bg-slate-50'
            }`}
          >
            <Star
              size={14}
              strokeWidth={2.2}
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button>
        )}
      </div>

      <div className="flex items-start gap-2.5">
        <div
          className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
            isReservable
              ? 'bg-[#fdf3f3] text-[#881c1c] group-hover:bg-[#f7e0e0]'
              : 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100'
          }`}
        >
          {isReservable ? <CalendarCheck size={16} strokeWidth={2.2} /> : <MapPin size={16} strokeWidth={2.2} />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[13.5px] font-semibold text-slate-900 leading-tight truncate pr-20">
            {space.name}
          </div>
          {location && (
            <div className="text-[11px] text-slate-500 mt-0.5 truncate flex items-center gap-1">
              {location}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {isReservable ? (
            <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#881c1c] bg-[#fdf3f3] rounded-md px-1.5 py-0.5">
              Reservable
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${dotColors[occupancyInfo.color]}`} />
              <span className={`text-[11px] font-medium ${labelColors[occupancyInfo.color]}`}>
                {occupancyInfo.label}
                {occupancyInfo.percentage !== null && ` · ${occupancyInfo.percentage}%`}
              </span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[10.5px] text-slate-400 shrink-0">
          <span className="inline-flex items-center gap-0.5">
            <Users size={10} strokeWidth={2.2} />
            {space.capacity}
          </span>
          {space.noise_level && (
            <span
              className="inline-flex items-center"
              title={
                space.noise_level === 'quiet'
                  ? 'Quiet study space'
                  : 'Collaborative study space'
          }
      >
              {space.noise_level === 'quiet' ? <VolumeX size={10} strokeWidth={2.2} /> : <Volume2 size={10} strokeWidth={2.2} />}
            </span>
          )}
        </div>
      </div>

      {!isReservable && occupancyInfo.percentage !== null && (
        <div className="mt-2.5 h-1 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full ${barColors[occupancyInfo.color]} transition-all duration-700 ease-out`}
            style={{ width: `${occupancyInfo.percentage}%` }}
          />
        </div>
      )}
    </div>
  )
}
