// En: src/features/tramites/types.ts

// --- ENUMS DEL BACKEND (Prisma) ---
export type TramiteEstado = 'EN_PROCESO' | 'FINALIZADO' | 'ARCHIVADO'
export type TramitePrioridad = 'BAJA' | 'NORMAL' | 'ALTA' | 'URGENTE'
export type MovimientoTipoAccion = 'ENVIO' | 'RECEPCION'

// CAMBIO: Eliminados tipos MovimientoDestinoEstado y MovimientoTipoDestino porque ya no existen en DB

export type PlazoEstado = 'VENCIDO' | 'POR_VENCER' | 'A_TIEMPO' | 'NO_APLICA'
export type OficinaTipo =
  | 'ORGANO_ALTA_DIRECCION'
  | 'ORGANO_DE_LINEA'
  | 'UNIDAD_ORGANICA'
  | 'ORGANO_DE_ASESORAMIENTO'
  | 'ORGANO_DE_APOYO'
  | 'EXTERNA'

// --- ENTIDADES AUXILIARES ---

export interface Oficina {
  id: string
  nombre: string
  siglas: string
  tipo?: OficinaTipo
  parentId?: string | null
  esInquilino?: boolean
  isActive?: boolean
}

export interface UsuarioSimple {
  id: string
  name: string
  email: string
  role: string
  oficinaId?: string
  isActive?: boolean
}

export interface TipoDocumento {
  id: string
  nombre: string
  descripcion?: string | null
  isActive?: boolean
}

// --- OBJETOS CALCULADOS ---
export interface PlazoInfo {
  diasTranscurridos: number | null
  estado: PlazoEstado
}

// --- MOVIMIENTOS ---

// CAMBIO: Eliminada la interfaz MovimientoDestino (tabla intermedia borrada)

export interface Movimiento {
  id: string
  tipoAccion: MovimientoTipoAccion

  // Identidad del documento
  numeroDocumento: string | null
  nombreDocumentoCompleto: string | null // CAMBIO: Renombrado
  fechaRecepcion: string | null // ISO Date String
  fechaMovimiento?: string // NUEVO: Fecha Real (Regularización)

  // Contenido y Trazabilidad
  asunto: string | null // NUEVO: Trazabilidad específica del paso
  notas: string | null
  observaciones: string | null

  // Bandera informativa
  esCopia: boolean // NUEVO

  // Auditoría y Estado
  fechaCierre: string | null
  createdAt: string // ISO Date String
  updatedAt: string // ISO Date String

  // Relaciones (Foreign Keys)
  tramiteId: string
  usuarioCreadorId: string
  oficinaOrigenId: string
  oficinaDestinoId?: string | null // NUEVO: Destino directo (opcional en cierres)
  tipoDocumentoId: string | null

  // Relaciones (Objetos Anidados)
  usuarioCreador?: UsuarioSimple
  oficinaOrigen: Oficina
  oficinaDestino?: Oficina | null // NUEVO: Objeto destino directo
  tipoDocumento?: TipoDocumento | null

  // CAMBIO: Eliminado 'destinos' (array)

  anotaciones?: Anotacion[]
}

// --- TRÁMITE COMPLETO (Respuesta de findOne) ---
export interface TramiteCompleto {
  id: string

  // Identificación
  numeroDocumento: string
  nombreDocumentoCompleto: string // CAMBIO: Renombrado
  asunto: string

  // Estado y Clasificación
  estado: TramiteEstado
  prioridad: TramitePrioridad

  // Fechas
  fechaRecepcion: string // ISO Date String
  fechaIngreso: string // ISO Date String
  fechaCierre: string | null
  createdAt: string
  updatedAt: string

  // CAMBIO: Eliminado 'notas' (ahora usamos anotaciones o notas en movimientos)
  observaciones: string | null

  // Relaciones (Foreign Keys)
  tipoDocumentoId: string
  oficinaRemitenteId: string
  oficinaDestinoId?: string | null // NUEVO
  usuarioAsignadoId: string | null

  // Relaciones (Objetos Anidados)
  tipoDocumento: TipoDocumento
  oficinaRemitente: Oficina
  oficinaDestino?: Oficina | null // NUEVO: Destinatario Principal

  // NUEVO: Lista de oficinas que recibieron copia (Informativo)
  copias: Oficina[]

  usuarioAsignado?: UsuarioSimple | null

  // Colecciones
  movimientos: Movimiento[]
  anotaciones: Anotacion[]

  // Campo Calculado
  plazo: PlazoInfo
}

export interface Anotacion {
  id: string
  contenido: string
  createdAt: string
  autor: {
    id: string
    name: string
    email: string
  }
  movimientoId?: string | null
  movimiento?: {
    id: string
    tipoAccion: string
    oficinaOrigen: {
      siglas: string
    }
  } | null
}
