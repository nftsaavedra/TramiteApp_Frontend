 
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin/tipos-documento')({
  component: AdminTiposDocumento,
})

function AdminTiposDocumento() {
  return (
    <div className="p-2">
      <h3>Gestión de Tipos de Documento</h3>
    </div>
  )
}