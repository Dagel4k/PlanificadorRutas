/**
 * Node Density Control Component
 * Allows users to control how many nodes are visible on the map
 */

import { memo, FC } from 'react';

interface NodeDensityControlProps {
  maxNodes: number;
  onMaxNodesChange: (maxNodes: number) => void;
  totalNodes: number;
  visibleNodes: number;
}

const NodeDensityControl: FC<NodeDensityControlProps> = ({
  maxNodes,
  onMaxNodesChange,
  totalNodes,
  visibleNodes
}) => {
  const densityOptions = [
    { label: 'Baja', value: 1000, description: 'Rápido, pocos nodos (~1000)' },
    { label: 'Media', value: 3000, description: 'Balanceado (~3000)' },
    { label: 'Alta', value: 5000, description: 'Más nodos (~5000)' },
    { label: 'Máxima', value: totalNodes, description: `Todos los nodos (${totalNodes.toLocaleString()})` },
  ];

  return (
    <div className="bg-gray-700/50 rounded-lg p-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-300 text-xs font-medium">Densidad</span>
        <span className="text-gray-400 text-xs">
          {visibleNodes.toLocaleString()}/{totalNodes.toLocaleString()}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-1 mb-1">
        {densityOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onMaxNodesChange(option.value)}
            className={`px-1 py-1 rounded text-xs transition-colors ${
              maxNodes === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
            title={option.description}
          >
            {option.label}
          </button>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Perf.</span>
        <div className="flex items-center gap-1">
          {maxNodes <= 1000 && <span className="text-green-400">⚡</span>}
          {maxNodes > 1000 && maxNodes <= 3000 && <span className="text-yellow-400">⚡</span>}
          {maxNodes > 3000 && maxNodes < totalNodes && <span className="text-orange-400">⚡</span>}
          {maxNodes === totalNodes && <span className="text-red-400">⚡</span>}
        </div>
      </div>
    </div>
  );
};

export default memo(NodeDensityControl);
