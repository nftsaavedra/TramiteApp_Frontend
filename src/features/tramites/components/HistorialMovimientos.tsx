// En: src/features/tramites/components/HistorialMovimientos.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type Movimiento } from '@/features/tramites/types'
import { MovimientoItem } from './MovimientoItem'

interface HistorialMovimientosProps {
  movimientos: Movimiento[]
}

export function HistorialMovimientos({
  movimientos,
}: HistorialMovimientosProps) {
  if (movimientos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Movimientos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground text-sm'>
            Este trámite aún no tiene movimientos registrados.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Movimientos</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {movimientos.map((movimiento) => (
          <MovimientoItem key={movimiento.id} movimiento={movimiento} />
        ))}
      </CardContent>
    </Card>
  )
}
