import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/api-live': {
        target: 'https://dev-service.altamino.top',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-live/, '/api/v1'),
        headers: {
          'Host': 'dev-service.altamino.top'
        }
      }
    }
  }
})
