import { useState, useEffect } from 'react';
import {
  Bus,
  MapPin,
  Navigation,
  Search,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Loader2,
  Map as MapIcon,
  ArrowRight,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────
interface BusRoute {
  Category: string;
  Route_No_: string | number;
  Origin___Destination: string;
  Popular_Intermediate_Stops___Transit_Points: string;
}

const SHEET_URL =
  'https://script.google.com/macros/s/AKfycbz8NxrlDWpzSidGMdkn-MJVOt5_fvsXKdhjodaNP3azUaNPdFlqOf7r1M0tLAhyw-YKXQ/exec';

const CATEGORY_COLORS: Record<string, { bg: string; badge: string; icon: string; border: string }> = {
  Intercity: {
    bg: 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/10',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    icon: 'bg-blue-600',
    border: 'border-blue-100 dark:border-blue-900/30',
  },
  Suburban: {
    bg: 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/10',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    icon: 'bg-emerald-600',
    border: 'border-emerald-100 dark:border-emerald-900/30',
  },
  Expressway: {
    bg: 'from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/10',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    icon: 'bg-violet-600',
    border: 'border-violet-100 dark:border-violet-900/30',
  },
};

function getCategoryStyle(cat: string) {
  return (
    CATEGORY_COLORS[cat] ?? {
      bg: 'from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/10',
      badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      icon: 'bg-gray-600',
      border: 'border-gray-100 dark:border-gray-800',
    }
  );
}

// ─── Stop → Routes map builder ─────────────────────────────────
function buildStopMap(routes: BusRoute[]): Map<string, BusRoute[]> {
  const map = new Map<string, BusRoute[]>();
  routes.forEach((route) => {
    const stops = route.Popular_Intermediate_Stops___Transit_Points
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    stops.forEach((stop) => {
      const existing = map.get(stop) ?? [];
      existing.push(route);
      map.set(stop, existing);
    });
  });
  return map;
}

// ─── Transit Stop Card ────────────────────────────────────────
function TransitStopCard({
  stop,
  routes,
  onTrackLive,
}: {
  stop: string;
  routes: BusRoute[];
  onTrackLive: (routeNo: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
      >
        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-xl flex-shrink-0">
          <MapPin size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{stop}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {routes.length} bus{routes.length > 1 ? 'ses' : ''} pass through
          </p>
        </div>
        <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full flex-shrink-0">
          {routes.length}
        </span>
        <div className="ml-1 text-gray-400 flex-shrink-0">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {expanded && (
        <div className="border-t dark:border-gray-800 p-4 pt-3 space-y-3 bg-gray-50/50 dark:bg-gray-800/20">
          {routes.map((route) => {
            const style = getCategoryStyle(route.Category);
            return (
              <div
                key={`${route.Route_No_}`}
                className={`bg-gradient-to-r ${style.bg} border ${style.border} rounded-xl p-3`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-lg text-white ${style.icon}`}
                  >
                    {route.Route_No_}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                    {route.Category}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <ArrowRight size={14} className="text-gray-400 flex-shrink-0" />
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                    {route.Origin___Destination}
                  </p>
                </div>
                <button
                  onClick={() => onTrackLive(String(route.Route_No_))}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm shadow-blue-500/30"
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  Track Live
                  <Navigation size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main BusesView ───────────────────────────────────────────
interface BusesViewProps {
  onTrackLive: (routeNo: string) => void;
}

export default function BusesView({ onTrackLive }: BusesViewProps) {
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stopSearch, setStopSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [stopPanelOpen, setStopPanelOpen] = useState(false);

  useEffect(() => {
    fetch(SHEET_URL)
      .then((r) => r.json())
      .then((data: BusRoute[]) => {
        setRoutes(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load bus data. Please try again.');
        setLoading(false);
      });
  }, []);

  const categories = ['All', ...Array.from(new Set(routes.map((r) => r.Category)))];

  const filteredRoutes =
    activeCategory === 'All' ? routes : routes.filter((r) => r.Category === activeCategory);

  const stopMap = buildStopMap(routes);

  const filteredStops = Array.from(stopMap.entries()).filter(([stop]) =>
    stop.toLowerCase().includes(stopSearch.toLowerCase())
  );

  // ── Loading ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
          <Loader2 size={32} className="text-blue-600 animate-spin" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Loading bus routes…</p>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center px-6">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl">
          <Bus size={32} className="text-red-400" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24 lg:pb-0">

      {/* ── Hero Banner ──────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/30">
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Bus size={22} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest opacity-80">BusGo</p>
              <h2 className="font-black text-xl leading-tight">Bus Routes</h2>
            </div>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">
            Browse all{' '}
            <span className="font-bold text-white">{routes.length} routes</span> across Sri Lanka
            — intercity, suburban &amp; expressway.
          </p>
          <div className="flex items-center gap-2 mt-3">
            {categories.slice(1).map((cat) => (
              <span
                key={cat}
                className="text-[10px] font-bold px-2 py-1 bg-white/20 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Select Your Nearest Stop ─────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <button
          id="nearest-stop-toggle"
          onClick={() => setStopPanelOpen(!stopPanelOpen)}
          className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
        >
          <div className="p-2.5 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-xl shadow-sm shadow-amber-400/30 flex-shrink-0">
            <MapPin size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              Select Your Nearest Stop
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {stopMap.size} transit points &amp; popular stops
            </p>
          </div>
          {stopPanelOpen ? (
            <ChevronUp size={20} className="text-gray-400 flex-shrink-0" />
          ) : (
            <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
          )}
        </button>

        {stopPanelOpen && (
          <div className="border-t dark:border-gray-800 p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="stop-search-input"
                type="text"
                placeholder="Search a stop or transit point…"
                value={stopSearch}
                onChange={(e) => setStopSearch(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              {stopSearch && (
                <button
                  onClick={() => setStopSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Stop list */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
              {filteredStops.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin size={28} className="text-gray-300 dark:text-gray-700 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 dark:text-gray-500">No stops found.</p>
                </div>
              ) : (
                filteredStops.map(([stop, stopRoutes]) => (
                  <TransitStopCard
                    key={stop}
                    stop={stop}
                    routes={stopRoutes}
                    onTrackLive={onTrackLive}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Category Filter ───────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300'
            }`}
          >
            {cat}
            {cat !== 'All' && (
              <span className="ml-1.5 opacity-70">
                ({routes.filter((r) => r.Category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Route Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRoutes.map((route) => {
          const style = getCategoryStyle(route.Category);
          return (
            <div
              key={`route-${route.Route_No_}`}
              id={`route-card-${route.Route_No_}`}
              className={`bg-gradient-to-br ${style.bg} border ${style.border} rounded-2xl p-4 shadow-sm hover:shadow-md transition-all`}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`p-2.5 ${style.icon} text-white rounded-xl shadow-sm flex-shrink-0`}
                >
                  <Bus size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Route
                    </span>
                    <span
                      className={`text-sm font-black px-2.5 py-0.5 rounded-lg text-white ${style.icon}`}
                    >
                      {route.Route_No_}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                      {route.Category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Origin – Destination */}
              <div className="flex items-center gap-2 mb-4">
                <MapIcon size={14} className="text-gray-400 flex-shrink-0" />
                <h3 className="font-black text-base text-gray-900 dark:text-white leading-tight">
                  {route.Origin___Destination}
                </h3>
              </div>

              {/* Track Live Button */}
              <button
                id={`track-live-${route.Route_No_}`}
                onClick={() => onTrackLive(String(route.Route_No_))}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-500/20"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Track Live
                <ChevronRight size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {routes.length === 0 && (
        <div className="text-center py-12">
          <Bus size={40} className="text-gray-300 dark:text-gray-700 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No routes available.</p>
        </div>
      )}
    </div>
  );
}
