export interface User {
  id: string
  email: string
  role: 'student' | 'admin'
  created_at: string
}

export interface StudySpace {
  id: string
  name: string
  building: string
  floor: string | null
  type: 'free' | 'reservable'
  space_tier: 'standard' | 'collab' | 'event' | null
  capacity: number
  noise_level: 'quiet' | 'collaborative' | null
  amenities: string[]
  hours: { open: string; close: string } | null
  is_active: boolean
  lat: number | null
  lng: number | null
  max_duration_hours: number | null
  booking_horizon_hours: number | null
  created_at: string
}

export interface CheckIn {
  id: string
  user_id: string
  space_id: string
  checked_in_at: string
  expires_at: string
  status: 'active' | 'expired'
  occ_level: 'empty' | 'moderate' | 'busy' | null
}

export interface Reservation {
  id: string
  user_id: string
  space_id: string
  slot_start: string
  slot_end: string
  status: 'active' | 'expired' | 'released'
  reason_category: 'study' | 'group_project' | 'hackathon' | 'interview' | 'event' | 'other' | null
  headcount: number | null
  last_confirmed_at: string | null
  created_at: string
}

export interface Favorite {
  user_id: string
  space_id: string
  notify_on_available: boolean
}

export interface Report {
  id: string
  reporter_id: string
  space_id: string
  issue_type: 'wrong_occupancy' | 'space_closed' | 'wrong_hours' | 'wrong_amenities' | 'other'
  description: string | null
  status: 'open' | 'resolved'
  created_at: string
}

export interface Announcement {
  id: string
  space_id: string
  message: string
  start_at: string
  end_at: string
  created_at: string
}

export interface SpaceSchedule {
  id: string
  space_id: string
  day_of_week: number | null
  open_time: string | null
  close_time: string | null
  schedule_type: 'hours' | 'typically_busy' | 'typically_quiet' | 'typically_moderate'
  label: string | null
}
