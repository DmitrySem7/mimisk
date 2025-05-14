import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html', // главный файл (если есть)
        jiraUserList: 'src/jiraUserList.html', // ваш HTML, который вызывает react-компоненты
        esmpUserList: 'src/esmpUserList.html', // аналогично,
        copyManager:  'src/copyManager.html'
      }
    },
    outDir: 'dist', // 📦 билд фронта в dist
    emptyOutDir: true,
  },
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: filesystem:;"
    },
    port: 5173,
  }
})
