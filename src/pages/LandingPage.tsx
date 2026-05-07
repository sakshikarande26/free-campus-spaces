import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Filter, Sparkles, CheckCircle2, X } from 'lucide-react'

const CARD_BG = 'rgba(255,255,255,0.03)'
const CARD_BORDER = '1px solid rgba(255,255,255,0.08)'

export default function LandingPage() {
  return (
    <div
      className="min-h-screen text-white"
      style={{ background: '#0a0a0a', fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' }}
    >
      {/* NAVBAR */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(10,10,10,0.85)',
          backdropFilter: 'saturate(180%) blur(12px)',
          WebkitBackdropFilter: 'saturate(180%) blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <Link to="/" className="text-white font-bold text-lg tracking-tight">
              Spaces
            </Link>
            <span className="text-[11px] text-[#888888] tracking-wide hidden sm:inline">
              Five College Consortium
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/select-university"
              className="px-4 py-2 rounded-lg text-sm text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
            >
              Sign in
            </Link>
            <Link
              to="/select-university"
              className="px-4 py-2 rounded-lg text-sm text-white font-medium hover:opacity-90 transition-all"
              style={{ background: '#881c1c' }}
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 20% 0%, rgba(136,28,28,0.20), transparent 60%), #0a0a0a',
        }}
      >
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(136,28,28,0.10), transparent 70%)' }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center pt-24">
          <div className="text-[11px] uppercase tracking-widest text-[#888888] mb-6 font-medium">
            Campus study space finder
          </div>
          <h1 className="font-bold leading-[1.05] mb-6" style={{ fontSize: 'clamp(40px, 8vw, 64px)' }}>
            <span className="block text-white">Find your place</span>
            <span className="block" style={{ color: '#881c1c' }}>to study.</span>
          </h1>
          <p className="text-[18px] text-[#888888] max-w-[480px] mx-auto leading-relaxed mb-8">
            Real-time occupancy across every study space on campus. Before you leave your room.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link
              to="/select-university"
              className="px-6 py-3 rounded-lg text-white font-medium inline-flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              style={{ background: '#881c1c' }}
            >
              Get started free
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/select-university"
              className="px-6 py-3 rounded-lg text-white border border-white/30 hover:border-white/60 hover:bg-white/5 transition-all inline-flex items-center justify-center"
            >
              See how it works
            </Link>
          </div>
          <div className="text-[13px] text-[#666666]">
            Available at all Five College campuses
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="px-6 py-24 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-[11px] uppercase tracking-widest text-[#888888] mb-6 font-medium">
            The problem
          </div>
          <div className="mb-3 font-bold leading-none" style={{ fontSize: 'clamp(48px, 9vw, 72px)' }}>
            25 minutes
          </div>
          <p className="text-[#888888] text-[18px] max-w-xl mb-12">
            wasted per student per session searching for a study space during finals week.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PainCard
              stat="0 centralized tools"
              desc="No campus-wide occupancy visibility today."
            />
            <PainCard
              stat="30,000+ students"
              desc="Competing for limited study space every day."
            />
            <PainCard
              stat="80% of spaces"
              desc="Never appear in any booking system."
            />
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="px-6 py-24 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-[11px] uppercase tracking-widest text-[#888888] mb-6 font-medium">
            The solution
          </div>
          <h2 className="text-white font-bold mb-12 leading-tight" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>
            Two types of spaces. <span className="text-[#888888]">One map.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="rounded-xl p-7 transition-all hover:bg-white/[0.05]"
              style={{ background: CARD_BG, border: CARD_BORDER }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] uppercase tracking-widest text-[#888888] font-medium">Free</span>
              </div>
              <h3 className="text-white text-xl font-bold mb-2">Free common spaces</h3>
              <p className="text-[#888888] text-[15px] leading-relaxed mb-5">
                Walk in anywhere. Crowd-sourced occupancy tells you how busy it is before you leave.
              </p>
              <div className="text-[12px] text-[#666666] tracking-wide">
                Grad Commons · CICS Lounge · Library floors
              </div>
            </div>

            <div
              className="rounded-xl p-7 transition-all hover:bg-white/[0.05]"
              style={{ background: CARD_BG, border: CARD_BORDER }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#881c1c' }} />
                <span className="text-[11px] uppercase tracking-widest text-[#888888] font-medium">Reservable</span>
              </div>
              <h3 className="text-white text-xl font-bold mb-2">Reservable rooms</h3>
              <p className="text-[#888888] text-[15px] leading-relaxed mb-5">
                Claim a time slot. Held exclusively for you. Auto-released if you don't show up within 10 minutes.
              </p>
              <div className="text-[12px] text-[#666666] tracking-wide">
                Study rooms · Collab labs · Event spaces
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-24 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-[11px] uppercase tracking-widest text-[#888888] mb-6 font-medium">
            How it works
          </div>
          <h2 className="text-white font-bold mb-12 leading-tight" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>
            Four steps. <span className="text-[#888888]">No friction.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <Step n={1} icon={<MapPin size={16} />} title="Open Spaces" desc="See the campus map with live occupancy." />
            <Step n={2} icon={<Filter size={16} />} title="Filter" desc="Quiet? Outlets? Pick what you need." />
            <Step n={3} icon={<Sparkles size={16} />} title="Pick a space" desc="Tap a pin. See capacity and hours." />
            <Step n={4} icon={<ArrowRight size={16} />} title="Go study" desc="Walk in or show up for your booking." />
          </div>
        </div>
      </section>

      {/* VS LIBCAL */}
      <section className="px-6 py-24 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-[11px] uppercase tracking-widest text-[#888888] mb-6 font-medium">
            Why not LibCal?
          </div>
          <h2 className="text-white font-bold mb-10 leading-tight" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>
            The full picture.
          </h2>

          <div
            className="rounded-xl overflow-hidden"
            style={{ background: CARD_BG, border: CARD_BORDER }}
          >
            <div
              className="grid grid-cols-3 px-5 py-3 text-[11px] uppercase tracking-widest text-[#888888] font-medium"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div>Feature</div>
              <div className="text-center">LibCal</div>
              <div className="text-center">Spaces</div>
            </div>
            {[
              'Free common spaces',
              'Live occupancy',
              'Full campus coverage',
              'Works before you leave',
              'University-owned',
            ].map((label, i, arr) => (
              <div
                key={label}
                className="grid grid-cols-3 px-5 py-4 items-center"
                style={
                  i < arr.length - 1
                    ? { borderBottom: '1px solid rgba(255,255,255,0.05)' }
                    : undefined
                }
              >
                <div className="text-white text-[14px]">{label}</div>
                <div className="flex justify-center">
                  <X size={18} className="text-[#666666]" strokeWidth={2.4} />
                </div>
                <div className="flex justify-center">
                  <CheckCircle2 size={18} className="text-emerald-500" strokeWidth={2.4} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FIVE COLLEGES */}
      <section className="px-6 py-24 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-[11px] uppercase tracking-widest text-[#888888] mb-6 font-medium">
            Five College Consortium
          </div>
          <h2 className="text-white font-bold mb-12 leading-tight" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>
            One app. <span className="text-[#888888]">Five campuses.</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <CollegeCard name="UMass Amherst" live />
            <CollegeCard name="Amherst College" />
            <CollegeCard name="Hampshire College" />
            <CollegeCard name="Mount Holyoke College" />
            <CollegeCard name="Smith College" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 border-t text-center" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-white font-bold mb-4 leading-tight" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>
            Ready to find your space?
          </h2>
          <p className="text-[#888888] text-[18px] mb-8">
            Join students across the Five Colleges.
          </p>
          <Link
            to="/select-university"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg text-white font-medium hover:opacity-90 transition-all"
            style={{ background: '#881c1c' }}
          >
            Get started — it's free
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="px-6 py-8"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#666666]">
          <div>Spaces · Five College Consortium</div>
          <div>CS 520 · Spring 2026 · Team 06 · UMass Amherst</div>
        </div>
      </footer>
    </div>
  )
}

function PainCard({ stat, desc }: { stat: string; desc: string }) {
  return (
    <div
      className="rounded-xl p-6 transition-all hover:bg-white/[0.05]"
      style={{
        background: CARD_BG,
        border: CARD_BORDER,
        borderLeft: '3px solid #881c1c',
      }}
    >
      <div className="text-white font-bold text-[20px] mb-2 leading-tight">{stat}</div>
      <p className="text-[#888888] text-[14px] leading-relaxed">{desc}</p>
    </div>
  )
}

function Step({ n, icon, title, desc }: { n: number; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div
      className="rounded-xl p-6 transition-all hover:bg-white/[0.05]"
      style={{ background: CARD_BG, border: CARD_BORDER }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center mb-4 text-white text-[13px] font-bold"
        style={{ background: '#881c1c' }}
      >
        {n}
      </div>
      <div className="flex items-center gap-1.5 mb-1.5 text-white">
        <span className="text-[#888888]">{icon}</span>
        <h3 className="font-bold text-[15px]">{title}</h3>
      </div>
      <p className="text-[#888888] text-[13px] leading-relaxed">{desc}</p>
    </div>
  )
}

function CollegeCard({ name, live = false }: { name: string; live?: boolean }) {
  return (
    <div
      className="rounded-xl p-5 transition-all relative hover:bg-white/[0.05]"
      style={{ background: CARD_BG, border: CARD_BORDER }}
    >
      <div className="text-white font-semibold text-[14px] leading-tight pr-2">{name}</div>
      <div className="mt-3">
        {live ? (
          <span
            className="inline-block text-[9.5px] uppercase tracking-widest font-bold rounded-full px-2 py-0.5 text-white"
            style={{ background: '#881c1c' }}
          >
            Live
          </span>
        ) : (
          <span
            className="inline-block text-[9.5px] uppercase tracking-widest font-bold rounded-full px-2 py-0.5 text-[#888888]"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Coming soon
          </span>
        )}
      </div>
    </div>
  )
}
