import React, { useState } from 'react';
import {
  Building,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Banknote
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { useAdmin } from '../../context/AdminContext';
import { AdminPayout } from '../../types';

export const AdminPayoutsPage: React.FC = () => {
  const { formatNaira, showToast } = useStudio();
  const { payouts, pendingPayoutsTotal, processPayout, batchDisburseQueuedPayouts } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Processed' | 'Queued' | 'Failed'>('All');

  const queuedPayouts = payouts.filter((p) => p.status === 'Queued');
  const processedPayouts = payouts.filter((p) => p.status === 'Processed');

  const filteredPayouts = payouts.filter((p) => {
    const matchesSearch =
      p.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.stylistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.accountNumber.includes(searchQuery);

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900 dark:text-white tracking-tight">
            Nigerian Bank Settlement & Payout Engine
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage automated direct NIP bank transfers for client deposits collected across all beauty salons.
          </p>
        </div>

        {queuedPayouts.length > 0 && (
          <button
            onClick={batchDisburseQueuedPayouts}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-sm cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Disburse {queuedPayouts.length} Batched Transfers ({formatNaira(pendingPayoutsTotal)})</span>
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Queued for Settlement</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-heading text-neutral-900 dark:text-white">
            {formatNaira(pendingPayoutsTotal)}
          </div>
          <span className="text-[11px] text-amber-600 font-semibold block">
            {queuedPayouts.length} transfers scheduled
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Total Successfully Disbursed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-heading text-emerald-600 dark:text-emerald-400">
            {formatNaira(processedPayouts.reduce((a, b) => a + b.amount, 0))}
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
            {processedPayouts.length} transfers settled
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Supported Bank Switch</span>
            <Building className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-lg font-bold font-heading text-neutral-900 dark:text-white">
            NIBSS NIP / Paystack Transfers
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block">
            Instant NUBAN verification active
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by settlement reference, stylist, bank, or NUBAN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Settlement Statuses</option>
              <option value="Queued">Queued (Pending Payout)</option>
              <option value="Processed">Processed (Completed)</option>
              <option value="Failed">Failed Transfers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Settlement Ref</th>
                <th className="py-3.5 px-4 font-semibold">Stylist & Salon</th>
                <th className="py-3.5 px-4 font-semibold">Net Payout Amount</th>
                <th className="py-3.5 px-4 font-semibold">Destination Bank</th>
                <th className="py-3.5 px-4 font-semibold">NUBAN Number</th>
                <th className="py-3.5 px-4 font-semibold">Batch Code</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
              {filteredPayouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-neutral-900 dark:text-white block">
                      {payout.reference}
                    </span>
                    <span className="text-[10px] text-neutral-400 block">{payout.date}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-neutral-900 dark:text-white block">
                      {payout.businessName}
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      {payout.stylistName}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {formatNaira(payout.amount)}
                  </td>

                  <td className="py-3.5 px-4 font-medium text-neutral-800 dark:text-neutral-200">
                    {payout.bankName}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-medium text-neutral-700 dark:text-neutral-300">
                    {payout.accountNumber}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-400">
                    {payout.batchId}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        payout.status === 'Processed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : payout.status === 'Queued'
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                          : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                      }`}
                    >
                      {payout.status === 'Processed' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {payout.status === 'Queued' && <Clock className="w-3 h-3 text-amber-600" />}
                      {payout.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {payout.status === 'Queued' ? (
                      <button
                        onClick={() => processPayout(payout.id)}
                        className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Disburse
                      </button>
                    ) : (
                      <span className="text-[11px] text-neutral-400">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
