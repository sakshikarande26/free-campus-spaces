import { useMemo, useState } from 'react'
import { Map, Marker } from 'react-map-gl/maplibre'
import type { StyleSpecification } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Link, useNavigate } from 'react-router-dom'
import {
  MapPin,
  Search,
  CalendarCheck,
  Settings,
  LogOut,
  ChevronRight,
  Users,
  Plug,
  Presentation,
  Printer,
  Sparkles,
  Building2,
  Clock,
  Activity,
  Armchair,
  Star,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useSpaces } from '../hooks/useSpaces'
import { useCheckIns } from '../hooks/useCheckIns'
import { useReservations } from '../hooks/useReservations'
import { useFavorites } from '../hooks/useFavorites'
import { getOccupancyInfo, getPinColor } from '../lib/occupancy'
import SpaceCard from '../components/SpaceCard'
import DetailPanel from '../components/DetailPanel'
import ReportOccupancyModal from '../components/ReportOccupancyModal'
import FlagWrongDataModal from '../components/FlagWrongDataModal'
import { manualCheckOut } from '../lib/checkins'
import { findNextAvailableSlot } from '../lib/reservations'
import type { StudySpace } from '../types/database'

type TypeFilter = 'all' | 'free' | 'reservable'
type NoiseFilter = 'any' | 'quiet' | 'collaborative'
type AmenityFilter = 'outlets' | 'whiteboard' | 'printer'
type OccupancyFilter = 'any' | 'not_busy' | 'nearly_empty'

function isOpenNow(hours: { open: string; close: string } | null | undefined): boolean {
  if (!hours || !hours.open || !hours.close) return false
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const [openH, openM] = hours.open.split(':').map(Number)
  const [closeH, closeM] = hours.close.split(':').map(Number)
  if (
    Number.isNaN(openH) || Number.isNaN(openM) ||
    Number.isNaN(closeH) || Number.isNaN(closeM)
  ) return false
  const openMin = openH * 60 + openM
  const closeMin = closeH * 60 + closeM
  if (closeMin <= openMin) {
    // Wraps past midnight (e.g. 08:00 -> 02:00)
    return nowMin >= openMin || nowMin < closeMin
  }
  return nowMin >= openMin && nowMin < closeMin
}

const UMASS_CENTER = { longitude: -72.5301, latitude: 42.3868, zoom: 15 }

const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
}

export default function MapPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { spaces, loading, error: spacesError } = useSpaces()
  const { checkIns } = useCheckIns()
  const { reservations } = useReservations(user?.id)
  const { isFavorite, toggleFavorite } = useFavorites(user?.id)

  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [noiseFilter, setNoiseFilter] = useState<NoiseFilter>('any')
  const [amenityFilters, setAmenityFilters] = useState<AmenityFilter[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [buildingFilter, setBuildingFilter] = useState<string>('all')
  const [openNowFilter, setOpenNowFilter] = useState<boolean>(false)
  const [occupancyFilter, setOccupancyFilter] = useState<OccupancyFilter>('any')
  const [minCapacityFilter, setMinCapacityFilter] = useState<number>(0)
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showFlagModal, setShowFlagModal] = useState(false)
  const [quickBookLoading, setQuickBookLoading] = useState(false)
  const [quickBookError, setQuickBookError] = useState<string | null>(null)

  const buildings = useMemo(() => {
    const set = new Set<string>()
    spaces.forEach((s) => {
      if (s.building) set.add(s.building)
    })
    return Array.from(set).sort()
  }, [spaces])

  const anyFilterActive =
    typeFilter !== 'all' ||
    noiseFilter !== 'any' ||
    amenityFilters.length > 0 ||
    searchQuery.trim().length > 0 ||
    buildingFilter !== 'all' ||
    openNowFilter ||
    occupancyFilter !== 'any' ||
    minCapacityFilter !== 0 ||
    favoritesOnly
  
  const activeFilters = [
    favoritesOnly && 'Favorites',
    noiseFilter === 'quiet' && 'Quiet',
    openNowFilter && 'Open Now',
    typeFilter === 'free' && 'Free',
    typeFilter === 'reservable' && 'Reservable',
  ].filter(Boolean)

  function resetAllFilters() {
    setTypeFilter('all')
    setNoiseFilter('any')
    setAmenityFilters([])
    setSearchQuery('')
    setBuildingFilter('all')
    setOpenNowFilter(false)
    setOccupancyFilter('any')
    setMinCapacityFilter(0)
    setFavoritesOnly(false)
  }

  function toggleAmenity(a: AmenityFilter) {
    setAmenityFilters((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    )
  }

  const upcomingReservations = useMemo(() =>
    reservations
      .filter((r) => r.status === 'active' && new Date(r.slot_start) > new Date())
      .slice(0, 2),
    [reservations]
  )

  const filteredSpaces = useMemo(() => {
    return spaces.filter((s) => {
      if (favoritesOnly && !isFavorite(s.id)) return false
      if (typeFilter !== 'all' && s.type !== typeFilter) return false
      if (noiseFilter !== 'any' && s.noise_level !== noiseFilter) return false
      if (amenityFilters.length > 0) {
        const has = amenityFilters.every((a) => s.amenities?.includes(a))
        if (!has) return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const haystack = `${s.name} ${s.building ?? ''} ${s.floor ?? ''}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (buildingFilter !== 'all' && s.building !== buildingFilter) return false
      if (openNowFilter && !isOpenNow(s.hours)) return false
      if (minCapacityFilter > 0 && (s.capacity ?? 0) < minCapacityFilter) return false
      // Occupancy filter only applies to free spaces — reservable always shown
      if (occupancyFilter !== 'any' && s.type === 'free') {
        const info = getOccupancyInfo(s, checkIns)
        if (occupancyFilter === 'nearly_empty' && info.color !== 'green') return false
        if (occupancyFilter === 'not_busy' && info.color === 'red') return false
      }
      return true
    })
  }, [
    spaces, typeFilter, noiseFilter, amenityFilters, searchQuery,
    buildingFilter, openNowFilter, occupancyFilter, minCapacityFilter, checkIns,
    favoritesOnly, isFavorite,
  ])

  const selectedSpace: StudySpace | null =
    spaces.find((s) => s.id === selectedSpaceId) ?? null
  const selectedOccupancy = selectedSpace
    ? getOccupancyInfo(selectedSpace, checkIns)
    : null

  const hasActiveCheckInHere = Boolean(
    user && selectedSpace &&
      checkIns.some(
        (c) => c.user_id === user.id && c.space_id === selectedSpace.id
      )
  )

  async function handleCheckOut() {
    if (!user) return
    await manualCheckOut(user.id)
  }

  async function handleQuickBook() {
    if (!selectedSpace) return
    setQuickBookError(null)
    setQuickBookLoading(true)
    const { slotStart, slotEnd, error } = await findNextAvailableSlot(selectedSpace.id, 1)
    setQuickBookLoading(false)
    if (error || !slotStart || !slotEnd) {
      setQuickBookError(error ?? 'No open slot found.')
      return
    }
    const pad = (n: number) => String(n).padStart(2, '0')
    const dateStr = `${slotStart.getFullYear()}-${pad(slotStart.getMonth() + 1)}-${pad(slotStart.getDate())}`
    const startStr = `${pad(slotStart.getHours())}:${pad(slotStart.getMinutes())}`
    const dur = Math.round((slotEnd.getTime() - slotStart.getTime()) / 3_600_000)
    navigate(
      `/reservations?space=${selectedSpace.id}&date=${dateStr}&start=${startStr}&duration=${dur}`,
    )
  }

  const userInitial = user?.email?.[0]?.toUpperCase() ?? 'U'

  const selectedUniversityId =
    (typeof window !== 'undefined' && window.localStorage.getItem('selected_university')) || 'umass_amherst'
  const universityLabel =
    {
      umass_amherst: 'UMass Amherst',
      amherst_college: 'Amherst College',
      hampshire_college: 'Hampshire College',
      mount_holyoke_college: 'Mount Holyoke College',
      smith_college: 'Smith College',
    }[selectedUniversityId] ?? 'UMass Amherst'

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header
        className="bg-white border-b border-slate-200 flex items-center px-5 gap-4 shrink-0"
        style={{ height: 60 }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#881c1c] to-[#5f0f15] text-white flex items-center justify-center shadow-sm">
            <MapPin size={17} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-semibold">{universityLabel}</div>
            <span className="font-display font-bold tracking-tight text-[15px] text-slate-900">Study Spaces</span>
          </div>
          <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-slate-500 ml-1 pl-3 border-l border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {universityLabel}
          </span>
        </div>

        <div className="flex-1 max-w-md mx-auto relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search spaces, buildings..."
            className="w-full bg-slate-100 hover:bg-slate-200/60 focus:bg-white focus:ring-2 focus:ring-[#881c1c]/20 focus:border-[#881c1c] border border-transparent text-slate-900 placeholder-slate-400 text-sm rounded-xl pl-9 pr-3 py-2 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => navigate('/reservations')}
            className="hidden sm:inline-flex items-center gap-1.5 hover:bg-slate-100 text-slate-700 rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
          >
            <CalendarCheck size={14} strokeWidth={2.4} />
            Reservations
          </button>
          {user?.role === 'admin' && (
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="hidden sm:inline-flex items-center gap-1.5 hover:bg-slate-100 text-slate-700 rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
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
            <div className="hidden md:block">
              <div className="text-[11px] font-semibold text-slate-700 leading-tight max-w-[140px] truncate">
                {user?.email}
              </div>
              <button
                type="button"
                onClick={signOut}
                className="text-[10px] text-slate-500 hover:text-[#881c1c] inline-flex items-center gap-0.5 transition-colors"
              >
                <LogOut size={9} strokeWidth={2.4} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className="grid min-h-0 flex-1"
        style={{ gridTemplateColumns: '320px 1fr' }}
      >
        {/* Sidebar */}
        <aside className="bg-white border-r border-slate-200 overflow-y-auto flex flex-col">
          {/* Filters */}
          <div className="px-4 py-4 border-b border-slate-100 space-y-3.5">
            <div className="flex items-center justify-between -mb-1">
              <div className="flex items-center gap-1.5">
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-700">Filters</div>
                {anyFilterActive && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#881c1c] text-white text-[9.5px] font-bold">
                    {[
                      typeFilter !== 'all',
                      noiseFilter !== 'any',
                      amenityFilters.length > 0,
                      searchQuery.trim().length > 0,
                      buildingFilter !== 'all',
                      openNowFilter,
                      occupancyFilter !== 'any',
                      minCapacityFilter !== 0,
                      favoritesOnly,
                    ].filter(Boolean).length}
                  </span>
                )}
              </div>
              {anyFilterActive && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-[10.5px] text-slate-500 hover:text-[#881c1c] transition-colors font-medium"
                >
                  Reset
                </button>
              )}
            </div>
            {user && (
              <FilterRow label="Saved" icon={<Star size={10} strokeWidth={2.4} />}>
                <Chip
                  active={favoritesOnly}
                  onClick={() => setFavoritesOnly((v) => !v)}
                  icon={<Star size={11} strokeWidth={2.4} fill={favoritesOnly ? 'currentColor' : 'none'} />}
                >
                  Favorites only
                </Chip>
              </FilterRow>
            )}

            <FilterRow label="Type">
              <Chip active={typeFilter === 'all'} onClick={() => setTypeFilter('all')}>All</Chip>
              <Chip active={typeFilter === 'free'} onClick={() => setTypeFilter('free')}>Free</Chip>
              <Chip active={typeFilter === 'reservable'} onClick={() => setTypeFilter('reservable')}>Reservable</Chip>
            </FilterRow>

            <FilterRow label="Noise">
              <Chip active={noiseFilter === 'any'} onClick={() => setNoiseFilter('any')}>Any</Chip>
              <Chip active={noiseFilter === 'quiet'} onClick={() => setNoiseFilter('quiet')}>Quiet</Chip>
              <Chip active={noiseFilter === 'collaborative'} onClick={() => setNoiseFilter('collaborative')}>Collab</Chip>
            </FilterRow>

            <FilterRow label="Amenities">
              <Chip active={amenityFilters.includes('outlets')} onClick={() => toggleAmenity('outlets')} icon={<Plug size={11} strokeWidth={2.4} />}>Outlets</Chip>
              <Chip active={amenityFilters.includes('whiteboard')} onClick={() => toggleAmenity('whiteboard')} icon={<Presentation size={11} strokeWidth={2.4} />}>Whiteboard</Chip>
              <Chip active={amenityFilters.includes('printer')} onClick={() => toggleAmenity('printer')} icon={<Printer size={11} strokeWidth={2.4} />}>Printer</Chip>
            </FilterRow>

            <FilterRow label="Building" icon={<Building2 size={10} strokeWidth={2.4} />}>
              <select
                value={buildingFilter}
                onChange={(e) => setBuildingFilter(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg text-xs px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#881c1c]/20 focus:border-[#881c1c] transition-all"
              >
                <option value="all">All buildings</option>
                {buildings.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </FilterRow>

            <FilterRow label="Availability" icon={<Clock size={10} strokeWidth={2.4} />}>
              <Chip
                active={openNowFilter}
                onClick={() => setOpenNowFilter((v) => !v)}
                icon={<Clock size={11} strokeWidth={2.4} />}
              >
                Open now
              </Chip>
            </FilterRow>

            <FilterRow label="Occupancy" icon={<Activity size={10} strokeWidth={2.4} />}>
              <Chip active={occupancyFilter === 'any'} onClick={() => setOccupancyFilter('any')}>Any</Chip>
              <Chip active={occupancyFilter === 'not_busy'} onClick={() => setOccupancyFilter('not_busy')}>Not busy</Chip>
              <Chip active={occupancyFilter === 'nearly_empty'} onClick={() => setOccupancyFilter('nearly_empty')}>Nearly empty</Chip>
            </FilterRow>

            <FilterRow label="Min seats" icon={<Armchair size={10} strokeWidth={2.4} />}>
              <Chip active={minCapacityFilter === 0} onClick={() => setMinCapacityFilter(0)}>Any</Chip>
              <Chip active={minCapacityFilter === 4} onClick={() => setMinCapacityFilter(4)}>4+</Chip>
              <Chip active={minCapacityFilter === 8} onClick={() => setMinCapacityFilter(8)}>8+</Chip>
              <Chip active={minCapacityFilter === 20} onClick={() => setMinCapacityFilter(20)}>20+</Chip>
            </FilterRow>

          </div>

          {/* My Reservations */}
          <div className="px-4 py-3.5 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <CalendarCheck size={12} className="text-[#881c1c]" strokeWidth={2.4} />
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-700">My Reservations</div>
              </div>
              <Link
                to="/reservations"
                className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#881c1c] hover:text-[#6e1616] hover:underline"
              >
                View all
                <ChevronRight size={11} strokeWidth={2.4} />
              </Link>
            </div>
            {upcomingReservations.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-3 py-3 text-center">
                <p className="text-[11px] text-slate-500">No upcoming bookings</p>
                <Link to="/reservations" className="text-[10.5px] font-semibold text-[#881c1c] hover:underline mt-0.5 inline-block">
                  Book a room →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingReservations.map((r) => {
                  const spaceName = spaces.find((s) => s.id === r.space_id)?.name ?? 'Unknown space'
                  const start = new Date(r.slot_start)
                  const end = new Date(r.slot_end)
                  const durationMs = end.getTime() - start.getTime()
                  const durationHrs = Math.round(durationMs / 3600000)
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => navigate('/reservations')}
                      className="group w-full text-left rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/40 px-3 py-2.5 hover:border-[#881c1c]/40 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#fdf3f3] text-[#881c1c] flex flex-col items-center justify-center shrink-0">
                          <div className="text-[8px] font-bold uppercase leading-none">
                            {start.toLocaleDateString([], { month: 'short' })}
                          </div>
                          <div className="text-[12px] font-bold leading-none mt-0.5">
                            {start.getDate()}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[12.5px] font-semibold text-slate-900 truncate">{spaceName}</div>
                          <div className="text-[10.5px] text-slate-500 mt-0.5 truncate">
                            {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {durationHrs}h
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Spaces list */}
          <div className="px-3 py-3 flex-1">
            <div className="flex items-center justify-between px-1 mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-slate-500" strokeWidth={2.4} />
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-700">
                  Study spaces
                </div>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">
                {filteredSpaces.length}
              </span>
              {activeFilters.length > 0 && (
                <div className="text-[10px] text-slate-400 mt-1 text-right">
                  Showing: {activeFilters.join(' · ')}
                </div>
              )}
            </div>
            {loading && (
              <div className="text-xs text-slate-500 px-1 py-2">Loading spaces…</div>
            )}
            {!loading && spacesError && spaces.length === 0 && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-3 text-[11px] text-rose-700">
                <div className="font-semibold mb-0.5">Couldn't load spaces</div>
                <div className="opacity-80 break-words">{spacesError}</div>
              </div>
            )}
            {!loading && !spacesError && filteredSpaces.length === 0 && spaces.length > 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 px-3 py-6 text-center">
              {favoritesOnly ? (
                <>
                  <Star size={18} className="mx-auto mb-2 text-slate-300" strokeWidth={2.2} />
                  <div className="text-xs font-semibold text-slate-600">No favorite spaces yet.</div>
                   <div className="text-[10.5px] text-slate-400 mt-1">
                    Tap the star on a study space to save it here.
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xs text-slate-500">No spaces match these filters.</div>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="mt-2 text-[11px] font-semibold text-[#881c1c] hover:underline"
                >
                    Clear filters
                </button>
              </>
            )}
          </div>
        )}
            {!loading && !spacesError && spaces.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 px-3 py-6 text-center">
                <div className="text-xs text-slate-500">No study spaces found.</div>
                <div className="text-[10.5px] text-slate-400 mt-1">
                  Check that your Supabase <code>study_spaces</code> table has rows with <code>is_active = true</code>.
                </div>
              </div>
            )}
            <div>
              {filteredSpaces.map((space) => {
                const info = getOccupancyInfo(space, checkIns)
                return (
                  <SpaceCard
                    key={space.id}
                    space={space}
                    occupancyInfo={info}
                    isSelected={selectedSpaceId === space.id}
                    hasActiveReservation={reservations.some(
                      (r) => r.space_id === space.id && r.status === 'active'
                    )}
                    isFavorite={isFavorite(space.id)}
                    onClick={() => setSelectedSpaceId(space.id)}
                    onToggleFavorite={user ? () => toggleFavorite(space.id) : undefined}
                  />
                )
              })}
            </div>
          </div>
        </aside>

        {/* Map + detail panel */}
        <div className="flex flex-col min-w-0 h-full">
          <div
            className="relative overflow-hidden bg-slate-100"
            style={{ flex: 1, minHeight: 0 }}
          >
            <Map
              initialViewState={UMASS_CENTER}
              style={{ width: '100%', height: '100%' }}
              mapStyle={MAP_STYLE}
            >
              {filteredSpaces
                .filter((s) => s.lat !== null && s.lng !== null)
                .map((space) => {
                  const info = getOccupancyInfo(space, checkIns)
                  const isSelected = selectedSpaceId === space.id
                  const isReservable = space.type === 'reservable'
                  const ringColor = getPinColor(info, space.type)
                  const size = isSelected ? 32 : 24
                  return (
                    <Marker
                      key={space.id}
                      longitude={space.lng as number}
                      latitude={space.lat as number}
                      anchor="center"
                      onClick={(e) => {
                        e.originalEvent.stopPropagation()
                        setSelectedSpaceId(space.id)
                      }}
                    >
                      <div
                        className={isSelected ? 'pin-pulse' : ''}
                        style={{
                          width: size,
                          height: size,
                          borderRadius: '50%',
                          background: isReservable ? '#881c1c' : '#ffffff',
                          border: `${isSelected ? 4 : 3}px solid ${ringColor}`,
                          boxShadow: isSelected
                            ? '0 6px 18px rgba(0,0,0,0.25)'
                            : '0 2px 6px rgba(0,0,0,0.18)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      />
                    </Marker>
                  )
                })}
            </Map>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-10 glass rounded-2xl border border-slate-200/70 shadow-lg px-3.5 py-2.5 text-[11px] text-slate-700">
              <div className="font-bold uppercase tracking-[0.12em] text-[9px] text-slate-500 mb-1.5">
                Occupancy
              </div>
              <div className="space-y-1">
                <LegendRow color="#27500A" label="Nearly empty" />
                <LegendRow color="#854F0B" label="Moderate" />
                <LegendRow color="#A32D2D" label="Very busy" />
                <div className="h-px bg-slate-200 my-1.5" />
                <LegendRow color="#881c1c" label="Reservable" solid />
              </div>
            </div>

            {/* Stats overlay */}
            <div className="absolute top-4 right-4 z-10 glass rounded-2xl border border-slate-200/70 shadow-lg px-3.5 py-2.5">
              <div className="flex items-center gap-3">
                <StatPill icon={<MapPin size={12} strokeWidth={2.4} />} label="Spaces" value={filteredSpaces.length} />
                <div className="w-px h-5 bg-slate-200" />
                <StatPill icon={<Users size={12} strokeWidth={2.4} />} label="Live now" value={checkIns.length} />
              </div>
            </div>
          </div>

          <div style={{ height: 380, flexShrink: 0 }}>
            <DetailPanel
              space={selectedSpace}
              occupancyInfo={selectedOccupancy}
              hasActiveCheckIn={hasActiveCheckInHere}
              isFavorite={selectedSpace ? isFavorite(selectedSpace.id) : false}
              quickBookLoading={quickBookLoading}
              onReportOccupancy={() => setShowReportModal(true)}
              onReserve={() => {
                if (selectedSpace) {
                  navigate(`/reservations?space=${selectedSpace.id}`)
                } else {
                  navigate('/reservations')
                }
              }}
              onQuickBook={selectedSpace?.type === 'reservable' ? handleQuickBook : undefined}
              onToggleFavorite={
                user && selectedSpace ? () => toggleFavorite(selectedSpace.id) : undefined
              }
              onFlagWrong={() => setShowFlagModal(true)}
              onCheckOut={handleCheckOut}
            />
            {quickBookError && (
              <div className="absolute bottom-3 right-4 z-20 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11.5px] font-medium px-3 py-2 shadow-sm max-w-xs">
                {quickBookError}
              </div>
            )}
          </div>
        </div>
      </div>

      {showReportModal && selectedSpace && user && (
        <ReportOccupancyModal
          space={selectedSpace}
          userId={user.id}
          onClose={() => setShowReportModal(false)}
          onSuccess={() => {}}
        />
      )}

      {showFlagModal && selectedSpace && user && (
        <FlagWrongDataModal
          space={selectedSpace}
          userId={user.id}
          onClose={() => setShowFlagModal(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  )
}

function FilterRow({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-1.5 flex items-center gap-1">
        {icon}
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-[11px] font-semibold rounded-full px-2.5 py-1 border transition-all ${
        active
          ? 'bg-[#881c1c] text-white border-[#881c1c] shadow-sm'
          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}

function LegendRow({ color, label, solid }: { color: string; label: string; solid?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block w-3 h-3 rounded-full shrink-0"
        style={{
          background: solid ? color : '#ffffff',
          border: `2px solid ${color}`,
        }}
      />
      <span>{label}</span>
    </div>
  )
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-slate-500">{icon}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-[14px] font-bold text-slate-900">{value}</span>
        <span className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</span>
      </div>
    </div>
  )
}
