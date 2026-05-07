import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Building2, MapPin, Sparkles, Lock } from 'lucide-react'

interface College {
  id: string
  name: string
  subtitle: string
  live: boolean
}

const COLLEGES: College[] = [
  { id: 'umass_amherst', name: 'UMass Amherst', subtitle: 'University of Massachusetts', live: true },
  { id: 'amherst_college', name: 'Amherst College', subtitle: 'Liberal arts · Amherst, MA', live: false },
  { id: 'hampshire_college', name: 'Hampshire College', subtitle: 'Liberal arts · Amherst, MA', live: false },
  { id: 'mount_holyoke_college', name: 'Mount Holyoke College', subtitle: 'Liberal arts · South Hadley, MA', live: false },
  { id: 'smith_college', name: 'Smith College', subtitle: 'Liberal arts · Northampton, MA', live: false },
]

export default function UniversitySelectPage() {
  const navigate = useNavigate()

  function handleSelect(college: College) {
    if (!college.live) return
    navigate('/login', { state: { university: college.id } })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Left: maroon brand panel — same aesthetic as LoginPage */}
      <div className="relative hidden lg:flex lg:w-[42%] bg-gradient-to-br from-[#5f0f15] via-[#881c1c] to-[#a32d2d] text-white overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-black/20 blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <MapPin size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] opacity-80">Five College Consortium</div>
              <div className="font-display font-bold text-lg">Study Spaces</div>
            </div>
          </Link>

          <div className="space-y-6 max-w-md">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/70 font-semibold">
              Pick your campus
            </div>
            <h1 className="font-display text-[44px] font-bold leading-[1.05]">
              Choose your campus to continue.
            </h1>
            <p className="text-white/80 text-[16px] leading-relaxed">
              Your university unlocks the live map of every study space — free and reservable — across your campus.
            </p>

            <div className="grid grid-cols-1 gap-3 pt-4">
              <BrandFeature icon={<Building2 size={18} />} title="Five colleges" desc="UMass + four liberal arts campuses" />
              <BrandFeature icon={<Sparkles size={18} />} title="Live now at UMass" desc="More launching Fall 2026" />
            </div>
          </div>

          <div className="text-xs text-white/60">
            © {new Date().getFullYear()} Five College Consortium · Study Spaces
          </div>
        </div>
      </div>

      {/* Right: card selection panel */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden bg-gradient-to-r from-[#5f0f15] via-[#881c1c] to-[#7f1825] text-white px-6 py-5 flex items-center gap-3">
          <Link to="/" className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
            <MapPin size={18} strokeWidth={2.5} />
          </Link>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] opacity-80">Five College</div>
            <div className="font-display font-bold">Study Spaces</div>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center px-6 py-12 lg:py-16">
          <div className="w-full max-w-2xl mx-auto animate-fade-in">
            <div className="mb-8">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-[#881c1c] transition-colors mb-4"
              >
                <ArrowLeft size={13} strokeWidth={2.4} />
                Back to home
              </Link>
              <h2 className="font-display text-[32px] font-bold text-slate-900 leading-tight mb-2">
                Choose your campus
              </h2>
              <p className="text-slate-500 text-[15px]">
                Select your institution to continue.
              </p>
            </div>

            <div className="space-y-2.5">
              {COLLEGES.map((college) => (
                <CollegeRow
                  key={college.id}
                  college={college}
                  onSelect={() => handleSelect(college)}
                />
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-slate-200 text-center">
              <p className="text-[12px] text-slate-500">
                More campuses launching <span className="font-semibold text-slate-700">Fall 2026</span>.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function BrandFeature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 group">
      <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
        {icon}
      </div>
      <div>
        <div className="font-semibold text-[15px] text-white">{title}</div>
        <div className="text-white/70 text-[13px]">{desc}</div>
      </div>
    </div>
  )
}

function CollegeRow({
  college,
  onSelect,
}: {
  college: College
  onSelect: () => void
}) {
  const isLive = college.live

  if (!isLive) {
    return (
      <div
        className="group w-full text-left rounded-2xl bg-white border border-slate-200 px-5 py-4 flex items-center gap-4 cursor-not-allowed select-none opacity-65 relative"
        title="Coming soon"
      >
        <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
          <Building2 size={18} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold text-slate-700 truncate">{college.name}</div>
          <div className="text-[12.5px] text-slate-500 truncate">{college.subtitle}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2 py-0.5">
            <Lock size={9} strokeWidth={2.6} />
            Coming soon
          </span>
          <span className="sm:hidden inline-flex items-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2 py-0.5">
            Soon
          </span>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group w-full text-left rounded-2xl bg-white border border-slate-200 hover:border-[#881c1c] hover:shadow-md hover:bg-[#fff8f8] px-5 py-4 flex items-center gap-4 transition-all"
    >
      <div className="w-11 h-11 rounded-xl bg-[#fdf3f3] text-[#881c1c] flex items-center justify-center shrink-0 group-hover:bg-[#f7e0e0] transition-colors">
        <Building2 size={18} strokeWidth={2.2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-semibold text-slate-900 truncate">{college.name}</div>
        <div className="text-[12.5px] text-slate-500 truncate">{college.subtitle}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white bg-[#881c1c] rounded-full px-2 py-0.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          Live
        </span>
        <ArrowRight size={16} strokeWidth={2.4} className="text-slate-400 group-hover:text-[#881c1c] group-hover:translate-x-0.5 transition-all" />
      </div>
    </button>
  )
}
