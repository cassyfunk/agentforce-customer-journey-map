import { SEVERITY_STYLES } from '../data/journeyData'

export default function TouchpointCard({ touchpoint, onClick }) {
  const isPainPoint = touchpoint.lane === 'pain_points'

  return (
    <button
      onClick={() => onClick(touchpoint)}
      className={`
        w-full text-left p-2.5 rounded-lg border text-xs leading-snug
        transition-all duration-150 hover:shadow-md hover:-translate-y-0.5
        ${isPainPoint && touchpoint.severity
          ? SEVERITY_STYLES[touchpoint.severity]
          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}
      `}
    >
      <span className="font-medium line-clamp-3">{touchpoint.label}</span>
    </button>
  )
}
