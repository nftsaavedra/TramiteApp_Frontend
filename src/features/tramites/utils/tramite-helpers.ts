// En: src/features/tramites/utils/tramite-helpers.ts
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
  // Nuevo icono para salida
  ArrowDownLeft, // Nuevo icono para entrada
} from 'lucide-react'
import { TramiteCompleto, Movimiento } from '../types'

/**
 * Determina la ubicación actual del trámite basándose en la trazabilidad.
 * Lógica de Negocio:
 * 1. Si NO hay movimientos: El trámite está en bandeja de la 'Oficina Remitente'.
 * 2. Si HAY movimientos:
 * a) Si el último movimiento tiene destino: Está en la 'Oficina Destino'.
 * b) Si el último movimiento NO tiene destino (ej. cierre interno): Se asume que sigue en la 'Oficina Origen'.
 */
export const obtenerUbicacionActual = (tramite: TramiteCompleto): string => {
  // Lógica Maestra: Si el backend informa oficinaDestino, esa es la ubicación actual.
  // [DEBUG] Priorizamos el campo maestro.
  if (tramite.oficinaDestino) {
    return tramite.oficinaDestino.nombre
  }

  // Caso 1: Trámite recién ingresado o sin flujo iniciado
  if (!tramite.movimientos || tramite.movimientos.length === 0) {
    // Si es recepcion (tiene remitente) y no tiene destino, asumimos que falló la asignación, pero mostramos advertencia?
    // Mejor fallback: Si es recepcion y no hay movimientos, debería ser VPIN.
    // Pero si el backend falló, mejor mostrar origen.
    return tramite.oficinaRemitente?.nombre || 'Origen Desconocido'
  }

  // Ordenamos por seguridad
  const movimientosOrdenados = [...tramite.movimientos].sort((a, b) => {
    const fechaA = new Date(a.createdAt).getTime()
    const fechaB = new Date(b.createdAt).getTime()
    return fechaA - fechaB
  })

  const ultimoMovimiento = movimientosOrdenados[movimientosOrdenados.length - 1]

  // Caso 2a: Movimiento con destino directo (NUEVA LÓGICA)
  if (ultimoMovimiento.oficinaDestino) {
    return ultimoMovimiento.oficinaDestino.nombre
  }

  // Caso 2b: Movimiento interno o cierre sin destino explícito
  return ultimoMovimiento.oficinaOrigen?.nombre || 'Ubicación Desconocida'
}

/**
 * Determina si el movimiento es de SALIDA (Envío) o ENTRADA (Recepción/Interno).
 * Devuelve la configuración visual (Iconos y Colores) para el Timeline.
 */
export const obtenerTipoInteraccion = (movimiento: Movimiento) => {
  // Lógica: Usamos directamente el tipoAccion del movimiento
  const esEnvio = movimiento.tipoAccion === 'ENVIO'

  if (esEnvio) {
    return {
      tipo: 'ENVIO',
      label: 'Envío / Derivación',
      icon: ArrowUpRight, // Icono de flecha saliente
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badgeVariant: 'default' as const,
    }
  }

  // Recepción
  return {
    tipo: 'RECEPCION',
    label: 'Recepción / Gestión',
    icon: ArrowDownLeft, // Icono de flecha entrante
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badgeVariant: 'secondary' as const,
  }
}

/**
 * Obtiene el asunto a mostrar en un movimiento específico.
 * Prioridad:
 * 1. Asunto propio del movimiento.
 * 2. Si es el primer movimiento y no tiene asunto propio -> Asunto del Trámite.
 * 3. Fallback genérico.
 */
export const obtenerAsuntoMovimiento = (
  movimiento: Movimiento,
  tramiteAsunto: string,
  esElPrimero: boolean
): string => {
  if (movimiento.asunto) return movimiento.asunto

  // Compatibilidad: Si es el movimiento inicial y no tiene asunto guardado, mostramos el del trámite.
  if (esElPrimero) return tramiteAsunto

  return 'Sin asunto específico registrado'
}

/**
 * Helper para asegurar que siempre haya texto en la UI.
 */
export const obtenerTextoSeguro = (
  texto: string | null | undefined,
  defecto: string = 'Sin detalle registrado'
) => {
  if (!texto || texto.trim() === '') return defecto
  return texto
}

/**
 * Mapea el estado del plazo.
 */
export const obtenerConfiguracionPlazo = (estado: string) => {
  switch (estado) {
    case 'VENCIDO':
      return {
        label: 'Vencido',
        icon: AlertCircle,
        variant: 'destructive' as const,
        textClass: 'text-red-600',
        bgClass: 'bg-red-50 border-red-200',
      }
    case 'POR_VENCER':
      return {
        label: 'Por Vencer',
        icon: Clock,
        variant: 'default' as const,
        textClass: 'text-amber-600',
        bgClass: 'bg-amber-50 border-amber-200',
      }
    case 'A_TIEMPO':
      return {
        label: 'A Tiempo',
        icon: CheckCircle2,
        variant: 'outline' as const,
        textClass: 'text-green-600',
        bgClass: 'bg-green-50 border-green-200',
      }
    default:
      return {
        label: 'No Aplica',
        icon: HelpCircle,
        variant: 'secondary' as const,
        textClass: 'text-muted-foreground',
        bgClass: 'bg-muted/50 border-border',
      }
  }
}
