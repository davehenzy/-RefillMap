export type ViewState = 'landing' | 'map' | 'add_station' | 'filters';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapViewport {
  center: Coordinates;
  zoom: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  text: string;
  date: string;
}

export interface Station {
  id: string;
  name: string;
  type: 'fountain' | 'bottle_filler' | 'cafe' | 'public_tap';
  coordinates: Coordinates;
  address: string;
  status: 'working' | 'broken' | 'unknown';
  isFree: boolean;
  amenities: {
    dogFriendly: boolean;
    cold: boolean;
    accessible: boolean;
  };
  rating?: number; // Optional, kept for simple star display if needed
  accessNotes?: string;
  image?: string;
  distance?: string;
  lastConfirmed?: string;
  reviews?: Review[];
}

export interface FilterState {
  freeOnly: boolean;
  publicAccess: boolean;
  indoor: boolean;
  outdoor: boolean;
}