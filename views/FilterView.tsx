import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { FilterState } from '../types';

interface FilterViewProps {
  currentFilters: FilterState;
  onApply: (filters: FilterState) => void;
  onClose: () => void;
}

export const FilterView: React.FC<FilterViewProps> = ({ currentFilters, onApply, onClose }) => {
  const [filters, setFilters] = useState<FilterState>(currentFilters);

  const toggleFilter = (key: keyof FilterState) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters: FilterState = {
        freeOnly: true,
        publicAccess: false,
        indoor: false,
        outdoor: false
    };
    setFilters(defaultFilters);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-background-dark rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom-10 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Handle */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden" onClick={onClose}>
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Filter Stations</h2>
            <button 
                onClick={handleReset}
                className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
                Reset
            </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
            {/* Free Only */}
            <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark cursor-pointer hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                        <Icon name="water_drop" filled />
                    </div>
                    <div>
                        <div className="font-semibold text-slate-900 dark:text-white">Free only</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Show only free stations</div>
                    </div>
                </div>
                <div className="relative flex items-center">
                    <input 
                        type="checkbox" 
                        checked={filters.freeOnly}
                        onChange={() => toggleFilter('freeOnly')}
                        className="w-6 h-6 rounded border-slate-300 text-primary focus:ring-primary" 
                    />
                </div>
            </label>

            {/* Public Access */}
            <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark cursor-pointer hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                        <Icon name="public" />
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white">Public access</div>
                </div>
                <input 
                    type="checkbox" 
                    checked={filters.publicAccess}
                    onChange={() => toggleFilter('publicAccess')}
                    className="w-6 h-6 rounded border-slate-300 text-primary focus:ring-primary" 
                />
            </label>

             {/* Indoor */}
             <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark cursor-pointer hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                        <Icon name="apartment" />
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white">Indoor</div>
                </div>
                <input 
                    type="checkbox" 
                    checked={filters.indoor}
                    onChange={() => toggleFilter('indoor')}
                    className="w-6 h-6 rounded border-slate-300 text-primary focus:ring-primary" 
                />
            </label>

             {/* Outdoor */}
             <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark cursor-pointer hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                        <Icon name="park" />
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white">Outdoor</div>
                </div>
                <input 
                    type="checkbox" 
                    checked={filters.outdoor}
                    onChange={() => toggleFilter('outdoor')}
                    className="w-6 h-6 rounded border-slate-300 text-primary focus:ring-primary" 
                />
            </label>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800">
            <button 
                onClick={handleApply}
                className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
                Apply Filters
            </button>
        </div>
      </div>
    </div>
  );
};