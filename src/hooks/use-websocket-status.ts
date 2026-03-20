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
    url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
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

  const connect = useCallback(() => {
    // Limpiar socket existente si lo hay
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setStatus('connecting');

    const socket = io(`${url}/status`, {
      transports: ['websocket', 'polling'],
      reconnection: false, // Manejamos reconexión manualmente
      timeout: 5000,
      forceNew: true,
    });

    socket.on('connect', () => {
      setStatus('online')
      reconnectAttemptsRef.current = 0
    })

    socket.on('disconnect', (_reason) => {
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
      if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current += 1;
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, reconnectInterval);
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
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
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

  // Auto-conectar al montar
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

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
