import { supabase } from './supabase'
import type { Reservation } from '../types/database'

interface CreateReservationInput {
  userId: string
  spaceId: string
  slotStart: string
  slotEnd: string
  headcount: number
  reasonCategory: Reservation['reason_category']
}

export async function createReservation(input: CreateReservationInput): Promise<{ error: string | null }> {
  const { data: conflicts } = await supabase
    .from('reservations')
    .select('id')
    .eq('space_id', input.spaceId)
    .eq('status', 'active')
    .lt('slot_start', input.slotEnd)
    .gt('slot_end', input.slotStart)
    .limit(1)

  if (conflicts && conflicts.length > 0) {
    return { error: 'This space is already booked for that time. Please choose a different slot.' }
  }

  const { error } = await supabase
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

  return { error: error?.message ?? null }
}

export async function cancelReservation(reservationId: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('reservations')
    .update({ status: 'released' })
    .eq('id', reservationId)

  return { error: error?.message ?? null }
}
