import * as z from 'zod'

// Definimos los tipos de registro disponibles (Readonly tuple)
export const tiposRegistro = ['RECEPCION', 'ENVIO'] as const

// Esquema de validación principal
export const tramiteFormSchema = z
  .object({
    // CORRECCIÓN: Usar 'message' según la definición de tipos
    tipoRegistro: z.enum(tiposRegistro, {
      error: () => ({ message: 'Seleccione el tipo de registro.' }),
    }),

    // Campos condicionales
    oficinaRemitenteId: z.string().optional(),
    oficinaDestinoId: z.string().optional(),

    // CORRECCIÓN: 'message' para errores requeridos
    tipoDocumentoId: z
      .string({ message: 'Seleccione un tipo de documento.' })
      .min(1, 'Seleccione un tipo de documento.'),

    numeroDocumento: z
      .string({ message: 'El número de documento es obligatorio.' })
      .min(1, 'El número de documento es obligatorio.'),

    // CAMBIO: Renombrado de fechaDocumento a fechaRecepcion
    fechaRecepcion: z.date({
      message: 'La fecha de recepción es obligatoria.',
    }),

    asunto: z
      .string({ message: 'El asunto es obligatorio.' })
      .min(5, 'El asunto debe ser descriptivo (mínimo 5 caracteres).')
      .max(500, 'El asunto es demasiado largo.'),

    // CAMBIO: Eliminado el campo 'notas'

    observaciones: z.string().optional(),

    // NUEVO: Soporte para múltiples copias (opcional, array de IDs)
    copiasIds: z.array(z.string()).optional(),
  })
  // Validación Condicional: Si es RECEPCIÓN, exige Remitente
  .refine(
    (data) => {
      if (data.tipoRegistro === 'RECEPCION' && !data.oficinaRemitenteId) {
        return false
      }
      return true
    },
    {
      message: 'La oficina remitente es obligatoria para recepciones.',
      path: ['oficinaRemitenteId'],
    }
  )
  // Validación Condicional: Si es ENVÍO, exige Destino
  .refine(
    (data) => {
      if (data.tipoRegistro === 'ENVIO' && !data.oficinaDestinoId) {
        return false
      }
      return true
    },
    {
      message: 'La oficina de destino es obligatoria para envíos.',
      path: ['oficinaDestinoId'],
    }
  )

// Tipo inferido para usar en el formulario (useForm<TramiteFormValues>)
export type TramiteFormValues = z.infer<typeof tramiteFormSchema>
