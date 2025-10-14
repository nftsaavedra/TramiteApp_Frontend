import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react'
import { jwtDecode } from 'jwt-decode'

// 1. Define la estructura del payload de tu token JWT (basado en tu backend)
interface DecodedToken {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'RECEPCIONISTA' | 'ANALISTA' | 'ASESORIA' // Asegúrate que coincida con tu Enum `Role`
  oficinaId: string | null
  iat: number
  exp: number
}

// 2. Define la estructura del contexto
interface AuthContextType {
  user: DecodedToken | null
  login: (token: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 3. Crea el componente Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token)
        // Comprobar si el token ha expirado
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded)
        } else {
          localStorage.removeItem('accessToken')
        }
      } catch (error) {
        console.error('Token inválido:', error)
        localStorage.removeItem('accessToken')
      }
    }
  }, [])

  const login = (token: string) => {
    localStorage.setItem('accessToken', token)
    const decoded = jwtDecode<DecodedToken>(token)
    setUser(decoded)
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    setUser(null)
    window.location.href = '/login' // Redirige al login
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

// 4. Crea un hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
