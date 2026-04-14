import { useEffect, useState } from 'react'
import type { User as AuthUser } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { User } from '../types/database'

interface AuthState {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

function fallbackUser(authUser: AuthUser): User {
  return {
    id: authUser.id,
    email: authUser.email ?? '',
    role: 'student',
    created_at: authUser.created_at ?? new Date().toISOString(),
  }
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadFromSession(authUser: AuthUser) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle()

      if (cancelled) return
      setUser((data as User | null) ?? fallbackUser(authUser))
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return
      if (session?.user) {
        loadFromSession(session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          loadFromSession(session.user)
        } else {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return { user, loading, signOut }
}
