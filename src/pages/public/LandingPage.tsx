import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  CreditCard,
  MessageCircle,
  Clock,
  ShieldCheck,
  Check,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Smartphone,
  TrendingUp,
  Users,
  CheckCircle2,
  DollarSign,
  Share2,
  Menu,
  X,
  Star,
  Building,
  Lock,
  Scissors
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, formatNaira } = useStudio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Fee & Earnings Calculator State
  const [weeklyClients, setWeeklyClients] = useState<number>(12);
  const [averagePrice, setAveragePrice] = useState<number>(35000); // ₦35,000 avg service

  const monthlyGross = weeklyClients * 4 * averagePrice;
  const platformFee = Math.round(monthlyGross * 0.025); // 2.5%
  const monthlyTakeHome = monthlyGross - platformFee;

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is Studio really free to set up?',
      a: 'Yes, 100% free with zero monthly subscription fees or hidden setup charges. You get your custom booking link, complete client management, service menu, and calendar at no cost. We only deduct a tiny 2.5% transaction processing fee when clients pay their deposit online.'
    },
    {
      q: 'How and when do I receive client deposit payments?',
      a: 'Client deposits are processed instantly via secure bank transfer, debit card, or USSD and settled directly into your linked Nigerian bank account (Access, GTBank, Zenith, Kuda, Moniepoint, OPay, etc.).'
    },
    {
      q: 'Do my clients have to download an app or sign up to book?',
      a: 'Never! Your clients do not need to register or install anything. They simply click your link (e.g. studio.app/glowbyadunni) from your Instagram bio, TikTok, or WhatsApp status, pick a service and time, pay their deposit, and receive instant confirmation.'
    },
    {
      q: 'Can I set custom deposit amounts and cancellation rules?',
      a: 'Absolutely. You can specify custom deposit requirements for each service (fixed Naira amount or percentage), set your cancellation policy window, and mandate that balance payments be settled before or on appointment day.'
    },
    {
      q: 'How do WhatsApp reminders work to stop no-shows?',
      a: 'When an appointment is confirmed, Studio generates pre-formatted WhatsApp reminders with appointment details, location directions, and balance due. You can send automated notifications 24 hours and 2 hours before the session.'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-purple-100 selection:text-purple-900 font-sans transition-colors duration-200">

      {/* Primary Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              S
            </div>
            <div>
              <span className="font-heading font-bold text-xl tracking-tight text-neutral-900 dark:text-white">Studio</span>
              <span className="text-[10px] block font-medium uppercase tracking-wider text-violet-600 dark:text-violet-400 -mt-1">
                Stylist CRM
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600 dark:text-neutral-300">
            <a href="#features" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#calculator" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Pricing & Earnings
            </a>
            <a href="#testimonials" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Stylists
            </a>
            <a href="#faq" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to={`/${profile.slug}`}
              className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
            >
              <span>Live Client Demo</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </Link>

            <Link
              to="/login"
              className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Sign In
            </Link>

            <Link
              to="/create-account"
              className="text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-600 dark:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 pt-2 pb-6 space-y-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              How It Works
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Pricing & Earnings
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Stylists
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              FAQ
            </a>
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-2">
              <Link
                to={`/${profile.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-center text-neutral-800 dark:text-neutral-200"
              >
                View Live Booking Page Demo
              </Link>
              <Link
                to="/dashboard/overview"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-center text-neutral-900 dark:text-white"
              >
                Access Stylist Dashboard
              </Link>
              <Link
                to="/create-account"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg bg-violet-600 text-white text-xs font-semibold text-center shadow-sm"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-violet-200/40 dark:bg-violet-900/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Editorial Kicker */}
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-4">
              Online Booking & Payment CRM for Stylists
            </p>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-heading tracking-tight text-neutral-950 dark:text-white leading-[1.15]">
              Run your styling business on autopilot. Get booked & paid upfront.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl mx-auto">
              Replace messy WhatsApp DMs and lost bank payment screenshots. Share your professional booking link, collect deposits in Nigerian Naira, and eliminate client no-shows.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to="/create-account"
                className="w-full sm:w-auto px-6 py-3.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group"
              >
                <span>Get Started Free — No Monthly Fee</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/dashboard/overview"
                className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span>Test-Drive Demo Dashboard</span>
              </Link>
            </div>

            {/* Micro proof line with separators */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" /> 100% Free Setup
              </span>
              <span aria-hidden="true">·</span>
              <span>Direct Bank Settlement</span>
              <span aria-hidden="true">·</span>
              <span>Zero App Downloads for Clients</span>
              <span aria-hidden="true">·</span>
              <span>Automated WhatsApp Reminders</span>
            </div>
          </div>

          {/* Interactive Dual-Surface Mockup (Client Mobile Page + Stylist CRM Workspace) */}
          <div className="mt-14 max-w-5xl mx-auto relative">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden">
              {/* Mock browser header */}
              <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 ml-2">
                    studio.app/{profile.slug}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to={`/${profile.slug}`}
                    className="text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Open Live Demo</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Showcase Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800">
                {/* Left: Client Experience Preview */}
                <div className="p-6 md:p-8 md:col-span-5 flex flex-col justify-between bg-neutral-50/50 dark:bg-neutral-900/40">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                      Step 1 · For Your Clients
                    </span>
                    <h3 className="text-lg font-bold font-heading text-neutral-900 dark:text-white mt-1">
                      Effortless Mobile Booking
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                      Clients tap your bio link, choose services with transparent pricing in Naira, select an available date, and lock it in with an upfront deposit.
                    </p>

                    <div className="mt-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm space-y-3">
                      <div className="flex items-center gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                        <img
                          src={profile.profileImage}
                          alt="Adunni"
                          className="w-10 h-10 rounded-full object-cover border border-violet-200"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{profile.businessName}</h4>
                          <p className="text-[11px] text-neutral-500">{profile.location}</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-violet-50/70 dark:bg-violet-950/40 border border-violet-200/60 dark:border-violet-900/50 flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-neutral-900 dark:text-white block">Bridal Makeup</span>
                            <span className="text-[10px] text-neutral-500">120 mins · ₦30,000 deposit</span>
                          </div>
                          <span className="font-bold text-violet-700 dark:text-violet-400">₦95,000</span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-neutral-900 dark:text-white block">Traditional Glam</span>
                            <span className="text-[10px] text-neutral-500">90 mins · ₦15,000 deposit</span>
                          </div>
                          <span className="font-bold text-neutral-900 dark:text-neutral-100">₦45,000</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Link
                          to={`/${profile.slug}`}
                          className="w-full py-2 bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <span>Try Booking Experience</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Stylist Workspace Preview */}
                <div className="p-6 md:p-8 md:col-span-7 bg-white dark:bg-neutral-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Step 2 · For You, The Stylist
                  </span>
                  <h3 className="text-lg font-bold font-heading text-neutral-900 dark:text-white mt-1">
                    Complete Salon & Client CRM
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                    Watch appointments sync directly to your calendar, track payments, send automated WhatsApp reminders, and build long-term repeat clients.
                  </p>

                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800">
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">October Revenue</span>
                      <span className="text-base font-bold font-heading text-neutral-900 dark:text-white">₦425,000</span>
                      <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">14 appointments</span>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800">
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">Deposits Collected</span>
                      <span className="text-base font-bold font-heading text-violet-600 dark:text-violet-400">₦145,000</span>
                      <span className="text-[10px] text-neutral-500 font-medium block mt-0.5">Paid upfront</span>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 col-span-2 sm:col-span-1">
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">No-Show Rate</span>
                      <span className="text-base font-bold font-heading text-emerald-600 dark:text-emerald-400">0%</span>
                      <span className="text-[10px] text-neutral-500 font-medium block mt-0.5">Automated reminders</span>
                    </div>
                  </div>

                  {/* Upcoming list mockup */}
                  <div className="mt-4 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                    <div className="bg-neutral-100/60 dark:bg-neutral-800/50 px-3 py-2 text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 flex justify-between">
                      <span>Today's Confirmed Bookings</span>
                      <span className="text-violet-600 dark:text-violet-400">Live Workspace</span>
                    </div>
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                      <div className="p-3 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-neutral-900 dark:text-white block">Aisha Oghenekaro</span>
                          <span className="text-[11px] text-neutral-500">Bridal Makeup · 10:00 AM</span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                          ₦30k Paid
                        </span>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-neutral-900 dark:text-white block">Chioma Eze</span>
                          <span className="text-[11px] text-neutral-500">Birthday Glam · 2:30 PM</span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                          ₦10k Paid
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between pt-2">
                    <Link
                      to="/dashboard/overview"
                      className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 flex items-center gap-1"
                    >
                      <span>Enter Stylist Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-[11px] text-neutral-400">Full desktop + mobile support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars Section */}
      <section id="features" className="py-16 sm:py-24 bg-white dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-2">
              Everything in One Place
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold font-heading text-neutral-900 dark:text-white">
              Built specifically for beauty professionals
            </h2>
            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
              No generic spreadsheets or foreign booking apps that charge expensive USD monthly subscriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 flex items-center justify-center mb-4">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
                Guaranteed Upfront Deposits
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                Protect your precious studio time. Require non-refundable or flexible deposits before an appointment is locked onto your calendar.
              </p>
              <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-neutral-700/60 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Card, Bank Transfer, USSD & OPay</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-4">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
                Automated WhatsApp Reminders
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                Send 1-click confirmation receipts, booking directions, and reminder notifications directly to your clients' WhatsApp.
              </p>
              <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-neutral-700/60 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cuts no-shows and late arrivals to near zero</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
                Client History & VIP CRM
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                Keep client records, skin allergies, foundation shades, past looks, booking history, and total spending in one searchable directory.
              </p>
              <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-neutral-700/60 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Coupons, discounts & referral tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-2">
              Three Simple Steps
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold font-heading text-neutral-900 dark:text-white">
              From sign up to your first booking in 5 minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
              <span className="text-2xl font-bold font-heading text-neutral-400 dark:text-neutral-600">01</span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Set up your profile & services
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Add your business name, portfolio photos, service catalog (Bridal, Traditional, Glam, Haircuts), prices in ₦, and deposit rules.
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
              <span className="text-2xl font-bold font-heading text-neutral-400 dark:text-neutral-600">02</span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Paste your link in your bio
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Share your personalized link (studio.app/yourname) on Instagram, WhatsApp status, and TikTok. Clients see available slots in real time.
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
              <span className="text-2xl font-bold font-heading text-neutral-400 dark:text-neutral-600">03</span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Receive bookings & deposits
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Client payments land securely in your account, appointments automatically populate your calendar, and confirmations are sent on WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Fee & Earnings Calculator */}
      <section id="calculator" className="py-16 sm:py-24 bg-white dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              Transparent Pricing Model
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold font-heading text-neutral-900 dark:text-white">
              Zero monthly fee. You only pay when you make money.
            </h2>
            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
              Unlike other booking platforms that bill ₦30,000–₦50,000 every single month regardless of your bookings, Studio is free with a tiny 2.5% transaction fee on collected payments.
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-800/40 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Sliders */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Weekly Appointments: <span className="text-violet-600 dark:text-violet-400 font-bold">{weeklyClients} bookings/week</span>
                    </label>
                    <span className="text-[11px] text-neutral-500">{weeklyClients * 4} / month</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={40}
                    step={1}
                    value={weeklyClients}
                    onChange={(e) => setWeeklyClients(Number(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                    <span>2 bookings</span>
                    <span>20 bookings</span>
                    <span>40 bookings</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Average Service Price: <span className="text-violet-600 dark:text-violet-400 font-bold">{formatNaira(averagePrice)}</span>
                    </label>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={120000}
                    step={5000}
                    value={averagePrice}
                    onChange={(e) => setAveragePrice(Number(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                    <span>₦10,000</span>
                    <span>₦60,000</span>
                    <span>₦120,000</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Unlimited bookings, unlimited client contacts, free WhatsApp reminders</span>
                </div>
              </div>

              {/* Earnings Breakdown Card */}
              <div className="md:col-span-5 bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
                <div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 block">Estimated Monthly Revenue</span>
                  <span className="text-2xl font-bold font-heading text-neutral-900 dark:text-white">
                    {formatNaira(monthlyGross)}
                  </span>
                </div>

                <div className="space-y-2 text-xs pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Monthly Software Fee</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">₦0 (Always Free)</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Payment Processing (2.5%)</span>
                    <span>{formatNaira(platformFee)}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 block">Your Net Monthly Take-Home</span>
                  <span className="text-xl font-bold font-heading text-violet-600 dark:text-violet-400">
                    {formatNaira(monthlyTakeHome)}
                  </span>
                </div>

                <Link
                  to="/create-account"
                  className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Start Free Today</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stylist Testimonials */}
      <section id="testimonials" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-2">
              Loved by Top Stylists
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold font-heading text-neutral-900 dark:text-white">
              Trusted by independent beauty entrepreneurs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                "No more arguing about deposits on WhatsApp or customers sending fake transfer alerts. Studio makes my bridal bookings look so premium and professional."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Adunni"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Adunni Cole</h4>
                  <p className="text-[11px] text-neutral-500">Glow by Adunni · Warri, Delta</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                "The WhatsApp reminders have completely eliminated no-shows. My clients arrive right on time and my weekends are now organized without any overlapping double-bookings."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                  alt="Ifeoma"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Ifeoma Nnamdi</h4>
                  <p className="text-[11px] text-neutral-500">The Braid Haven · Lekki Phase 1, Lagos</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                "Having my own link like studio.app/folashade in my Instagram bio instantly boosted my client inquiries by 40%. The customer booking page is stunning on mobile!"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                  alt="Folashade"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Folashade Adeleke</h4>
                  <p className="text-[11px] text-neutral-500">Adeleke Artistry · Maitama, Abuja</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-24 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-2">
              Got Questions?
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold font-heading text-neutral-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-50/50 dark:bg-neutral-800/30"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-sm font-semibold text-neutral-900 dark:text-white transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-500 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-200/50 dark:border-neutral-800/50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 sm:py-20 bg-violet-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-bold font-heading tracking-tight">
            Ready to upgrade your styling business today?
          </h2>
          <p className="text-sm sm:text-base text-violet-100 max-w-xl mx-auto">
            Join hundreds of Nigerian makeup artists, hair braiders, and fashion stylists who manage their appointments with Studio.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/create-account"
              className="w-full sm:w-auto px-7 py-3 bg-white text-violet-700 hover:bg-neutral-100 text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm"
            >
              Create Free Account
            </Link>
            <Link
              to="/dashboard/overview"
              className="w-full sm:w-auto px-7 py-3 bg-violet-700/60 hover:bg-violet-700 text-white border border-violet-400/40 text-xs sm:text-sm font-bold rounded-xl transition-colors"
            >
              Explore Live Workspace
            </Link>
          </div>
        </div>
      </section>

      {/* Site Footer */}
      <footer className="bg-neutral-900 text-neutral-400 text-xs py-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-sm">
                  S
                </div>
                <span className="font-heading font-bold text-base text-white">Studio</span>
              </div>
              <p className="text-neutral-500 text-[11px] leading-relaxed">
                The modern booking & payment CRM platform for beauty professionals across Nigeria.
              </p>
            </div>

            <div>
              <h4 className="text-neutral-200 font-semibold mb-3">Navigation</h4>
              <ul className="space-y-2 text-[11px]">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/dashboard/overview" className="hover:text-white transition-colors">Stylist Dashboard</Link></li>
                <li><Link to={`/${profile.slug}`} className="hover:text-white transition-colors">Client Booking Demo</Link></li>
                <li><Link to="/create-account" className="hover:text-white transition-colors">Create Free Account</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Stylist Sign In</Link></li>
                <li><Link to="/admin" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">Super Admin Portal</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-neutral-200 font-semibold mb-3">CRM Modules</h4>
              <ul className="space-y-2 text-[11px]">
                <li><Link to="/dashboard/bookings" className="hover:text-white transition-colors">Calendar & Bookings</Link></li>
                <li><Link to="/dashboard/services" className="hover:text-white transition-colors">Service Catalog</Link></li>
                <li><Link to="/dashboard/clients" className="hover:text-white transition-colors">Client Directory</Link></li>
                <li><Link to="/dashboard/payments" className="hover:text-white transition-colors">Payments & Payouts</Link></li>
                <li><Link to="/dashboard/coupons" className="hover:text-white transition-colors">Coupons & Discounts</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-neutral-200 font-semibold mb-3">Supported Cities</h4>
              <p className="text-neutral-500 text-[11px] leading-relaxed">
                Lagos (Lekki, Ikeja, Victoria Island), Abuja, Port Harcourt, Warri, Ibadan, Benin City, Enugu, Kano.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
            <span>© 2026 Studio Inc. Phase One Prototype. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span>Zero setup fees</span>
              <span>·</span>
              <span>Bank-level security</span>
              <span>·</span>
              <span>Nigerian Naira (₦)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
