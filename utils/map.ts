import L from 'leaflet';

// Constants for marker styling
const MARKER_SIZE_DEFAULT = 40;
const MARKER_SIZE_SELECTED = 56;
const OFFSET_BOTTOM_SHEET = 180; // Pixels to offset the map center when a pin is selected

/**
 * Creates a custom HTML icon for stations.
 * Visual separation of concerns: Logic for how a marker looks lives here.
 */
export const createStationIcon = (type: string, isSelected: boolean, status: string) => {
  const isUnknown = status === 'unknown';
  const colorClass = isSelected ? 'bg-primary' : (isUnknown ? 'bg-slate-400' : 'bg-primary');
  // Visual state handling
  const opacityClass = isUnknown && !isSelected ? 'opacity-70' : 'opacity-100';
  const size = isSelected ? MARKER_SIZE_SELECTED : MARKER_SIZE_DEFAULT;
  const zIndex = isSelected ? 1000 : 1;

  // Accessible label handling could be added here if using generic divs, 
  // but Leaflet handles alt tags on markers separately.
  
  return L.divIcon({
    className: `custom-marker ${isSelected ? 'selected' : ''}`,
    html: `
      <div class="relative flex flex-col items-center justify-end group transition-all duration-300 ${opacityClass}" style="z-index: ${zIndex};">
         <div class="${isSelected ? 'w-14 h-14 border-[4px]' : 'w-10 h-10 border-2'} ${colorClass} text-white rounded-full rounded-bl-none transform rotate-[-45deg] flex items-center justify-center shadow-lg border-white dark:border-slate-900 transition-all">
            <span class="material-symbols-outlined transform rotate-[45deg]" style="font-size: ${isSelected ? '28px' : '20px'}">water_drop</span>
         </div>
         <div class="absolute -bottom-1 w-3 h-1.5 bg-black/20 rounded-full blur-[2px] ${isSelected ? 'scale-125' : 'scale-100'}"></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size], // Tip of the pin
    popupAnchor: [0, -size],
  });
};

/**
 * Creates a calm, neutral cluster icon.
 */
export const createClusterIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let size = 'small';
  if (count > 10) size = 'medium';
  if (count > 50) size = 'large';

  // size mapping
  const dim = count > 50 ? 50 : (count > 10 ? 40 : 32);

  return L.divIcon({
    html: `<span class="flex items-center justify-center w-full h-full text-white font-bold font-sans">${count}</span>`,
    className: `custom-cluster-icon cluster-${size}`,
    iconSize: L.point(dim, dim, true),
  });
};

/**
 * Calculates a new center point to accommodate UI overlays (like bottom sheets).
 * This keeps the logic pure and testable.
 */
export const calculateOffsetCenter = (map: L.Map, latlng: L.LatLng, pixelOffset: number = OFFSET_BOTTOM_SHEET): L.LatLng => {
  const point = map.project(latlng, map.getZoom());
  const newPoint = L.point(point.x, point.y + pixelOffset); // Move center down, so map moves up
  return map.unproject(newPoint, map.getZoom());
};
