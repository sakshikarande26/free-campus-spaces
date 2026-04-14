import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { CheckIn } from '../types/database'

export function useCheckIns() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])

  useEffect(() => {
    fetchCheckIns()

    const channel = supabase
      .channel('checkins-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'check_ins' },
        () => fetchCheckIns()
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchCheckIns() {
    const { data } = await supabase
      .from('check_ins')
      .select('*')
      .eq('status', 'active')

    if (data) setCheckIns(data as CheckIn[])
  }

  return { checkIns }
}
