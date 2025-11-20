// --- TIPOS COMPARTIDOS Y ENUMS ---
export type TramiteEstado = 'EN_PROCESO' | 'FINALIZADO' | 'ARCHIVADO'
export type TramitePrioridad = 'BAJA' | 'NORMAL' | 'ALTA' | 'URGENTE'

// --- TIPOS BÁSICOS (Preservados) ---
export type Oficina = {
  id: string
  nombre: string
  siglas: string
}

export type UsuarioSimple = {
  id: string
  name: string
}

// --- NUEVO: Tipo para la información de plazos (Backend Calculated) ---
export type PlazoInfo = {
  diasTranscurridos: number | null
  estado: 'VENCIDO' | 'POR_VENCER' | 'A_TIEMPO' | 'NO_APLICA'
}

// --- SUB-TIPOS DE MOVIMIENTO (Preservados) ---
export type MovimientoDestino = {
  id: string
  oficinaDestino: Oficina
  estado: 'PENDIENTE' | 'RECIBIDO' | 'ATENDIDO'
  fechaRecepcion: string | null
}

export type Movimiento = {
  id: string
  tipoAccion: 'DERIVACION' | 'RESPUESTA' | 'ASIGNACION' | 'ARCHIVO' | 'CIERRE'
  createdAt: string
  oficinaOrigen: Oficina
  usuarioCreador: UsuarioSimple
  destinos: MovimientoDestino[]
  observaciones: string | null
  // Campos añadidos previamente
  numeroDocumento: string | null
  numeroDocumentoCompleto: string | null
  notas: string | null
}

export type Anotacion = {
  id: string
  contenido: string
  createdAt: string
  autor: UsuarioSimple
}

// --- INTERFAZ PARA LA TABLA (Nueva) ---
// Esta interfaz es ligera y contiene solo lo necesario para las columnas y filtros
export interface Tramite {
  id: string
  numeroDocumentoCompleto: string
  asunto: string
  estado: TramiteEstado
  prioridad: TramitePrioridad
  fechaIngreso: string // ISO Date
  fechaDocumento: string // ISO Date

  // Relaciones
  oficinaRemitente: Oficina
  tipoDocumento: { nombre: string }

  // Datos Calculados o Anidados
  plazo: PlazoInfo
  movimientos: Movimiento[] // Necesario para calcular "Ubicación Actual"
}

// --- TIPO COMPLETO PARA DETALLES (Preservado y Enriquecido) ---
// Se mantiene compatible con tu código anterior, añadiendo 'plazo' que viene del backend
export type TramiteCompleto = {
  id: string
  numeroDocumentoCompleto: string
  asunto: string
  estado: TramiteEstado
  prioridad: TramitePrioridad
  fechaIngreso: string
  fechaDocumento: string
  observaciones: string | null
  notas: string | null

  oficinaRemitente: Oficina
  tipoDocumento: { nombre: string }
  usuarioAsignado: UsuarioSimple | null

  movimientos: Movimiento[]
  anotaciones: Anotacion[]

  // Agregamos esto porque el endpoint findOne del backend también lo devuelve
  plazo: PlazoInfo
}
