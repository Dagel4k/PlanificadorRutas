/**
 * Educational Panel Component
 * Interactive educational content for Operations Research class
 */

import { useState, FC } from 'react';

interface EducationalPanelProps {
  algorithm: 'dijkstra' | 'astar' | 'bfs' | 'dfs';
  isCalculating: boolean;
  routeFound: boolean;
  routeLength: number;
  totalDistance: number;
  executionTime: number;
  nodesExplored: number;
}

const EducationalPanel: FC<EducationalPanelProps> = ({
  algorithm,
  isCalculating,
  routeFound,
  routeLength,
  totalDistance,
  executionTime,
  nodesExplored
}) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'demo' | 'metrics'>('theory');

  const algorithmInfo = {
    dijkstra: {
      name: "Algoritmo de Dijkstra",
      complexity: "O((V + E) log V)",
      description: "Encuentra el camino más corto desde un nodo origen a todos los demás nodos en un grafo con pesos no negativos.",
      steps: [
        "1. Inicializar distancias: origen = 0, todos los demás = ∞",
        "2. Crear cola de prioridad con todos los nodos",
        "3. Mientras la cola no esté vacía:",
        "   a) Extraer nodo con menor distancia",
        "   b) Para cada vecino no visitado:",
        "      - Calcular nueva distancia = distancia_actual + peso_arista",
        "      - Si nueva distancia < distancia_almacenada: actualizar",
        "4. Reconstruir camino desde destino hasta origen"
      ],
      advantages: [
        "✓ Garantiza el camino óptimo",
        "✓ Funciona con pesos no negativos",
        "✓ Eficiente con cola de prioridad"
      ],
      disadvantages: [
        "✗ No funciona con pesos negativos",
        "✗ Complejidad O(V²) sin cola de prioridad"
      ]
    },
    astar: {
      name: "Algoritmo A*",
      complexity: "O(b^d)",
      description: "Algoritmo de búsqueda informada que usa una función heurística para guiar la búsqueda hacia el objetivo.",
      steps: [
        "1. Calcular f(n) = g(n) + h(n) para cada nodo",
        "2. g(n) = costo real desde origen",
        "3. h(n) = heurística (distancia euclidiana al destino)",
        "4. Explorar nodos con menor f(n) primero",
        "5. Detener cuando se alcanza el destino"
      ],
      advantages: [
        "✓ Más eficiente que Dijkstra",
        "✓ Usa información heurística",
        "✓ Encuentra camino óptimo si h(n) es admisible"
      ],
      disadvantages: [
        "✗ Requiere función heurística buena",
        "✗ Complejidad depende de la heurística"
      ]
    }
  };

  const currentAlgo = algorithmInfo[algorithm as keyof typeof algorithmInfo] || algorithmInfo.dijkstra;

  return (
    <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-600 shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Panel Educativo
        </h3>
        <div className="text-sm text-gray-400">
          Investigación de Operaciones
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('theory')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'theory'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
          Teoría
        </button>
        <button
          onClick={() => setActiveTab('demo')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'demo'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Demostración
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'metrics'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          Métricas
        </button>
      </div>

      {/* Content */}
      {activeTab === 'theory' && (
        <div className="space-y-6">
          <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-blue-300 mb-2">
              {currentAlgo.name}
            </h4>
            <p className="text-blue-200 text-sm mb-3">
              {currentAlgo.description}
            </p>
            <div className="text-blue-400 text-sm font-mono">
              Complejidad: {currentAlgo.complexity}
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h5 className="text-white font-semibold mb-3">Pasos del Algoritmo:</h5>
            <ol className="space-y-2 text-sm text-gray-300">
              {currentAlgo.steps.map((step: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-400 mr-2 font-mono text-xs">
                    {step.split(' ')[0]}
                  </span>
                  <span>{step.substring(step.indexOf(' ') + 1)}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-900/30 border border-green-600 rounded-lg p-3">
              <h6 className="text-green-300 font-semibold mb-2">Ventajas:</h6>
              <ul className="space-y-1 text-sm text-green-200">
                {currentAlgo.advantages.map((adv: string, index: number) => (
                  <li key={index}>{adv}</li>
                ))}
              </ul>
            </div>
            <div className="bg-red-900/30 border border-red-600 rounded-lg p-3">
              <h6 className="text-red-300 font-semibold mb-2">Desventajas:</h6>
              <ul className="space-y-1 text-sm text-red-200">
                {currentAlgo.disadvantages.map((dis: string, index: number) => (
                  <li key={index}>{dis}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'demo' && (
        <div className="space-y-6">
          <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-purple-300 mb-3">
              <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Demostración en Tiempo Real
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Estado del Algoritmo:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isCalculating 
                    ? 'bg-yellow-600 text-yellow-100' 
                    : routeFound 
                      ? 'bg-green-600 text-green-100'
                      : 'bg-gray-600 text-gray-100'
                }`}>
                  {isCalculating ? (
                    <>
                      <svg className="w-4 h-4 mr-2 inline animate-spin" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Calculando...
                    </>
                  ) : routeFound ? (
                    <>
                      <svg className="w-4 h-4 mr-2 inline text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Completado
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                      </svg>
                      En espera
                    </>
                  )}
                </span>
              </div>

              {routeFound && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-200">Nodos en la ruta:</span>
                    <span className="text-purple-100 font-mono">{routeLength}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-200">Distancia total:</span>
                    <span className="text-purple-100 font-mono">{Math.round(totalDistance)}m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-200">Nodos explorados:</span>
                    <span className="text-purple-100 font-mono">{nodesExplored}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h5 className="text-white font-semibold mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Conceptos Clave:
            </h5>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-start">
                <svg className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span><strong>Grafo:</strong> Red de nodos (intersecciones) conectados por aristas (calles)</span>
              </div>
              <div className="flex items-start">
                <svg className="w-4 h-4 mr-2 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span><strong>Pesos:</strong> Distancia real entre nodos (en metros)</span>
              </div>
              <div className="flex items-start">
                <svg className="w-4 h-4 mr-2 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <span><strong>Exploración:</strong> Nodos visitados durante la búsqueda</span>
              </div>
              <div className="flex items-start">
                <svg className="w-4 h-4 mr-2 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span><strong>Optimalidad:</strong> Garantiza el camino más corto posible</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="bg-indigo-900/30 border border-indigo-600 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-indigo-300 mb-3">
              <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              Análisis de Rendimiento
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-indigo-200 text-sm mb-1">Tiempo de Ejecución</div>
                <div className="text-2xl font-bold text-indigo-100">
                  {executionTime.toFixed(2)}ms
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-indigo-200 text-sm mb-1">Eficiencia</div>
                <div className="text-2xl font-bold text-indigo-100">
                  {nodesExplored > 0 ? ((routeLength / nodesExplored) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h5 className="text-white font-semibold mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Métricas de Complejidad:
            </h5>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Complejidad Temporal:</span>
                <span className="text-blue-400 font-mono">{currentAlgo.complexity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Complejidad Espacial:</span>
                <span className="text-green-400 font-mono">O(V)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Tipo de Búsqueda:</span>
                <span className="text-yellow-400">Greedy + BFS</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h5 className="text-white font-semibold mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              Aplicaciones en I.O.:
            </h5>
            <div className="space-y-2 text-sm text-gray-300">
              <div>• <strong>Logística:</strong> Optimización de rutas de entrega</div>
              <div>• <strong>Transporte:</strong> Planificación de redes de transporte</div>
              <div>• <strong>Telecomunicaciones:</strong> Enrutamiento de paquetes</div>
              <div>• <strong>Robótica:</strong> Navegación autónoma</div>
              <div>• <strong>Juegos:</strong> IA para pathfinding</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationalPanel;
