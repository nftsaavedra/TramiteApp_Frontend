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
                      {/* 1. ENCABEZADO: ACCIÓN Y USUARIO */}
                      <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1'>
                        <div className='flex items-center gap-2'>
                          <span className={`text-sm font-bold ${estilo.color}`}>
                            {estilo.label}
                          </span>
                          <span className='text-muted-foreground bg-muted rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase'>
                            {mov.tipoAccion}
                          </span>
                          {/* Botón de Anotar solo para el último movimiento (Activo) */}
                          {esElMasReciente && (
                            <AnotacionFormDialog
                              tramiteId={tramiteId}
                              movimientoId={mov.id}
                              trigger={
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='h-6 w-6 rounded-full hover:bg-blue-50 hover:text-blue-600'
                                  title='Agregar observación o anotación a este paso'
                                >
                                  <StickyNote className='h-3.5 w-3.5' />
                                </Button>
                              }
                            />
                          )}
                        </div>
                        <div className='text-muted-foreground flex items-center gap-1 text-xs'>
                          <Calendar className='h-3 w-3' />
                          <time className='font-mono whitespace-nowrap'>
                            {format(
                              new Date(mov.createdAt),
                              'dd MMM yyyy, HH:mm',
                              {
                                locale: es,
                              }
                            )}
                          </time>
                        </div>
                      </div>

                      {/* 2. TARJETA PRINCIPAL DE RUTA */}
                      <div
                        className={`bg-background mb-3 rounded-lg border p-3 text-sm shadow-sm transition-colors`}
                      >
                        <div className='flex flex-wrap items-center gap-2'>
                          {/* Origen */}
                          <div className='text-muted-foreground bg-muted/50 flex items-center gap-1.5 rounded px-2 py-1'>
                            <Building2 className='h-3.5 w-3.5 shrink-0' />
                            <span
                              className='truncate text-xs font-medium'
                              title={mov.oficinaOrigen.nombre}
                            >
                              {mov.oficinaOrigen.siglas}
                            </span>
                          </div>

                          <ArrowRight
                            className={`h-4 w-4 shrink-0 ${estilo.color}`}
                          />

                          {/* Destino (NUEVA LÓGICA DIRECTA) */}
                          <div className='flex min-w-0 items-center gap-1.5'>
                            <span
                              className={`truncate text-xs font-bold ${estilo.color}`}
                            >
                              {mov.oficinaDestino
                                ? mov.oficinaDestino.nombre
                                : '(Gestión Interna / Mismo Origen)'}
                            </span>
                          </div>
                        </div>

                        {/* Documento de Referencia en el Movimiento (Si existe) */}
                        {mov.nombreDocumentoCompleto && (
                          <div className='border-border/60 mt-2 flex items-center gap-2 border-t border-dashed pt-2'>
                            <FileText className='text-muted-foreground h-3.5 w-3.5' />
                            <span className='text-muted-foreground font-mono text-xs'>
                              Ref:{' '}
                              <span className='text-foreground font-medium'>
                                {mov.nombreDocumentoCompleto}
                              </span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 3. SECCIÓN DE CONTENIDO: ASUNTO (Mandatorio) */}
                      <div className='mb-2 rounded-md border border-slate-200 bg-slate-50 p-3'>
                        <p className='mb-1 text-[10px] font-bold tracking-wide text-slate-500 uppercase'>
                          Asunto del Movimiento
                        </p>
                        <p className='text-foreground text-sm leading-relaxed font-medium'>
                          {asuntoMovimiento}
                        </p>
                      </div>

                      {/* SECCIÓN UNIFICADA: NOTAS, OBSERVACIONES Y ANOTACIONES */}
                      <div className='mt-3 space-y-3 border-l-2 border-slate-100 pl-3'>
                        {/* 1. NOTAS DEL SISTEMA (Nota/Observación) */}
                        {(mov.notas || mov.observaciones) && (
                          <div className='space-y-2'>
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
                          <div className='space-y-3 pt-2'>
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
