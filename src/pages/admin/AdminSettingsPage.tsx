import React, { useState } from 'react';
import {
  Settings,
  Shield,
  CreditCard,
  Building,
  Bell,
  CheckCircle2,
  Save,
  Radio,
  Sliders,
  DollarSign
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { useAdmin } from '../../context/AdminContext';

export const AdminSettingsPage: React.FC = () => {
  const { formatNaira, showToast } = useStudio();
  const { config, updateConfig } = useAdmin();

  const [formState, setFormState] = useState({ ...config });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formState);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900 dark:text-white tracking-tight">
          Platform Configuration & Fee Rules
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
          Configure global platform fee rates, payment gateway integrations, and network-wide announcements.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Monetization & Fee Rules */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-sm font-bold font-heading text-neutral-900 dark:text-white">
                Platform Commission & Fee Model
              </h2>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Studio does not charge monthly subscriptions. Revenue is earned through transaction fees on deposits.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Platform Fee Percentage (%) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="10"
                  required
                  value={formState.platformFeePercent}
                  onChange={(e) => setFormState({ ...formState, platformFeePercent: parseFloat(e.target.value) || 2.5 })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono font-bold text-violet-600"
                />
              </div>
              <span className="text-[10px] text-neutral-400 mt-1 block">
                Standard Nigerian fintech rate is 2.5% per online client deposit.
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Minimum Client Deposit (₦) *
              </label>
              <input
                type="number"
                step="1000"
                min="1000"
                required
                value={formState.minimumDepositAmount}
                onChange={(e) => setFormState({ ...formState, minimumDepositAmount: parseInt(e.target.value) || 5000 })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
              />
              <span className="text-[10px] text-neutral-400 mt-1 block">
                Minimum required deposit to lock an appointment slot.
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Payment Gateway & Nigerian Banking Engine */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <Building className="w-5 h-5 text-violet-600" />
            <div>
              <h2 className="text-sm font-bold font-heading text-neutral-900 dark:text-white">
                Payment Processing Gateway
              </h2>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Primary payment gateway for card checkout, bank transfer, and NIP disbursement.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'Paystack', desc: 'Direct NIP & Card' },
              { id: 'Flutterwave', desc: 'USSD & Virtual Acct' },
              { id: 'Monnify', desc: 'TeamApt / Dynamic NIP' },
              { id: 'Squad', desc: 'HabariPay / GTBank' },
            ].map((gw) => (
              <button
                key={gw.id}
                type="button"
                onClick={() => setFormState({ ...formState, activePaymentGateway: gw.id as any })}
                className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                  formState.activePaymentGateway === gw.id
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-neutral-900 dark:text-white">{gw.id}</span>
                  {formState.activePaymentGateway === gw.id && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">{gw.desc}</span>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
              Automated Bank Payout Schedule
            </label>
            <select
              value={formState.payoutSchedule}
              onChange={(e) => setFormState({ ...formState, payoutSchedule: e.target.value as any })}
              className="w-full sm:w-80 px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-medium"
            >
              <option value="Instant">Instant Auto-Disbursement upon Confirmation</option>
              <option value="Daily (10:00 PM)">Daily Nightly Batch (10:00 PM NIP)</option>
              <option value="Weekly (Monday)">Weekly Settlement (Every Monday 09:00 AM)</option>
            </select>
          </div>
        </div>

        {/* Section 3: Platform Broadcast Announcement */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <Bell className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-sm font-bold font-heading text-neutral-900 dark:text-white">
                Network-Wide Stylist Broadcast
              </h2>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Display an administrative notification banner across all stylist workspaces.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="announcementActive"
                checked={formState.announcementActive}
                onChange={(e) => setFormState({ ...formState, announcementActive: e.target.checked })}
                className="accent-emerald-600 rounded cursor-pointer"
              />
              <label htmlFor="announcementActive" className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer">
                Publish announcement banner to stylists
              </label>
            </div>

            <div>
              <textarea
                rows={2}
                value={formState.announcementMessage}
                onChange={(e) => setFormState({ ...formState, announcementMessage: e.target.value })}
                placeholder="Type platform announcement..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {isSaved && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Platform settings updated successfully</span>
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
