import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { compression } from 'vite-plugin-compression2';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    port: 5173, // Default Vite port
    host: true,
    hmr: {
      overlay: false // Disable HMR overlay for better performance
    },
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: mode === 'development',
    cssMinify: true,
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        pure_funcs: mode === 'production' ? ['console.log', 'console.info', 'console.debug', 'console.warn'] : [],
        passes: 2
      },
      mangle: {
        toplevel: true
      }
    },
    rollupOptions: {
      output: {
        // Remove manual chunks for better performance with direct imports
        inlineDynamicImports: true,
        // Add content hash for better caching
        entryFileNames: mode === 'production' ? 'assets/[name].[hash].js' : 'assets/[name].js',
        chunkFileNames: mode === 'production' ? 'assets/[name].[hash].js' : 'assets/[name].js',
        assetFileNames: mode === 'production' ? 'assets/[name].[hash].[ext]' : 'assets/[name].[ext]'
      },
    },
    chunkSizeWarningLimit: 2000, // Increased limit since we're not chunking
  },
  plugins: [
    react(),
    compression({
      algorithms: ['gzip', 'brotliCompress'],
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 1024
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'zustand',
      '@supabase/supabase-js',
      'sonner',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-slot',
      '@radix-ui/react-icons',
      '@radix-ui/react-checkbox',
      'recharts',
      'framer-motion',
      'react-hook-form',
      'zod',
      'lucide-react'
    ],
    exclude: []
  },
  esbuild: {
    loader: 'tsx',
    include: /src\/.*\.[tj]sx?$/,
    exclude: [],
    treeShaking: true
  },
  // Performance optimizations
  css: {
    devSourcemap: mode === 'development'
  },
  define: {
    __DEV__: mode === 'development'
  }
}));
