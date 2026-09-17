import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: {
    proxy: {
      // Any request from the browser starting with /api is forwarded
      // to the local Piston container. This avoids CORS because the
      // browser only ever talks to localhost:5173 (same origin).
      '/api': {
        target: 'http://localhost:2000',
        changeOrigin: true,
      },
    },
  },
})