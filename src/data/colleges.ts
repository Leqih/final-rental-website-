export interface College {
  id: string;
  name: string;
  short: string;
  emoji: string;
  building: string;
  color: string;
  textColor: string;
  majors: string[];
  // Real UIUC coordinates for the main building
  coords: [number, number]; // [lng, lat]
}

export const colleges: College[] = [
  {
    id: 'eng', name: 'Engineering', short: 'Grainger', emoji: '⚙️',
    building: 'Engineering Hall', color: 'bg-blue-100', textColor: 'text-blue-700',
    majors: ['CS', 'ECE', 'MechE', 'CEE', 'Aerospace'],
    coords: [-88.2265, 40.1118],
  },
  {
    id: 'bus', name: 'Gies Business', short: 'Gies', emoji: '📊',
    building: 'BIF', color: 'bg-emerald-100', textColor: 'text-emerald-700',
    majors: ['Finance', 'Accounting', 'MIS', 'Management'],
    coords: [-88.2298, 40.1025],
  },
  {
    id: 'las', name: 'LAS', short: 'LAS', emoji: '📚',
    building: 'Lincoln Hall', color: 'bg-purple-100', textColor: 'text-purple-700',
    majors: ['Psychology', 'Economics', 'Political Sci', 'English'],
    coords: [-88.2311, 40.1065],
  },
  {
    id: 'agr', name: 'ACES', short: 'ACES', emoji: '🌱',
    building: 'Mumford Hall', color: 'bg-lime-100', textColor: 'text-lime-700',
    majors: ['Agronomy', 'Food Sci', 'Landscape Arch'],
    coords: [-88.2257, 40.1030],
  },
  {
    id: 'med', name: 'Media', short: 'Media', emoji: '🎙️',
    building: 'Gregory Hall', color: 'bg-orange-100', textColor: 'text-orange-700',
    majors: ['Journalism', 'Advertising', 'Media Mgmt'],
    coords: [-88.2300, 40.1082],
  },
  {
    id: 'art', name: 'Fine & Applied Arts', short: 'FAA', emoji: '🎨',
    building: 'Krannert Art Center', color: 'bg-pink-100', textColor: 'text-pink-700',
    majors: ['Architecture', 'Art', 'Theatre', 'Music'],
    coords: [-88.2326, 40.1057],
  },
];
