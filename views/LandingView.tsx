import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface LandingViewProps {
  onFindWater: () => void;
  onAddPoint: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onFindWater, onAddPoint }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFindClick = () => {
    setIsLoading(true);
    // Request permission but move to map immediately for perceived speed
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            () => { /* Access granted silently */ },
            () => { /* Access denied silently */ }
        );
    }
    // Instant transition
    onFindWater();
  };

  return (
    <div className="h-full w-full bg-background-light dark:bg-background-dark flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
        
        {/* Hero Icon/Image */}
        <div className="mb-8 relative">
            <div className="w-24 h-24 bg-gradient-to-tr from-primary to-blue-400 rounded-3xl rotate-12 flex items-center justify-center shadow-xl shadow-primary/20">
                <Icon name="water_drop" className="text-white text-5xl -rotate-12" filled />
            </div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white dark:bg-surface-dark rounded-xl flex items-center justify-center shadow-lg rotate-6 animate-bounce">
                 <Icon name="location_on" className="text-red-500 text-2xl" filled />
            </div>
        </div>

        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
          RefillMap
        </h1>
        
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
          Find free drinking water near you
        </h2>
        
        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-lg leading-relaxed mb-10">
          Refill your bottle at verified public water points across the UK.
        </p>

        <div className="w-full max-w-xs space-y-4">
            <button 
                onClick={handleFindClick}
                className="w-full h-14 bg-primary hover:bg-primary-dark text-white text-lg font-bold rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
                <Icon name="near_me" />
                Find water near me
            </button>

            <button 
                onClick={onAddPoint}
                className="w-full h-14 bg-white dark:bg-surface-dark border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white text-lg font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
                <Icon name="add_location_alt" className="text-primary" />
                Add a water point
            </button>
        </div>
      </div>

      <div className="p-6 text-center">
        <p className="text-xs text-slate-400 dark:text-slate-500">
            By using RefillMap, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
};