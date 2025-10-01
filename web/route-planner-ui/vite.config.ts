/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Development server configuration
  server: {
    port: 5173,
    host: true,
    open: true,
    cors: true,
    proxy: {
      // Proxy API requests to Python backend
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
  // Testing configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
      ],
    },
  },
  
  // Build configuration - optimized for performance
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production for better performance
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          ui: ['zustand'],
          maps: ['leaflet', 'react-leaflet', 'maplibre-gl'],
          charts: ['recharts'],
        },
      },
    },
    // Optimize dependencies
    chunkSizeWarningLimit: 1000,
    // Enable tree shaking
    treeshake: true,
    // Optimize CSS
    cssCodeSplit: true,
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
  
  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  
  // Environment variables
  envPrefix: 'VITE_',
  
  // Optimize dependencies - enhanced for performance
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'zustand',
      'maplibre-gl',
      'recharts',
      'leaflet',
      'react-leaflet',
    ],
    exclude: [],
    // Force pre-bundling of heavy dependencies
    force: true,
  },
  
  // CSS configuration - Ensure PostCSS is properly configured
  css: {
    devSourcemap: true,
    postcss: './postcss.config.js',
  },
})
