/**
 * Hooks personalizados para mejorar la productividad
 * Basados en usehooks-ts y patrones comunes del proyecto
 */

import { useEffect, useState } from 'react'
import { useWebSocketStatus } from './use-websocket-status'

/**
 * Hook para manejar el estado de conexión API + WebSocket combinados
 * @returns Estado consolidado de conexión
 */
export function useConnectionStatus() {
  const wsStatus = useWebSocketStatus({ autoReconnect: true })
  const [apiOnline, setApiOnline] = useState(true)

  // Verificar conectividad API periódicamente
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/health`, {
          method: 'HEAD',
          signal: AbortSignal.timeout(3000),
        })
        setApiOnline(response.ok)
      } catch {
        setApiOnline(false)
      }
    }

    checkApiStatus()
    const interval = setInterval(checkApiStatus, 10000)
    return () => clearInterval(interval)
  }, [])

  return {
    isFullyOnline: wsStatus.isConnected && apiOnline,
    isWebSocketOnline: wsStatus.isConnected,
    isApiOnline: apiOnline,
    latency: wsStatus.latency,
  }
}

/**
 * Hook para debounce de valores (búsqueda, filtros)
 * @template T Tipo del valor
 * @param value Valor a debouncear
 * @param delay Retraso en ms (default: 300ms)
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook para manejar estado de localStorage con sincronización reactiva
 * @template T Tipo del valor almacenado
 * @param key Clave en localStorage
 * @param initialValue Valor inicial
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error guardando en localStorage:', error)
    }
  }

  return [storedValue, setValue]
}

/**
 * Hook para detectar si el usuario está activo (mouse/keyboard)
 * @param timeout Tiempo en ms para considerar inactivo (default: 5min)
 */
export function useUserActivity(timeout = 300000) {
  const [isActive, setIsActive] = useState(true)
  const [lastActivity, setLastActivity] = useState<number>(Date.now())

  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now())
      setIsActive(true)
    }

    const events = ['mousedown', 'keydown', 'wheel', 'touchstart']
    events.forEach(event => window.addEventListener(event, updateActivity))

    const checkInterval = setInterval(() => {
      if (Date.now() - lastActivity > timeout) {
        setIsActive(false)
      }
    }, 60000)

    return () => {
      events.forEach(event => window.removeEventListener(event, updateActivity))
      clearInterval(checkInterval)
    }
  }, [timeout, lastActivity])

  return { isActive, lastActivity }
}
