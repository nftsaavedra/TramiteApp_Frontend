// En: src/features/tramites/types.ts

// Tipos básicos que ya podríamos tener
type Oficina = { id: string; nombre: string }
type UsuarioSimple = { id: string; name: string }

// Tipo para un Destino de Movimiento
export type MovimientoDestino = {
  id: string
  oficinaDestino: Oficina
  estado: 'PENDIENTE' | 'RECIBIDO' | 'ATENDIDO'
  fechaRecepcion: string | null
}

// Tipo para un Movimiento individual
export type Movimiento = {
  id: string
  tipoAccion: 'DERIVACION' | 'RESPUESTA' | 'ASIGNACION' | 'ARCHIVO' | 'CIERRE'
  createdAt: string
  oficinaOrigen: Oficina
  usuarioCreador: UsuarioSimple
  destinos: MovimientoDestino[]
  observaciones: string | null
}

// Tipo para una Anotación
export type Anotacion = {
  id: string
  contenido: string
  createdAt: string
  autor: UsuarioSimple
}

// Tipo completo para el Trámite (respuesta de GET /tramites/:id)
export type TramiteCompleto = {
  id: string
  numeroDocumentoCompleto: string
  asunto: string
  estado: 'ABIERTO' | 'CERRADO' | 'ARCHIVADO'
  prioridad: 'BAJA' | 'NORMAL' | 'ALTA' | 'URGENTE'
  fechaIngreso: string
  fechaDocumento: string
  observaciones: string | null
  notas: string | null
  oficinaRemitente: Oficina
  tipoDocumento: { nombre: string }
  movimientos: Movimiento[]
  anotaciones: Anotacion[]
}
