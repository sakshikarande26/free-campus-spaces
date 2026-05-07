import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { StudySpace } from '../types/database'

export function useSpaces() {
  const [spaces, setSpaces] = useState<StudySpace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSpaces()

    const channel = supabase
      .channel('spaces-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'study_spaces' },
        () => fetchSpaces()
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchSpaces() {
    // Tier 1: active rows only. The university filter was the most common
    // cause of this hook returning zero rows after the multi-university
    // migration, so it has been removed here. Selected university is still
    // available via localStorage for the topbar label.
    let { data, error } = await supabase
      .from('study_spaces')
      .select('*')
      .eq('is_active', true)
      .order('name')

    // Tier 2: drop the is_active filter (handles NULL/false is_active values
    // or RLS policies that don't expose that column).
    if (error || !data || data.length === 0) {
      if (error) console.warn('[useSpaces] active query failed, retrying without is_active filter:', error.message)
      const fallback = await supabase
        .from('study_spaces')
        .select('*')
        .order('name')
      data = fallback.data ?? []
      error = fallback.error
    }

    if (error) {
      console.error('[useSpaces] fetch failed:', error.message)
      setError(error.message)
      setSpaces([])
    } else {
      setError(null)
      setSpaces((data as StudySpace[]) ?? [])
    }
    setLoading(false)
  }

  return { spaces, loading, error }
}
