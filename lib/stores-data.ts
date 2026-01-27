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
  {
    id: 'phoenix-millennium-wakad',
    name: 'Phoenix Mall of the Millennium',
    address: 'Ground Floor, Phoenix Mall of The Millennium, next to Gargi, Shankar Kalat Nagar, Wakad',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 8956464322',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.60059,
    lng: 73.75657,
    mapLink: 'https://maps.google.com/?q=18.60059,73.75657',
  },
  {
    id: 'pavilion-mall-pune',
    name: 'Pavilion Mall',
    address: 'Ground Floor, The Pavilion Mall, K06-07-08, Senapati Bapat Rd, next to JW MARRIOTT HOTEL, Shivajinagar',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 7507509634',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.53454,
    lng: 73.82962,
    mapLink: 'https://maps.google.com/?q=18.53454,73.82962',
  },
  {
    id: 'phoenix-marketcity-viman-nagar',
    name: 'Phoenix Marketcity Viman Nagar',
    address: 'Phoenix Marketcity, G-42, Clover Park, Viman Nagar',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 8668804825',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.56282,
    lng: 73.91678,
    mapLink: 'https://maps.google.com/?q=18.56282,73.91678',
  },
  {
    id: 'phoenix-marketcity-kurla',
    name: 'Phoenix Marketcity Kurla',
    address: 'Ground Floor, opp. Zara, PMC, Patelwadi, Kurla, Ashok Nagar',
    city: 'Mumbai',
    country: 'India',
    region: 'India',
    phone: '+91 7756059593',
    hours: '10:00 AM - 11:00 PM',
    lat: 19.0864494,
    lng: 72.88920378,
    mapLink: 'https://maps.google.com/?q=19.0864494,72.88920378',
  },
  {
    id: 'sky-city-mall-borivali',
    name: 'Sky City Mall Borivali',
    address: 'First Floor, Sky City Mall, Borivali East',
    city: 'Mumbai',
    country: 'India',
    region: 'India',
    phone: '+91 8855044958',
    hours: '10:00 AM - 11:00 PM',
    lat: 19.22369,
    lng: 72.8641,
    mapLink: 'https://maps.google.com/?q=19.22369,72.8641',
  },
  {
    id: 'phoenix-marketcity-bangalore',
    name: 'Phoenix Marketcity Bengaluru',
    address: 'Lower Ground Floor, Phoenix Market City, opposite Lifestyle, Devasandra Industrial Estate, Krishnarajapuram',
    city: 'Bengaluru',
    country: 'India',
    region: 'India',
    phone: '+91 8892875405',
    hours: '10:00 AM - 11:00 PM',
    lat: 12.99771344,
    lng: 77.6964805,
    mapLink: 'https://maps.google.com/?q=12.99771344,77.6964805',
  },
  {
    id: 'nexus-shantiniketan-bangalore',
    name: 'Nexus Shantiniketan',
    address: 'Upper Ground Floor, Nexus, FORUM SHANTINIKETAN MALL, Thigalarapalya, Whitefield',
    city: 'Bengaluru',
    country: 'India',
    region: 'India',
    phone: '+91 8956464326',
    hours: '10:00 AM - 11:00 PM',
    lat: 12.9896789,
    lng: 77.7279819,
    mapLink: 'https://maps.google.com/?q=12.9896789,77.7279819',
  },
  {
    id: 'palladium-chennai',
    name: 'Palladium Mall Chennai',
    address: 'Lower Ground Floor, Palladium Mall, Velachery Rd, near Starbucks',
    city: 'Chennai',
    country: 'India',
    region: 'India',
    phone: '+91 8956739647',
    hours: '10:00 AM - 11:00 PM',
    lat: 12.99266,
    lng: 80.21777,
    mapLink: 'https://maps.google.com/?q=12.99266,80.21777',
  },
  {
    id: 'lulu-mall-lucknow',
    name: 'Lulu Mall Lucknow',
    address: 'Ground Floor, Flat No.F-026, Lulu Mall, Sultanpur Rd, Golf City, Hariharpur',
    city: 'Lucknow',
    country: 'India',
    region: 'India',
    phone: '+91 7757970471',
    hours: '10:00 AM - 11:00 PM',
    lat: 26.7842111,
    lng: 80.99136145,
    mapLink: 'https://maps.google.com/?q=26.7842111,80.99136145',
  },
  {
    id: 'nexus-elante-chandigarh',
    name: 'Nexus Elante Mall Chandigarh',
    address: 'PH-1, Unit No.233A Second Floor Elante Mall plot no. 178, 178A, Industrial Area Phase I',
    city: 'Chandigarh',
    country: 'India',
    region: 'India',
    phone: '+91 8956739644',
    hours: '10:00 AM - 11:00 PM',
    lat: 30.7057675404939,
    lng: 76.8010291130443,
    mapLink: 'https://maps.google.com/?q=30.7057675404939,76.8010291130443',
  },
  {
    id: 'koregaon-park-pune',
    name: 'Koregaon Park',
    address: 'Unit/Shop bearing no 21 & 22 Vrindavan, North Main Road, Koregaon Park',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 7276896986',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.53928437,
    lng: 73.89852675,
    mapLink: 'https://maps.google.com/?q=18.53928437,73.89852675',
  },
  {
    id: 'mpm-mall-hyderabad',
    name: 'MPM Mall Hyderabad',
    address: 'Unit Nos. 116 to 118 on Ground floor, Level-1, MPM Timessquare, Nagarjuna Circle, Road No.1, Banjara Hills',
    city: 'Hyderabad',
    country: 'India',
    region: 'India',
    phone: '+91 9182813253',
    hours: '10:00 AM - 11:00 PM',
    lat: 17.42542516,
    lng: 78.4482078,
    mapLink: 'https://maps.google.com/?q=17.42542516,78.4482078',
  },
  {
    id: 'mg-road-indore',
    name: 'MG Road Indore',
    address: 'Prakosth No. 1 Ground Floor Sagarmatha Apartment, Plot No. 18 Mahatma Gandhi Marg, South Tukoganj',
    city: 'Indore',
    country: 'India',
    region: 'India',
    phone: '+91 8305623415',
    hours: '10:00 AM - 11:00 PM',
    lat: 22.72121669,
    lng: 75.87509267,
    mapLink: 'https://maps.google.com/?q=22.72121669,75.87509267',
  },
  {
    id: 'camac-street-kolkata',
    name: 'Camac Street Kolkata',
    address: 'Premises No. 7, Camac Street, Elgin, Police Station: Shakespeare Sarani, Post Office: Circus Avenue',
    city: 'Kolkata',
    country: 'India',
    region: 'India',
    phone: '+91 8617709665',
    hours: '10:00 AM - 11:00 PM',
    lat: 22.54452304,
    lng: 88.35254691,
    mapLink: 'https://maps.google.com/?q=22.54452304,88.35254691',
  },
  {
    id: 'vashi-sector-17',
    name: 'Vashi Sector 17',
    address: 'Next to Titan Eye Plus, Arenja Corner, Shah Signature, Sector 17 Vashi, Navi Mumbai',
    city: 'Mumbai',
    country: 'India',
    region: 'India',
    phone: '+91 9594000904',
    hours: '10:00 AM - 11:00 PM',
    lat: 19.07247834,
    lng: 72.99791191,
    mapLink: 'https://maps.google.com/?q=19.07247834,72.99791191',
  },
  {
    id: 'linking-road-mumbai',
    name: 'Linking Road Mumbai',
    address: 'Shop No. 2, Ganga Bhawan, Linking Rd, Santacruz (West)',
    city: 'Mumbai',
    country: 'India',
    region: 'India',
    phone: '+91 9819370577',
    hours: '10:00 AM - 11:00 PM',
    lat: 19.08035135,
    lng: 72.83451951,
    mapLink: 'https://maps.google.com/?q=19.08035135,72.83451951',
  },
  {
    id: 'paschim-vihar-delhi',
    name: 'Paschim Vihar Delhi',
    address: 'Shop No. 1, Ground Floor, A-3/3, Paschim Vihar',
    city: 'Delhi',
    country: 'India',
    region: 'India',
    phone: '+91 921103475',
    hours: '10:00 AM - 11:00 PM',
    lat: 28.66971975,
    lng: 77.10542578,
    mapLink: 'https://maps.google.com/?q=28.66971975,77.10542578',
  },
  {
    id: 'karol-bagh-delhi',
    name: 'Karol Bagh Delhi',
    address: 'Plot no.38, Pusa Road, Karol Bagh',
    city: 'Delhi',
    country: 'India',
    region: 'India',
    phone: '+91 921103475',
    hours: '10:00 AM - 11:00 PM',
    lat: 28.64402889,
    lng: 77.1849813,
    mapLink: 'https://maps.google.com/?q=28.64402889,77.1849813',
  },
  {
    id: 'tribeca-highstreet-baner',
    name: 'Tribeca Highstreet Baner',
    address: 'Shop unit No. 3, ICON BUSINESS SPACES, Baner',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 9359050716',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.56441659,
    lng: 73.77736116,
    mapLink: 'https://maps.google.com/?q=18.56441659,73.77736116',
  },
  {
    id: 'tribeca',
    name: 'Tribeca',
    address: 'Plaza floor, Tribeca High Street, Shop Bearing Unit No, S-71, NIBM Rd, Pune, Maharashtra 411048',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 9325773558',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.4768105,
    lng: 73.90834184,
    mapLink: 'https://share.google/LgL5ylj3i6aA3l32T',
  },
  {
    id: 'south-city-mall-kolkata',
    name: 'South City Mall Kolkata',
    address: 'No 375, Southcity Mall, Prince Anwar Shah Rd, opposite Takiahar Park, Jodhpur Park',
    city: 'Kolkata',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 22.5018,
    lng: 88.3634,
    mapLink: 'https://maps.google.com/?q=South+City+Mall+Kolkata',
  },
  {
    id: 'shoppers-stop-andheri',
    name: 'Shoppers Stop Andheri',
    address: '211D, Swami Vivekananda Rd, Zalawad Nagar, Ganga Vihar, Andheri West',
    city: 'Mumbai',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 19.1357,
    lng: 72.8262,
    mapLink: 'https://maps.google.com/?q=Shoppers+Stop+Andheri+Mumbai',
  },
  {
    id: 'viviana-mall-thane',
    name: 'Viviana Mall Thane',
    address: 'Ground floor, Viviana Mall, Eastern Express Hwy, next to Jupiter Hospital, Laxmi Nagar, Thane West',
    city: 'Thane',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 19.2094,
    lng: 72.9707,
    mapLink: 'https://maps.google.com/?q=Viviana+Mall+Thane',
  },
  {
    id: 'r-city-mall-ghatkopar',
    name: 'R City Mall Ghatkopar',
    address: 'R City Mall, Lal Bahadur Shastri Marg, Amrut Nagar, Ghatkopar West',
    city: 'Mumbai',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 19.0919,
    lng: 72.9081,
    mapLink: 'https://maps.google.com/?q=R+City+Mall+Ghatkopar',
  },
  {
    id: 'chetpet-chennai',
    name: 'Shoppers Stop Chetpet Chennai',
    address: 'Shoppers Stop Ltd, 2 Harrington Road Chetpet',
    city: 'Chennai',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 13.0658,
    lng: 80.2497,
    mapLink: 'https://maps.google.com/?q=Shoppers+Stop+Chetpet+Chennai',
  },
  {
    id: 'fun-republic-lucknow',
    name: 'Fun Republic Mall Lucknow',
    address: '2nd Floor, Fun Republic Mall, Lohia Path, Nehru Enclave, Gomti Nagar',
    city: 'Lucknow',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 26.8467,
    lng: 80.9462,
    mapLink: 'https://maps.google.com/?q=Fun+Republic+Mall+Lucknow',
  },
  {
    id: 'gvk-one-hyderabad',
    name: 'GVK One Mall Hyderabad',
    address: 'Road No 01, Gvk One Mall, Balapur Basthi, Banjara Hills',
    city: 'Hyderabad',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 17.4239,
    lng: 78.4738,
    mapLink: 'https://maps.google.com/?q=GVK+One+Mall+Hyderabad',
  },
  {
    id: 'bannerghatta-bangalore',
    name: 'Bannerghatta Bengaluru',
    address: 'GROUND FLOOR, Commerce Mantri, Bannerghatta Rd, NS Palya, BTM 2nd Stage, BTM Layout',
    city: 'Bengaluru',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 12.9165,
    lng: 77.6101,
    mapLink: 'https://maps.google.com/?q=Bannerghatta+Bengaluru',
  },
  {
    id: 'mantri-mall-bangalore',
    name: 'Mantri Mall Malleshwaram',
    address: 'Mantri Mall, Sampige Rd, Malleshwaram',
    city: 'Bengaluru',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 13.0067,
    lng: 77.5697,
    mapLink: 'https://maps.google.com/?q=Mantri+Mall+Malleshwaram',
  },
  {
    id: 'ludhiana-mall',
    name: 'Ludhiana Mall',
    address: '94, Block F Marg, Sunet, GHS Sunet, Bhai Randhir Singh Nagar',
    city: 'Ludhiana',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 30.9010,
    lng: 75.8573,
    mapLink: 'https://maps.google.com/?q=Ludhiana+Mall',
  },
  {
    id: 'westend-mall-aundh',
    name: 'Westend Mall Aundh',
    address: 'WESTEND MALL, near Parihar chowk, Ward No. 8, Sector 2, Aundh',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.5590,
    lng: 73.8073,
    mapLink: 'https://maps.google.com/?q=Westend+Mall+Aundh',
  },
  {
    id: 'shipra-mall-ghaziabad',
    name: 'Shipra Mall Ghaziabad',
    address: 'No 9, Shipra Mall, Shipra Shopping Center, Vaibhav Khand, Indirapuram',
    city: 'Ghaziabad',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 28.6410,
    lng: 77.3754,
    mapLink: 'https://maps.google.com/?q=Shipra+Mall+Ghaziabad',
  },
  {
    id: 'shoppers-stop-gurgaon',
    name: 'Shoppers Stop Gurgaon',
    address: 'Tapasya One, IILM Institute, Sector 53',
    city: 'Gurgaon',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 28.4595,
    lng: 77.0266,
    mapLink: 'https://maps.google.com/?q=Shoppers+Stop+Gurgaon',
  },
  {
    id: 'shoppers-stop-indore',
    name: 'Shoppers Stop Indore',
    address: 'BPK Star Building, AB Rd, opposite LIG Gurudwara, Press Complex',
    city: 'Indore',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 22.7196,
    lng: 75.8577,
    mapLink: 'https://maps.google.com/?q=Shoppers+Stop+Indore',
  },
  {
    id: 'dynamix-mall-juhu',
    name: 'Dynamix Mall Juhu',
    address: 'Dynamix Mall, Sant Dnyaneshwar Marg, Sainath Nagar, MHADA Colony, Juhu',
    city: 'Mumbai',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 19.1076,
    lng: 72.8263,
    mapLink: 'https://maps.google.com/?q=Dynamix+Mall+Juhu',
  },
  {
    id: 'rare-luxury-pune',
    name: 'Rare Luxury Pune',
    address: 'Jewel Square Mall, Koregaon Park, Bund Garden Road',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.5362,
    lng: 73.8939,
    mapLink: 'https://maps.google.com/?q=Rare+Luxury+Pune',
  },
  {
    id: 'study-by-janak-delhi',
    name: 'Study by Janak Delhi',
    address: 'Study by Janak, N-9, South Extension, Part 1',
    city: 'Delhi',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 28.5706,
    lng: 77.2144,
    mapLink: 'https://maps.google.com/?q=Study+by+Janak+Delhi',
  },
  {
    id: 'broadway-ambience-delhi',
    name: 'Broadway Ambience Mall Delhi',
    address: 'Ambience Mall, Ground Floor, Vasant Kunj',
    city: 'Delhi',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 28.5244,
    lng: 77.1586,
    mapLink: 'https://maps.google.com/?q=Ambience+Mall+Vasant+Kunj',
  },
  {
    id: 'just-in-time-aundh',
    name: 'Just In Time Aundh',
    address: 'Just In Time, Society, ITI Rd, Ward No. 8, Pushpak Park, Aundh',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.5590,
    lng: 73.8073,
    mapLink: 'https://maps.google.com/?q=Just+In+Time+Aundh',
  },
  {
    id: 'just-in-time-mg-road',
    name: 'Just In Time MG Road',
    address: '270, MG Road, near Bata Chowk, Camp',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.5196,
    lng: 73.8553,
    mapLink: 'https://maps.google.com/?q=Just+In+Time+MG+Road+Pune',
  },
];

// Haversine formula to calculate distance between two coordinates in km
// This formula accounts for the Earth's curvature and provides accurate distances
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
  const distance = R * c;
  
  // Round to 2 decimal places for consistency
  return Math.round(distance * 100) / 100;
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

  // Sort by distance in ascending order (nearest first)
  storesWithDistance.sort((a, b) => {
    const diff = a.distance - b.distance;
    // Ensure stable sort for stores at same distance
    if (Math.abs(diff) < 0.01) {
      return a.store.name.localeCompare(b.store.name);
    }
    return diff;
  });

  return storesWithDistance.slice(0, count);
}

// Format distance for display
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}
