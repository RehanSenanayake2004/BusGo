import { useState } from 'react';
import { Bus, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { BusService } from '../services/BusService';
import type { User } from '../services/BusService';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await BusService.login(email, password);
      onLoginSuccess(user);
    } catch {
      setError('Invalid credentials. Try "admin@busgo.com" or "driver@busgo.com"');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('123');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border dark:border-gray-800">
        <div className="p-8 md:p-12">
          {/* App Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-xl shadow-blue-500/30 mb-4">
              <Bus className="text-white" size={40} />
            </div>
            <h1 className="text-3xl font-black tracking-tight dark:text-white">BusGo</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Real-time Transit Solutions</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. driver@busgo.com"
                  className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 transition-all dark:text-white outline-none"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 transition-all dark:text-white outline-none"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-70 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-8 pt-6 border-t dark:border-gray-800">
            <p className="text-center text-xs text-gray-500 uppercase font-bold tracking-widest mb-4">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => fillCredentials('user@busgo.com')}
                className="text-[10px] bg-gray-100 dark:bg-gray-800 dark:text-gray-400 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Passenger
              </button>
              <button
                onClick={() => fillCredentials('driver@busgo.com')}
                className="text-[10px] bg-gray-100 dark:bg-gray-800 dark:text-gray-400 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Driver
              </button>
              <button
                onClick={() => fillCredentials('admin@busgo.com')}
                className="text-[10px] bg-gray-100 dark:bg-gray-800 dark:text-gray-400 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
