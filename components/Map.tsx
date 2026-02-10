import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { Station, Coordinates } from '../types';
import { LONDON_CENTER } from '../constants';
import { createStationIcon, createClusterIcon, calculateOffsetCenter } from '../utils/map';

interface MapProps {
  stations?: Station[];
  selectedStationId?: string | null;
  onStationSelect?: (station: Station) => void;
  onMapClick?: () => void;
  interactive?: boolean;
  center?: Coordinates;
  onLocationSelect?: (coords: Coordinates) => void;
}

// --- Sub-components for Separation of Concerns ---

// 1. User Location Logic
const UserLocationMarker = () => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMap();

  useEffect(() => {
    // Only locate once on mount to avoid battery drain / constant re-centering
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      // Optional: Fly to user only if no station is selected initially
      // map.flyTo(e.latlng, 15); 
    });
  }, [map]);

  if (position === null) return null;

  const userIcon = L.divIcon({
    className: 'custom-user-location',
    html: `
      <div class="relative w-4 h-4">
        <div class="absolute w-full h-full bg-primary border-2 border-white dark:border-slate-900 rounded-full shadow-sm z-10"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary/20 rounded-full animate-pulse z-0"></div>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  return <Marker position={position} icon={userIcon} interactive={false} />;
};

// 2. Map Event Handler & Bounds Manager
// This component manages the "view" of the map and reports back bounds for optimization
interface MapEventsProps {
  onBoundsChange: (bounds: L.LatLngBounds) => void;
  onMapClick?: () => void;
}

const MapEvents: React.FC<MapEventsProps> = ({ onBoundsChange, onMapClick }) => {
  const map = useMapEvents({
    moveend: () => {
      onBoundsChange(map.getBounds());
    },
    click: () => {
      if (onMapClick) onMapClick();
    },
    load: () => {
        onBoundsChange(map.getBounds());
    }
  });

  // Trigger initial bounds
  useEffect(() => {
    onBoundsChange(map.getBounds());
  }, [map, onBoundsChange]);

  return null;
};

// 3. Map Controller
// Handles imperative commands (flyTo, fitBounds) based on prop changes
interface MapControllerProps {
  selectedStation: Station | null;
}

const MapController: React.FC<MapControllerProps> = ({ selectedStation }) => {
    const map = useMap();
    const previousStationId = useRef<string | null>(null);

    useEffect(() => {
        if (selectedStation && selectedStation.id !== previousStationId.current) {
            // "Slightly pan map upward" logic
            const latLng = new L.LatLng(selectedStation.coordinates.lat, selectedStation.coordinates.lng);
            const targetCenter = calculateOffsetCenter(map, latLng, 150); // 150px offset for bottom sheet

            map.flyTo(targetCenter, 16, {
                animate: true,
                duration: 0.8,
                easeLinearity: 0.25
            });
            previousStationId.current = selectedStation.id;
        } else if (!selectedStation) {
            previousStationId.current = null;
        }
    }, [selectedStation, map]);

    return null;
};

// --- Main Component ---

export const Map: React.FC<MapProps> = ({ 
  stations = [], 
  selectedStationId, 
  onStationSelect, 
  onMapClick,
  interactive = true,
  center = LONDON_CENTER,
  onLocationSelect
}) => {
  
  // State for performance optimization
  // We only render markers that are roughly within view to keep the DOM light
  const [visibleBounds, setVisibleBounds] = useState<L.LatLngBounds | null>(null);
  
  // Debounce the bounds update to prevent excessive filtering during panning
  const handleBoundsChange = useCallback((bounds: L.LatLngBounds) => {
    // Simple debounce could be added here if needed, but React's batching helps
    // For now, we update immediately on moveend (which is already "debounced" by leaflet)
    setVisibleBounds(bounds);
  }, []);

  // Filter stations based on visibility
  // If stations array is massive (>1000), this is crucial. 
  // For small civic apps, it helps with mobile battery life.
  const visibleStations = useMemo(() => {
    if (!visibleBounds) return stations;
    // Add a buffer to the bounds so markers don't "pop" in at the edges
    const paddedBounds = visibleBounds.pad(0.5); 
    return stations.filter(s => 
      paddedBounds.contains({ lat: s.coordinates.lat, lng: s.coordinates.lng })
    );
  }, [stations, visibleBounds]);

  const selectedStation = useMemo(() => 
    stations.find(s => s.id === selectedStationId) || null, 
  [stations, selectedStationId]);

  return (
    <div className="w-full h-full relative z-0 bg-background-light dark:bg-background-dark">
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={14} 
        minZoom={5}
        maxZoom={18}
        scrollWheelZoom={interactive}
        zoomControl={false}
        dragging={interactive}
        doubleClickZoom={interactive}
        className="w-full h-full outline-none"
        // Ensure map instance is preserved
        placeholder={<div className="w-full h-full bg-slate-100 dark:bg-slate-900 animate-pulse" />}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {interactive && <UserLocationMarker />}
        {interactive && <MapController selectedStation={selectedStation} />}
        
        <MapEvents 
            onBoundsChange={handleBoundsChange} 
            onMapClick={onMapClick} 
        />

        {/* 
          Location Picker Mode 
          (If onLocationSelect is present, we don't render normal markers) 
        */}
        {onLocationSelect ? (
            <LocationPickerOverlay onSelect={onLocationSelect} />
        ) : (
            /* Marker Clustering Configuration */
            <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={createClusterIcon}
                maxClusterRadius={60} // Tighter clusters
                spiderfyOnMaxZoom={true}
                showCoverageOnHover={false}
                disableClusteringAtZoom={15} // "Disable clustering when zoom >= 15"
                polygonOptions={{
                    fillColor: 'transparent',
                    color: 'transparent',
                    opacity: 0,
                    fillOpacity: 0
                }}
            >
                {visibleStations.map(station => (
                    <Marker
                        key={station.id}
                        position={[station.coordinates.lat, station.coordinates.lng]}
                        icon={createStationIcon(
                            station.type, 
                            selectedStationId === station.id, 
                            station.status
                        )}
                        zIndexOffset={selectedStationId === station.id ? 1000 : 0}
                        eventHandlers={{
                            click: (e) => {
                                L.DomEvent.stopPropagation(e);
                                onStationSelect?.(station);
                            },
                        }}
                    />
                ))}
            </MarkerClusterGroup>
        )}
      </MapContainer>
    </div>
  );
};

// Helper for the location picker mode
const LocationPickerOverlay = ({ onSelect }: { onSelect: (coords: Coordinates) => void }) => {
    useMapEvents({
        click(e) {
            onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
    });
    return null;
};
