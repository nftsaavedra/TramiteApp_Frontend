import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  Archive,
} from 'lucide-react'

export const estados = [
  {
    value: 'EN_PROCESO',
    label: 'En Curso',
    icon: Clock,
  },
  {
    value: 'FINALIZADO',
    label: 'Completado',
    icon: CheckCircle2,
  },
  {
    value: 'ARCHIVADO',
    label: 'Archivado',
    icon: Archive,
  },
]

export const prioridades = [
  {
    value: 'BAJA',
    label: 'Baja',
    icon: ArrowDown,
  },
  {
    value: 'NORMAL',
    label: 'Normal',
    icon: ArrowRight,
  },
  {
    value: 'ALTA',
    label: 'Alta',
    icon: ArrowUp,
  },
  {
    value: 'URGENTE',
    label: 'Urgente',
    icon: AlertCircle,
  },
]
