import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/tramites/')({
  component: TramitesIndex,
})

function TramitesIndex() {
  return (
    <div className='p-2'>
      <h3>Página de Lista de Trámites</h3>
    </div>
  )
}
