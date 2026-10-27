/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/prompt-library/',
  build: { outDir: 'dist/prompt-library', emptyOutDir: true },
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
