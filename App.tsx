import React, { useState, useMemo } from 'react';
import { MapView } from './views/MapView';
import { AddStationView } from './views/AddStationView';
import { FilterView } from './views/FilterView';
import { LandingView } from './views/LandingView';
import { Station, ViewState, FilterState } from './types';
import { MOCK_STATIONS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [stations] = useState<Station[]>(MOCK_STATIONS);
  
  const [filters, setFilters] = useState<FilterState>({
    freeOnly: true,
    publicAccess: false,
    indoor: false,
    outdoor: false,
  });

  const handleStationSelect = (station: Station | null) => {
    setSelectedStation(station);
  };

  const handleBackToMap = () => {
    setView('map');
  };

  // Filter stations logic
  const filteredStations = useMemo(() => {
    return stations.filter(station => {
      // Free filter
      if (filters.freeOnly && !station.isFree) return false;
      return true;
    });
  }, [stations, filters]);

  return (
    <div className="h-full w-full relative overflow-hidden">
      
      {/* Landing View */}
      {view === 'landing' && (
        <div className="absolute inset-0 z-50">
            <LandingView 
                onFindWater={() => setView('map')} 
                onAddPoint={() => setView('add_station')} 
            />
        </div>
      )}
      
      {/* Map View - Always mounted to preserve map state */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${view === 'add_station' || view === 'landing' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
         <MapView 
            stations={filteredStations}
            selectedStation={selectedStation}
            onSelectStation={handleStationSelect}
            onChangeView={setView}
         />
      </div>

      {/* Overlays */}
      
      {view === 'filters' && (
        <FilterView 
            currentFilters={filters}
            onApply={setFilters}
            onClose={() => setView('map')} 
        />
      )}

      {/* Full Screen Modals */}
      
      {view === 'add_station' && (
        <div className="absolute inset-0 z-50 animate-in slide-in-from-bottom duration-300">
            <AddStationView onClose={handleBackToMap} />
        </div>
      )}
    </div>
  );
};

export default App;