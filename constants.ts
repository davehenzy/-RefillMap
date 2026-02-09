import { Station } from './types';

export const MOCK_STATIONS: Station[] = [
  {
    id: '1',
    name: 'Central Park Fountain',
    type: 'fountain',
    coordinates: { x: 60, y: 45 }, // Percentage based coordinates for simulation
    address: 'Near Sheep Meadow',
    status: 'working',
    isFree: true,
    amenities: {
      dogFriendly: true,
      cold: true,
      accessible: true,
    },
    rating: 4.5,
    reviews: [
      {
        id: 'r1',
        userName: 'Sarah Jenkins',
        rating: 5,
        text: 'Water is super cold and fresh! My dog loves the bowl attachment.',
        date: '2 days ago'
      },
      {
        id: 'r2',
        userName: 'Mike T.',
        rating: 4,
        text: 'Good pressure, easy to fill my 32oz bottle.',
        date: '1 week ago'
      }
    ],
    image: 'https://images.unsplash.com/photo-1543336222-383792cb002c?q=80&w=1000&auto=format&fit=crop',
    distance: '200m away'
  },
  {
    id: '2',
    name: 'Market Square Tap',
    type: 'public_tap',
    coordinates: { x: 30, y: 20 },
    address: 'Corner of 4th and Pike',
    status: 'working',
    isFree: true,
    amenities: {
      dogFriendly: false,
      cold: false,
      accessible: true,
    },
    rating: 3.2,
    reviews: [
      {
        id: 'r3',
        userName: 'City Walker',
        rating: 3,
        text: 'It works, but the water is a bit warm on sunny days.',
        date: '3 weeks ago'
      }
    ],
    distance: '0.8km away'
  },
  {
    id: '3',
    name: 'Library Bottle Filler',
    type: 'bottle_filler',
    coordinates: { x: 25, y: 65 },
    address: 'Main Lobby',
    status: 'working',
    isFree: true,
    amenities: {
      dogFriendly: false,
      cold: true,
      accessible: true,
    },
    rating: 4.8,
    reviews: [
      {
        id: 'r4',
        userName: 'Bookworm22',
        rating: 5,
        text: 'The best bottle filler in town. Sensor always works perfectly.',
        date: 'Yesterday'
      },
      {
        id: 'r5',
        userName: 'Alex',
        rating: 5,
        text: 'Clean and cold.',
        date: '1 month ago'
      }
    ],
    distance: '1.2km away'
  },
  {
    id: '4',
    name: 'TechHub Cafe',
    type: 'cafe',
    coordinates: { x: 75, y: 35 }, // Clustered logically
    address: '124 Innovation Dr',
    status: 'working',
    isFree: true,
    amenities: {
      dogFriendly: false,
      cold: true,
      accessible: true,
    },
    rating: 4.0,
    reviews: [],
    distance: '500m away'
  }
];
