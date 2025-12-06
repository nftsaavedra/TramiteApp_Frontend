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
  }
})
