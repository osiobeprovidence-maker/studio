import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Plus,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Building,
  Phone,
  Mail,
  MapPin,
  Trash2,
  CheckCircle2,
  X,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { useAdmin } from '../../context/AdminContext';
import { AdminStylist } from '../../types';

export const AdminStylistsPage: React.FC = () => {
  const { formatNaira } = useStudio();
  const { stylists, updateStylistStatus, addAdminStylist, deleteStylist, impersonateStylist } = useAdmin();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Verified' | 'Pending Review' | 'Suspended'>('All');
  const [cityFilter, setCityFilter] = useState<string>('All');

  // Modals
  const [selectedStylist, setSelectedStylist] = useState<AdminStylist | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(searchParams.get('action') === 'new');

  // New Stylist Form
  const [newForm, setNewForm] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '+234 ',
    category: 'Bridal & Event Makeup',
    location: 'Victoria Island',
    city: 'Lagos',
    slug: '',
    status: 'Verified' as AdminStylist['status'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    bankName: 'Guaranty Trust Bank (GTBank)',
    accountNumber: '0123456789',
    accountName: '',
  });

  const cities = ['All', 'Lagos', 'Abuja (FCT)', 'Warri, Delta State', 'Port Harcourt, Rivers', 'Ibadan, Oyo State', 'Enugu, Enugu State', 'Kano, Kano State'];

  const filteredStylists = stylists.filter((s) => {
    const matchesSearch =
      s.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchesCity = cityFilter === 'All' || s.city.includes(cityFilter);

    return matchesSearch && matchesStatus && matchesCity;
  });

  const handleCreateStylist = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = newForm.slug || newForm.businessName.toLowerCase().replace(/[^a-z0-9]/g, '');

    addAdminStylist({
      ...newForm,
      slug: finalSlug,
      accountName: newForm.accountName || newForm.ownerName.toUpperCase(),
    });

    setIsAddModalOpen(false);
    setNewForm({
      businessName: '',
      ownerName: '',
      email: '',
      phone: '+234 ',
      category: 'Bridal & Event Makeup',
      location: 'Victoria Island',
      city: 'Lagos',
      slug: '',
      status: 'Verified',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      bankName: 'Guaranty Trust Bank (GTBank)',
      accountNumber: '0123456789',
      accountName: '',
    });
  };

  const handleImpersonate = (stylist: AdminStylist) => {
    impersonateStylist(stylist);
    navigate('/dashboard/overview');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900 dark:text-white tracking-tight">
            Registered Stylists & Salons
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage salon businesses, verify profiles, review payout bank accounts, and monitor booking volume.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Stylist</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by business name, owner, slug, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Verification Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* City Filter */}
          <div className="sm:col-span-3">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Nigerian Cities' : c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stylist Directory Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Stylist & Brand</th>
                <th className="py-3.5 px-4 font-semibold">Specialty</th>
                <th className="py-3.5 px-4 font-semibold">Location</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Bookings</th>
                <th className="py-3.5 px-4 font-semibold">Volume (GMV)</th>
                <th className="py-3.5 px-4 font-semibold">Payout Bank</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
              {filteredStylists.map((stylist) => (
                <tr key={stylist.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={stylist.avatar}
                        alt={stylist.businessName}
                        className="w-9 h-9 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-neutral-900 dark:text-white truncate">
                            {stylist.businessName}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            studio.app/{stylist.slug}
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block truncate">
                          {stylist.ownerName} · {stylist.phone}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-neutral-600 dark:text-neutral-300">{stylist.category}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-neutral-800 dark:text-neutral-200 block">{stylist.city}</span>
                    <span className="text-[10px] text-neutral-400 truncate block">{stylist.location}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        stylist.status === 'Verified'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : stylist.status === 'Pending Review'
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                          : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                      }`}
                    >
                      {stylist.status === 'Verified' && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                      {stylist.status === 'Pending Review' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                      {stylist.status === 'Suspended' && <ShieldAlert className="w-3 h-3 text-red-600" />}
                      {stylist.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-white">
                    {stylist.totalBookings}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-neutral-900 dark:text-white block">
                      {formatNaira(stylist.lifetimeRevenue)}
                    </span>
                    <span className="text-[10px] text-violet-600 dark:text-violet-400 font-medium">
                      Fee: {formatNaira(stylist.platformFeesGenerated)}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-neutral-800 dark:text-neutral-200 block font-medium">
                      {stylist.bankName.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {stylist.accountNumber}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedStylist(stylist)}
                        className="py-1 px-2 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded transition-colors cursor-pointer"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => handleImpersonate(stylist)}
                        className="py-1 px-2 text-[11px] font-semibold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 rounded border border-violet-200 dark:border-violet-800 transition-colors cursor-pointer"
                        title="Log in directly as this stylist"
                      >
                        Login
                      </button>

                      <a
                        href={`/${stylist.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                        title="View live client page"
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

      {/* Stylist Details Modal */}
      {selectedStylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-lg p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStylist.avatar}
                  alt={selectedStylist.businessName}
                  className="w-12 h-12 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700"
                />
                <div>
                  <h3 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
                    {selectedStylist.businessName}
                  </h3>
                  <span className="text-xs text-neutral-500 font-medium">
                    Owner: {selectedStylist.ownerName} · {selectedStylist.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedStylist(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-400 block text-[10px]">Total Revenue</span>
                <span className="text-base font-bold text-neutral-900 dark:text-white">
                  {formatNaira(selectedStylist.lifetimeRevenue)}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-400 block text-[10px]">Platform Fee (2.5%)</span>
                <span className="text-base font-bold text-violet-600 dark:text-violet-400">
                  {formatNaira(selectedStylist.platformFeesGenerated)}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Public Link:</span>
                <a
                  href={`/${selectedStylist.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-violet-600 dark:text-violet-400 font-mono hover:underline flex items-center gap-1"
                >
                  <span>studio.app/{selectedStylist.slug}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Contact Phone:</span>
                <span className="text-neutral-900 dark:text-white font-medium">{selectedStylist.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Email Address:</span>
                <span className="text-neutral-900 dark:text-white font-medium">{selectedStylist.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Nigerian Bank:</span>
                <span className="text-neutral-900 dark:text-white font-semibold">{selectedStylist.bankName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">NUBAN Account:</span>
                <span className="font-mono text-neutral-900 dark:text-white">{selectedStylist.accountNumber} ({selectedStylist.accountName})</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-500">Joined Platform:</span>
                <span className="text-neutral-600 dark:text-neutral-400">{selectedStylist.joinedDate}</span>
              </div>
            </div>

            {/* Status Change Controls */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
              <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block">
                Manage Account Status
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    updateStylistStatus(selectedStylist.id, 'Verified');
                    setSelectedStylist({ ...selectedStylist, status: 'Verified' });
                  }}
                  className={`py-2 text-xs font-semibold rounded-lg border cursor-pointer transition-colors ${
                    selectedStylist.status === 'Verified'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  Verified
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateStylistStatus(selectedStylist.id, 'Pending Review');
                    setSelectedStylist({ ...selectedStylist, status: 'Pending Review' });
                  }}
                  className={`py-2 text-xs font-semibold rounded-lg border cursor-pointer transition-colors ${
                    selectedStylist.status === 'Pending Review'
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  Pending Review
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateStylistStatus(selectedStylist.id, 'Suspended');
                    setSelectedStylist({ ...selectedStylist, status: 'Suspended' });
                  }}
                  className={`py-2 text-xs font-semibold rounded-lg border cursor-pointer transition-colors ${
                    selectedStylist.status === 'Suspended'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  Suspended
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  deleteStylist(selectedStylist.id);
                  setSelectedStylist(null);
                }}
                className="py-2 px-3 text-red-600 hover:text-red-700 text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Stylist</span>
              </button>

              <button
                type="button"
                onClick={() => handleImpersonate(selectedStylist)}
                className="py-2 px-4 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Log In As Stylist</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Stylist Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
                Register New Stylist onto Platform
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStylist} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Luxe Braids Lagos"
                    value={newForm.businessName}
                    onChange={(e) => {
                      const name = e.target.value;
                      setNewForm((prev) => ({
                        ...prev,
                        businessName: name,
                        slug: prev.slug === '' ? name.toLowerCase().replace(/[^a-z0-9]/g, '') : prev.slug,
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chioma Eze"
                    value={newForm.ownerName}
                    onChange={(e) => setNewForm({ ...newForm, ownerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="stylist@gmail.com"
                    value={newForm.email}
                    onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Phone (+234) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 123 4567"
                    value={newForm.phone}
                    onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Public URL Handle *
                </label>
                <div className="flex items-center gap-1 font-mono text-xs">
                  <span className="text-neutral-400">studio.app/</span>
                  <input
                    type="text"
                    required
                    value={newForm.slug}
                    onChange={(e) => setNewForm({ ...newForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                    className="flex-1 px-2 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-bold text-violet-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    City / State
                  </label>
                  <select
                    value={newForm.city}
                    onChange={(e) => setNewForm({ ...newForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja (FCT)">Abuja (FCT)</option>
                    <option value="Warri, Delta State">Warri, Delta State</option>
                    <option value="Port Harcourt, Rivers">Port Harcourt, Rivers</option>
                    <option value="Ibadan, Oyo State">Ibadan, Oyo State</option>
                    <option value="Enugu, Enugu State">Enugu, Enugu State</option>
                    <option value="Kano, Kano State">Kano, Kano State</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Specialty Category
                  </label>
                  <select
                    value={newForm.category}
                    onChange={(e) => setNewForm({ ...newForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="Bridal & Event Makeup">Bridal & Event Makeup</option>
                    <option value="Hair Styling & Braiding">Hair Styling & Braiding</option>
                    <option value="Nail Art & Pedicure">Nail Art & Pedicure</option>
                    <option value="Lash Extension & Brow Art">Lash Extension & Brow Art</option>
                    <option value="Fashion & Wardrobe Styling">Fashion & Wardrobe Styling</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-2">
                  Payout Nigerian Bank Account
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-neutral-500 block mb-0.5">Bank Name</label>
                    <input
                      type="text"
                      value={newForm.bankName}
                      onChange={(e) => setNewForm({ ...newForm, bankName: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-500 block mb-0.5">NUBAN Number</label>
                    <input
                      type="text"
                      maxLength={10}
                      value={newForm.accountNumber}
                      onChange={(e) => setNewForm({ ...newForm, accountNumber: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-2 px-3 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl cursor-pointer transition-colors shadow-xs"
                >
                  Register Stylist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
