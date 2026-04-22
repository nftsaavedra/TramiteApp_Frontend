// En: src/lib/api.ts
import axios from 'axios'
import axiosRetry from 'axios-retry'
import { toast } from 'sonner'

// 1. Crear una instancia de Axios con la URL base de tu API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// 2. Configurar reintentos inteligentes
axiosRetry(api, {
  retries: 3, // Número máximo de reintentos
  retryDelay: (retryCount) => {
    // Exponential backoff: 1s, 2s, 4s
    return Math.min(retryCount * 1000, 4000)
  },
  retryCondition: (error) => {
    // Reintentar solo en errores de red o 5xx
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      (error.response?.status ?? 0) >= 500
    )
  },
  shouldResetTimeout: true,
})

// 2. Crear un "interceptor" que se ejecuta ANTES de cada petición
api.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('accessToken')

    // Si el token existe, añadirlo a la cabecera 'Authorization'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    // Manejar errores de la petición
    return Promise.reject(error)
  }
)

// 3. (Opcional pero recomendado) Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message

    // Manejo específico por código de estado HTTP
    switch (status) {
      case 401:
        // No autorizado - Token inválido o expirado
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
        break

      case 403:
        // Prohibido - Sin permisos suficientes
        toast.error('Acceso denegado: No tienes permisos para realizar esta acción')
        break

      case 404:
        // No encontrado - Recurso no existe
        toast.error('Recurso no encontrado. La solicitud puede ser inválida.')
        break

      case 409:
        // Conflicto - Recurso ya existe o conflicto de datos
        toast.error(`Conflicto: ${message}`)
        break

      case 422:
        // Error de validación
        const errors = error.response?.data?.errors || []
        if (Array.isArray(errors) && errors.length > 0) {
          toast.error(`Error de validación: ${errors.join(', ')}`)
        } else {
          toast.error(`Datos inválidos: ${message}`)
        }
        break

      case 500:
        // Error interno del servidor
        toast.error('Error interno del servidor. Por favor intenta más tarde.')
        // Log solo en desarrollo para debugging
        if (import.meta.env.DEV) {
          console.error('[API Error 500]', {
            url: error.config?.url,
            method: error.config?.method,
            message,
          })
        }
        break

      case 502:
        // Bad Gateway - Servidor temporalmente caído
        toast.error('Servidor temporalmente no disponible. Reintentando...')
        break

      case 503:
        // Service Unavailable - Mantenimiento o sobrecarga
        toast.error('Servicio temporalmente no disponible. Por favor intenta en unos minutos.')
        break

      default:
        // Error genérico
        if (error.code === 'ECONNABORTED' || error.code === 'ERR_CANCELED') {
          toast.warning('La solicitud ha sido cancelada o ha excedido el tiempo de espera.')
        } else if (!error.response) {
          // Error de red (sin respuesta del servidor)
          toast.error('Error de conexión. Verifica tu conexión a internet.')
        } else {
          // Otros errores HTTP
          toast.error(message || 'Ocurrió un error inesperado. Por favor intenta nuevamente.')
        }
    }

    return Promise.reject(error)
  }
)

export default api
