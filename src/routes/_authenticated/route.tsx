// En: src/routes/_authenticated/route.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

// Ya no hay 'beforeLoad'. La ruta simplemente renderiza el layout.
// El layout se encargará de la seguridad.
export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})
