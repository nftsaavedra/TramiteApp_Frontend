import { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { useWebSocketStatus } from '@/hooks/use-websocket-status';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function ConnectionStatusIndicator() {
  const {
    status,
    latency,
    isConnected,
    isConnecting,
    sendPing,
  } = useWebSocketStatus({
    autoReconnect: true,
    reconnectInterval: 3000,
    maxReconnectAttempts: 10,
  });

  const [showDetails, setShowDetails] = useState(false);

  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          icon: Wifi,
          label: 'En línea',
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          pulseColor: 'bg-green-500',
          message: 'Servidor conectado',
        };
      case 'connecting':
        return {
          icon: RefreshCw,
          label: 'Conectando',
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          pulseColor: 'bg-yellow-500',
          message: 'Estableciendo conexión...',
        };
      case 'degraded':
        return {
          icon: AlertTriangle,
          label: 'Inestable',
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-100 dark:bg-orange-900/30',
          pulseColor: 'bg-orange-500',
          message: latency 
            ? `Latencia alta: ${latency}ms` 
            : 'Conexión inestable',
        };
      case 'offline':
        return {
          icon: WifiOff,
          label: 'Fuera de línea',
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          pulseColor: 'bg-red-500',
          message: 'Sin conexión con el servidor',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <TooltipProvider>
      <Tooltip open={showDetails}>
        <TooltipTrigger asChild>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${config.bgColor} hover:opacity-80`}
            type="button"
          >
            {/* Punto de estado con animación pulse */}
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${config.pulseColor}`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.color.replace('text-', 'bg-')}`}
              ></span>
            </span>

            {/* Ícono de estado */}
            <Icon className={`h-4 w-4 ${config.color} ${isConnecting ? 'animate-spin' : ''}`} />

            {/* Label en desktop */}
            <span className={`text-xs font-medium hidden sm:inline-block ${config.color}`}>
              {config.label}
            </span>

            {/* Latencia (solo cuando está conectado) */}
            {isConnected && latency !== null && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {latency}ms
              </span>
            )}
          </button>
        </TooltipTrigger>

        <TooltipContent 
          side="bottom" 
          align="end"
          className="p-4 min-w-[200px] sm:min-w-[250px]"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Estado del Servidor</span>
              <Icon className={`h-4 w-4 ${config.color}`} />
            </div>
            
            <div className="text-xs text-muted-foreground">
              {config.message}
            </div>

            {latency !== null && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Latencia:</span>
                <span className={`font-mono ${
                  latency < 100 ? 'text-green-600' :
                  latency < 500 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {latency}ms
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Reconexión:</span>
              <span className="text-green-600">Automática</span>
            </div>

            <div className="pt-2 border-t">
              <button
                onClick={sendPing}
                disabled={!isConnected}
                className="text-xs text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verificar conexión
              </button>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
