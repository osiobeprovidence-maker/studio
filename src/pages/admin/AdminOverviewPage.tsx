import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  CreditCard,
  Building,
  ShieldCheck,
  ArrowUpRight,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  MapPin,
  Clock,
  Send,
  UserCheck
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { useAdmin } from '../../context/AdminContext';

export const AdminOverviewPage: React.FC = () => {
  const { formatNaira } = useStudio();
  const {
    totalGMV,
    totalPlatformRevenue,
    totalActiveStylists,
    totalBookings,
    pendingPayoutsTotal,
    stylists,
    payouts,
    updateStylistStatus,
    batchDisburseQueuedPayouts,
    impersonateStylist,
  } = useAdmin();

  const navigate = useNavigate();

  const pendingStylists = stylists.filter((s) => s.status === 'Pending Review');
  const queuedPayouts = payouts.filter((p) => p.status === 'Queued');

  const handleImpersonate = (stylist: any) => {
    impersonateStylist(stylist);
    navigate('/dashboard/overview');
  };

  return (
    <div className="space-y-6">
      {/* Super Admin Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 text-white border border-neutral-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Studio Multi-Salon Commerce Network
            </span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">
            Super Admin Control Center
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Live overview of transactions, stylist onboarding, bank payouts, and 2.5% platform revenue collections across Nigeria.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {queuedPayouts.length > 0 && (
            <button
              onClick={batchDisburseQueuedPayouts}
              className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Disburse {queuedPayouts.length} Payouts ({formatNaira(pendingPayoutsTotal)})</span>
            </button>
          )}

          <Link
            to="/admin/stylists?action=new"
            className="py-2.5 px-3.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl border border-neutral-700 transition-colors flex items-center gap-1.5"
          >
            <span>+ Add Stylist</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GMV */}
        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Gross Merch Value (GMV)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-heading text-neutral-900 dark:text-white">
            {formatNaira(totalGMV)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24.6% this month</span>
          </div>
        </div>

        {/* Platform Revenue */}
        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Platform Fee Revenue (2.5%)</span>
            <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-heading text-violet-600 dark:text-violet-400">
            {formatNaira(totalPlatformRevenue)}
          </div>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Direct auto-deductions on deposits
          </div>
        </div>

        {/* Total Stylists */}
        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Active Stylists & Salons</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-heading text-neutral-900 dark:text-white">
            {stylists.length}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
            <span className="text-emerald-600 font-semibold">{totalActiveStylists} verified</span>
            <span>·</span>
            <span className="text-amber-600 font-semibold">{pendingStylists.length} pending</span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Total Appointments</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-heading text-neutral-900 dark:text-white">
            {totalBookings}
          </div>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Across Lagos, Abuja, Warri, PH, Kano
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Stylists Queue & Top Stylist Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top Stylists Breakdown */}
        <div className="lg:col-span-8 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold font-heading text-neutral-900 dark:text-white">
                Stylist Network Performance
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Top grossing beauty artists & braiders on the Studio platform
              </p>
            </div>
            <Link
              to="/admin/stylists"
              className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
            >
              <span>View All ({stylists.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Stylist & Salon</th>
                  <th className="py-3 px-4 font-semibold">City</th>
                  <th className="py-3 px-4 font-semibold">Bookings</th>
                  <th className="py-3 px-4 font-semibold">Volume (GMV)</th>
                  <th className="py-3 px-4 font-semibold">Platform Fee (2.5%)</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                {stylists.slice(0, 5).map((stylist) => (
                  <tr key={stylist.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={stylist.avatar}
                          alt={stylist.businessName}
                          className="w-8 h-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-neutral-900 dark:text-white block truncate">
                            {stylist.businessName}
                          </span>
                          <span className="text-[11px] text-neutral-400 truncate block">
                            {stylist.ownerName} · {stylist.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-neutral-600 dark:text-neutral-300">{stylist.city}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">
                      {stylist.totalBookings}
                    </td>
                    <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">
                      {formatNaira(stylist.lifetimeRevenue)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-violet-600 dark:text-violet-400">
                      {formatNaira(stylist.platformFeesGenerated)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleImpersonate(stylist)}
                          className="py-1 px-2 text-[11px] font-semibold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 rounded border border-violet-200 dark:border-violet-800 transition-colors cursor-pointer"
                          title="Open this stylist workspace"
                        >
                          Impersonate
                        </button>
                        <a
                          href={`/${stylist.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                          title="Open public booking page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Verification & Approval Queue */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pending Approval Widget */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  Verification Queue
                </h3>
              </div>
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                {pendingStylists.length} Pending
              </span>
            </div>

            {pendingStylists.length === 0 ? (
              <div className="p-4 text-center text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/40 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                All stylist accounts have been verified.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingStylists.map((stylist) => (
                  <div
                    key={stylist.id}
                    className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={stylist.avatar}
                        alt={stylist.businessName}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-neutral-900 dark:text-white block truncate">
                          {stylist.businessName}
                        </span>
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate block">
                          {stylist.ownerName} · {stylist.city}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Bank: <strong className="text-neutral-700 dark:text-neutral-300">{stylist.bankName}</strong> ({stylist.accountNumber})
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-neutral-200/60 dark:border-neutral-700/60">
                      <button
                        onClick={() => updateStylistStatus(stylist.id, 'Verified')}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify Stylist</span>
                      </button>
                      <button
                        onClick={() => updateStylistStatus(stylist.id, 'Suspended')}
                        className="py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded text-xs transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bank Payout Queue Summary */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600" />
                Nigerian Bank Settlement
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">NIP Direct</span>
            </div>

            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 space-y-1">
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">Queued Stylist Disbursements</span>
              <span className="text-xl font-bold font-heading text-neutral-900 dark:text-white">
                {formatNaira(pendingPayoutsTotal)}
              </span>
              <span className="text-[10px] text-neutral-400 block">
                {queuedPayouts.length} stylists awaiting transfer
              </span>
            </div>

            <Link
              to="/admin/payouts"
              className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Manage Bank Transfers</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
