import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Detecta ambiente:
  // - Netlify: usa base '/' (raiz)
  // - GitHub Pages: usa base '/danielcamucatto.dev/' (project page)
  // - Local dev: usa '/' por padrão
  base: process.env.NETLIFY === 'true' 
    ? '/' 
    : process.env.VITE_BASE_PATH || '/danielcamucatto.dev/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      // Força o uso de polling, que é crucial para o Docker em muitos sistemas.
      usePolling: true,
      // Não tente usar eventos do sistema de arquivos nativos.
      useFsEvents: false,
      // Intervalo de verificação para arquivos de texto (em milissegundos).
      interval: 500,
      // Intervalo de verificação para arquivos binários.
      binaryInterval: 1000,
    },
  },
})
