import React, { useState } from 'react';
import { MapView } from './views/MapView';
import { AddStationView } from './views/AddStationView';
import { StationDetailView } from './views/StationDetailView';
import { FilterView } from './views/FilterView';
import { Station, ViewState } from './types';
import { MOCK_STATIONS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('map');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [stations] = useState<Station[]>(MOCK_STATIONS);

  const handleStationSelect = (station: Station | null) => {
    setSelectedStation(station);
  };

  const handleBackToMap = () => {
    setView('map');
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* 
        We use conditional rendering for the main views but keep MapView mounted 
        behind modals if needed, or simple switching. 
        For a complex map app, you often keep the map mounted. 
      */}
      
      {/* Map View acts as the "home" and is always somewhat present in state */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${view === 'station_details' || view === 'add_station' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
         <MapView 
            stations={stations}
            selectedStation={selectedStation}
            onSelectStation={handleStationSelect}
            onChangeView={setView}
         />
      </div>

      {/* Overlays / Modals */}
      
      {view === 'filters' && (
        <FilterView onClose={() => setView('map')} />
      )}

      {/* Full Screen Views */}
      
      {view === 'add_station' && (
        <div className="absolute inset-0 z-50 animate-in slide-in-from-bottom duration-300">
            <AddStationView onClose={handleBackToMap} />
        </div>
      )}

      {view === 'station_details' && selectedStation && (
        <div className="absolute inset-0 z-50 animate-in slide-in-from-right duration-300">
            <StationDetailView 
                station={selectedStation} 
                onBack={handleBackToMap} 
            />
        </div>
      )}
    </div>
  );
};

export default App;
