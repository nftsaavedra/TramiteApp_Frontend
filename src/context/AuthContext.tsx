import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react'
// Eliminamos jwt-decode de la lógica principal de rehidratación
// para confiar en la respuesta real del servidor, aunque puedes mantenerlo si necesitas leer datos antes.
import api from '@/lib/api'

// 1. Definición de tipos
// Unificamos la interfaz para que coincida con lo que devuelve tu endpoint /profile
export interface UserProfile {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'RECEPCIONISTA' | 'ANALISTA' | 'ASESORIA'
  oficinaId: string | null
}

interface AuthContextType {
  user: UserProfile | null
  login: (token: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean // <--- CRUCIAL: Nuevo estado para manejar el F5
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  // Inicializamos cargando en TRUE. La app nace "pensando"
  const [isLoading, setIsLoading] = useState(true)

  // Efecto de Rehidratación
  useEffect(() => {
    const rehydrateSession = async () => {
      const token = localStorage.getItem('accessToken')

      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        // Llamamos al backend para verificar si el token sigue vivo y obtener datos frescos
        const { data } = await api.get<UserProfile>('/auth/profile')
        setUser(data)
      } catch (error) {
        console.error('Error al rehidratar sesión:', error)
        // Si el backend rechaza el token (401), limpiamos todo
        logout()
      } finally {
        // Pase lo que pase, terminamos de cargar
        setIsLoading(false)
      }
    }

    rehydrateSession()
  }, [])

  const login = async (token: string) => {
    localStorage.setItem('accessToken', token)
    try {
      // Al hacer login, también pedimos los datos completos al perfil
      // para asegurar consistencia inmediata
      const { data } = await api.get<UserProfile>('/auth/profile')
      setUser(data)
    } catch (error) {
      console.error('Error obteniendo perfil tras login', error)
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    setUser(null)
    // Opcional: Si usas TanStack Router, usa navigate aquí en lugar de window.location
    // window.location.href = '/login'
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
