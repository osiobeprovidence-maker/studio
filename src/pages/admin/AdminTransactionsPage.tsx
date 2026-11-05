import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  ExternalLink,
  Download,
  Receipt,
  X
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { useAdmin } from '../../context/AdminContext';
import { Transaction } from '../../types';

export const AdminTransactionsPage: React.FC = () => {
  const { transactions, formatNaira, showToast } = useStudio();
  const { totalGMV, totalPlatformRevenue } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  // Combine local transactions with platform sample transactions
  const allPlatformTransactions: (Transaction & { salonName?: string })[] = [
    ...transactions.map((t) => ({ ...t, salonName: 'Glow by Adunni' })),
    {
      id: 'txn-adm-1',
      reference: 'TXN-BRD-4401',
      customerName: 'Zainab Dangote',
      serviceName: 'Knotless Box Braids (Waist Length)',
      amount: 35000,
      platformFee: 875,
      netAmount: 34125,
      paymentMethod: 'Debit Card',
      status: 'Successful',
      date: '2026-11-01 16:45',
      channel: 'Paystack Checkout',
      salonName: 'The Braid Haven (Lekki)',
    },
    {
      id: 'txn-adm-2',
      reference: 'TXN-ADL-4402',
      customerName: 'Hadiza Mohammed',
      serviceName: 'Luxury Bridal Glam Experience',
      amount: 95000,
      platformFee: 2375,
      netAmount: 92625,
      paymentMethod: 'Bank Transfer',
      status: 'Successful',
      date: '2026-11-01 14:20',
      channel: 'NIP Virtual Account',
      salonName: 'Adeleke Artistry (Abuja)',
    },
    {
      id: 'txn-adm-3',
      reference: 'TXN-NVN-4403',
      customerName: 'Kemi Adebayo',
      serviceName: 'Full Set Acrylic Nails with Gel',
      amount: 20000,
      platformFee: 500,
      netAmount: 19500,
      paymentMethod: 'Debit Card',
      status: 'Successful',
      date: '2026-11-01 11:15',
      channel: 'Paystack Checkout',
      salonName: 'Nail Haven & Spa (Ikeja)',
    },
    {
      id: 'txn-adm-4',
      reference: 'TXN-LXW-4404',
      customerName: 'Tamara Briggs',
      serviceName: 'Wig Custom Frontal Melt',
      amount: 30000,
      platformFee: 750,
      netAmount: 29250,
      paymentMethod: 'USSD',
      status: 'Pending',
      date: '2026-11-01 09:30',
      channel: 'GTBank *737#',
      salonName: 'Luxe Wigs PH',
    },
  ];

  const filtered = allPlatformTransactions.filter((tx) => {
    const matchesSearch =
      tx.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.salonName && tx.salonName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    showToast('Platform transaction ledger exported to CSV', 'success');
  };

  const handleSimulateRefund = (txn: Transaction) => {
    showToast(`Refund processed for ${txn.reference} to ${txn.customerName}`, 'info');
    setSelectedTxn(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900 dark:text-white tracking-tight">
            Global Transactions & Fee Ledger
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Audit payment settlements, track 2.5% platform commissions, and monitor payment gateways across Nigeria.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="py-2.5 px-4 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4 text-neutral-500" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Total Processed Payments</span>
          <div className="text-2xl font-bold font-heading text-neutral-900 dark:text-white">
            {formatNaira(totalGMV)}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block">All beauty appointments</span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Platform Revenue (2.5%)</span>
          <div className="text-2xl font-bold font-heading text-violet-600 dark:text-violet-400">
            {formatNaira(totalPlatformRevenue)}
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">Retained fee margin</span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Net Stylist Payouts</span>
          <div className="text-2xl font-bold font-heading text-emerald-600 dark:text-emerald-400">
            {formatNaira(totalGMV - totalPlatformRevenue)}
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">Settled to Nigerian bank accounts</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by transaction reference, customer, service, or salon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Successful">Successful</option>
              <option value="Pending">Pending Settlement</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Reference & Date</th>
                <th className="py-3.5 px-4 font-semibold">Stylist / Studio</th>
                <th className="py-3.5 px-4 font-semibold">Customer & Service</th>
                <th className="py-3.5 px-4 font-semibold">Gross (₦)</th>
                <th className="py-3.5 px-4 font-semibold">Platform Fee</th>
                <th className="py-3.5 px-4 font-semibold">Net Stylist Payout</th>
                <th className="py-3.5 px-4 font-semibold">Payment Channel</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-neutral-900 dark:text-white block">
                      {tx.reference}
                    </span>
                    <span className="text-[11px] text-neutral-400 block">{tx.date}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-neutral-900 dark:text-white block">
                      {tx.salonName || 'Glow by Adunni'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-medium text-neutral-900 dark:text-white block">
                      {tx.customerName}
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate block max-w-xs">
                      {tx.serviceName}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                    {formatNaira(tx.amount)}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-violet-600 dark:text-violet-400">
                    +{formatNaira(tx.platformFee)}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatNaira(tx.netAmount)}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-neutral-800 dark:text-neutral-200 block font-medium">
                      {tx.paymentMethod}
                    </span>
                    <span className="text-[10px] text-neutral-400">{tx.channel}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        tx.status === 'Successful'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : tx.status === 'Pending'
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                          : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedTxn(tx)}
                      className="py-1 px-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Audit Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold font-heading text-neutral-900 dark:text-white">
                  Transaction Audit Record
                </h3>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Audit Reference:</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-white">{selectedTxn.reference}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Gross Deposit:</span>
                <span className="font-bold text-neutral-900 dark:text-white">{formatNaira(selectedTxn.amount)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Platform Commission (2.5%):</span>
                <span className="font-bold text-violet-600 dark:text-violet-400">{formatNaira(selectedTxn.platformFee)}</span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-700 dark:text-neutral-300 font-semibold">Net Stylist Payout:</span>
                <span className="font-bold text-emerald-600">{formatNaira(selectedTxn.netAmount)}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Customer:</span>
                <span className="text-neutral-900 dark:text-white font-medium">{selectedTxn.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Service:</span>
                <span className="text-neutral-900 dark:text-white font-medium">{selectedTxn.serviceName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Payment Gateway:</span>
                <span className="text-neutral-900 dark:text-white font-mono">{selectedTxn.channel}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-500">Settlement Status:</span>
                <span className="font-bold text-emerald-600">{selectedTxn.status}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => handleSimulateRefund(selectedTxn)}
                className="py-2 px-3 text-red-600 hover:text-red-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Simulate Refund</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTxn(null)}
                className="py-2 px-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
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
