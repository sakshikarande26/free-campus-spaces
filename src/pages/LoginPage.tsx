import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock, MapPin, Users, Clock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const university = (location.state as { university?: string } | null)?.university ?? 'umass_amherst'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setSubmitting(false)
      return
    }

    const signedInEmail = data.user?.email ?? ''
    if (!signedInEmail.toLowerCase().endsWith('@umass.edu')) {
      await supabase.auth.signOut()
      setError('This platform is for UMass Amherst students and staff only.')
      setSubmitting(false)
      return
    }

    localStorage.setItem('selected_university', university)

    setSubmitting(false)
    navigate('/map')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Left: brand panel */}
      <div className="relative hidden lg:flex lg:w-[55%] bg-gradient-to-br from-[#5f0f15] via-[#881c1c] to-[#a32d2d] text-white overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-black/20 blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <MapPin size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] opacity-80">UMass Amherst</div>
              <div className="font-display font-bold text-lg">Study Spaces</div>
            </div>
          </div>

          <div className="space-y-6 max-w-md">
            <h1 className="font-display text-5xl font-bold leading-[1.05]">
              Find your perfect study spot, in real time.
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Live occupancy, room reservations, and crowd-sourced reports — all in one place.
            </p>

            <div className="grid grid-cols-1 gap-3 pt-4">
              <Feature icon={<Clock size={18} />} title="Live occupancy" desc="See how full each space is right now" />
              <Feature icon={<MapPin size={18} />} title="Reservable rooms" desc="Book a slot in seconds" />
              <Feature icon={<Users size={18} />} title="Crowd-sourced" desc="Updated by fellow students" />
            </div>
          </div>

          <div className="text-xs text-white/60">
            © {new Date().getFullYear()} UMass Amherst Study Spaces · Copyright Sakshi Karand 2026
          </div>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden bg-gradient-to-r from-[#5f0f15] via-[#881c1c] to-[#7f1825] text-white px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
            <MapPin size={18} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] opacity-80">UMass Amherst</div>
            <div className="font-display font-bold">Study Spaces</div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm animate-fade-in">
            <div className="mb-8">
              <h2 className="font-display text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
              <p className="text-slate-500">Sign in with your UMass Amherst account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@umass.edu"
                    className="w-full rounded-xl border border-slate-200 bg-white px-10 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#881c1c]/30 focus:border-[#881c1c] transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-white px-10 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#881c1c]/30 focus:border-[#881c1c] transition"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5 animate-fade-in">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="group w-full bg-[#881c1c] text-white font-semibold rounded-xl py-3 text-sm hover:bg-[#6e1616] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
              Restricted to <span className="font-semibold text-slate-700">@umass.edu</span> accounts
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 group">
      <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
        {icon}
      </div>
      <div>
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-white/70 text-xs">{desc}</div>
      </div>
    </div>
  )
}
