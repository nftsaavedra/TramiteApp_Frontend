// En: src/features/tramites/components/DetallesPrincipales.tsx
import { format } from 'date-fns'
import {
  FileText,
  Building,
  Calendar,
  ChevronsRight,
  AlertTriangle,
  FileCheck,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type TramiteCompleto } from '@/features/tramites/types'
import { InfoItem } from './InfoItem'

interface DetallesPrincipalesProps {
  tramite: TramiteCompleto
}

// Helper para formatear fechas
const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd/MM/yyyy, HH:mm')
}

export function DetallesPrincipales({ tramite }: DetallesPrincipalesProps) {
  const estadoVariant =
    tramite.estado === 'CERRADO' || tramite.estado === 'ARCHIVADO'
      ? 'destructive'
      : 'default'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información General del Trámite</CardTitle>
      </CardHeader>
      <CardContent className='grid grid-cols-1 gap-6 text-sm md:grid-cols-2 lg:grid-cols-3'>
        <InfoItem icon={FileText} label='Asunto' value={tramite.asunto} />
        <InfoItem
          icon={Building}
          label='Oficina Remitente'
          value={tramite.oficinaRemitente.nombre}
        />
        <InfoItem
          icon={FileCheck}
          label='Tipo de Documento'
          value={tramite.tipoDocumento.nombre}
        />
        <InfoItem
          icon={Calendar}
          label='Fecha del Documento'
          value={formatDate(tramite.fechaDocumento)}
        />
        <InfoItem
          icon={ChevronsRight}
          label='Fecha de Ingreso'
          value={formatDate(tramite.fechaIngreso)}
        />
        <InfoItem
          icon={AlertTriangle}
          label='Estado Actual'
          value={<Badge variant={estadoVariant}>{tramite.estado}</Badge>}
        />
        {tramite.observaciones && (
          <InfoItem
            icon={FileText}
            label='Observaciones'
            value={tramite.observaciones}
          />
        )}
        {tramite.notas && (
          <InfoItem icon={FileText} label='Notas' value={tramite.notas} />
        )}
      </CardContent>
    </Card>
  )
}
