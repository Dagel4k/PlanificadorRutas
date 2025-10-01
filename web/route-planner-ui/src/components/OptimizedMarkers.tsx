/**
 * Optimized Markers Component
 * Efficiently renders large numbers of map markers with virtualization
 */

import { memo, useMemo, useCallback } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface CityNode {
  id: number;
  lat: number;
  lon: number;
  elevation?: number | null;
}

interface OptimizedMarkersProps {
  nodes: CityNode[];
  selectedSource?: number | null;
  selectedTarget?: number | null;
  calculatedRoute?: CityNode[];
  routeNodes?: number[];
  onNodeClick?: (node: CityNode) => void;
  maxMarkers?: number;
}

// Memoized marker component
const OptimizedMarker = memo<{
  node: CityNode;
  isSelected: boolean;
  isSource: boolean;
  isTarget: boolean;
  onClick: (node: CityNode) => void;
}>(({ node, isSelected, isSource, isTarget, onClick }) => {
  const icon = useMemo(() => {
    let color = '#6b7280'; // gray
    if (isSource) color = '#ef4444'; // red
    else if (isTarget) color = '#22c55e'; // green
    else if (isSelected) color = '#3b82f6'; // blue

    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: ${isSelected ? '16px' : '12px'};
        height: ${isSelected ? '16px' : '12px'};
        background-color: ${color};
        border: ${isSelected ? '2px solid white' : '1px solid rgba(255,255,255,0.5)'};
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
      "></div>`,
      iconSize: [isSelected ? 20 : 16, isSelected ? 20 : 16],
      iconAnchor: [isSelected ? 10 : 8, isSelected ? 10 : 8],
    });
  }, [isSelected, isSource, isTarget]);

  const handleClick = useCallback(() => {
    onClick(node);
  }, [onClick, node]);

  return (
    <Marker
      position={[node.lat, node.lon] as [number, number]}
      icon={icon}
      eventHandlers={{
        click: handleClick,
      }}
    >
      <Popup>
        <div className="text-sm">
          <div className="font-semibold text-gray-900 mb-2">Nodo {node.id}</div>
          <div className="text-gray-600 space-y-1">
            <div>Lat: {node.lat.toFixed(6)}</div>
            <div>Lon: {node.lon.toFixed(6)}</div>
            {node.elevation !== null && node.elevation !== undefined && (
              <div>Elevación: {node.elevation}m</div>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
});

const OptimizedMarkers: React.FC<OptimizedMarkersProps> = ({
  nodes,
  selectedSource,
  selectedTarget,
  calculatedRoute,
  routeNodes = [],
  onNodeClick,
  maxMarkers = 1000
}) => {
  // Memoized filtered nodes for performance - improved algorithm with visible differences
  const visibleNodes = useMemo(() => {
    if (nodes.length <= maxMarkers) {
      return nodes;
    }
    
    // Always include important nodes first
    const importantNodes = nodes.filter(node => 
      node.id === selectedSource || 
      node.id === selectedTarget ||
      (calculatedRoute && calculatedRoute.some(routeNode => routeNode.id === node.id)) ||
      routeNodes.includes(node.id)
    );
    
    // Calculate how many regular nodes we can add
    const remainingSlots = maxMarkers - importantNodes.length;
    
    if (remainingSlots <= 0) {
      return importantNodes.slice(0, maxMarkers);
    }
    
    // Use different sampling strategies based on maxMarkers
    let otherNodes: CityNode[] = [];
    
    if (maxMarkers <= 1000) {
      // Low density: sparse sampling
      const step = Math.max(1, Math.floor(nodes.length / remainingSlots));
      otherNodes = nodes
        .filter(node => !importantNodes.some(important => important.id === node.id))
        .filter((_, index) => index % step === 0)
        .slice(0, remainingSlots);
    } else if (maxMarkers <= 3000) {
      // Medium density: moderate sampling
      const step = Math.max(1, Math.floor(nodes.length / (remainingSlots * 1.5)));
      otherNodes = nodes
        .filter(node => !importantNodes.some(important => important.id === node.id))
        .filter((_, index) => index % step === 0)
        .slice(0, remainingSlots);
    } else if (maxMarkers <= 5000) {
      // High density: dense sampling
      const step = Math.max(1, Math.floor(nodes.length / (remainingSlots * 2)));
      otherNodes = nodes
        .filter(node => !importantNodes.some(important => important.id === node.id))
        .filter((_, index) => index % step === 0)
        .slice(0, remainingSlots);
    } else {
      // Maximum density: show most nodes
      otherNodes = nodes
        .filter(node => !importantNodes.some(important => important.id === node.id))
        .slice(0, remainingSlots);
    }
    
    return [...importantNodes, ...otherNodes];
  }, [nodes, maxMarkers, selectedSource, selectedTarget, calculatedRoute, routeNodes]);

  // Memoized click handler
  const handleNodeClick = useCallback((node: CityNode) => {
    onNodeClick?.(node);
  }, [onNodeClick]);

  // Memoized markers
  const markers = useMemo(() => {
    return visibleNodes.map((node) => {
      const isSelected = node.id === selectedSource || node.id === selectedTarget;
      const isSource = node.id === selectedSource;
      const isTarget = node.id === selectedTarget;
      const isInRoute = calculatedRoute 
        ? calculatedRoute.some(routeNode => routeNode.id === node.id) 
        : routeNodes.includes(node.id);
      
      return (
        <OptimizedMarker
          key={node.id}
          node={node}
          isSelected={isSelected || isInRoute}
          isSource={isSource}
          isTarget={isTarget}
          onClick={handleNodeClick}
        />
      );
    });
  }, [visibleNodes, selectedSource, selectedTarget, calculatedRoute, routeNodes, handleNodeClick]);

  return <>{markers}</>;
};

export default memo(OptimizedMarkers);
