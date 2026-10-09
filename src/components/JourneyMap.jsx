import { useRef, useState } from 'react'
import { ACTORS, EXAMPLES, LANES, STAGES, STAGE_COLORS, STEPS, TOUCHPOINTS } from '../data/journeyData'
import { useCollaboration } from '../context/CollaborationContext'
import ActorCard from './ActorCard'
import AddCardModal from './AddCardModal'
import CommentPanel from './CommentPanel'
import CustomerExampleCard from './CustomerExampleCard'
import DetailPanel from './DetailPanel'
import EditableCard from './EditableCard'
import EmotionCurve from './EmotionCurve'
import StepCard from './StepCard'
import TouchpointCard from './TouchpointCard'

const LABEL_COL_WIDTH = 140
const MIN_COL_WIDTH   = 160

export default function JourneyMap() {
  const { isConfigured, customCards } = useCollaboration()

  const [selected,    setSelected]    = useState(null)
  const [commentCard, setCommentCard] = useState(null)
  const [addTarget,   setAddTarget]   = useState(null)
  const [activeLanes, setActiveLanes] = useState(new Set(LANES.map(l => l.id)))
  // null = 1fr (equal fill), number = pinned px width
  const [colWidths, setColWidths]     = useState(STAGES.map(() => null))

  const dragRef = useRef(null)

  const ALL_ITEMS = [...TOUCHPOINTS, ...EXAMPLES, ...ACTORS, ...STEPS, ...customCards]

  const toggleLane = id => {
    setActiveLanes(prev => {
      const next = new Set(prev)
      if (next.has(id)) { if (next.size > 1) next.delete(id) }
      else next.add(id)
      return next
    })
  }

  const startDrag = (e, colIndex) => {
    e.preventDefault()
    const currentWidth = e.currentTarget.parentElement.offsetWidth
    dragRef.current = { colIndex, startX: e.clientX, startWidth: currentWidth }

    setColWidths(prev => prev.map((w, i) => i === colIndex ? currentWidth : w))

    const onMove = ev => {
      if (!dragRef.current) return
      const delta = ev.clientX - dragRef.current.startX
      const next  = Math.max(MIN_COL_WIDTH, dragRef.current.startWidth + delta)
      setColWidths(prev => prev.map((w, i) => i === dragRef.current.colIndex ? next : w))
    }

    const onUp = () => {
      dragRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const selectedStage = selected ? STAGES.find(s => s.id === selected.stageId) : null
  const gridCols      = `${LABEL_COL_WIDTH}px ${colWidths.map(w => w ? `${w}px` : '1fr').join(' ')}`
  const visibleLanes  = LANES.filter(l => activeLanes.has(l.id))

  function renderCard(item) {
    const card = (
      item.lane === 'actors'   ? <ActorCard           key={item.id} actor={item}      onClick={setSelected} /> :
      item.lane === 'steps'    ? <StepCard            key={item.id} touchpoint={item} onClick={setSelected} /> :
      item.lane === 'examples' ? <CustomerExampleCard key={item.id} touchpoint={item} onClick={setSelected} /> :
                                 <TouchpointCard      key={item.id} touchpoint={item} onClick={setSelected} />
    )
    return (
      <EditableCard key={item.id} card={item} onCommentClick={setCommentCard}>
        {card}
      </EditableCard>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* Header */}
      <header className="bg-slate-900 px-6 py-5">
        <h1 className="text-lg font-bold tracking-tight text-white">Agentforce Customer Journey</h1>
        <p className="text-sm text-slate-400 mt-0.5">SKU Provisioned → Scaled Agent Usage</p>
      </header>

      {/* Supabase setup notice */}
      {!isConfigured && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-3">
          <span className="text-amber-600 text-sm font-medium">⚠ Collaboration not connected</span>
          <span className="text-amber-700 text-xs">
            Copy <code className="font-mono bg-amber-100 px-1 rounded">.env.local.example</code> → <code className="font-mono bg-amber-100 px-1 rounded">.env.local</code> and add your Supabase URL + key.
            Run the SQL in <code className="font-mono bg-amber-100 px-1 rounded">supabase/schema.sql</code> in your project's SQL editor.
          </span>
        </div>
      )}

      {/* Emotion Curve */}
      <EmotionCurve />

      {/* Lane toggles */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex flex-wrap gap-1.5">
        {LANES.map(lane => (
          <button
            key={lane.id}
            onClick={() => toggleLane(lane.id)}
            className={`
              text-xs px-3 py-1 rounded-full border font-medium transition-colors
              ${activeLanes.has(lane.id)
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}
            `}
          >
            {lane.icon} {lane.label}
          </button>
        ))}
      </div>

      {/* Journey grid */}
      <div className="overflow-x-auto">
        <div
          className="grid w-full"
          style={{ gridTemplateColumns: gridCols }}
        >

          {/* ── Stage headers ─────────────────────────────────────────────── */}
          <div className="bg-white border-b-2 border-r border-slate-200" />

          {STAGES.map((stage, colIndex) => {
            const colors = STAGE_COLORS[stage.color]
            return (
              <div
                key={stage.id}
                className={`relative ${colors.header} text-white px-4 py-4 border-b-2 border-r border-white/10`}
              >
                <div className="font-bold text-sm leading-tight">{stage.label}</div>
                <div className="text-xs opacity-70 mt-0.5 font-normal">{stage.subtitle}</div>

                {/* Drag-resize handle */}
                <div
                  onMouseDown={e => startDrag(e, colIndex)}
                  className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize group flex items-center justify-center"
                >
                  <div className="w-px h-8 bg-white/25 group-hover:bg-white/70 transition-colors" />
                </div>
              </div>
            )
          })}

          {/* ── Swim lanes ────────────────────────────────────────────────── */}
          {visibleLanes.map(lane => (
            <>
              {/* Label cell */}
              <div
                key={`lbl-${lane.id}`}
                className="bg-white border-b border-r border-slate-200 px-3 py-3 flex items-start gap-2 sticky left-0 z-10"
              >
                <span className="text-sm leading-none mt-0.5">{lane.icon}</span>
                <span className="text-xs font-semibold text-slate-700 leading-snug">{lane.label}</span>
              </div>

              {/* Data cells */}
              {STAGES.map(stage => {
                const cards = ALL_ITEMS.filter(
                  t => t.stageId === stage.id && t.lane === lane.id
                )
                return (
                  <div
                    key={`${lane.id}-${stage.id}`}
                    className={`${lane.bg} border-b border-r border-slate-200 p-3 space-y-2`}
                  >
                    {cards.map(item => renderCard(item))}

                    {cards.length === 0 && (
                      <div className="text-[11px] text-slate-300 italic">—</div>
                    )}

                    {/* Add card button */}
                    <button
                      onClick={() => setAddTarget({ stageId: stage.id, stageLabel: stage.label, lane: lane.id })}
                      className="w-full text-[11px] text-slate-400 border border-dashed border-slate-300 rounded-lg py-1 hover:text-blue-600 hover:border-blue-400 transition-colors opacity-0 hover:opacity-100 group-hover:opacity-100 focus:opacity-100 mt-1"
                      style={{ opacity: undefined }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                      onFocus={e => e.currentTarget.style.opacity = '1'}
                      onBlur={e => e.currentTarget.style.opacity = '0'}
                    >
                      + add
                    </button>
                  </div>
                )
              })}
            </>
          ))}
        </div>
      </div>

      {/* Overlays */}
      {selected && (
        <DetailPanel
          touchpoint={selected}
          stage={selectedStage}
          onClose={() => setSelected(null)}
        />
      )}

      {commentCard && (
        <CommentPanel
          card={commentCard}
          onClose={() => setCommentCard(null)}
        />
      )}

      {addTarget && (
        <AddCardModal
          stageId={addTarget.stageId}
          stageLabel={addTarget.stageLabel}
          lane={addTarget.lane}
          onClose={() => setAddTarget(null)}
        />
      )}
    </div>
  )
}
