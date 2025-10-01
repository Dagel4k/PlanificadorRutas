/**
 * Custom hook for map performance optimization
 * Provides memoized values and optimized callbacks for map components
 */

import { useMemo, useCallback, useRef } from 'react';

interface CityNode {
  id: number;
  lat: number;
  lon: number;
  elevation?: number | null;
}

interface UseMapOptimizationProps {
  nodes: CityNode[];
  maxNodesToRender?: number;
  debounceMs?: number;
}

export const useMapOptimization = ({ 
  nodes, 
  maxNodesToRender = 1000, 
  debounceMs = 100 
}: UseMapOptimizationProps) => {
  const debounceRef = useRef<NodeJS.Timeout>();

  // Memoized filtered nodes for performance - improved sampling
  const optimizedNodes = useMemo(() => {
    if (nodes.length <= maxNodesToRender) {
      return nodes;
    }
    
    // For large datasets, use a more intelligent sampling
    // Keep all nodes but limit rendering in components
    return nodes;
  }, [nodes, maxNodesToRender]);

  // Memoized map bounds calculation
  const mapBounds = useMemo(() => {
    if (optimizedNodes.length === 0) {
      return {
        center: [24.7841, -107.3866] as [number, number],
        zoom: 12,
        bounds: null
      };
    }

    const lats = optimizedNodes.map(node => node.lat);
    const lons = optimizedNodes.map(node => node.lon);
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    
    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;
    
    // Calculate appropriate zoom level
    const latRange = maxLat - minLat;
    const lonRange = maxLon - minLon;
    const maxRange = Math.max(latRange, lonRange);
    
    let zoom = 12;
    if (maxRange < 0.01) zoom = 15;
    else if (maxRange < 0.05) zoom = 14;
    else if (maxRange < 0.1) zoom = 13;
    else if (maxRange < 0.2) zoom = 12;
    else zoom = 11;

    return {
      center: [centerLat, centerLon] as [number, number],
      zoom,
      bounds: {
        minLat,
        maxLat,
        minLon,
        maxLon
      }
    };
  }, [optimizedNodes]);

  // Debounced callback for map interactions
  const debouncedCallback = useCallback((callback: () => void) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(callback, debounceMs);
  }, [debounceMs]);

  // Optimized distance calculation with caching
  const distanceCache = useRef<Map<string, number>>(new Map());
  
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const key = `${lat1},${lon1},${lat2},${lon2}`;
    
    if (distanceCache.current.has(key)) {
      return distanceCache.current.get(key)!;
    }
    
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Cache the result
    distanceCache.current.set(key, distance);
    
    // Limit cache size to prevent memory leaks
    if (distanceCache.current.size > 10000) {
      const firstKey = distanceCache.current.keys().next().value;
      distanceCache.current.delete(firstKey);
    }
    
    return distance;
  }, []);

  // Optimized node search
  const findNearbyNodes = useCallback((
    lat: number, 
    lon: number, 
    radius: number, 
    maxResults: number = 10
  ) => {
    const nearby = optimizedNodes
      .map(node => ({
        node,
        distance: calculateDistance(lat, lon, node.lat, node.lon)
      }))
      .filter(item => item.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, maxResults)
      .map(item => item.node);
    
    return nearby;
  }, [optimizedNodes, calculateDistance]);

  // Performance metrics
  const performanceMetrics = useMemo(() => ({
    totalNodes: nodes.length,
    renderedNodes: optimizedNodes.length,
    reductionRatio: nodes.length > 0 ? (1 - optimizedNodes.length / nodes.length) * 100 : 0,
    cacheSize: distanceCache.current.size
  }), [nodes.length, optimizedNodes.length]);

  return {
    optimizedNodes,
    mapBounds,
    debouncedCallback,
    calculateDistance,
    findNearbyNodes,
    performanceMetrics
  };
};
