import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/empresas': {
        target: 'http://localhost:3334/facturador-guias-backend/api',
        changeOrigin: true,
      },
      '/reglas': {
        target: 'http://localhost:3334/facturador-guias-backend/api',
        changeOrigin: true,
      },
    },
  },
})
