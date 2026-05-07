import { useState } from 'react'
import { Flag, AlertCircle, X, Loader2 } from 'lucide-react'
import { flagWrongData } from '../lib/checkins'
import type { StudySpace } from '../types/database'

interface FlagWrongDataModalProps {
  space: StudySpace
  userId: string
  onClose: () => void
  onSuccess: () => void
}

export default function FlagWrongDataModal({
  space,
  userId,
  onClose,
  onSuccess,
}: FlagWrongDataModalProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    const { error: err } = await flagWrongData(space.id, userId)
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
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Flag size={18} strokeWidth={2.4} />
            </div>
            <div>
              <h2 className="font-display text-[17px] font-bold text-slate-900 leading-tight">Something look wrong?</h2>
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

        <div className="mt-4 rounded-xl border bg-amber-50 border-amber-200 text-amber-900 px-3.5 py-3 text-[12.5px] leading-relaxed flex gap-2.5 items-start">
          <AlertCircle size={14} strokeWidth={2.4} className="shrink-0 mt-0.5" />
          <span>Your flag helps us improve accuracy. One tap is all it takes — no form needed.</span>
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
          disabled={submitting}
          className={`mt-5 w-full font-semibold rounded-xl py-3 text-sm text-white transition-all shadow-sm flex items-center justify-center gap-2 ${
            submitting
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-[#881c1c] hover:bg-[#6e1616] hover:shadow-md'
          }`}
        >
          {submitting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Flagging...
            </>
          ) : (
            <>
              <Flag size={14} strokeWidth={2.4} />
              Yes, flag this data
            </>
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
