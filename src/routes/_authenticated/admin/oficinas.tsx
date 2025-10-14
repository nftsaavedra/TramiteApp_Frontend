 
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin/oficinas')({
  component: AdminOficinas,
})

function AdminOficinas() {
  return (
    <div className="p-2">
      <h3>Gestión de Oficinas</h3>
    </div>
  )
}