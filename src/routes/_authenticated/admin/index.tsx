import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin/')({
  component: AdminIndex,
})

function AdminIndex() {
  return (
    <div className="p-2">
      <h3>Dashboard de Administración</h3>
    </div>
  )
}