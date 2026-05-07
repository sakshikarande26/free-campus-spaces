import { useState } from 'react'
import { Smile, Users, Flame, AlertCircle, X, Loader2, Sparkles } from 'lucide-react'
import { reportOccupancy } from '../lib/checkins'
import type { StudySpace } from '../types/database'

interface ReportOccupancyModalProps {
  space: StudySpace
  userId: string
  onClose: () => void
  onSuccess: () => void
}

type OccLevel = 'empty' | 'moderate' | 'busy'

const options: {
  value: OccLevel
  label: string
  desc: string
  icon: React.ReactNode
  activeClasses: string
}[] = [
  {
    value: 'empty',
    label: 'Nearly empty',
    desc: 'Plenty of seats',
    icon: <Smile size={20} strokeWidth={2.2} />,
    activeClasses: 'bg-emerald-50 border-emerald-400 text-emerald-800',
  },
  {
    value: 'moderate',
    label: 'Moderate',
    desc: 'Some seats left',
    icon: <Users size={20} strokeWidth={2.2} />,
    activeClasses: 'bg-amber-50 border-amber-400 text-amber-800',
  },
  {
    value: 'busy',
    label: 'Very busy',
    desc: 'Hard to find a seat',
    icon: <Flame size={20} strokeWidth={2.2} />,
    activeClasses: 'bg-rose-50 border-rose-400 text-rose-800',
  },
]

export default function ReportOccupancyModal({
  space,
  userId,
  onClose,
  onSuccess,
}: ReportOccupancyModalProps) {
  const [selected, setSelected] = useState<OccLevel | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!selected) return
    setSubmitting(true)
    setError(null)
    const { error: err } = await reportOccupancy(space.id, userId, selected)
    if (err) {
      setError(err)
      setSubmitting(false)
      return
    }
    setSubmitting(false)
    onSuccess()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl px-6 pt-4 pb-6 shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Sparkles size={18} strokeWidth={2.4} />
            </div>
            <div>
              <h2 className="font-display text-[17px] font-bold text-slate-900 leading-tight">Report occupancy</h2>
              <div className="text-[12px] text-slate-500">{space.name}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X size={16} strokeWidth={2.4} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-5">
          {options.map((opt) => {
            const isActive = selected === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelected(opt.value)}
                className={`text-center rounded-2xl px-2 py-3.5 border-2 transition-all ${
                  isActive
                    ? `${opt.activeClasses} shadow-sm`
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-center mb-1.5">{opt.icon}</div>
                <div className="text-[12px] font-bold">{opt.label}</div>
                <div className="text-[10.5px] opacity-80 mt-0.5">{opt.desc}</div>
              </button>
            )
          })}
        </div>

        <div className="mt-4 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-900 px-3.5 py-3 text-[12px] leading-relaxed flex gap-2.5 items-start">
          <Sparkles size={14} strokeWidth={2.4} className="shrink-0 mt-0.5" />
          <span>This is a free space — your report helps other students plan. No restrictions are placed on this space.</span>
        </div>

        {error && (
          <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 px-3.5 py-2.5 text-[12.5px] flex items-start gap-2 animate-fade-in">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selected || submitting}
          className={`mt-5 w-full font-semibold rounded-xl py-3 text-sm text-white transition-all shadow-sm flex items-center justify-center gap-2 ${
            !selected || submitting
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-[#881c1c] hover:bg-[#6e1616] hover:shadow-md'
          }`}
        >
          {submitting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit report'
          )}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full text-[12.5px] text-slate-500 hover:text-slate-700 py-2 font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
