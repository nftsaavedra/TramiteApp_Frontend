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
  FileText
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

// Importamos el tipo centralizado (asegúrate de que types.ts ya esté actualizado)
import { Tramite } from '../types'

// --- CONFIGURACIÓN VISUAL (Semáforo) ---

// 1. Prioridad: Rojo para lo urgente, azul/gris para lo normal
const prioridadConfig: Record<string, { label: string; color: 'default' | 'secondary' | 'destructive' | 'outline'; icon?: any }> = {
  URGENTE: { label: 'Urgente', color: 'destructive', icon: AlertCircle },
  ALTA: { label: 'Alta', color: 'destructive', icon: AlertCircle },
  NORMAL: { label: 'Normal', color: 'secondary', icon: Clock },
  BAJA: { label: 'Baja', color: 'outline', icon: CheckCircle2 },
}

// 2. Estado: Colores personalizados tipo Excel (Rojo/Verde/Gris)
const estadoConfig: Record<string, { label: string; className: string; icon: any }> = {
  EN_PROCESO: {
    label: 'En Curso',
    // Rojo/Naranja suave para "Pendiente de Atención"
    className: 'bg-orange-100 text-orange-700 hover:bg-orange-100/80 border-orange-200',
    icon: Clock
  },
  FINALIZADO: {
    label: 'Completado',
    // Verde éxito
    className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 border-emerald-200',
    icon: CheckCircle2
  },
  ARCHIVADO: {
    label: 'Archivado',
    // Gris neutro
    className: 'bg-slate-100 text-slate-700 hover:bg-slate-100/80 border-slate-200',
    icon: Archive
  },
}

// --- DEFINICIÓN DE COLUMNAS ---

export const columns: ColumnDef<Tramite>[] = [
  // 1. N° Documento (Identificador)
  {
    accessorKey: 'numeroDocumentoCompleto',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='N° Documento' />
    ),
    cell: ({ row }) => (
      <div className='font-bold text-nowrap flex items-center gap-2'>
        <FileText className="h-4 w-4 text-muted-foreground" />
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
        <Badge variant={config.color} className='gap-1 pr-2.5 whitespace-nowrap'>
          {Icon && <Icon className="h-3 w-3" />}
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
        title={row.getValue('asunto')} // Tooltip nativo
      >
        {row.getValue('asunto')}
      </div>
    ),
  },

  // 4. Tipo Documento
  {
    accessorKey: 'tipoDocumento.nombre',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tipo' />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap capitalize">
        {row.original.tipoDocumento.nombre.toLowerCase()}
      </div>
    ),
  },

  // 5. Ubicación Actual (Trazabilidad)
  {
    id: 'ubicacion',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ubicación Actual' />
    ),
    // Lógica para ordenamiento: Nombre de la oficina donde está
    accessorFn: (row) => {
      const ultimoDestino = row.movimientos?.[0]?.destinos?.[0]?.oficinaDestino
      return ultimoDestino ? ultimoDestino.siglas : row.oficinaRemitente.siglas
    },
    cell: ({ row }) => {
      const ultimoMovimiento = row.original.movimientos?.[0]
      const destino = ultimoMovimiento?.destinos?.[0]?.oficinaDestino
      const origen = row.original.oficinaRemitente

      // Si hay destino, mostramos el flujo
      if (destino) {
        return (
          <div className="flex items-center gap-1.5 text-xs whitespace-nowrap">
            <span className="text-muted-foreground">{origen.siglas}</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <span
              className="font-bold bg-accent/50 px-1.5 py-0.5 rounded-sm"
              title={destino.nombre}
            >
              {destino.siglas}
            </span>
          </div>
        )
      }

      // Si no ha salido, está en origen
      return (
        <span
          className="font-bold text-xs bg-accent/50 px-1.5 py-0.5 rounded-sm"
          title={origen.nombre}
        >
          {origen.siglas}
        </span>
      )
    },
  },

  // 6. Estado del Trámite (Con lógica Excel Rojo/Verde)
  {
    accessorKey: 'estado',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Estado' />
    ),
    cell: ({ row }) => {
      const estado = row.original.estado
      // Fallback seguro a 'EN_PROCESO' si el estado no existe en el mapa
      const config = estadoConfig[estado] || estadoConfig['EN_PROCESO']
      const Icon = config.icon

      return (
        <Badge
          variant="outline"
          className={`gap-1.5 pr-2.5 font-medium border-0 ${config.className}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {config.label}
        </Badge>
      )
    },
    filterFn: 'arrIncludesSome',
  },

  // 7. Plazos (Semáforo de Días)
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

      // Lógica de semáforo
      if (plazo.estado === 'VENCIDO') color = 'destructive'
      else if (plazo.estado === 'POR_VENCER') color = 'secondary' // Amarillo/Naranja

      // Texto descriptivo
      const label = dias === 0 ? 'Hoy' : `${dias} días`

      return (
        <Badge variant={color} className="whitespace-nowrap">
          {label}
        </Badge>
      )
    },
  },

  // 8. Fecha Documento
  {
    accessorKey: 'fechaDocumento',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Fecha Doc.' />
    ),
    cell: ({ row }) => {
      const fecha = new Date(row.getValue('fechaDocumento'))
      return (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {new Intl.DateTimeFormat('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).format(fecha)}
        </span>
      )
    },
  },

  // 9. Acciones (Dropdown)
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

            {/* Ver Detalle */}
            <DropdownMenuItem asChild>
              <Link
                to='/tramites/$tramiteId'
                params={{ tramiteId: tramite.id }}
                className="cursor-pointer w-full"
              >
                Ver Seguimiento
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Copiar ID */}
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(tramite.numeroDocumentoCompleto)}
            >
              Copiar N° Documento
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]