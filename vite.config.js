import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Force Babel transform — OXC (default in v6) chokes on
      // template literals with ${} expressions inside JSX expressions.
      babel: {
        plugins: [],
      },
    }),
    tailwindcss(),
  ],

  port : 3000,
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://www.careermitra.in',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
