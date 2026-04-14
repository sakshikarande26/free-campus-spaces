import type { StudySpace } from '../types/database'
import type { OccupancyInfo } from '../lib/occupancy'

interface DetailPanelProps {
  space: StudySpace | null
  occupancyInfo: OccupancyInfo | null
  onReportOccupancy: () => void
  onReserve: () => void
}

export default function DetailPanel({
  space,
  occupancyInfo,
  onReportOccupancy,
  onReserve,
}: DetailPanelProps) {
  if (!space || !occupancyInfo) {
    return (
      <div className="h-full border-t border-gray-200 bg-white px-6 flex items-center justify-center text-sm text-gray-500">
        Tap a pin or space to see details
      </div>
    )
  }

  const isReservable = space.type === 'reservable'
  const location = [space.building, space.floor].filter(Boolean).join(' · ')
  const openUntil = space.hours?.close ?? '—'
  const rightNow = isReservable ? '—' : occupancyInfo.label

  return (
    <div className="h-full border-t border-gray-200 bg-white px-6 py-4 overflow-hidden grid grid-cols-[1fr_auto] gap-6 items-start">
      <div className="min-w-0 overflow-hidden">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-[17px] font-semibold text-gray-900 leading-tight">
            {space.name}
          </h2>
          <span
            className={`text-[10px] font-semibold uppercase tracking-wide ${
              isReservable ? 'text-[#881c1c]' : 'text-emerald-700'
            }`}
          >
            {isReservable ? 'Reservable' : 'Free space'}
          </span>
        </div>
        {location && (
          <div className="text-xs text-gray-500 mt-0.5">{location}</div>
        )}

        <div className="flex flex-wrap gap-1.5 mt-2">
          {space.noise_level && (
            <span className="text-[11px] rounded-full px-2 py-0.5 border border-gray-200 text-gray-700 capitalize">
              {space.noise_level}
            </span>
          )}
          {space.amenities?.map((a) => (
            <span
              key={a}
              className="text-[11px] rounded-full px-2 py-0.5 border border-gray-200 text-gray-700 capitalize"
            >
              {a}
            </span>
          ))}
        </div>

        <div
          className={`mt-3 rounded-md px-3 py-2 text-xs leading-relaxed border ${
            isReservable
              ? 'bg-[#fdf3f3] border-[#f3d9d9] text-[#6e1616]'
              : 'bg-emerald-50 border-emerald-100 text-emerald-900'
          }`}
        >
          {isReservable
            ? 'Reservable room — claim a time slot and it is held exclusively for you.'
            : 'Open common space — walk in and sit anywhere. Occupancy is crowd-sourced from recent student reports.'}
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-2 w-[220px]">
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="Capacity" value={String(space.capacity)} />
          <StatCard label="Now" value={rightNow} />
          <StatCard label="Until" value={openUntil} />
        </div>

        <button
          type="button"
          onClick={isReservable ? onReserve : onReportOccupancy}
          className="w-full bg-[#881c1c] text-white font-medium rounded-md py-2 text-sm hover:bg-[#6e1616] transition-colors"
        >
          {isReservable ? 'Reserve a slot' : 'Report current occupancy'}
        </button>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-gray-500">{occupancyInfo.sublabel}</span>
          <button
            type="button"
            onClick={onReportOccupancy}
            className="text-gray-500 hover:text-gray-900 hover:underline transition-colors"
          >
            This looks wrong
          </button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-gray-200 px-2 py-1.5 bg-gray-50">
      <div className="text-[9px] font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="text-xs font-semibold text-gray-900 mt-0.5 truncate">{value}</div>
    </div>
  )
}
