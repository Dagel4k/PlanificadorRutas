/**
 * Demo Examples Component
 * Predefined examples for classroom demonstration
 */

import { FC } from 'react';

interface DemoExample {
  id: string;
  name: string;
  description: string;
  sourceId: number;
  targetId: number;
  difficulty: 'easy' | 'medium' | 'hard';
  learningObjective: string;
}

interface DemoExamplesProps {
  onSelectExample: (sourceId: number, targetId: number, description: string) => void;
  availableNodes: Array<{id: number, lat: number, lon: number}>;
}

const DemoExamples: FC<DemoExamplesProps> = ({ onSelectExample, availableNodes }) => {
  // Generate examples based on available nodes
  const generateExamples = (): DemoExample[] => {
    if (availableNodes.length < 2) return [];

    const examples: DemoExample[] = [];
    
    // Easy example: close nodes
    if (availableNodes.length >= 2) {
      const closeNodes = availableNodes
        .map(node => ({
          ...node,
          distance: Math.sqrt(
            Math.pow(node.lat - 24.7841, 2) + Math.pow(node.lon - (-107.3866), 2)
          )
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10);

      if (closeNodes.length >= 2) {
        examples.push({
          id: 'easy-1',
          name: 'Ruta Corta (Fácil)',
          description: 'Ruta entre dos puntos cercanos - ideal para ver el algoritmo paso a paso',
          sourceId: closeNodes[0].id,
          targetId: closeNodes[1].id,
          difficulty: 'easy',
          learningObjective: 'Entender la exploración básica del algoritmo'
        });
      }
    }

    // Medium example: medium distance
    if (availableNodes.length >= 4) {
      const sortedNodes = availableNodes
        .map(node => ({
          ...node,
          distance: Math.sqrt(
            Math.pow(node.lat - 24.7841, 2) + Math.pow(node.lon - (-107.3866), 2)
          )
        }))
        .sort((a, b) => a.distance - b.distance);

      const midIndex = Math.floor(sortedNodes.length / 2);
      if (midIndex >= 1 && midIndex + 1 < sortedNodes.length) {
        examples.push({
          id: 'medium-1',
          name: 'Ruta Media (Intermedio)',
          description: 'Ruta de distancia media - muestra la eficiencia del algoritmo',
          sourceId: sortedNodes[0].id,
          targetId: sortedNodes[midIndex].id,
          difficulty: 'medium',
          learningObjective: 'Analizar la complejidad y eficiencia'
        });
      }
    }

    // Hard example: far nodes
    if (availableNodes.length >= 2) {
      const farNodes = availableNodes
        .map(node => ({
          ...node,
          distance: Math.sqrt(
            Math.pow(node.lat - 24.7841, 2) + Math.pow(node.lon - (-107.3866), 2)
          )
        }))
        .sort((a, b) => b.distance - a.distance)
        .slice(0, 5);

      if (farNodes.length >= 2) {
        examples.push({
          id: 'hard-1',
          name: 'Ruta Larga (Avanzado)',
          description: 'Ruta entre puntos distantes - demuestra la escalabilidad del algoritmo',
          sourceId: farNodes[0].id,
          targetId: farNodes[1].id,
          difficulty: 'hard',
          learningObjective: 'Evaluar el rendimiento en casos complejos'
        });
      }
    }

    // Special educational examples
    examples.push({
      id: 'demo-1',
      name: 'Demostración Clase',
      description: 'Ejemplo optimizado para demostración en clase - muestra conceptos clave',
      sourceId: availableNodes[0]?.id || 0,
      targetId: availableNodes[Math.min(5, availableNodes.length - 1)]?.id || 0,
      difficulty: 'easy',
      learningObjective: 'Demostrar conceptos fundamentales de pathfinding'
    });

    return examples.filter(ex => ex.sourceId !== ex.targetId);
  };

  const examples = generateExamples();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-600 hover:bg-green-700';
      case 'medium': return 'bg-yellow-600 hover:bg-yellow-700';
      case 'hard': return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return (
        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
      case 'medium': return (
        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
      case 'hard': return (
        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
      default: return (
        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  return (
    <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-600 shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Ejemplos para Demostración
        </h3>
        <div className="text-sm text-gray-400">
          {examples.length} ejemplos disponibles
        </div>
      </div>

      <div className="space-y-4">
        {examples.map((example) => (
          <div
            key={example.id}
            className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-semibold text-white">
                    {example.name}
                  </h4>
                  <span className="text-lg">{getDifficultyIcon(example.difficulty)}</span>
                </div>
                <p className="text-gray-300 text-sm mb-2">
                  {example.description}
                </p>
                <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-2">
                  <div className="text-blue-300 text-xs font-medium mb-1">
                    <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    Objetivo de Aprendizaje:
                  </div>
                  <div className="text-blue-200 text-xs">
                    {example.learningObjective}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">
                Origen: {example.sourceId} → Destino: {example.targetId}
              </div>
              <button
                onClick={() => onSelectExample(example.sourceId, example.targetId, example.description)}
                className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${getDifficultyColor(example.difficulty)}`}
              >
                Usar este Ejemplo
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-purple-900/30 border border-purple-600 rounded-lg">
        <h5 className="text-purple-300 font-semibold mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Consejos para la Demostración:
        </h5>
        <ul className="space-y-1 text-sm text-purple-200">
          <li>• Comienza con ejemplos fáciles para explicar conceptos básicos</li>
          <li>• Usa ejemplos medios para mostrar la eficiencia del algoritmo</li>
          <li>• Compara diferentes algoritmos con el mismo ejemplo</li>
          <li>• Observa cómo cambian las métricas con la complejidad</li>
          <li>• Explica la diferencia entre exploración y explotación</li>
        </ul>
      </div>
    </div>
  );
};

export default DemoExamples;
