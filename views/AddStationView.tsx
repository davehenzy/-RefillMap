import React, { useState } from 'react';
import { ViewState, Coordinates } from '../types';
import { Icon } from '../components/Icon';
import { Map } from '../components/Map';
import { LONDON_CENTER } from '../constants';

interface AddStationViewProps {
  onClose: () => void;
}

export const AddStationView: React.FC<AddStationViewProps> = ({ onClose }) => {
  const [pickedLocation, setPickedLocation] = useState<Coordinates>(LONDON_CENTER);
  const [mapPickerMode, setMapPickerMode] = useState(false);

  const handleLocationSelect = (coords: Coordinates) => {
    setPickedLocation(coords);
    setMapPickerMode(false);
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
            <button 
                onClick={onClose}
                aria-label="Cancel" 
                className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors" type="button"
            >
                <Icon name="close" size={24} />
            </button>
            <h1 className="text-base font-bold text-slate-900 dark:text-white">Add Water Point</h1>
            <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full p-4 pb-24 flex flex-col gap-6 overflow-y-auto">
        {/* Location Section */}
        <section>
            <div className="flex items-center gap-2 mb-3">
                <Icon name="my_location" className="text-primary" size={20} filled />
                <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Location</h2>
            </div>
            <div className="bg-surface dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Map Visual / Picker Trigger */}
                <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-800 group">
                    <div className="absolute inset-0 z-0">
                         {/* Static preview or interactive mini-map */}
                         <Map 
                            interactive={false} 
                            center={pickedLocation} 
                            stations={[]}
                         />
                    </div>
                    
                    {/* Pin Overlay */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <div className="relative">
                            <Icon name="location_on" className="text-primary text-[40px] drop-shadow-md" filled />
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-1.5 bg-black/20 rounded-full blur-[2px]"></div>
                        </div>
                    </div>

                    {/* Overlay Button */}
                    <button 
                        onClick={() => setMapPickerMode(true)}
                        className="absolute bottom-3 right-3 bg-surface dark:bg-surface-dark text-slate-700 dark:text-slate-200 p-2 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 text-xs font-medium flex items-center gap-1 active:scale-95 transition-transform z-20"
                    >
                        <Icon name="edit_location" size={16} />
                        Edit Location
                    </button>
                </div>
                {/* Address */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Coordinates</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-mono">
                        {pickedLocation.lat.toFixed(4)}, {pickedLocation.lng.toFixed(4)}
                    </p>
                </div>
            </div>
        </section>

        {/* Details Section */}
        <section>
            <div className="flex items-center gap-2 mb-3">
                <Icon name="water_drop" className="text-primary" size={20} filled />
                <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Details</h2>
            </div>
            <div className="bg-surface dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 space-y-5">
                {/* Point Type */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="point-type">Point Type</label>
                    <div className="relative">
                        <select className="w-full h-12 pl-4 pr-10 rounded-lg bg-background-light dark:bg-background-dark border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-base appearance-none" id="point-type">
                            <option disabled selected value="">Select type...</option>
                            <option value="fountain">Public Fountain</option>
                            <option value="bottle_filler">Bottle Filler</option>
                            <option value="cafe">Cafe / Restaurant (Friendly)</option>
                            <option value="tap">Tap (Park/Outdoor)</option>
                            <option value="spring">Natural Spring</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500 dark:text-slate-400">
                            <Icon name="expand_more" />
                        </div>
                    </div>
                </div>

                {/* Is it free Toggle */}
                <div className="flex items-center justify-between py-1">
                    <div className="flex flex-col">
                        <span className="text-base font-medium text-slate-900 dark:text-white">Is it free?</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Can anyone refill without paying?</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-success/50 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-success"></div>
                    </label>
                </div>
                
                <hr className="border-slate-100 dark:border-slate-800" />

                {/* Access Notes */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="access-notes">
                        Access Notes <span className="text-slate-400 font-normal ml-1">(Optional)</span>
                    </label>
                    <textarea 
                        className="w-full p-4 rounded-lg bg-background-light dark:bg-background-dark border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-base resize-none" 
                        id="access-notes" 
                        placeholder="E.g. Inside the lobby, ask staff, or near the restrooms..." 
                        rows={3}
                    ></textarea>
                </div>
            </div>
        </section>
      </main>

      {/* Footer Action */}
      <div className="fixed bottom-0 left-0 w-full bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 safe-area-pb z-20">
        <div className="max-w-md mx-auto">
            <button 
                onClick={onClose}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold h-14 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg"
            >
                <Icon name="add_location_alt" />
                Submit Point
            </button>
        </div>
      </div>
      <style>{`
        .safe-area-pb {
            padding-bottom: env(safe-area-inset-bottom, 20px);
        }
      `}</style>

      {/* Full Screen Map Picker Modal */}
      {mapPickerMode && (
          <div className="fixed inset-0 z-50 bg-background-light dark:bg-background-dark flex flex-col">
               <div className="absolute top-4 left-4 z-20">
                   <button onClick={() => setMapPickerMode(false)} className="bg-white dark:bg-surface-dark p-2 rounded-full shadow-lg text-slate-600">
                       <Icon name="arrow_back" />
                   </button>
               </div>
               <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/90 dark:bg-surface-dark/90 backdrop-blur px-4 py-2 rounded-full shadow-lg pointer-events-none">
                   <p className="text-sm font-semibold text-slate-900 dark:text-white">Tap to set location</p>
               </div>
               <div className="flex-1 relative">
                   <Map 
                       interactive={true}
                       center={pickedLocation}
                       onLocationSelect={handleLocationSelect}
                       onMapClick={() => {}} 
                       stations={[]}
                   />
               </div>
          </div>
      )}

    </div>
  );
};