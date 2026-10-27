import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { categoryColor } from './categories'
import { copyText } from './clipboard'
import { SOURCE_URL, lineCount } from './prompts'
import type { Entry } from './prompts'
import { closeOnBackdrop, useModal } from './useModal'

const COPY_RESET_MS = 1600

type Props = {
  prompt: Entry | null
  /** Card the dialog grows out of, if it was opened from the grid. */
  origin: HTMLElement | null
  onClose: () => void
}

type CopyState = 'idle' | 'done' | 'failed'
const COPY_LABEL: Record<CopyState, string> = { idle: 'Copy prompt', done: 'Copied', failed: 'Copy failed' }

export function PromptDialog({ prompt, origin, onClose }: Props) {
  const ref = useModal(prompt !== null, origin)
  const [copy, setCopy] = useState<CopyState>('idle')

  useEffect(() => setCopy('idle'), [prompt])

  useEffect(() => {
    if (copy === 'idle') return
    const id = window.setTimeout(() => setCopy('idle'), COPY_RESET_MS)
    return () => window.clearTimeout(id)
  }, [copy])

  return (
    <dialog
      ref={ref}
      className="pl-dialog"
      aria-labelledby="pl-dialog-name"
      style={prompt ? ({ '--c': categoryColor(prompt.category) } as CSSProperties) : undefined}
      onClose={onClose}
      onClick={closeOnBackdrop}
    >
      {prompt && (
        <article className="pl-d-inner">
          <header className="pl-d-head">
            <p className="pl-d-cat">{prompt.category}</p>
            <h2 className="pl-d-name" id="pl-dialog-name">{prompt.title}</h2>
            <button type="button" className="pl-d-close" aria-label="Close" onClick={() => ref.current?.close()}>×</button>
          </header>

          {prompt.description && <p className="pl-d-blurb">{prompt.description}</p>}

          <div className="pl-d-actions">
            <button
              type="button"
              className="pl-d-copy"
              data-state={copy}
              onClick={async () => setCopy((await copyText(prompt.content)) ? 'done' : 'failed')}
            >
              {COPY_LABEL[copy]}
            </button>
            <a className="pl-d-link" href={`${SOURCE_URL}/${prompt.file}`} target="_blank" rel="noopener noreferrer">View source on GitHub ↗</a>
            <span className="visually-hidden" role="status">{copy === 'idle' ? '' : COPY_LABEL[copy]}</span>
          </div>

          {prompt.tags.length > 0 && (
            <ul className="pl-d-tags" aria-label="Tags">
              {prompt.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          )}

          <details className="pl-d-source" open>
            <summary>PROMPT · {lineCount(prompt)} lines</summary>
            <pre><code>{prompt.content}</code></pre>
          </details>
        </article>
      )}
    </dialog>
  )
}
