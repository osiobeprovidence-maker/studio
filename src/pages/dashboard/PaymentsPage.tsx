import React, { useState } from 'react';
import {
  CreditCard,
  TrendingUp,
  Clock,
  Percent,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Search,
  Filter,
  Download,
  Building,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { PaymentStatus, Transaction } from '../../types';

export const PaymentsPage: React.FC = () => {
  const { transactions, formatNaira, settings, showToast } = useStudio();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const successfulTx = transactions.filter((t) => t.status === 'Successful');
  const totalRevenue = successfulTx.reduce((acc, t) => acc + t.amount, 0);
  const totalPlatformFees = successfulTx.reduce((acc, t) => acc + t.platformFee, 0);
  const availableBalance = successfulTx.reduce((acc, t) => acc + t.netAmount, 0);

  const pendingPayments = transactions
    .filter((t) => t.status === 'Pending')
    .reduce((acc, t) => acc + t.amount, 0);

  const filteredTransactions = transactions.filter((t) => {
    const matchesStatus = statusFilter === 'All' ? true : t.status === statusFilter;
    const matchesQuery =
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const handleExportCSV = () => {
    showToast('Financial ledger exported to CSV successfully');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900 dark:text-white tracking-tight">
            Payments & Earnings Ledger
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Monitor client deposit transactions, platform processing fees, and bank settlement payouts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            <span>Export Statement</span>
          </button>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Gross Revenue */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Total Gross Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900 dark:text-white mt-2 font-mono tabular-nums">
            {formatNaira(totalRevenue)}
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">Processed from online bookings</p>
        </div>

        {/* Available Balance / Net Payout */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Available Balance</span>
            <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-heading text-violet-900 dark:text-violet-300 mt-2 font-mono tabular-nums">
            {formatNaira(availableBalance)}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            Auto-payout to {settings.bankAccount.bankName.split(' ')[0]}
          </p>
        </div>

        {/* Pending In-Flight Payments */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Pending Settlements</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900 dark:text-white mt-2 font-mono tabular-nums">
            {formatNaira(pendingPayments)}
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">Awaiting bank network clearing</p>
        </div>

        {/* Total Platform Processing Fees */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Platform Fees (2.5%)</span>
            <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900 dark:text-white mt-2 font-mono tabular-nums">
            {formatNaira(totalPlatformFees)}
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">Studio platform commission</p>
        </div>
      </div>

      {/* Connected Payout Bank Details Notice */}
      <div className="bg-violet-50/50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-neutral-900 dark:text-white block">
              Direct Settlement Account: {settings.bankAccount.bankName}
            </span>
            <span className="text-neutral-500 dark:text-neutral-400 font-mono">
              Account: {settings.bankAccount.accountNumber} · {settings.bankAccount.accountName}
            </span>
          </div>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-1 bg-white dark:bg-neutral-800 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700 rounded-lg self-start sm:self-auto">
          Payouts: {settings.payoutFrequency}
        </span>
      </div>

      {/* Filters and Transactions List */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs transition-colors duration-200">
        {/* Search & Status Filters */}
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, customer, or service..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['All', 'Successful', 'Pending', 'Failed', 'Refunded'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === status
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-4">Transaction Ref</th>
                <th className="py-3 px-4">Client & Service</th>
                <th className="py-3 px-4 text-right">Gross Amount</th>
                <th className="py-3 px-4 text-right">Fee (2.5%)</th>
                <th className="py-3 px-4 text-right">Net Payout</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
              {filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-medium text-neutral-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400">
                    {tx.reference}
                    <span className="block text-[10px] text-neutral-400 dark:text-neutral-500 font-sans">{tx.channel}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-neutral-900 dark:text-white block">{tx.customerName}</span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{tx.serviceName}</span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-900 dark:text-white tabular-nums">
                    {formatNaira(tx.amount)}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-neutral-500 dark:text-neutral-400 tabular-nums">
                    {tx.platformFee > 0 ? `-${formatNaira(tx.platformFee)}` : '₦0'}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {tx.status === 'Successful' ? formatNaira(tx.netAmount) : '—'}
                  </td>

                  <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300">
                    <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[11px] font-medium border border-neutral-200/50 dark:border-neutral-700">
                      {tx.paymentMethod}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                        tx.status === 'Successful'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : tx.status === 'Pending'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : tx.status === 'Refunded'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400 font-mono text-[11px] whitespace-nowrap">
                    {tx.date}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTx(tx);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/60 rounded border border-violet-200 dark:border-violet-800 transition-colors cursor-pointer"
                    >
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRANSACTION RECEIPT / INVOICE MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-400 dark:text-neutral-500">Transaction Receipt</span>
                <h3 className="text-base font-bold font-heading text-neutral-900 dark:text-white mt-0.5">
                  {selectedTx.reference}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg text-center space-y-1 border border-neutral-200/60 dark:border-neutral-800">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Net Stylist Payout</span>
              <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums">
                {formatNaira(selectedTx.netAmount)}
              </div>
              <div className="pt-1">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                    selectedTx.status === 'Successful'
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                      : selectedTx.status === 'Pending'
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                      : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  {selectedTx.status}
                </span>
              </div>
            </div>

            <div className="space-y-2 font-mono">
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500 dark:text-neutral-400 font-sans">Customer:</span>
                <span className="font-semibold text-neutral-900 dark:text-white font-sans">{selectedTx.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500 dark:text-neutral-400 font-sans">Service:</span>
                <span className="text-neutral-800 dark:text-neutral-200 font-sans">{selectedTx.serviceName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500 dark:text-neutral-400 font-sans">Payment Method:</span>
                <span className="text-neutral-800 dark:text-neutral-200 font-sans">{selectedTx.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500 dark:text-neutral-400 font-sans">Gross Amount:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{formatNaira(selectedTx.amount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400">
                <span className="font-sans">Platform Fee (2.5%):</span>
                <span>-{formatNaira(selectedTx.platformFee)}</span>
              </div>
              <div className="flex justify-between py-1 text-emerald-700 dark:text-emerald-400 font-bold">
                <span className="font-sans">Net Disbursed:</span>
                <span>{formatNaira(selectedTx.netAmount)}</span>
              </div>
              <div className="flex justify-between py-1 text-[11px] text-neutral-400 dark:text-neutral-500">
                <span className="font-sans">Timestamp:</span>
                <span>{selectedTx.date}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
