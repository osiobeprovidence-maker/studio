import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Edit3,
  UserPlus,
  ChevronRight,
  TrendingUp,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { Client } from '../../types';

export const ClientsPage: React.FC = () => {
  const { clients, bookings, transactions, formatNaira, updateClientNotes, addOrUpdateClient } =
    useStudio();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: '',
    phone: '+234 ',
    email: '',
    notes: '',
    preferredService: 'Bridal Makeup',
  });

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalClients = clients.length;
  const totalClientSpend = clients.reduce((acc, c) => acc + c.totalSpent, 0);
  const avgSpendPerClient = totalClients > 0 ? Math.round(totalClientSpend / totalClients) : 0;

  const handleOpenClient = (client: Client) => {
    setSelectedClient(client);
    setNotesText(client.notes || '');
    setEditingNotes(false);
  };

  const handleSaveNotes = () => {
    if (!selectedClient) return;
    updateClientNotes(selectedClient.id, notesText);
    setSelectedClient((prev) => (prev ? { ...prev, notes: notesText } : null));
    setEditingNotes(false);
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addOrUpdateClient({
      name: newClientData.name,
      phone: newClientData.phone,
      email: newClientData.email || undefined,
      notes: newClientData.notes,
      preferredService: newClientData.preferredService,
    });
    setNewClientModalOpen(false);
    setNewClientData({
      name: '',
      phone: '+234 ',
      email: '',
      notes: '',
      preferredService: 'Bridal Makeup',
    });
    setSelectedClient(created);
  };

  const clientBookings = selectedClient
    ? bookings.filter(
        (b) =>
          b.customerPhone.trim() === selectedClient.phone.trim() ||
          b.customerName.toLowerCase() === selectedClient.name.toLowerCase()
      )
    : [];

  const clientTransactions = selectedClient
    ? transactions.filter(
        (t) => t.customerName.toLowerCase() === selectedClient.name.toLowerCase()
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Page Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900 dark:text-white tracking-tight">
            Client Directory & Profiles
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Keep track of customer preferences, appointment history, and lifetime spending
          </p>
        </div>

        <button
          onClick={() => setNewClientModalOpen(true)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-5 shadow-xs transition-colors duration-200">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total Client Database</span>
          <div className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900 dark:text-white mt-1 tabular-nums">
            {totalClients}
          </div>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">Verified phone records</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-5 shadow-xs transition-colors duration-200">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total Lifetime Spending</span>
          <div className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900 dark:text-white mt-1 tabular-nums">
            {formatNaira(totalClientSpend)}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Across all services & glam</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-5 shadow-xs transition-colors duration-200">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Average Spend / Client</span>
          <div className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900 dark:text-white mt-1 tabular-nums">
            {formatNaira(avgSpendPerClient)}
          </div>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">High repeat customer rate</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs transition-colors duration-200">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients by name, phone, or email..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-4">Client Profile</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 text-center">Bookings</th>
                <th className="py-3 px-4 text-right">Total Spent</th>
                <th className="py-3 px-4">Last Appointment</th>
                <th className="py-3 px-4">Upcoming</th>
                <th className="py-3 px-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
              {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => handleOpenClient(client)}
                  className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${client.avatarColor}`}
                      >
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400">
                          {client.name}
                        </div>
                        {client.preferredService && (
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block truncate max-w-[160px]">
                            {client.preferredService}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-neutral-600 dark:text-neutral-300">
                    <div>{client.phone}</div>
                    {client.email && (
                      <div className="text-[11px] font-sans text-neutral-400 dark:text-neutral-500 truncate max-w-[180px]">
                        {client.email}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-neutral-900 dark:text-white tabular-nums">
                    {client.totalBookings}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-900 dark:text-white tabular-nums">
                    {formatNaira(client.totalSpent)}
                  </td>

                  <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400">
                    {client.lastAppointmentDate || 'None recorded'}
                  </td>

                  <td className="py-3.5 px-4">
                    {client.upcomingAppointmentDate ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-800">
                        {client.upcomingAppointmentDate}
                      </span>
                    ) : (
                      <span className="text-neutral-400 dark:text-neutral-500 text-[11px]">None</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenClient(client);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/60 rounded border border-violet-200 dark:border-violet-800 transition-colors cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CLIENT DETAIL MODAL */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base ${selectedClient.avatarColor}`}
                >
                  {selectedClient.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-neutral-900 dark:text-white">
                    {selectedClient.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">
                    <span>{selectedClient.phone}</span>
                    {selectedClient.email && <span>· {selectedClient.email}</span>}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200/60 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-semibold block">Total Appointments</span>
                <span className="text-base font-bold text-neutral-900 dark:text-white mt-0.5 block tabular-nums">
                  {selectedClient.totalBookings}
                </span>
              </div>
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200/60 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-semibold block">Total Investment</span>
                <span className="text-base font-bold text-neutral-900 dark:text-white mt-0.5 block font-mono tabular-nums">
                  {formatNaira(selectedClient.totalSpent)}
                </span>
              </div>
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200/60 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-semibold block">Client Since</span>
                <span className="text-sm font-semibold text-neutral-900 dark:text-white mt-0.5 block">
                  {selectedClient.joinedDate}
                </span>
              </div>
            </div>

            {/* Private Notes Section */}
            <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-2 text-xs bg-white dark:bg-neutral-900">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  <span>Private Stylist Notes</span>
                </span>
                {!editingNotes ? (
                  <button
                    onClick={() => setEditingNotes(true)}
                    className="text-violet-600 dark:text-violet-400 hover:underline font-semibold cursor-pointer"
                  >
                    Edit Notes
                  </button>
                ) : (
                  <button
                    onClick={handleSaveNotes}
                    className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                  >
                    Save Notes
                  </button>
                )}
              </div>

              {editingNotes ? (
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded text-xs bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-violet-500"
                  placeholder="Record custom shade recipes, lash preferences, skin allergies, milestone dates..."
                />
              ) : (
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                  {selectedClient.notes || 'No private notes yet. Click Edit Notes to add details.'}
                </p>
              )}
            </div>

            {/* Booking History */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Appointment History ({clientBookings.length})
              </h4>
              {clientBookings.length === 0 ? (
                <p className="text-xs text-neutral-400 dark:text-neutral-500 italic">No appointments on record yet.</p>
              ) : (
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg divide-y divide-neutral-100 dark:divide-neutral-800 max-h-48 overflow-y-auto text-xs">
                  {clientBookings.map((b) => (
                    <div key={b.id} className="p-3 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-neutral-900 dark:text-white">{b.serviceName}</div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {b.date} · {b.startTime} - {b.endTime}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-semibold text-neutral-900 dark:text-white block tabular-nums">
                          {formatNaira(b.price)}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              : b.status === 'completed'
                              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment History */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Payment Transactions ({clientTransactions.length})
              </h4>
              {clientTransactions.length === 0 ? (
                <p className="text-xs text-neutral-400 dark:text-neutral-500 italic">No online transactions logged yet.</p>
              ) : (
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg divide-y divide-neutral-100 dark:divide-neutral-800 max-h-40 overflow-y-auto text-xs font-mono">
                  {clientTransactions.map((t) => (
                    <div key={t.id} className="p-2.5 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-neutral-400 dark:text-neutral-500">{t.reference}</div>
                        <div className="font-sans font-medium text-neutral-800 dark:text-neutral-200">{t.serviceName}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-neutral-900 dark:text-white">{formatNaira(t.amount)}</span>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans font-semibold">
                          {t.status} ({t.paymentMethod})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW CLIENT MODAL */}
      {newClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
                Register New Client Profile
              </h3>
              <button
                onClick={() => setNewClientModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newClientData.name}
                  onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                  placeholder="E.g. Onome Igho"
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Phone (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={newClientData.phone}
                  onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
                  placeholder="+234 802 000 0000"
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg font-mono bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={newClientData.email}
                  onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                  placeholder="onome@example.com"
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Private Notes / Skin Preferences
                </label>
                <textarea
                  rows={2}
                  value={newClientData.notes}
                  onChange={(e) => setNewClientData({ ...newClientData, notes: e.target.value })}
                  placeholder="Skin tone, lash style preference, etc."
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setNewClientModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
