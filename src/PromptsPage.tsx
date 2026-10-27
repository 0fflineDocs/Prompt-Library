import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { CATEGORIES } from './categories'
import { TideField } from './effects'
import { PromptDialog } from './PromptDialog'
import { PromptGrid } from './PromptGrid'
import { DELIVERABLE, loadPrompts, matches } from './prompts'
import type { Entry } from './prompts'

type Open = { prompt: Entry; origin: HTMLElement | null } | null

const setHash = (hash: string) => history.replaceState(null, '', hash || window.location.pathname + window.location.search)

// #<prompt-id> is a shareable link to an open prompt
const fromHash = (prompts: readonly Entry[]): Open => {
  const prompt = prompts.find((p) => `#${p.id}` === window.location.hash)
  return prompt ? { prompt, origin: null } : null
}

export function PromptsPage() {
  const tideRef = useRef<HTMLCanvasElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [prompts, setPrompts] = useState<Entry[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [category, setCategory] = useState<string | null>(null)
  const [deliverable, setDeliverable] = useState(false)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<Open>(null)

  useEffect(() => {
    let live = true
    loadPrompts()
      .then((all) => {
        if (!live) return
        setPrompts(all)
        setOpen(fromHash(all))
      })
      .catch(() => { if (live) setFailed(true) })
    return () => { live = false }
  }, [])

  useEffect(() => {
    if (!prompts) return
    const onHash = () => setOpen(fromHash(prompts))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [prompts])

  useEffect(() => {
    if (!tideRef.current) return
    // Painted once and left still: moving backgrounds belong to AI Hub
    const tide = new TideField(tideRef.current)
    tide.start()
    return () => tide.destroy()
  }, [])

  // "/" jumps to search, as on most catalogue sites
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement
      if (target.closest('input, textarea, dialog')) return
      e.preventDefault()
      searchRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const openPrompt = (prompt: Entry, origin: HTMLElement) => {
    setHash(`#${prompt.id}`)
    setOpen({ prompt, origin })
  }
  const close = () => {
    setHash('')
    setOpen(null)
  }

  const all = prompts ?? []
  const visible = all.filter((p) =>
    (category === null || p.category === category) && (!deliverable || p.tags.includes(DELIVERABLE)) && matches(p, query))
  const present = CATEGORIES.filter((c) => all.some((p) => p.category === c.name))
  const chips = [
    { name: 'All', value: null, count: all.length },
    ...present.map((c) => ({ name: c.name, value: c.name, color: c.color, count: all.filter((p) => p.category === c.name).length })),
  ]

  return (
    <main className="pl">
      <canvas className="pl-tide" ref={tideRef} aria-hidden="true" />
      <h1 className="pl-brand">PROMPT LIBRARY</h1>

      <div className="pl-filters">
        <div className="pl-filter-group" role="group" aria-label="Filter by category">
          {chips.map((chip) => (
            <button
              key={chip.name}
              type="button"
              className="pl-chip"
              aria-pressed={category === chip.value}
              style={'color' in chip ? ({ '--c': chip.color } as CSSProperties) : undefined}
              onClick={() => setCategory(chip.value)}
            >
              {'color' in chip && <i aria-hidden="true" />}
              {chip.name.toUpperCase()}
              <sup>{chip.count}</sup>
            </button>
          ))}
        </div>
        <div className="pl-filter-group">
          <button
            type="button"
            className="pl-chip"
            aria-pressed={deliverable}
            onClick={() => setDeliverable((d) => !d)}
          >
            DELIVERABLE<sup>{all.filter((p) => p.tags.includes(DELIVERABLE)).length}</sup>
          </button>
          <label className="pl-search">
            <span className="visually-hidden">Search prompts</span>
            <input
              ref={searchRef}
              type="search"
              placeholder="Search  /"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') { setQuery(''); e.currentTarget.blur() } }}
            />
          </label>
        </div>
      </div>

      {failed ? (
        <p className="pl-empty">The prompts did not load. Reload the page to try again.</p>
      ) : prompts === null ? (
        <p className="pl-empty" aria-live="polite">Loading prompts…</p>
      ) : visible.length > 0 ? (
        <PromptGrid prompts={visible} onOpen={openPrompt} />
      ) : (
        <p className="pl-empty">
          No prompts match.{' '}
          <button type="button" className="pl-textlink" onClick={() => { setQuery(''); setCategory(null); setDeliverable(false) }}>Clear filters</button>
        </p>
      )}

      <footer className="p-foot">
        <nav aria-label="Links">
          <a href="https://simonhakansson.com/">AI HUB</a>
          <a href="https://github.com/0fflineDocs">GITHUB</a>
          <a href="https://www.linkedin.com/in/simon-h%C3%A5kansson-20163b137/">LINKEDIN</a>
        </nav>
        <a href="#top">TOP <span aria-hidden="true">↑</span></a>
      </footer>

      <PromptDialog prompt={open?.prompt ?? null} origin={open?.origin ?? null} onClose={() => { if (open) close() }} />
    </main>
  )
}
