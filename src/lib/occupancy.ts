import type { CheckIn, StudySpace } from '../types/database'

export type OccupancyLevel = 'live' | 'estimated' | 'typical' | 'none'

export interface OccupancyInfo {
  level: OccupancyLevel
  label: string
  sublabel: string
  color: 'green' | 'amber' | 'red' | 'gray'
  percentage: number | null
}

export function getOccupancyInfo(
  space: StudySpace,
  checkIns: CheckIn[]
): OccupancyInfo {
  const spaceCheckIns = checkIns.filter(c => c.space_id === space.id)

  const latestReport = spaceCheckIns
    .filter(c => c.occ_level !== null)
    .sort((a, b) => new Date(b.checked_in_at).getTime() -
                    new Date(a.checked_in_at).getTime())[0]

  if (latestReport) {
    const map = {
      empty: { color: 'green' as const, percentage: 15, label: 'Nearly empty' },
      moderate: { color: 'amber' as const, percentage: 55, label: 'Moderate' },
      busy: { color: 'red' as const, percentage: 85, label: 'Very busy' },
    }
    const info = map[latestReport.occ_level!]
    const ago = getTimeAgo(latestReport.checked_in_at)
    return {
      level: 'live',
      label: info.label,
      sublabel: `Live · updated ${ago}`,
      color: info.color,
      percentage: info.percentage,
    }
  }

  if (spaceCheckIns.length > 0) {
    const percentage = Math.round((spaceCheckIns.length / space.capacity) * 100)
    const color = percentage < 35 ? 'green' : percentage < 65 ? 'amber' : 'red'
    return {
      level: 'estimated',
      label: `~${Math.min(percentage, 100)}% full`,
      sublabel: `Estimated · ${spaceCheckIns.length} check-in${spaceCheckIns.length > 1 ? 's' : ''}`,
      color,
      percentage: Math.min(percentage, 100),
    }
  }

  return {
    level: 'none',
    label: 'No data yet',
    sublabel: 'Be the first to report',
    color: 'gray',
    percentage: null,
  }
}

export function getPinColor(info: OccupancyInfo, spaceType: string): string {
  if (spaceType === 'reservable') return '#881c1c'
  const colors = {
    green: '#27500A',
    amber: '#854F0B',
    red: '#A32D2D',
    gray: '#888780',
  }
  return colors[info.color]
}

function getTimeAgo(dateStr: string): string {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  return `${Math.floor(mins / 60)}h ago`
}
