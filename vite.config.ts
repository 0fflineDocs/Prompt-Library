import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  base: '/prompt-library/',
  build: { outDir: 'dist/prompt-library', emptyOutDir: true },
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
})
