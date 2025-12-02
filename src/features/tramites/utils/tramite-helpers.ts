// En: src/features/tramites/utils/tramite-helpers.ts
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileOutput,
  FileInput,
  HelpCircle,
} from 'lucide-react'
import { TramiteCompleto, Movimiento } from '../types'

/**
 * Determina la ubicación actual del trámite basándose en la trazabilidad.
 * Lógica de Negocio:
 * 1. Si NO hay movimientos: El trámite está en bandeja de la 'Oficina Remitente'.
 * 2. Si HAY movimientos:
 * a) Si el último movimiento tiene destinos (DERIVACION/ENVIO): Está en la 'Oficina Destino'.
 * b) Si el último movimiento NO tiene destinos (ej. RESPUESTA interna o CIERRE): Se asume que sigue en la 'Oficina Origen'.
 */
export const obtenerUbicacionActual = (tramite: TramiteCompleto): string => {
  // Caso 1: Trámite recién ingresado o sin flujo iniciado
  if (!tramite.movimientos || tramite.movimientos.length === 0) {
    return tramite.oficinaRemitente?.nombre || 'Origen Desconocido'
  }

  // Ordenamos por seguridad (Defensive Programming)
  // Usamos una copia [...movimientos] para no mutar el objeto original
  const movimientosOrdenados = [...tramite.movimientos].sort((a, b) => {
    const fechaA = new Date(a.createdAt).getTime()
    const fechaB = new Date(b.createdAt).getTime()
    return fechaA - fechaB
  })

  const ultimoMovimiento = movimientosOrdenados[movimientosOrdenados.length - 1]

  // Caso 2a: Movimiento con destino (ej. Derivación)
  if (ultimoMovimiento.destinos && ultimoMovimiento.destinos.length > 0) {
    // Priorizamos el destino PRINCIPAL, si no existe, tomamos el primero
    const destino =
      ultimoMovimiento.destinos.find((d) => d.tipoDestino === 'PRINCIPAL') ||
      ultimoMovimiento.destinos[0]
    return destino.oficinaDestino?.nombre || 'Destino Desconocido'
  }

  // Caso 2b: Movimiento interno o cierre sin destino explícito
  return ultimoMovimiento.oficinaOrigen?.nombre || 'Ubicación Desconocida'
}

/**
 * Determina si el movimiento es de SALIDA (Envío) o ENTRADA (Recepción/Interno).
 * Devuelve la configuración visual (Iconos y Colores) para el Timeline.
 */
export const obtenerTipoInteraccion = (movimiento: Movimiento) => {
  // Lógica: Si hay una oficina destino diferente a la origen, es un ENVÍO.
  const esEnvio = movimiento.destinos && movimiento.destinos.length > 0

  if (esEnvio) {
    return {
      tipo: 'ENVIO',
      label: 'Envío / Derivación',
      icon: FileOutput,
      // Paleta Azul (Salida) - Diferenciada para lectura rápida
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badgeVariant: 'default' as const, // Azul sólido usualmente
    }
  }

  // Paleta Esmeralda/Verde (Recepción o Gestión Interna) - Diferenciada
  return {
    tipo: 'RECEPCION',
    label: 'Recepción / Gestión',
    icon: FileInput,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badgeVariant: 'secondary' as const, // Gris/Verde suave
  }
}

/**
 * Helper para asegurar que siempre haya texto en la UI (Evita huecos visuales).
 * Nota: El desbordamiento de texto largo se debe manejar en el CSS del componente con 'break-words' o 'truncate'.
 */
export const obtenerTextoSeguro = (
  texto: string | null | undefined,
  defecto: string = 'Sin detalle registrado'
) => {
  if (!texto || texto.trim() === '') return defecto
  return texto
}

/**
 * Mapea el estado del plazo calculado por el backend a estilos visuales (Tailwind + Iconos).
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
        variant: 'default' as const, // 'warning' si está configurado en theme, sino default
        textClass: 'text-amber-600',
        bgClass: 'bg-amber-50 border-amber-200',
      }
    case 'A_TIEMPO':
      return {
        label: 'A Tiempo',
        icon: CheckCircle2,
        variant: 'outline' as const, // 'success' si existe
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
