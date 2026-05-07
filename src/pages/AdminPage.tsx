import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useSpaces } from '../hooks/useSpaces'
import { useReservations } from '../hooks/useReservations'

export default function AdminPage() {
  const { user, signOut } = useAuth()
  const { spaces, loading: loadingSpaces } = useSpaces()
  const { reservations, loading: loadingReservations } = useReservations(
    user?.role === 'admin' ? '__all__' : user?.id
  )
  const navigate = useNavigate()

  const reservableCount = useMemo(
    () => spaces.filter((s) => s.type === 'reservable').length,
    [spaces]
  )
  const activeReservations = useMemo(
    () => reservations.filter((r) => r.status === 'active').length,
    [reservations]
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Admin</div>
            <h1 className="text-xl font-semibold text-slate-900">Space Operations</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Map
            </button>
            <button
              type="button"
              onClick={() => navigate('/reservations')}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Reservations
            </button>
            <button
              type="button"
              onClick={signOut}
              className="rounded-lg bg-[#881c1c] px-3 py-2 text-sm text-white hover:bg-[#6e1616]"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-6 space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat title="Total spaces" value={spaces.length} />
          <Stat title="Reservable spaces" value={reservableCount} />
          <Stat title="Active reservations" value={activeReservations} />
          <Stat title="Current user role" value={user?.role ?? 'student'} capitalize />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Reservable spaces</h2>
            {loadingSpaces ? (
              <p className="mt-3 text-sm text-slate-500">Loading spaces...</p>
            ) : (
              <div className="mt-3 space-y-2">
                {spaces
                  .filter((s) => s.type === 'reservable')
                  .slice(0, 10)
                  .map((space) => (
                    <div key={space.id} className="rounded-lg border border-slate-200 px-3 py-2">
                      <div className="font-medium text-slate-900">{space.name}</div>
                      <div className="text-sm text-slate-500">
                        {space.building} · capacity {space.capacity}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Recent reservation activity</h2>
            {loadingReservations ? (
              <p className="mt-3 text-sm text-slate-500">Loading reservations...</p>
            ) : reservations.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No reservation activity yet.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {reservations.slice(0, 10).map((reservation) => (
                  <div key={reservation.id} className="rounded-lg border border-slate-200 px-3 py-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium text-slate-900">{new Date(reservation.slot_start).toLocaleString()}</div>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 capitalize">
                        {reservation.status}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500">
                      headcount {reservation.headcount ?? 1} · {reservation.reason_category ?? 'general'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function Stat({ title, value, capitalize }: { title: string; value: string | number; capitalize?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="text-xs uppercase tracking-[0.15em] text-slate-500">{title}</div>
      <div className={`mt-1 text-2xl font-semibold text-slate-900 ${capitalize ? 'capitalize' : ''}`}>{value}</div>
    </div>
  )
}
