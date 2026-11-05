import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  LayoutDashboard,
  Scissors,
  Users,
  CreditCard,
  Tag,
  Share2,
  BellRing,
  Settings,
  ExternalLink,
  Plus,
  Menu,
  X,
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Home,
  Globe,
  UserPlus,
  LogOut,
  Shield
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';

interface DashboardLayoutProps {
  onOpenQuickBooking?: () => void;
  onOpenQuickService?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  onOpenQuickBooking,
  onOpenQuickService,
}) => {
  const { profile, showToast, theme, setTheme } = useStudio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview', path: '/dashboard/overview', icon: LayoutDashboard },
    { label: 'Bookings', path: '/dashboard/bookings', icon: Calendar },
    { label: 'Services', path: '/dashboard/services', icon: Scissors },
    { label: 'Clients', path: '/dashboard/clients', icon: Users },
    { label: 'Payments', path: '/dashboard/payments', icon: CreditCard },
    { label: 'Coupons', path: '/dashboard/coupons', icon: Tag },
    { label: 'Referrals', path: '/dashboard/referrals', icon: Share2 },
    { label: 'Notifications', path: '/dashboard/notifications', icon: BellRing },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const currentNav = navItems.find((item) => location.pathname.startsWith(item.path)) || navItems[0];
  const bookingPageUrl = `${window.location.origin}/${profile.slug}`;

  const copyBookingLink = () => {
    navigator.clipboard.writeText(bookingPageUrl);
    setCopiedLink(true);
    showToast('Public booking page link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col md:flex-row text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 shrink-0 transition-colors duration-200">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-neutral-100 dark:border-neutral-800">
          <Link
            to="/"
            title="Visit Studio Homepage"
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              S
            </div>
            <div>
              <span className="font-heading font-bold text-lg tracking-tight text-neutral-900 dark:text-white">Studio</span>
              <span className="text-[10px] block font-medium uppercase tracking-wider text-violet-600 dark:text-violet-400">Stylist CRM</span>
            </div>
          </Link>
          <Link
            to="/"
            title="Go to Home / Landing Page"
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Home className="w-4 h-4" />
          </Link>
        </div>

        {/* Stylist Profile Preview Pill with Account Actions */}
        <div className="p-3.5 mx-3 my-3 bg-violet-50/60 dark:bg-violet-950/40 rounded-xl border border-violet-100/70 dark:border-violet-900/50 space-y-2.5">
          <div className="flex items-center gap-3">
            <img
              src={profile.profileImage}
              alt={profile.businessName}
              className="w-10 h-10 rounded-full object-cover border border-violet-200 dark:border-violet-700 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">{profile.businessName}</h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{profile.location.split(',')[0]}, NG</p>
            </div>
          </div>
          <div className="pt-2 border-t border-violet-200/50 dark:border-violet-900/40 flex items-center justify-between text-[11px]">
            <Link
              to="/create-account"
              className="text-violet-700 dark:text-violet-300 hover:underline flex items-center gap-1 font-medium"
              title="Register a new stylist account"
            >
              <UserPlus className="w-3 h-3" />
              <span>New Account</span>
            </Link>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <Link
              to="/login"
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 flex items-center gap-1"
              title="Sign in or switch account"
            >
              <LogOut className="w-3 h-3" />
              <span>Switch</span>
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-neutral-400 dark:text-neutral-500'}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Share Public Booking Page Promo Card in Sidebar */}
        <div className="p-4 m-3 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" /> Public Booking
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Live</span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-snug">
            Share with clients via Instagram bio or WhatsApp:
          </p>
          <div className="text-[11px] font-mono text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 p-1.5 rounded border border-neutral-200 dark:border-neutral-700 truncate">
            studio.app/{profile.slug}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={copyBookingLink}
              className="flex-1 py-1.5 px-2 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
            <a
              href={`/${profile.slug}`}
              target="_blank"
              rel="noreferrer"
              className="py-1.5 px-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-colors"
              title="Open public booking page in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Super Admin Switcher Link in Sidebar */}
        <div className="px-3 pb-2">
          <Link
            to="/admin/overview"
            className="w-full py-1.5 px-2.5 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-emerald-500 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Super Admin Portal</span>
            </span>
            <ChevronRight className="w-3 h-3 text-neutral-400" />
          </Link>
        </div>

        {/* Footer info & Theme Mode indicator */}
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400 dark:text-neutral-500 flex items-center justify-between">
          <span>Theme: <span className="capitalize font-medium text-neutral-600 dark:text-neutral-300">{theme}</span></span>
          <span className="text-violet-600 dark:text-violet-400 font-medium">v1.0.0</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
          {/* Left: Mobile hamburger & breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <Link
                to="/"
                className="hidden sm:inline hover:text-neutral-900 dark:hover:text-white transition-colors"
                title="Go to Studio Homepage"
              >
                Studio CRM
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600 hidden sm:inline" />
              <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{currentNav.label}</span>
            </div>
          </div>

          {/* Right: Quick actions & Theme Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Studio Landing Page Quick Link */}
            <Link
              to="/"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              title="Visit Studio Public Landing Page"
            >
              <Home className="w-3.5 h-3.5 text-neutral-400" />
              <span>Studio Home</span>
            </Link>

            <button
              onClick={copyBookingLink}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Booking Link'}</span>
            </button>

            <button
              onClick={() => navigate('/dashboard/bookings?action=new')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/60 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Booking</span>
              <span className="sm:hidden">Book</span>
            </button>

            <button
              onClick={() => navigate('/dashboard/services?action=new')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              <Scissors className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
              <span>Add Service</span>
            </button>

            <a
              href={`/${profile.slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors shadow-xs"
            >
              <span className="hidden sm:inline">Customer Booking Page</span>
              <span className="sm:hidden">Public View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Page Viewport */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 px-2 py-1.5 z-40 flex items-center justify-around transition-colors duration-200">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-violet-600 dark:text-violet-400' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-neutral-400 dark:text-neutral-500'}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-white dark:bg-neutral-900 h-full shadow-2xl flex flex-col z-10 border-r border-neutral-200 dark:border-neutral-800">
            <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-violet-600 text-white font-bold flex items-center justify-center text-sm">
                  S
                </div>
                <span className="font-heading font-bold text-base text-neutral-900 dark:text-white">Studio CRM</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
              <img
                src={profile.profileImage}
                alt={profile.businessName}
                className="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">{profile.businessName}</h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{profile.location}</p>
              </div>
            </div>

            <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium ${
                      isActive
                        ? 'bg-violet-600 text-white'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Mobile Drawer Theme Quick Switcher */}
            <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
              <span className="text-[10px] font-semibold uppercase text-neutral-400 dark:text-neutral-500 block">Appearance</span>
              <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
                <button
                  onClick={() => setTheme('light')}
                  className={`py-1.5 px-2 rounded flex items-center justify-center gap-1 font-medium ${
                    theme === 'light' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  <Sun className="w-3 h-3" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`py-1.5 px-2 rounded flex items-center justify-center gap-1 font-medium ${
                    theme === 'dark' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  <Moon className="w-3 h-3" />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`py-1.5 px-2 rounded flex items-center justify-center gap-1 font-medium ${
                    theme === 'system' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>Auto</span>
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
              <a
                href={`/${profile.slug}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <span>View Public Booking Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 px-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded text-center font-medium hover:bg-neutral-200"
                >
                  Studio Home
                </Link>
                <Link
                  to="/create-account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 px-2 bg-neutral-100 dark:bg-neutral-800 text-violet-600 dark:text-violet-400 rounded text-center font-medium hover:bg-neutral-200"
                >
                  + New Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
