'use client'

import { Link } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import {
  MoreHorizontal,
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Archive,
  FileText,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/data-table/column-header'

// --- ACTUALIZACIÓN DE TIPO ---
// Agregamos los IDs 'oficinaRemitenteId' y 'tipoDocumentoId' que son necesarios para los filtros
export type Tramite = {
  id: string
  numeroDocumentoCompleto: string
  asunto: string
  estado: 'EN_PROCESO' | 'FINALIZADO' | 'ARCHIVADO' // Actualizado a tus nuevos estados
  prioridad: 'URGENTE' | 'ALTA' | 'NORMAL' | 'BAJA'
  fechaIngreso: string
  fechaDocumento: string // Agregado para que no falte
  oficinaRemitenteId: string // Requerido para el filtro
  tipoDocumentoId: string // Requerido para el filtro
  oficinaRemitente: {
    siglas: string
    nombre: string
  }
  tipoDocumento: {
    nombre: string
  }
  movimientos: {
    destinos: {
      oficinaDestino: {
        siglas: string
        nombre: string
      }
    }[]
  }[]
  plazo: {
    diasTranscurridos: number | null
    estado: 'VENCIDO' | 'POR_VENCER' | 'A_TIEMPO' | 'NO_APLICA'
  }
}

// --- CONFIGURACIÓN VISUAL (Preservada exactamente como la enviaste) ---

// 1. Prioridad
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

// 2. Estado
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

// --- DEFINICIÓN DE COLUMNAS ---

export const columns: ColumnDef<Tramite>[] = [
  // 1. N° Documento
  {
    accessorKey: 'numeroDocumentoCompleto',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='N° Documento' />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-2 font-bold text-nowrap'>
        <FileText className='text-muted-foreground h-4 w-4' />
        {row.getValue('numeroDocumentoCompleto')}
      </div>
    ),
    enableHiding: false,
  },

  // 2. Prioridad
  {
    accessorKey: 'prioridad',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Prioridad' />
    ),
    cell: ({ row }) => {
      const prioridad = row.original.prioridad
      const config = prioridadConfig[prioridad] || prioridadConfig['NORMAL']
      const Icon = config.icon

      return (
        <Badge
          variant={config.color}
          className='gap-1 pr-2.5 whitespace-nowrap'
        >
          {Icon && <Icon className='h-3 w-3' />}
          {config.label}
        </Badge>
      )
    },
    filterFn: 'arrIncludesSome',
  },

  // 3. Asunto
  {
    accessorKey: 'asunto',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Asunto' />
    ),
    cell: ({ row }) => (
      <div
        className='max-w-[300px] truncate font-medium'
        title={row.getValue('asunto')}
      >
        {row.getValue('asunto')}
      </div>
    ),
  },

  // 4. Tipo Documento (CORREGIDO: ID explícito para que funcione el filtro)
  {
    id: 'tipoDocumentoId', // IMPORTANTE: Coincide con el toolbar
    accessorFn: (row) => row.tipoDocumento.nombre, // Accedemos al nombre para mostrarlo
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tipo' />
    ),
    cell: ({ row }) => (
      <div className='whitespace-nowrap capitalize'>
        {row.original.tipoDocumento.nombre.toLowerCase()}
      </div>
    ),
    filterFn: 'arrIncludesSome', // Habilita el filtrado múltiple
  },

  // 5. Oficina Origen (AGREGADA: Faltaba para que funcione el filtro 'oficinaRemitenteId')
  {
    id: 'oficinaRemitenteId', // IMPORTANTE: Coincide con el toolbar
    accessorFn: (row) => row.oficinaRemitente.siglas,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Origen' />
    ),
    cell: ({ row }) => (
      <span title={row.original.oficinaRemitente.nombre}>
        {row.original.oficinaRemitente.siglas}
      </span>
    ),
    filterFn: 'arrIncludesSome',
  },

  // 6. Ubicación Actual (Tu lógica original preservada)
  {
    id: 'ubicacionActual',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ubicación Actual' />
    ),
    accessorFn: (row) => {
      const ultimoDestino = row.movimientos?.[0]?.destinos?.[0]?.oficinaDestino
      return ultimoDestino ? ultimoDestino.siglas : row.oficinaRemitente.siglas
    },
    cell: ({ row }) => {
      const ultimoMovimiento = row.original.movimientos?.[0]
      const destino = ultimoMovimiento?.destinos?.[0]?.oficinaDestino
      const origen = row.original.oficinaRemitente

      if (destino) {
        return (
          <div className='flex items-center gap-1.5 text-xs whitespace-nowrap'>
            <span className='text-muted-foreground'>{origen.siglas}</span>
            <ArrowRight className='text-muted-foreground h-3 w-3' />
            <span
              className='bg-accent/50 rounded-sm px-1.5 py-0.5 font-bold'
              title={destino.nombre}
            >
              {destino.siglas}
            </span>
          </div>
        )
      }

      return (
        <span
          className='bg-accent/50 rounded-sm px-1.5 py-0.5 text-xs font-bold'
          title={origen.nombre}
        >
          {origen.siglas}
        </span>
      )
    },
  },

  // 7. Estado (Tu lógica original preservada)
  {
    accessorKey: 'estado',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Estado' />
    ),
    cell: ({ row }) => {
      const estado = row.original.estado
      const config = estadoConfig[estado] || estadoConfig['EN_PROCESO']
      const Icon = config.icon

      return (
        <Badge
          variant='outline'
          className={`gap-1.5 border-0 pr-2.5 font-medium ${config.className}`}
        >
          <Icon className='h-3.5 w-3.5' />
          {config.label}
        </Badge>
      )
    },
    filterFn: 'arrIncludesSome',
  },

  // 8. Plazos
  {
    accessorKey: 'plazo',
    header: 'Plazos',
    cell: ({ row }) => {
      const plazo = row.original.plazo

      if (!plazo || plazo.estado === 'NO_APLICA') {
        return <span className='text-muted-foreground text-xs'>-</span>
      }

      const dias = plazo.diasTranscurridos
      let color: 'default' | 'secondary' | 'destructive' = 'default'

      if (plazo.estado === 'VENCIDO') color = 'destructive'
      else if (plazo.estado === 'POR_VENCER') color = 'secondary'

      const label = dias === 0 ? 'Hoy' : `${dias} días`

      return (
        <Badge variant={color} className='whitespace-nowrap'>
          {label}
        </Badge>
      )
    },
  },

  // 9. Fecha Documento
  {
    accessorKey: 'fechaDocumento',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Fecha Doc.' />
    ),
    cell: ({ row }) => {
      const dateValue = row.getValue('fechaDocumento')
      if (!dateValue)
        return <span className='text-muted-foreground text-xs'>-</span>

      const fecha = new Date(dateValue as string)
      return (
        <span className='text-muted-foreground text-xs whitespace-nowrap'>
          {new Intl.DateTimeFormat('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }).format(fecha)}
        </span>
      )
    },
  },

  // 10. Acciones
  {
    id: 'actions',
    cell: ({ row }) => {
      const tramite = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Abrir menú</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>

            <DropdownMenuItem asChild>
              <Link
                to='/tramites/$tramiteId'
                params={{ tramiteId: tramite.id }}
                className='w-full cursor-pointer'
              >
                Ver Seguimiento
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(tramite.numeroDocumentoCompleto)
              }
            >
              Copiar N° Documento
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
