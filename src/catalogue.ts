import type { Prompt } from './types'

// Eager here, but this module is itself imported lazily: one request for the whole catalogue.
const files = import.meta.glob<{ default: Prompt }>('./prompts/*.json', { eager: true })

export const CATALOGUE = Object.entries(files).map(([path, mod]) => ({ ...mod.default, file: path.slice('./prompts/'.length) }))
