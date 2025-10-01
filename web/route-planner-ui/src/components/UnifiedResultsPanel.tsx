/**
 * Unified Results Panel Component
 * Combines results and timeline in a single clean panel
 */

import { FC } from 'react';
import { 
  useRouteNodes, 
  useRouteCost, 
  useRouteExpanded, 
  useRouteAlgorithm, 
  useRouteMetric, 
  useRouteExecutionTime, 
  useRouteError,
  useIsComputing,
  useTimelineState 
} from '../store';

const UnifiedResultsPanel: FC = () => {
  const computing = useIsComputing();
  const nodes = useRouteNodes();
  const cost = useRouteCost();
  const expanded = useRouteExpanded();
  const algorithm = useRouteAlgorithm();
  const metric = useRouteMetric();
  const executionTime = useRouteExecutionTime();
  const error = useRouteError();
  
  const { streaming, steps, stepCount } = useTimelineState();

  const hasResults = nodes.length > 0 || error;
  const hasSteps = steps.length > 0;

  return (
    <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-600 shadow-xl h-full flex flex-col">
      {/* Header */}
      <div className="p-3 xs:p-4 sm:p-5 md:p-6 border-b border-gray-600">
        <h3 className="text-base xs:text-lg font-semibold text-white leading-tight">Resultados</h3>
        {computing && (
          <div className="flex items-center mt-1 xs:mt-2">
            <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-blue-500 rounded-full animate-pulse mr-1.5 xs:mr-2" />
            <span className="text-xs xs:text-sm text-blue-400">Calculando...</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 xs:p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
        {!hasResults && !computing ? (
          /* Empty State */
          <div className="text-center py-8 xs:py-10 sm:py-12">
            <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 xs:mb-4">
              <svg className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="text-base xs:text-lg font-medium text-white mb-1 xs:mb-2 leading-tight">Sin resultados</h4>
            <p className="text-xs xs:text-sm text-gray-400 leading-relaxed px-2">Configura los nodos y ejecuta el algoritmo para ver los resultados aquí.</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center py-6 xs:py-8">
            <div className="w-10 h-10 xs:w-12 xs:h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3 xs:mb-4">
              <svg className="w-5 h-5 xs:w-6 xs:h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="text-base xs:text-lg font-medium text-white mb-1 xs:mb-2 leading-tight">Error</h4>
            <p className="text-xs xs:text-sm text-red-400 leading-relaxed px-2">{error}</p>
          </div>
        ) : (
          /* Results State */
          <div className="space-y-4 xs:space-y-5 sm:space-y-6">
            {/* Main Results */}
            <div className="space-y-3 xs:space-y-4 sm:space-y-5">
              <div className="bg-gray-700/50 rounded-lg p-3 xs:p-4 sm:p-5 w-full">
                <div className="text-xs text-gray-400 mb-2">Costo Total</div>
                <div className="text-lg xs:text-xl sm:text-2xl font-bold text-white leading-tight">{cost.toFixed(2)}</div>
                <div className="text-xs text-gray-500 capitalize mt-1">{metric}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3 xs:p-4 sm:p-5 w-full">
                <div className="text-xs text-gray-400 mb-2">Tiempo</div>
                <div className="text-lg xs:text-xl sm:text-2xl font-bold text-white leading-tight">{executionTime.toFixed(0)}µs</div>
                <div className="text-xs text-gray-500 mt-1">ejecución</div>
              </div>
            </div>

            {/* Route Info */}
            <div className="bg-gray-700/50 rounded-lg p-2.5 xs:p-3 sm:p-4">
              <div className="text-xs text-gray-400 mb-1 xs:mb-2">Ruta encontrada</div>
              <div className="text-xs xs:text-sm font-medium text-white leading-relaxed">
                {nodes.length > 0 ? (
                  <span className="text-blue-400">
                    {nodes.length > 4 
                      ? `${nodes.slice(0, 2).join(' → ')} → ... → ${nodes[nodes.length - 1]}`
                      : nodes.slice(0, 3).join(' → ') + (nodes.length > 3 ? ` → ... → ${nodes[nodes.length - 1]}` : '')
                    }
                  </span>
                ) : (
                  <span className="text-gray-500">Sin ruta</span>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {nodes.length} nodos • {expanded} expandidos
              </div>
            </div>

            {/* Algorithm Info */}
            <div className="bg-gray-700/50 rounded-lg p-2.5 xs:p-3 sm:p-4">
              <div className="text-xs text-gray-400 mb-1 xs:mb-2">Algoritmo</div>
              <div className="flex items-center justify-between">
                <span className="text-xs xs:text-sm font-medium text-white capitalize">{algorithm}</span>
                <div className="flex items-center">
                  <div className={`w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full mr-1.5 xs:mr-2 ${streaming ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                  <span className="text-xs text-gray-400">
                    {streaming ? 'En vivo' : 'Completado'}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline Summary */}
            {hasSteps && (
              <div className="bg-gray-700/50 rounded-lg p-2.5 xs:p-3 sm:p-4">
                <div className="text-xs text-gray-400 mb-1 xs:mb-2">Progreso del algoritmo</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs xs:text-sm font-medium text-white">{stepCount} pasos</span>
                  <div className="w-12 xs:w-14 sm:w-16 h-1.5 xs:h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${Math.min(100, (stepCount / Math.max(expanded, 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedResultsPanel;
