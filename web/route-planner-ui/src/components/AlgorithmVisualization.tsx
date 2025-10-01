/**
 * Algorithm Visualization Component
 * Step-by-step visualization of the pathfinding algorithm
 */

import { useState, useEffect, FC, memo, useMemo, useCallback } from 'react';
import VisualAlgorithmMap from './VisualAlgorithmMap';

interface AlgorithmStep {
  step: number;
  action: string;
  currentNode: number;
  exploredNodes: number[];
  frontier: number[];
  distances: Record<number, number>;
  description: string;
  timestamp: number;
}

interface CityNode {
  id: number;
  lat: number;
  lon: number;
}

interface AlgorithmVisualizationProps {
  isCalculating: boolean;
  routeFound: boolean;
  routeNodes: number[];
  algorithmSteps: AlgorithmStep[];
  cityNodes: CityNode[];
  calculatedRoute: CityNode[];
  onStepChange?: (step: AlgorithmStep) => void;
}

const AlgorithmVisualization: FC<AlgorithmVisualizationProps> = ({
  isCalculating,
  routeFound,
  routeNodes,
  algorithmSteps,
  cityNodes,
  calculatedRoute,
  onStepChange
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms
  const [currentPage, setCurrentPage] = useState(0);
  const stepsPerPage = 10; // Show 10 steps per page

  // Reset current step when new steps are available
  useEffect(() => {
    if (algorithmSteps.length > 0) {
      setCurrentStep(0);
      setCurrentPage(0);
    }
  }, [algorithmSteps]);

  // Calculate pagination
  const totalPages = Math.ceil(algorithmSteps.length / stepsPerPage);
  const startIndex = currentPage * stepsPerPage;
  const endIndex = Math.min(startIndex + stepsPerPage, algorithmSteps.length);
  const currentPageSteps = algorithmSteps.slice(startIndex, endIndex);

  // Auto-play steps
  useEffect(() => {
    if (isPlaying && currentStep < algorithmSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, playbackSpeed);
      return () => clearTimeout(timer);
    } else if (currentStep >= algorithmSteps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, algorithmSteps.length, playbackSpeed]);

  const handleStepChange = useCallback((stepIndex: number) => {
    setCurrentStep(stepIndex);
    if (algorithmSteps[stepIndex]) {
      onStepChange?.(algorithmSteps[stepIndex]);
    }
  }, [algorithmSteps, onStepChange]);

  const getActionIcon = useCallback((action: string) => {
    switch (action) {
      case 'initialize': return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      );
      case 'explore': return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      );
      case 'select_min': return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
      case 'found_target': return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      );
      default: return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      );
    }
  }, []);

  const getActionColor = useCallback((action: string) => {
    switch (action) {
      case 'initialize': return 'bg-blue-600';
      case 'explore': return 'bg-green-600';
      case 'select_min': return 'bg-yellow-600';
      case 'found_target': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  }, []);

  if (!isCalculating && algorithmSteps.length === 0) {
    return (
      <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-600 shadow-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          Visualización del Algoritmo
        </h3>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            Selecciona nodos y calcula una ruta para ver la visualización paso a paso
          </div>
          <div className="text-sm text-gray-500">
            La visualización mostrará cómo el algoritmo explora el grafo
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-600 shadow-xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          Visualización del Algoritmo
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            Paso {currentStep + 1} de {algorithmSteps.length}
          </span>
        </div>
      </div>

      {/* Visual Algorithm Map */}
      {algorithmSteps.length > 0 && cityNodes.length > 0 && (
        <VisualAlgorithmMap
          nodes={cityNodes}
          algorithmSteps={algorithmSteps}
          currentStep={currentStep}
          route={calculatedRoute}
          onStepChange={setCurrentStep}
        />
      )}

      {/* Algorithm Details - Integrated in same div */}
      <h4 className="text-lg font-bold text-white mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
        Detalles del Algoritmo
      </h4>

          {/* Current Step Display */}
        {algorithmSteps[currentStep] && (
          <div className="flex-1 flex flex-col space-y-3">
            <div className={`${getActionColor(algorithmSteps[currentStep].action)} rounded-lg p-3`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{getActionIcon(algorithmSteps[currentStep].action)}</span>
                <div>
                  <h4 className="text-white font-semibold text-sm">
                    Paso {algorithmSteps[currentStep].step}: {algorithmSteps[currentStep].action.toUpperCase()}
                  </h4>
                  <p className="text-gray-200 text-xs">
                    {algorithmSteps[currentStep].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Step Details - Compact Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-700 rounded-lg p-2 text-center">
                <div className="text-gray-300 text-xs mb-1">Nodo Actual</div>
                <div className="text-white font-mono text-sm">
                  {algorithmSteps[currentStep].currentNode}
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-2 text-center">
                <div className="text-gray-300 text-xs mb-1">Explorados</div>
                <div className="text-white font-mono text-sm">
                  {algorithmSteps[currentStep].exploredNodes.length}
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-2 text-center">
                <div className="text-gray-300 text-xs mb-1">Frontera</div>
                <div className="text-white font-mono text-sm">
                  {algorithmSteps[currentStep].frontier.length}
                </div>
              </div>
            </div>

            {/* Distances - Compact */}
            <div className="bg-gray-700 rounded-lg p-2 flex-1">
              <div className="text-gray-300 text-xs mb-2">
                Distancias: {Object.keys(algorithmSteps[currentStep].distances).length} nodos
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {Object.entries(algorithmSteps[currentStep].distances)
                  .sort(([,a], [,b]) => (a as number) - (b as number))
                  .slice(0, 15)
                  .map(([node, distance]) => (
                  <div key={node} className="bg-gray-600 rounded px-1 py-0.5 text-xs">
                    <span className="text-blue-400">{node}:</span>
                    <span className="text-white ml-1">{Math.round(distance as number)}m</span>
                  </div>
                ))}
                {Object.keys(algorithmSteps[currentStep].distances).length > 15 && (
                  <div className="text-gray-400 text-xs px-1 py-0.5">
                    +{Object.keys(algorithmSteps[currentStep].distances).length - 15} más
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Controls - Improved Design */}
        <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={currentStep >= algorithmSteps.length - 1}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                {isPlaying ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Pausar
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Reproducir
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setCurrentStep(0);
                  setIsPlaying(false);
                }}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Reiniciar
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-gray-300 text-sm font-medium">Velocidad:</label>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-gray-600 text-white rounded-lg px-3 py-1.5 text-sm border border-gray-500 focus:border-blue-500 focus:outline-none"
              >
                <option value={500}>Rápido</option>
                <option value={1000}>Normal</option>
                <option value={2000}>Lento</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step Navigation with Pagination - Improved */}
        <div className="bg-gray-700/50 rounded-lg p-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-gray-300 text-sm font-medium">
              Navegación por Pasos ({algorithmSteps.length} total)
            </div>
            <div className="text-gray-400 text-sm">
              Página {currentPage + 1} de {totalPages}
            </div>
          </div>
          
          {/* Current Page Steps */}
          <div className="flex flex-wrap gap-2 justify-center">
            {currentPageSteps.map((step, index) => {
              const globalIndex = startIndex + index;
              return (
                <button
                  key={globalIndex}
                  onClick={() => handleStepChange(globalIndex)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    globalIndex === currentStep
                      ? 'bg-blue-600 text-white shadow-lg'
                      : globalIndex < currentStep
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {globalIndex + 1}
                </button>
              );
            })}
          </div>

          {/* Pagination Controls - Improved */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Anterior
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 3) {
                    pageNum = i;
                  } else if (currentPage < 1) {
                    pageNum = i;
                  } else if (currentPage >= totalPages - 1) {
                    pageNum = totalPages - 3 + i;
                  } else {
                    pageNum = currentPage - 1 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        pageNum === currentPage
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
              >
                Siguiente
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}

          {/* Progress Bar - Improved */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Progreso</span>
              <span>{Math.round(((currentStep + 1) / algorithmSteps.length) * 100)}%</span>
            </div>
            <div className="bg-gray-600 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${algorithmSteps.length > 0 ? ((currentStep + 1) / algorithmSteps.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
    </div>
  );
};

export default memo(AlgorithmVisualization);
