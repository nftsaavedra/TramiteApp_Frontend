// En: src/features/tramites/components/HistorialMovimientos.tsx
import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ArrowRight,
  Building2,
  StickyNote,
  AlertTriangle,
  History,
  FileText,
  Calendar,
  Send,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type Movimiento } from '@/features/tramites/types'
import {
  obtenerTipoInteraccion,
  obtenerAsuntoMovimiento,
} from '../utils/tramite-helpers'
import { AnotacionFormDialog } from './AnotacionFormDialog'
import { AnotacionItem } from './AnotacionItem'
import { RegistrarMovimientoForm } from './RegistrarMovimientoForm'

interface HistorialMovimientosProps {
  movimientos: Movimiento[]
  tramiteAsunto: string
  tramiteId: string
}

export function HistorialMovimientos({
  movimientos,
  tramiteAsunto,
  tramiteId,
}: HistorialMovimientosProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const tieneMovimientos = movimientos && movimientos.length > 0

  // Ordenamos descendente (más reciente arriba) si hay movimientos
  const movimientosOrdenados = tieneMovimientos
    ? [...movimientos].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : []

  return (
    <>
      <Card className='shadow-sm'>
        <CardHeader className='bg-muted/5 border-b pb-4'>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <History className='text-primary h-5 w-5' />
              Historial de Movimientos
            </CardTitle>
            <div className='flex items-center gap-2'>
              {tieneMovimientos && (
                <Badge
                  variant='outline'
                  className='text-muted-foreground text-xs font-normal'
                >
                  {movimientos.length} pasos
                </Badge>
              )}
              <Button size='sm' onClick={() => setIsModalOpen(true)}>
                <Send className='mr-2 h-4 w-4' /> Registrar Movimiento
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className='px-4 pt-8 pb-4 sm:px-6'>
          {!tieneMovimientos ? (
            <div className='text-muted-foreground bg-muted/10 flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center'>
              <Building2 className='mb-3 h-10 w-10 opacity-20' />
              <p className='text-sm font-medium'>Sin movimientos registrados</p>
              <p className='mt-1 max-w-xs text-xs'>
                El trámite permanece en su origen inicial.
              </p>
            </div>
          ) : (
            <div className='flex flex-col'>
              {movimientosOrdenados.map((mov, index) => {
                const estilo = obtenerTipoInteraccion(mov)
                const Icono = estilo.icon

                // Lógica para resaltar el último movimiento
                const esElMasReciente = index === 0
                const esUltimoEnLista =
                  index === movimientosOrdenados.length - 1
                const esElPrimeroCronologico = esUltimoEnLista // (Porque ordenamos descendente)

                // Obtener el asunto correcto (del movimiento o heredado del trámite)
                const asuntoMovimiento = obtenerAsuntoMovimiento(
                  mov,
                  tramiteAsunto,
                  esElPrimeroCronologico
                )

                return (
                  <div key={mov.id} className='group relative flex gap-4'>
                    {/* COLUMNA IZQUIERDA: LÍNEA DE TIEMPO */}
                    <div className='flex flex-col items-center'>
                      {/* Icono del nodo */}
                      <div
                        className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm transition-all ${esElMasReciente ? 'ring-primary/20 scale-110 ring-2 ring-offset-2' : ''} ${estilo.bg} ${estilo.border} `}
                      >
                        <Icono className={`h-4 w-4 ${estilo.color}`} />
                      </div>

                      {/* Línea conectora (Borde izquierdo) */}
                      {!esUltimoEnLista && (
                        <div className='bg-border group-hover:bg-primary/20 my-1 h-full w-px transition-colors' />
                      )}
                    </div>

                    {/* COLUMNA DERECHA: CONTENIDO DE LA TARJETA */}
                    <div
                      className={`min-w-0 flex-1 ${!esUltimoEnLista ? 'pb-8' : 'pb-2'}`}
                    >
                      {/* 1. DATA PRINCIPAL: FECHA REAL Y DOCUMENTO */}
                      <div className='mb-1 flex flex-col gap-1'>
                        <div className='flex items-start justify-between gap-4'>
                          {/* Identidad del Documento o Acción */}
                          <div className='flex flex-col'>
                            {mov.nombreDocumentoCompleto ? (
                              <span className='text-foreground text-base font-bold tracking-tight'>
                                {mov.nombreDocumentoCompleto}
                              </span>
                            ) : (
                              <span className='text-foreground/80 text-sm font-semibold'>
                                {estilo.label}
                              </span>
                            )}

                            {/* Ruta / Contexto Administrativo */}
                            <div className='text-muted-foreground mt-1 flex items-center gap-2 text-xs'>
                              <Badge
                                variant='outline'
                                className='h-5 border-slate-200 py-0 text-[10px] font-normal tracking-wider text-slate-500 uppercase'
                              >
                                {mov.tipoAccion}
                              </Badge>
                              <span>|</span>
                              <div className='flex items-center gap-1'>
                                <span
                                  title={mov.oficinaOrigen.nombre}
                                  className='font-medium text-slate-700'
                                >
                                  {mov.oficinaOrigen.siglas}
                                </span>
                                <ArrowRight className='h-3 w-3 text-slate-400' />
                                <span
                                  title={
                                    mov.oficinaDestino?.nombre ??
                                    'Gestión Interna'
                                  }
                                  className='font-medium text-slate-700'
                                >
                                  {mov.oficinaDestino
                                    ? mov.oficinaDestino.siglas
                                    : mov.oficinaOrigen.siglas}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Fecha del Cargo / Movimiento (Prioridad) */}
                          <div className='flex shrink-0 flex-col items-end'>
                            <div className='flex items-center gap-1.5 rounded-md border border-slate-200/50 bg-slate-100/80 px-2 py-1 text-sm font-semibold text-slate-700'>
                              <Calendar className='h-3.5 w-3.5 text-slate-500' />
                              <time>
                                {format(
                                  new Date(
                                    mov.fechaMovimiento ||
                                      mov.fechaRecepcion ||
                                      mov.createdAt
                                  ),
                                  'dd MMM yyyy, HH:mm',
                                  { locale: es }
                                )}
                              </time>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 2. ASUNTO DEL MOVIMIENTO */}
                      <div className='mt-3 mb-2'>
                        <p className='text-foreground/90 text-sm leading-relaxed font-normal'>
                          <span className='text-foreground/60 mr-2 text-xs font-semibold tracking-wide uppercase'>
                            Asunto:
                          </span>
                          {asuntoMovimiento}
                        </p>
                      </div>

                      {/* SECCIÓN UNIFICADA: NOTAS, OBSERVACIONES Y ANOTACIONES */}
                      <div className='mt-2 space-y-2 border-l-2 border-slate-100 pl-3'>
                        {/* 1. NOTAS DEL SISTEMA (Nota/Observación) */}
                        {(mov.notas || mov.observaciones) && (
                          <div className='space-y-2 pt-1'>
                            {mov.observaciones && (
                              <div className='flex gap-2 rounded-md bg-amber-50/50 p-2 text-sm text-amber-700'>
                                <AlertTriangle className='mt-0.5 h-4 w-4 shrink-0 text-amber-500' />
                                <div className='flex flex-col'>
                                  <span className='mb-0.5 text-xs font-semibold tracking-wide text-amber-600 uppercase'>
                                    Observación Importante
                                  </span>
                                  <span>{mov.observaciones}</span>
                                </div>
                              </div>
                            )}
                            {mov.notas && (
                              <div className='flex gap-2 text-sm text-slate-600'>
                                <StickyNote className='mt-0.5 h-4 w-4 shrink-0 text-slate-400' />
                                <span>{mov.notas}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 2. ANOTACIONES DE USUARIOS */}
                        {mov.anotaciones && mov.anotaciones.length > 0 && (
                          <div className='space-y-2 pt-1'>
                            {mov.anotaciones.map((nota) => (
                              <AnotacionItem
                                key={nota.id}
                                anotacion={nota}
                                minimal
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer: Auditoría / Metadata de Sistema */}
                      <div className='mt-3 flex items-center justify-between border-t border-slate-100 pt-2'>
                        <div className='flex items-center gap-4 font-mono text-[10px] text-slate-400'>
                          <span title='Fecha de registro en sistema'>
                            Reg:{' '}
                            {format(new Date(mov.createdAt), 'dd/MM/yy HH:mm', {
                              locale: es,
                            })}
                          </span>
                          <span>
                            Por: {mov.usuarioCreador?.name ?? 'Sistema'}
                          </span>
                        </div>

                        {/* Botón de Anotar solo para el último movimiento (Activo) */}
                        {esElMasReciente && (
                          <AnotacionFormDialog
                            tramiteId={tramiteId}
                            movimientoId={mov.id}
                            trigger={
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-6 gap-1.5 px-2 text-[10px] text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                              >
                                <StickyNote className='h-3 w-3' />
                                <span>Anotar</span>
                              </Button>
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <RegistrarMovimientoForm
        tramiteId={tramiteId}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  )
}
