/**
 * City Map Component
 * Real map with Leaflet and city nodes visualization
 */

import { useState, useCallback, FC, useMemo, memo } from 'react';
// @ts-ignore
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
// @ts-ignore
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRouteNodes, useRouteCoordinates } from '../store';
import { useMapOptimization } from '../hooks/useMapOptimization';
import OptimizedMarkers from './OptimizedMarkers';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CityNode {
  id: number;
  lat: number;
  lon: number;
  elevation?: number | null;
}

interface CityMapProps {
  nodes: CityNode[];
  selectedSource?: number | null;
  selectedTarget?: number | null;
  calculatedRoute?: CityNode[];
  maxNodesToRender?: number;
  onNodeClick?: (node: CityNode) => void;
  onMapClick?: (lat: number, lon: number) => void;
}

// Custom marker component - memoized for performance
const CustomMarker: FC<{
  node: CityNode;
  isSelected: boolean;
  isSource: boolean;
  isTarget: boolean;
  onClick: (node: CityNode) => void;
}> = memo(({ node, isSelected, isSource, isTarget, onClick }) => {
  let color = '#6b7280'; // gray
  if (isSource) color = '#ef4444'; // red
  else if (isTarget) color = '#22c55e'; // green
  else if (isSelected) color = '#3b82f6'; // blue

  const icon = useMemo(() => L.divIcon({
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
  }), [isSelected, color]);

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

// Component to handle map clicks
const MapClickHandler: FC<{ onMapClick: (lat: number, lon: number) => void }> = ({ onMapClick }) => {
  const map = useMap();

  useMemo(() => {
    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onMapClick]);

  return null;
};

const CityMap: FC<CityMapProps> = ({ 
  nodes, 
  selectedSource, 
  selectedTarget, 
  calculatedRoute,
  maxNodesToRender = 5000,
  onNodeClick, 
  onMapClick 
}) => {
  // Get route data from store
  const routeNodes = useRouteNodes() as number[];
  const routeCoordinates = useRouteCoordinates();
  
  // Use map optimization hook
  const { mapBounds, debouncedCallback } = useMapOptimization({ 
    nodes, 
    maxNodesToRender: 1000 
  });
  
  // Create route path coordinates
  const routePath = useMemo(() => {
    console.log('Debug route data:', {
      calculatedRoute: calculatedRoute?.length || 0,
      routeNodes,
      routeCoordinates,
      nodesLength: nodes.length
    });
    
    // Priority 1: Use calculated route from CitySimulator
    if (calculatedRoute && calculatedRoute.length > 0) {
      console.log('Using calculated route from CitySimulator:', calculatedRoute);
      const path = calculatedRoute.map(node => [node.lat, node.lon] as [number, number]);
      console.log('Calculated route path:', path);
      return path;
    }
    
    // Priority 2: TEMPORARY: Create a test route using first 5 city nodes if no route from store
    if (routeNodes.length === 0 && nodes.length > 0) {
      console.log('Creating test route with first 5 city nodes');
      const testPath = nodes.slice(0, 5).map(node => [node.lat, node.lon] as [number, number]);
      console.log('Test route path:', testPath);
      return testPath;
    }
    
    // Priority 3: Use route from store
    if (routeNodes.length === 0) {
      console.log('No route nodes found');
      return [];
    }
    
    const path = routeNodes.map((nodeId: number) => {
      // First try to get coordinates from store
      if (routeCoordinates[nodeId]) {
        const coords = [routeCoordinates[nodeId][1], routeCoordinates[nodeId][0]] as [number, number];
        console.log(`Found coordinates for node ${nodeId}:`, coords);
        return coords;
      }
      
      // Fallback: find node in city nodes
      const cityNode = nodes.find(node => node.id === nodeId);
      if (cityNode) {
        const coords = [cityNode.lat, cityNode.lon] as [number, number];
        console.log(`Found city node ${nodeId}:`, coords);
        return coords;
      }
      
      console.log(`No coordinates found for node ${nodeId}`);
      return null;
    }).filter(Boolean) as [number, number][];
    
    console.log('Final route path:', path);
    return path;
  }, [calculatedRoute, routeNodes, routeCoordinates, nodes]);
  
  // Use optimized map bounds
  const { center: mapCenter, zoom: mapZoom } = mapBounds;

  // Handle marker click
  const handleMarkerClick = useCallback((node: CityNode) => {
    onNodeClick?.(node);
  }, [onNodeClick]);

  if (nodes.length === 0) {
    return (
      <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-600 shadow-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Mapa de la Ciudad</h3>
        <div className="text-center py-8">
          <div className="text-gray-400">No hay datos de ciudad cargados</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-600 shadow-xl p-4 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">Mapa de la Ciudad</h3>
      
      <div className="bg-gray-700 rounded-lg p-4 overflow-hidden flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-400">
            {nodes.length.toLocaleString()} nodos • Zoom: {mapZoom}
            {routePath.length > 1 && (
              <span className="ml-2 text-red-400 font-semibold">
                • Ruta activa ({routePath.length} nodos)
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500">
            {routePath.length > 1 ? 'Ruta calculada visible' : 'Haz clic en un nodo para seleccionarlo'}
          </div>
        </div>
        
        {/* Route Information - Distributed in map area */}
        {routePath.length > 1 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-2 text-center">
              <div className="text-green-300 text-xs font-medium">Distancia</div>
              <div className="text-white font-mono text-sm">
                {Math.round(routePath.reduce((total, coord, i) => {
                  if (i === 0) return 0;
                  const prevCoord = routePath[i-1];
                  const distance = Math.sqrt(
                    Math.pow(coord[0] - prevCoord[0], 2) + 
                    Math.pow(coord[1] - prevCoord[1], 2)
                  ) * 111000; // Rough conversion to meters
                  return total + distance;
                }, 0))}m
              </div>
            </div>
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-2 text-center">
              <div className="text-blue-300 text-xs font-medium">Nodos</div>
              <div className="text-white font-mono text-sm">{routePath.length}</div>
            </div>
            <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-2 text-center">
              <div className="text-purple-300 text-xs font-medium">Tipo</div>
              <div className="text-white font-mono text-xs">
                {routePath.length > 0 ? 'Real' : 'Simulado'}
              </div>
            </div>
          </div>
        )}
        
        <div className="border border-gray-600 rounded-lg overflow-hidden flex-1">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
            scrollWheelZoom={true}
            doubleClickZoom={true}
            dragging={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Route path */}
            {routePath.length > 1 && (
              <>
                {/* Background line for better visibility */}
                <Polyline
                  positions={routePath}
                  pathOptions={{
                    color: '#ffffff',
                    weight: 12,
                    opacity: 0.8,
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                />
                {/* Main route line */}
                <Polyline
                  positions={routePath}
                  pathOptions={{
                    color: '#ef4444',
                    weight: 8,
                    opacity: 1.0,
                    dashArray: '15, 15',
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                />
              </>
            )}

            {/* Optimized markers */}
            <OptimizedMarkers
              nodes={nodes}
              selectedSource={selectedSource}
              selectedTarget={selectedTarget}
              calculatedRoute={calculatedRoute}
              routeNodes={routeNodes as number[]}
              onNodeClick={handleMarkerClick}
              maxMarkers={maxNodesToRender}
            />

            {/* Map click handler */}
            {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
          </MapContainer>
        </div>
        
        <div className="mt-4 text-xs text-gray-400 flex-shrink-0">
          <div className="flex justify-between">
            <span>Centro: {mapCenter[0].toFixed(4)}, {mapCenter[1].toFixed(4)}</span>
            <span>Arrastra para mover • Rueda para zoom</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CityMap);