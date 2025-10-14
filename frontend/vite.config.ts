import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Usar base relativo por padrão para que a mesma build funcione com:
  // - custom domain (danielcamucatto.dev)
  // - GitHub project page (username.github.io/repo)
  // Permitir override via variável de ambiente VITE_BASE quando necessário.
  base: process.env.VITE_BASE ?? '',
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
