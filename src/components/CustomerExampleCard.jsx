const STATUS = {
  blocker: { icon: '🚫', bg: 'bg-red-50',   border: 'border-l-red-400',   badge: 'bg-red-100 text-red-700',   label: 'Blocked'  },
  success: { icon: '✅', bg: 'bg-green-50', border: 'border-l-green-400', badge: 'bg-green-100 text-green-700', label: 'Success'  },
  mixed:   { icon: '⚡', bg: 'bg-amber-50', border: 'border-l-amber-400', badge: 'bg-amber-100 text-amber-700', label: 'Mixed'    },
}

export default function CustomerExampleCard({ touchpoint, onClick }) {
  const s = STATUS[touchpoint.status] ?? STATUS.mixed

  return (
    <button
      onClick={() => onClick(touchpoint)}
      className={`
        w-full text-left p-2.5 rounded-lg border border-slate-200 border-l-4
        ${s.bg} ${s.border}
        transition-all duration-150 hover:shadow-md hover:-translate-y-0.5
      `}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-sm shrink-0">{s.icon}</span>
          <span className="text-xs font-bold text-slate-800 truncate">{touchpoint.company}</span>
        </div>
        {touchpoint.aov && (
          <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap shrink-0">
            {touchpoint.aov}
          </span>
        )}
      </div>
      <p className="text-[11px] text-slate-600 mt-1 leading-snug line-clamp-2">
        {touchpoint.label}
      </p>
    </button>
  )
}
