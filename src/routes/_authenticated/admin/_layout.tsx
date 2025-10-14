import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin/_layout')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div>
      <h2 className="p-2 text-lg font-bold">Sección de Administración</h2>
      <hr />
      <Outlet />
    </div>
  )
}