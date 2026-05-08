import { useState, useEffect, useRef } from 'react';
import { BusService } from '../services/BusService';
import type { Bus } from '../services/BusService';

export function useBuses() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Initial load
    BusService.getBuses(setBuses);

    // Start live simulation
    intervalRef.current = setInterval(() => {
      setBuses((prev) => BusService.simulateBusMovement(prev));
    }, 3000);

    // Listen for admin route add/delete events
    const unsubscribe = BusService.subscribe(() => {
      BusService.getBuses(setBuses);
    });

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      unsubscribe();
    };
  }, []);

  return buses;
}
