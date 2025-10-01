/**
 * City Simulator Section Component
 * Wrapper for the city simulator with proper layout
 */

import { FC } from 'react';
import CitySimulator from './CitySimulator';

const CitySimulatorSection: FC = () => {
  const handleRouteCalculated = (result: any) => {
    console.log('Ruta calculada:', result);
  };

  return (
    <div className="px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
      {/* Header */}
      <div className="text-center pt-6 xs:pt-8 sm:pt-10 md:pt-12 lg:pt-14 xl:pt-16 mb-4 xs:mb-5 sm:mb-6 md:mb-8">
        <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold text-white mb-2 xs:mb-3 sm:mb-4 leading-tight">
          <span className="block xs:hidden">Simulador de Ciudad</span>
          <span className="hidden xs:block">Simulador de Ciudad Realista</span>
        </h2>
        <p className="text-xs xs:text-sm sm:text-base font-medium text-gray-400 max-w-2xl mx-auto px-2 xs:px-3 sm:px-4 leading-relaxed">
          Planificación de rutas usando datos reales de tu ciudad con el algoritmo de Dijkstra
        </p>
      </div>

      {/* City Simulator Content */}
      <CitySimulator onRouteCalculated={handleRouteCalculated} />
    </div>
  );
};

export default CitySimulatorSection;
