import { useEffect, useRef, useState } from 'react'
import { useCollaboration } from '../context/CollaborationContext'

export default function EditableCard({ card, children, onCommentClick }) {
  const { getCommentCount, saveCardEdit, cardEdits, author } = useCollaboration()
  const [editing, setEditing] = useState(false)
  const [draftLabel, setDraftLabel] = useState('')
  const [draftNotes, setDraftNotes] = useState('')
  const textareaRef = useRef(null)

  const commentCount = getCommentCount(card.id)
  const currentEdits = cardEdits[card.id] || {}
  const displayLabel = currentEdits.label ?? card.label ?? card.company
  const displayNotes = currentEdits.notes ?? card.notes

  const startEdit = e => {
    if (e.detail === 2) {  // double-click
      e.preventDefault()
      e.stopPropagation()
      setDraftLabel(displayLabel || '')
      setDraftNotes(displayNotes || '')
      setEditing(true)
    }
  }

  useEffect(() => {
    if (editing) textareaRef.current?.focus()
  }, [editing])

  const save = async () => {
    const edits = { ...currentEdits }
    if (draftLabel.trim() && draftLabel.trim() !== (card.label ?? card.company)) {
      edits.label = draftLabel.trim()
    }
    if (draftNotes.trim() !== (card.notes || '')) {
      edits.notes = draftNotes.trim()
    }
    await saveCardEdit(card.id, card.stageId, card.lane, edits)
    setEditing(false)
  }

  const cancel = () => setEditing(false)

  if (editing) {
    return (
      <div className="relative rounded-lg border-2 border-blue-400 bg-white p-2 space-y-2 shadow-md">
        <textarea
          ref={textareaRef}
          value={draftLabel}
          onChange={e => setDraftLabel(e.target.value)}
          rows={3}
          className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Card content…"
        />
        <textarea
          value={draftNotes}
          onChange={e => setDraftNotes(e.target.value)}
          rows={2}
          className="w-full text-[11px] border border-slate-200 rounded px-2 py-1 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-500"
          placeholder="Notes / context (optional)…"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={cancel}
            className="text-[11px] px-2 py-0.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={!author}
            className="text-[11px] px-2 py-0.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
          >
            Save
          </button>
        </div>
        {!author && (
          <p className="text-[10px] text-slate-400 text-center">Open the comment panel to set your name first.</p>
        )}
      </div>
    )
  }

  return (
    <div
      className="relative group"
      onClickCapture={startEdit}
      title="Double-click to edit"
    >
      {/* Render the underlying card */}
      {typeof children === 'function' ? children({ displayLabel, displayNotes }) : children}

      {/* Comment bubble */}
      <button
        onClick={e => { e.stopPropagation(); onCommentClick(card) }}
        className={`
          absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full
          text-[10px] font-bold leading-none flex items-center justify-center
          transition-all z-10 shadow-sm
          ${commentCount > 0
            ? 'bg-blue-600 text-white opacity-100'
            : 'bg-slate-200 text-slate-500 opacity-0 group-hover:opacity-100'}
        `}
        title={commentCount > 0 ? `${commentCount} comment${commentCount > 1 ? 's' : ''}` : 'Add comment'}
      >
        {commentCount > 0 ? commentCount : '💬'}
      </button>

      {/* Edit indicator */}
      {currentEdits.label && (
        <span className="absolute bottom-0.5 right-1 text-[8px] text-blue-400 opacity-0 group-hover:opacity-100 pointer-events-none">
          edited
        </span>
      )}
    </div>
  )
}
