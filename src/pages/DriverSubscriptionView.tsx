import { useState } from 'react';
import {
  CreditCard,
  Check,
  Star,
  Shield,
  Zap,
  Navigation,
  RefreshCw,
  ChevronRight,
  Lock,
  Crown,
} from 'lucide-react';

// ─── Driver Plan Tiers ────────────────────────────────────────
const PLANS = [
  {
    id: 'basic',
    name: 'Basic Package',
    price: 2500,
    features: ['GPS tracking only'],
    icon: Navigation,
    color: 'emerald',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'standard',
    name: 'Standard Package',
    price: 4000,
    features: [
      'GPS tracking',
      'Real-time location updates',
      'Arrival time estimation',
    ],
    icon: Zap,
    color: 'teal',
    gradient: 'from-teal-500 to-teal-600',
  },
  {
    id: 'premium',
    name: 'Premium Package',
    price: 6000,
    features: [
      'All features included',
      'Advanced report',
      'Performance dashboard',
    ],
    icon: Crown,
    color: 'cyan',
    gradient: 'from-cyan-500 to-cyan-600',
  },
] as const;

type PlanId = typeof PLANS[number]['id'];

// ─── Format card number with spaces ───────────────────────────
function formatCardNumber(raw: string) {
  return raw
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

// ─── Format expiry MM/YY ─────────────────────────────────────
function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function DriverSubscriptionView() {
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('standard');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedPlan = PLANS.find(p => p.id === selectedPlanId)!;
  const price = `LKR ${selectedPlan.price.toLocaleString()}`;

  const handleSubscribe = () => {
    if (!cardNumber || !expiry || !cvv || !cardName) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto space-y-6 pb-20 lg:pb-0 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40 mb-2">
          <Check size={40} className="text-white" />
        </div>
        <h2 className="text-2xl font-black dark:text-white text-center">Subscription Active!</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center text-sm px-6">
          Welcome to <strong className="text-emerald-600">BusGo Driver Pro</strong>. Your subscription is now active. Enjoy premium driver features, analytics, and priority routing.
        </p>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl p-5 w-full text-center">
          <p className="text-xs text-gray-500 mb-1">Current Plan</p>
          <p className="font-black text-emerald-700 dark:text-emerald-400 capitalize">{selectedPlan.name} • {price} / bus</p>
          <p className="text-xs text-gray-500 mt-2">Trial period ended. Next billing: June 11, 2026</p>
        </div>
        <button
          onClick={() => { setSuccess(false); setCardNumber(''); setExpiry(''); setCvv(''); setCardName(''); }}
          className="text-sm text-emerald-600 font-bold hover:underline"
        >
          Manage Subscription
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20 lg:pb-0">

      {/* ─── Hero Banner ──────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-2xl p-6 text-white overflow-hidden shadow-xl shadow-emerald-500/30">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full" />
        <div className="absolute top-1/2 right-4 w-16 h-16 bg-white/5 rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Star size={16} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest opacity-90">Bus Owner Subscription</span>
          </div>
          <h2 className="text-3xl font-black leading-tight mb-1">Trial Complete</h2>
          <p className="text-sm opacity-80">Choose a tiered plan that fits your operation needs</p>
        </div>
      </div>

      {/* ─── Current Plan Status ──────────────────────── */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Previous Status</h3>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 px-2 py-1 rounded font-bold">Trial Active</span>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-lg font-black dark:text-white">30-Day Free Trial Finished</p>
            <p className="text-xs text-gray-500">Your trial period has ended. Select a plan to continue.</p>
          </div>
          <RefreshCw size={20} className="text-emerald-500 ml-auto animate-spin-slow" />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-bold dark:text-white">Select a Package</h3>
        <div className="grid grid-cols-1 gap-3">
          {PLANS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlanId(p.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${
                selectedPlanId === p.id
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm text-${p.color}-600`}>
                    <p.icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">{p.name}</p>
                    <p className="text-xl font-black dark:text-white">LKR {p.price.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-500 font-medium italic">per bus / 30 days</p>
                  </div>
                </div>
                {selectedPlanId === p.id && (
                  <div className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1 rounded-full shadow-lg">
                    <Check size={12} />
                    <span className="text-[10px] font-black uppercase">Selected</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold dark:text-white mb-4">Included in {selectedPlan.name}</h3>
        <div className="space-y-3">
          {selectedPlan.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-7 h-7 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Check size={14} />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold dark:text-white mb-4">Package Comparison</h3>
        <div className="space-y-4">
          {[
            { feature: 'GPS Tracking', basic: true, standard: true, premium: true },
            { feature: 'Live Updates', basic: false, standard: true, premium: true },
            { feature: 'ETA Estimation', basic: false, standard: true, premium: true },
            { feature: 'Adv. Reports', basic: false, standard: false, premium: true },
            { feature: 'Dashboard', basic: false, standard: false, premium: true },
          ].map((row) => (
            <div key={row.feature} className="grid grid-cols-4 gap-2 items-center text-xs">
              <span className="font-bold text-gray-700 dark:text-gray-300">{row.feature}</span>
              <div className="flex justify-center">
                {row.basic ? <Check size={14} className="text-emerald-500" /> : <span className="text-gray-300">—</span>}
              </div>
              <div className="flex justify-center">
                {row.standard ? <Check size={14} className="text-emerald-500" /> : <span className="text-gray-300">—</span>}
              </div>
              <div className="flex justify-center">
                {row.premium ? <Check size={14} className="text-emerald-500" /> : <span className="text-gray-300">—</span>}
              </div>
            </div>
          ))}
          <div className="grid grid-cols-4 gap-2 items-center text-[9px] font-black uppercase text-gray-400 border-t dark:border-gray-800 pt-2">
            <span></span>
            <span className="text-center">Basic</span>
            <span className="text-center">Standard</span>
            <span className="text-center text-emerald-600">Premium</span>
          </div>
        </div>
      </div>

      {/* ─── Visa Card Entry Form ─────────────────────── */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
            <CreditCard size={20} />
          </div>
          <div>
            <h3 className="font-bold dark:text-white">Payment Details</h3>
            <p className="text-xs text-gray-500">Visa / Mastercard / Amex</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-[10px] font-black bg-blue-700 text-white px-2 py-0.5 rounded">VISA</span>
            <span className="text-[10px] font-black bg-gray-800 text-white px-2 py-0.5 rounded">MC</span>
          </div>
        </div>

        {/* Visual card preview */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-4 mb-5 text-white relative overflow-hidden">
          <div className="absolute top-2 right-3 opacity-30 text-5xl font-black italic">VISA</div>
          <p className="text-xs opacity-70 mb-3 font-medium">Card Number</p>
          <p className="text-lg font-mono font-bold tracking-widest mb-4">
            {cardNumber || '•••• •••• •••• ••••'}
          </p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] opacity-70 mb-0.5">Cardholder</p>
              <p className="text-sm font-bold uppercase">{cardName || 'YOUR NAME'}</p>
            </div>
            <div>
              <p className="text-[10px] opacity-70 mb-0.5">Expires</p>
              <p className="text-sm font-bold">{expiry || 'MM/YY'}</p>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Cardholder Name</label>
            <input
              type="text"
              placeholder="e.g. Nuwan Jayasuriya"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Card Number</label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition font-mono"
              />
              <CreditCard size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Expiry Date</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                maxLength={5}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">CVV</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="•••"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition font-mono"
                />
                <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
          <Shield size={12} className="text-green-500 flex-shrink-0" />
          <span>256-bit SSL encryption. Your card details are never stored.</span>
        </div>
      </div>

      {/* ─── Subscribe Button ─────────────────────────── */}
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/30 hover:from-emerald-700 hover:to-teal-700 transition-all active:scale-[0.98] disabled:opacity-70"
      >
        {loading ? (
          <>
            <RefreshCw size={20} className="animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <CreditCard size={20} />
            Subscribe · {price} / bus
            <ChevronRight size={20} />
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400 pb-2">
        Cancel anytime. No hidden fees. By subscribing you agree to BusGo's Terms of Service.
      </p>
    </div>
  );
}
