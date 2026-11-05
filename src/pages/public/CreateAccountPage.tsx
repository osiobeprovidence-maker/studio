import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Check,
  CheckCircle2,
  Building,
  Phone,
  Mail,
  User,
  MapPin,
  Lock,
  Scissors,
  CreditCard,
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff,
  Globe
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { Service } from '../../types';

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

export const CreateAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile, updateSettings, showToast, addService } = useStudio();

  // Current onboarding step (1: Personal, 2: Business & Slug, 3: Bank Payouts, 4: Services)
  const [step, setStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Authentication method: 'email' or 'google'
  const [authMethod, setAuthMethod] = useState<'email' | 'google'>('email');
  const [googleConnected, setGoogleConnected] = useState<boolean>(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState<boolean>(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    ownerName: '',
    email: '',
    password: '',
    phone: '+234 ',
    businessName: '',
    category: 'Makeup Artist & Beauty Specialist',
    locationCity: 'Lagos',
    locationArea: 'Lekki Phase 1',
    slug: '',
    bio: '',
    bankName: 'Guaranty Trust Bank (GTBank)',
    accountNumber: '',
    accountName: '',
    importSampleServices: true,
  });

  const handleSelectGoogleAccount = (name: string, email: string) => {
    setFormData((prev) => ({
      ...prev,
      ownerName: name,
      email: email,
      businessName: prev.businessName || `${name.split(' ')[0]}'s Studio`,
      slug: prev.slug || name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, ''),
    }));
    setAuthMethod('google');
    setGoogleConnected(true);
    setIsGoogleModalOpen(false);
    showToast(`Signed in with Google as ${email}`, 'success');
  };

  // Common Nigerian banks
  const nigerianBanks = [
    'Guaranty Trust Bank (GTBank)',
    'Access Bank',
    'Zenith Bank',
    'United Bank for Africa (UBA)',
    'First Bank of Nigeria',
    'Kuda Microfinance Bank',
    'Moniepoint MFB',
    'OPay Digital Services',
    'Stanbic IBTC Bank',
    'Fidelity Bank',
    'Sterling Bank',
    'Wema Bank / ALAT'
  ];

  // Nigerian Cities / States
  const cities = [
    'Lagos (Lekki / Victoria Island)',
    'Lagos (Ikeja / Mainland)',
    'Abuja (FCT)',
    'Port Harcourt (Rivers)',
    'Warri (Delta)',
    'Ibadan (Oyo)',
    'Benin City (Edo)',
    'Enugu (Enugu)',
    'Asaba (Delta)',
    'Kano (Kano)'
  ];

  // Auto-generate slug when business name changes
  const handleBusinessNameChange = (name: string) => {
    const generatedSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 24);

    setFormData((prev) => ({
      ...prev,
      businessName: name,
      slug: prev.slug === '' || prev.slug === prev.businessName.toLowerCase().replace(/[^a-z0-9]/g, '') ? generatedSlug : prev.slug,
    }));
  };

  // Starter sample services based on category
  const getStarterServices = (category: string): Omit<Service, 'id'>[] => {
    if (category.includes('Hair')) {
      return [
        {
          name: 'Knotless Box Braids (Waist Length)',
          description: 'Flawless lightweight knotless braiding with clean parting and dipped curls.',
          price: 35000,
          durationMinutes: 240,
          depositRequired: true,
          depositType: 'fixed',
          depositValue: 10000,
          calculatedDeposit: 10000,
          isActive: true,
          category: 'Hair & Gele',
          coverImage: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=400&q=80',
        },
        {
          name: 'Silk Press & Hair Treatment',
          description: 'Deep hydration steam therapy, blow dry, and bone-straight glossy silk press.',
          price: 25000,
          durationMinutes: 120,
          depositRequired: true,
          depositType: 'fixed',
          depositValue: 10000,
          calculatedDeposit: 10000,
          isActive: true,
          category: 'Hair & Gele',
          coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
        },
        {
          name: 'Wig Installation & Custom Frontal',
          description: 'Bleaching knots, hairline plucking, melt lace glue application, and styling.',
          price: 30000,
          durationMinutes: 150,
          depositRequired: true,
          depositType: 'fixed',
          depositValue: 15000,
          calculatedDeposit: 15000,
          isActive: true,
          category: 'Hair & Gele',
          coverImage: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=400&q=80',
        }
      ];
    }

    if (category.includes('Nail')) {
      return [
        {
          name: 'Full Set Acrylic with Gel Polish',
          description: 'Sculpted acrylic extensions with cuticle grooming and chip-resistant gel finish.',
          price: 20000,
          durationMinutes: 90,
          depositRequired: true,
          depositType: 'fixed',
          depositValue: 5000,
          calculatedDeposit: 5000,
          isActive: true,
          category: 'Glam',
          coverImage: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=400&q=80',
        },
        {
          name: 'Luxury Spa Pedicure & Polish',
          description: 'Aromatherapy foot soak, exfoliation scrub, callus treatment, and massage.',
          price: 18000,
          durationMinutes: 75,
          depositRequired: true,
          depositType: 'fixed',
          depositValue: 5000,
          calculatedDeposit: 5000,
          isActive: true,
          category: 'Glam',
          coverImage: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=400&q=80',
        }
      ];
    }

    // Default Makeup Artist starter services
    return [
      {
        name: 'Bridal Glam Experience',
        description: 'Complete luxury bridal makeup, skin prep, mink lash application, and touch-up kit.',
        price: 95000,
        durationMinutes: 120,
        depositRequired: true,
        depositType: 'fixed',
        depositValue: 30000,
        calculatedDeposit: 30000,
        isActive: true,
        category: 'Bridal',
        coverImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
      },
      {
        name: 'Birthday & Special Event Glam',
        description: 'Sculpted brows, custom eyeshadow glam, flawless foundation match, and lips.',
        price: 35000,
        durationMinutes: 90,
        depositRequired: true,
        depositType: 'fixed',
        depositValue: 10000,
        calculatedDeposit: 10000,
        isActive: true,
        category: 'Glam',
        coverImage: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80',
      },
      {
        name: 'Soft Matte Everyday Glam',
        description: 'Natural radiant finish, defined natural brows, nude lips, and subtle liner.',
        price: 25000,
        durationMinutes: 60,
        depositRequired: true,
        depositType: 'fixed',
        depositValue: 10000,
        calculatedDeposit: 10000,
        isActive: true,
        category: 'Glam',
        coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
      }
    ];
  };

  const handleFinishOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const finalSlug = formData.slug || formData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'mystudio';

      // 1. Update stylist profile in context
      updateProfile({
        businessName: formData.businessName || 'My Beauty Studio',
        ownerName: formData.ownerName || 'Studio Stylist',
        slug: finalSlug,
        title: formData.category,
        location: `${formData.locationArea}, ${formData.locationCity}`,
        phone: formData.phone || '+234 800 000 0000',
        whatsapp: formData.phone || '+234 800 000 0000',
        bio: formData.bio || `Welcome to ${formData.businessName || 'my studio'}! We deliver top-tier beauty styling in ${formData.locationCity}. Book your slot online.`,
      });

      // 2. Update payout bank settings
      updateSettings({
        bankAccount: {
          accountName: formData.accountName || formData.ownerName || 'VERIFIED STYLIST',
          accountNumber: formData.accountNumber || '0123456789',
          bankName: formData.bankName,
        },
      });

      // 3. Optional: Add starter services if requested
      if (formData.importSampleServices) {
        const samples = getStarterServices(formData.category);
        samples.forEach((srv) => addService(srv));
      }

      setIsSubmitting(false);
      showToast(`Welcome to Studio, ${formData.ownerName || 'Stylist'}! Your booking CRM is ready.`, 'success');
      navigate('/dashboard/overview');
    }, 800);
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
            Already have an account?
          </span>
          <Link
            to="/login"
            className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700"
          >
            Sign In
          </Link>
          <span className="text-neutral-300 dark:text-neutral-700">|</span>
          <Link
            to="/dashboard/overview"
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium"
          >
            Try Demo
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 py-10 px-4 sm:px-6 flex items-center justify-center">
        <div className="w-full max-w-xl">
          {/* Progress Indicators */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className={step >= 1 ? 'text-violet-600 dark:text-violet-400' : 'text-neutral-400'}>
                1. Account Details
              </span>
              <span className={step >= 2 ? 'text-violet-600 dark:text-violet-400' : 'text-neutral-400'}>
                2. Business & URL
              </span>
              <span className={step >= 3 ? 'text-violet-600 dark:text-violet-400' : 'text-neutral-400'}>
                3. Payout Bank
              </span>
            </div>
            <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-600 transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-sm">
            <form onSubmit={step === 3 ? handleFinishOnboarding : (e) => { e.preventDefault(); setStep(step + 1); }}>
              {/* STEP 1: Account Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold font-heading text-neutral-900 dark:text-white">
                      Create your Stylist Account
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Choose how you want to create your account. Both options allow you to customize your styling brand and booking page.
                    </p>
                  </div>

                  {/* Auth Method Selector */}
                  <div className="flex items-center gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMethod('google');
                        if (!googleConnected) {
                          setIsGoogleModalOpen(true);
                        }
                      }}
                      className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        authMethod === 'google'
                          ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      <GoogleIcon />
                      <span>Google Account</span>
                      {googleConnected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMethod('email')}
                      className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        authMethod === 'email'
                          ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email & Password</span>
                    </button>
                  </div>

                  {/* IF GOOGLE SIGNUP CHOSEN */}
                  {authMethod === 'google' && (
                    <div className="space-y-4 pt-1">
                      {!googleConnected ? (
                        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/40 text-center space-y-3">
                          <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-700 shadow-xs flex items-center justify-center mx-auto border border-neutral-200 dark:border-neutral-600">
                            <GoogleIcon />
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                              Sign up with your Google Account
                            </h3>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                              Connect your Google account instantly. Then fill in your phone number, business brand, and payout bank details.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsGoogleModalOpen(true)}
                            className="w-full py-2.5 px-4 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                          >
                            <GoogleIcon />
                            <span>Continue with Google</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3.5">
                          {/* Connected Google Account Banner */}
                          <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center shadow-xs border border-emerald-200 dark:border-emerald-800 shrink-0">
                                <GoogleIcon />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                                    {formData.ownerName}
                                  </span>
                                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.2 rounded shrink-0">
                                    Google Verified
                                  </span>
                                </div>
                                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block font-mono truncate">
                                  {formData.email}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsGoogleModalOpen(true)}
                              className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer shrink-0 ml-2"
                            >
                              Switch
                            </button>
                          </div>

                          {/* WhatsApp Phone Number for Google users */}
                          <div>
                            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                              WhatsApp Phone Number (+234) *
                            </label>
                            <div className="relative">
                              <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="tel"
                                required
                                placeholder="+234 803 123 4567"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                              />
                            </div>
                            <span className="text-[10px] text-neutral-400 mt-1 block">
                              Required for client booking alerts and automated appointment confirmations.
                            </span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Password not needed — your studio is linked to Google Single Sign-On.</span>
                          </div>

                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => setStep(2)}
                              disabled={!formData.phone || formData.phone.trim() === '+234'}
                              className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                            >
                              <span>Continue to Business Details</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* IF EMAIL SIGNUP CHOSEN */}
                  {authMethod === 'email' && (
                    <div className="pt-2 space-y-3.5">
                      <div>
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          Your Full Name *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Adunni Cole"
                            value={formData.ownerName}
                            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            placeholder="stylist@gmail.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          WhatsApp Phone Number (+234) *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            placeholder="+234 803 123 4567"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                          />
                        </div>
                        <span className="text-[10px] text-neutral-400 mt-1 block">
                          Used for appointment notifications and client WhatsApp reminders.
                        </span>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          Create Password *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            placeholder="••••••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={!formData.ownerName || !formData.email}
                          className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                        >
                          <span>Continue to Business Profile</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Business Profile & Custom URL */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold font-heading text-neutral-900 dark:text-white">
                      Your Styling Brand & Booking URL
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Set up your shareable public link for Instagram, TikTok, and WhatsApp.
                    </p>
                  </div>

                  <div className="pt-2 space-y-3.5">
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                        Brand / Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Glow by Adunni or Braid Bar Lagos"
                        value={formData.businessName}
                        onChange={(e) => handleBusinessNameChange(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                        Primary Specialty / Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      >
                        <option value="Makeup Artist & Beauty Specialist">Makeup Artist (Bridal & Event)</option>
                        <option value="Hair Stylist & Braider">Hair Stylist, Wigs & Braids</option>
                        <option value="Nail Technician & Artist">Nail Technician & Pedicurist</option>
                        <option value="Lash & Brow Specialist">Lash Extension & Brow Specialist</option>
                        <option value="Fashion & Wardrobe Stylist">Fashion Stylist & Wardrobe Consultant</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          City / Region *
                        </label>
                        <select
                          value={formData.locationCity}
                          onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                        >
                          {cities.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          Neighborhood / Studio Area
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Lekki Phase 1 or GRA"
                          value={formData.locationArea}
                          onChange={(e) => setFormData({ ...formData, locationArea: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                        />
                      </div>
                    </div>

                    {/* Booking URL Generator Box */}
                    <div className="p-3.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900/60">
                      <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                        Your Custom Shareable Booking Link
                      </label>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-neutral-500 font-mono">studio.app/</span>
                        <input
                          type="text"
                          required
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                          placeholder="yourbrand"
                          className="flex-1 font-mono font-bold text-violet-700 dark:text-violet-300 bg-white dark:bg-neutral-900 px-2.5 py-1.5 rounded border border-violet-300 dark:border-violet-700 focus:outline-none"
                        />
                      </div>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1.5 block">
                        This is the unique URL your clients will visit to book and pay deposits.
                      </span>
                    </div>

                    {/* Starter Services Checkbox */}
                    <div className="pt-1 flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="importSampleServices"
                        checked={formData.importSampleServices}
                        onChange={(e) => setFormData({ ...formData, importSampleServices: e.target.checked })}
                        className="mt-0.5 accent-violet-600 rounded cursor-pointer"
                      />
                      <label htmlFor="importSampleServices" className="text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                        <span className="font-semibold block">Load sample services for {formData.category}</span>
                        <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                          Pre-populates sample prices in Naira (₦) and durations that you can easily edit anytime.
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      disabled={!formData.businessName || !formData.slug}
                      className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                    >
                      <span>Continue to Payout Bank</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Nigerian Bank Payout Details */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold font-heading text-neutral-900 dark:text-white">
                      Direct Deposit Bank Account
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Where would you like client deposits and payments transferred?
                    </p>
                  </div>

                  <div className="pt-2 space-y-3.5">
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                        Select Nigerian Bank *
                      </label>
                      <select
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      >
                        {nigerianBanks.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                        10-Digit NUBAN Account Number *
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        required
                        placeholder="0123456789"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, '') })}
                        className="w-full font-mono px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                        Account Holder Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={formData.ownerName || 'e.g. ADUNNI COLE'}
                        value={formData.accountName}
                        onChange={(e) => setFormData({ ...formData, accountName: e.target.value.toUpperCase() })}
                        className="w-full font-mono uppercase px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                      <span className="text-[10px] text-neutral-400 mt-1 block">
                        Must match the name registered on your Nigerian bank account.
                      </span>
                    </div>

                    {/* Security Guarantee Box */}
                    <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-xs flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                          Bank-grade security & automated payouts
                        </span>
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug block mt-0.5">
                          Payments are processed with 256-bit encryption. Zero monthly software fees. Only standard 2.5% processing fee on completed client deposits.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Launching Your Studio...</span>
                      ) : (
                        <>
                          <span>Complete Setup & Open Studio</span>
                          <Sparkles className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Quick Demo Bypass */}
          <div className="mt-6 text-center">
            <Link
              to="/dashboard/overview"
              className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium"
            >
              Skip setup and view preloaded demo workspace (Glow by Adunni) →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-400">
        Studio — Free Online Booking & CRM for Nigerian Beauty Stylists
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
                to continue to <span className="font-semibold text-neutral-800 dark:text-neutral-200">Studio CRM</span>
              </p>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 border-y border-neutral-100 dark:border-neutral-800">
              {/* Account 1 */}
              <button
                type="button"
                onClick={() => handleSelectGoogleAccount('Adunni Cole', 'qwertlyjointheq@gmail.com')}
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
                onClick={() => handleSelectGoogleAccount('Glow Artistry Warri', 'glowbyadunni@gmail.com')}
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
                    handleSelectGoogleAccount(name, customGoogleEmail);
                  }}
                  className="px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 disabled:opacity-40 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Use
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
