import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Build optimization
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild', // Use esbuild (default, faster than terser)
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },

  // Server configuration for development
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    open: false
  },

  // Preview configuration
  preview: {
    port: 4173,
    strictPort: false,
    host: true
  },

  // Environment variable prefix
  envPrefix: 'VITE_',

  // Dependency optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'axios']
  }
})
