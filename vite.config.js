import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Import Roboto font
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/user': {
        target: 'https://garnishment-backend-6lzi.onrender.com', // Replace with your API
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/user/, ''), // Optional: remove "/api" prefix
      },
    },
  },
})
