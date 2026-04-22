import { useEffect, useRef, useState, useCallback } from 'react'
import { io, type Socket } from 'socket.io-client'

export type ConnectionStatus = 'online' | 'offline' | 'connecting' | 'degraded';

interface StatusData {
  status: ConnectionStatus;
  timestamp: string;
  message: string;
}

interface UseWebSocketStatusOptions {
  url?: string;
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useWebSocketStatus(options: UseWebSocketStatusOptions = {}) {
  const {
    url = import.meta.env.VITE_WS_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    autoReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
  } = options;

  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    // Limpiar socket existente si lo hay
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // Limpiar timeouts previos
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }

    setStatus('connecting');

    const socket = io(`${url}/status`, {
      transports: ['websocket', 'polling'],
      reconnection: false, // Manejamos reconexión manualmente
      timeout: 5000,
      forceNew: true,
    });

    // Timeout de conexión inicial - si no conecta en 5 segundos, marcar como offline
    connectionTimeoutRef.current = setTimeout(() => {
      if (socket && !socket.connected) {
        if (import.meta.env.DEV) {
          console.warn('[WebSocket] Timeout de conexión inicial (5s) - marcando como offline');
        }
        setStatus('offline');
        socket.disconnect();
      }
    }, 5000);

    socket.on('connect', () => {
      setStatus('online')
      reconnectAttemptsRef.current = 0
      // Limpiar timeout de conexión exitosa
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
    })

    socket.on('disconnect', (_reason) => {
      // Limpiar timeout de conexión
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
      
      if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
        setStatus('connecting');
        reconnectAttemptsRef.current += 1
                
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, reconnectInterval);
      } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        setStatus('offline')
      } else {
        setStatus('offline')
      }
    })

    socket.on('connect_error', (_error) => {
      // Limpiar timeout de conexión
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
      
      if (import.meta.env.DEV) {
        console.warn('[WebSocket] Error de conexión:', _error);
      }
      
      if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current += 1;
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, reconnectInterval);
      } else {
        setStatus('offline');
      }
    });

    socket.on('status-update', (data: StatusData) => {
      setStatusData(data)
      // Solo actualizar status si es diferente para evitar ciclos
      if (data.status !== status) {
        setStatus(data.status)
      }
    })

    socket.on('pong', (data: { timestamp: number }) => {
      const calculatedLatency = Date.now() - data.timestamp;
      setLatency(calculatedLatency);
      
      // Marcar como degraded si la latencia es alta
      if (calculatedLatency > 1000 && status === 'online') {
        setStatus('degraded');
      } else if (calculatedLatency <= 1000 && status === 'degraded') {
        setStatus('online');
      }
    });

    socketRef.current = socket;
  }, [url, autoReconnect, reconnectInterval, maxReconnectAttempts]); // ← ELIMINAR 'status' de las dependencias

  const disconnect = useCallback(() => {
    // Limpiar todos los timeouts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }

    if (socketRef.current) {
      // Remover todos los listeners antes de desconectar
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect()
      socketRef.current = null
    }

    setStatus('offline');
    setLatency(null);
  }, []);

  const sendPing = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('ping');
      return true;
    }
    return false;
  }, []);

  // Auto-conectar al montar - sin dependencias para evitar ciclos
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← Array vacío - solo se ejecuta al montar y desmontar

  // Ping periódico para monitoreo de latencia
  useEffect(() => {
    if (status === 'online') {
      const pingInterval = setInterval(() => {
        sendPing();
      }, 10000); // Cada 10 segundos

      return () => {
        clearInterval(pingInterval);
      };
    }
  }, []); // ← ELIMINAR dependencias para que solo se ejecute una vez al montar

  return {
    status,
    statusData,
    latency,
    isConnected: status === 'online',
    isConnecting: status === 'connecting',
    isOffline: status === 'offline',
    isDegraded: status === 'degraded',
    connect,
    disconnect,
    sendPing,
  };
}
