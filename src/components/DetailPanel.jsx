import { X } from 'lucide-react'
import { SEVERITY_STYLES } from '../data/journeyData'

const STATUS_STYLES = {
  blocker: { icon: '🚫', badge: 'bg-red-100 text-red-700 border-red-300',   label: 'Blocked'  },
  success: { icon: '✅', badge: 'bg-green-100 text-green-700 border-green-300', label: 'Success' },
  mixed:   { icon: '⚡', badge: 'bg-amber-100 text-amber-700 border-amber-300', label: 'Mixed'   },
}

const SIDE_LABELS = {
  customer:   { label: 'Customer-side', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  salesforce: { label: 'Salesforce',    color: 'bg-violet-100 text-violet-700 border-violet-300' },
  partner:    { label: 'Partner / SI',  color: 'bg-amber-100 text-amber-700 border-amber-300' },
  enduser:    { label: 'End User',      color: 'bg-teal-100 text-teal-700 border-teal-300' },
}

export default function DetailPanel({ touchpoint, stage, onClose }) {
  if (!touchpoint) return null

  const isExample = touchpoint.lane === 'examples'
  const isActor   = touchpoint.lane === 'actors'
  const isStep    = touchpoint.lane === 'steps'
  const status = isExample ? STATUS_STYLES[touchpoint.status] ?? STATUS_STYLES.mixed : null
  const side   = isActor   ? SIDE_LABELS[touchpoint.side]   ?? SIDE_LABELS.customer  : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 pr-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {stage?.label}
            </span>
            {isExample ? (
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900">{touchpoint.company}</h2>
                {touchpoint.aov && (
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {touchpoint.aov}
                  </span>
                )}
              </div>
            ) : isActor ? (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl">{touchpoint.icon}</span>
                <h2 className="text-lg font-semibold text-slate-900">{touchpoint.label}</h2>
              </div>
            ) : isStep ? (
              <div className="flex items-center gap-2 mt-1">
                {touchpoint.stepNumber && (
                  <span className="w-6 h-6 rounded-full bg-cyan-200 text-cyan-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {touchpoint.stepNumber}
                  </span>
                )}
                <h2 className="text-lg font-semibold text-slate-900">{touchpoint.label}</h2>
              </div>
            ) : (
              <h2 className="text-lg font-semibold text-slate-900 mt-1">{touchpoint.label}</h2>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors mt-1 shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Customer example: status + outcome headline */}
        {isExample && (
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${status.badge}`}>
              {status.icon} {status.label}
            </span>
            <p className="text-sm font-medium text-slate-700">{touchpoint.label}</p>
          </div>
        )}

        {/* Detail text */}
        <p className="text-slate-600 text-sm leading-relaxed mb-4">{touchpoint.detail}</p>

        {/* Customer example: source */}
        {isExample && touchpoint.source && (
          <p className="text-xs text-slate-400 mt-2">
            Source: <span className="font-medium">{touchpoint.source}</span>
          </p>
        )}

        {/* Actor: side badge */}
        {isActor && side && (
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${side.color}`}>
              {side.label}
            </span>
          </div>
        )}

        {/* Step: Setup path */}
        {isStep && touchpoint.path && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-slate-400">Path:</span>
            <code className="text-xs bg-cyan-50 text-cyan-800 px-2 py-0.5 rounded font-mono">
              {touchpoint.path}
            </code>
          </div>
        )}

        {/* Regular card: severity */}
        {touchpoint.severity && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Severity:</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${SEVERITY_STYLES[touchpoint.severity]}`}>
              {touchpoint.severity}
            </span>
          </div>
        )}

        {/* Regular card: sentiment */}
        {!isExample && touchpoint.sentiment !== undefined && (
          <div className="mt-3 text-xs text-slate-500">
            Sentiment score: <strong>{touchpoint.sentiment > 0 ? '+' : ''}{touchpoint.sentiment}</strong>
          </div>
        )}
      </div>
    </div>
  )
}
