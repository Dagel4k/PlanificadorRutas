/**
 * Original Simulator Component
 * Contains the original graph algorithms simulator
 */

import { FC } from 'react';
import MapContainer from './MapContainer';
import UnifiedControlPanel from './UnifiedControlPanel';
import UnifiedResultsPanel from './UnifiedResultsPanel';

const OriginalSimulator: FC = () => {
  return (
    <div className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8 px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 pb-4 xs:pb-5 sm:pb-6 md:pb-8 lg:pb-10 xl:pb-12">
      {/* Header */}
      <div className="text-center pt-6 xs:pt-8 sm:pt-10 md:pt-12 lg:pt-14 xl:pt-16 mb-4 xs:mb-5 sm:mb-6 md:mb-8">
        <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold text-white mb-2 xs:mb-3 sm:mb-4 leading-tight">
          <span className="block xs:hidden">Simulador de Algoritmos</span>
          <span className="hidden xs:block">Simulador de Algoritmos de Búsqueda</span>
        </h2>
        <p className="text-xs xs:text-sm sm:text-base font-medium text-gray-400 max-w-2xl mx-auto px-2 xs:px-3 sm:px-4 leading-relaxed">
          Explora y compara algoritmos de búsqueda de rutas con grafos sintéticos
        </p>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 xs:gap-5 sm:gap-6 md:gap-8 min-h-[calc(100vh-180px)] xs:min-h-[calc(100vh-200px)] sm:min-h-[calc(100vh-220px)] md:min-h-[calc(100vh-240px)]">
        {/* Layer 1: Controls (Left) - Full width on mobile, sidebar on desktop */}
        <div className="xl:col-span-3 order-1 xl:order-1 flex flex-col">
          <div className="h-full">
            <UnifiedControlPanel />
          </div>
        </div>

        {/* Layer 2: Graph (Center) - Main Focus */}
        <div className="xl:col-span-6 order-2 xl:order-2 flex flex-col">
          <div className="h-full min-h-[400px] xs:min-h-[450px] sm:min-h-[500px] md:min-h-[550px] lg:min-h-[600px]">
            <MapContainer />
          </div>
        </div>

        {/* Layer 3: Results (Right) - Full width on mobile, sidebar on desktop */}
        <div className="xl:col-span-3 order-3 xl:order-3 flex flex-col">
          <div className="h-full">
            <UnifiedResultsPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OriginalSimulator;

