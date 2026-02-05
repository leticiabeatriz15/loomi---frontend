import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/livro': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/usuario': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
