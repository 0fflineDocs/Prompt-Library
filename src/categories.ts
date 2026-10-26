// Category colours come in families shared with Favorite Skills and the AI Hub cards,
// so the same colour means the same kind of work on every site.
const SECURITY = '#ff6a5c' // AI Hub's Cybersecurity News card
const EXPLAIN = '#4cc3ff' // Favorite Skills "explain"
const THINK = '#b49bff' // Favorite Skills "think"
const WRITE = '#e8c46a' // Favorite Skills "write"
const DESIGN = '#ff86bd' // Favorite Skills "design"
const RESEARCH = '#5ee0a4' // Favorite Skills "research"

export type Category = { name: string; color: `#${string}` }

/** Filter order: families stay together. */
export const CATEGORIES: readonly Category[] = [
  { name: 'Security', color: SECURITY },
  { name: 'Compliance', color: SECURITY },
  { name: 'Microsoft 365', color: EXPLAIN },
  { name: 'Cognitive Fitness', color: THINK },
  { name: 'Analysis', color: THINK },
  { name: 'Strategy', color: THINK },
  { name: 'Writing', color: WRITE },
  { name: 'Generative AI', color: WRITE },
  { name: 'Creativity', color: DESIGN },
  { name: 'Research', color: RESEARCH },
  { name: 'Automation', color: RESEARCH },
]

const FALLBACK = '#a3a3a3'

export const categoryColor = (name: string): string => CATEGORIES.find((c) => c.name === name)?.color ?? FALLBACK
