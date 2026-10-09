import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { isConfigured, supabase } from '../lib/supabase'

const Ctx = createContext(null)

export function CollaborationProvider({ children }) {
  const [author, setAuthorState] = useState(() => localStorage.getItem('cjm-author') || null)
  const [comments, setComments]   = useState({})   // { [cardId]: Comment[] }
  const [cardEdits, setCardEdits] = useState({})   // { [cardId]: object }
  const [customCards, setCustomCards] = useState([])
  const [loading, setLoading] = useState(isConfigured)

  const setAuthor = name => {
    localStorage.setItem('cjm-author', name)
    setAuthorState(name)
  }

  // ── Load initial data ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!supabase) return

    async function load() {
      const [{ data: c }, { data: e }, { data: cc }] = await Promise.all([
        supabase.from('comments').select('*').order('created_at'),
        supabase.from('card_edits').select('*'),
        supabase.from('custom_cards').select('*').order('created_at'),
      ])
      if (c) setComments(groupBy(c, 'card_id'))
      if (e) setCardEdits(Object.fromEntries(e.map(r => [r.card_id, r.edits])))
      if (cc) setCustomCards(cc.map(normalizeCustomCard))
      setLoading(false)
    }

    load()
  }, [])

  // ── Real-time subscriptions ────────────────────────────────────────────────
  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel('collab')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, payload => {
        setComments(prev => {
          const row = payload.new
          const cardId = row?.card_id || payload.old?.card_id
          if (!cardId) return prev

          if (payload.eventType === 'DELETE') {
            const list = (prev[cardId] || []).filter(c => c.id !== payload.old.id)
            return { ...prev, [cardId]: list }
          }
          // INSERT or UPDATE
          const existing = prev[cardId] || []
          const idx = existing.findIndex(c => c.id === row.id)
          const next = idx >= 0
            ? existing.map(c => c.id === row.id ? row : c)
            : [...existing, row]
          return { ...prev, [cardId]: next }
        })
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'card_edits' }, payload => {
        setCardEdits(prev => {
          if (payload.eventType === 'DELETE') {
            const next = { ...prev }
            delete next[payload.old.card_id]
            return next
          }
          return { ...prev, [payload.new.card_id]: payload.new.edits }
        })
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'custom_cards' }, payload => {
        setCustomCards(prev => {
          if (payload.eventType === 'INSERT') return [...prev, normalizeCustomCard(payload.new)]
          if (payload.eventType === 'DELETE') return prev.filter(c => c.id !== payload.old.id)
          // UPDATE
          return prev.map(c => c.id === payload.new.id ? normalizeCustomCard(payload.new) : c)
        })
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  // ── Mutations ──────────────────────────────────────────────────────────────
  const addComment = useCallback(async (cardId, stageId, lane, text) => {
    if (!author) return
    if (!supabase) return
    await supabase.from('comments').insert({ card_id: cardId, stage_id: stageId, lane, author, text })
  }, [author])

  const resolveComment = useCallback(async (commentId, resolved) => {
    if (!supabase) return
    await supabase.from('comments').update({ resolved }).eq('id', commentId)
  }, [])

  const deleteComment = useCallback(async (commentId) => {
    if (!supabase) return
    await supabase.from('comments').delete().eq('id', commentId)
  }, [])

  const saveCardEdit = useCallback(async (cardId, stageId, lane, edits) => {
    if (!author) return
    if (!supabase) return
    await supabase.from('card_edits').upsert({
      card_id: cardId, stage_id: stageId, lane, edits, edited_by: author,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'card_id' })
  }, [author])

  const addCustomCard = useCallback(async (stageId, lane, cardData) => {
    if (!author) return
    if (!supabase) return
    await supabase.from('custom_cards').insert({ ...cardData, stage_id: stageId, lane, author })
  }, [author])

  const deleteCustomCard = useCallback(async (cardId) => {
    if (!supabase) return
    await supabase.from('custom_cards').delete().eq('id', cardId)
  }, [])

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getCommentCount = cardId => (comments[cardId] || []).filter(c => !c.resolved).length
  const getComments     = cardId => comments[cardId] || []

  return (
    <Ctx.Provider value={{
      isConfigured, loading, author, setAuthor,
      comments, cardEdits, customCards,
      addComment, resolveComment, deleteComment,
      saveCardEdit, addCustomCard, deleteCustomCard,
      getCommentCount, getComments,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useCollaboration = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCollaboration must be inside CollaborationProvider')
  return ctx
}

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    ;(acc[item[key]] = acc[item[key]] || []).push(item)
    return acc
  }, {})
}

function normalizeCustomCard(row) {
  return { ...row, stageId: row.stage_id, isCustom: true }
}
