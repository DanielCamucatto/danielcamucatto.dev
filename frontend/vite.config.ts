import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Ao publicar no GitHub Pages como project page (username.github.io/repo),
  // precisamos definir o `base` para o nome do repositório para que os
  // assets sejam referenciados como /repo/assets/...
  base: '/danielcamucatto.dev/',
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
