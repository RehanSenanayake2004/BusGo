import { useState } from 'react';
import {
  CreditCard,
  Check,
  Star,
  Shield,
  Zap,
  Bus,
  Bell,
  Map,
  RefreshCw,
  ChevronRight,
  Lock,
} from 'lucide-react';

// ─── Plan Features ────────────────────────────────────────────
const FEATURES = [
  { icon: Map, label: 'Real-time bus tracking on live map' },
  { icon: Bell, label: 'Push alerts for bus arrivals & delays' },
  { icon: Bus, label: 'Access to all 14+ bus routes' },
  { icon: Star, label: 'Priority seat reservation (coming soon)' },
  { icon: Shield, label: 'Trip history & receipts' },
  { icon: RefreshCw, label: 'Automatic monthly renewal' },
  { icon: Zap, label: 'Faster location refresh rate (2 s vs 5 s)' },
];

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

export default function SubscriptionView() {
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const price = plan === 'monthly' ? 'LKR 300' : 'LKR 2,880';
  const savingsBadge = plan === 'yearly' ? '20% OFF' : null;

  const handleSubscribe = () => {
    if (!cardNumber || !expiry || !cvv || !cardName) return;
    setLoading(true);
    // Simulate a 2-second payment "request"
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto space-y-6 pb-20 lg:pb-0 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40 mb-2">
          <Check size={40} className="text-white" />
        </div>
        <h2 className="text-2xl font-black dark:text-white text-center">Subscription Active!</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center text-sm px-6">
          Welcome to <strong className="text-blue-600">BusGo Premium</strong>. Your subscription is now active. Enjoy unlimited real-time tracking across all routes.
        </p>
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-2xl p-5 w-full">
          <p className="text-xs text-gray-500 mb-1">Plan</p>
          <p className="font-black text-blue-700 dark:text-blue-400 capitalize">{plan} • {price} / {plan === 'monthly' ? 'mo' : 'yr'}</p>
          <p className="text-xs text-gray-500 mt-2">Next billing: {plan === 'monthly' ? 'June 8, 2026' : 'May 8, 2027'}</p>
        </div>
        <button
          onClick={() => { setSuccess(false); setCardNumber(''); setExpiry(''); setCvv(''); setCardName(''); }}
          className="text-sm text-blue-600 font-bold hover:underline"
        >
          Manage Subscription
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20 lg:pb-0">

      {/* ─── Hero Banner ──────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-6 text-white overflow-hidden shadow-xl shadow-blue-500/30">
        {/* Decorative circle */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Star size={16} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest opacity-90">BusGo Premium</span>
          </div>
          <h2 className="text-3xl font-black leading-tight mb-1">Unlimited Bus Tracking</h2>
          <p className="text-sm opacity-80">Real-time GPS · All routes · Priority alerts</p>
        </div>
      </div>

      {/* ─── Current Plan Status ──────────────────────── */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Current Plan</h3>
          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-1 rounded font-bold">Free Tier</span>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-2xl font-black dark:text-white">LKR 0</p>
            <p className="text-xs text-gray-500">Limited to 3 routes · 5s refresh</p>
          </div>
          <ChevronRight size={20} className="text-gray-300 ml-auto" />
        </div>
        <div className="mt-4 pt-4 border-t dark:border-gray-800">
          <p className="text-xs text-gray-500">Upgrade to unlock all features ↓</p>
        </div>
      </div>

      {/* ─── Plan Toggle ─────────────────────────────── */}
      <div>
        <h3 className="text-base font-bold dark:text-white mb-3">Choose Your Plan</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Monthly */}
          <button
            onClick={() => setPlan('monthly')}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              plan === 'monthly'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Monthly</p>
            <p className="text-xl font-black dark:text-white">LKR 300</p>
            <p className="text-xs text-gray-500">per month</p>
            {plan === 'monthly' && (
              <div className="mt-2 flex items-center gap-1 text-blue-600">
                <Check size={12} />
                <span className="text-[10px] font-bold">Selected</span>
              </div>
            )}
          </button>
          {/* Yearly */}
          <button
            onClick={() => setPlan('yearly')}
            className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
              plan === 'yearly'
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            {savingsBadge && (
              <span className="absolute -top-2.5 right-3 text-[10px] bg-purple-600 text-white font-black px-2 py-0.5 rounded-full">
                {savingsBadge}
              </span>
            )}
            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Yearly</p>
            <p className="text-xl font-black dark:text-white">LKR 4,799</p>
            <p className="text-xs text-gray-500">per year</p>
            {plan === 'yearly' && (
              <div className="mt-2 flex items-center gap-1 text-purple-600">
                <Check size={12} />
                <span className="text-[10px] font-bold">Selected</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* ─── Features List ────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold dark:text-white mb-4">What's included</h3>
        <div className="space-y-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="flex items-center gap-3">
                <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={14} />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{f.label}</span>
                <Check size={14} className="text-green-500 ml-auto flex-shrink-0" />
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Visa Card Entry Form ─────────────────────── */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
            <CreditCard size={20} />
          </div>
          <div>
            <h3 className="font-bold dark:text-white">Payment Details</h3>
            <p className="text-xs text-gray-500">Visa / Mastercard / Amex</p>
          </div>
          {/* Card logos */}
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-[10px] font-black bg-blue-700 text-white px-2 py-0.5 rounded">VISA</span>
            <span className="text-[10px] font-black bg-gray-800 text-white px-2 py-0.5 rounded">MC</span>
          </div>
        </div>

        {/* Visual card preview */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 mb-5 text-white relative overflow-hidden">
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
              placeholder="e.g. Kasun Perera"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-mono"
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
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-mono"
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
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-mono"
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
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-[0.98] disabled:opacity-70"
      >
        {loading ? (
          <>
            <RefreshCw size={20} className="animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <CreditCard size={20} />
            Subscribe · {price}
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
