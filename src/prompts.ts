import type { Prompt } from './types'

export const SOURCE_URL = 'https://github.com/0fflineDocs/Prompt-Library/blob/main/src/prompts'
export const DELIVERABLE = 'Deliverable'

export type Entry = Prompt & { file: string }

/** Loads every prompt in one async chunk so the catalogue stays out of the initial bundle. */
export async function loadPrompts(): Promise<Entry[]> {
  const { CATALOGUE } = await import('./catalogue')
  return [...CATALOGUE].sort((a, b) => a.title.localeCompare(b.title))
}

export const lineCount = (p: Prompt) => p.content.trim().split('\n').length

export function matches(p: Prompt, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [p.title, p.description ?? '', p.category, p.content, ...p.tags].some((s) => s.toLowerCase().includes(q))
}
