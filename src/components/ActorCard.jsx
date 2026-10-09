const ROLE_STYLES = {
  customer:   { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-800',   dot: 'bg-blue-500'   },
  salesforce: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-800', dot: 'bg-violet-500' },
  partner:    { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-800',  dot: 'bg-amber-500'  },
  enduser:    { bg: 'bg-teal-50',   border: 'border-teal-200',   text: 'text-teal-800',   dot: 'bg-teal-500'   },
}

export default function ActorCard({ actor, onClick }) {
  const s = ROLE_STYLES[actor.side] ?? ROLE_STYLES.customer

  return (
    <button
      onClick={() => onClick(actor)}
      className={`
        w-full text-left px-2.5 py-2 rounded-lg border
        ${s.bg} ${s.border}
        flex items-center gap-2
        transition-all duration-150 hover:shadow-sm hover:brightness-95
      `}
    >
      <span className={`shrink-0 w-2 h-2 rounded-full ${s.dot}`} />
      <div className="min-w-0">
        <div className={`text-xs font-semibold truncate ${s.text}`}>{actor.label}</div>
        {actor.sublabel && (
          <div className="text-[10px] text-slate-500 truncate">{actor.sublabel}</div>
        )}
      </div>
    </button>
  )
}
