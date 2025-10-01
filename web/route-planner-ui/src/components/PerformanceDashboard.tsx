/**
 * Performance Dashboard Component
 * Compact performance metrics in a separate tab
 */

import { FC, useEffect } from 'react';
import { useMetricsState, useSystemState, useUpdateMetrics, useUpdateSystemStatus } from '../store';

const PerformanceDashboard: FC = () => {
  const { p50, p95, memoryMB, cpuPercent, requestsPerSecond, lastUpdated } = useMetricsState();
  const { status, connections, uptime } = useSystemState();
  const updateMetrics = useUpdateMetrics();
  const updateSystemStatus = useUpdateSystemStatus();

  // Update metrics every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      updateMetrics();
      updateSystemStatus();
    }, 3000);

    // Initial update
    updateMetrics();
    updateSystemStatus();

    return () => clearInterval(interval);
  }, [updateMetrics, updateSystemStatus]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatUptime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'computing': return 'text-yellow-500';
      case 'offline': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8 pb-4 xs:pb-5 sm:pb-6 md:pb-8 lg:pb-10 xl:pb-12">
      {/* Header */}
      <div className="text-center pt-6 xs:pt-8 sm:pt-10 md:pt-12 lg:pt-14 xl:pt-16 mb-4 xs:mb-5 sm:mb-6 md:mb-8">
        <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold text-white mb-2 xs:mb-3 sm:mb-4 leading-tight">
          <span className="block xs:hidden">Dashboard</span>
          <span className="hidden xs:block">Dashboard de Rendimiento</span>
        </h2>
        <p className="text-xs xs:text-sm sm:text-base font-medium text-gray-400 max-w-2xl mx-auto px-2 xs:px-3 sm:px-4 leading-relaxed">
          Métricas del sistema en tiempo real
        </p>
      </div>

      {/* System Status */}
      <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-600 shadow-xl p-3 xs:p-4 sm:p-5 md:p-6">
        <h3 className="text-base xs:text-lg font-semibold text-white mb-3 xs:mb-4 leading-tight">Estado del Sistema</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-5">
          <div className="bg-gray-700/50 rounded-lg p-3 xs:p-4 sm:p-5 min-w-0">
            <div className="text-xs text-gray-400 mb-2">Estado</div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                status === 'online' ? 'bg-green-500' : 
                status === 'computing' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
              }`} />
              <span className={`text-sm xs:text-base font-medium ${getStatusColor(status)} truncate`}>
                {status === 'online' ? 'En línea' : 
                 status === 'computing' ? 'Calculando' : 'Desconectado'}
              </span>
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 xs:p-4 sm:p-5 min-w-0">
            <div className="text-xs text-gray-400 mb-2">Conexiones</div>
            <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white leading-tight">{connections}</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 xs:p-4 sm:p-5 min-w-0">
            <div className="text-xs text-gray-400 mb-2">Tiempo activo</div>
            <div className="text-sm xs:text-base sm:text-lg text-white font-medium leading-tight">{formatUptime(uptime)}</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 xs:p-4 sm:p-5 min-w-0">
            <div className="text-xs text-gray-400 mb-2">Última actualización</div>
            <div className="text-sm xs:text-base text-white leading-tight break-all">{formatTime(lastUpdated)}</div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-600 shadow-xl p-3 xs:p-4 sm:p-5 md:p-6">
        <h3 className="text-base xs:text-lg font-semibold text-white mb-3 xs:mb-4 leading-tight">Métricas de Rendimiento</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 xs:gap-4 sm:gap-5">
          {/* Latency */}
          <div className="bg-gray-700/50 rounded-lg p-3 xs:p-4 sm:p-5 min-w-0">
            <div className="text-xs text-gray-400 mb-2">Latencia P50</div>
            <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white leading-tight break-all">{p50.toFixed(1)}ms</div>
            <div className="text-xs text-gray-500 truncate">percentil 50</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 xs:p-4 sm:p-5 min-w-0">
            <div className="text-xs text-gray-400 mb-2">Latencia P95</div>
            <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white leading-tight break-all">{p95.toFixed(1)}ms</div>
            <div className="text-xs text-gray-500 truncate">percentil 95</div>
          </div>
          
          {/* Memory */}
          <div className="bg-gray-700/50 rounded-lg p-3 xs:p-4 sm:p-5 min-w-0">
            <div className="text-xs text-gray-400 mb-2">Memoria</div>
            <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white leading-tight break-all">{memoryMB.toFixed(0)}MB</div>
            <div className="text-xs text-gray-500 truncate">en uso</div>
          </div>
          
          {/* CPU */}
          <div className="bg-gray-700/50 rounded-lg p-3 xs:p-4 sm:p-5 min-w-0">
            <div className="text-xs text-gray-400 mb-2">CPU</div>
            <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white leading-tight break-all">{cpuPercent.toFixed(1)}%</div>
            <div className="text-xs text-gray-500 truncate">utilización</div>
          </div>
          
          {/* Throughput */}
          <div className="bg-gray-700/50 rounded-lg p-3 xs:p-4 sm:p-5 min-w-0">
            <div className="text-xs text-gray-400 mb-2">Rendimiento</div>
            <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white leading-tight break-all">{requestsPerSecond.toFixed(1)}</div>
            <div className="text-xs text-gray-500 truncate">req/s</div>
          </div>
          
          {/* Health Score */}
          <div className="bg-gray-700/50 rounded-lg p-3 xs:p-4 sm:p-5 min-w-0">
            <div className="text-xs text-gray-400 mb-2">Salud del Sistema</div>
            <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-green-500 leading-tight break-all">
              {Math.round(100 - (cpuPercent + memoryMB / 10) / 2)}%
            </div>
            <div className="text-xs text-gray-500 truncate">puntuación</div>
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-600 shadow-xl p-3 xs:p-4 sm:p-5 md:p-6">
        <h3 className="text-base xs:text-lg font-semibold text-white mb-3 xs:mb-4 leading-tight">Tendencias de Rendimiento</h3>
        <div className="h-32 xs:h-36 sm:h-40 md:h-48 bg-gray-700/30 rounded-lg flex items-center justify-center">
          <div className="text-center px-2 xs:px-3 sm:px-4">
            <svg className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-1 xs:mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <p className="text-xs xs:text-sm text-gray-400 leading-relaxed">Gráfico de rendimiento</p>
            <p className="text-xs text-gray-500">Próximamente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
