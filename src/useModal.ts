import { useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'

/** A click that lands on the dialog itself, not its content, is a click on the backdrop. */
export const closeOnBackdrop = (e: MouseEvent<HTMLDialogElement>) => {
  if (e.target === e.currentTarget) e.currentTarget.close()
}

/**
 * Drives a native modal <dialog> from state: shows it, grows it out of `origin` when given,
 * and pins the page behind it. On phones touch scrolling otherwise chains to the page, and
 * pinning the body keeps the reader's place where overflow: hidden on the root resets it.
 */
export function useModal(open: boolean, origin: HTMLElement | null = null) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      if (origin) {
        const r = origin.getBoundingClientRect()
        dialog.style.setProperty('--ox', `${r.left + r.width / 2}px`)
        dialog.style.setProperty('--oy', `${r.top + r.height / 2}px`)
      } else {
        dialog.style.removeProperty('--ox')
        dialog.style.removeProperty('--oy')
      }
      dialog.showModal()
    }
    if (!open && dialog.open) dialog.close()
  }, [open, origin])

  useEffect(() => {
    if (!open) return
    const y = window.scrollY
    const body = document.body.style
    Object.assign(body, { position: 'fixed', top: `-${y}px`, left: '0', right: '0' })
    return () => {
      Object.assign(body, { position: '', top: '', left: '', right: '' })
      window.scrollTo(0, y)
    }
  }, [open])

  return ref
}
