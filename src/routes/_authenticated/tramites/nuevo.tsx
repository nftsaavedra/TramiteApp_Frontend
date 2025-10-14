 
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/tramites/nuevo')({
  component: TramitesNuevo,
})

function TramitesNuevo() {
  return (
    <div className="p-2">
      <h3>Página para Crear Nuevo Trámite</h3>
    </div>
  )
}