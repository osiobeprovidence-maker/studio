import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Plus,
  Scissors,
  Share2,
  ArrowUpRight,
  User,
  Phone,
  ChevronRight,
  Copy,
  Check,
  CalendarCheck2
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { Booking } from '../../types';

export const OverviewPage: React.FC = () => {
  const { bookings, services, profile, formatNaira, updateBookingStatus, showToast } = useStudio();
  const navigate = useNavigate();
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Compute metrics for current month (November 2026 based on 2026-11-01)
  const todayStr = '2026-11-01';

  const todayAppointments = bookings.filter((b) => b.date === todayStr && b.status !== 'cancelled');
  const upcomingBookings = bookings.filter(
    (b) => b.date >= todayStr && b.status !== 'cancelled' && b.status !== 'completed'
  );
  const totalBookingsThisMonth = bookings.filter((b) => b.date.startsWith('2026-11')).length;
  
  // Revenue this month: sum of amountPaid for bookings in Nov or completed
  const revenueThisMonth = bookings
    .filter((b) => b.date.startsWith('2026-11') && b.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.amountPaid, 0);

  const pendingPayments = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.outstandingBalance, 0);

  const completedAppointments = bookings.filter((b) => b.status === 'completed').length;
  const bookingCancellationCount = bookings.filter((b) => b.status === 'cancelled').length;

  const copyBookingPage = () => {
    const url = `${window.location.origin}/${profile.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    showToast('Public booking page link copied!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Revenue chart data: simulated past 6 weeks / weekly trend
  const weeklyRevenueData = [
    { week: 'Week 40', label: 'Oct 01 - 07', amount: 95000, bookings: 3 },
    { week: 'Week 41', label: 'Oct 08 - 14', amount: 140000, bookings: 4 },
    { week: 'Week 42', label: 'Oct 15 - 21', amount: 215000, bookings: 6 },
    { week: 'Week 43', label: 'Oct 22 - 28', amount: 285000, bookings: 8 },
    { week: 'Week 44', label: 'Oct 29 - Nov 04', amount: 320000, bookings: 9 },
    { week: 'Week 45 (Proj)', label: 'Nov 05 - 11', amount: 380000, bookings: 11 },
  ];

  const maxRevenue = Math.max(...weeklyRevenueData.map((d) => d.amount));

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Action Buttons */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900 dark:text-white tracking-tight">
              Good morning, {profile.ownerName}
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Online
            </span>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Here is your salon schedule and business revenue summary for Warri, Delta State.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/dashboard/bookings?action=new')}
            className="px-3.5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Booking</span>
          </button>

          <button
            onClick={() => navigate('/dashboard/services?action=new')}
            className="px-3.5 py-2 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Scissors className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            <span>Add Service</span>
          </button>

          <button
            onClick={copyBookingPage}
            className="px-3.5 py-2 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-white text-white dark:text-neutral-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'Copied' : 'Share Booking Page'}</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Today's Appointments */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Today's Appointments</span>
            <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900 dark:text-white tabular-nums">
              {todayAppointments.length}
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
              <span>{upcomingBookings.length} total upcoming this week</span>
            </p>
          </div>
        </div>

        {/* Revenue This Month */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Revenue This Month</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900 dark:text-white tabular-nums">
              {formatNaira(revenueThisMonth)}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-3 h-3" />
              <span>+18.4% vs last month</span>
            </p>
          </div>
        </div>

        {/* Pending Payments / Balances */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Pending Balances</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900 dark:text-white tabular-nums">
              {formatNaira(pendingPayments)}
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
              Due on appointment arrival
            </p>
          </div>
        </div>

        {/* Completed & Cancellation Summary */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Performance</span>
            <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 flex items-center justify-center">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900 dark:text-white tabular-nums">
                {completedAppointments}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Completed</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold font-heading text-neutral-500 dark:text-neutral-400 tabular-nums">
                {bookingCancellationCount}
              </div>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500">Cancelled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Revenue Trend Chart & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Weekly Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
                Revenue & Booking Trends
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Weekly deposit collections and appointment volumes in Nigerian Naira
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-neutral-900 dark:text-white tabular-nums">
                {formatNaira(weeklyRevenueData.reduce((acc, c) => acc + c.amount, 0))}
              </span>
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500 block">6-week total</span>
            </div>
          </div>

          {/* Interactive Visual Bar Chart */}
          <div className="pt-6 pb-2">
            <div className="h-48 flex items-end justify-between gap-3 sm:gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-2">
              {weeklyRevenueData.map((d, index) => {
                const heightPercent = Math.round((d.amount / maxRevenue) * 100);
                const isCurrent = index === 4;
                return (
                  <div key={d.week} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-[11px] py-1 px-2 rounded pointer-events-none whitespace-nowrap shadow-md">
                      <div className="font-semibold">{formatNaira(d.amount)}</div>
                      <div className="text-[10px] text-neutral-400 dark:text-neutral-600">{d.bookings} appointments</div>
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[48px] bg-neutral-100 dark:bg-neutral-800 rounded-t-md h-full flex items-end p-1">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-sm transition-all duration-300 ${
                          isCurrent
                            ? 'bg-violet-600 group-hover:bg-violet-700'
                            : 'bg-violet-300 dark:bg-violet-700 group-hover:bg-violet-400 dark:group-hover:bg-violet-600'
                        }`}
                      />
                    </div>

                    {/* X-axis label */}
                    <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 truncate max-w-full text-center">
                      {d.week}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500 pt-2">
              <span>₦0</span>
              <span>Mid: {formatNaira(maxRevenue / 2)}</span>
              <span>Peak: {formatNaira(maxRevenue)}</span>
            </div>
          </div>

          {/* Service breakdown pill cards */}
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Top Service: <span className="font-semibold text-neutral-900 dark:text-white">Bridal Makeup</span> (56% of total revenue)
            </div>
            <button
              onClick={() => navigate('/dashboard/payments')}
              className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View full financial ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right (1 col): Today's Schedule Agenda */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
                Today's Schedule
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Sunday, Nov 01, 2026
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-900">
              {todayAppointments.length} bookings
            </span>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="text-center py-10 text-neutral-400 dark:text-neutral-500 space-y-2">
              <Calendar className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-600" />
              <p className="text-xs">No appointments scheduled for today.</p>
              <button
                onClick={() => navigate('/dashboard/bookings?action=new')}
                className="text-xs text-violet-600 dark:text-violet-400 font-medium hover:underline cursor-pointer"
              >
                + Schedule an appointment
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((bk) => (
                <div
                  key={bk.id}
                  onClick={() => setSelectedBooking(bk)}
                  className="p-3.5 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/20 dark:hover:bg-violet-950/20 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                      {bk.startTime} - {bk.endTime}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                        bk.status === 'confirmed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : bk.status === 'pending'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {bk.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">{bk.customerName}</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{bk.serviceName}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                    <span className="tabular-nums font-mono font-medium text-neutral-900 dark:text-neutral-200">{formatNaira(bk.price)}</span>
                    <span className="text-amber-700 dark:text-amber-400 font-medium">
                      Bal: {formatNaira(bk.outstandingBalance)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate('/dashboard/bookings')}
            className="w-full py-2 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Open Calendar & Timeline</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Upcoming Bookings Section */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-xs transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
              Upcoming Bookings
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Confirmed and pending client appointments scheduled for this week
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/bookings')}
            className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({bookings.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bookings Table / List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider bg-neutral-50/70 dark:bg-neutral-800/40">
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3 text-right">Fee</th>
                <th className="py-2.5 px-3 text-right">Balance Due</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
              {upcomingBookings.slice(0, 5).map((b) => (
                <tr key={b.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-neutral-900 dark:text-white">{b.customerName}</div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">{b.customerPhone}</div>
                  </td>
                  <td className="py-3 px-3 text-neutral-700 dark:text-neutral-300 font-medium max-w-[200px] truncate">
                    {b.serviceName}
                  </td>
                  <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">
                    <div className="font-medium text-neutral-900 dark:text-white">{b.date}</div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400">{b.startTime} - {b.endTime}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-neutral-900 dark:text-white tabular-nums">
                    {formatNaira(b.price)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">
                    {b.outstandingBalance > 0 ? (
                      <span className="text-amber-700 dark:text-amber-400 font-semibold">{formatNaira(b.outstandingBalance)}</span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">Fully Paid</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : b.status === 'pending'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : b.status === 'rescheduled'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="px-2.5 py-1 text-xs font-semibold text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/60 rounded border border-violet-200 dark:border-violet-800 transition-colors cursor-pointer"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Quick Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                  {selectedBooking.reference}
                </span>
                <h3 className="text-lg font-bold font-heading text-neutral-900 dark:text-white">
                  Appointment Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg space-y-1">
                <div className="font-semibold text-sm text-neutral-900 dark:text-white">{selectedBooking.customerName}</div>
                <div className="text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{selectedBooking.customerPhone}</span>
                  {selectedBooking.customerEmail && <span>· {selectedBooking.customerEmail}</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <span className="text-[10px] uppercase text-neutral-400 dark:text-neutral-500 font-semibold block">Service</span>
                  <span className="font-semibold text-neutral-900 dark:text-white mt-0.5 block">{selectedBooking.serviceName}</span>
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">{selectedBooking.durationMinutes} mins</span>
                </div>
                <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <span className="text-[10px] uppercase text-neutral-400 dark:text-neutral-500 font-semibold block">Schedule</span>
                  <span className="font-semibold text-neutral-900 dark:text-white mt-0.5 block">{selectedBooking.date}</span>
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">{selectedBooking.startTime} - {selectedBooking.endTime}</span>
                </div>
              </div>

              <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-1.5 font-mono">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Service Total:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{formatNaira(selectedBooking.price)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Deposit Received:</span>
                  <span>{formatNaira(selectedBooking.amountPaid)}</span>
                </div>
                <div className="flex justify-between text-amber-700 dark:text-amber-400 font-bold border-t border-neutral-100 dark:border-neutral-800 pt-1">
                  <span>Balance Due:</span>
                  <span>{formatNaira(selectedBooking.outstandingBalance)}</span>
                </div>
              </div>

              {selectedBooking.customerNotes && (
                <div className="p-2.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg text-neutral-600 dark:text-neutral-400">
                  <span className="font-semibold text-neutral-900 dark:text-white block mb-0.5">Customer Notes:</span>
                  {selectedBooking.customerNotes}
                </div>
              )}
            </div>

            {/* Quick Status Modifiers */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {selectedBooking.status !== 'completed' && (
                  <button
                    onClick={() => {
                      updateBookingStatus(selectedBooking.id, 'completed');
                      setSelectedBooking(null);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Mark Completed
                  </button>
                )}
                {selectedBooking.status === 'pending' && (
                  <button
                    onClick={() => {
                      updateBookingStatus(selectedBooking.id, 'confirmed');
                      setSelectedBooking(null);
                    }}
                    className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Confirm Booking
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  navigate('/dashboard/bookings');
                }}
                className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:underline cursor-pointer"
              >
                Go to full booking manager →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
