export interface Bus {
  id: string;
  busNo: string;
  route: string;
  lat: number;
  lng: number;
  status: 'Active' | 'Idle';
  driver: string;
  eta?: number;
}

export interface BusRoute {
  id: string;
  routeNo: string;
  name: string;
  origin: string;
  destination: string;
  stops: number;
  activeBuses: number;
  times: string[];
}

export interface User {
  email: string;
  role: 'passenger' | 'driver' | 'admin';
  uid: string;
}

// ============================================================
// ALL BUSES DATA (mutable for admin add/delete)
// ============================================================
let allBuses: Bus[] = [
  // Original buses
  {
    id: '138-1',
    busNo: '138',
    route: 'Kottawa - Pettah',
    lat: 6.9271,
    lng: 79.8612,
    status: 'Active',
    driver: 'Saman',
  },
  {
    id: '120-1',
    busNo: '120',
    route: 'Piliyandala - Pettah',
    lat: 6.84,
    lng: 79.92,
    status: 'Idle',
    driver: 'Perera',
  },
  // New buses
  {
    id: '98-6-1',
    busNo: '98-6',
    route: 'Balangoda - Colombo (Old Route)',
    lat: 6.6638,
    lng: 80.6955,
    status: 'Active',
    driver: 'Kumara',
  },
  {
    id: '122-03-1',
    busNo: '122/03',
    route: 'Embilipitiya - Colombo',
    lat: 6.3433,
    lng: 80.8568,
    status: 'Active',
    driver: 'Silva',
  },
  // Additional buses for popular routes
  {
    id: '01-1',
    busNo: '01',
    route: 'Kandy - Colombo',
    lat: 7.2906,
    lng: 80.6337,
    status: 'Active',
    driver: 'Fernando',
  },
  {
    id: '02-1',
    busNo: '2',
    route: 'Matara - Colombo',
    lat: 5.9549,
    lng: 80.555,
    status: 'Idle',
    driver: 'Rajapaksa',
  },
  {
    id: '02-1-1',
    busNo: '2-1',
    route: 'Galle - Colombo',
    lat: 6.0329,
    lng: 80.217,
    status: 'Active',
    driver: 'Jayawardene',
  },
  {
    id: '05-1',
    busNo: '5',
    route: 'Kurunegala - Colombo',
    lat: 7.4863,
    lng: 80.3623,
    status: 'Idle',
    driver: 'Bandara',
  },
  {
    id: '08-1',
    busNo: '08',
    route: 'Matale - Colombo',
    lat: 7.4675,
    lng: 80.6234,
    status: 'Active',
    driver: 'Dissanayake',
  },
  {
    id: '15-1-1',
    busNo: '15-1',
    route: 'Anuradapura - Colombo',
    lat: 8.3114,
    lng: 80.4037,
    status: 'Idle',
    driver: 'Wickramasinghe',
  },
  {
    id: '17-1',
    busNo: '17',
    route: 'Panadura - Kandy',
    lat: 6.7136,
    lng: 79.9071,
    status: 'Active',
    driver: 'Senanayake',
  },
  {
    id: '32-4-1',
    busNo: '32-4',
    route: 'Tangalle - Colombo',
    lat: 6.0238,
    lng: 80.7876,
    status: 'Idle',
    driver: 'Gunawardena',
  },
  {
    id: '48-1-1',
    busNo: '48-1',
    route: 'Batticaloa - Colombo',
    lat: 7.731,
    lng: 81.6747,
    status: 'Active',
    driver: 'Sivakumar',
  },
  {
    id: '15-87-1',
    busNo: '15-87',
    route: 'Jaffna - Colombo',
    lat: 9.6615,
    lng: 80.0255,
    status: 'Idle',
    driver: 'Thiruchelvam',
  },
];

// ============================================================
// POPULAR ROUTES DATA (mutable)
// ============================================================
let popularRoutes: BusRoute[] = [
  {
    id: 'route-01',
    routeNo: '01',
    name: 'Kandy - Colombo',
    origin: 'Kandy',
    destination: 'Colombo',
    stops: 25,
    activeBuses: 4,
    times: ['05:30 AM', '08:00 AM', '11:30 AM', '02:00 PM', '05:30 PM'],
  },
  {
    id: 'route-2',
    routeNo: '2',
    name: 'Matara - Colombo',
    origin: 'Matara',
    destination: 'Colombo',
    stops: 32,
    activeBuses: 3,
    times: ['05:00 AM', '07:30 AM', '10:00 AM', '01:00 PM', '04:00 PM'],
  },
  {
    id: 'route-2-1',
    routeNo: '2-1',
    name: 'Galle - Colombo',
    origin: 'Galle',
    destination: 'Colombo',
    stops: 28,
    activeBuses: 5,
    times: ['05:30 AM', '08:30 AM', '11:00 AM', '02:30 PM', '05:00 PM'],
  },
  {
    id: 'route-5',
    routeNo: '5',
    name: 'Kurunegala - Colombo',
    origin: 'Kurunegala',
    destination: 'Colombo',
    stops: 18,
    activeBuses: 2,
    times: ['06:00 AM', '09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM'],
  },
  {
    id: 'route-08',
    routeNo: '08',
    name: 'Matale - Colombo',
    origin: 'Matale',
    destination: 'Colombo',
    stops: 22,
    activeBuses: 2,
    times: ['05:45 AM', '08:15 AM', '11:45 AM', '02:15 PM', '05:45 PM'],
  },
  {
    id: 'route-15-1',
    routeNo: '15-1',
    name: 'Anuradapura - Colombo',
    origin: 'Anuradapura',
    destination: 'Colombo',
    stops: 20,
    activeBuses: 3,
    times: ['06:00 AM', '09:30 AM', '01:00 PM', '04:30 PM', '08:00 PM'],
  },
  {
    id: 'route-17',
    routeNo: '17',
    name: 'Panadura - Kandy',
    origin: 'Panadura',
    destination: 'Kandy',
    stops: 30,
    activeBuses: 2,
    times: ['05:30 AM', '08:00 AM', '11:30 AM', '02:00 PM', '05:00 PM'],
  },
  {
    id: 'route-32-4',
    routeNo: '32-4',
    name: 'Tangalle - Colombo',
    origin: 'Tangalle',
    destination: 'Colombo',
    stops: 26,
    activeBuses: 2,
    times: ['05:00 AM', '07:30 AM', '10:30 AM', '01:30 PM', '04:30 PM'],
  },
  {
    id: 'route-48-1',
    routeNo: '48-1',
    name: 'Batticaloa - Colombo',
    origin: 'Batticaloa',
    destination: 'Colombo',
    stops: 18,
    activeBuses: 2,
    times: ['06:00 AM', '09:00 AM', '12:30 PM', '03:30 PM', '07:00 PM'],
  },
  {
    id: 'route-15-87',
    routeNo: '15-87',
    name: 'Jaffna - Colombo',
    origin: 'Jaffna',
    destination: 'Colombo',
    stops: 15,
    activeBuses: 2,
    times: ['05:30 AM', '08:30 AM', '12:00 PM', '03:00 PM', '06:30 PM'],
  },
];

// Routes that were specifically added (shown in "New Routes" panel)
let newlyAddedRoutes: BusRoute[] = [
  {
    id: 'route-98-6',
    routeNo: '98-6',
    name: 'Balangoda - Colombo (Old Route)',
    origin: 'Balangoda',
    destination: 'Colombo',
    stops: 20,
    activeBuses: 1,
    times: ['05:00 AM', '08:00 AM', '12:00 PM', '03:00 PM', '06:00 PM'],
  },
  {
    id: 'route-122-03',
    routeNo: '122/03',
    name: 'Embilipitiya - Colombo',
    origin: 'Embilipitiya',
    destination: 'Colombo',
    stops: 22,
    activeBuses: 1,
    times: ['05:30 AM', '09:00 AM', '12:30 PM', '04:00 PM', '07:00 PM'],
  },
];

// ============================================================
// ADMIN ROUTES DATA (mutable fleet management list)
// ============================================================
let adminRoutes: BusRoute[] = [
  ...popularRoutes,
  {
    id: 'route-138',
    routeNo: '138',
    name: 'Kottawa - Pettah',
    origin: 'Kottawa',
    destination: 'Pettah',
    stops: 12,
    activeBuses: 2,
    times: ['06:00 AM', '09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM'],
  },
  {
    id: 'route-120',
    routeNo: '120',
    name: 'Piliyandala - Pettah',
    origin: 'Piliyandala',
    destination: 'Pettah',
    stops: 24,
    activeBuses: 1,
    times: ['05:30 AM', '08:30 AM', '11:30 AM', '02:30 PM', '05:30 PM'],
  },
  ...newlyAddedRoutes,
];

// ============================================================
// CHANGE LISTENERS (for cross-component reactivity)
// ============================================================
type ChangeListener = () => void;
const listeners: Set<ChangeListener> = new Set();

// ============================================================
// BUS SERVICE METHODS
// ============================================================
export const BusService = {
  // Subscribe to data changes
  subscribe: (listener: ChangeListener): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // Notify all listeners
  _notify: () => {
    listeners.forEach((l) => l());
  },

  // Get all buses
  getBuses: (callback: (buses: Bus[]) => void) => {
    callback([...allBuses]);
  },

  // Get popular routes
  getPopularRoutes: (): BusRoute[] => {
    return [...popularRoutes];
  },

  // Get admin routes (fleet management)
  getAdminRoutes: (): BusRoute[] => {
    return [...adminRoutes];
  },

  // Get newly added routes (for passenger "New Routes" panel)
  getNewlyAddedRoutes: (): BusRoute[] => {
    return [...newlyAddedRoutes];
  },

  // Add a new route + bus (admin action)
  addRoute: (route: BusRoute, bus: Bus) => {
    // Add to admin list
    adminRoutes = [...adminRoutes, route];
    // Add to popular routes so passenger can see it
    popularRoutes = [...popularRoutes, route];
    // Add to newly added routes panel
    newlyAddedRoutes = [...newlyAddedRoutes, route];
    // Add the bus to all buses
    allBuses = [...allBuses, bus];
    BusService._notify();
  },

  // Delete a route by id (admin action)
  deleteRoute: (routeId: string) => {
    const route = adminRoutes.find((r) => r.id === routeId);
    if (!route) return;

    adminRoutes = adminRoutes.filter((r) => r.id !== routeId);
    popularRoutes = popularRoutes.filter((r) => r.id !== routeId);
    newlyAddedRoutes = newlyAddedRoutes.filter((r) => r.id !== routeId);

    // Remove associated buses by matching bus route name
    allBuses = allBuses.filter((b) => b.route !== route.name);
    BusService._notify();
  },

  // Update driver location (simulates Firebase sync)
  updateLocation: async (busId: string, lat: number, lng: number) => {
    const bus = allBuses.find((b) => b.id === busId);
    if (bus) {
      bus.lat = lat;
      bus.lng = lng;
    }
    console.log(`[Firebase Sync] Bus ${busId} moved to ${lat}, ${lng}`);
    return true;
  },

  // Simulate Firebase Auth Login & Role Check
  login: async (email: string, password: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (!email || !password) {
      throw new Error('Please enter both email and password');
    }

    let role: 'passenger' | 'driver' | 'admin' = 'passenger';
    if (email.toLowerCase().includes('admin')) role = 'admin';
    else if (email.toLowerCase().includes('driver')) role = 'driver';

    return {
      email,
      role,
      uid: Math.random().toString(36).substr(2, 9),
    };
  },

  // Simulate moving buses (for live tracking)
  simulateBusMovement: (buses: Bus[]): Bus[] => {
    return buses.map((bus) => {
      if (bus.status === 'Active') {
        return {
          ...bus,
          lat: bus.lat + (Math.random() - 0.5) * 0.002,
          lng: bus.lng + (Math.random() - 0.5) * 0.002,
        };
      }
      return bus;
    });
  },
};
