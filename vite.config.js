import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: false,
  },
  build: {
    // Chunking is left to Rolldown's default strategy. Route-level splitting
    // already comes from the React.lazy calls in src/App.jsx, and a hand-written
    // manualChunks map tends to fight the bundler rather than help it.
    target: 'es2020',
    cssMinify: 'lightningcss',
    reportCompressedSize: false,
  },
})
