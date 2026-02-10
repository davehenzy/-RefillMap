import React, { useState } from 'react';
import { Map } from '../components/Map';
import { Icon } from '../components/Icon';
import { Station, ViewState } from '../types';

interface MapViewProps {
  stations: Station[];
  selectedStation: Station | null;
  onSelectStation: (station: Station | null) => void;
  onChangeView: (view: ViewState) => void;
}

export const MapView: React.FC<MapViewProps> = ({ 
  stations, 
  selectedStation, 
  onSelectStation,
  onChangeView 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Handle external navigation
  const handleNavigate = (station: Station) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.coordinates.lat},${station.coordinates.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="relative h-full w-full flex flex-col">
      {/* Background Map */}
      <Map 
        stations={stations} 
        selectedStationId={selectedStation?.id || null}
        onStationSelect={onSelectStation}
        onMapClick={() => onSelectStation(null)}
      />

      {/* Floating Top UI */}
      <div className="relative z-30 w-full px-4 pt-4 pb-2 pointer-events-none">
        <div className="pointer-events-auto flex gap-3 items-center">
          <div className="flex-1 shadow-lg shadow-slate-200/50 dark:shadow-black/20 rounded-xl bg-white dark:bg-slate-900 transition-all focus-within:ring-2 focus-within:ring-primary/50">
            <label className="flex items-center h-12 w-full px-4 cursor-text">
              <Icon name="search" className="text-slate-400 mr-3" />
              <input 
                className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 h-full p-0 focus:ring-0 text-base" 
                placeholder="Search city or postcode" 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>
          </div>
          <button 
            onClick={() => onChangeView('filters')}
            className="h-12 w-12 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-lg shadow-slate-200/50 dark:shadow-black/20 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all"
          >
            <Icon name="tune" />
          </button>
        </div>

        {/* Quick Filters - Horizontal Scroll */}
        <div className="pointer-events-auto flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-2 pl-1">
          <button className="px-3 py-1.5 rounded-full bg-primary text-white text-sm font-medium shadow-md shadow-primary/20 flex items-center gap-1.5 whitespace-nowrap transition-colors">
            <Icon name="water_drop" size={18} />
            Free Water
          </button>
          <button className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-1.5 whitespace-nowrap hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Icon name="pets" size={18} />
            Dog Bowl
          </button>
          <button className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-1.5 whitespace-nowrap hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Icon name="ac_unit" size={18} className="text-blue-300" />
            Chilled
          </button>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1 pointer-events-none"></div>

      {/* Floating Controls (Location) */}
      <div className={`relative z-30 px-4 py-2 flex flex-col items-end gap-3 pointer-events-none transition-all duration-300 ${selectedStation ? 'mb-0 opacity-0' : 'mb-4 opacity-100'}`}>
        <button className="pointer-events-auto h-14 w-14 flex items-center justify-center rounded-full bg-white dark:bg-slate-900 text-primary shadow-lg shadow-slate-200/50 dark:shadow-black/20 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all">
          <Icon name="my_location" className="text-2xl" />
        </button>
      </div>

      {/* Bottom Sheet - Unified Details */}
      <div className={`relative z-40 bg-white dark:bg-slate-900 rounded-t-2xl shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] dark:shadow-black/40 transition-transform duration-300 ease-out transform flex flex-col ${selectedStation ? 'translate-y-0' : 'translate-y-[calc(100%-80px)]'}`}>
        
        {/* Drag Handle / Close logic */}
        <div className="w-full flex justify-center pt-3 pb-1 shrink-0" onClick={() => onSelectStation(null)}>
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        </div>

        {selectedStation ? (
          <div className="px-5 pb-6 pt-2 flex-1 overflow-y-auto max-h-[60vh]">
            {/* Header */}
             <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{selectedStation.name}</h2>
                <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mt-1 gap-2">
                    <span className="font-medium text-primary">{selectedStation.distance || '0.2 mi'}</span>
                    <span>•</span>
                    <span>{selectedStation.type === 'fountain' ? 'Public Fountain' : 'Refill Point'}</span>
                </div>
              </div>
              <button 
                onClick={() => onSelectStation(null)} 
                className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                <Icon name="close" size={24} />
              </button>
            </div>

            {/* Primary Action: Navigate */}
            <button 
                onClick={() => handleNavigate(selectedStation)}
                className="w-full h-14 mb-5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
                <Icon name="directions" filled />
                Navigate
            </button>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Status</div>
                    <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
                        <Icon name="check_circle" size={18} filled />
                        Working
                    </div>
                </div>
                 <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Amenities</div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        {selectedStation.amenities.cold && <Icon name="ac_unit" size={18} className="text-blue-400" />}
                        {selectedStation.amenities.dogFriendly && <Icon name="pets" size={18} className="text-slate-500" />}
                        {selectedStation.amenities.accessible && <Icon name="accessible" size={18} className="text-primary" />}
                    </div>
                </div>
            </div>

            {/* Access Notes */}
            {selectedStation.accessNotes && (
                <div className="mb-6">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">How to find it</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                        {selectedStation.accessNotes}
                    </p>
                </div>
            )}

            {/* Crowdsource Actions */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <p className="text-xs text-center text-slate-400 mb-3">Is this information correct?</p>
                <div className="flex gap-3">
                    <button className="flex-1 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                        ✅ Working
                    </button>
                    <button className="flex-1 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                        ❌ Broken
                    </button>
                </div>
            </div>

          </div>
        ) : (
          /* Collapsed Bottom Nav */
          <div className="bg-white dark:bg-slate-900 w-full pb-safe">
            <div className="flex justify-around py-3 border-t border-slate-100 dark:border-slate-800">
                <button className="flex flex-col items-center gap-1 text-primary w-full">
                    <Icon name="map" className="fill-current" filled />
                    <span className="text-xs font-medium">Map</span>
                </button>
                <button 
                    onClick={() => onChangeView('add_station')}
                    className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 w-full transition-colors"
                >
                    <Icon name="add_location_alt" />
                    <span className="text-xs font-medium">Add Point</span>
                </button>
            </div>
            <div className="h-safe-bottom"></div>
          </div>
        )}
      </div>
      <style>{`
        .h-safe-bottom { height: env(safe-area-inset-bottom, 20px); }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); }
      `}</style>
    </div>
  );
};