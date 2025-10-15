// En: src/features/tramites/components/columns.tsx

'use client'

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

// 1. Define el tipo de dato para un Trámite, basándonos en tu API
export type Tramite = {
  id: string
  numeroDocumentoCompleto: string
  asunto: string
  estado: 'ABIERTO' | 'CERRADO' | 'ARCHIVADO'
  prioridad: 'BAJA' | 'NORMAL' | 'ALTA' | 'URGENTE'
  fechaIngreso: string
  oficinaRemitente: {
    nombre: string
  }
}

// 2. Define las columnas para la tabla
export const columns: ColumnDef<Tramite>[] = [
  {
    accessorKey: 'numeroDocumentoCompleto',
    header: 'N° Documento',
  },
  {
    accessorKey: 'asunto',
    header: 'Asunto',
  },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => {
      const estado = row.getValue('estado') as string
      // Asigna colores a los badges según el estado
      const variant =
        estado === 'CERRADO' || estado === 'ARCHIVADO'
          ? 'destructive'
          : 'default'
      return <Badge variant={variant}>{estado}</Badge>
    },
  },
  {
    accessorKey: 'oficinaRemitente.nombre',
    header: 'Oficina Remitente',
  },
  {
    accessorKey: 'fechaIngreso',
    header: 'Fecha de Ingreso',
    cell: ({ row }) => {
      // Formatea la fecha para que sea más legible
      const fecha = new Date(row.getValue('fechaIngreso'))
      return new Intl.DateTimeFormat('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(tramite.id)}
            >
              Copiar ID del Trámite
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver Detalle</DropdownMenuItem>
            <DropdownMenuItem>Registrar Movimiento</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
