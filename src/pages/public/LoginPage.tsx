import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  User,
  Lock,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.64v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.11z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.4 7.36 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.24C.45 8.14 0 9.9 0 12s.45 3.86 1.24 5.43l4.04-3.14z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.6 1.24 6.57l4.04 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
    />
  </svg>
);

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, showToast } = useStudio();
  const [email, setEmail] = useState('adunni@glowbyadunni.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      showToast(`Welcome back, ${profile.ownerName}!`, 'success');
      navigate('/dashboard/overview');
    }, 500);
  };

  const handleGoogleSelect = (name: string, chosenEmail: string) => {
    setIsGoogleModalOpen(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast(`Signed in with Google as ${chosenEmail}`, 'success');
      navigate('/dashboard/overview');
    }, 500);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast(`Signed into demo studio: ${profile.businessName}`, 'info');
      navigate('/dashboard/overview');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col justify-between transition-colors duration-200">
      {/* Top Navbar */}
      <header className="h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            S
          </div>
          <div>
            <span className="font-heading font-bold text-lg tracking-tight text-neutral-900 dark:text-white">Studio</span>
            <span className="text-[10px] block font-medium uppercase tracking-wider text-violet-600 dark:text-violet-400 -mt-1">
              Stylist CRM
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4 text-xs">
          <span className="hidden sm:inline text-neutral-500 dark:text-neutral-400">
            Don't have an account yet?
          </span>
          <Link
            to="/create-account"
            className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700"
          >
            Create Free Account
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Sign In Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold font-heading text-neutral-900 dark:text-white">
                Sign In to your Studio
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Access your appointments, client records, and payment settlements.
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(true)}
              className="w-full py-2.5 px-4 mb-4 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

            {/* Quick 1-Click Demo Login Banner */}
            <div className="mb-6 p-3.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900/60">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-violet-900 dark:text-violet-200">
                  Instant Demo Access
                </span>
                <span className="text-[10px] text-violet-600 dark:text-violet-400 font-medium bg-violet-100 dark:bg-violet-900/50 px-2 py-0.5 rounded">
                  Pre-configured
                </span>
              </div>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mb-2.5">
                Sign in with the Warri, Delta State demo account (Glow by Adunni) with pre-filled appointments and clients.
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>Launch Demo Account Directly</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
              </div>
              <span className="relative px-3 bg-white dark:bg-neutral-900 text-[11px] text-neutral-400 uppercase tracking-wider font-medium">
                Or Sign In with Email
              </span>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Password
                  </label>
                  <a
                    href="#reset"
                    onClick={(e) => { e.preventDefault(); showToast('Demo password is: password123', 'info'); }}
                    className="text-[11px] text-violet-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {isLoading ? <span>Signing In...</span> : <span>Sign In to Workspace</span>}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-500">
              New stylist in Nigeria?{' '}
              <Link to="/create-account" className="font-semibold text-violet-600 dark:text-violet-400 hover:underline">
                Register your free booking page
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-400">
        Studio — The Modern Stylist CRM for Nigerian Beauty Professionals
      </footer>

      {/* Google Simulated OAuth Account Chooser Modal */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-sm p-6 shadow-2xl space-y-4">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto border border-neutral-200 dark:border-neutral-700 shadow-xs">
                <GoogleIcon />
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Choose an account
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                to sign in to <span className="font-semibold text-neutral-800 dark:text-neutral-200">Studio CRM</span>
              </p>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 border-y border-neutral-100 dark:border-neutral-800">
              {/* Account 1 */}
              <button
                type="button"
                onClick={() => handleGoogleSelect('Adunni Cole', 'qwertlyjointheq@gmail.com')}
                className="w-full py-3 px-2 flex items-center gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 rounded-lg text-left transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  A
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white block truncate group-hover:text-violet-600 dark:group-hover:text-violet-400">
                    Adunni Cole
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block truncate font-mono">
                    qwertlyjointheq@gmail.com
                  </span>
                </div>
              </button>

              {/* Account 2 */}
              <button
                type="button"
                onClick={() => handleGoogleSelect('Glow Artistry Warri', 'glowbyadunni@gmail.com')}
                className="w-full py-3 px-2 flex items-center gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 rounded-lg text-left transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  G
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white block truncate group-hover:text-violet-600 dark:group-hover:text-violet-400">
                    Glow Artistry Warri
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block truncate font-mono">
                    glowbyadunni@gmail.com
                  </span>
                </div>
              </button>
            </div>

            {/* Custom Google account write-in */}
            <div className="pt-1">
              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                Or use another Google email:
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono"
                />
                <button
                  type="button"
                  disabled={!customGoogleEmail || !customGoogleEmail.includes('@')}
                  onClick={() => {
                    const name = customGoogleEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() || 'Beauty Stylist';
                    handleGoogleSelect(name, customGoogleEmail);
                  }}
                  className="px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 disabled:opacity-40 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(false)}
                className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
