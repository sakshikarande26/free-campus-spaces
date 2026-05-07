import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Tag,
  CalendarCheck,
  ArrowLeft,
  Settings,
  LogOut,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  History,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useSpaces } from '../hooks/useSpaces'
import { useReservations } from '../hooks/useReservations'
import { cancelReservation, createReservation } from '../lib/reservations'
import type { Reservation } from '../types/database'

const REASON_OPTIONS: Array<Exclude<Reservation['reason_category'], null>> = [
  'study',
  'group_project',
  'interview',
  'event',
  'other',
]

export default function ReservationsPage() {
  const { user, signOut } = useAuth()
  const { spaces } = useSpaces()
  const { reservations, loading, refetch } = useReservations(user?.id)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const preselectedSpaceId = searchParams.get('space')
  const reservableSpaces = useMemo(
    () => spaces.filter((s) => s.type === 'reservable'),
    [spaces]
  )

  const [spaceId, setSpaceId] = useState(preselectedSpaceId ?? '')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [durationHours, setDurationHours] = useState(1)
  const [headcount, setHeadcount] = useState(1)
  const [reason, setReason] = useState<Reservation['reason_category']>('study')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; msg: string } | null>(null)

  const upcoming = reservations.filter((r) => r.status === 'active')
  const history = reservations.filter((r) => r.status !== 'active')

  async function handleReserve(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !spaceId || !date || !startTime) return

    const slotStart = new Date(`${date}T${startTime}`)
    const slotEnd = new Date(slotStart.getTime() + durationHours * 60 * 60 * 1000)

    setSubmitting(true)
    const { error } = await createReservation({
      userId: user.id,
      spaceId,
      slotStart: slotStart.toISOString(),
      slotEnd: slotEnd.toISOString(),
      headcount,
      reasonCategory: reason,
    })
    setSubmitting(false)

    if (error) {
      setFeedback({ kind: 'error', msg: error })
      return
    }

    await refetch()
    setFeedback({ kind: 'success', msg: 'Reservation confirmed.' })
    setDate('')
    setStartTime('')
    setHeadcount(1)
  }

  async function handleCancel(reservationId: string) {
    const { error } = await cancelReservation(reservationId)
    if (error) {
      setFeedback({ kind: 'error', msg: error })
    } else {
      await refetch()
      setFeedback({ kind: 'success', msg: 'Reservation released.' })
    }
  }

  const userInitial = user?.email?.[0]?.toUpperCase() ?? 'U'

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
              title="Back to map"
            >
              <ArrowLeft size={16} strokeWidth={2.4} />
            </button>
            <div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-semibold">UMass Amherst</div>
              <h1 className="font-display text-[18px] font-bold text-slate-900 leading-tight">Reservations</h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {user?.role === 'admin' && (
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="inline-flex items-center gap-1.5 hover:bg-slate-100 text-slate-700 rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
              >
                <Settings size={14} strokeWidth={2.4} />
                Admin
              </button>
            )}
            <div className="w-px h-6 bg-slate-200 mx-1" />
            <div className="flex items-center gap-2 pl-1 pr-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#881c1c] to-[#5f0f15] text-white text-xs font-bold flex items-center justify-center shadow-sm">
                {userInitial}
              </div>
              <button
                type="button"
                onClick={signOut}
                className="text-[11px] text-slate-600 hover:text-[#881c1c] inline-flex items-center gap-1 transition-colors"
              >
                <LogOut size={11} strokeWidth={2.4} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 grid gap-6 lg:grid-cols-[400px_1fr]">
        {/* Booking form */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#fdf3f3] text-[#881c1c] flex items-center justify-center shrink-0">
              <CalendarCheck size={18} strokeWidth={2.4} />
            </div>
            <div>
              <h2 className="font-display text-[17px] font-bold text-slate-900 leading-tight">Book a room</h2>
              <p className="text-[12.5px] text-slate-500 mt-0.5">Reserve a slot — held exclusively for you.</p>
            </div>
          </div>

          <form onSubmit={handleReserve} className="space-y-3.5">
            <Field icon={<MapPin size={13} />} label="Space">
              <select
                value={spaceId}
                onChange={(e) => setSpaceId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#881c1c]/20 focus:border-[#881c1c] transition-all"
              >
                <option value="">Select reservable space</option>
                {reservableSpaces.map((space) => (
                  <option key={space.id} value={space.id}>
                    {space.name} · {space.building}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field icon={<Calendar size={13} />} label="Date">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#881c1c]/20 focus:border-[#881c1c] transition-all"
                />
              </Field>
              <Field icon={<Clock size={13} />} label="Start time">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#881c1c]/20 focus:border-[#881c1c] transition-all"
                />
              </Field>
            </div>

            <Field icon={<Clock size={13} />} label="Duration">
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setDurationHours(h)}
                    className={`text-xs font-semibold rounded-lg py-2 border transition-all ${
                      durationHours === h
                        ? 'bg-[#881c1c] text-white border-[#881c1c] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field icon={<Users size={13} />} label="Headcount">
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={headcount}
                  onChange={(e) => setHeadcount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#881c1c]/20 focus:border-[#881c1c] transition-all"
                />
              </Field>
              <Field icon={<Tag size={13} />} label="Reason">
                <select
                  value={reason ?? 'study'}
                  onChange={(e) => setReason(e.target.value as Reservation['reason_category'])}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-[#881c1c]/20 focus:border-[#881c1c] transition-all"
                >
                  {REASON_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {feedback && (
              <div
                className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm animate-fade-in ${
                  feedback.kind === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {feedback.kind === 'success' ? (
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                )}
                <span>{feedback.msg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="group w-full bg-[#881c1c] text-white font-semibold rounded-xl py-3 text-sm hover:bg-[#6e1616] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <CalendarCheck size={15} strokeWidth={2.4} />
                  Reserve slot
                </>
              )}
            </button>
          </form>
        </section>

        <section className="space-y-5">
          {/* Upcoming */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#fdf3f3] text-[#881c1c] flex items-center justify-center">
                  <Sparkles size={16} strokeWidth={2.4} />
                </div>
                <div>
                  <h2 className="font-display text-[16px] font-bold text-slate-900 leading-tight">Upcoming</h2>
                  <p className="text-[11.5px] text-slate-500">Active reservations held for you</p>
                </div>
              </div>
              {upcoming.length > 0 && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 rounded-full px-2 py-0.5">
                  {upcoming.length}
                </span>
              )}
            </div>

            {loading && (
              <div className="rounded-xl bg-slate-50 px-4 py-6 text-center">
                <Loader2 size={18} className="animate-spin text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Loading reservations...</p>
              </div>
            )}
            {!loading && upcoming.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/40 px-4 py-8 text-center">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 mx-auto flex items-center justify-center mb-2">
                  <CalendarCheck size={16} className="text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-700">No active reservations</p>
                <p className="text-xs text-slate-500 mt-0.5">Pick a space and book your first slot.</p>
              </div>
            )}
            <div className="space-y-2.5">
              {upcoming.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  spaceName={spaces.find((s) => s.id === reservation.space_id)?.name ?? 'Unknown space'}
                  spaceLocation={(() => {
                    const sp = spaces.find((s) => s.id === reservation.space_id)
                    return [sp?.building, sp?.floor].filter(Boolean).join(' · ')
                  })()}
                  onCancel={() => handleCancel(reservation.id)}
                />
              ))}
            </div>
          </div>

          {/* History */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <History size={16} strokeWidth={2.4} />
              </div>
              <div>
                <h2 className="font-display text-[16px] font-bold text-slate-900 leading-tight">History</h2>
                <p className="text-[11.5px] text-slate-500">Past and released reservations</p>
              </div>
            </div>

            {history.length === 0 ? (
              <p className="text-sm text-slate-500 px-1 py-2">No historical reservations.</p>
            ) : (
              <div className="space-y-2">
                {history.slice(0, 8).map((reservation) => {
                  const sp = spaces.find((s) => s.id === reservation.space_id)
                  const start = new Date(reservation.slot_start)
                  const statusColor =
                    reservation.status === 'released' ? 'text-amber-700 bg-amber-50' :
                    reservation.status === 'expired' ? 'text-slate-600 bg-slate-100' :
                    'text-slate-600 bg-slate-100'
                  return (
                    <div
                      key={reservation.id}
                      className="rounded-xl border border-slate-200 px-3.5 py-2.5 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-slate-800 truncate">
                          {sp?.name ?? 'Unknown space'}
                        </div>
                        <div className="text-[11.5px] text-slate-500 mt-0.5">
                          {start.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} ·{' '}
                          {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 capitalize ${statusColor}`}>
                        {reservation.status}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
            <div className="mt-4 text-xs text-slate-500 flex items-center gap-1">
              Need quick space context?
              <Link to="/" className="text-[#881c1c] font-semibold hover:underline">
                Back to map →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600 flex items-center gap-1.5">
        {icon && <span className="text-slate-500">{icon}</span>}
        {label}
      </div>
      {children}
    </label>
  )
}

function ReservationCard({
  reservation,
  spaceName,
  spaceLocation,
  onCancel,
}: {
  reservation: Reservation
  spaceName: string
  spaceLocation: string
  onCancel: () => void
}) {
  const start = new Date(reservation.slot_start)
  const end = new Date(reservation.slot_end)
  const durationMs = end.getTime() - start.getTime()
  const durationHrs = Math.round(durationMs / 3600000)

  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/40 p-3.5 hover:border-[#881c1c]/30 hover:shadow-sm transition-all">
      <div className="flex items-start gap-3">
        {/* Date block */}
        <div className="w-12 h-14 rounded-xl bg-[#fdf3f3] text-[#881c1c] flex flex-col items-center justify-center shrink-0 border border-[#f3d9d9]">
          <div className="text-[9px] font-bold uppercase leading-none">
            {start.toLocaleDateString([], { month: 'short' })}
          </div>
          <div className="text-[18px] font-bold leading-none mt-1">
            {start.getDate()}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="font-display text-[14.5px] font-bold text-slate-900 truncate">{spaceName}</div>
              {spaceLocation && (
                <div className="text-[11.5px] text-slate-500 mt-0.5 flex items-center gap-1">
                  <MapPin size={10} strokeWidth={2.4} />
                  {spaceLocation}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white text-rose-700 px-2 py-1 text-[10.5px] font-semibold hover:bg-rose-50 transition-colors shrink-0"
            >
              <X size={11} strokeWidth={2.6} />
              Cancel
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] rounded-md bg-slate-100 text-slate-700 px-1.5 py-0.5">
              <Clock size={10} strokeWidth={2.4} />
              {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {' – '}
              {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] rounded-md bg-slate-100 text-slate-700 px-1.5 py-0.5">
              {durationHrs}h
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] rounded-md bg-slate-100 text-slate-700 px-1.5 py-0.5">
              <Users size={10} strokeWidth={2.4} />
              {reservation.headcount ?? 1}
            </span>
            {reservation.reason_category && (
              <span className="inline-flex items-center gap-1 text-[11px] rounded-md bg-[#fdf3f3] text-[#881c1c] px-1.5 py-0.5 capitalize">
                <Tag size={10} strokeWidth={2.4} />
                {reservation.reason_category.replace('_', ' ')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
