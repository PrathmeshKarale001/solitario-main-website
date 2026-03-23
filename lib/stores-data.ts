// All Solitario store locations with coordinates for geolocation
export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  region: 'India' | 'Malaysia' | 'Dubai' | 'Spain';
  phone: string;
  hours: string;
  lat: number;
  lng: number;
  mapLink: string;
  image?: string;
  email?: string;
  type?: 'store' | 'sis-shoppers-stop' | 'sis-just-in-time';
}

export interface SpainTouchPoint {
  name: string;
  address: string;
  mapQuery: string;
  phone?: string;
}

export interface SpainDistributor {
  name: string;
  website: string;
  ctaLink?: string;
  ctaLabel?: string;
  figmaLink?: string;
  touchPoints: SpainTouchPoint[];
}

// ==================== INDIA STORES ====================

export const INDIA_OWN_STORES: StoreLocation[] = [
  {
    id: 'phoenix-marketcity-viman-nagar',
    name: 'Phoenix Marketcity - Viman Nagar',
    address: 'Phoenix Marketcity, G-42, Clover Park, Viman Nagar, Pune, Maharashtra',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 8668804825',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.56282,
    lng: 73.91678,
    mapLink: 'https://goo.gl/maps/hH3dbYs5K2J3s53HA',
    email: 'pmcpune@thesolitario.com',
    type: 'store',
  },
  {
    id: 'phoenix-mom-wakad',
    name: 'Phoenix MOM - Wakad',
    address: 'Ground Floor, Phoenix Mall of The Millennium, Shankar Kalat Nagar, Wakad, Pune, Maharashtra',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 8956464322',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.60059,
    lng: 73.75657,
    mapLink: 'https://maps.app.goo.gl/XbseJ3veRHoqRWdTA',
    email: 'wakad@thesolitario.com',
    type: 'store',
  },
  {
    id: 'pavilion-sb-road',
    name: 'The Pavilion - SB Road',
    address: 'Ground Floor, The Pavilion Mall, K06-07-08, Senapati Bapat Rd, Model Colony, Shivajinagar, Pune, Maharashtra',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 7276896986',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.53454,
    lng: 73.82962,
    mapLink: 'https://goo.gl/maps/VYgrEkt39GqAGLfV6',
    email: 'pavillion@thesolitario.com',
    type: 'store',
  },
  {
    id: 'koregaon-park-lane6',
    name: 'KP, Lane No. 06',
    address: 'Shop No. 4, The Hub, N Main Rd, Meera Nagar Garden Society, Koregaon Park, Pune, Maharashtra',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 9156232667',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.53928437,
    lng: 73.89852675,
    mapLink: 'https://maps.app.goo.gl/1TWhDpdAi9Pki5xo6',
    email: 'koregaonpark@thesolitario.com',
    type: 'store',
  },
  {
    id: 'icon-business-baner',
    name: 'Icon Business Spaces, Baner',
    address: 'Shop unit No. 3, ICON BUSINESS SPACES, Baner, Pune',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 8956596146',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.56441659,
    lng: 73.77736116,
    mapLink: 'https://maps.app.goo.gl/VUinzRgr8TRTttweA?g_st=aw',
    email: 'balewadi@thesolitario.com',
    type: 'store',
  },
  {
    id: 'tribeca-nibm',
    name: 'Tribeca Highstreet, NIBM',
    address: 'Shop Bearing Unit No. S-71, Plaza Floor, Tribeca High Street, NIBM Road, Pune',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 8956596147',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.4768105,
    lng: 73.90834184,
    mapLink: 'https://maps.app.goo.gl/g4eZVzGqa134P3AW6?g_st=aw',
    email: 'tribecahighstreet@thesolitario.com',
    type: 'store',
  },
  {
    id: 'rare-luxury-kp',
    name: 'Rare Luxury, KP',
    address: 'Jewel Square Mall, B3, Koregaon Park, Pune, Maharashtra',
    city: 'Pune',
    country: 'India',
    region: 'India',
    phone: '+91 88888 09739',
    hours: '10:00 AM - 11:00 PM',
    lat: 18.5362,
    lng: 73.8939,
    mapLink: 'https://maps.app.goo.gl/3Vt4RRaXfJ5i2ZHW9',
    type: 'store',
  },
  {
    id: 'phoenix-marketcity-kurla',
    name: 'Phoenix Marketcity - Kurla',
    address: 'Ground Floor, opp. Zara, PMC, Patelwadi, Kurla, Ashok Nagar, Mumbai, Maharashtra',
    city: 'Mumbai',
    country: 'India',
    region: 'India',
    phone: '+91 7756059593',
    hours: '10:00 AM - 11:00 PM',
    lat: 19.0864494,
    lng: 72.88920378,
    mapLink: 'https://maps.app.goo.gl/tgLqaPWpxFPHuNA46',
    email: 'pmckurla@thesolitario.com',
    type: 'store',
  },
  {
    id: 'sky-city-mall-borivali',
    name: 'Sky City Mall - Borivali',
    address: 'First Floor, Sky City Mall, Borivali East, Mumbai, Maharashtra',
    city: 'Mumbai',
    country: 'India',
    region: 'India',
    phone: '+91 8855044958',
    hours: '10:00 AM - 11:00 PM',
    lat: 19.22369,
    lng: 72.8641,
    mapLink: 'https://maps.app.goo.gl/e9pTQH2gpmyTepEr8',
    email: 'skycity@thesolitario.com',
    type: 'store',
  },
  {
    id: 'vashi-navi-mumbai',
    name: 'Vashi, Navi Mumbai',
    address: '329, Arenja Corner, Plot No.71, Shah Signature, Sector 17, Vashi, Navi Mumbai',
    city: 'Mumbai',
    country: 'India',
    region: 'India',
    phone: '+91 8956596142',
    hours: '10:00 AM - 11:00 PM',
    lat: 19.07247834,
    lng: 72.99791191,
    mapLink: 'https://maps.app.goo.gl/kU15s6RmWgPGWqBH9',
    email: 'vashi@thesolitario.com',
    type: 'store',
  },
  {
    id: 'linking-road-santacruz',
    name: 'Linking Road, Santa Cruz (West)',
    address: 'Shop No. 2, Ganga Bhawan, Linking Rd, Santacruz (West), Mumbai, Maharashtra',
    city: 'Mumbai',
    country: 'India',
    region: 'India',
    phone: '+91 8956596149',
    hours: '10:00 AM - 11:00 PM',
    lat: 19.08035135,
    lng: 72.83451951,
    mapLink: 'https://maps.app.goo.gl/eDQQzxLchyTkxtDb9',
    email: 'linkingroadmumbai@thesolitario.com',
    type: 'store',
  },
  {
    id: 'phoenix-marketcity-bangalore',
    name: 'Phoenix Marketcity (PMCB)',
    address: 'Lower Ground Floor, Phoenix Market City, opposite Lifestyle, Krishnarajapuram, Bengaluru, Karnataka',
    city: 'Bengaluru',
    country: 'India',
    region: 'India',
    phone: '+91 7757947379',
    hours: '10:00 AM - 11:00 PM',
    lat: 12.99771344,
    lng: 77.6964805,
    mapLink: 'https://maps.app.goo.gl/zchQFMxNKJYF48Y67',
    email: 'pmcbangalore@thesolitario.com',
    type: 'store',
  },
  {
    id: 'nexus-shantiniketan-bangalore',
    name: 'Nexus Shantiniketan',
    address: 'Upper Ground Floor, Nexus, FORUM SHANTINIKETAN MALL, Whitefield, Bengaluru, Karnataka',
    city: 'Bengaluru',
    country: 'India',
    region: 'India',
    phone: '+91 8956464326',
    hours: '10:00 AM - 11:00 PM',
    lat: 12.9896789,
    lng: 77.7279819,
    mapLink: 'https://maps.app.goo.gl/e5XLdn6bw76QE3kZ7',
    email: 'shantiniketan@thesolitario.com',
    type: 'store',
  },
  {
    id: 'paschim-vihar-delhi',
    name: 'Paschim Vihar',
    address: 'Pvt. Shop No-1, Left Hand Side, Ground Floor, A-3/3, Paschim Vihar, New Delhi',
    city: 'Delhi',
    country: 'India',
    region: 'India',
    phone: '+91 8956596145',
    hours: '10:00 AM - 11:00 PM',
    lat: 28.66971975,
    lng: 77.10542578,
    mapLink: 'https://maps.app.goo.gl/RchtJx9fHosaLuVu5',
    email: 'paschimvihar@thesolitario.com',
    type: 'store',
  },
  {
    id: 'karol-bagh-delhi',
    name: 'Karol Bagh',
    address: 'Ground Floor, H.no. 38, Pusa Rd, Karol Bagh, New Delhi',
    city: 'Delhi',
    country: 'India',
    region: 'India',
    phone: '+91 8956596148',
    hours: '10:00 AM - 11:00 PM',
    lat: 28.64402889,
    lng: 77.1849813,
    mapLink: 'https://maps.app.goo.gl/Bn2x6mc4JaBspoBv6',
    email: 'karolbagh@thesolitario.com',
    type: 'store',
  },
  {
    id: 'palladium-chennai',
    name: 'The Palladium Mall',
    address: 'Lower Ground Floor, Palladium Mall, Velachery Rd, near Starbucks, Chennai, Tamil Nadu',
    city: 'Chennai',
    country: 'India',
    region: 'India',
    phone: '+91 8956739647',
    hours: '10:00 AM - 11:00 PM',
    lat: 12.99266,
    lng: 80.21777,
    mapLink: 'https://maps.app.goo.gl/B46rqjNrnF323ua8A',
    email: 'palladiumchennai@thesolitario.com',
    type: 'store',
  },
  {
    id: 'lulu-mall-lucknow',
    name: 'Lulu Mall',
    address: 'Ground Floor, Flat No.F-026, Lulu Mall, Sultanpur Rd, Golf City, Lucknow, Uttar Pradesh',
    city: 'Lucknow',
    country: 'India',
    region: 'India',
    phone: '+91 7757970471',
    hours: '10:00 AM - 11:00 PM',
    lat: 26.7842111,
    lng: 80.99136145,
    mapLink: 'https://maps.app.goo.gl/Za94ferZcKM3gSC39',
    email: 'lululucknow@thesolitario.com',
    type: 'store',
  },
  {
    id: 'mg-road-indore',
    name: 'MG Road',
    address: 'Prakosth No. 1 Ground Floor Sagarmatha Apartment, Plot No. 18 Mahatma Gandhi Marg, Indore M.P.',
    city: 'Indore',
    country: 'India',
    region: 'India',
    phone: '+91 8956596143',
    hours: '10:00 AM - 11:00 PM',
    lat: 22.72121669,
    lng: 75.87509267,
    mapLink: 'https://maps.app.goo.gl/mPkqQ1CxFkQqoQPz5',
    email: 'mgroadindore@thesolitario.com',
    type: 'store',
  },
  {
    id: 'camac-street-kolkata',
    name: 'Camac Street Elgin',
    address: 'Ground Floor, Unit No G6 - Azimganj House, Camac St. Elgin, Kolkata, West Bengal',
    city: 'Kolkata',
    country: 'India',
    region: 'India',
    phone: '+91 8956596144',
    hours: '10:00 AM - 11:00 PM',
    lat: 22.54452304,
    lng: 88.35254691,
    mapLink: 'https://maps.app.goo.gl/Eba5WYoVCkL9K9Ni8',
    email: 'camacstreet@thesolitario.com',
    type: 'store',
  },
  {
    id: 'mpm-timesquare-hyderabad',
    name: 'MPM Timesquare',
    address: 'Ground floor, Level-1, MPM Timesquare, Nagarjuna Circle, Road No.1, Banjara Hills, Hyderabad, Telangana',
    city: 'Hyderabad',
    country: 'India',
    region: 'India',
    phone: '+91 8956596150',
    hours: '10:00 AM - 11:00 PM',
    lat: 17.42542516,
    lng: 78.4482078,
    mapLink: 'https://maps.app.goo.gl/eBdf34KyvHS1eVSL9',
    email: 'mpmhyderabad@thesolitario.com',
    type: 'store',
  },
  {
    id: 'dwarka-delhi',
    name: 'Dwarka',
    address: 'Krishna Plaza 3, Plot No.1, Pocket 4, Sector 12, Dwarka, Delhi, 110075',
    city: 'Delhi',
    country: 'India',
    region: 'India',
    phone: '+91 89563 71159',
    hours: '10:00 AM - 11:00 PM',
    lat: 28.5921,
    lng: 77.0460,
    mapLink: 'https://maps.google.com/?q=Solitario+Dwarka+Delhi',
    email: 'dwarka@thesolitario.com',
    type: 'store',
  },
];

// India SIS - Shoppers Stop
export const INDIA_SIS_SHOPPERS_STOP: StoreLocation[] = [
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
    type: 'sis-shoppers-stop',
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
    type: 'sis-shoppers-stop',
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
    type: 'sis-shoppers-stop',
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
    type: 'sis-shoppers-stop',
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
    type: 'sis-shoppers-stop',
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
    type: 'sis-shoppers-stop',
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
    type: 'sis-shoppers-stop',
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
    type: 'sis-shoppers-stop',
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
    type: 'sis-shoppers-stop',
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
    type: 'sis-shoppers-stop',
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
    type: 'sis-shoppers-stop',
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
    type: 'sis-shoppers-stop',
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
    type: 'sis-shoppers-stop',
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
    type: 'sis-shoppers-stop',
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
    type: 'sis-shoppers-stop',
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
    type: 'sis-shoppers-stop',
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
    type: 'sis-shoppers-stop',
  },
];

// India SIS - Just In Time
export const INDIA_SIS_JUST_IN_TIME: StoreLocation[] = [
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
    type: 'sis-just-in-time',
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
    type: 'sis-just-in-time',
  },
];

// ==================== MALAYSIA STORES ====================

export const MALAYSIA_STORES: StoreLocation[] = [
  {
    id: 'seibu-trx-malaysia',
    name: 'Solitario - Seibu TRX',
    address: 'G.AT.1, Level G, Lot 01700 SEIBU The Exchange TRX, Persiaran TRX, Imbi, 55188 Kuala Lumpur, Malaysia',
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    region: 'Malaysia',
    phone: '012-2366081',
    hours: '10:00 AM - 10:00 PM',
    lat: 3.1425,
    lng: 101.7181,
    mapLink: 'https://share.google/TiRuLMObZQNujjmkQ',
    email: 'seibu@thesolitario.com',
    image: '/images/Stores/MalaysiaStore1.webp',
  },
  {
    id: 'starhill-malaysia',
    name: 'Solitario - The Starhill',
    address: 'No. G23, Starhill Gallery, 181, Jalan Bukit Bintang, 55100, Wilayah Persekutuan Kuala Lumpur',
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    region: 'Malaysia',
    phone: '012-2976081',
    hours: '10:00 AM - 10:00 PM',
    lat: 3.1480,
    lng: 101.7105,
    mapLink: 'https://share.google/uL0it5nRrYJpFYnV7',
    email: 'starhill@thesolitario.com',
    image: '/images/Stores/MalaysiaStore.jpeg',
  },
];

// ==================== DUBAI STORES ====================

export const DUBAI_STORES: StoreLocation[] = [
  {
    id: 'dubai-hills-mall',
    name: 'Solitario, Dubai Hills Mall',
    address: 'Gate 2, First Floor, Dubai Hills Mall, Al Khail Rd, Dubai',
    city: 'Dubai',
    country: 'UAE',
    region: 'Dubai',
    phone: '+971 43997754',
    hours: '10:00 AM - 10:00 PM',
    lat: 25.1267,
    lng: 55.2447,
    mapLink: 'https://maps.app.goo.gl/uEJiR2v1CscPzLDS6',
    email: 'dubaihills@thesolitario.com',
    image: '/images/Stores/DubaiStore.jpeg',
  },
];

// ==================== SPAIN DISTRIBUTORS ====================

export const SPAIN_DISTRIBUTORS: SpainDistributor[] = [
  {
    name: 'Chocrón Joyeros',
    website: 'https://chocronjoyeros.com/',
    touchPoints: [
      { name: 'Chocrón Ceuta', address: 'P.º del Revellín, 19 - 21, 51001, Ceuta', mapQuery: 'P.º del Revellín, 19 - 21, Ceuta', phone: '956 512 124' },
      { name: 'Chocrón Puerto Banús', address: 'C. Ramón Areces, s/n, Nueva Andalucía, 29660 Marbella, Málaga', mapQuery: 'C. Ramón Areces, Marbella', phone: '620 069 697' },
      { name: 'Chocrón Madrid', address: 'C. de Serrano, 2, Salamanca, 28001, Madrid', mapQuery: 'C. de Serrano, 2, Madrid', phone: '917 810 225' },
    ],
  },
  {
    name: 'Geresa',
    website: 'https://www.grupocadarso.com/marcas/solitario/',
    // ctaLink: '#', // Temporarily hidden
    // ctaLabel: 'Ver catálogo Geresa',
    figmaLink: '/geresa', // Redirects to Solitario Spain landing page
    touchPoints: [
      { name: 'Monument Hotel', address: 'Pg de Grácia 75, 08008 L\'Eixample, Barcelona', mapQuery: 'Pg. de Gràcia, 75, Barcelona' },
      { name: 'Joyería Trias', address: 'Plaça Creu, 22, 8700, Igualada', mapQuery: 'Plaça de la Creu, 22, Igualada' },
      { name: 'Joyería Santa Gemma', address: 'Rovira i Virgili, 6, 43002, Tarragona', mapQuery: 'Carrer Rovira i Virgili, 6, Tarragona' },
      { name: 'Casa Pous', address: 'Av de Espanya, 11, 17709, La Jonquera', mapQuery: 'Casa Pous, La Jonquera' },
      { name: 'Seven Hills', address: 'Avda de las Playas, 43, Local 4, 35510 Puerto del Carmen, Las Palmas', mapQuery: 'Avda de las Playas, 43, Puerto del Carmen' },
      { name: 'Joyería Elio\'s', address: 'Avda de Canarias, 161, 35110, Vecindario-Santa Lucia, Gran Canaria', mapQuery: 'Av. de Canarias, 161, Vecindario' },
      { name: 'Gold Passion', address: 'C/ Estrella del Mar, 35625, Morrojable, Fuerteventura', mapQuery: 'C. Estrella de Mar, Morrojable' },
      { name: 'Joyería Deluxe', address: 'C/ San Miguel, 22, 29620 Torremolinos, Malaga', mapQuery: 'C. San Miguel, 22, Torremolinos' },
      { name: 'Joyería Ana', address: 'C/ San Isidro, 108, 4700, El Ejido', mapQuery: 'C. San Isidro, 108, El Ejido' },
      { name: 'Joyería Real', address: 'C/ Cervantes, 24, 40001, Segovia', mapQuery: 'C. Cervantes, 24, Segovia' },
      { name: 'Joyería Lozano', address: 'Paseo Colon, 78, 7560, Cala Millor, Palma', mapQuery: 'Joyeria Lozano, Cala Millor' },
      { name: 'La Platería', address: 'C/ Independencia, 18, 13600, Alcazar de San Juan', mapQuery: 'C. Independencia, 18, Alcazar de San Juan' },
      { name: 'Joyería Gemador', address: 'Avda. Meritxell, 30, AD500 Andorra la Vella', mapQuery: 'Av. Meritxell, 30, Andorra' },
      { name: 'Joyería Gresol', address: 'C/ de la Unio, 4, Local 15, AD500, Andorra la Vella', mapQuery: 'C. de la Unio, 4, Andorra la Vella' },
    ],
  },
  {
    name: 'Ele Ka',
    website: 'https://eleka.es/es-ES/joyeria/colecciones/amor-by-solitario/58/',
    // ctaLink: '#', // Temporarily hidden
    // ctaLabel: 'Ver catálogo Ele Ka',
    touchPoints: [
      { name: 'Joiera Margarita Hidalgo', address: 'Rambla, 168A, 08201, Sabadell', mapQuery: 'Rambla, 168A, Sabadell', phone: '937 263 101' },
      { name: 'Joyería Calvo', address: 'Teresa Herrera 2-4, 15004 (Plaza de Lugo), La Coruña, A Coruña', mapQuery: 'Joyería Calvo Plaza de Lugo', phone: '881 019 229' },
      { name: 'Joyería Marsans Maluquer', address: 'C/ Salvador Mundi, 2, 08017 Barcelona', mapQuery: 'Carrer de Salvador Mundí, 2, Barcelona', phone: '932 050 960' },
      { name: 'Joyería Calvelo', address: 'C/ Fomento, 1 - 15100 Carballo - A Coruña', mapQuery: 'Rúa Fomento, 1, Carballo', phone: '981 703 057' },
      { name: 'Joyería Fvenero', address: 'C/ Camilo Alonso Vega 5, 39007 Santander', mapQuery: 'fvenero, Santander', phone: '942 33 29 06' },
      { name: 'La Hora Exacta', address: 'C/ Gran de Gracia, 42, Barcelona', mapQuery: 'Carrer Gran de Gràcia, 42, Barcelona', phone: '932 377 530' },
      { name: 'Roviralta', address: 'C/ Cap de la Vila, 1, Sitges', mapQuery: 'Plaça Cap de la Vila, 1, Sitges', phone: '938 941 773' },
      { name: 'Joyería Suiza', address: 'C/ Venezuela, 49, Vigo', mapQuery: 'Suíza, Vigo', phone: '986 227 458' },
      { name: 'Joyería Covelo, S.L.', address: 'Manuel Rodriguez, 16, Porriño (Pontevedra)', mapQuery: 'R. Manuel Rodríguez, 16, Porriño', phone: '986 330 329' },
      { name: 'Antonio Joyería', address: 'Ruiz Gomez, 4, Aviles', mapQuery: 'Calle Ruiz Gómez, 4, Aviles', phone: '985 543 929' },
      { name: 'Time Shop', address: 'La Tecnica S/N CC Lagunas L. 13, Rivas-VaciaMadrid (Madrid)', mapQuery: 'Time Shop Joyeros, Rivas', phone: '913 012 287' },
      { name: 'Joieria Rellotgeria Carrera', address: 'Nuria, 41, Torrelló (Barcelona)', mapQuery: 'Carrer Núria, 41, Torelló', phone: '938 592 656' },
      { name: 'Toni Lopez', address: 'Monforte de Lemos S/N - CC Vaguada Local B-62, Madrid', mapQuery: 'Toni López, CC Vaguada, Madrid', phone: '917 383 173' },
    ],
  },
  {
    name: 'Fina Garcia',
    website: 'https://finagarcia.com/collections/solitario',
    touchPoints: [
      { name: 'Fina García Parquesur', address: 'Avenida de Gran Bretaña s/n, 28916, Leganes', mapQuery: 'Fina Garcia Parquesur, Leganes', phone: '916 860 324' },
      { name: 'Fina García Mataró', address: 'Carrer Estrasburg, 5, 08304, Mataró', mapQuery: 'Carrer Estrasburg, 5, Mataró', phone: '937 414 180' },
      { name: 'Fina García Splau', address: 'Avinguda del Baix Llobregat s/n, 08940, Cornellà de Llobregat', mapQuery: 'Av. del Baix Llobregat, Cornellà', phone: '934 719 285' },
      { name: 'Fina García Marbella', address: 'Carretera de Ojén s/n, 29600 Marbella', mapQuery: 'C. Ojén, Marbella', phone: '952 276 259' },
      { name: 'Fina García Plaza Catalunya', address: 'Carrer Pelayo, 62, 08001, Barcelona', mapQuery: 'Carrer de Pelai, 62, Barcelona', phone: '933 175 593' },
      { name: 'Fina García La Jonquera', address: 'Avenida de Galicia, 22-28, 17700, La Jonquera', mapQuery: 'Joyería Fina García, La Jonquera', phone: '972 554 895' },
      { name: 'Fina García Gran Via 2', address: 'Avenida de la Gran Vía, 75, 08908, L\'Hospitalet de Llobregat', mapQuery: 'Avinguda de la Granvia, 75, L\'Hospitalet', phone: '932 590 001' },
      { name: 'Fina García Lleida', address: 'Plaça Sant Joan, 2, 25007 Lleida', mapQuery: 'Plaça de Sant Joan, 2, Lleida', phone: '973 232 983' },
      { name: 'Fina García Sant Cugat', address: 'Avinguda de la Vía Augusta, 2, 08174, Sant Cugat del Vallès', mapQuery: 'Joyería Fina García, Sant Cugat', phone: '936 255 002' },
      { name: 'Fina García La Maquinista', address: 'Paseo Potosí, 2, 08030, Barcelona', mapQuery: 'Carrer de Potosí, 2, Barcelona', phone: '933 608 232' },
      { name: 'Fina García Girona', address: 'Camí dels Carlins, 10, 17190 Salt, Girona', mapQuery: 'Camí dels Carlins, 10, Salt', phone: '972 439 135' },
      { name: 'Fina García Fabra i Puig', address: 'Passeig Fabra i Puig, 118, 08016, Barcelona', mapQuery: 'Pg. de Fabra i Puig, 118, Barcelona', phone: '934 080 638' },
      { name: 'Fina García Diagonal Mar', address: 'Avinguda Diagonal, 3, 08019, Barcelona', mapQuery: 'Fina Garcia Diagonal Mar, Barcelona', phone: '933 563 652' },
      { name: 'Fina García Baricentro', address: 'N-150 Km. 6, 7, 08210, Barberà del Vallès', mapQuery: 'Fina García Baricentro', phone: '937 185 062' },
      { name: 'Fina García Barnasud', address: 'Carrer del Progrés, 69, 08850, Gava', mapQuery: 'Carrer del Progrés, 69, Gava', phone: '936 382 255' },
      { name: 'Fina García Màgic', address: 'Carrer de la Concòrdia, 1, 08917, Badalona', mapQuery: 'Joyería Fina García, Badalona', phone: '932 245 523' },
      { name: 'Fina García Montigalà', address: 'Passeig Olof Palme, 28, 08917 Badalona', mapQuery: 'Passeig Olof Palme, 28, Badalona', phone: '933 953 943' },
      { name: 'Fina García Gran de Gracia', address: 'Carrer Gran de Gràcia, 62, 08012, Barcelona', mapQuery: 'Carrer Gran de Gràcia, 62, Barcelona', phone: '934 102 206' },
      { name: 'Fina García Finistrelles', address: 'Carrer Laurea Miró, 4, 08950, Esplugues de Llobregat', mapQuery: 'CC Finestrelles, Esplugues', phone: '937 829 463' },
      { name: 'Fina García Manresa', address: 'Carrer de Alvar Aalto, 08240, Manresa', mapQuery: 'Joyería Fina García, Manresa', phone: '931 378 198' },
      { name: 'Fina García Santa Susana', address: 'Carretera N-II Km 673, 08398, Santa Susana', mapQuery: 'Joyería Fina García, Santa Susana', phone: '937 679 377' },
      { name: 'Fina García Parc Central', address: 'Avenida Vidal i Barraquer 15-17, 43005, Tarragona', mapQuery: 'Carrer del Cardenal Vidal i Barraquer, 15, Tarragona', phone: '977 215 560' },
      { name: 'Fina García Puerto Venecia', address: 'Travesera de los Jardines Reales, 7, 50021, Zaragoza', mapQuery: 'Tr.ª de los Jardines Reales, 7, Zaragoza', phone: '876 043 785' },
    ],
  },
];

// ==================== COMBINED EXPORTS ====================

export const ALL_STORES: StoreLocation[] = [
  ...INDIA_OWN_STORES,
  ...INDIA_SIS_SHOPPERS_STOP,
  ...INDIA_SIS_JUST_IN_TIME,
  ...MALAYSIA_STORES,
  ...DUBAI_STORES,
];

// Haversine formula to calculate distance between two coordinates in km
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
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

  storesWithDistance.sort((a, b) => {
    const diff = a.distance - b.distance;
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
