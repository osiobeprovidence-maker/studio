import React, { useState } from 'react';
import {
  BellRing,
  CheckCircle2,
  Phone,
  Clock,
  MessageSquare,
  ShieldCheck,
  Send,
  Smartphone,
  RefreshCw,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const NotificationsPage: React.FC = () => {
  const { settings, profile, updateSettings, showToast, formatNaira } = useStudio();

  const [activePreviewType, setActivePreviewType] = useState<
    'newBooking' | 'customerConfirm' | 'reminder' | 'dailySummary'
  >('newBooking');

  const [isSimulatingSend, setIsSimulatingSend] = useState(false);

  const notifications = settings.whatsappNotifications;

  const handleToggle = (key: keyof typeof notifications) => {
    updateSettings({
      whatsappNotifications: {
        ...notifications,
        [key]: !notifications[key],
      },
    });
  };

  const handleTimingChange = (timing: '24h' | '12h' | '2h' | '30m') => {
    updateSettings({
      whatsappNotifications: {
        ...notifications,
        reminderTiming: timing,
      },
    });
  };

  const handleSimulateTestMessage = () => {
    setIsSimulatingSend(true);
    setTimeout(() => {
      setIsSimulatingSend(false);
      showToast(`Simulated WhatsApp alert dispatched to ${notifications.phoneNumber}`);
    }, 800);
  };

  const getPreviewMessage = () => {
    switch (activePreviewType) {
      case 'newBooking':
        return `Hello ${profile.ownerName.split(' ')[0]}! ✨ You have a new booking.

👤 Customer: Aisha Oghenekaro
💅 Service: Bridal Makeup (White Wedding)
📅 Date: Sunday, November 1, 2026
⏰ Time: 09:00 AM (120 mins)
💰 Deposit received: ${formatNaira(30000)}
💳 Balance due at salon: ${formatNaira(65000)}
📍 Venue: Plot 14 Ogunu Road, GRA Phase II, Warri

Reply 1 to Confirm or manage on studio.app/${profile.slug}`;

      case 'customerConfirm':
        return `Hello Aisha! 💖 Your appointment with Glow by Adunni is confirmed.

Service: Bridal Makeup (White Wedding)
Date: Sunday, Nov 01, 2026 at 09:00 AM
Deposit Paid: ${formatNaira(30000)}
Remaining Balance: ${formatNaira(65000)}

📍 Location: Plot 14 Ogunu Road, GRA Phase II, Warri
Please arrive 10 minutes early without existing makeup. We look forward to glamming you! ✨`;

      case 'reminder':
        return `Friendly Reminder from Glow by Adunni 🌸

Hello Aisha, your bridal glam session is coming up in ${
          notifications.reminderTiming === '24h'
            ? '24 hours'
            : notifications.reminderTiming === '12h'
            ? '12 hours'
            : notifications.reminderTiming === '2h'
            ? '2 hours'
            : '30 minutes'
        }!

📅 Time: 09:00 AM today
📍 Address: Plot 14 Ogunu Road, GRA Phase II, Warri
Balance payable upon arrival: ${formatNaira(65000)}

Need to reach Adunni? Call or chat ${profile.phone}.`;

      case 'dailySummary':
        return `☀️ Good morning ${profile.ownerName.split(' ')[0]}! Here is your Studio daily agenda:

Today, Nov 01, 2026: 2 Appointments
• 09:00 AM - Aisha O. (Bridal Makeup, Bal: ₦65,000)
• 02:30 PM - Chioma E. (Birthday Glam, Bal: ₦25,000)

Estimated collections today: ₦90,000
Have a productive and radiant day! ✨`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900 dark:text-white tracking-tight">
          WhatsApp Notification System
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
          Configure automated WhatsApp alerts for you and instant confirmation receipts for clients
        </p>
      </div>

      {/* Connection Status Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs transition-colors duration-200">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-heading text-neutral-900 dark:text-white">
                WhatsApp Business Gateway
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                Connected
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Verified phone: <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">{notifications.phoneNumber}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateTestMessage}
            disabled={isSimulatingSend}
            className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-200 dark:border-neutral-700"
          >
            <Send className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
            <span>{isSimulatingSend ? 'Sending...' : 'Send Test Alert'}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Toggles & Timing (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Notification Triggers Box */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-xs transition-colors duration-200">
            <h3 className="text-sm font-bold font-heading text-neutral-900 dark:text-white">
              Automated Notification Triggers
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Select which events trigger automated WhatsApp messages to you and your clients.
            </p>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
              {/* Trigger 1: New bookings */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-white block">
                    New Online Bookings (Stylist Alert)
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                    Receive instant WhatsApp ping when a client books and pays deposit on your link
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.sendNewBooking}
                  onChange={() => handleToggle('sendNewBooking')}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500 cursor-pointer"
                />
              </div>

              {/* Trigger 2: Booking Confirmations */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-white block">
                    Customer Booking Confirmations
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                    Send clients immediate booking summary and deposit receipt on WhatsApp
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.sendConfirmation}
                  onChange={() => handleToggle('sendConfirmation')}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500 cursor-pointer"
                />
              </div>

              {/* Trigger 3: Appointment Reminders */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-white block">
                    Customer Appointment Reminders
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                    Automatically remind clients before their session to reduce no-shows
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.sendReminder}
                  onChange={() => handleToggle('sendReminder')}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500 cursor-pointer"
                />
              </div>

              {/* Trigger 4: Booking Cancellations */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-white block">
                    Booking Cancellations
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                    Notify stylist and client if an appointment is cancelled or declined
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.sendCancellation}
                  onChange={() => handleToggle('sendCancellation')}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500 cursor-pointer"
                />
              </div>

              {/* Trigger 5: Rescheduled Appointments */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-white block">
                    Rescheduled Appointments
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                    Send revised appointment dates and times to the client
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.sendReschedule}
                  onChange={() => handleToggle('sendReschedule')}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500 cursor-pointer"
                />
              </div>

              {/* Trigger 6: Payment Confirmations */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-white block">
                    Payment & Balance Confirmations
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                    Issue digital transaction receipts when balance payments are marked complete
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.sendPaymentConfirmation}
                  onChange={() => handleToggle('sendPaymentConfirmation')}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500 cursor-pointer"
                />
              </div>

              {/* Trigger 7: Daily Summaries */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-white block">
                    Daily Morning Agenda Summary
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                    Receive an 8:00 AM WhatsApp digest of today's booked clients and revenue expectations
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.sendDailySummary}
                  onChange={() => handleToggle('sendDailySummary')}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Reminder Lead Time Configuration */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-xs transition-colors duration-200">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <h3 className="text-sm font-bold font-heading text-neutral-900 dark:text-white">
                Customer Reminder Timing
              </h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              When should WhatsApp send the appointment reminder prior to start time?
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {[
                { id: '24h', label: '24 hours before' },
                { id: '12h', label: '12 hours before' },
                { id: '2h', label: '2 hours before' },
                { id: '30m', label: '30 mins before' },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleTimingChange(option.id as any)}
                  className={`p-3 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                    notifications.reminderTiming === option.id
                      ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/60 text-violet-900 dark:text-violet-200 shadow-xs ring-1 ring-violet-500/30'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: WhatsApp Mockup (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-heading text-neutral-900 dark:text-white">
                Live WhatsApp Message Preview
              </h3>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-semibold">Interactive</span>
            </div>

            {/* Template Selector Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-medium">
              <button
                onClick={() => setActivePreviewType('newBooking')}
                className={`p-1.5 rounded text-center transition-colors cursor-pointer ${
                  activePreviewType === 'newBooking'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                New Booking Alert
              </button>
              <button
                onClick={() => setActivePreviewType('customerConfirm')}
                className={`p-1.5 rounded text-center transition-colors cursor-pointer ${
                  activePreviewType === 'customerConfirm'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Client Receipt
              </button>
              <button
                onClick={() => setActivePreviewType('reminder')}
                className={`p-1.5 rounded text-center transition-colors cursor-pointer ${
                  activePreviewType === 'reminder'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Client Reminder
              </button>
              <button
                onClick={() => setActivePreviewType('dailySummary')}
                className={`p-1.5 rounded text-center transition-colors cursor-pointer ${
                  activePreviewType === 'dailySummary'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Daily Digest
              </button>
            </div>

            {/* WhatsApp Chat Viewport */}
            <div className="rounded-2xl border-4 border-neutral-800 dark:border-neutral-700 bg-[#ECE5DD] dark:bg-[#121B22] overflow-hidden shadow-md">
              {/* WhatsApp Chat Header */}
              <div className="bg-[#075E54] dark:bg-[#1F2C34] text-white p-3 flex items-center justify-between border-b border-[#00a884]/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#075E54] font-bold text-xs flex items-center justify-center">
                    S
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">Studio Booking Assistant</h4>
                    <p className="text-[10px] text-emerald-200">Official Notification Bot</p>
                  </div>
                </div>
                <div className="text-[10px] bg-[#128C7E] px-2 py-0.5 rounded text-white font-medium">
                  Verified
                </div>
              </div>

              {/* Chat Canvas */}
              <div className="p-3 min-h-[300px] flex flex-col justify-end space-y-2">
                <div className="text-center">
                  <span className="text-[10px] bg-white/70 dark:bg-neutral-800/80 backdrop-blur-xs text-neutral-600 dark:text-neutral-300 px-2 py-0.5 rounded shadow-2xs">
                    Today
                  </span>
                </div>

                {/* Message Bubble */}
                <div className="bg-white dark:bg-[#202C33] rounded-lg p-3 max-w-[92%] shadow-xs space-y-1.5 self-start text-[11px] text-neutral-800 dark:text-neutral-100 leading-relaxed font-sans border border-neutral-200/40 dark:border-neutral-700/50">
                  <div className="whitespace-pre-line">{getPreviewMessage()}</div>
                  <div className="text-[9px] text-neutral-400 dark:text-neutral-400 text-right flex items-center justify-end gap-1 pt-1">
                    <span>10:42 AM</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">✓✓</span>
                  </div>
                </div>
              </div>

              {/* Simulated Chat Bar */}
              <div className="bg-[#F0F0F0] dark:bg-[#202C33] p-2 flex items-center gap-2 border-t border-neutral-300 dark:border-neutral-700 text-xs">
                <div className="flex-1 bg-white dark:bg-[#2A3942] rounded-full px-3 py-1.5 text-neutral-400 dark:text-neutral-400 text-[11px]">
                  Reply to Studio...
                </div>
                <div className="w-7 h-7 rounded-full bg-[#128C7E] text-white flex items-center justify-center text-xs">
                  <Send className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 text-center">
              Powered by simulated WhatsApp Cloud Business webhook.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
