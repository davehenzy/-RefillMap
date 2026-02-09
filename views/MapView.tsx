import React, { useState } from 'react';
import { Map } from '../components/Map';
import { Icon } from '../components/Icon';
import { Station, ViewState, MapViewport } from '../types';

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
  const [viewport, setViewport] = useState<MapViewport>({
    x: 0,
    y: 0,
    scale: 1.2
  });

  const handleZoomIn = () => {
    setViewport(prev => {
        const newScale = Math.min(prev.scale * 1.5, 8);
        return {
            ...prev,
            scale: newScale,
            // Simple zoom to center (approximated by keeping x/y relative, could be improved to zoom to center of screen)
            // For now, keeping x/y as is results in zoom to top-left.
            // Let's do a simple center zoom.
            // Actually, without container dimensions here, it's hard to zoom to center perfectly.
            // Let's just scale. The user can pan.
            // Better: Pass a flag to Map to animate? No, keep it controlled.
            // We'll just update scale.
        };
    });
  };

  const handleZoomOut = () => {
    setViewport(prev => ({
        ...prev,
        scale: Math.max(prev.scale / 1.5, 0.5)
    }));
  };

  return (
    <div className="relative h-full w-full flex flex-col">
      {/* Background Map */}
      <Map 
        stations={stations} 
        selectedStationId={selectedStation?.id || null}
        onStationSelect={onSelectStation}
        onMapClick={() => onSelectStation(null)}
        viewport={viewport}
        onViewportChange={setViewport}
      />

      {/* Floating Top UI */}
      <div className="relative z-30 w-full px-4 pt-4 pb-2 pointer-events-none">
        <div className="pointer-events-auto flex gap-3 items-center">
          <div className="flex-1 shadow-lg shadow-slate-200/50 dark:shadow-black/20 rounded-xl bg-white dark:bg-slate-900 transition-all focus-within:ring-2 focus-within:ring-primary/50">
            <label className="flex items-center h-12 w-full px-4 cursor-text">
              <Icon name="search" className="text-slate-400 mr-3" />
              <input 
                className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 h-full p-0 focus:ring-0 text-base" 
                placeholder="Find water nearby..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                <Icon name="mic" size={20} />
              </button>
            </label>
          </div>
          <button 
            onClick={() => onChangeView('filters')}
            className="h-12 w-12 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-lg shadow-slate-200/50 dark:shadow-black/20 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all"
          >
            <Icon name="tune" />
          </button>
        </div>

        {/* Quick Filters */}
        <div className="pointer-events-auto flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-2 pl-1">
          <button className="px-3 py-1.5 rounded-full bg-primary text-white text-sm font-medium shadow-md shadow-primary/20 flex items-center gap-1.5 whitespace-nowrap transition-colors">
            <Icon name="water_drop" size={18} />
            Drinking Water
          </button>
          <button className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-1.5 whitespace-nowrap hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Icon name="pets" size={18} />
            Dog Friendly
          </button>
          <button className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-1.5 whitespace-nowrap hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Icon name="ac_unit" size={18} className="text-blue-300" />
            Chilled
          </button>
          <button className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-1.5 whitespace-nowrap hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Icon name="accessible" size={18} />
            Accessible
          </button>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1 pointer-events-none"></div>

      {/* Floating Controls */}
      <div className="relative z-30 px-4 py-2 flex flex-col items-end gap-3 pointer-events-none mb-4">
        <div className="pointer-events-auto flex flex-col bg-white dark:bg-slate-900 rounded-lg shadow-lg shadow-slate-200/50 dark:shadow-black/20 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          <button 
            onClick={handleZoomIn}
            className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Icon name="add" className="block" />
          </button>
          <button 
            onClick={handleZoomOut}
            className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Icon name="remove" className="block" />
          </button>
        </div>
        <button className="pointer-events-auto h-14 w-14 flex items-center justify-center rounded-full bg-white dark:bg-slate-900 text-primary shadow-lg shadow-slate-200/50 dark:shadow-black/20 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all">
          <Icon name="my_location" className="text-2xl" />
        </button>
      </div>

      {/* Bottom Sheet */}
      <div className={`relative z-40 bg-white dark:bg-slate-900 rounded-t-2xl shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] dark:shadow-black/40 transition-transform duration-300 ease-out transform ${selectedStation ? 'translate-y-0' : 'translate-y-[calc(100%-80px)]'}`}>
        {/* Drag Handle */}
        <div className="w-full flex justify-center pt-3 pb-1" onClick={() => onSelectStation(null)}>
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        </div>

        {selectedStation ? (
          <div className="px-5 pb-2 pt-2 cursor-pointer" onClick={() => onChangeView('station_details')}>
             <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{selectedStation.name}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Free Public Water • Open 24/7</p>
              </div>
              <div className="flex gap-2">
                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                  <Icon name="share" className="text-xl" />
                </button>
                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <Icon name="directions" className="text-xl" />
                </button>
              </div>
            </div>
            <div className="flex gap-4 mt-4 py-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Icon name="check_circle" className="text-green-500 text-lg" filled />
                <span>Working</span>
              </div>
              {selectedStation.amenities.cold && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Icon name="ac_unit" className="text-blue-400 text-lg" />
                  <span>Cold</span>
                </div>
              )}
               {selectedStation.amenities.dogFriendly && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Icon name="pets" className="text-slate-400 text-lg" />
                  <span>Dog Bowl</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-2"></div> /* Spacer when closed to align nav */
        )}
       

        {/* Bottom Navigation */}
        <div className="flex justify-around border-t border-slate-100 dark:border-slate-800 py-3 mt-1 bg-white dark:bg-slate-900">
          <button className="flex flex-col items-center gap-1 text-primary w-full">
            <Icon name="map" className="fill-current" filled />
            <span className="text-xs font-medium">Map</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 w-full transition-colors">
            <Icon name="format_list_bulleted" />
            <span className="text-xs font-medium">List</span>
          </button>
          <button 
            onClick={() => onChangeView('add_station')}
            className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 w-full transition-colors"
          >
            <Icon name="add_location_alt" />
            <span className="text-xs font-medium">Contribute</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 w-full transition-colors">
            <Icon name="settings" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
        <div className="h-safe-bottom w-full"></div>
      </div>
    </div>
  );
};
