import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/aimar-app/',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use '/src/styles/_variables.scss' as *; @use '/src/styles/_mixins.scss' as *;`
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})