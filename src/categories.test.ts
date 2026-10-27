import { readdirSync, readFileSync } from 'node:fs'
import { CATEGORIES, categoryColor } from './categories'
import type { Prompt } from './types'

const dir = 'src/prompts'
const prompts = readdirSync(dir).map((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')) as Prompt)

describe('CATEGORIES', () => {
  it('gives every category in the prompt files a colour', () => {
    const names = CATEGORIES.map((c) => c.name)
    for (const p of prompts) expect(names, p.id).toContain(p.category)
  })

  it('uses colour families shared with Favorite Skills and the AI Hub', () => {
    expect(categoryColor('Security')).toBe('#ff6a5c')
    expect(categoryColor('Cognitive Fitness')).toBe('#b49bff')
    expect(categoryColor('Writing')).toBe('#e8c46a')
  })

  it('falls back to a neutral colour for an unknown category', () => {
    expect(categoryColor('Nope')).toMatch(/^#/)
  })

  it('has unique prompt ids', () => {
    const ids = prompts.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
