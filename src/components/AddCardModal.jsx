import { useState } from 'react'
import { LANES } from '../data/journeyData'
import { useCollaboration } from '../context/CollaborationContext'

const SEVERITY_OPTIONS = ['low', 'medium', 'high', 'critical']
const STATUS_OPTIONS   = ['success', 'mixed', 'blocker']

export default function AddCardModal({ stageId, stageLabel, lane, onClose }) {
  const { author, setAuthor, addCustomCard } = useCollaboration()
  const [nameInput, setNameInput] = useState('')
  const [form, setForm] = useState({
    label: '', notes: '', severity: 'medium', status: 'mixed', company: '', aov: '',
  })
  const [saving, setSaving] = useState(false)

  const isExamples = lane === 'examples'
  const laneInfo   = LANES.find(l => l.id === lane)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async e => {
    e.preventDefault()
    if (!form.label.trim() || saving) return
    setSaving(true)

    const cardData = { label: form.label.trim(), notes: form.notes.trim() || null }
    if (lane === 'pain_points' || lane === 'opportunities') cardData.severity = form.severity
    if (isExamples) {
      cardData.status  = form.status
      cardData.company = form.company.trim() || null
      cardData.aov     = form.aov.trim() || null
    }

    await addCustomCard(stageId, lane, cardData)
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {laneInfo?.icon} {laneInfo?.label}
            </div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">Add card to {stageLabel}</div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 text-slate-500">✕</button>
        </div>

        {/* Name prompt */}
        {!author && (
          <form
            onSubmit={e => { e.preventDefault(); if (nameInput.trim()) setAuthor(nameInput.trim()) }}
            className="border-b border-slate-200 p-4 bg-blue-50"
          >
            <p className="text-xs text-blue-700 mb-2">What should we call you?</p>
            <div className="flex gap-2">
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                placeholder="Your name"
                className="flex-1 text-sm border border-blue-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                autoFocus
              />
              <button type="submit" className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Set</button>
            </div>
          </form>
        )}

        {/* Form */}
        <form onSubmit={submit} className="p-5 space-y-4">
          {/* Label */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {isExamples ? 'Outcome / what happened' : 'Content'} <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.label}
              onChange={e => set('label', e.target.value)}
              placeholder={isExamples ? 'Describe the customer outcome…' : 'What goes on this card?'}
              rows={3}
              className="w-full text-sm border border-slate-200 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Notes / context</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Optional background or source…"
              rows={2}
              className="w-full text-sm border border-slate-200 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          {/* Customer example fields */}
          {isExamples && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Company</label>
                <input
                  value={form.company}
                  onChange={e => set('company', e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full text-sm border border-slate-200 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">AOV / Size</label>
                <input
                  value={form.aov}
                  onChange={e => set('aov', e.target.value)}
                  placeholder="$100K"
                  className="w-full text-sm border border-slate-200 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
            </div>
          )}

          {/* Status (examples) */}
          {isExamples && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
              <div className="flex gap-2">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => set('status', opt)}
                    className={`text-xs px-3 py-1 rounded-full border capitalize transition-colors ${
                      form.status === opt
                        ? opt === 'success' ? 'bg-green-600 text-white border-green-600'
                          : opt === 'blocker' ? 'bg-red-600 text-white border-red-600'
                          : 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white text-slate-500 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {opt === 'success' ? '✅' : opt === 'blocker' ? '🚫' : '⚡'} {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Severity (pain points / opportunities) */}
          {(lane === 'pain_points' || lane === 'opportunities') && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Severity</label>
              <div className="flex gap-2">
                {SEVERITY_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => set('severity', opt)}
                    className={`text-xs px-3 py-1 rounded-full border capitalize transition-colors ${
                      form.severity === opt
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white text-slate-500 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-slate-500 px-4 py-2 rounded hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!form.label.trim() || !author || saving}
              className="text-sm bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving…' : 'Add card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
