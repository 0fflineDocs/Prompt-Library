/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Prompt } from './src/types'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const SITE = 'https://simonhakansson.com/prompt-library'
const SOURCE = 'https://github.com/0fflineDocs/Prompt-Library/blob/main/src/prompts'

/** Emits llms.txt (index) and llms-full.txt (every prompt in full) from src/prompts. */
function llmsTxt(): Plugin {
  return {
    name: 'llms-txt',
    apply: 'build',
    generateBundle() {
      const dir = path.resolve(rootDir, 'src/prompts')
      const prompts = readdirSync(dir)
        .filter((file) => file.endsWith('.json'))
        .map((file) => ({ file, ...(JSON.parse(readFileSync(path.join(dir, file), 'utf8')) as Prompt) }))
        .sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title))
      const categories = [...new Set(prompts.map((p) => p.category))]
      const header = [
        '# Prompt Library',
        '',
        '> A curated collection of generative AI prompts for creativity, Microsoft 365, security and everyday work. Each prompt is a reusable system or task prompt.',
        '',
      ]

      const index = [...header, `Every prompt in full: ${SITE}/llms-full.txt`, '']
      const full = [...header, `Index: ${SITE}/llms.txt`, '']
      for (const category of categories) {
        index.push(`## ${category}`, '')
        full.push(`## ${category}`, '')
        for (const p of prompts.filter((q) => q.category === category)) {
          const summary = (p.description ?? p.content.split('\n')[0]).replace(/\s+/g, ' ')
          index.push(`- [${p.title}](${SOURCE}/${p.file}): ${summary}`)
          full.push(`### ${p.title}`, '', `Tags: ${p.tags.join(', ')}`, '', '````text', p.content.trim(), '````', '')
        }
        index.push('')
      }
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: index.join('\n') })
      this.emitFile({ type: 'asset', fileName: 'llms-full.txt', source: full.join('\n') })
    },
  }
}

export default defineConfig({
  base: '/prompt-library/',
  build: { outDir: 'dist/prompt-library', emptyOutDir: true },
  plugins: [react(), llmsTxt()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
