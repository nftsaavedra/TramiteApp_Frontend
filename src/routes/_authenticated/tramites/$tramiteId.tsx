 
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/tramites/$tramiteId')({
  component: TramiteDetalle,
})

function TramiteDetalle() {
  const { tramiteId } = Route.useParams()
  return (
    <div className="p-2">
      <h3>Detalle del Trámite ID: {tramiteId}</h3>
    </div>
  )
}