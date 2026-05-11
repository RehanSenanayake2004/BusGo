import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bus,
  Map as MapIcon,
  User,
  Settings,
  Navigation,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  CreditCard,
} from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import LoadingScreen from './pages/LoadingScreen';
import LoginScreen from './pages/LoginScreen';
import PassengerView from './pages/PassengerView';
import BusesView from './pages/BusesView';
import DriverView from './pages/DriverView';
import AdminView from './pages/AdminView';
import SubscriptionView from './pages/SubscriptionView';
import DriverSubscriptionView from './pages/DriverSubscriptionView';
import './App.css';

type ActiveTab = 'dashboard' | 'subscription' | 'buses';

// ============================================================
// SIDEBAR ITEM COMPONENT
// ============================================================
function SidebarItem({
  icon: Icon,
  label,
  active,
  onClick,
  danger,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
        active
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
          : danger
          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20'
          : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );
}

// ============================================================
// BOTTOM NAV ITEM COMPONENT
// ============================================================
function BottomNavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all ${
        active
          ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
          : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <Icon size={22} />
      <span className="text-[10px] font-bold mt-1">{label}</span>
    </button>
  );
}

// ============================================================
// MAIN APP COMPONENT
// ============================================================
export default function App() {
  const { user, login, logout } = useAuth();
  const [showLoading, setShowLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [trackBusNo, setTrackBusNo] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for saved dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem('busgo_darkmode');
    if (saved === 'true') setIsDarkMode(true);
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('busgo_darkmode', String(isDarkMode));
  }, [isDarkMode]);

  // Reset tab when user changes
  useEffect(() => {
    setActiveTab('dashboard');
  }, [user?.uid]);

  // Handle loading complete
  const handleLoadingComplete = useCallback(() => {
    setShowLoading(false);
  }, []);

  // Handle login success
  const handleLogin = useCallback(
    (userData: Parameters<typeof login>[0]) => {
      login(userData);
      navigate(`/${userData.role}`);
    },
    [login, navigate]
  );

  // Handle logout
  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
    setActiveTab('dashboard');
  }, [logout, navigate]);

  // Show loading screen on initial mount
  if (showLoading && !user) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  // Show login screen if not authenticated
  if (!user) {
    return <LoginScreen onLoginSuccess={handleLogin} />;
  }

  // Redirect to role-based route if on login page
  if (location.pathname === '/login') {
    navigate(`/${user.role}`);
  }

  const roleIcon =
    user.role === 'admin'
      ? ShieldCheck
      : user.role === 'driver'
      ? Navigation
      : MapIcon;

  const isPassenger = user.role === 'passenger';
  const isDriver = user.role === 'driver';

  // ── Sidebar nav items for each role ─────────────────────
  const renderSidebarNav = (onItemClick?: () => void) => (
    <>
      <SidebarItem
        icon={roleIcon}
        label="Dashboard"
        active={activeTab === 'dashboard'}
        onClick={() => { setActiveTab('dashboard'); onItemClick?.(); }}
      />
      {isPassenger && (
        <SidebarItem
          icon={Bus}
          label="Buses"
          active={activeTab === 'buses'}
          onClick={() => { setActiveTab('buses'); onItemClick?.(); }}
        />
      )}
      <SidebarItem
        icon={User}
        label="Profile"
        active={false}
        onClick={() => { onItemClick?.(); }}
      />
      <SidebarItem
        icon={Settings}
        label="Dark Mode"
        active={false}
        onClick={() => { setIsDarkMode(!isDarkMode); onItemClick?.(); }}
      />
      {(isPassenger || isDriver) && (
        <SidebarItem
          icon={CreditCard}
          label="Subscription"
          active={activeTab === 'subscription'}
          onClick={() => { setActiveTab('subscription'); onItemClick?.(); }}
        />
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black font-sans text-gray-900 transition-colors duration-300 flex">
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white dark:bg-gray-900 border-r dark:border-gray-800 p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/30">
            <Bus className="text-white" size={24} />
          </div>
          <h1 className="font-black text-2xl tracking-tighter dark:text-white">BusGo</h1>
        </div>

        {/* Role Badge */}
        <nav className="flex-1 space-y-2">
          <div className="px-4 py-3 mb-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
            <p className="text-[10px] uppercase font-black text-blue-600 dark:text-blue-400 tracking-wider">
              Current Role
            </p>
            <p className="text-sm font-bold text-blue-900 dark:text-white capitalize mt-0.5">
              {user.role}
            </p>
          </div>
          {renderSidebarNav()}
        </nav>

        {/* Logout */}
        <div className="mt-auto border-t dark:border-gray-800 pt-6">
          <SidebarItem
            icon={LogOut}
            label="Logout"
            danger={true}
            active={false}
            onClick={handleLogout}
          />
        </div>
      </aside>

      {/* ===== MOBILE MENU OVERLAY ===== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-bold dark:text-white">Menu</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="px-4 py-3 mb-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
              <p className="text-[10px] uppercase font-black text-blue-600 dark:text-blue-400 tracking-wider">
                Current Role
              </p>
              <p className="text-sm font-bold text-blue-900 dark:text-white capitalize mt-0.5">
                {user.role}
              </p>
            </div>

            <nav className="flex-1 space-y-2">
              {renderSidebarNav(() => setMobileMenuOpen(false))}
            </nav>

            <div className="mt-auto pt-6 border-t dark:border-gray-800">
              <SidebarItem
                icon={LogOut}
                label="Logout"
                danger={true}
                active={false}
                onClick={handleLogout}
              />
            </div>
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT AREA ===== */}
      <main className="flex-1 p-4 lg:p-8 max-w-5xl mx-auto w-full min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden flex justify-between items-center mb-6 sticky top-0 z-40 bg-slate-50/80 dark:bg-black/80 backdrop-blur-md py-2 -mx-4 px-4 -mt-4 pt-4">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/30">
              <Bus className="text-white" size={20} />
            </div>
            <h1 className="font-black text-xl dark:text-white">BusGo</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-black dark:text-white capitalize">
            {activeTab === 'subscription' ? (isDriver ? 'Driver Pro' : 'Subscription') : activeTab === 'buses' ? 'Bus Routes' : `${user.role} Dashboard`}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Welcome back, {user.email}. System status: Operational.
          </p>
        </div>

        {/* Role-specific content */}
        {activeTab === 'subscription' && isPassenger ? (
          <SubscriptionView />
        ) : activeTab === 'subscription' && isDriver ? (
          <DriverSubscriptionView />
        ) : activeTab === 'buses' && isPassenger ? (
          <BusesView onTrackLive={(routeNo) => { setTrackBusNo(routeNo); setActiveTab('dashboard'); }} />
        ) : (
          <>
            {user.role === 'passenger' && <PassengerView trackBusNo={trackBusNo} onTrackingStarted={() => setTrackBusNo(null)} />}
            {user.role === 'driver' && <DriverView user={user} />}
            {user.role === 'admin' && <AdminView />}
          </>
        )}
      </main>

      {/* ===== MOBILE BOTTOM NAVIGATION ===== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-800 z-40 px-2 pb-safe">
        <div className="flex items-center justify-around py-1">
          <BottomNavItem
            icon={user.role === 'admin' ? ShieldCheck : user.role === 'driver' ? Navigation : MapIcon}
            label="Home"
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          {isPassenger && (
            <BottomNavItem
              icon={Bus}
              label="Buses"
              active={activeTab === 'buses'}
              onClick={() => setActiveTab('buses')}
            />
          )}
          {(isPassenger || isDriver) && (
            <BottomNavItem
              icon={CreditCard}
              label={isDriver ? 'Pro' : 'Premium'}
              active={activeTab === 'subscription'}
              onClick={() => setActiveTab('subscription')}
            />
          )}
          <BottomNavItem
            icon={LogOut}
            label="Logout"
            active={false}
            onClick={handleLogout}
          />
        </div>
      </nav>
    </div>
  );
}
