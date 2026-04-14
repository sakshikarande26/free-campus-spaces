import { useMemo, useState } from 'react'
import { Map, Marker } from 'react-map-gl/maplibre'
import type { StyleSpecification } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useAuth } from '../hooks/useAuth'
import { useSpaces } from '../hooks/useSpaces'
import { useCheckIns } from '../hooks/useCheckIns'
import { getOccupancyInfo, getPinColor } from '../lib/occupancy'
import SpaceCard from '../components/SpaceCard'
import DetailPanel from '../components/DetailPanel'
import type { StudySpace } from '../types/database'

type TypeFilter = 'all' | 'free' | 'reservable'
type NoiseFilter = 'any' | 'quiet' | 'collaborative'
type AmenityFilter = 'outlets' | 'whiteboard' | 'printer'

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
  const { spaces, loading } = useSpaces()
  const { checkIns } = useCheckIns()

  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [noiseFilter, setNoiseFilter] = useState<NoiseFilter>('any')
  const [amenityFilters, setAmenityFilters] = useState<AmenityFilter[]>([])

  function toggleAmenity(a: AmenityFilter) {
    setAmenityFilters((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    )
  }

  const filteredSpaces = useMemo(() => {
    return spaces.filter((s) => {
      if (typeFilter !== 'all' && s.type !== typeFilter) return false
      if (noiseFilter !== 'any' && s.noise_level !== noiseFilter) return false
      if (amenityFilters.length > 0) {
        const has = amenityFilters.every((a) => s.amenities?.includes(a))
        if (!has) return false
      }
      return true
    })
  }, [spaces, typeFilter, noiseFilter, amenityFilters])

  const selectedSpace: StudySpace | null =
    spaces.find((s) => s.id === selectedSpaceId) ?? null
  const selectedOccupancy = selectedSpace
    ? getOccupancyInfo(selectedSpace, checkIns)
    : null

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 text-gray-900 flex flex-col">
      <header
        className="bg-[#881c1c] text-white flex items-center px-6 gap-4 shrink-0"
        style={{ height: 64 }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-semibold tracking-wide">UMass Amherst</span>
          <span className="opacity-60">|</span>
          <span className="font-medium">Spaces</span>
        </div>

        <div className="flex-1 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search spaces, buildings..."
            className="w-full bg-white/15 placeholder-white/70 text-white text-sm rounded-md px-3 py-2 outline-none focus:bg-white/25 transition-colors"
          />
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="opacity-90 hidden sm:inline text-xs">{user?.email}</span>
          <button
            type="button"
            onClick={signOut}
            className="bg-white/15 hover:bg-white/25 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <div
        className="grid min-h-0 flex-1"
        style={{ gridTemplateColumns: '290px 1fr' }}
      >
        <aside className="bg-white border-r border-gray-200 overflow-y-auto flex flex-col">
          <div className="px-4 py-4 border-b border-gray-100 space-y-4">
            <FilterRow label="Type">
              <Chip active={typeFilter === 'all'} onClick={() => setTypeFilter('all')}>All</Chip>
              <Chip active={typeFilter === 'free'} onClick={() => setTypeFilter('free')}>Free spaces</Chip>
              <Chip active={typeFilter === 'reservable'} onClick={() => setTypeFilter('reservable')}>Reservable</Chip>
            </FilterRow>

            <FilterRow label="Noise">
              <Chip active={noiseFilter === 'any'} onClick={() => setNoiseFilter('any')}>Any</Chip>
              <Chip active={noiseFilter === 'quiet'} onClick={() => setNoiseFilter('quiet')}>Quiet</Chip>
              <Chip active={noiseFilter === 'collaborative'} onClick={() => setNoiseFilter('collaborative')}>Collaborative</Chip>
            </FilterRow>

            <FilterRow label="Amenities">
              <Chip active={amenityFilters.includes('outlets')} onClick={() => toggleAmenity('outlets')}>Outlets</Chip>
              <Chip active={amenityFilters.includes('whiteboard')} onClick={() => toggleAmenity('whiteboard')}>Whiteboard</Chip>
              <Chip active={amenityFilters.includes('printer')} onClick={() => toggleAmenity('printer')}>Printer</Chip>
            </FilterRow>
          </div>

          <div className="px-4 py-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500 mb-3">
              Study spaces near you
            </div>
            {loading && (
              <div className="text-xs text-gray-500">Loading spaces…</div>
            )}
            {!loading && filteredSpaces.length === 0 && (
              <div className="text-xs text-gray-500">No spaces match these filters.</div>
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
                    hasActiveReservation={false}
                    onClick={() => setSelectedSpaceId(space.id)}
                  />
                )
              })}
            </div>
          </div>
        </aside>

        <div className="flex flex-col min-w-0 h-full">
          <div
            className="relative overflow-hidden bg-white"
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
                  const size = isSelected ? 28 : 22
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
                        style={{
                          width: size,
                          height: size,
                          borderRadius: '50%',
                          background: isReservable ? '#881c1c' : '#ffffff',
                          border: `3px solid ${ringColor}`,
                          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                          cursor: 'pointer',
                        }}
                      />
                    </Marker>
                  )
                })}
            </Map>

            <div className="absolute bottom-3 left-3 z-10 bg-white rounded-md border border-gray-200 shadow-sm px-3 py-2 text-[11px] text-gray-700 space-y-1">
              <div className="font-semibold uppercase tracking-[0.12em] text-[10px] text-gray-500">
                Legend
              </div>
              <LegendRow color="#27500A" label="Nearly empty" />
              <LegendRow color="#854F0B" label="Moderate" />
              <LegendRow color="#A32D2D" label="Very busy" />
              <LegendRow color="#881c1c" label="Reservable" solid />
            </div>
          </div>

          <div style={{ height: 200, flexShrink: 0 }}>
            <DetailPanel
              space={selectedSpace}
              occupancyInfo={selectedOccupancy}
              onReportOccupancy={() => {}}
              onReserve={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500 mb-1.5">
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
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[11px] font-medium rounded-full px-2.5 py-1 border transition-colors ${
        active
          ? 'bg-[#881c1c] text-white border-[#881c1c]'
          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
      }`}
    >
      {children}
    </button>
  )
}

function LegendRow({ color, label, solid }: { color: string; label: string; solid?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block w-3 h-3 rounded-full"
        style={{
          background: solid ? color : '#ffffff',
          border: `2px solid ${color}`,
        }}
      />
      <span>{label}</span>
    </div>
  )
}
