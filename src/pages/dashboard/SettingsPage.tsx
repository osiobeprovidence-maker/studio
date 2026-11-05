import React, { useState } from 'react';
import {
  Settings,
  Building,
  Calendar,
  CreditCard,
  Globe,
  RotateCcw,
  Save,
  Check,
  AlertTriangle,
  ExternalLink,
  Clock,
  Phone,
  Mail,
  Instagram,
  MapPin,
  Sun,
  Moon,
  Monitor,
  Palette,
  Sparkles
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { ThemeMode } from '../../types';

export const SettingsPage: React.FC = () => {
  const {
    profile,
    settings,
    updateProfile,
    updateSettings,
    resetDemoData,
    theme,
    setTheme,
    showToast,
  } = useStudio();

  const [activeTab, setActiveTab] = useState<'appearance' | 'profile' | 'booking' | 'payment' | 'page'>('appearance');
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Form local state initialized with context
  const [profileForm, setProfileForm] = useState({ ...profile });
  const [settingsForm, setSettingsForm] = useState({ ...settings });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
  };

  const handleThemeSelect = (selectedTheme: ThemeMode) => {
    setTheme(selectedTheme);
    setSettingsForm((prev) => ({ ...prev, theme: selectedTheme }));
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const toggleWorkingDay = (dayIndex: number) => {
    const current = settingsForm.workingDays;
    const exists = current.includes(dayIndex);
    const updated = exists ? current.filter((d) => d !== dayIndex) : [...current, dayIndex];
    setSettingsForm({ ...settingsForm, workingDays: updated.sort() });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900 dark:text-white tracking-tight">
            Settings & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Customize your dashboard theme, salon business profile, working schedules, and bank payouts
          </p>
        </div>

        {/* Reset Demo Data button */}
        <button
          onClick={() => setResetModalOpen(true)}
          className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto border border-neutral-200 dark:border-neutral-700"
        >
          <RotateCcw className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-neutral-200 dark:border-neutral-800 pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'appearance', label: 'Appearance & Theme', icon: Palette },
          { id: 'profile', label: 'Business Profile', icon: Building },
          { id: 'booking', label: 'Booking & Availability', icon: Calendar },
          { id: 'payment', label: 'Payment & Bank Account', icon: CreditCard },
          { id: 'page', label: 'Public Booking Page', icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: APPEARANCE & THEME SWITCHER */}
      {activeTab === 'appearance' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 space-y-6 shadow-xs transition-colors duration-200">
            <div>
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <h3 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
                  Dashboard Theme & Color Mode
                </h3>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Select your preferred visual appearance. Your theme choice is saved automatically and applies across the entire stylist CRM.
              </p>
            </div>

            {/* Theme Selector Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option 1: Light Theme */}
              <div
                onClick={() => handleThemeSelect('light')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between space-y-4 ${
                  theme === 'light'
                    ? 'border-violet-600 bg-violet-50/40 dark:bg-violet-950/20 shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900/50'
                }`}
              >
                <div className="space-y-3">
                  {/* Miniature Visual Mockup */}
                  <div className="h-28 rounded-lg bg-neutral-100 p-2.5 flex flex-col justify-between border border-neutral-200/80 overflow-hidden shadow-2xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded bg-violet-600" />
                        <div className="w-12 h-2 rounded bg-neutral-800" />
                      </div>
                      <div className="w-4 h-2 rounded bg-neutral-300" />
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 py-1">
                      <div className="bg-white p-1.5 rounded border border-neutral-200">
                        <div className="w-8 h-1.5 bg-neutral-400 rounded" />
                        <div className="w-12 h-2.5 bg-neutral-900 rounded mt-1" />
                      </div>
                      <div className="bg-white p-1.5 rounded border border-neutral-200">
                        <div className="w-8 h-1.5 bg-emerald-500 rounded" />
                        <div className="w-10 h-2.5 bg-neutral-900 rounded mt-1" />
                      </div>
                    </div>
                    <div className="bg-white p-1 rounded border border-neutral-200 flex justify-between items-center">
                      <div className="w-14 h-1.5 bg-neutral-400 rounded" />
                      <div className="w-6 h-2 bg-violet-600 rounded" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-bold font-heading text-neutral-900 dark:text-white">
                        Light Mode
                      </span>
                    </div>
                    {theme === 'light' && (
                      <span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs shadow-xs">
                        <Check className="w-3 h-3 stroke-3" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    Crisp white cards, soft gray borders, and dark typography. Optimized for daylight salon environments.
                  </p>
                </div>

                <div className="pt-2">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block ${
                      theme === 'light'
                        ? 'bg-violet-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {theme === 'light' ? 'Active Theme' : 'Click to activate'}
                  </span>
                </div>
              </div>

              {/* Option 2: Dark Theme */}
              <div
                onClick={() => handleThemeSelect('dark')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between space-y-4 ${
                  theme === 'dark'
                    ? 'border-violet-600 bg-violet-50/40 dark:bg-violet-950/20 shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900/50'
                }`}
              >
                <div className="space-y-3">
                  {/* Miniature Visual Mockup */}
                  <div className="h-28 rounded-lg bg-neutral-950 p-2.5 flex flex-col justify-between border border-neutral-800 overflow-hidden shadow-2xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded bg-violet-600" />
                        <div className="w-12 h-2 rounded bg-neutral-200" />
                      </div>
                      <div className="w-4 h-2 rounded bg-neutral-700" />
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 py-1">
                      <div className="bg-neutral-900 p-1.5 rounded border border-neutral-800">
                        <div className="w-8 h-1.5 bg-neutral-500 rounded" />
                        <div className="w-12 h-2.5 bg-neutral-100 rounded mt-1" />
                      </div>
                      <div className="bg-neutral-900 p-1.5 rounded border border-neutral-800">
                        <div className="w-8 h-1.5 bg-emerald-400 rounded" />
                        <div className="w-10 h-2.5 bg-neutral-100 rounded mt-1" />
                      </div>
                    </div>
                    <div className="bg-neutral-900 p-1 rounded border border-neutral-800 flex justify-between items-center">
                      <div className="w-14 h-1.5 bg-neutral-500 rounded" />
                      <div className="w-6 h-2 bg-violet-500 rounded" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-violet-400" />
                      <span className="text-sm font-bold font-heading text-neutral-900 dark:text-white">
                        Dark Mode
                      </span>
                    </div>
                    {theme === 'dark' && (
                      <span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs shadow-xs">
                        <Check className="w-3 h-3 stroke-3" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    Deep charcoal canvas with rich dark surfaces and reduced eye strain. Ideal for studio lighting and evening work.
                  </p>
                </div>

                <div className="pt-2">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block ${
                      theme === 'dark'
                        ? 'bg-violet-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {theme === 'dark' ? 'Active Theme' : 'Click to activate'}
                  </span>
                </div>
              </div>

              {/* Option 3: System Match */}
              <div
                onClick={() => handleThemeSelect('system')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between space-y-4 ${
                  theme === 'system'
                    ? 'border-violet-600 bg-violet-50/40 dark:bg-violet-950/20 shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900/50'
                }`}
              >
                <div className="space-y-3">
                  {/* Miniature Visual Mockup Split */}
                  <div className="h-28 rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-700 flex shadow-2xs">
                    <div className="flex-1 bg-neutral-100 p-2 flex flex-col justify-between border-r border-neutral-300">
                      <div className="w-10 h-2 bg-neutral-800 rounded" />
                      <div className="bg-white p-1 rounded border border-neutral-200">
                        <div className="w-8 h-2 bg-neutral-900 rounded" />
                      </div>
                      <div className="w-6 h-1.5 bg-violet-600 rounded" />
                    </div>
                    <div className="flex-1 bg-neutral-950 p-2 flex flex-col justify-between">
                      <div className="w-10 h-2 bg-neutral-200 rounded" />
                      <div className="bg-neutral-900 p-1 rounded border border-neutral-800">
                        <div className="w-8 h-2 bg-white rounded" />
                      </div>
                      <div className="w-6 h-1.5 bg-violet-500 rounded" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-sm font-bold font-heading text-neutral-900 dark:text-white">
                        System Sync
                      </span>
                    </div>
                    {theme === 'system' && (
                      <span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs shadow-xs">
                        <Check className="w-3 h-3 stroke-3" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    Automatically matches your computer or mobile operating system dark/light schedule.
                  </p>
                </div>

                <div className="pt-2">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block ${
                      theme === 'system'
                        ? 'bg-violet-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {theme === 'system' ? 'Active Theme' : 'Click to activate'}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Component Preview Showcase */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  Live Component Styling Preview
                </span>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">
                  Current Mode: <strong className="text-violet-600 dark:text-violet-400 capitalize">{theme}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Metric preview card */}
                <div className="bg-white dark:bg-neutral-900 p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-1">
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Appointment Revenue</span>
                  <div className="text-lg font-bold font-heading text-neutral-900 dark:text-white tabular-nums">
                    ₦380,000
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    +18.4% this month
                  </span>
                </div>

                {/* Status pill preview card */}
                <div className="bg-white dark:bg-neutral-900 p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-2">
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Status Indicators</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Confirmed
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      Pending
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                      VIP Client
                    </span>
                  </div>
                </div>

                {/* Button states preview card */}
                <div className="bg-white dark:bg-neutral-900 p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-2">
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Interactive Action</span>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-xs font-semibold shadow-xs">
                      Primary CTA
                    </button>
                    <button className="px-2.5 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md text-xs font-medium border border-neutral-200 dark:border-neutral-700">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BUSINESS PROFILE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 space-y-6 shadow-xs transition-colors duration-200">
          <div>
            <h3 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
              Stylist & Studio Identity
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Information displayed to clients on your public booking page and invoices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Business / Brand Name *</label>
              <input
                type="text"
                required
                value={profileForm.businessName}
                onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })}
                className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Lead Stylist / Owner Name *</label>
              <input
                type="text"
                required
                value={profileForm.ownerName}
                onChange={(e) => setProfileForm({ ...profileForm, ownerName: e.target.value })}
                className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Professional Title / Subtitle</label>
              <input
                type="text"
                value={profileForm.title}
                onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Biography & Glam Philosophy</label>
              <textarea
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">City & State *</label>
              <input
                type="text"
                value={profileForm.location}
                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Full Studio Physical Address</label>
              <input
                type="text"
                value={profileForm.fullAddress}
                onChange={(e) => setProfileForm({ ...profileForm, fullAddress: e.target.value })}
                className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Phone / WhatsApp *</label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, phone: e.target.value, whatsapp: e.target.value })
                }
                className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg font-mono bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Instagram Handle</label>
              <input
                type="text"
                value={profileForm.instagram}
                onChange={(e) => setProfileForm({ ...profileForm, instagram: e.target.value })}
                className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Business Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: BOOKING SETTINGS */}
      {activeTab === 'booking' && (
        <form onSubmit={handleSaveSettings} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 space-y-6 shadow-xs transition-colors duration-200">
          <div>
            <h3 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
              Salon Availability & Scheduling Rules
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Control which dates, hours, and buffer slots customers can book online
            </p>
          </div>

          {/* Working Days Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
              Active Working Days
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
              {dayNames.map((day, idx) => {
                const isSelected = settingsForm.workingDays.includes(idx);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleWorkingDay(idx)}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                        : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Opening Time</label>
              <input
                type="time"
                value={settingsForm.workingHoursStart}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, workingHoursStart: e.target.value })
                }
                className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Closing Time</label>
              <input
                type="time"
                value={settingsForm.workingHoursEnd}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, workingHoursEnd: e.target.value })
                }
                className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Buffer Time Between Appointments
              </label>
              <select
                value={settingsForm.bufferMinutes}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, bufferMinutes: Number(e.target.value) })
                }
                className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              >
                <option value={0}>No buffer</option>
                <option value={15}>15 minutes (Recommended)</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
              </select>
            </div>
          </div>

          {/* Cancellation & Deposit Policies */}
          <div className="space-y-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Cancellation & Rescheduling Policy (Visible to Clients)
              </label>
              <textarea
                rows={2}
                value={profileForm.cancellationPolicy}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, cancellationPolicy: e.target.value })
                }
                className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Deposit & Balance Terms (Visible at Checkout)
              </label>
              <textarea
                rows={2}
                value={profileForm.paymentTerms}
                onChange={(e) => setProfileForm({ ...profileForm, paymentTerms: e.target.value })}
                className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Booking Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: PAYMENT SETTINGS */}
      {activeTab === 'payment' && (
        <form onSubmit={handleSaveSettings} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 space-y-6 shadow-xs transition-colors duration-200">
          <div>
            <h3 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
              Payout Bank Account & Fee Structure
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Where your client booking earnings are settled automatically
            </p>
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3 text-xs">
            <h4 className="font-semibold text-neutral-900 dark:text-white">Commercial Bank Account Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Financial Institution</label>
                <input
                  type="text"
                  value={settingsForm.bankAccount.bankName}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      bankAccount: { ...settingsForm.bankAccount, bankName: e.target.value },
                    })
                  }
                  className="w-full p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-600 dark:text-neutral-400 block mb-1">NUBAN Account Number</label>
                <input
                  type="text"
                  value={settingsForm.bankAccount.accountNumber}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      bankAccount: { ...settingsForm.bankAccount, accountNumber: e.target.value },
                    })
                  }
                  className="w-full p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg font-mono text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Account Holder Name</label>
                <input
                  type="text"
                  value={settingsForm.bankAccount.accountName}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      bankAccount: { ...settingsForm.bankAccount, accountName: e.target.value },
                    })
                  }
                  className="w-full p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Platform fee info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-1 bg-white dark:bg-neutral-900">
              <span className="font-semibold text-neutral-900 dark:text-white block">Platform Fee Model</span>
              <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
                Studio is 100% free with no monthly subscription. A transparent {settingsForm.transactionFeePercent}% transaction fee is deducted upon successful client checkout.
              </p>
            </div>

            <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-1 bg-white dark:bg-neutral-900">
              <span className="font-semibold text-neutral-900 dark:text-white block">Payout Frequency</span>
              <select
                value={settingsForm.payoutFrequency}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    payoutFrequency: e.target.value as 'Daily' | 'Weekly' | 'Instant',
                  })
                }
                className="w-full p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white mt-1"
              >
                <option value="Daily">Daily Settlement (Every morning at 07:00 AM)</option>
                <option value="Weekly">Weekly (Every Monday)</option>
                <option value="Instant">Instant Payouts</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Payment Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 5: PUBLIC BOOKING PAGE CONFIG */}
      {activeTab === 'page' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 space-y-6 shadow-xs transition-colors duration-200">
          <div>
            <h3 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
              Public Booking URL & Page Customization
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Your customized shareable link for client bookings
            </p>
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-2 text-xs">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300 block">Personalized Booking Link</span>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 dark:text-neutral-400 font-mono">studio.app/</span>
              <input
                type="text"
                value={profileForm.slug}
                onChange={(e) => setProfileForm({ ...profileForm, slug: e.target.value })}
                className="p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-violet-700 dark:text-violet-400 font-mono font-semibold flex-1 max-w-xs"
              />
              <a
                href={`/${profileForm.slug}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Preview</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Portfolio gallery preview in settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Showcase Portfolio Imagery ({profile.portfolio.length} Looks)
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {profile.portfolio.map((item) => (
                <div key={item.id} className="relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 group h-32">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[10px] text-white font-medium truncate">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RESET DEMO DATA CONFIRMATION MODAL */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
                Reset Demo Data?
              </h3>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              This will restore the original demo bookings, clients, services, transactions, and Nigerian stylist settings for <span className="font-semibold">{profile.businessName}</span>. Any changes made in your local storage session will be re-seeded.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => setResetModalOpen(false)}
                className="px-3.5 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setResetModalOpen(false);
                }}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Yes, Reset All Demo Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
