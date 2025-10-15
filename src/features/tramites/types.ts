// En: src/features/tramites/types.ts

// Tipos básicos actualizados para incluir más detalles cuando sea necesario
type Oficina = { id: string; nombre: string; siglas: string }
type UsuarioSimple = { id: string; name: string }

// Tipo para un Destino de Movimiento (sin cambios necesarios)
export type MovimientoDestino = {
  id: string
  oficinaDestino: Oficina
  estado: 'PENDIENTE' | 'RECIBIDO' | 'ATENDIDO'
  fechaRecepcion: string | null
}

// --- TIPO 'Movimiento' ACTUALIZADO ---
export type Movimiento = {
  id: string
  tipoAccion: 'DERIVACION' | 'RESPUESTA' | 'ASIGNACION' | 'ARCHIVO' | 'CIERRE'
  createdAt: string
  oficinaOrigen: Oficina
  usuarioCreador: UsuarioSimple
  destinos: MovimientoDestino[]
  observaciones: string | null
  // --- CAMPOS AÑADIDOS ---
  numeroDocumento: string | null
  numeroDocumentoCompleto: string | null
  notas: string | null
}

// Tipo para una Anotación (sin cambios necesarios)
export type Anotacion = {
  id: string
  contenido: string
  createdAt: string
  autor: UsuarioSimple
}

// --- TIPO 'TramiteCompleto' ACTUALIZADO ---
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
  // --- CAMPO AÑADIDO ---
  usuarioAsignado: UsuarioSimple | null
  movimientos: Movimiento[]
  anotaciones: Anotacion[]
}
