import { useState, useEffect, useRef } from 'react';
import { Navigation, Play, Square, Users, Wifi, Cpu, Gauge, Zap, Fuel, AlertCircle } from 'lucide-react';
import { BusService } from '../services/BusService';
import type { User } from '../services/BusService';

interface DriverViewProps {
  user: User;
}

// Fake nearby passengers
const NEARBY_PASSENGERS = [
  { id: 'p1', name: 'Kasun Perera', distance: '0.3 km', stop: 'Kaduwela Junction', avatar: 'KP', color: 'bg-blue-500' },
  { id: 'p2', name: 'Nimasha Silva', distance: '0.7 km', stop: 'Malabe Town', avatar: 'NS', color: 'bg-purple-500' },
  { id: 'p3', name: 'Ruwan Fernando', distance: '1.2 km', stop: 'Athurugiriya', avatar: 'RF', color: 'bg-emerald-500' },
  { id: 'p4', name: 'Dilini Jayawardena', distance: '1.8 km', stop: 'Koswatta', avatar: 'DJ', color: 'bg-amber-500' },
  { id: 'p5', name: 'Sahan Bandara', distance: '2.1 km', stop: 'Thalawathugoda', avatar: 'SB', color: 'bg-red-500' },
];

// Sensor definitions
const SENSORS = [
  { id: 'gps', label: 'GPS Module', icon: Navigation, status: 'Online', value: '12 satellites' },
  { id: 'engine', label: 'Engine Monitor', icon: Cpu, status: 'Online', value: 'Normal' },
  { id: 'speed', label: 'Speed Sensor', icon: Gauge, status: 'Online', value: '0 km/h' },
  { id: 'brake', label: 'Brake Sensor', icon: AlertCircle, status: 'Online', value: 'Pressure OK' },
  { id: 'fuel', label: 'Fuel Monitor', icon: Fuel, status: 'Online', value: '78%' },
  { id: 'elec', label: 'Electrical', icon: Zap, status: 'Online', value: '24.1 V' },
];

export default function DriverView({ user }: DriverViewProps) {
  const [isLive, setIsLive] = useState(false);
  const [location, setLocation] = useState({ lat: 6.9271, lng: 79.8612 });
  const [speed, setSpeed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isLive) {
      intervalRef.current = setInterval(() => {
        setLocation((prev) => {
          const newLat = prev.lat + (Math.random() - 0.5) * 0.0005;
          const newLng = prev.lng + (Math.random() - 0.5) * 0.0005;
          BusService.updateLocation('bus-138', newLat, newLng);
          return { lat: newLat, lng: newLng };
        });
        setSpeed(Math.floor(Math.random() * 20) + 30); // 30–50 km/h
      }, 5000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setSpeed(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive]);

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20 lg:pb-0">
      {/* Driver Console Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          Driver Console
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Bus ID: 138 • Assigned to {user.email}
        </p>

        <div className="flex flex-col items-center py-6">
          {/* Status Indicator */}
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${
              isLive
                ? 'bg-green-500 shadow-lg shadow-green-500/50'
                : 'bg-gray-200 dark:bg-gray-800'
            }`}
          >
            <Navigation
              size={40}
              className={isLive ? 'text-white' : 'text-gray-400'}
            />
          </div>

          {/* Status Text */}
          <h2 className="text-2xl font-black mb-2 dark:text-white">
            {isLive ? 'SYSTEM LIVE' : 'SYSTEM IDLE'}
          </h2>
          <p className="text-gray-500 text-center mb-8 px-6 text-sm">
            {isLive
              ? 'Broadcasting location to passengers in real-time.'
              : 'Press Start Trip to begin broadcasting your location to passengers.'}
          </p>

          {/* Action Button */}
          <button
            onClick={() => setIsLive(!isLive)}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all active:scale-[0.98] ${
              isLive
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
            }`}
          >
            {isLive ? (
              <>
                <Square size={20} />
                <span>End Trip</span>
              </>
            ) : (
              <>
                <Play size={20} />
                <span>Start Trip</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ===== NEARBY PASSENGERS (only when live) ===== */}
      {isLive && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                <Users size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Nearby Passengers</h3>
                <p className="text-xs text-gray-500">Using BusGo on your route</p>
              </div>
            </div>
            <span className="bg-blue-600 text-white text-xs font-black px-2.5 py-1 rounded-full">
              {NEARBY_PASSENGERS.length} found
            </span>
          </div>

          <div className="space-y-3">
            {NEARBY_PASSENGERS.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
              >
                {/* Avatar */}
                <div className={`w-10 h-10 ${p.color} rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                  {p.avatar}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{p.name}</p>
                  <p className="text-xs text-gray-500 truncate">📍 {p.stop}</p>
                </div>
                {/* Distance + badge */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{p.distance}</span>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">On Route</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Location Display */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">
          Current Location
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Latitude</span>
            <span className="text-sm font-mono font-bold dark:text-white">
              {location.lat.toFixed(6)}
            </span>
          </div>
          <div className="border-t dark:border-gray-800" />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Longitude</span>
            <span className="text-sm font-mono font-bold dark:text-white">
              {location.lng.toFixed(6)}
            </span>
          </div>
          <div className="border-t dark:border-gray-800" />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Speed</span>
            <span className="text-sm font-mono font-bold dark:text-white">
              {speed} km/h
            </span>
          </div>
          <div className="border-t dark:border-gray-800" />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}
              />
              <span className="text-sm font-medium dark:text-white">
                {isLive ? 'Updating...' : 'Standby'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SENSOR STATUS PANEL ===== */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
              <Wifi size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">All Sensors Online</h3>
              <p className="text-xs text-gray-500">Vehicle systems nominal</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-green-600">6/6 Active</span>
          </div>
        </div>

        {/* Sensor Grid */}
        <div className="grid grid-cols-2 gap-3">
          {SENSORS.map((sensor) => {
            const Icon = sensor.icon;
            return (
              <div
                key={sensor.id}
                className="flex items-center gap-2.5 p-3 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-xl"
              >
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg flex-shrink-0">
                  <Icon size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-500 font-medium truncate">{sensor.label}</p>
                  <p className="text-xs font-bold text-green-700 dark:text-green-400 truncate">{sensor.value}</p>
                </div>
                <div className="ml-auto flex-shrink-0">
                  <span className="w-2 h-2 bg-green-500 rounded-full block" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Uptime Footer */}
        <div className="mt-4 pt-4 border-t dark:border-gray-800 flex items-center justify-between">
          <span className="text-xs text-gray-500">System uptime</span>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">4h 23m • No faults detected</span>
        </div>
      </div>
    </div>
  );
}
