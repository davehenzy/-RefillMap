export type ViewState = 'map' | 'add_station' | 'station_details' | 'filters';

export interface Coordinates {
  x: number;
  y: number;
}

export interface MapViewport {
  x: number;
  y: number;
  scale: number;
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
  rating: number;
  reviews: Review[];
  accessNotes?: string;
  image?: string;
  distance?: string;
}

export interface FilterState {
  freeOnly: boolean;
  publicAccess: boolean;
  indoor: boolean;
  outdoor: boolean;
}