import { useEffect, useMemo, useRef } from 'react'
import type { CSSProperties, MouseEvent, PointerEvent } from 'react'
import { categoryColor } from './categories'
import { PixelField, prefersReducedMotion, scramble } from './effects'
import { DELIVERABLE, lineCount } from './prompts'
import type { Entry } from './prompts'

// Card contact states follow AI Hub's HubGrid: tilt, spotlight, dithered field, top hairline, name scramble.
// How long a tap shows the contact state before the prompt opens
const TAP_MS = 350
const ENTER_STAGGER_MS = 50
// Past this many cards the entrance stops staggering, so a long grid does not trickle in
const STAGGER_CAP = 12

type Props = {
  prompts: readonly Entry[]
  onOpen: (prompt: Entry, origin: HTMLElement) => void
}

export function PromptGrid({ prompts, onOpen }: Props) {
  const gridRef = useRef<HTMLUListElement>(null)
  const field = useMemo(() => new PixelField(), [])
  const active = useRef<HTMLLIElement | null>(null)
  const lastPointer = useRef<string>('mouse')
  const pendingTap = useRef<number | null>(null)

  useEffect(() => () => {
    field.destroy()
    if (pendingTap.current !== null) window.clearTimeout(pendingTap.current)
  }, [field])

  // Titles resolve out of glyphs as the first cards arrive
  useEffect(() => {
    if (prefersReducedMotion()) return
    const timers: number[] = []
    gridRef.current?.querySelectorAll<HTMLElement>('[data-scramble]').forEach((label, i) => {
      if (i >= STAGGER_CAP) return
      const text = label.dataset.scramble ?? ''
      label.textContent = ''
      timers.push(window.setTimeout(() => scramble(label, text, 380), 200 + i * ENTER_STAGGER_MS))
    })
    return () => {
      timers.forEach((t) => window.clearTimeout(t))
      gridRef.current?.querySelectorAll<HTMLElement>('[data-scramble]').forEach((label) => { label.textContent = label.dataset.scramble ?? '' })
    }
  }, [])

  function activate(li: HTMLLIElement, point?: { x: number; y: number }) {
    if (active.current === li) return
    if (active.current) active.current.classList.remove('is-active')
    active.current = li
    li.classList.add('is-active')
    gridRef.current?.classList.add('has-active')
    if (prefersReducedMotion()) return
    const label = li.querySelector<HTMLElement>('[data-scramble]')
    if (label) scramble(label, label.dataset.scramble ?? '')
    const canvas = li.querySelector('canvas')
    if (canvas) field.attach(canvas, li.dataset.color ?? '#ffffff', point)
  }

  function deactivate(li: HTMLLIElement) {
    li.classList.remove('is-active')
    li.style.transform = ''
    if (active.current !== li) return
    active.current = null
    gridRef.current?.classList.remove('has-active')
    field.release()
  }

  const localPoint = (li: HTMLLIElement, e: { clientX: number; clientY: number }) => {
    const r = li.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height }
  }

  const onEnter = (e: PointerEvent<HTMLLIElement>) => {
    if (e.pointerType === 'touch') return
    activate(e.currentTarget, localPoint(e.currentTarget, e))
  }

  const onMove = (e: PointerEvent<HTMLLIElement>) => {
    if (e.pointerType === 'touch') return
    const li = e.currentTarget
    const { x, y, w, h } = localPoint(li, e)
    li.style.setProperty('--mx', `${x}px`)
    li.style.setProperty('--my', `${y}px`)
    field.pointer(x, y)
    if (prefersReducedMotion() || !w || !h) return
    const px = x / w - 0.5, py = y / h - 0.5
    li.style.transform = `rotateX(${(-py * 9).toFixed(2)}deg) rotateY(${(px * 11).toFixed(2)}deg) translateZ(6px)`
  }

  const onLeave = (e: PointerEvent<HTMLLIElement>) => {
    if (e.pointerType === 'touch') return
    deactivate(e.currentTarget)
  }

  const onClick = (e: MouseEvent<HTMLButtonElement>, prompt: Entry) => {
    const li = e.currentTarget.closest('li')!
    if (lastPointer.current !== 'touch') return onOpen(prompt, li)
    // On touch, play the contact state before opening
    if (pendingTap.current !== null) return
    const p = localPoint(li, e)
    li.style.setProperty('--mx', `${p.x}px`)
    li.style.setProperty('--my', `${p.y}px`)
    activate(li, p)
    pendingTap.current = window.setTimeout(() => {
      pendingTap.current = null
      deactivate(li)
      onOpen(prompt, li)
    }, TAP_MS)
  }

  return (
    <ul className="pl-grid" ref={gridRef}>
      {prompts.map((prompt, i) => {
        const color = categoryColor(prompt.category)
        const deliverable = prompt.tags.includes(DELIVERABLE)
        return (
          <li
            key={prompt.id}
            className="pl-card"
            data-color={color}
            style={{ '--c': color, '--i': Math.min(i, STAGGER_CAP), viewTransitionName: `prompt-${prompt.id}` } as CSSProperties}
            onPointerEnter={onEnter}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
          >
            <button
              type="button"
              className="pl-open"
              aria-haspopup="dialog"
              aria-label={`${prompt.title}, ${prompt.category}${deliverable ? ', deliverable' : ''}`}
              onPointerDown={(e) => { lastPointer.current = e.pointerType || 'mouse' }}
              onFocus={(e) => activate(e.currentTarget.closest('li')!)}
              onBlur={(e) => deactivate(e.currentTarget.closest('li')!)}
              onClick={(e) => onClick(e, prompt)}
            >
              <canvas className="pl-fx" aria-hidden="true" />
              <span className="pl-top">
                <span className="pl-tag">{prompt.category.toUpperCase()}</span>
                {deliverable
                  ? <span className="pl-badge">DELIVERABLE</span>
                  : <span className="pl-arrow" aria-hidden="true">+</span>}
              </span>
              <span className="pl-name" aria-hidden="true" data-scramble={prompt.title}>{prompt.title}</span>
              <span className="pl-blurb">{prompt.description ?? prompt.content.slice(0, 160)}</span>
              <span className="pl-meta">
                <span>{prompt.tags.filter((t) => t !== DELIVERABLE).slice(0, 2).join(' · ')}</span>
                <span>{lineCount(prompt)} lines</span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
