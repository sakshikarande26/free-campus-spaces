import { supabase } from './supabase'
import type { Reservation, StudySpace } from '../types/database'

interface CreateReservationInput {
  userId: string
  spaceId: string
  slotStart: string
  slotEnd: string
  headcount: number
  reasonCategory: Reservation['reason_category']
}

/**
 * Returns true if [slotStart, slotEnd] sits entirely inside the building's
 * open hours. Handles same-day windows (08:00–22:00) and wrap-past-midnight
 * windows (e.g. 18:00–02:00).
 *
 * Hours are checked against the local clock-time of slotStart/slotEnd and
 * apply per-day; spans crossing midnight from a non-wrapping window will
 * be rejected (e.g. an 08:00–22:00 building cannot host 21:00–01:00).
 */
function fitsBuildingHours(
  slotStart: Date,
  slotEnd: Date,
  hours: { open: string; close: string } | null | undefined,
): boolean {
  if (!hours || !hours.open || !hours.close) return true // no hours defined → don't block
  const [openH, openM] = hours.open.split(':').map(Number)
  const [closeH, closeM] = hours.close.split(':').map(Number)
  if ([openH, openM, closeH, closeM].some((n) => Number.isNaN(n))) return true

  const startMin = slotStart.getHours() * 60 + slotStart.getMinutes()
  const endMin = slotEnd.getHours() * 60 + slotEnd.getMinutes()
  const openMin = openH * 60 + openM
  const closeMin = closeH * 60 + closeM

  const wraps = closeMin <= openMin

  if (!wraps) {
    // Reservation must not cross midnight, and must fit inside [open, close)
    const sameDay =
      slotEnd.getFullYear() === slotStart.getFullYear() &&
      slotEnd.getMonth() === slotStart.getMonth() &&
      slotEnd.getDate() === slotStart.getDate()
    if (!sameDay) return false
    return startMin >= openMin && endMin <= closeMin && startMin < endMin
  }

  // Wrapping window (e.g. 18:00–02:00): a slot is valid if both endpoints
  // are in [open, 24:00) ∪ [0, close]. We allow the slot to cross midnight
  // by at most one day.
  const inWindow = (m: number) => m >= openMin || m <= closeMin
  return inWindow(startMin) && inWindow(endMin)
}

export async function createReservation(
  input: CreateReservationInput,
): Promise<{ error: string | null; reservation: Reservation | null }> {
  // 1. Fetch the space to validate building hours, type, max duration, etc.
  const { data: spaceData, error: spaceError } = await supabase
    .from('study_spaces')
    .select('*')
    .eq('id', input.spaceId)
    .single()

  if (spaceError || !spaceData) {
    return { error: 'Could not find that space.', reservation: null }
  }
  const space = spaceData as StudySpace

  if (space.type !== 'reservable') {
    return { error: 'This space is not reservable — it\'s a free walk-in space.', reservation: null }
  }

  const slotStart = new Date(input.slotStart)
  const slotEnd = new Date(input.slotEnd)

  if (slotEnd <= slotStart) {
    return { error: 'Reservation end must be after the start time.', reservation: null }
  }
  if (slotStart.getTime() < Date.now() - 60_000) {
    return { error: 'You can\'t reserve a slot in the past.', reservation: null }
  }

  // 2. Building hours validation
  if (!fitsBuildingHours(slotStart, slotEnd, space.hours)) {
    const open = space.hours?.open ?? '—'
    const close = space.hours?.close ?? '—'
    return {
      error: `Outside building hours. ${space.building} is open ${open}–${close}. Please pick a time inside that window.`,
      reservation: null,
    }
  }

  // 3. Optional: respect max_duration_hours if set on the space
  if (space.max_duration_hours && space.max_duration_hours > 0) {
    const durationHrs = (slotEnd.getTime() - slotStart.getTime()) / 3_600_000
    if (durationHrs > space.max_duration_hours + 0.001) {
      return {
        error: `Maximum reservation length for ${space.name} is ${space.max_duration_hours}h.`,
        reservation: null,
      }
    }
  }

  // 4. Conflict check — overlapping active reservation on same space
  const { data: conflicts } = await supabase
    .from('reservations')
    .select('id')
    .eq('space_id', input.spaceId)
    .eq('status', 'active')
    .lt('slot_start', input.slotEnd)
    .gt('slot_end', input.slotStart)
    .limit(1)

  if (conflicts && conflicts.length > 0) {
    return {
      error: 'This space is already booked for that time. Please choose a different slot.',
      reservation: null,
    }
  }

  // 5. Insert
  const { data, error } = await supabase
    .from('reservations')
    .insert({
      user_id: input.userId,
      space_id: input.spaceId,
      slot_start: input.slotStart,
      slot_end: input.slotEnd,
      status: 'active',
      headcount: input.headcount,
      reason_category: input.reasonCategory,
      last_confirmed_at: new Date().toISOString(),
    })
    .select()
    .single()

  return {
    error: error?.message ?? null,
    reservation: (data as Reservation) ?? null,
  }
}

export async function cancelReservation(reservationId: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('reservations')
    .update({ status: 'released' })
    .eq('id', reservationId)

  return { error: error?.message ?? null }
}

/**
 * Walks forward from "now" in 15-minute increments to find the first slot
 * of length `durationHours` that fits inside the building's open hours and
 * doesn't overlap an existing active reservation. Returns null if no slot
 * fits inside the booking horizon.
 */
export async function findNextAvailableSlot(
  spaceId: string,
  durationHours = 1,
): Promise<{
  slotStart: Date | null
  slotEnd: Date | null
  error: string | null
}> {
  const { data: spaceData, error: spaceError } = await supabase
    .from('study_spaces')
    .select('*')
    .eq('id', spaceId)
    .single()

  if (spaceError || !spaceData) {
    return { slotStart: null, slotEnd: null, error: 'Could not find that space.' }
  }
  const space = spaceData as StudySpace

  if (space.type !== 'reservable') {
    return { slotStart: null, slotEnd: null, error: 'This space is not reservable.' }
  }

  const horizonHours = space.booking_horizon_hours ?? 24 * 7
  const horizonEnd = new Date(Date.now() + horizonHours * 3_600_000)

  const { data: existing } = await supabase
    .from('reservations')
    .select('slot_start, slot_end')
    .eq('space_id', spaceId)
    .eq('status', 'active')
    .lt('slot_start', horizonEnd.toISOString())
    .order('slot_start', { ascending: true })

  const conflicts = (existing ?? []).map((r) => ({
    start: new Date(r.slot_start),
    end: new Date(r.slot_end),
  }))

  // Round "now" up to the next 15-minute increment so the start time looks tidy
  const candidate = new Date()
  candidate.setSeconds(0, 0)
  const minutes = candidate.getMinutes()
  const rounded = Math.ceil(minutes / 15) * 15
  if (rounded === 60) {
    candidate.setHours(candidate.getHours() + 1)
    candidate.setMinutes(0)
  } else {
    candidate.setMinutes(rounded)
  }

  const durationMs = durationHours * 3_600_000
  const stepMs = 15 * 60_000
  const cap = horizonEnd.getTime()

  while (candidate.getTime() + durationMs <= cap) {
    const candidateEnd = new Date(candidate.getTime() + durationMs)
    if (fitsBuildingHours(candidate, candidateEnd, space.hours)) {
      const overlaps = conflicts.some(
        (r) => candidate < r.end && candidateEnd > r.start,
      )
      if (!overlaps) {
        return { slotStart: new Date(candidate), slotEnd: candidateEnd, error: null }
      }
    }
    candidate.setTime(candidate.getTime() + stepMs)
  }

  return {
    slotStart: null,
    slotEnd: null,
    error: 'No open slot in the booking window — try picking a time manually.',
  }
}
