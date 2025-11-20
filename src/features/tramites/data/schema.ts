import * as z from 'zod'

// Definimos los tipos de registro disponibles (Readonly tuple)
export const tiposRegistro = ['RECEPCION', 'ENVIO'] as const

// Esquema de validación principal
export const tramiteFormSchema = z
  .object({
    // CORRECCIÓN: Usar 'required_error' en lugar de 'message'
    tipoRegistro: z.enum(tiposRegistro, {
      required_error: 'Seleccione el tipo de registro.',
      invalid_type_error: 'Tipo de registro no válido.',
    }),

    // Campos condicionales
    oficinaRemitenteId: z.string().optional(),
    oficinaDestinoId: z.string().optional(),

    // CORRECCIÓN: 'required_error' para cuando el campo está vacío/null
    tipoDocumentoId: z
      .string({ required_error: 'Seleccione un tipo de documento.' })
      .min(1, 'Seleccione un tipo de documento.'),

    numeroDocumento: z
      .string({ required_error: 'El número de documento es obligatorio.' })
      .min(1, 'El número de documento es obligatorio.'),

    fechaDocumento: z.date({
      required_error: 'La fecha del documento es obligatoria.',
      invalid_type_error: 'Formato de fecha inválido.',
    }),

    asunto: z
      .string({ required_error: 'El asunto es obligatorio.' })
      .min(5, 'El asunto debe ser descriptivo (mínimo 5 caracteres).')
      .max(500, 'El asunto es demasiado largo.'),

    notas: z.string().optional(),
    observaciones: z.string().optional(),
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
