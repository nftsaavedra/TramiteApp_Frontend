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

// Importa Link para la navegación

// 1. El tipo de dato 'Tramite' ya es correcto y espera los objetos anidados.
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
  tipoDocumento: {
    nombre: string
  }
}

// 2. Definición de columnas actualizada y reordenada
export const columns: ColumnDef<Tramite>[] = [
  {
    accessorKey: 'numeroDocumentoCompleto',
    header: 'N° Documento',
  },
  {
    accessorKey: 'asunto',
    header: 'Asunto',
    // Permite que esta columna ocupe más espacio si es necesario
    cell: ({ row }) => (
      <div className='min-w-[300px]'>{row.getValue('asunto')}</div>
    ),
  },
  // --- INICIO: COLUMNAS ACTUALIZADAS Y AÑADIDAS ---
  {
    accessorKey: 'tipoDocumento',
    header: 'Tipo de Documento',
    // Accedemos al nombre a través del objeto anidado
    cell: ({ row }) => row.original.tipoDocumento.nombre,
  },
  {
    accessorKey: 'oficinaRemitente',
    header: 'Oficina Remitente',
    // Accedemos al nombre a través del objeto anidado
    cell: ({ row }) => row.original.oficinaRemitente.nombre,
  },
  // --- FIN: COLUMNAS ACTUALIZADAS Y AÑADIDAS ---
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => {
      const estado = row.getValue('estado') as string
      const variant =
        estado === 'CERRADO' || estado === 'ARCHIVADO'
          ? 'destructive'
          : 'default'
      return <Badge variant={variant}>{estado}</Badge>
    },
  },
  {
    accessorKey: 'fechaIngreso',
    header: 'Fecha de Ingreso',
    cell: ({ row }) => {
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
            {/* --- MEJORA: El enlace ahora navega a la página de detalle --- */}
            <DropdownMenuItem asChild>
              <Link
                to='/tramites/$tramiteId'
                params={{ tramiteId: tramite.id }}
              >
                Ver Detalle y Movimientos
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Registrar Movimiento</DropdownMenuItem>
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
