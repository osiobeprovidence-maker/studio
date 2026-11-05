import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Building,
  Settings,
  Shield,
  ShieldCheck,
  ArrowRight,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Home,
  LogOut,
  RefreshCw,
  Sparkles,
  Search,
  Bell
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { useAdmin } from '../context/AdminContext';

export const AdminLayout: React.FC = () => {
  const { theme, setTheme, formatNaira } = useStudio();
  const { totalPlatformRevenue, stylists, payouts } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const queuedPayoutCount = payouts.filter((p) => p.status === 'Queued').length;
  const pendingReviewCount = stylists.filter((s) => s.status === 'Pending Review').length;

  const adminNavItems = [
    { label: 'Platform Overview', path: '/admin/overview', icon: LayoutDashboard },
    { label: 'Stylists Directory', path: '/admin/stylists', icon: Users, badge: pendingReviewCount > 0 ? `${pendingReviewCount} new` : undefined },
    { label: 'Global Transactions', path: '/admin/transactions', icon: CreditCard },
    { label: 'Bank Payouts', path: '/admin/payouts', icon: Building, badge: queuedPayoutCount > 0 ? `${queuedPayoutCount} due` : undefined },
    { label: 'Platform Config', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 flex flex-col md:flex-row text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-200">
      {/* Desktop Admin Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-neutral-900 text-white border-r border-neutral-800 shrink-0">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-neutral-950 font-bold flex items-center justify-center text-sm shadow-sm">
              <Shield className="w-4 h-4 fill-neutral-950 text-neutral-950" />
            </div>
            <div>
              <span className="font-heading font-bold text-base tracking-tight text-white block">Studio</span>
              <span className="text-[10px] block font-semibold uppercase tracking-wider text-emerald-400 -mt-0.5">
                Super Admin
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded">
            Console
          </span>
        </div>

        {/* Super Admin User Identifier */}
        <div className="p-3.5 mx-3 my-3 bg-neutral-800/80 rounded-xl border border-neutral-700/60 space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              SA
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-white block truncate">Root Administrator</span>
              <span className="text-[10px] text-neutral-400 font-mono truncate block">qwertlyjointheq@gmail.com</span>
            </div>
          </div>
          <div className="pt-2 border-t border-neutral-700/60 flex items-center justify-between text-[11px] text-neutral-400">
            <span>Role: <strong className="text-emerald-400">Super Admin</strong></span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" title="Online" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-500 text-neutral-950 font-semibold shadow-xs'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-neutral-950' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      isActive
                        ? 'bg-neutral-950 text-emerald-300'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Stylist CRM Switcher Card */}
        <div className="p-3.5 m-3 bg-neutral-800/40 rounded-xl border border-neutral-800 space-y-2">
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Role Navigation
          </span>
          <Link
            to="/dashboard/overview"
            className="w-full py-2 px-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium flex items-center justify-between transition-colors"
          >
            <span>Stylist Workspace</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          </Link>
          <Link
            to="/"
            className="w-full py-2 px-2.5 bg-neutral-800/60 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-medium flex items-center justify-between transition-colors"
          >
            <span>Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </Link>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-between">
          <span>Studio Platform Engine</span>
          <span className="text-emerald-400 font-mono">v1.2.0</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navbar */}
        <header className="h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-neutral-600 dark:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Super Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600" />
              <span className="text-neutral-900 dark:text-neutral-100 font-semibold">
                {adminNavItems.find((i) => location.pathname.startsWith(i.path))?.label || 'Administration'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Switch to Stylist Workspace */}
            <Link
              to="/dashboard/overview"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/60 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Switch to Stylist View</span>
            </Link>

            <Link
              to="/"
              className="text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
        </header>

        {/* Super Admin Content Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-16">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-neutral-900 text-white h-full shadow-2xl flex flex-col z-10 border-r border-neutral-800">
            <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="font-heading font-bold text-base text-white">Super Admin</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium ${
                      isActive ? 'bg-emerald-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-800">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            <div className="p-4 border-t border-neutral-800 space-y-2">
              <Link
                to="/dashboard/overview"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 px-3 bg-violet-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
              >
                <span>Switch to Stylist CRM</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 px-3 bg-neutral-800 text-neutral-300 rounded-lg text-xs font-medium flex items-center justify-center gap-2 text-center"
              >
                <span>Go to Public Website</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
