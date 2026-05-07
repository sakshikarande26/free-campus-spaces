import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useFavorites(userId?: string) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  const fetchFavorites = useCallback(async (uid: string) => {
    const { data, error } = await supabase
      .from('favorites')
      .select('space_id')
      .eq('user_id', uid)

    if (error) {
      console.warn('[useFavorites] fetch failed:', error.message)
      setFavoriteIds(new Set())
    } else {
      setFavoriteIds(new Set((data ?? []).map((d: { space_id: string }) => d.space_id)))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!userId) {
      setFavoriteIds(new Set())
      setLoading(false)
      return
    }

    fetchFavorites(userId)

    const channel = supabase
      .channel(`favorites-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites',
          filter: `user_id=eq.${userId}`,
        },
        () => fetchFavorites(userId),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, fetchFavorites])

  const toggleFavorite = useCallback(
    async (spaceId: string) => {
      if (!userId) return
      const wasFav = favoriteIds.has(spaceId)

      // Optimistic update so the star feels instant
      setFavoriteIds((prev) => {
        const next = new Set(prev)
        if (wasFav) next.delete(spaceId)
        else next.add(spaceId)
        return next
      })

      if (wasFav) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('space_id', spaceId)
        if (error) {
          console.warn('[useFavorites] delete failed:', error.message)
          // Roll back
          setFavoriteIds((prev) => {
            const next = new Set(prev)
            next.add(spaceId)
            return next
          })
        }
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: userId, space_id: spaceId, notify_on_available: false })
        if (error) {
          console.warn('[useFavorites] insert failed:', error.message)
          setFavoriteIds((prev) => {
            const next = new Set(prev)
            next.delete(spaceId)
            return next
          })
        }
      }
    },
    [userId, favoriteIds],
  )

  return {
    favoriteIds,
    loading,
    toggleFavorite,
    isFavorite: (id: string) => favoriteIds.has(id),
  }
}
