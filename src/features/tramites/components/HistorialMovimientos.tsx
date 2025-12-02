// En: src/features/tramites/components/HistorialMovimientos.tsx
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ArrowRight,
  Building2,
  StickyNote,
  AlertTriangle,
  History,
  FileText,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type Movimiento } from '@/features/tramites/types'
import {
  obtenerTipoInteraccion,
  obtenerTextoSeguro,
} from '../utils/tramite-helpers'

interface HistorialMovimientosProps {
  movimientos: Movimiento[]
}

export function HistorialMovimientos({
  movimientos,
}: HistorialMovimientosProps) {
  if (!movimientos || movimientos.length === 0) {
    return (
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <History className='h-5 w-5' />
            Historial de Movimientos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-muted-foreground bg-muted/10 flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center'>
            <Building2 className='mb-3 h-10 w-10 opacity-20' />
            <p className='text-sm font-medium'>Sin movimientos registrados</p>
            <p className='mt-1 max-w-xs text-xs'>
              El trámite permanece en su origen inicial.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Ordenamos descendente (más reciente arriba)
  const movimientosOrdenados = [...movimientos].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <Card className='shadow-sm'>
      <CardHeader className='bg-muted/5 border-b pb-4'>
        <CardTitle className='flex items-center gap-2 text-lg'>
          <History className='text-primary h-5 w-5' />
          Trazabilidad ({movimientos.length})
        </CardTitle>
      </CardHeader>

      <CardContent className='px-4 pt-8 pb-4 sm:px-6'>
        <div className='flex flex-col'>
          {movimientosOrdenados.map((mov, index) => {
            const estilo = obtenerTipoInteraccion(mov)
            const Icono = estilo.icon
            const esUltimo = index === movimientosOrdenados.length - 1

            // Texto seguro para notas (si no hay, se muestra un default sutil o nada según prefieras)
            // Aquí forzamos texto si el usuario quiere "rellenar" la UI, o usamos lógica condicional
            const notas = mov.notas // || "Sin notas adicionales" (Descomentar si quieres forzar texto)

            return (
              <div key={mov.id} className='relative flex gap-4'>
                {/* COLUMNA IZQUIERDA: LÍNEA DE TIEMPO */}
                <div className='flex flex-col items-center'>
                  {/* Icono del nodo */}
                  <div
                    className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm ${estilo.bg} ${estilo.border} `}
                  >
                    <Icono className={`h-4 w-4 ${estilo.color}`} />
                  </div>

                  {/* Línea conectora (Borde izquierdo) */}
                  {/* Si no es el último elemento, dibujamos la línea hacia abajo */}
                  {!esUltimo && <div className='bg-border my-1 w-px' />}
                </div>

                {/* COLUMNA DERECHA: CONTENIDO DE LA TARJETA */}
                {/* pb-8 da el espacio visual entre items sin usar margin que colapsa */}
                <div
                  className={`min-w-0 flex-1 ${!esUltimo ? 'pb-8' : 'pb-2'}`}
                >
                  {/* 1. ENCABEZADO: ACCIÓN Y USUARIO */}
                  <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1'>
                    <div className='flex items-center gap-2'>
                      <span className={`text-sm font-bold ${estilo.color}`}>
                        {mov.tipoAccion}
                      </span>
                      <span className='text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-xs font-medium'>
                        por {mov.usuarioCreador?.name || 'Sistema'}
                      </span>
                    </div>
                    <time className='text-muted-foreground font-mono text-xs whitespace-nowrap'>
                      {format(new Date(mov.createdAt), 'dd MMM yyyy, HH:mm', {
                        locale: es,
                      })}
                    </time>
                  </div>

                  {/* 2. TARJETA PRINCIPAL DE RUTA */}
                  <div
                    className={`mb-3 rounded-lg border p-3 text-sm transition-colors ${estilo.tipo === 'ENVIO' ? 'border-blue-100 bg-blue-50/30 hover:bg-blue-50/50' : 'border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50/50'} `}
                  >
                    <div className='flex flex-wrap items-center gap-2'>
                      {/* Origen */}
                      <div className='bg-background/80 border-muted-foreground/30 flex min-w-0 items-center gap-1.5 rounded border border-dashed px-2 py-1'>
                        <Building2 className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
                        <span
                          className='max-w-[120px] truncate text-xs font-medium sm:max-w-xs'
                          title={mov.oficinaOrigen.nombre}
                        >
                          {mov.oficinaOrigen.siglas}
                        </span>
                      </div>

                      <ArrowRight
                        className={`h-4 w-4 shrink-0 ${estilo.color}`}
                      />

                      {/* Destino */}
                      <div className='bg-background flex min-w-0 items-center gap-1.5 rounded border px-2 py-1 shadow-sm'>
                        <span
                          className={`max-w-[150px] truncate text-xs font-bold sm:max-w-xs ${estilo.color}`}
                        >
                          {mov.destinos && mov.destinos.length > 0
                            ? mov.destinos[0].oficinaDestino.nombre
                            : 'Gestión Interna / Mismo Origen'}
                        </span>
                      </div>
                    </div>

                    {/* Documento de Referencia (Si existe) */}
                    {mov.numeroDocumentoCompleto && (
                      <div className='border-border/60 mt-2 flex items-center gap-2 border-t border-dashed pt-2'>
                        <FileText className='text-muted-foreground h-3.5 w-3.5' />
                        <span className='text-muted-foreground font-mono text-xs'>
                          Ref:{' '}
                          <span className='text-foreground font-medium'>
                            {mov.numeroDocumentoCompleto}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 3. SECCIÓN DE CONTENIDO (Notas y Observaciones) */}
                  {/* Renderizado condicional limpio: Si no hay nada, mostramos mensaje default si lo deseas */}
                  <div className='space-y-2'>
                    {notas ? (
                      <div className='bg-background rounded-md border p-3 text-sm shadow-sm'>
                        <div className='flex items-start gap-2'>
                          <StickyNote className='mt-0.5 h-4 w-4 shrink-0 text-blue-500' />
                          <div className='space-y-1'>
                            <p className='text-muted-foreground text-xs font-bold tracking-wide uppercase'>
                              Asunto / Nota
                            </p>
                            <p className='text-foreground/90 leading-relaxed'>
                              {notas}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Fallback visual para mantener consistencia si es mandatorio mostrar algo
                      <div className='text-muted-foreground pl-1 text-xs italic'>
                        Sin asunto o notas registradas.
                      </div>
                    )}

                    {mov.observaciones && (
                      <div className='rounded-md border border-amber-200 bg-amber-50 p-3 text-sm shadow-sm'>
                        <div className='flex items-start gap-2'>
                          <AlertTriangle className='mt-0.5 h-4 w-4 shrink-0 text-amber-600' />
                          <div className='space-y-1'>
                            <p className='text-xs font-bold tracking-wide text-amber-700 uppercase'>
                              Observación Importante
                            </p>
                            <p className='text-foreground/90 leading-relaxed'>
                              {mov.observaciones}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
