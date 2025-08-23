import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  resolve: {
    alias: {
      // Add this to ensure consistent paths
      '@': '/src'
    },
    extensions: ['.js', '.jsx', '.json']
  }
})