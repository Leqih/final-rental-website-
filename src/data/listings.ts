export const imgDean    = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80";
export const imgGrn     = "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80";
export const imgHere    = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80";
export const imgFeat    = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80";
export const imgSunrise = "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80";
export const imgGoodwin = "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80";
export const imgSpring  = "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80";
export const imgOrchard = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80";

export interface Listing {
  id: number;
  img: string;
  price: number;
  name: string;
  beds: string;
  badge: string;
  badgeColor: string;
  desc: string;
  address: string;
  sqft: string;
  floor: string;
  available: string;
  amenities: string[];
  landlord: string;
  phone: string;
  walkFrom: Record<string, number>;
  pins: Record<string, { x: number; y: number }>;
}

export const listings: Listing[] = [
  {
    id: 1,
    img: imgDean,
    price: 850,
    name: 'The Dean Apartments',
    beds: '2B1B',
    badge: 'Verified',
    badgeColor: 'bg-[rgba(111,207,151,0.92)] text-[#1c1c1e]',
    desc: 'Close to engineering buildings with strong student reviews. Modern finishes, in-unit laundry, and rooftop lounge. A top pick for Grainger students who want quality without going downtown.',
    address: '1011 S First St',
    sqft: '820 sqft',
    floor: 'Floor 3 of 6',
    available: 'Aug 2026',
    amenities: ['In-unit laundry', 'Rooftop deck', 'Gym', 'Study rooms', 'Pet friendly', 'Bike storage', 'Package lockers', 'High-speed Wi-Fi'],
    landlord: 'Green Street Properties',
    phone: '(217) 555-0110',
    walkFrom: { eng: 8, bus: 14, las: 10, agr: 18, med: 11, art: 13 },
    pins: { all: { x: 28, y: 38 }, green: { x: 35, y: 42 }, first: { x: 55, y: 40 }, south: { x: 30, y: 50 }, downtown: { x: 40, y: 45 } },
  },
  {
    id: 2,
    img: imgGrn,
    price: 720,
    name: 'Green Street Lofts',
    beds: 'Studio',
    badge: 'Budget',
    badgeColor: 'bg-amber-100 text-amber-800',
    desc: 'Budget-friendly studio right on the main strip. Great for LAS and Media students who want to be in the heart of campus life. Updated kitchen, hardwood floors, exposed brick.',
    address: '302 E Green St',
    sqft: '490 sqft',
    floor: 'Floor 2 of 4',
    available: 'Aug 2026',
    amenities: ['Hardwood floors', 'Exposed brick', 'Updated kitchen', 'Rooftop access', 'Coin laundry', 'Near bus stop'],
    landlord: 'UIUC Housing Co.',
    phone: '(217) 555-0202',
    walkFrom: { eng: 14, bus: 10, las: 7, agr: 20, med: 6, art: 9 },
    pins: { all: { x: 58, y: 55 }, green: { x: 60, y: 45 }, first: { x: 38, y: 55 }, south: { x: 52, y: 60 }, downtown: { x: 55, y: 40 } },
  },
  {
    id: 3,
    img: imgHere,
    price: 910,
    name: 'HERE Champaign',
    beds: '1B1B',
    badge: 'Verified',
    badgeColor: 'bg-[rgba(111,207,151,0.92)] text-[#1c1c1e]',
    desc: 'Premium amenities and the shortest walk to campus. Popular with Gies students. Resort-style pool, private study pods, and fully furnished options available.',
    address: '512 E Green St',
    sqft: '680 sqft',
    floor: 'Floor 5 of 12',
    available: 'Jul 2026',
    amenities: ['Resort pool', 'Private study pods', 'Fully furnished option', 'Concierge', 'Rooftop sky lounge', 'EV charging', 'Dog wash station', 'Yoga studio'],
    landlord: 'HERE Living',
    phone: '(217) 555-0303',
    walkFrom: { eng: 9, bus: 6, las: 11, agr: 16, med: 8, art: 10 },
    pins: { all: { x: 70, y: 22 }, green: { x: 72, y: 32 }, first: { x: 68, y: 28 }, south: { x: 65, y: 30 }, downtown: { x: 70, y: 30 } },
  },
  {
    id: 4,
    img: imgFeat,
    price: 780,
    name: 'Illini Tower',
    beds: '1B1B',
    badge: 'Near Quad',
    badgeColor: 'bg-purple-100 text-purple-700',
    desc: 'Steps from Lincoln Hall and the Main Quad. Perfect for LAS students who want to roll out of bed and be on campus. Quiet floors available, great community vibe.',
    address: '409 E Chalmers St',
    sqft: '600 sqft',
    floor: 'Floor 4 of 10',
    available: 'Aug 2026',
    amenities: ['Quiet floors', 'Study lounge', 'Laundry in building', 'Courtyard', 'Near Quad', 'MTD bus stop'],
    landlord: 'Illini Tower LLC',
    phone: '(217) 555-0404',
    walkFrom: { eng: 12, bus: 15, las: 4, agr: 14, med: 7, art: 6 },
    pins: { all: { x: 45, y: 60 }, green: { x: 48, y: 60 }, first: { x: 44, y: 62 }, south: { x: 42, y: 35 }, downtown: { x: 45, y: 55 } },
  },
  {
    id: 5,
    img: imgSunrise,
    price: 650,
    name: 'Sunrise Suites',
    beds: 'Studio',
    badge: 'Best Value',
    badgeColor: 'bg-sky-100 text-sky-700',
    desc: 'Unbeatable price for a well-maintained studio near Goodwin Ave. Short bike ride to ECE and Siebel. Quiet building, responsive landlord, and fast internet.',
    address: '607 S Goodwin Ave',
    sqft: '440 sqft',
    floor: 'Floor 1 of 3',
    available: 'Aug 2026',
    amenities: ['High-speed Wi-Fi', 'On-site laundry', 'Bike storage', 'Near bus stop', 'Air conditioning', 'Water included'],
    landlord: 'Goodwin Properties',
    phone: '(217) 555-0505',
    walkFrom: { eng: 6, bus: 9, las: 13, agr: 17, med: 8, art: 15 },
    pins: { all: { x: 62, y: 42 }, green: { x: 65, y: 38 }, first: { x: 58, y: 44 }, south: { x: 60, y: 48 }, downtown: { x: 62, y: 35 } },
  },
  {
    id: 6,
    img: imgGoodwin,
    price: 1050,
    name: 'Chalmers Court',
    beds: '2B2B',
    badge: 'Premium',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    desc: 'Spacious two-bed two-bath ideal for roommates. Steps from the Art + Design building and Krannert. In-unit washer/dryer, private balconies, and underground parking.',
    address: '502 W Chalmers St',
    sqft: '1020 sqft',
    floor: 'Floor 2 of 5',
    available: 'Jul 2026',
    amenities: ['In-unit washer/dryer', 'Private balcony', 'Underground parking', 'Gym', 'Smart lock', 'Package room', 'Dishwasher', 'Pet friendly'],
    landlord: 'Campus Realty Group',
    phone: '(217) 555-0606',
    walkFrom: { eng: 10, bus: 13, las: 6, agr: 12, med: 9, art: 5 },
    pins: { all: { x: 32, y: 52 }, green: { x: 30, y: 55 }, first: { x: 36, y: 50 }, south: { x: 35, y: 58 }, downtown: { x: 30, y: 50 } },
  },
  {
    id: 7,
    img: imgSpring,
    price: 760,
    name: 'Springfield Commons',
    beds: '1B1B',
    badge: 'Quiet Area',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    desc: 'Calm residential street minutes from Gies Business and the Main Quad. Renovated kitchen and bath, large closets, and a great common courtyard. Very walkable.',
    address: '114 W Springfield Ave',
    sqft: '580 sqft',
    floor: 'Floor 2 of 3',
    available: 'Aug 2026',
    amenities: ['Renovated kitchen', 'Large closets', 'Courtyard', 'Laundry in building', 'Near bus stop', 'Utilities included'],
    landlord: 'Springfield Housing LLC',
    phone: '(217) 555-0707',
    walkFrom: { eng: 16, bus: 8, las: 9, agr: 10, med: 12, art: 7 },
    pins: { all: { x: 20, y: 30 }, green: { x: 22, y: 28 }, first: { x: 18, y: 32 }, south: { x: 22, y: 35 }, downtown: { x: 20, y: 28 } },
  },
  {
    id: 8,
    img: imgOrchard,
    price: 920,
    name: 'Orchard Downs',
    beds: '2B1B',
    badge: 'Family Friendly',
    badgeColor: 'bg-orange-100 text-orange-700',
    desc: 'Spacious two-bedroom near the Agriculture campus and south research park. Great for grad students or pairs. Includes parking, large yard, and on-site management.',
    address: '2002 Orchard Downs Dr',
    sqft: '890 sqft',
    floor: 'Ground floor',
    available: 'Aug 2026',
    amenities: ['Private parking', 'Large yard', 'On-site management', 'Dishwasher', 'Central A/C', 'Pet friendly', 'Storage unit', 'Near research park'],
    landlord: 'UIUC Family Housing',
    phone: '(217) 555-0808',
    walkFrom: { eng: 18, bus: 20, las: 16, agr: 7, med: 13, art: 20 },
    pins: { all: { x: 55, y: 75 }, green: { x: 52, y: 72 }, first: { x: 58, y: 74 }, south: { x: 54, y: 80 }, downtown: { x: 55, y: 72 } },
  },
];
