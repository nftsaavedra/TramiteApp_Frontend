// En: vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const appName = env.VITE_APP_NAME || 'Bienvenido'
  const appDescription = env.VITE_APP_DESCRIPTION || 'Sistema de Gestión'

  return {
    plugins: [
      tsconfigPaths(),
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
        // Optimización: Code splitting agresivo
        routesDirectory: './src/routes',
      }),
      react(),
      tailwindcss(),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html
            .replace(/%VITE_APP_NAME%/g, appName)
            .replace(/%VITE_APP_DESCRIPTION%/g, appDescription)
        },
      },
    ],
    // Optimización: Build más rápido
    build: {
      sourcemap: false, // Reducir tamaño de build
      chunkSizeWarningLimit: 500, // Alerta más estricta
      minify: 'esbuild', // Más rápido que terser
      target: 'esnext', // Moderno para mejor tree-shaking
      rollupOptions: {
        output: {
          manualChunks: {
            // Optimización: Separar vendor crítico
            'vendor-core': ['react', 'react-dom'],
            'vendor-ui': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-popover',
              '@radix-ui/react-select',
              '@radix-ui/react-tabs',
              '@radix-ui/react-tooltip',
              'lucide-react',
            ],
            'vendor-data': [
              '@tanstack/react-query',
              '@tanstack/react-router',
              '@tanstack/react-table',
            ],
            'vendor-charts': ['recharts'],
            'vendor-utils': [
              'date-fns',
              'zod',
              'axios',
              'zustand',
            ],
          },
          // Optimización: Nombres cortos para producción
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `chunks/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`,
        },
      },
    },
    // Optimización: Pre-bundle dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@tanstack/react-query',
        '@tanstack/react-router',
        'axios',
        'zod',
      ],
    },
  }
})
