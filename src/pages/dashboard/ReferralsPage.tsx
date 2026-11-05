import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Gift,
  Users,
  Award,
  Sparkles,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { Referral } from '../../types';

export const ReferralsPage: React.FC = () => {
  const { referrals, profile, formatNaira, showToast, addReferral } = useStudio();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    stylistName: '',
    businessName: '',
  });

  const referralCode = 'ADUNNI-GLOW';
  const referralLink = `${window.location.origin}/join?ref=${referralCode}`;

  const totalReferrals = referrals.length;
  const successfulReferrals = referrals.filter(
    (r) => r.status === 'Completed' || r.status === 'Reward Paid'
  ).length;

  const totalRewardsEarned = referrals.reduce((acc, r) => acc + r.rewardAmount, 0);
  const rewardsPaidOut = referrals
    .filter((r) => r.status === 'Reward Paid')
    .reduce((acc, r) => acc + r.rewardAmount, 0);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    showToast('Stylist referral link copied!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    showToast(`Referral code ${referralCode} copied!`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.stylistName) return;

    addReferral({
      referredStylistName: inviteForm.stylistName,
      businessName: inviteForm.businessName || `${inviteForm.stylistName} Studio`,
      referralCode,
      status: 'Pending',
      rewardAmount: 15000,
    });

    setInviteModalOpen(false);
    setInviteForm({ stylistName: '', businessName: '' });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900 dark:text-white tracking-tight">
          Stylist Referral & Partner Network
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
          Invite fellow beauty stylists, hairstylists, and makeup artists to Studio. Earn ₦15,000 for every active stylist.
        </p>
      </div>

      {/* Share Referral Link Hero Box */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-xs transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-violet-700 dark:text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
              <Gift className="w-4 h-4" /> Stylist Growth Program
            </span>
            <h2 className="text-lg font-bold font-heading text-neutral-900 dark:text-white">
              Your Exclusive Referral Code & Share Link
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              When a stylist signs up and processes their first ₦50,000 in appointments, both of you earn ₦15,000.
            </p>
          </div>

          <button
            onClick={() => setInviteModalOpen(true)}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer self-start md:self-auto"
          >
            <span>Invite a Colleague</span>
          </button>
        </div>

        {/* Share Boxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Box 1: Referral Link */}
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-lg border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-2">
            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Shareable Link</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white dark:bg-neutral-900 p-2 rounded border border-neutral-200 dark:border-neutral-700 text-xs font-mono text-neutral-800 dark:text-neutral-200 truncate">
                {referralLink}
              </div>
              <button
                onClick={copyLink}
                className="px-3 py-2 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded text-xs font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Box 2: Referral Code */}
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-lg border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-2">
            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Partner Promo Code</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white dark:bg-neutral-900 p-2 rounded border border-neutral-200 dark:border-neutral-700 text-xs font-mono font-bold text-violet-700 dark:text-violet-400 tracking-wider">
                {referralCode}
              </div>
              <button
                onClick={copyCode}
                className="px-3 py-2 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded text-xs font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Total Referrals</span>
            <Users className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900 dark:text-white mt-2 tabular-nums">
            {totalReferrals}
          </div>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">Colleague stylists joined</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Successful Active Stylists</span>
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900 dark:text-white mt-2 tabular-nums">
            {successfulReferrals}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            Processed qualifying appointments
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Total Rewards Earned</span>
            <TrendingUp className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900 dark:text-white mt-2 font-mono tabular-nums">
            {formatNaira(totalRewardsEarned)}
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
            Paid to GTBank: {formatNaira(rewardsPaidOut)}
          </p>
        </div>
      </div>

      {/* Referral History Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs transition-colors duration-200">
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <h3 className="text-sm font-bold font-heading text-neutral-900 dark:text-white">
            Referral Activity & Payout History
          </h3>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            ₦15,000 per qualified partner
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-4">Referred Stylist</th>
                <th className="py-3 px-4">Studio / Business Name</th>
                <th className="py-3 px-4">Invited Date</th>
                <th className="py-3 px-4 text-right">Reward (₦)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payout Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
              {referrals.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-white">
                    {r.referredStylistName}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300 font-medium">
                    {r.businessName}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400 font-mono text-[11px]">
                    {r.date}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-900 dark:text-white tabular-nums">
                    {formatNaira(r.rewardAmount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                        r.status === 'Reward Paid'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : r.status === 'Completed'
                          ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400 font-mono text-[11px]">
                    {r.payoutDate || 'In next weekly batch'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INVITE COLLEAGUE MODAL */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
                Log Colleague Referral
              </h3>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Stylist / Makeup Artist Name *
                </label>
                <input
                  type="text"
                  required
                  value={inviteForm.stylistName}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, stylistName: e.target.value })
                  }
                  placeholder="E.g. Pamela Beauty Studio"
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Studio or Brand Name
                </label>
                <input
                  type="text"
                  value={inviteForm.businessName}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, businessName: e.target.value })
                  }
                  placeholder="E.g. Pam Hair & Glamour Lounge"
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Log Referral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
