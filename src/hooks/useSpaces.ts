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
    const { data, error } = await supabase
      .from('study_spaces')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) {
      setError(error.message)
    } else {
      setSpaces(data as StudySpace[])
    }
    setLoading(false)
  }

  return { spaces, loading, error }
}
