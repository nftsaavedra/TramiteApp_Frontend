'use client'

import { Link } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Archive,
  FileText,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
// Importamos variantes de estilo
import { DataTableColumnHeader } from '@/components/data-table/column-header'

// --- DEFINICIÓN DE TIPO ACTUALIZADA ---
export type Tramite = {
  id: string
  nombreDocumentoCompleto: string
  asunto: string
  estado: 'EN_PROCESO' | 'FINALIZADO' | 'ARCHIVADO'
  prioridad: 'URGENTE' | 'ALTA' | 'NORMAL' | 'BAJA'
  fechaIngreso: string
  fechaRecepcion: string // Renombrado de fechaDocumento
  tipoRegistro: 'RECEPCION' | 'ENVIO' // Nuevo campo
  observaciones?: string // Nuevo campo
  copiasIds?: string[] // Nuevo campo

  oficinaRemitenteId: string
  tipoDocumentoId: string

  oficinaRemitente: {
    siglas: string
    nombre: string
  }
  tipoDocumento: {
    nombre: string
  }

  // Destino principal
  oficinaDestino?: {
    siglas: string
    nombre: string
  } | null

  // Estructura simplificada de movimientos
  movimientos: {
    oficinaDestino?: {
      siglas: string
      nombre: string
    } | null
    oficinaOrigen: {
      siglas: string
      nombre: string
    }
  }[]

  plazo: {
    diasTranscurridos: number | null
    estado: 'VENCIDO' | 'POR_VENCER' | 'A_TIEMPO' | 'NO_APLICA'
  }
}

// --- CONFIGURACIÓN VISUAL ---

const prioridadConfig: Record<
  string,
  {
    label: string
    color: 'default' | 'secondary' | 'destructive' | 'outline'
    icon?: any
  }
> = {
  URGENTE: { label: 'Urgente', color: 'destructive', icon: AlertCircle },
  ALTA: { label: 'Alta', color: 'destructive', icon: AlertCircle },
  NORMAL: { label: 'Normal', color: 'secondary', icon: Clock },
  BAJA: { label: 'Baja', color: 'outline', icon: CheckCircle2 },
}

const estadoConfig: Record<
  string,
  { label: string; className: string; icon: any }
> = {
  EN_PROCESO: {
    label: 'En Curso',
    className:
      'bg-orange-100 text-orange-700 hover:bg-orange-100/80 border-orange-200',
    icon: Clock,
  },
  FINALIZADO: {
    label: 'Completado',
    className:
      'bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 border-emerald-200',
    icon: CheckCircle2,
  },
  ARCHIVADO: {
    label: 'Archivado',
    className:
      'bg-slate-100 text-slate-700 hover:bg-slate-100/80 border-slate-200',
    icon: Archive,
  },
}

// --- COLUMNAS REORDENADAS Y CORREGIDAS ---

export const columns: ColumnDef<Tramite>[] = [
  // 1. FECHA (Fecha Recepción)
  {
    accessorKey: 'fechaRecepcion',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Fecha Recepción' />
    ),
    cell: ({ row }) => {
      const dateValue = row.getValue('fechaRecepcion')
      if (!dateValue) return <span className=''>-</span>

      const fecha = new Date(dateValue as string)
      return (
        <span className='text-muted-foreground text-sm font-medium'>
          {new Intl.DateTimeFormat('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }).format(fecha)}
        </span>
      )
    },
  },

  // 2. ORIGEN
  {
    id: 'oficinaRemitenteId',
    accessorFn: (row) => row.oficinaRemitente.siglas,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Origen' />
    ),
    cell: ({ row }) => (
      <span
        title={row.original.oficinaRemitente.nombre}
        className='text-foreground text-sm font-bold'
      >
        {row.original.oficinaRemitente.siglas}
      </span>
    ),
    filterFn: 'arrIncludesSome',
  },

  // 3. TIPO
  {
    id: 'tipoDocumentoId',
    accessorFn: (row) => row.tipoDocumento.nombre,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tipo' />
    ),
    cell: ({ row }) => (
      <div className='text-muted-foreground text-xs font-bold tracking-wide uppercase'>
        {row.original.tipoDocumento.nombre}
      </div>
    ),
    filterFn: 'arrIncludesSome',
  },

  // 4. DOCUMENTO (Enlace corregido)
  {
    accessorKey: 'nombreDocumentoCompleto',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Documento' />
    ),
    cell: ({ row }) => (
      // FIX: Envolvemos en un div o fragmento para que TS no confunda el tipo de retorno del Link
      <div className='flex'>
        <Link
          to='/tramites/$tramiteId'
          params={{ tramiteId: row.original.id }}
          className='hover:text-primary group flex items-center gap-2 text-sm font-bold text-nowrap underline decoration-transparent underline-offset-2 transition-all hover:decoration-current'
        >
          <>
            <FileText className='text-primary/70 group-hover:text-primary h-3.5 w-3.5 transition-colors' />
            {row.getValue('nombreDocumentoCompleto')}
          </>
        </Link>
      </div>
    ),
    enableHiding: false,
  },

  // 5. ASUNTO
  {
    accessorKey: 'asunto',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Asunto' />
    ),
    cell: ({ row }) => (
      <div
        className='text-foreground max-w-[250px] truncate text-sm font-medium'
        title={row.getValue('asunto')}
      >
        {row.getValue('asunto')}
      </div>
    ),
  },

  // 6. UBICACIÓN ACTUAL
  {
    id: 'ubicacionActual',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ubicación Actual' />
    ),
    accessorFn: (row) => {
      const ultimoMovimiento = row.movimientos?.[0]
      if (ultimoMovimiento?.oficinaDestino) {
        return ultimoMovimiento.oficinaDestino.siglas
      }
      return (
        ultimoMovimiento?.oficinaOrigen.siglas || row.oficinaRemitente.siglas
      )
    },
    cell: ({ row }) => {
      const ultimoMovimiento = row.original.movimientos?.[0]
      const destino = ultimoMovimiento?.oficinaDestino
      const origen = row.original.oficinaRemitente

      if (destino) {
        return (
          <div className='flex items-center gap-1'>
            <span className='scale-90 opacity-70'>
              {ultimoMovimiento?.oficinaOrigen.siglas}
            </span>
            <ArrowRight className='h-3 w-3' />
            <span
              className='rounded-sm border border-blue-100 bg-blue-50 px-1.5 py-0.5 font-bold text-blue-700'
              title={destino.nombre}
            >
              {destino.siglas}
            </span>
          </div>
        )
      }

      return (
        <span
          className='rounded-sm border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-bold text-slate-600'
          title={origen.nombre}
        >
          {origen.siglas}
        </span>
      )
    },
  },

  // 7. PLAZO
  {
    accessorKey: 'plazo',
    header: 'Plazo',
    cell: ({ row }) => {
      const plazo = row.original.plazo

      if (!plazo || plazo.estado === 'NO_APLICA') {
        return <span className='block text-center'>-</span>
      }

      const dias = plazo.diasTranscurridos
      let color: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline'
      let className = ''

      if (plazo.estado === 'VENCIDO') {
        color = 'destructive'
      } else if (plazo.estado === 'POR_VENCER') {
        color = 'secondary'
        className = 'bg-amber-100 text-amber-800 hover:bg-amber-100'
      } else {
        className = 'text-green-700 border-green-200 bg-green-50'
      }

      const label = dias === 0 ? 'Hoy' : `${dias} días`

      return (
        <Badge
          variant={color}
          className={`h-5 px-1.5 text-[10px] ${className}`}
        >
          {label}
        </Badge>
      )
    },
  },

  // 8. ESTADO
  {
    accessorKey: 'estado',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Estado' />
    ),
    cell: ({ row }) => {
      const estado = row.original.estado
      const config = estadoConfig[estado] || estadoConfig['EN_PROCESO']

      return (
        <Badge
          variant='outline'
          className={`border-0 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${config.className}`}
        >
          {config.label}
        </Badge>
      )
    },
    filterFn: 'arrIncludesSome',
  },

  // 9. PRIORIDAD
  {
    accessorKey: 'prioridad',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Prioridad' />
    ),
    cell: ({ row }) => {
      const prioridad = row.original.prioridad
      const config = prioridadConfig[prioridad] || prioridadConfig['NORMAL']

      return (
        <Badge variant={config.color} className='h-5 px-1.5 text-[10px]'>
          {config.label}
        </Badge>
      )
    },
    filterFn: 'arrIncludesSome',
  },

  // 10. ACCIONES (Simplificado y Corregido TS Error)
  {
    id: 'actions',
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className='flex justify-center'>
              {/* FIX: Usamos el Link con la clase buttonVariants en lugar de anidarlo en un Button asChild */}
              <Link
                to='/tramites/$tramiteId'
                params={{ tramiteId: row.original.id }}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'icon' }),
                  'hover:text-primary h-8 w-8'
                )}
              >
                <Eye className='h-4 w-4' />
                <span className='sr-only'>Ver detalle</span>
              </Link>
            </div>
          </TooltipTrigger>
          <TooltipContent side='left'>Ver detalle</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
]
