import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Bus, AlertCircle, X, ChevronRight } from 'lucide-react';
import { BusService } from '../services/BusService';
import type { BusRoute, Bus as BusType } from '../services/BusService';

// ─── Tiny helper to generate ids ────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);

// ─── Blank form state ────────────────────────────────────────
const BLANK_FORM = {
  routeNo: '',
  name: '',
  origin: '',
  destination: '',
  stops: '',
  busNo: '',
  driver: '',
  lat: '',
  lng: '',
};

export default function AdminView() {
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [newlyAdded, setNewlyAdded] = useState<BusRoute[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [formError, setFormError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null); // routeId pending delete

  // Load data and subscribe to changes
  const reload = useCallback(() => {
    setRoutes(BusService.getAdminRoutes());
    setNewlyAdded(BusService.getNewlyAddedRoutes());
  }, []);

  useEffect(() => {
    reload();
    return BusService.subscribe(reload);
  }, [reload]);

  // Stats
  const totalBuses = routes.reduce((sum, r) => sum + r.activeBuses, 0);
  const activeBuses = routes.reduce((sum, r) => sum + r.activeBuses, 0);

  // ─── Handle form change ──────────────────────────────────
  const handleChange = (field: keyof typeof BLANK_FORM, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormError('');
  };

  // ─── Handle add route ────────────────────────────────────
  const handleAddRoute = () => {
    const { routeNo, name, origin, destination, stops, busNo, driver } = form;
    if (!routeNo || !name || !origin || !destination || !stops || !busNo || !driver) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const routeId = `route-custom-${uid()}`;
    const newRoute: BusRoute = {
      id: routeId,
      routeNo: routeNo.trim(),
      name: name.trim(),
      origin: origin.trim(),
      destination: destination.trim(),
      stops: parseInt(stops) || 0,
      activeBuses: 1,
      times: ['06:00 AM', '09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM'],
    };

    const newBus: BusType = {
      id: `bus-custom-${uid()}`,
      busNo: busNo.trim(),
      route: name.trim(),
      lat: parseFloat(form.lat) || 6.9271 + (Math.random() - 0.5) * 0.5,
      lng: parseFloat(form.lng) || 79.8612 + (Math.random() - 0.5) * 0.5,
      status: 'Active',
      driver: driver.trim(),
    };

    BusService.addRoute(newRoute, newBus);
    setShowModal(false);
    setForm(BLANK_FORM);
  };

  // ─── Handle delete route ─────────────────────────────────
  const handleDelete = (routeId: string) => {
    if (deleteConfirm === routeId) {
      BusService.deleteRoute(routeId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(routeId);
      // Auto-cancel confirm after 3 s
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  // Color palette for new routes cards
  const CARD_COLORS = [
    { bg: 'from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900', border: 'border-blue-200 dark:border-blue-900/30', icon: 'bg-blue-600', label: 'text-blue-600' },
    { bg: 'from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-900', border: 'border-purple-200 dark:border-purple-900/30', icon: 'bg-purple-600', label: 'text-purple-600' },
    { bg: 'from-emerald-50 to-white dark:from-emerald-950/20 dark:to-gray-900', border: 'border-emerald-200 dark:border-emerald-900/30', icon: 'bg-emerald-600', label: 'text-emerald-600' },
    { bg: 'from-amber-50 to-white dark:from-amber-950/20 dark:to-gray-900', border: 'border-amber-200 dark:border-amber-900/30', icon: 'bg-amber-600', label: 'text-amber-600' },
  ];

  return (
    <>
      <div className="space-y-6 pb-20 lg:pb-0">
        {/* Fleet Manager Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold dark:text-white">Fleet Manager</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage all bus routes and buses
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 active:scale-[0.98]"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Bus</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Buses</p>
            <p className="text-3xl font-black mt-1 dark:text-white">{totalBuses}</p>
            <div className="mt-2 flex items-center gap-1">
              <Bus size={14} className="text-blue-500" />
              <span className="text-xs text-gray-500">All routes</span>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Now</p>
            <p className="text-3xl font-black mt-1 dark:text-white">{activeBuses}</p>
            <div className="mt-2 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500">On road</span>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Alerts</p>
            <p className="text-3xl font-black mt-1 dark:text-white">0</p>
            <div className="mt-2 flex items-center gap-1">
              <AlertCircle size={14} className="text-gray-400" />
              <span className="text-xs text-gray-500">Normal</span>
            </div>
          </div>
        </div>

        {/* Routes Management Table */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b dark:border-gray-800">
            <h3 className="text-lg font-bold dark:text-white">Routes Management</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {routes.length} routes registered
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-bold text-gray-400 uppercase border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="pb-3 pt-3 px-4">Route No</th>
                  <th className="pb-3 pt-3 px-4">Route Name</th>
                  <th className="pb-3 pt-3 px-4 text-center">Stops</th>
                  <th className="pb-3 pt-3 px-4 text-center">Live Buses</th>
                  <th className="pb-3 pt-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                {routes.map((route) => (
                  <tr
                    key={route.id}
                    className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-lg">
                        {route.routeNo}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-sm">{route.name}</p>
                        <p className="text-xs text-gray-500">
                          {route.origin} → {route.destination}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm font-medium">{route.stops}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                        {route.activeBuses} Active
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleDelete(route.id)}
                        className={`p-2 rounded-lg transition-all font-bold text-xs flex items-center gap-1 ml-auto ${
                          deleteConfirm === route.id
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20'
                        }`}
                        title={deleteConfirm === route.id ? 'Click again to confirm delete' : 'Delete route'}
                      >
                        {deleteConfirm === route.id ? (
                          <>
                            <Trash2 size={14} />
                            <span>Confirm</span>
                          </>
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Routes Highlight */}
        <div className="flex items-center gap-2 px-1">
          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
          <h2 className="text-lg font-bold dark:text-white">New Routes Added</h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">({newlyAdded.length})</span>
        </div>

        {newlyAdded.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center">
            <Bus size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No newly added routes. Use the <strong>+ New Bus</strong> button to add one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newlyAdded.map((route, idx) => {
              const c = CARD_COLORS[idx % CARD_COLORS.length];
              return (
                <div
                  key={route.id}
                  className={`bg-gradient-to-br ${c.bg} border ${c.border} rounded-2xl p-5 shadow-sm`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 ${c.icon} text-white rounded-xl`}>
                        <Bus size={20} />
                      </div>
                      <div>
                        <span className={`text-[10px] font-bold ${c.label} uppercase tracking-wider`}>
                          New Route
                        </span>
                        <h4 className="font-black text-xl dark:text-white">{route.routeNo}</h4>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{route.name}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{route.stops} stops</span>
                    <span>•</span>
                    <span>{route.activeBuses} bus assigned</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===== NEW BUS MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setShowModal(false); setForm(BLANK_FORM); setFormError(''); }}
          />
          {/* Panel */}
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                  <Plus size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black dark:text-white">Add New Bus Route</h2>
                  <p className="text-xs text-gray-500">This will update the passenger dashboard</p>
                </div>
              </div>
              <button
                onClick={() => { setShowModal(false); setForm(BLANK_FORM); setFormError(''); }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Form body */}
            <div className="p-6 space-y-4">
              {/* Route Info */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Route Details</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Route No *</label>
                  <input
                    type="text"
                    placeholder="e.g. 45-B"
                    value={form.routeNo}
                    onChange={(e) => handleChange('routeNo', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Route Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Negombo - Colombo"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Origin *</label>
                  <input
                    type="text"
                    placeholder="e.g. Negombo"
                    value={form.origin}
                    onChange={(e) => handleChange('origin', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Destination *</label>
                  <input
                    type="text"
                    placeholder="e.g. Colombo"
                    value={form.destination}
                    onChange={(e) => handleChange('destination', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Number of Stops *</label>
                <input
                  type="number"
                  placeholder="e.g. 15"
                  value={form.stops}
                  onChange={(e) => handleChange('stops', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Bus Info */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-2">Bus Details</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Bus Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. NB-4521"
                    value={form.busNo}
                    onChange={(e) => handleChange('busNo', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Driver Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Ravi Perera"
                    value={form.driver}
                    onChange={(e) => handleChange('driver', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Latitude <span className="font-normal">(optional)</span></label>
                  <input
                    type="text"
                    placeholder="e.g. 7.2085"
                    value={form.lat}
                    onChange={(e) => handleChange('lat', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Longitude <span className="font-normal">(optional)</span></label>
                  <input
                    type="text"
                    placeholder="e.g. 79.9718"
                    value={form.lng}
                    onChange={(e) => handleChange('lng', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Error */}
              {formError && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl p-3">
                  <AlertCircle size={16} />
                  <span className="text-sm font-medium">{formError}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => { setShowModal(false); setForm(BLANK_FORM); setFormError(''); }}
                className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRoute}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
              >
                <Plus size={16} />
                Add Route & Bus
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
