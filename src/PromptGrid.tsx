import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import { categoryColor } from './categories'
import { DELIVERABLE, lineCount } from './prompts'
import type { Entry } from './prompts'

// Card motion is CSS only (site.css): border and hairline in the category colour on hover, a footer cue, a press.
// The AI Hub contact effects (tilt, spotlight, dithered field, scramble) stay on the hub.
// Past this many cards the entrance stops staggering, so a long grid does not trickle in
const STAGGER_CAP = 9

// The staggered entrance plays once per page load; cards shown later by a filter just fade in
let introPlayed = false

type Props = {
  prompts: readonly Entry[]
  onOpen: (prompt: Entry, origin: HTMLElement) => void
}

export function PromptGrid({ prompts, onOpen }: Props) {
  const intro = !introPlayed
  useEffect(() => { introPlayed = true }, [])

  return (
    <ul className={intro ? 'pl-grid is-intro' : 'pl-grid'}>
      {prompts.map((prompt, i) => {
        const deliverable = prompt.tags.includes(DELIVERABLE)
        return (
          <li
            key={prompt.id}
            className="pl-card"
            style={{ '--c': categoryColor(prompt.category), '--i': Math.min(i, STAGGER_CAP) } as CSSProperties}
          >
            <button
              type="button"
              className="pl-open"
              aria-haspopup="dialog"
              aria-label={`${prompt.title}, ${prompt.category}${deliverable ? ', deliverable' : ''}`}
              onClick={(e) => onOpen(prompt, e.currentTarget)}
            >
              <span className="pl-top">
                <span className="pl-tag">{prompt.category.toUpperCase()}</span>
                {deliverable && <span className="pl-badge">DELIVERABLE</span>}
              </span>
              <span className="pl-name">{prompt.title}</span>
              <span className="pl-blurb">{prompt.description ?? prompt.content.slice(0, 160)}</span>
              <span className="pl-meta">
                <span>{prompt.tags.filter((t) => t !== DELIVERABLE).slice(0, 2).join(' · ')}</span>
                <span className="pl-cue" aria-hidden="true">
                  <span className="pl-lines">{lineCount(prompt)} lines</span>
                  <span className="pl-go">open <i>→</i></span>
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
