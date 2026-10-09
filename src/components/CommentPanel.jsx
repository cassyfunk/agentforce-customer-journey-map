import { useEffect, useRef, useState } from 'react'
import { useCollaboration } from '../context/CollaborationContext'

export default function CommentPanel({ card, onClose }) {
  const { author, setAuthor, getComments, addComment, resolveComment, deleteComment } = useCollaboration()
  const [text, setText] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const bottomRef = useRef(null)

  const comments = getComments(card.id)
  const unresolved = comments.filter(c => !c.resolved)
  const resolved   = comments.filter(c => c.resolved)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [comments.length])

  const submit = async e => {
    e.preventDefault()
    if (!text.trim() || submitting) return
    setSubmitting(true)
    await addComment(card.id, card.stageId, card.lane, text.trim())
    setText('')
    setSubmitting(false)
  }

  const authorName = author || ''

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-slate-200 shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-slate-200 bg-slate-50">
        <div className="min-w-0 pr-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Comments</div>
          <div className="text-sm font-medium text-slate-800 mt-0.5 line-clamp-2">{card.label || card.company}</div>
        </div>
        <button onClick={onClose} className="shrink-0 p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors">
          ✕
        </button>
      </div>

      {/* Name prompt if no author */}
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
            <button type="submit" className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
              Set
            </button>
          </div>
        </form>
      )}

      {/* Comment thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {comments.length === 0 && (
          <p className="text-xs text-slate-400 text-center mt-8">No comments yet — be the first.</p>
        )}

        {unresolved.map(c => (
          <CommentRow key={c.id} comment={c} onResolve={() => resolveComment(c.id, true)} onDelete={() => deleteComment(c.id)} />
        ))}

        {resolved.length > 0 && (
          <>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 pt-2 border-t border-slate-100">
              Resolved ({resolved.length})
            </div>
            {resolved.map(c => (
              <CommentRow key={c.id} comment={c} resolved onResolve={() => resolveComment(c.id, false)} onDelete={() => deleteComment(c.id)} />
            ))}
          </>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={submit} className="border-t border-slate-200 p-4">
        {author && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400">Commenting as <strong>{author}</strong></span>
            <button type="button" onClick={() => setAuthor(null)} className="text-[10px] text-slate-400 hover:text-slate-600 underline">change</button>
          </div>
        )}
        <div className="flex gap-2">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(e) } }}
            placeholder={author ? 'Add a comment…' : 'Set your name first'}
            disabled={!author}
            rows={2}
            className="flex-1 text-sm border border-slate-200 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
          />
          <button
            type="submit"
            disabled={!text.trim() || !author || submitting}
            className="self-end text-xs bg-slate-800 text-white px-3 py-2 rounded hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Post
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">Enter to post · Shift+Enter for newline</p>
      </form>
    </div>
  )
}

function CommentRow({ comment, resolved, onResolve, onDelete }) {
  const date = new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  const time = new Date(comment.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`rounded-lg p-3 border text-xs ${resolved ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-700 uppercase">
            {comment.author?.[0] ?? '?'}
          </span>
          <span className="font-semibold text-slate-700">{comment.author}</span>
        </div>
        <span className="text-[10px] text-slate-400">{date} {time}</span>
      </div>
      <p className="text-slate-700 leading-snug whitespace-pre-wrap">{comment.text}</p>
      <div className="flex gap-3 mt-2">
        <button onClick={onResolve} className="text-[10px] text-slate-400 hover:text-green-600 transition-colors">
          {resolved ? '↩ Unresolve' : '✓ Resolve'}
        </button>
        <button onClick={onDelete} className="text-[10px] text-slate-400 hover:text-red-600 transition-colors">
          Delete
        </button>
      </div>
    </div>
  )
}
