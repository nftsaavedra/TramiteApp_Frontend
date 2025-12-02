// En: src/features/tramites/types.ts

// --- ENUMS DEL BACKEND (Prisma) ---
export type TramiteEstado = 'EN_PROCESO' | 'FINALIZADO' | 'ARCHIVADO'
export type TramitePrioridad = 'BAJA' | 'NORMAL' | 'ALTA' | 'URGENTE'
export type MovimientoTipoAccion =
  | 'DERIVACION'
  | 'RESPUESTA'
  | 'ASIGNACION'
  | 'ARCHIVO'
  | 'CIERRE'
export type MovimientoDestinoEstado = 'PENDIENTE' | 'RECIBIDO' | 'ATENDIDO'
export type MovimientoTipoDestino = 'PRINCIPAL' | 'COPIA'
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
  tipo?: OficinaTipo // Opcional porque en listados simples a veces no viene
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

// --- OBJETOS CALCULADOS (No existen en DB, generados por Service) ---
export interface PlazoInfo {
  diasTranscurridos: number | null
  estado: PlazoEstado
}

// --- MOVIMIENTOS Y DESTINOS ---

export interface MovimientoDestino {
  id: string
  tipoDestino: MovimientoTipoDestino
  estado: MovimientoDestinoEstado
  fechaRecepcion: string | null // ISO Date String
  movimientoId: string
  oficinaDestinoId: string
  oficinaDestino: Oficina // Relación incluida (include: { oficinaDestino: true })
}

export interface Movimiento {
  id: string
  tipoAccion: MovimientoTipoAccion

  // Datos del documento específico del movimiento (opcionales)
  numeroDocumento: string | null
  numeroDocumentoCompleto: string | null
  fechaDocumento: string | null // ISO Date String

  // Contenido
  notas: string | null
  observaciones: string | null // Ajustado al backend

  // Auditoría y Estado
  fechaCierre: string | null
  createdAt: string // ISO Date String
  updatedAt: string // ISO Date String

  // Relaciones (Foreign Keys)
  tramiteId: string
  usuarioCreadorId: string
  oficinaOrigenId: string
  tipoDocumentoId: string | null

  // Relaciones (Objetos Anidados)
  usuarioCreador?: UsuarioSimple
  oficinaOrigen: Oficina
  tipoDocumento?: TipoDocumento | null

  // Detalle de destinos
  destinos: MovimientoDestino[]
}

// --- TRÁMITE COMPLETO (Respuesta de findOne) ---
export interface TramiteCompleto {
  id: string

  // Identificación
  numeroDocumento: string
  numeroDocumentoCompleto: string // Generado: TIPO-N-AÑO-SIGLAS
  asunto: string

  // Estado y Clasificación
  estado: TramiteEstado
  prioridad: TramitePrioridad

  // Fechas
  fechaDocumento: string // ISO Date String
  fechaIngreso: string // ISO Date String
  fechaCierre: string | null
  createdAt: string
  updatedAt: string

  // Notas generales iniciales
  notas: string | null
  observaciones: string | null

  // Relaciones (Foreign Keys)
  tipoDocumentoId: string
  oficinaRemitenteId: string
  usuarioAsignadoId: string | null

  // Relaciones (Objetos Anidados)
  tipoDocumento: TipoDocumento
  oficinaRemitente: Oficina
  usuarioAsignado?: UsuarioSimple | null

  // Colecciones
  movimientos: Movimiento[]
  anotaciones?: any[] // Pendiente de definir estructura de anotaciones si se usa

  // Campo Calculado (Backend: tramites.service.ts -> getPlazoInfo)
  plazo: PlazoInfo
}
