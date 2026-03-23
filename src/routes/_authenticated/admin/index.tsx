import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin/')({
  component: AdminIndex,
})

function AdminIndex() {
  return (
    <div className='w-full space-y-6 p-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Escritorio de Administración</h1>
        <p className='text-muted-foreground'>
          Panel principal para gestionar oficinas, usuarios y tipos de documento.
        </p>
      </div>
    </div>
  )
}
