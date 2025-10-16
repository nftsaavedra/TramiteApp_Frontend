// En: src/features/tramites/components/columns.tsx

'use client'

import { Link } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
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

// En: src/features/tramites/components/columns.tsx

/**
 * Define la estructura de datos para un Trámite, incluyendo la propiedad `fechaIngreso`
 * y las relaciones anidadas necesarias para la visualización en la tabla.
 */
export type Tramite = {
  id: string
  numeroDocumentoCompleto: string
  asunto: string
  estado: 'ABIERTO' | 'CERRADO' | 'ARCHIVADO'
  fechaIngreso: string // <-- CORRECCIÓN: Propiedad añadida nuevamente
  oficinaRemitente: {
    siglas: string
  }
  tipoDocumento: {
    nombre: string
  }
  movimientos: {
    destinos: {
      oficinaDestino: {
        siglas: string
      }
    }[]
  }[]
  plazo: {
    diasTranscurridos: number | null
    estado: 'VENCIDO' | 'POR_VENCER' | 'A_TIEMPO' | 'NO_APLICA'
  }
}

/**
 * Define las columnas para la tabla de trámites.
 */
export const columns: ColumnDef<Tramite>[] = [
  {
    accessorKey: 'numeroDocumentoCompleto',
    header: 'N° Documento',
    cell: ({ row }) => (
      <div className='font-medium'>
        {row.getValue('numeroDocumentoCompleto')}
      </div>
    ),
  },
  {
    accessorKey: 'asunto',
    header: 'Asunto',
    cell: ({ row }) => (
      <div className='min-w-[300px]'>{row.getValue('asunto')}</div>
    ),
  },
  {
    id: 'ubicacionActual',
    header: 'Ubicación Actual',
    accessorFn: (row) =>
      row.movimientos?.[0]?.destinos?.[0]?.oficinaDestino.siglas ??
      row.oficinaRemitente.siglas,
    cell: ({ getValue }) => (
      <div className='font-semibold'>{getValue<string>()}</div>
    ),
  },
  {
    accessorKey: 'tipoDocumento.nombre',
    header: 'Tipo de Documento',
  },
  {
    accessorKey: 'plazo',
    header: 'Estado del Plazo',
    cell: ({ row }) => {
      const plazo = row.original.plazo

      if (plazo.estado === 'NO_APLICA') {
        return <span className='text-muted-foreground text-xs'>N/A</span>
      }

      let texto: string
      let color: 'destructive' | 'secondary' | 'default'

      switch (plazo.estado) {
        case 'VENCIDO':
          texto = `Vencido (${plazo.diasTranscurridos} días)`
          color = 'destructive'
          break
        case 'POR_VENCER':
          texto = `Por vencer (${plazo.diasTranscurridos} días)`
          color = 'secondary'
          break
        default:
          texto = `A tiempo (${plazo.diasTranscurridos} días)`
          color = 'default'
          break
      }

      return <Badge variant={color}>{texto}</Badge>
    },
  },
  {
    accessorKey: 'estado',
    header: 'Estado Trámite',
    cell: ({ row }) => {
      const estado = row.getValue('estado') as string
      const variant =
        estado === 'CERRADO' || estado === 'ARCHIVADO' ? 'outline' : 'default'
      return <Badge variant={variant}>{estado}</Badge>
    },
  },
  {
    accessorKey: 'fechaIngreso',
    header: 'Fecha de Ingreso',
    cell: ({ row }) => {
      const fecha = new Date(row.original.fechaIngreso)
      return new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(fecha)
    },
  },
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
              >
                Ver Detalle y Movimientos
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(tramite.numeroDocumentoCompleto)
              }
            >
              Copiar N° de Documento
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
