import { Link } from 'react-router-dom'
import {
  ArrowRight,
  MapPin,
  Clock,
  Users,
  Filter,
  Sparkles,
  CheckCircle2,
  X,
  CalendarCheck,
  Building2,
  Search,
  Plug,
  Presentation,
  Zap,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#881c1c] to-[#5f0f15] text-white flex items-center justify-center shadow-sm">
              <MapPin size={17} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-semibold">UMass Amherst</div>
              <span className="font-display font-bold tracking-tight text-[15px] text-slate-900">Study Spaces</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-slate-600">
            <a href="#how" className="hover:text-slate-900 transition-colors">How it works</a>
            <a href="#solution" className="hover:text-slate-900 transition-colors">Spaces</a>
            <a href="#colleges" className="hover:text-slate-900 transition-colors">Campuses</a>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/select-university"
              className="px-4 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-100 transition-colors font-medium"
            >
              Sign in
            </Link>
            <Link
              to="/select-university"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white font-semibold bg-[#881c1c] hover:bg-[#6e1616] transition-colors shadow-sm"
            >
              Get started
              <ArrowRight size={14} strokeWidth={2.4} />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO — single-column centered with subtle ambient gradient */}
      <section
        className="relative px-6 pt-20 pb-24 overflow-hidden"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(136,28,28,0.08), transparent 60%), radial-gradient(ellipse 80% 50% at 100% 100%, rgba(136,28,28,0.05), transparent 60%)',
        }}
      >
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 shadow-sm px-3 py-1.5 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11.5px] font-semibold text-slate-700">
              Live at UMass Amherst
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-[11.5px] text-slate-500">11 spaces tracked</span>
          </div>

          <h1
            className="font-display font-bold leading-[1.02] mb-6 text-slate-900 tracking-tight"
            style={{ fontSize: 'clamp(44px, 7.5vw, 80px)' }}
          >
            Find your perfect{' '}
            <span className="relative inline-block">
              <span className="text-[#881c1c]">study spot</span>
              <svg
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                className="absolute left-0 -bottom-1 w-full h-2.5"
                aria-hidden="true"
              >
                <path
                  d="M2 8 C 50 2, 150 2, 198 8"
                  stroke="#881c1c"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </svg>
            </span>
            ,<br className="hidden sm:block" /> before you leave your room.
          </h1>

          <p className="text-slate-600 text-[18px] leading-relaxed max-w-2xl mx-auto mb-10">
            Real-time occupancy, room reservations, and crowd-sourced reports across every study space on campus —
            all in one map.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/select-university"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold bg-[#881c1c] hover:bg-[#6e1616] transition-all shadow-md hover:shadow-lg text-[15px]"
            >
              Get started — it's free
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-slate-800 font-semibold border border-slate-300 bg-white hover:bg-slate-50 transition-colors text-[15px]"
            >
              See how it works
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12.5px] text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" strokeWidth={2.4} />
              No app to download
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" strokeWidth={2.4} />
              UMass SSO sign-in
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" strokeWidth={2.4} />
              Five College ready
            </span>
          </div>
        </div>

        {/* App preview mockup */}
        <div className="relative z-10 max-w-5xl mx-auto mt-16">
          <AppPreview />
        </div>
      </section>

      {/* STATS BAR */}
      <section className="px-6 py-12 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <Stat value="25 min" label="wasted searching during finals" />
          <Stat value="30,000+" label="UMass students competing for seats" accent />
          <Stat value="11" label="study spaces live today" />
          <Stat value="5" label="campuses in the consortium" />
        </div>
      </section>

      {/* SOLUTION */}
      <section id="solution" className="px-6 py-24 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>The solution</SectionLabel>
          <SectionTitle>
            Two types of spaces. <span className="text-slate-400">One map.</span>
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
            <SolutionCard
              icon={<MapPin size={18} strokeWidth={2.4} />}
              iconBg="bg-emerald-50 text-emerald-700"
              dotColor="bg-emerald-500"
              tag="Free"
              title="Free common spaces"
              desc="Walk in anywhere. Crowd-sourced occupancy tells you how busy it is before you leave your dorm."
              examples="Grad Commons · CICS Lounge · Library floors"
            />
            <SolutionCard
              icon={<CalendarCheck size={18} strokeWidth={2.4} />}
              iconBg="bg-[#fdf3f3] text-[#881c1c]"
              dotColor="bg-[#881c1c]"
              tag="Reservable"
              title="Reservable rooms"
              desc="Claim a time slot. Held exclusively for you. Auto-released if you don't show up within 10 minutes."
              examples="Study rooms · Collab labs · Event spaces"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="px-6 py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <SectionLabel>How it works</SectionLabel>
          <SectionTitle>
            Four steps. <span className="text-slate-400">No friction.</span>
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
            <Step n={1} icon={<MapPin size={16} strokeWidth={2.4} />} title="Open Spaces" desc="See the campus map with live occupancy on every pin." />
            <Step n={2} icon={<Filter size={16} strokeWidth={2.4} />} title="Filter" desc="Quiet? Outlets? Whiteboards? Pick what you need." />
            <Step n={3} icon={<Sparkles size={16} strokeWidth={2.4} />} title="Pick a space" desc="Tap a pin. See capacity, photos, and current occupancy." />
            <Step n={4} icon={<Zap size={16} strokeWidth={2.4} />} title="Go study" desc="Walk in or show up for your booking. That's it." />
          </div>
        </div>
      </section>

      {/* VS LIBCAL */}
      <section className="px-6 py-24 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Why not LibCal?</SectionLabel>
          <SectionTitle>The full picture.</SectionTitle>

          <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm mt-10">
            <div className="grid grid-cols-3 px-5 py-3.5 text-[10.5px] uppercase tracking-[0.16em] text-slate-500 font-bold border-b border-slate-200 bg-slate-50">
              <div>Feature</div>
              <div className="text-center">LibCal</div>
              <div className="text-center text-[#881c1c]">Spaces</div>
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
                className={`grid grid-cols-3 px-5 py-4 items-center ${
                  i < arr.length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                <div className="text-slate-800 text-[14px] font-medium">{label}</div>
                <div className="flex justify-center">
                  <X size={18} className="text-slate-300" strokeWidth={2.4} />
                </div>
                <div className="flex justify-center">
                  <CheckCircle2 size={18} className="text-emerald-600" strokeWidth={2.4} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FIVE COLLEGES */}
      <section id="colleges" className="px-6 py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Five College Consortium</SectionLabel>
          <SectionTitle>
            One app. <span className="text-slate-400">Five campuses.</span>
          </SectionTitle>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-12">
            <CollegeCard name="UMass Amherst" subtitle="Live now" live />
            <CollegeCard name="Amherst College" subtitle="Liberal arts" />
            <CollegeCard name="Hampshire College" subtitle="Liberal arts" />
            <CollegeCard name="Mount Holyoke College" subtitle="Liberal arts" />
            <CollegeCard name="Smith College" subtitle="Liberal arts" />
          </div>

          <p className="mt-8 text-[12.5px] text-slate-500 text-center">
            More campuses launching <span className="font-semibold text-slate-700">Fall 2026</span>.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-24 bg-gradient-to-br from-[#5f0f15] via-[#881c1c] to-[#a32d2d] text-white text-center overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-black/20 blur-3xl" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="font-display font-bold mb-4 leading-tight" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>
            Ready to find your space?
          </h2>
          <p className="text-white/85 text-[17px] mb-8">
            Join students across the Five Colleges.
          </p>
          <Link
            to="/select-university"
            className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-[#881c1c] font-semibold bg-white hover:bg-slate-100 transition-colors shadow-md text-[15px]"
          >
            Get started — it's free
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-slate-500">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#881c1c] to-[#5f0f15] text-white flex items-center justify-center">
              <MapPin size={13} strokeWidth={2.5} />
            </div>
            <span className="font-medium">Spaces · Five College Consortium</span>
          </div>
          <div>CS 520 · Spring 2026 · Team 06 · UMass Amherst</div>
        </div>
      </footer>
    </div>
  )
}

/* ─────────── Helpers / sub-components ─────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] uppercase tracking-[0.22em] text-[#881c1c] font-semibold mb-4">
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-display font-bold text-slate-900 leading-tight"
      style={{ fontSize: 'clamp(32px, 5vw, 44px)' }}
    >
      {children}
    </h2>
  )
}

function Stat({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div>
      <div
        className={`font-display font-bold leading-none mb-2 ${accent ? 'text-[#ff7a7a]' : 'text-white'}`}
        style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}
      >
        {value}
      </div>
      <div className="text-[12.5px] text-slate-400 leading-relaxed">{label}</div>
    </div>
  )
}

function SolutionCard({
  icon,
  iconBg,
  dotColor,
  tag,
  title,
  desc,
  examples,
}: {
  icon: React.ReactNode
  iconBg: string
  dotColor: string
  tag: string
  title: string
  desc: string
  examples: string
}) {
  return (
    <div className="rounded-2xl p-7 bg-white border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all">
      <div className="flex items-center justify-between mb-5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-slate-500 font-bold">{tag}</span>
        </div>
      </div>
      <h3 className="font-display text-slate-900 text-[20px] font-bold mb-2">{title}</h3>
      <p className="text-slate-600 text-[14.5px] leading-relaxed mb-5">{desc}</p>
      <div className="text-[12px] text-slate-500 tracking-wide font-medium pt-4 border-t border-slate-100">
        {examples}
      </div>
    </div>
  )
}

function Step({ n, icon, title, desc }: { n: number; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl p-6 bg-white border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-full bg-[#881c1c] text-white flex items-center justify-center font-bold text-[13px] shadow-sm">
          {n}
        </div>
        <span className="text-[#881c1c]">{icon}</span>
      </div>
      <h3 className="font-display font-bold text-slate-900 text-[15.5px] mb-1">{title}</h3>
      <p className="text-slate-600 text-[13px] leading-relaxed">{desc}</p>
    </div>
  )
}

function CollegeCard({ name, subtitle, live = false }: { name: string; subtitle: string; live?: boolean }) {
  return (
    <div
      className={`rounded-2xl p-5 bg-white border transition-all relative hover:shadow-md ${
        live ? 'border-[#881c1c]/30 shadow-sm' : 'border-slate-200'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
          live ? 'bg-[#fdf3f3] text-[#881c1c]' : 'bg-slate-100 text-slate-400'
        }`}
      >
        <Building2 size={17} strokeWidth={2.2} />
      </div>
      <div className="text-slate-900 font-display font-bold text-[14px] leading-tight">{name}</div>
      <div className="text-[11.5px] text-slate-500 mt-0.5">{subtitle}</div>
      <div className="mt-4">
        {live ? (
          <span className="inline-flex items-center gap-1 text-[9.5px] uppercase tracking-[0.16em] font-bold rounded-full px-2 py-0.5 text-white bg-[#881c1c]">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Live
          </span>
        ) : (
          <span className="inline-block text-[9.5px] uppercase tracking-[0.16em] font-bold rounded-full px-2 py-0.5 text-slate-500 bg-slate-100 border border-slate-200">
            Coming soon
          </span>
        )}
      </div>
    </div>
  )
}

/* ─────────── App preview mockup ─────────── */

function AppPreview() {
  return (
    <div className="relative">
      {/* Soft maroon glow behind */}
      <div className="absolute -inset-8 bg-gradient-to-br from-[#881c1c]/15 via-transparent to-[#881c1c]/15 rounded-[40px] blur-2xl" aria-hidden="true" />

      <div
        className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-white"
        style={{ aspectRatio: '16 / 9' }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-200 bg-slate-50">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <div className="ml-3 flex-1 max-w-md mx-auto bg-white border border-slate-200 rounded-md px-3 py-1 text-[10.5px] text-slate-500 text-center font-medium">
            spaces.umass.edu/map
          </div>
        </div>

        {/* App body — sidebar + map */}
        <div className="grid h-full" style={{ gridTemplateColumns: '220px 1fr' }}>
          {/* Sidebar */}
          <aside className="border-r border-slate-200 bg-white p-3 overflow-hidden">
            <div className="relative mb-3">
              <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
              <div className="bg-slate-100 rounded-md pl-6 pr-2 py-1.5 text-[10px] text-slate-400">
                Search…
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              <Pill active>All</Pill>
              <Pill>Free</Pill>
              <Pill>Reservable</Pill>
            </div>
            <div className="flex flex-wrap gap-1 mb-4">
              <Pill icon={<Plug size={9} strokeWidth={2.4} />}>Outlets</Pill>
              <Pill icon={<Presentation size={9} strokeWidth={2.4} />}>Whiteboard</Pill>
            </div>

            <div className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-2 px-0.5">
              Study spaces
            </div>
            <PreviewSpace name="Grad Commons" location="W.E.B. Du Bois · Lower" type="free" pct={20} dot="emerald" label="Nearly empty" />
            <PreviewSpace name="CICS Lounge" location="CICS · Ground" type="free" pct={55} dot="amber" label="Moderate" />
            <PreviewSpace name="Lederle 301" location="Lederle · 3rd" type="reservable" />
            <PreviewSpace name="Du Bois Floor 10" location="Library · 10th" type="free" pct={85} dot="rose" label="Very busy" />
          </aside>

          {/* Map */}
          <div className="relative bg-gradient-to-br from-[#f5f5f0] via-[#eee9e1] to-[#e9e2d6] overflow-hidden">
            {/* Stylized streets */}
            <svg viewBox="0 0 600 400" className="absolute inset-0 w-full h-full opacity-50">
              <defs>
                <pattern id="streets" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M 0 40 H 80 M 40 0 V 80" stroke="#c8c1b3" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="600" height="400" fill="url(#streets)" />
              <path d="M0 180 Q 200 140 600 200" stroke="#bbb2a0" strokeWidth="3" fill="none" />
              <path d="M0 250 Q 300 230 600 270" stroke="#bbb2a0" strokeWidth="2" fill="none" />
              <path d="M120 0 Q 140 200 200 400" stroke="#bbb2a0" strokeWidth="2.5" fill="none" />
              <path d="M380 0 Q 400 150 420 400" stroke="#bbb2a0" strokeWidth="2" fill="none" />
              <rect x="240" y="140" width="80" height="60" fill="#d4cdbc" opacity="0.5" rx="4" />
              <rect x="430" y="220" width="60" height="50" fill="#d4cdbc" opacity="0.5" rx="4" />
            </svg>

            {/* Pins */}
            <Pin x="22%" y="32%" color="#27500A" />
            <Pin x="48%" y="22%" color="#854F0B" />
            <Pin x="38%" y="58%" color="#A32D2D" />
            <Pin x="68%" y="42%" color="#881c1c" solid pulse />
            <Pin x="78%" y="68%" color="#27500A" />
            <Pin x="14%" y="74%" color="#881c1c" solid />

            {/* Legend */}
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur rounded-lg border border-slate-200 px-2.5 py-1.5 text-[8.5px] shadow-sm space-y-0.5">
              <LegendDot color="#27500A" label="Empty" />
              <LegendDot color="#854F0B" label="Moderate" />
              <LegendDot color="#A32D2D" label="Busy" />
            </div>
          </div>
        </div>

        {/* Bottom detail strip */}
        <div className="absolute bottom-0 inset-x-0 bg-white border-t border-slate-200 p-3 grid grid-cols-[1fr_auto] gap-4 items-center" style={{ minHeight: 64 }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#fdf3f3] text-[#881c1c] flex items-center justify-center">
              <CalendarCheck size={14} strokeWidth={2.4} />
            </div>
            <div>
              <div className="text-[11.5px] font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                Lederle Study Room 301
                <span className="text-[7.5px] uppercase tracking-widest font-bold text-[#881c1c] bg-[#fdf3f3] rounded-full px-1.5 py-0.5">
                  Reservable
                </span>
              </div>
              <div className="text-[9.5px] text-slate-500 mt-0.5 flex items-center gap-2">
                <span className="inline-flex items-center gap-0.5"><Users size={9} strokeWidth={2.4} />6</span>
                <span>·</span>
                <span className="inline-flex items-center gap-0.5"><Clock size={9} strokeWidth={2.4} />Until 22:00</span>
                <span>·</span>
                <span>Outlets · Whiteboard</span>
              </div>
            </div>
          </div>
          <div className="bg-[#881c1c] text-white text-[10.5px] font-semibold rounded-md px-3 py-1.5 inline-flex items-center gap-1">
            Reserve a slot
            <ArrowRight size={11} strokeWidth={2.6} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Pill({ active, icon, children }: { active?: boolean; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[9px] font-semibold rounded-full px-1.5 py-0.5 border ${
        active ? 'bg-[#881c1c] text-white border-[#881c1c]' : 'bg-white text-slate-700 border-slate-200'
      }`}
    >
      {icon}
      {children}
    </span>
  )
}

function PreviewSpace({
  name,
  location,
  type,
  pct,
  dot,
  label,
}: {
  name: string
  location: string
  type: 'free' | 'reservable'
  pct?: number
  dot?: 'emerald' | 'amber' | 'rose'
  label?: string
}) {
  const dotColor = dot === 'emerald' ? 'bg-emerald-500' : dot === 'amber' ? 'bg-amber-500' : 'bg-rose-500'
  const barColor = dot === 'emerald' ? 'bg-emerald-500' : dot === 'amber' ? 'bg-amber-500' : 'bg-rose-500'
  return (
    <div className="rounded-md border border-slate-200 px-2 py-1.5 mb-1.5 bg-white">
      <div className="flex items-start gap-1.5">
        <div className={`shrink-0 w-5 h-5 rounded-md flex items-center justify-center ${type === 'reservable' ? 'bg-[#fdf3f3] text-[#881c1c]' : 'bg-emerald-50 text-emerald-700'}`}>
          {type === 'reservable' ? <CalendarCheck size={10} strokeWidth={2.4} /> : <MapPin size={10} strokeWidth={2.4} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold text-slate-900 leading-tight truncate">{name}</div>
          <div className="text-[8.5px] text-slate-500 truncate">{location}</div>
        </div>
      </div>
      {type === 'free' && pct !== undefined && (
        <>
          <div className="flex items-center gap-1 mt-1">
            <span className={`w-1 h-1 rounded-full ${dotColor}`} />
            <span className="text-[8.5px] text-slate-600 font-medium">{label}</span>
          </div>
          <div className="mt-1 h-0.5 rounded-full bg-slate-100 overflow-hidden">
            <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }} />
          </div>
        </>
      )}
      {type === 'reservable' && (
        <div className="text-[8.5px] text-[#881c1c] font-semibold mt-1">Book a slot →</div>
      )}
    </div>
  )
}

function Pin({ x, y, color, solid, pulse }: { x: string; y: string; color: string; solid?: boolean; pulse?: boolean }) {
  return (
    <div
      className="absolute"
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      <div
        className={`rounded-full ${pulse ? 'pin-pulse' : ''}`}
        style={{
          width: pulse ? 18 : 14,
          height: pulse ? 18 : 14,
          background: solid ? color : '#ffffff',
          border: `2.5px solid ${color}`,
          boxShadow: '0 2px 5px rgba(0,0,0,0.18)',
        }}
      />
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-block w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="text-slate-700">{label}</span>
    </div>
  )
}
