import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Reservation } from '../types/database'

export function useReservations(userId?: string) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReservations = useCallback(async (nextUserId: string) => {
    let query = supabase
      .from('reservations')
      .select('*')
      .order('slot_start', { ascending: true })

    query = nextUserId === '__all__'
      ? query
      : query.eq('user_id', nextUserId)

    const { data } = await query

    setReservations((data as Reservation[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!userId) {
      setReservations([])
      setLoading(false)
      return
    }

    fetchReservations(userId)

    const channel = supabase
      .channel(`reservations-changes-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        () => fetchReservations(userId)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, fetchReservations])

  const refetch = useCallback(() => {
    if (userId) fetchReservations(userId)
  }, [userId, fetchReservations])

  return { reservations, loading, refetch }
}
