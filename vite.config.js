import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import fg from 'fast-glob'
import tailwindcss from '@tailwindcss/vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(async () => {
  const entries = await fg('src/**/*.html')
  const inputs = entries.map(entry => resolve(__dirname, entry))

  return {
    base: '/projekt13/',
    plugins: [tailwindcss()],
    root: resolve(__dirname, 'src'),
    build: {
      emptyOutDir: true,
      rollupOptions: {
        input: inputs,
      },
      outDir: resolve(__dirname, 'dist'),
    },
  }
})