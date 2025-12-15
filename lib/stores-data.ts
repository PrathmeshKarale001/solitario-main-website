// All Solitario store locations with coordinates for geolocation
export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  region: string; // e.g., 'India', 'Europe', 'Middle East', 'Asia Pacific'
  phone: string;
  hours: string;
  lat: number;
  lng: number;
  mapLink: string;
  image?: string;
}

export const ALL_STORES: StoreLocation[] = [
  // ============ INTERNATIONAL STORES ============
  {
    id: 'spain',
    name: 'Solitario Spain',
    address: 'Spain',
    city: 'Spain',
    country: 'Spain',
    region: 'Europe',
    phone: '+34 XXX XXX XXX',
    hours: '10:00 AM - 9:00 PM',
    lat: 40.4168,
    lng: -3.7038,
    mapLink: 'https://maps.google.com/?q=Solitario+Spain',
    image: '/solitario/stores/spain.jpg',
  },
  {
    id: 'malaysia',
    name: 'Solitario Malaysia',
    address: 'Malaysia',
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    region: 'Asia Pacific',
    phone: '+60 XXX XXX XXX',
    hours: '10:00 AM - 10:00 PM',
    lat: 3.1390,
    lng: 101.6869,
    mapLink: 'https://maps.google.com/?q=Solitario+Malaysia',
    image: '/solitario/stores/malaysia.jpg',
  },
  {
    id: 'dubai',
    name: 'Solitario Dubai',
    address: 'Dubai, UAE',
    city: 'Dubai',
    country: 'UAE',
    region: 'Middle East',
    phone: '+971 XXX XXX XXX',
    hours: '10:00 AM - 10:00 PM',
    lat: 25.2048,
    lng: 55.2708,
    mapLink: 'https://maps.google.com/?q=Solitario+Dubai',
    image: '/solitario/stores/dubai.jpg',
  },

  // ============ PUNE STORES ============
  {
    id: 'pune-phoenix-millennium',
    name: 'Phoenix Mall of the Millennium',
    address: 'Phoenix Mall of the Millennium, Wakad',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.5912,
    lng: 73.7644,
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Phoenix+Mall+of+the+Millennium+Wakad,+Pune',
  },
  {
    id: 'pune-pavilion',
    name: 'Pavilion Mall',
    address: 'Pavilion Mall, Shivajinagar',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.5314,
    lng: 73.8446,
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Pavillion+Mall,+Pune',
  },
  {
    id: 'pune-baner',
    name: 'Baner',
    address: 'Baner Road',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.5590,
    lng: 73.7868,
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Baner,+Pune',
  },
  {
    id: 'pune-phoenix-marketcity',
    name: 'Phoenix Marketcity Pune',
    address: 'Phoenix Marketcity, Viman Nagar',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.5623,
    lng: 73.9166,
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Phoenix+Marketcity,+Pune',
  },
  {
    id: 'pune-koregaon-park',
    name: 'Koregaon Park',
    address: 'Koregaon Park',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.5362,
    lng: 73.8939,
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Koregaon+Park,+Pune',
  },
  {
    id: 'pune-nibm',
    name: 'NIBM',
    address: 'NIBM Road',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.4655,
    lng: 73.9089,
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+NIBM,+Pune',
  },

  // ============ MUMBAI STORES ============
  {
    id: 'mumbai-phoenix-kurla',
    name: 'Phoenix Marketcity Kurla',
    address: 'Phoenix Marketcity, Kurla West',
    city: 'Mumbai',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 19.0863,
    lng: 72.8890,
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Phoenix+Marketcity+Kurla,+Mumbai',
  },
  {
    id: 'mumbai-sky-city-borivali',
    name: 'Sky City Mall Borivali',
    address: 'First Floor, Sky City Mall, Borivali East',
    city: 'Mumbai',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 19.2307,
    lng: 72.8567,
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Sky+City+Mall+Borivali,+Mumbai',
  },
  {
    id: 'mumbai-infiniti-malad',
    name: 'Infiniti Mall Malad',
    address: 'Infiniti Mall, Malad West',
    city: 'Mumbai',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 19.1860,
    lng: 72.8334,
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Infiniti+Mall+Malad,+Mumbai',
  },
  {
    id: 'mumbai-r-city-ghatkopar',
    name: 'R City Mall Ghatkopar',
    address: 'R City Mall, Ghatkopar West',
    city: 'Mumbai',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 19.0919,
    lng: 72.9081,
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+R+City+Mall+Ghatkopar,+Mumbai',
  },
  {
    id: 'mumbai-oberoi-mall-goregaon',
    name: 'Oberoi Mall Goregaon',
    address: 'Oberoi Mall, Goregaon East',
    city: 'Mumbai',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 19.1726,
    lng: 72.8619,
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Oberoi+Mall+Goregaon,+Mumbai',
  },
  {
    id: 'mumbai-viviana-thane',
    name: 'Viviana Mall Thane',
    address: 'Viviana Mall, Thane West',
    city: 'Mumbai',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 19.2094,
    lng: 72.9707,
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Viviana+Mall+Thane,+Mumbai',
  },

  // ============ OTHER INDIAN CITIES ============
  {
    id: 'hyderabad-sarath-city',
    name: 'Sarath City Capital Mall',
    address: 'Sarath City Capital Mall, Kondapur',
    city: 'Hyderabad',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 17.4589,
    lng: 78.3726,
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Sarath+City+Capital+Mall,+Hyderabad',
  },
  {
    id: 'bangalore-phoenix-marketcity',
    name: 'Phoenix Marketcity Bangalore',
    address: 'Phoenix Marketcity, Whitefield',
    city: 'Bangalore',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 12.9976,
    lng: 77.6961,
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Phoenix+Marketcity,+Bangalore',
  },
  {
    id: 'ahmedabad-palladium',
    name: 'Palladium Mall Ahmedabad',
    address: 'Palladium Mall, SG Highway',
    city: 'Ahmedabad',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 23.0469,
    lng: 72.5117,
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Palladium+Mall,+Ahmedabad',
  },
  {
    id: 'surat-vr-mall',
    name: 'VR Mall Surat',
    address: 'VR Mall, Dumas Road',
    city: 'Surat',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 21.1352,
    lng: 72.7740,
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+VR+Mall,+Surat',
  },
  {
    id: 'indore-phoenix-citadel',
    name: 'Phoenix Citadel Indore',
    address: 'Phoenix Citadel Mall',
    city: 'Indore',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 22.7196,
    lng: 75.8577,
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Phoenix+Citadel,+Indore',
  },
  {
    id: 'lucknow-phoenix-palassio',
    name: 'Phoenix Palassio Lucknow',
    address: 'Phoenix Palassio Mall',
    city: 'Lucknow',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 26.8467,
    lng: 80.9462,
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Phoenix+Palassio,+Lucknow',
  },
];

// Haversine formula to calculate distance between two coordinates in km
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Find nearest store from user's location
export function findNearestStore(
  userLat: number,
  userLng: number,
  stores: StoreLocation[] = ALL_STORES
): { store: StoreLocation; distance: number } | null {
  if (stores.length === 0) return null;

  let nearestStore = stores[0];
  let minDistance = calculateDistance(userLat, userLng, stores[0].lat, stores[0].lng);

  for (const store of stores) {
    const distance = calculateDistance(userLat, userLng, store.lat, store.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearestStore = store;
    }
  }

  return { store: nearestStore, distance: minDistance };
}

// Find nearest N stores
export function findNearestStores(
  userLat: number,
  userLng: number,
  count: number = 3,
  stores: StoreLocation[] = ALL_STORES
): { store: StoreLocation; distance: number }[] {
  const storesWithDistance = stores.map((store) => ({
    store,
    distance: calculateDistance(userLat, userLng, store.lat, store.lng),
  }));

  storesWithDistance.sort((a, b) => a.distance - b.distance);

  return storesWithDistance.slice(0, count);
}

// Format distance for display
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}
