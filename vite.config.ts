// En: vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// <-- 1. Importa el nuevo plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(), // <-- 2. Añade el plugin aquí, al principio.
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  // 3. La sección 'resolve' manual ya no es necesaria. El plugin lo maneja todo.
})
