// En: src/features/tramites/components/AccionesTramite.tsx
import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { RegistrarMovimientoForm } from './RegistrarMovimientoForm'

// 1. La interfaz de props ahora incluye la oficina actual
interface AccionesTramiteProps {
  tramiteId: string
  oficinaActualNombre: string
}

export function AccionesTramite({
  tramiteId,
  oficinaActualNombre,
}: AccionesTramiteProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Acciones</CardTitle>
          <CardDescription>Continúe con el flujo del trámite.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className='w-full' onClick={() => setIsModalOpen(true)}>
            <Send className='mr-2 h-4 w-4' /> Registrar Movimiento
          </Button>
        </CardContent>
      </Card>

      <RegistrarMovimientoForm
        tramiteId={tramiteId}
        // 2. Pasa la nueva prop al formulario modal
        oficinaActualNombre={oficinaActualNombre}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  )
}
