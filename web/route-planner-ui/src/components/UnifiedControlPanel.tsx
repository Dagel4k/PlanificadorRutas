/**
 * Unified Control Panel Component
 * Combines all controls in a single compact panel with tabs
 */

import { FC, useState } from 'react';
import { useCalculateRoute, useClearRoute, useGraphState, useRegenerateGraph, useGraphK, useSetGraphK } from '../store';

const UnifiedControlPanel: FC = () => {
  const [activeTab, setActiveTab] = useState<'config' | 'graph' | 'stats'>('config');
  const [sourceNode, setSourceNode] = useState<number>(1);
  const [targetNode, setTargetNode] = useState<number>(50);
  const [algorithm, setAlgorithm] = useState<'dijkstra' | 'astar'>('dijkstra');
  const [metric, setMetric] = useState<'time' | 'distance' | 'cost'>('distance');
  
  const calculateRoute = useCalculateRoute();
  const clearRoute = useClearRoute();
  const { loaded, size } = useGraphState();
  const regenerateGraph = useRegenerateGraph();
  const graphK = useGraphK();
  const setGraphK = useSetGraphK();

  const handleCalculate = async () => {
    if (!sourceNode || !targetNode) return;
    
    await calculateRoute({
      source: sourceNode,
      target: targetNode,
      algo: algorithm,
      metric,
      debug: true,
    });
  };

  const handleClear = () => {
    clearRoute();
    setSourceNode(1);
    setTargetNode(50);
  };

  const handleRegenerateGraph = async () => {
    await regenerateGraph(size);
  };

  const tabs = [
    { 
      id: 'config' as const, 
      label: 'Configuración', 
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'graph' as const, 
      label: 'Grafo', 
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      )
    },
    { 
      id: 'stats' as const, 
      label: 'Estadísticas', 
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      )
    },
  ];

  return (
    <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-600 shadow-xl h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-600 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 flex items-center justify-center min-h-[44px] xs:min-h-[48px] sm:min-h-[52px]
              ${activeTab === tab.id
                ? 'bg-blue-600 text-white border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }
            `}
          >
            <span className="mr-1 xs:mr-1.5 sm:mr-2 flex-shrink-0">
              <svg className="w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                {tab.id === 'config' && <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />}
                {tab.id === 'graph' && <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />}
                {tab.id === 'stats' && <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />}
              </svg>
            </span>
            <span className="truncate">
              <span className="hidden xs:inline">{tab.label}</span>
              <span className="xs:hidden">
                {tab.id === 'config' ? 'Config' : 
                 tab.id === 'graph' ? 'Grafo' : 'Stats'}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-3 xs:p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
        {activeTab === 'config' && (
          <div className="space-y-4 xs:space-y-5 sm:space-y-6">
            {/* Graph Configuration */}
            <div>
              <h3 className="text-base xs:text-lg font-semibold text-white mb-3 xs:mb-4 leading-tight">Configuración de Grafo</h3>
              <div className="space-y-3 xs:space-y-4">
                <div>
                  <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-2 leading-relaxed">
                    Número de Nodos: {size}
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleRegenerateGraph}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 rounded-lg transition-colors flex items-center justify-center text-xs xs:text-sm"
                    >
                      <svg className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      <span className="hidden xs:inline">Regenerar</span>
                      <span className="xs:hidden">Regen</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-2 leading-relaxed">
                    Conectividad (K): {graphK}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    value={graphK}
                    onChange={(e) => setGraphK(parseInt(e.target.value))}
                    className="w-full h-1.5 xs:h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>2 (mín)</span>
                    <span>10 (máx)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Node Configuration */}
            <div>
              <h3 className="text-base xs:text-lg font-semibold text-white mb-3 xs:mb-4 leading-tight">Configuración de Nodos</h3>
              <div className="space-y-3 xs:space-y-4">
                <div>
                  <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-2 leading-relaxed">
                    Nodo Origen
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={sourceNode}
                      onChange={(e) => setSourceNode(parseInt(e.target.value) || 1)}
                      className="flex-1 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none text-xs xs:text-sm"
                      min="1"
                      max={size}
                    />
                    <button
                      onClick={() => setSourceNode(Math.floor(Math.random() * size) + 1)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 rounded-lg transition-colors"
                      title="Nodo aleatorio"
                    >
                      <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-2 leading-relaxed">
                    Nodo Destino
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={targetNode}
                      onChange={(e) => setTargetNode(parseInt(e.target.value) || 50)}
                      className="flex-1 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none text-xs xs:text-sm"
                      min="1"
                      max={size}
                    />
                    <button
                      onClick={() => setTargetNode(Math.floor(Math.random() * size) + 1)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 rounded-lg transition-colors"
                      title="Nodo aleatorio"
                    >
                      <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Algorithm Configuration */}
            <div>
              <h3 className="text-base xs:text-lg font-semibold text-white mb-3 xs:mb-4 leading-tight">Algoritmo</h3>
              <div className="space-y-3 xs:space-y-4">
                <div>
                  <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-2 leading-relaxed">
                    Tipo de Algoritmo
                  </label>
                  <select
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value as 'dijkstra' | 'astar')}
                    className="w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none text-xs xs:text-sm"
                  >
                    <option value="dijkstra">Dijkstra</option>
                    <option value="astar">A*</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-2 leading-relaxed">
                    Métrica
                  </label>
                  <select
                    value={metric}
                    onChange={(e) => setMetric(e.target.value as 'time' | 'distance' | 'cost')}
                    className="w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none text-xs xs:text-sm"
                  >
                    <option value="time">Tiempo</option>
                    <option value="distance">Distancia</option>
                    <option value="cost">Costo</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 xs:gap-3 sm:gap-4">
              <button
                onClick={handleCalculate}
                disabled={!loaded}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 xs:px-5 sm:px-6 py-2.5 xs:py-3 sm:py-3.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm xs:text-sm sm:text-base min-h-[44px] xs:min-h-[48px] sm:min-h-[52px]"
              >
                <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 mr-2 xs:mr-2.5 sm:mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span className="truncate">
                  <span className="hidden xs:inline">Calcular</span>
                  <span className="xs:hidden">Calc</span>
                </span>
              </button>
              <button
                onClick={handleClear}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 xs:px-5 sm:px-6 py-2.5 xs:py-3 sm:py-3.5 rounded-lg transition-colors flex items-center justify-center text-sm xs:text-sm sm:text-base min-h-[44px] xs:min-h-[48px] sm:min-h-[52px] flex-shrink-0"
              >
                <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 mr-2 xs:mr-2.5 sm:mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="truncate">
                  <span className="hidden xs:inline">Limpiar</span>
                  <span className="xs:hidden">Limpiar</span>
                </span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'graph' && (
          <div className="space-y-4 xs:space-y-5 sm:space-y-6">
            <h3 className="text-base xs:text-lg font-semibold text-white mb-3 xs:mb-4 leading-tight">Información del Grafo</h3>
            <div className="space-y-3 xs:space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-3 xs:p-4">
                <div className="text-xs xs:text-sm text-gray-400 mb-1">Nodos disponibles</div>
                <div className="text-xl xs:text-2xl font-bold text-white">{size}</div>
                <div className="text-xs text-gray-500">Rango: 1 - {size}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3 xs:p-4">
                <div className="text-xs xs:text-sm text-gray-400 mb-1">Estado</div>
                <div className="flex items-center mt-1">
                  <div className={`w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full mr-2 ${loaded ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs xs:text-sm text-white">{loaded ? 'Cargado' : 'No cargado'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4 xs:space-y-5 sm:space-y-6">
            <h3 className="text-base xs:text-lg font-semibold text-white mb-3 xs:mb-4 leading-tight">Estadísticas Rápidas</h3>
            <div className="space-y-2 xs:space-y-3">
              <div className="bg-gray-700/50 rounded-lg p-2.5 xs:p-3">
                <div className="text-xs text-gray-400 mb-1">Algoritmo actual</div>
                <div className="text-xs xs:text-sm font-medium text-white capitalize">{algorithm}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-2.5 xs:p-3">
                <div className="text-xs text-gray-400 mb-1">Métrica</div>
                <div className="text-xs xs:text-sm font-medium text-white capitalize">{metric}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-2.5 xs:p-3">
                <div className="text-xs text-gray-400 mb-1">Configuración</div>
                <div className="text-xs xs:text-sm font-medium text-white">{sourceNode} → {targetNode}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedControlPanel;
