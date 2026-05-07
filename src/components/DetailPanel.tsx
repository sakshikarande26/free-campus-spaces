import { MapPin, Users, Clock, Volume2, VolumeX, CalendarCheck, AlertCircle, Flag, LogOut, Sparkles } from 'lucide-react'
import type { StudySpace } from '../types/database'
import type { OccupancyInfo } from '../lib/occupancy'
import SpacePhotoViewer from './SpacePhotoViewer'

interface DetailPanelProps {
  space: StudySpace | null
  occupancyInfo: OccupancyInfo | null
  hasActiveCheckIn?: boolean
  onReportOccupancy: () => void
  onReserve: () => void
  onFlagWrong: () => void
  onCheckOut: () => void
}

const occColors: Record<OccupancyInfo['color'], { dot: string; text: string; bg: string }> = {
  green: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  amber: { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
  red: { dot: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50' },
  gray: { dot: 'bg-slate-300', text: 'text-slate-500', bg: 'bg-slate-50' },
}

export default function DetailPanel({
  space,
  occupancyInfo,
  hasActiveCheckIn = false,
  onReportOccupancy,
  onReserve,
  onFlagWrong,
  onCheckOut,
}: DetailPanelProps) {
  if (!space || !occupancyInfo) {
    return (
      <div className="h-full border-t border-slate-200 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center mb-3">
            <MapPin size={20} className="text-slate-400" />
          </div>
          <div className="text-sm font-medium text-slate-700">Select a space</div>
          <div className="text-xs text-slate-500 mt-0.5">Tap a pin or card to see details</div>
        </div>
      </div>
    )
  }

  const isReservable = space.type === 'reservable'
  const location = [space.building, space.floor].filter(Boolean).join(' · ')
  const openUntil = space.hours?.close ?? '—'
  const occColor = occColors[occupancyInfo.color]

  return (
    <div className="h-full border-t border-slate-200 bg-white overflow-hidden flex flex-col animate-fade-in">
      <SpacePhotoViewer photos={space.photos ?? []} spaceName={space.name} />
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 grid grid-cols-[1fr_auto] gap-6 items-start">
      <div className="min-w-0 overflow-hidden">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2 className="font-display text-[20px] font-bold text-slate-900 leading-tight">
            {space.name}
          </h2>
          {isReservable ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#881c1c] bg-[#fdf3f3] rounded-full px-2 py-0.5 border border-[#f3d9d9]">
              <CalendarCheck size={10} strokeWidth={2.5} />
              Reservable
            </span>
          ) : (
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${occColor.text} ${occColor.bg} rounded-full px-2 py-0.5`}>
              <span className={`w-1.5 h-1.5 rounded-full ${occColor.dot}`} />
              Live · {occupancyInfo.label}
            </span>
          )}
        </div>
        {location && (
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <MapPin size={11} strokeWidth={2.2} />
            {location}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {space.noise_level && (
            <span className="inline-flex items-center gap-1 text-[11px] rounded-full px-2 py-1 bg-slate-100 text-slate-700 capitalize">
              {space.noise_level === 'quiet' ? <VolumeX size={11} strokeWidth={2.2} /> : <Volume2 size={11} strokeWidth={2.2} />}
              {space.noise_level}
            </span>
          )}
          {space.amenities?.map((a) => (
            <span
              key={a}
              className="text-[11px] rounded-full px-2 py-1 bg-slate-100 text-slate-700 capitalize"
            >
              {a}
            </span>
          ))}
        </div>

        <div
          className={`mt-3 rounded-xl px-3.5 py-2.5 text-xs leading-relaxed border flex gap-2.5 items-start ${
            isReservable
              ? 'bg-[#fdf3f3] border-[#f3d9d9] text-[#6e1616]'
              : 'bg-emerald-50 border-emerald-100 text-emerald-900'
          }`}
        >
          <Sparkles size={14} strokeWidth={2.2} className="shrink-0 mt-0.5" />
          <span>
            {isReservable
              ? 'Reservable room — claim a time slot and it stays held exclusively for you.'
              : 'Open common space — walk in and sit anywhere. Occupancy is crowd-sourced from recent reports.'}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-2.5 w-[240px]">
        <div className="grid grid-cols-3 gap-2">
          <StatCard icon={<Users size={11} />} label="Capacity" value={String(space.capacity)} />
          <StatCard icon={<Sparkles size={11} />} label="Now" value={isReservable ? '—' : occupancyInfo.label.replace('Nearly ', '')} />
          <StatCard icon={<Clock size={11} />} label="Until" value={openUntil} />
        </div>

        <button
          type="button"
          onClick={isReservable ? onReserve : onReportOccupancy}
          className="group w-full bg-[#881c1c] text-white font-semibold rounded-xl py-2.5 text-sm hover:bg-[#6e1616] transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          {isReservable ? (
            <>
              <CalendarCheck size={15} strokeWidth={2.4} />
              Reserve a slot
            </>
          ) : (
            <>
              <AlertCircle size={15} strokeWidth={2.4} />
              Report occupancy
            </>
          )}
        </button>

        {!isReservable && hasActiveCheckIn && (
          <button
            type="button"
            onClick={onCheckOut}
            className="w-full bg-white text-[#881c1c] border border-[#881c1c]/40 font-semibold rounded-xl py-2.5 text-sm hover:bg-[#fdf3f3] transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={14} strokeWidth={2.4} />
            Check out
          </button>
        )}

        <div className="flex items-center justify-between text-[11px] mt-0.5">
          <span className="text-slate-500">{occupancyInfo.sublabel}</span>
          <button
            type="button"
            onClick={onFlagWrong}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Flag size={10} strokeWidth={2.4} />
            Flag
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 px-2 py-2 bg-gradient-to-b from-slate-50 to-white">
      <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-500">
        {icon}
        {label}
      </div>
      <div className="text-[13px] font-bold text-slate-900 mt-0.5 truncate">{value}</div>
    </div>
  )
}
