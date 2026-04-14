import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '../types/database'

interface AuthState {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function fetchUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !data) {
      setUser(null)
    } else {
      setUser(data as User)
    }
    setLoading(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return { user, loading, signOut }
}
