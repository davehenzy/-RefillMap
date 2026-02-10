import { Station } from './types';

// Centered around London
export const LONDON_CENTER = { lat: 51.5074, lng: -0.1278 };

export const MOCK_STATIONS: Station[] = [
  {
    id: '1',
    name: 'Hyde Park Fountain',
    type: 'fountain',
    coordinates: { lat: 51.5072, lng: -0.1657 },
    address: 'Near Serpentine Gallery',
    status: 'working',
    isFree: true,
    amenities: {
      dogFriendly: true,
      cold: true,
      accessible: true,
    },
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1543336222-383792cb002c?q=80&w=1000&auto=format&fit=crop',
    distance: '0.2 miles',
    lastConfirmed: '2 hours ago',
    accessNotes: 'Located on the main path, visible from the gallery entrance.'
  },
  {
    id: '2',
    name: 'Trafalgar Square Tap',
    type: 'public_tap',
    coordinates: { lat: 51.5080, lng: -0.1281 },
    address: 'North East Corner',
    status: 'working',
    isFree: true,
    amenities: {
      dogFriendly: false,
      cold: false,
      accessible: true,
    },
    rating: 3.2,
    distance: '0.8 miles',
    lastConfirmed: '1 day ago',
    accessNotes: 'Small metal tap on the wall, easy to miss.'
  },
  {
    id: '3',
    name: 'British Library Filler',
    type: 'bottle_filler',
    coordinates: { lat: 51.5299, lng: -0.1277 },
    address: 'Main Lobby',
    status: 'working',
    isFree: true,
    amenities: {
      dogFriendly: false,
      cold: true,
      accessible: true,
    },
    rating: 4.8,
    distance: '1.5 miles',
    lastConfirmed: 'Just now',
    accessNotes: 'Inside the main entrance, security check required.'
  },
  {
    id: '4',
    name: 'Southbank Cafe',
    type: 'cafe',
    coordinates: { lat: 51.5065, lng: -0.1147 },
    address: 'Royal Festival Hall',
    status: 'working',
    isFree: true,
    amenities: {
      dogFriendly: false,
      cold: true,
      accessible: true,
    },
    rating: 4.0,
    distance: '1.0 miles',
    lastConfirmed: '5 days ago',
    accessNotes: 'Ask at the counter, they are very friendly about refills.'
  },
  {
    id: '5',
    name: 'Regents Park Hub',
    type: 'fountain',
    coordinates: { lat: 51.5290, lng: -0.1550 },
    address: 'Near The Hub',
    status: 'working',
    isFree: true,
    amenities: {
      dogFriendly: true,
      cold: false,
      accessible: true,
    },
    rating: 4.2,
    distance: '2.1 miles',
    lastConfirmed: '3 hours ago'
  }
];