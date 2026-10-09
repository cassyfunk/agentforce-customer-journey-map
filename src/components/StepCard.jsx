export default function StepCard({ touchpoint, onClick }) {
  return (
    <button
      onClick={() => onClick(touchpoint)}
      className="w-full text-left px-2.5 py-2 rounded-lg border border-slate-200 bg-white
        flex items-start gap-2
        transition-all duration-150 hover:shadow-md hover:-translate-y-0.5"
    >
      {touchpoint.stepNumber && (
        <span className="shrink-0 w-5 h-5 rounded-full bg-slate-200 text-slate-600
          text-[10px] font-bold flex items-center justify-center mt-0.5">
          {touchpoint.stepNumber}
        </span>
      )}
      <div className="min-w-0">
        <div className="text-xs font-medium text-slate-800 leading-snug">{touchpoint.label}</div>
        {touchpoint.path && (
          <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{touchpoint.path}</div>
        )}
      </div>
    </button>
  )
}
