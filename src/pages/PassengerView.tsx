import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Bus,
  Map as MapIcon,
  Clock,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Navigation,
  MapPin,
  X,
  Ruler,
  Timer,
} from 'lucide-react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { useBuses } from '../hooks/useBuses';
import { BusService } from '../services/BusService';
import type { BusRoute, Bus as BusType } from '../services/BusService';
import 'leaflet/dist/leaflet.css';

// ─── Passenger fixed location ───────────────────────────────
const PASSENGER_LAT = 6.975606664917644;
const PASSENGER_LNG = 79.91553143475886;

// ─── Haversine distance (km) ────────────────────────────────
function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Map fly-to controller ──────────────────────────────────
function MapController({
  target,
}: {
  target: { lat: number; lng: number } | null;
}) {
  const map = useMap();
  const prevTarget = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (
      target &&
      (prevTarget.current?.lat !== target.lat ||
        prevTarget.current?.lng !== target.lng)
    ) {
      map.flyTo([target.lat, target.lng], 14, { duration: 1.4 });
      prevTarget.current = target;
    }
  }, [target, map]);

  return null;
}

// ─── Custom bus marker icon ─────────────────────────────────
const createBusIcon = (highlighted = false) =>
  new DivIcon({
    className: 'custom-bus-marker',
    html: `<div class="bus-marker-icon${highlighted ? ' bus-marker-highlighted' : ''}">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/>
        <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/>
        <circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>
      </svg>
    </div>`,
    iconSize: highlighted ? [44, 44] : [36, 36],
    iconAnchor: highlighted ? [22, 22] : [18, 18],
  });

// ─── Passenger marker icon ──────────────────────────────────
const passengerIcon = new DivIcon({
  className: 'custom-bus-marker',
  html: `<div style="background:#2563eb;border:3px solid white;border-radius:50%;width:18px;height:18px;box-shadow:0 2px 8px rgba(37,99,235,0.5)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export default function PassengerView() {
  const buses = useBuses();
  const [popularRoutes, setPopularRoutes] = useState<BusRoute[]>([]);
  const [newlyAddedRoutes, setNewlyAddedRoutes] = useState<BusRoute[]>([]);
  const [routesOpen, setRoutesOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState<BusType | null>(null);
  const [mapTarget, setMapTarget] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    setPopularRoutes(BusService.getPopularRoutes());
    setNewlyAddedRoutes(BusService.getNewlyAddedRoutes());

    const unsub = BusService.subscribe(() => {
      setPopularRoutes(BusService.getPopularRoutes());
      setNewlyAddedRoutes(BusService.getNewlyAddedRoutes());
    });
    return unsub;
  }, []);

  // When the live bus position updates, keep tracking info fresh
  const trackedBusLive = useMemo(() => {
    if (!selectedBus) return null;
    return buses.find((b) => b.id === selectedBus.id) ?? selectedBus;
  }, [buses, selectedBus]);

  const distance = useMemo(() => {
    if (!trackedBusLive) return null;
    return haversineKm(PASSENGER_LAT, PASSENGER_LNG, trackedBusLive.lat, trackedBusLive.lng);
  }, [trackedBusLive]);

  const etaMinutes = useMemo(() => {
    if (distance === null) return null;
    return (distance / 40) * 60; // 40 km/h
  }, [distance]);

  const handleTrackLive = (bus: BusType) => {
    setSelectedBus(bus);
    setMapTarget({ lat: bus.lat, lng: bus.lng });
  };

  const handleCloseTracking = () => {
    setSelectedBus(null);
    setMapTarget(null);
  };

  const mapCenter: [number, number] = [6.9271, 79.8612];
  const activeBuses = useMemo(() => buses.filter((b) => b.status === 'Active'), [buses]);

  return (
    <div className="space-y-4 pb-20 lg:pb-0">
      {/* ===== LIVE MAP ===== */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="relative h-[300px] lg:h-[420px]">
          {/* Map Overlay Info */}
          <div className="absolute top-3 left-3 z-[500] bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md flex items-center gap-2">
            <Navigation size={14} className="text-blue-600" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Live Map • Real-time tracking
            </span>
          </div>

          {/* Active Bus Count */}
          <div className="absolute top-3 right-3 z-[500] bg-blue-600 px-3 py-1.5 rounded-lg shadow-md">
            <span className="text-xs font-bold text-white">
              {activeBuses.length} Active
            </span>
          </div>

          {typeof window !== 'undefined' && (
            <MapContainer
              center={mapCenter}
              zoom={12}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* Fly-to controller */}
              <MapController target={mapTarget} />

              {/* Passenger location marker */}
              <Marker position={[PASSENGER_LAT, PASSENGER_LNG]} icon={passengerIcon}>
                <Popup>
                  <div className="p-1">
                    <p className="font-bold text-sm text-blue-600">📍 Your Location</p>
                    <p className="text-xs text-gray-500">{PASSENGER_LAT.toFixed(4)}, {PASSENGER_LNG.toFixed(4)}</p>
                  </div>
                </Popup>
              </Marker>

              {/* Bus Markers */}
              {buses.map((bus) => (
                <Marker
                  key={bus.id}
                  position={[bus.lat, bus.lng]}
                  icon={createBusIcon(selectedBus?.id === bus.id)}
                >
                  <Popup>
                    <div className="p-1 min-w-[140px]">
                      <div className="flex items-center gap-2 mb-1">
                        <Bus size={14} className="text-blue-600" />
                        <span className="font-bold text-sm">Route {bus.busNo}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{bus.route}</p>
                      <div className="flex items-center gap-1">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            bus.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        />
                        <span className="text-xs font-medium">{bus.status}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Driver: {bus.driver}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>

      {/* ===== TRACK LIVE INFO PANEL ===== */}
      {selectedBus && trackedBusLive && distance !== null && etaMinutes !== null && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-lg shadow-blue-500/30 text-white">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider opacity-90">
                Tracking Live
              </span>
            </div>
            <button
              onClick={handleCloseTracking}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close tracking"
            >
              <X size={16} />
            </button>
          </div>

          {/* Bus info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Bus size={22} />
            </div>
            <div>
              <h3 className="font-black text-lg leading-tight">Route {trackedBusLive.busNo}</h3>
              <p className="text-sm opacity-80">{trackedBusLive.route}</p>
            </div>
            <span className={`ml-auto px-2 py-1 rounded text-xs font-bold ${
              trackedBusLive.status === 'Active'
                ? 'bg-green-400/30 text-green-100'
                : 'bg-gray-400/30 text-gray-100'
            }`}>
              {trackedBusLive.status}
            </span>
          </div>

          {/* Distance & ETA */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/15 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Ruler size={14} className="opacity-80" />
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Distance</span>
              </div>
              <p className="text-2xl font-black">{distance.toFixed(2)}</p>
              <p className="text-xs opacity-70 font-medium">km away</p>
            </div>
            <div className="bg-white/15 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Timer size={14} className="opacity-80" />
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">ETA</span>
              </div>
              <p className="text-2xl font-black">
                {etaMinutes < 60
                  ? `${Math.round(etaMinutes)}`
                  : `${Math.floor(etaMinutes / 60)}h ${Math.round(etaMinutes % 60)}`}
              </p>
              <p className="text-xs opacity-70 font-medium">
                {etaMinutes < 60 ? 'mins @ 40 km/h' : 'hrs @ 40 km/h'}
              </p>
            </div>
          </div>

          {/* Passenger & Bus coords */}
          <div className="mt-3 flex items-center gap-2 text-[10px] opacity-70">
            <MapPin size={10} />
            <span>Your location: {PASSENGER_LAT.toFixed(4)}, {PASSENGER_LNG.toFixed(4)}</span>
          </div>
        </div>
      )}

      {/* ===== ACTIVE BUSES LIST ===== */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold dark:text-white flex items-center gap-2">
          <Bus size={20} className="text-blue-600" />
          Active Buses
        </h2>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {buses.length} total
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {buses.map((bus) => {
          const dist = haversineKm(PASSENGER_LAT, PASSENGER_LNG, bus.lat, bus.lng);
          const eta = (dist / 40) * 60;
          const isTracked = selectedBus?.id === bus.id;
          return (
            <div
              key={bus.id}
              className={`bg-white dark:bg-gray-900 border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all ${
                isTracked
                  ? 'border-blue-500 ring-2 ring-blue-500/30'
                  : 'border-gray-200 dark:border-gray-800'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${isTracked ? 'bg-blue-600 text-white' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'}`}>
                    <Bus size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg leading-tight dark:text-white">
                      Route {bus.busNo}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{bus.route}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-bold rounded ${
                    bus.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {bus.status}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t dark:border-gray-800 pt-4">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Clock size={16} />
                  <span className="text-sm font-medium">
                    ~{Math.round(eta)} min • {dist.toFixed(1)} km
                  </span>
                </div>
                <button
                  onClick={() => isTracked ? handleCloseTracking() : handleTrackLive(bus)}
                  className={`text-sm font-bold flex items-center gap-1 transition-colors ${
                    isTracked
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-blue-600 hover:underline'
                  }`}
                >
                  {isTracked ? (
                    <><X size={14} /> Stop</>
                  ) : (
                    <>Track Live <ChevronRight size={16} /></>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== POPULAR ROUTES DROPDOWN ===== */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={() => setRoutesOpen(!routesOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
              <MapIcon size={20} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-base dark:text-white">Popular Bus Routes</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {popularRoutes.length} routes with schedules
              </p>
            </div>
          </div>
          {routesOpen ? (
            <ChevronUp size={20} className="text-gray-400" />
          ) : (
            <ChevronDown size={20} className="text-gray-400" />
          )}
        </button>

        <div className={`dropdown-panel ${routesOpen ? 'open' : 'closed'}`}>
          <div className="p-4 pt-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-bold text-gray-500 uppercase border-b dark:border-gray-800">
                    <th className="pb-3 pt-2 pr-2">Route No</th>
                    <th className="pb-3 pt-2 pr-2">Destination</th>
                    <th className="pb-3 pt-2">Departure Times</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-800">
                  {popularRoutes.map((route, idx) => (
                    <tr
                      key={route.id}
                      className={`text-gray-700 dark:text-gray-300 ${
                        idx % 2 === 0
                          ? 'bg-white dark:bg-gray-900'
                          : 'bg-slate-50 dark:bg-gray-800/30'
                      }`}
                    >
                      <td className="py-3 pr-2">
                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded">
                          {route.routeNo}
                        </span>
                      </td>
                      <td className="py-3 pr-2">
                        <div>
                          <p className="font-bold text-sm">{route.name}</p>
                          <p className="text-xs text-gray-500">{route.stops} stops</p>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {route.times.map((time) => (
                            <span
                              key={time}
                              className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded font-medium"
                            >
                              {time}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ===== NEW ROUTES ADDED SECTION ===== */}
      <div className="flex items-center gap-2 px-1 mt-6">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        <h2 className="text-lg font-bold dark:text-white">New Routes Added</h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">({newlyAddedRoutes.length})</span>
      </div>

      {newlyAddedRoutes.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center">
          <Bus size={32} className="text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No new routes yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {newlyAddedRoutes.map((route, idx) => {
            const colors = [
              { bg: 'from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900', border: 'border-blue-200 dark:border-blue-900/30', icon: 'bg-blue-600', label: 'text-blue-600' },
              { bg: 'from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-900', border: 'border-purple-200 dark:border-purple-900/30', icon: 'bg-purple-600', label: 'text-purple-600' },
              { bg: 'from-emerald-50 to-white dark:from-emerald-950/20 dark:to-gray-900', border: 'border-emerald-200 dark:border-emerald-900/30', icon: 'bg-emerald-600', label: 'text-emerald-600' },
              { bg: 'from-amber-50 to-white dark:from-amber-950/20 dark:to-gray-900', border: 'border-amber-200 dark:border-amber-900/30', icon: 'bg-amber-600', label: 'text-amber-600' },
            ];
            const c = colors[idx % colors.length];
            return (
              <div
                key={route.id}
                className={`bg-gradient-to-br ${c.bg} border ${c.border} rounded-2xl p-4 shadow-sm`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2.5 ${c.icon} text-white rounded-xl`}>
                    <Bus size={22} />
                  </div>
                  <div>
                    <span className={`text-xs font-bold ${c.label} uppercase tracking-wider`}>
                      New Route
                    </span>
                    <h4 className="font-bold text-lg leading-tight dark:text-white">{route.routeNo}</h4>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {route.name}
                </p>
                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800/50 pt-3">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock size={14} />
                    <span className="text-xs font-medium">{route.stops} stops</span>
                  </div>
                  <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-700">
                    Active
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
