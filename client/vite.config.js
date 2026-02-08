import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Build optimization
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'pdf-vendor': ['pdfjs-dist'],
          'ui-vendor': ['lucide-react', 'clsx', 'tailwind-merge']
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
