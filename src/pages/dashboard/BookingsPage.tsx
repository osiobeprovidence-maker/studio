import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  UserCheck,
  UserX,
  Phone,
  Mail,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  List,
  CalendarRange,
  LayoutList
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { Booking, BookingStatus } from '../../types';

export const BookingsPage: React.FC = () => {
  const {
    bookings,
    services,
    formatNaira,
    updateBookingStatus,
    rescheduleBooking,
    updateBookingNotes,
    addBooking,
  } = useStudio();

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'list' | 'calendar' | 'schedule'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [newDateInput, setNewDateInput] = useState('2026-11-05');
  const [newTimeInput, setNewTimeInput] = useState('10:00');
  const [stylistNoteInput, setStylistNoteInput] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // Manual booking modal
  const [manualBookingOpen, setManualBookingOpen] = useState(
    searchParams.get('action') === 'new'
  );
  const [newBookingForm, setNewBookingForm] = useState({
    customerName: '',
    customerPhone: '+234 ',
    customerEmail: '',
    serviceId: services[0]?.id || '',
    date: '2026-11-02',
    startTime: '10:00',
    amountPaid: 0,
    customerNotes: '',
    paymentMethod: 'Bank Transfer',
  });

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'upcoming'
        ? b.date >= '2026-11-01' && b.status !== 'cancelled' && b.status !== 'completed'
        : b.status === statusFilter;

    const matchesSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone.includes(searchQuery) ||
      b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.reference.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const service = services.find((s) => s.id === newBookingForm.serviceId) || services[0];
    const duration = service.durationMinutes;

    const [h, m] = newBookingForm.startTime.split(':').map(Number);
    const totalMinutes = h * 60 + m + duration;
    const endH = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, '0');
    const endM = (totalMinutes % 60).toString().padStart(2, '0');
    const endTime = `${endH}:${endM}`;

    const price = service.price;
    const depositAmount = service.calculatedDeposit;
    const amountPaid = Number(newBookingForm.amountPaid) || depositAmount;
    const outstandingBalance = Math.max(0, price - amountPaid);

    addBooking({
      customerName: newBookingForm.customerName,
      customerPhone: newBookingForm.customerPhone,
      customerEmail: newBookingForm.customerEmail || undefined,
      serviceId: service.id,
      serviceName: service.name,
      date: newBookingForm.date,
      startTime: newBookingForm.startTime,
      endTime,
      durationMinutes: duration,
      price,
      depositAmount,
      amountPaid,
      outstandingBalance,
      status: 'confirmed',
      customerNotes: newBookingForm.customerNotes || 'Walk-in / Direct phone booking',
      paymentMethod: newBookingForm.paymentMethod,
    });

    setManualBookingOpen(false);
    setSearchParams({});
    setNewBookingForm({
      customerName: '',
      customerPhone: '+234 ',
      customerEmail: '',
      serviceId: services[0]?.id || '',
      date: '2026-11-02',
      startTime: '10:00',
      amountPaid: 0,
      customerNotes: '',
      paymentMethod: 'Bank Transfer',
    });
  };

  const handleConfirmReschedule = () => {
    if (!selectedBooking) return;
    const service = services.find((s) => s.id === selectedBooking.serviceId);
    const duration = service?.durationMinutes || selectedBooking.durationMinutes;
    const [h, m] = newTimeInput.split(':').map(Number);
    const totalMinutes = h * 60 + m + duration;
    const endH = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, '0');
    const endM = (totalMinutes % 60).toString().padStart(2, '0');
    const endTime = `${endH}:${endM}`;

    rescheduleBooking(selectedBooking.id, newDateInput, newTimeInput, endTime);
    setSelectedBooking(null);
    setRescheduleModalOpen(false);
  };

  const handleConfirmCancel = () => {
    if (!selectedBooking) return;
    updateBookingStatus(selectedBooking.id, 'cancelled', cancellationReason || 'Cancelled by stylist request');
    setSelectedBooking(null);
    setCancelModalOpen(false);
    setCancellationReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900 dark:text-white tracking-tight">
            Booking & Appointment Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage your client appointments, schedule changes, and session statuses
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View switcher tabs */}
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Schedule</span>
            </button>
          </div>

          <button
            onClick={() => setManualBookingOpen(true)}
            className="px-3.5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Booking</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs transition-colors duration-200">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, phone number, service, or ref..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'All Bookings', count: bookings.length },
            {
              id: 'upcoming',
              label: 'Upcoming',
              count: bookings.filter(
                (b) => b.date >= '2026-11-01' && b.status !== 'cancelled' && b.status !== 'completed'
              ).length,
            },
            {
              id: 'pending',
              label: 'Pending Requests',
              count: bookings.filter((b) => b.status === 'pending').length,
            },
            {
              id: 'confirmed',
              label: 'Confirmed',
              count: bookings.filter((b) => b.status === 'confirmed').length,
            },
            {
              id: 'completed',
              label: 'Completed',
              count: bookings.filter((b) => b.status === 'completed').length,
            },
            {
              id: 'rescheduled',
              label: 'Rescheduled',
              count: bookings.filter((b) => b.status === 'rescheduled').length,
            },
            {
              id: 'cancelled',
              label: 'Cancelled',
              count: bookings.filter((b) => b.status === 'cancelled').length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                  : 'bg-neutral-100/70 dark:bg-neutral-800/70 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/70 dark:hover:bg-neutral-700'
              }`}
            >
              <span>{tab.label}</span>
              <span className="ml-1.5 text-[10px] opacity-75 font-mono">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: LIST VIEW */}
      {activeTab === 'list' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs transition-colors duration-200">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <CalendarIcon className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto" />
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">No bookings found</h3>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-sm mx-auto">
                No appointments match your search or filter criteria. Try adjusting filters or create a new booking.
              </p>
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
                className="px-3 py-1.5 text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Ref & Client</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4 text-right">Fee (₦)</th>
                    <th className="py-3 px-4 text-right">Balance</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                  {filteredBookings.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedBooking(b)}
                    >
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 block uppercase">
                          {b.reference}
                        </span>
                        <span className="font-semibold text-neutral-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400">
                          {b.customerName}
                        </span>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                          <span>{b.customerPhone}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-neutral-900 dark:text-neutral-200 block">{b.serviceName}</span>
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{b.durationMinutes} minutes session</span>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300">
                        <div className="font-medium text-neutral-900 dark:text-white flex items-center gap-1.5">
                          <CalendarIcon className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                          <span>{b.date}</span>
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                          <span>{b.startTime} - {b.endTime}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-neutral-900 dark:text-white tabular-nums">
                        {formatNaira(b.price)}
                        <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">
                          Paid: {formatNaira(b.amountPaid)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                        {b.outstandingBalance > 0 ? (
                          <span className="text-amber-700 dark:text-amber-400 font-semibold">{formatNaira(b.outstandingBalance)}</span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">Settled</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : b.status === 'pending'
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : b.status === 'completed'
                              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                              : b.status === 'cancelled'
                              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                              : b.status === 'rescheduled'
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                              : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {b.status === 'pending' && (
                            <button
                              onClick={() => updateBookingStatus(b.id, 'confirmed')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors cursor-pointer"
                              title="Confirm Appointment"
                            >
                              Confirm
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="px-2.5 py-1 text-xs font-semibold text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/60 rounded border border-violet-200 dark:border-violet-800 transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: CALENDAR VIEW */}
      {activeTab === 'calendar' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h2 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
                November 2026
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Monthly calendar distribution of client bookings
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Month</span>
            </div>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-7 gap-px bg-neutral-200 dark:bg-neutral-800 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="bg-neutral-50 dark:bg-neutral-800/80 p-2.5 text-center font-bold text-neutral-500 dark:text-neutral-400 text-[11px] uppercase">
                {day}
              </div>
            ))}

            {Array.from({ length: 30 }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `2026-11-${dayNum.toString().padStart(2, '0')}`;
              const dayBookings = bookings.filter((b) => b.date === dateStr && b.status !== 'cancelled');
              const isToday = dayNum === 1;

              return (
                <div
                  key={dayNum}
                  className={`bg-white dark:bg-neutral-900 min-h-[90px] sm:min-h-[110px] p-2 flex flex-col justify-between hover:bg-neutral-50/60 dark:hover:bg-neutral-800/60 transition-colors ${
                    isToday ? 'ring-2 ring-violet-500 ring-inset bg-violet-50/20 dark:bg-violet-950/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold inline-block w-5 h-5 text-center leading-5 rounded-full ${
                        isToday ? 'bg-violet-600 text-white' : 'text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayBookings.length > 0 && (
                      <span className="text-[10px] font-mono font-medium text-neutral-500 dark:text-neutral-400">
                        {dayBookings.length} {dayBookings.length === 1 ? 'app' : 'apps'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mt-1 overflow-y-auto max-h-[64px]">
                    {dayBookings.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        className={`text-[10px] p-1 rounded font-medium truncate cursor-pointer transition-colors ${
                          b.status === 'confirmed'
                            ? 'bg-violet-100 dark:bg-violet-950/80 text-violet-800 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900'
                            : b.status === 'pending'
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        }`}
                        title={`${b.startTime} - ${b.customerName} (${b.serviceName})`}
                      >
                        <span className="font-semibold">{b.startTime}</span> {b.customerName}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: SCHEDULE / TIMELINE VIEW */}
      {activeTab === 'schedule' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h2 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
                Daily Timeline Schedule
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Visual hourly schedule for today (Sunday, November 01, 2026)
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 rounded-md">
              Working: 08:30 - 18:00
            </span>
          </div>

          <div className="space-y-2">
            {[
              '08:00',
              '09:00',
              '10:00',
              '11:00',
              '12:00',
              '13:00',
              '14:00',
              '15:00',
              '16:00',
              '17:00',
              '18:00',
            ].map((hour) => {
              const bookingAtHour = bookings.find(
                (b) =>
                  b.date === '2026-11-01' &&
                  b.status !== 'cancelled' &&
                  b.startTime.startsWith(hour.substring(0, 2))
              );

              const isBreak = hour === '13:00';

              return (
                <div key={hour} className="flex items-start gap-4 py-2 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                  <span className="w-14 text-xs font-mono font-bold text-neutral-400 dark:text-neutral-500 shrink-0 pt-1">
                    {hour}
                  </span>

                  <div className="flex-1">
                    {isBreak ? (
                      <div className="p-3 bg-neutral-100/70 dark:bg-neutral-800/60 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg text-xs text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                        <span>Lunch & Studio Sanitization Break (13:00 - 14:00)</span>
                        <span className="text-[10px] uppercase font-semibold text-neutral-400 dark:text-neutral-500">Blocked</span>
                      </div>
                    ) : bookingAtHour ? (
                      <div
                        onClick={() => setSelectedBooking(bookingAtHour)}
                        className="p-3 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 rounded-lg hover:border-violet-300 dark:hover:border-violet-700 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-violet-900 dark:text-violet-200">
                              {bookingAtHour.customerName}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-neutral-800 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700">
                              {bookingAtHour.startTime} - {bookingAtHour.endTime}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">{bookingAtHour.serviceName}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white block tabular-nums">
                            {formatNaira(bookingAtHour.price)}
                          </span>
                          <span className="text-[11px] text-amber-700 dark:text-amber-400">
                            Bal: {formatNaira(bookingAtHour.outstandingBalance)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-800/20 text-xs text-neutral-400 dark:text-neutral-500 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40 transition-colors flex items-center justify-between group">
                        <span>Available Slot</span>
                        <button
                          onClick={() => {
                            setNewBookingForm((prev) => ({
                              ...prev,
                              startTime: hour,
                              date: '2026-11-01',
                            }));
                            setManualBookingOpen(true);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-[11px] font-semibold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
                        >
                          + Book this slot
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FULL BOOKING DETAILS & ACTION MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 px-2 py-0.5 rounded border border-violet-200 dark:border-violet-800">
                    {selectedBooking.reference}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                      selectedBooking.status === 'confirmed'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : selectedBooking.status === 'pending'
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        : selectedBooking.status === 'completed'
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        : selectedBooking.status === 'cancelled'
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        : selectedBooking.status === 'rescheduled'
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-heading text-neutral-900 dark:text-white mt-1">
                  {selectedBooking.customerName}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  setIsEditingNotes(false);
                }}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1 cursor-pointer text-lg"
              >
                ✕
              </button>
            </div>

            {/* Customer & Appointment Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg space-y-1 border border-neutral-200/60 dark:border-neutral-800">
                <span className="text-[10px] uppercase font-semibold text-neutral-400 dark:text-neutral-500">Contact Details</span>
                <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200 font-medium pt-0.5">
                  <Phone className="w-3.5 h-3.5 text-neutral-500" />
                  <a href={`tel:${selectedBooking.customerPhone}`} className="hover:underline">
                    {selectedBooking.customerPhone}
                  </a>
                </div>
                {selectedBooking.customerEmail && (
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Mail className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{selectedBooking.customerEmail}</span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg space-y-1 border border-neutral-200/60 dark:border-neutral-800">
                <span className="text-[10px] uppercase font-semibold text-neutral-400 dark:text-neutral-500">Appointment Time</span>
                <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200 font-semibold pt-0.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  <span>{selectedBooking.date}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                  <Clock className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  <span>{selectedBooking.startTime} - {selectedBooking.endTime} ({selectedBooking.durationMinutes} min)</span>
                </div>
              </div>
            </div>

            {/* Service & Financial breakdown */}
            <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-2 text-xs font-mono bg-neutral-50/50 dark:bg-neutral-800/30">
              <div className="flex justify-between items-center text-neutral-700 dark:text-neutral-300">
                <span className="font-sans font-semibold text-neutral-900 dark:text-white">{selectedBooking.serviceName}</span>
                <span className="font-bold text-neutral-900 dark:text-white tabular-nums">{formatNaira(selectedBooking.price)}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                <span className="font-sans">Deposit Paid ({selectedBooking.paymentMethod || 'Online'}):</span>
                <span className="font-semibold tabular-nums">+{formatNaira(selectedBooking.amountPaid)}</span>
              </div>
              <div className="flex justify-between items-center text-amber-700 dark:text-amber-400 font-bold pt-1 border-t border-neutral-100 dark:border-neutral-800 text-sm">
                <span className="font-sans">Outstanding Balance:</span>
                <span className="tabular-nums">{formatNaira(selectedBooking.outstandingBalance)}</span>
              </div>
            </div>

            {/* Customer notes */}
            {selectedBooking.customerNotes && (
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg text-xs space-y-1 border border-neutral-200/60 dark:border-neutral-800">
                <span className="font-semibold text-neutral-900 dark:text-white block">Customer Request:</span>
                <p className="text-neutral-600 dark:text-neutral-300">{selectedBooking.customerNotes}</p>
              </div>
            )}

            {/* Stylist Private Notes */}
            <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-900 dark:text-white">Stylist Private Notes</span>
                {!isEditingNotes && (
                  <button
                    onClick={() => {
                      setStylistNoteInput(selectedBooking.stylistNotes || '');
                      setIsEditingNotes(true);
                    }}
                    className="text-violet-600 dark:text-violet-400 hover:underline text-[11px] font-semibold cursor-pointer"
                  >
                    Edit Notes
                  </button>
                )}
              </div>

              {isEditingNotes ? (
                <div className="space-y-2">
                  <textarea
                    value={stylistNoteInput}
                    onChange={(e) => setStylistNoteInput(e.target.value)}
                    placeholder="E.g. Undertone preferences, lash sensitivity, gear prep notes..."
                    rows={3}
                    className="w-full p-2 border border-neutral-200 dark:border-neutral-700 rounded text-xs bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-violet-500"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setIsEditingNotes(false)}
                      className="px-2.5 py-1 text-neutral-600 dark:text-neutral-400 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        updateBookingNotes(selectedBooking.id, stylistNoteInput);
                        setSelectedBooking((prev) => (prev ? { ...prev, stylistNotes: stylistNoteInput } : null));
                        setIsEditingNotes(false);
                      }}
                      className="px-3 py-1 bg-violet-600 text-white text-xs font-semibold rounded hover:bg-violet-700"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-neutral-600 dark:text-neutral-400 italic">
                  {selectedBooking.stylistNotes || 'No stylist notes added yet.'}
                </p>
              )}
            </div>

            {/* Stylist Lifecycle Actions Bar */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {selectedBooking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        updateBookingStatus(selectedBooking.id, 'confirmed');
                        setSelectedBooking((prev) => (prev ? { ...prev, status: 'confirmed' } : null));
                      }}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Booking</span>
                    </button>
                    <button
                      onClick={() => setCancelModalOpen(true)}
                      className="px-3 py-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                  </>
                )}

                {selectedBooking.status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => {
                        updateBookingStatus(selectedBooking.id, 'completed');
                        setSelectedBooking((prev) =>
                          prev
                            ? {
                                ...prev,
                                status: 'completed',
                                amountPaid: prev.price,
                                outstandingBalance: 0,
                              }
                            : null
                        );
                      }}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Completed</span>
                    </button>

                    <button
                      onClick={() => {
                        setNewDateInput(selectedBooking.date);
                        setNewTimeInput(selectedBooking.startTime);
                        setRescheduleModalOpen(true);
                      }}
                      className="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reschedule</span>
                    </button>

                    <button
                      onClick={() => {
                        updateBookingStatus(selectedBooking.id, 'no-show');
                        setSelectedBooking((prev) => (prev ? { ...prev, status: 'no-show' } : null));
                      }}
                      className="px-2.5 py-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 text-xs font-medium cursor-pointer"
                      title="Client did not show up"
                    >
                      No-Show
                    </button>
                  </>
                )}
              </div>

              {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                <button
                  onClick={() => setCancelModalOpen(true)}
                  className="px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {rescheduleModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
              Reschedule Appointment
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Select a new date and start time for {selectedBooking.customerName}'s appointment.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">New Date</label>
                <input
                  type="date"
                  value={newDateInput}
                  onChange={(e) => setNewDateInput(e.target.value)}
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">New Start Time</label>
                <input
                  type="time"
                  value={newTimeInput}
                  onChange={(e) => setNewTimeInput(e.target.value)}
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => setRescheduleModalOpen(false)}
                className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL CONFIRMATION MODAL */}
      {cancelModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
                Cancel Appointment?
              </h3>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300">
              Are you sure you want to cancel the booking for{' '}
              <span className="font-semibold">{selectedBooking.customerName}</span> on{' '}
              <span className="font-semibold">{selectedBooking.date}</span>?
            </p>

            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 text-xs block mb-1">
                Reason for Cancellation (Optional)
              </label>
              <input
                type="text"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="E.g. Client requested emergency postponement, stylist unavailable"
                className="w-full p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MANUAL BOOKING MODAL */}
      {manualBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-lg font-bold font-heading text-neutral-900 dark:text-white">
                Create Direct Booking
              </h3>
              <button
                onClick={() => {
                  setManualBookingOpen(false);
                  setSearchParams({});
                }}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualBooking} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBookingForm.customerName}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, customerName: e.target.value })
                    }
                    placeholder="E.g. Omowunmi Adeleke"
                    className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newBookingForm.customerPhone}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, customerPhone: e.target.value })
                    }
                    placeholder="+234 803 123 4567"
                    className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg font-mono bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={newBookingForm.customerEmail}
                  onChange={(e) =>
                    setNewBookingForm({ ...newBookingForm, customerEmail: e.target.value })
                  }
                  placeholder="omowunmi@example.com"
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Service *
                </label>
                <select
                  value={newBookingForm.serviceId}
                  onChange={(e) =>
                    setNewBookingForm({ ...newBookingForm, serviceId: e.target.value })
                  }
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {formatNaira(s.price)} ({s.durationMinutes} mins)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newBookingForm.date}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, date: e.target.value })
                    }
                    className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Start Time *</label>
                  <input
                    type="time"
                    required
                    value={newBookingForm.startTime}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, startTime: e.target.value })
                    }
                    className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Deposit Amount Collected (₦)
                  </label>
                  <input
                    type="number"
                    value={newBookingForm.amountPaid}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, amountPaid: Number(e.target.value) })
                    }
                    placeholder="10000"
                    className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg font-mono bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Payment Method
                  </label>
                  <select
                    value={newBookingForm.paymentMethod}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, paymentMethod: e.target.value })
                    }
                    className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="USSD">USSD</option>
                    <option value="Cash at Salon">Cash at Salon</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Notes / Requests
                </label>
                <textarea
                  value={newBookingForm.customerNotes}
                  onChange={(e) =>
                    setNewBookingForm({ ...newBookingForm, customerNotes: e.target.value })
                  }
                  rows={2}
                  placeholder="Special hairstyle instructions or event details..."
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setManualBookingOpen(false);
                    setSearchParams({});
                  }}
                  className="px-3.5 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
