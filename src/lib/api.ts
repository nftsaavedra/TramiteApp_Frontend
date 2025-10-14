// En: src/lib/api.ts
import axios from 'axios'

// 1. Crear una instancia de Axios con la URL base de tu API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
    // Si recibimos un error 401 (No autorizado), significa que el token es inválido o expiró
    if (error.response?.status === 401) {
      // Limpiamos el token del storage
      localStorage.removeItem('accessToken')
      // Redirigimos al usuario a la página de login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
