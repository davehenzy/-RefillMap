import React, { useRef, useState, useEffect } from 'react';
import { Station, MapViewport } from '../types';
import { Icon } from './Icon';

interface MapProps {
  stations: Station[];
  selectedStationId: string | null;
  onStationSelect: (station: Station) => void;
  onMapClick: () => void;
  viewport: MapViewport;
  onViewportChange: (viewport: MapViewport) => void;
}

export const Map: React.FC<MapProps> = ({ 
  stations, 
  selectedStationId, 
  onStationSelect, 
  onMapClick,
  viewport,
  onViewportChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!containerRef.current) return;

    const scaleSensitivity = 0.001;
    const delta = -e.deltaY * scaleSensitivity;
    const newScale = Math.min(Math.max(viewport.scale * Math.exp(delta), 0.5), 8);

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate new position to zoom towards mouse
    const scaleChange = newScale / viewport.scale;
    const newX = mouseX - (mouseX - viewport.x) * scaleChange;
    const newY = mouseY - (mouseY - viewport.y) * scaleChange;

    onViewportChange({
      scale: newScale,
      x: newX,
      y: newY
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastPosition.current.x;
    const deltaY = e.clientY - lastPosition.current.y;
    
    lastPosition.current = { x: e.clientX, y: e.clientY };
    
    onViewportChange({
      ...viewport,
      x: viewport.x + deltaX,
      y: viewport.y + deltaY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for panning
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      lastPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    
    // Prevent scrolling
    // e.preventDefault(); // Note: might need passive: false listener for full prevention

    const deltaX = e.touches[0].clientX - lastPosition.current.x;
    const deltaY = e.touches[0].clientY - lastPosition.current.y;
    
    lastPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    
    onViewportChange({
      ...viewport,
      x: viewport.x + deltaX,
      y: viewport.y + deltaY
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Attach non-passive wheel listener to prevent browser zoom logic if needed
  // React's onWheel is passive by default in some browsers, but usually fine for this.
  // We'll rely on React event system for now.

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 z-0 bg-slate-200 dark:bg-slate-800 overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} touch-none`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Interactive map"
    >
      {/* Movable Map Layer */}
      <div 
        className="map-pattern w-full h-full origin-top-left will-change-transform"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
        }}
        onClick={onMapClick}
      >
        {/* Simulated Map Elements */}
        <svg className="w-full h-full absolute inset-0 text-white dark:text-slate-700 opacity-60 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          {/* River */}
          <path className="dark:stroke-slate-600" d="M-100,300 C100,280 300,350 500,320 S800,200 1200,250" fill="none" stroke="#a5b4fc" strokeWidth="40"></path>
          {/* Park */}
          <path className="dark:fill-slate-700/50" d="M600,100 L800,100 L850,250 L650,300 Z" fill="#dcfce7"></path>
          {/* Major Roads */}
          <line stroke="currentColor" strokeWidth="12" x1="0" x2="1000" y1="150" y2="150"></line>
          <line stroke="currentColor" strokeWidth="12" x1="200" x2="200" y1="0" y2="1000"></line>
          <line stroke="currentColor" strokeWidth="8" x1="0" x2="1000" y1="550" y2="550"></line>
          <line stroke="currentColor" strokeWidth="8" x1="600" x2="600" y1="0" y2="1000"></line>
        </svg>

        {/* User Location */}
        <div className="absolute top-[55%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute w-full h-full bg-primary/30 rounded-full user-location-ring"></div>
            <div 
                className="w-4 h-4 bg-primary border-2 border-white dark:border-background-dark rounded-full shadow-sm user-location-dot z-10"
                style={{ transform: `scale(${1 / Math.sqrt(viewport.scale)})` }} // Keep relatively constant size
            ></div>
            {/* View cone */}
            <div className="absolute w-24 h-24 bg-gradient-to-t from-primary/20 to-transparent rounded-full transform rotate-45 -top-8 opacity-0"></div>
          </div>
        </div>

        {/* Pins */}
        {stations.map((station) => {
          const isSelected = selectedStationId === station.id;
          return (
            <div
                key={station.id}
                className="absolute z-10 flex flex-col items-center justify-end group focus:outline-none"
                style={{ 
                    top: `${station.coordinates.y}%`, 
                    left: `${station.coordinates.x}%`,
                    // Counter-scale the marker container so it stays the same visual size
                    transform: `translate(-50%, -100%) scale(${1 / viewport.scale})`,
                    transformOrigin: 'bottom center',
                    zIndex: isSelected ? 50 : 10
                }}
            >
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onStationSelect(station);
                    }}
                    className={`
                        relative flex flex-col items-center transition-transform duration-200
                        ${isSelected ? 'scale-110' : 'hover:scale-110'}
                    `}
                >
                    {isSelected && (
                        <div className="bg-white dark:bg-background-dark text-slate-800 dark:text-white px-3 py-1.5 rounded-lg shadow-md mb-2 text-xs font-semibold whitespace-nowrap opacity-100 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        {station.name}
                        </div>
                    )}
                    
                    <div 
                        className={`
                        ${isSelected ? 'w-12 h-12 border-[3px]' : 'w-10 h-10 border-2'}
                        bg-primary text-white rounded-full rounded-bl-none transform rotate-[-45deg] 
                        flex items-center justify-center shadow-lg border-white dark:border-background-dark
                        transition-all duration-300
                        `}
                    >
                        <Icon 
                        name="water_drop" 
                        className={`transform rotate-[45deg] ${isSelected ? 'text-2xl' : 'text-xl'}`} 
                        />
                    </div>
                    <div className={`absolute -bottom-1 ${isSelected ? 'w-3 h-1.5' : 'w-2 h-1'} bg-black/20 rounded-full blur-[2px]`}></div>
                </button>
            </div>
          );
        })}

        {/* Cluster Simulation */}
        <div 
            className="absolute top-[35%] left-[75%] z-10"
            style={{
                transform: `translate(-50%, -100%) scale(${1 / viewport.scale})`,
                transformOrigin: 'bottom center'
            }}
        >
            <button className="group transform hover:scale-110 transition-transform duration-200 focus:outline-none">
                <div className="relative flex flex-col items-center">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-background-dark font-bold text-sm">
                    3
                </div>
                </div>
            </button>
        </div>

      </div>
    </div>
  );
};
