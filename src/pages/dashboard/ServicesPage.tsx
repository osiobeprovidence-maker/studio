import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Scissors,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { Service } from '../../types';

export const ServicesPage: React.FC = () => {
  const { services, formatNaira, addService, updateService, deleteService, toggleServiceStatus } =
    useStudio();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal states
  const [modalOpen, setModalOpen] = useState(searchParams.get('action') === 'new');
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const initialForm = {
    name: '',
    description: '',
    price: 30000,
    durationMinutes: 90,
    coverImage: '/src/assets/images/portfolio_soft_glam_1793549255284.jpg',
    depositRequired: true,
    depositType: 'fixed' as 'fixed' | 'percentage',
    depositValue: 10000,
    isActive: true,
    category: 'Glam' as Service['category'],
  };

  const [formData, setFormData] = useState(initialForm);

  const categories = ['All', 'Bridal', 'Traditional', 'Glam', 'Editorial', 'Hair & Gele', 'Masterclass'];

  const filteredServices = services.filter((s) => {
    const matchesCat = categoryFilter === 'All' ? true : s.category === categoryFilter;
    const matchesQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleOpenAdd = () => {
    setEditingServiceId(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingServiceId(service.id);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      durationMinutes: service.durationMinutes,
      coverImage: service.coverImage || '/src/assets/images/portfolio_soft_glam_1793549255284.jpg',
      depositRequired: service.depositRequired,
      depositType: service.depositType,
      depositValue: service.depositValue,
      isActive: service.isActive,
      category: service.category,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingServiceId) {
      updateService(editingServiceId, {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        durationMinutes: Number(formData.durationMinutes),
        coverImage: formData.coverImage,
        depositRequired: formData.depositRequired,
        depositType: formData.depositType,
        depositValue: Number(formData.depositValue),
        isActive: formData.isActive,
        category: formData.category,
      });
    } else {
      const calculatedDeposit =
        formData.depositType === 'percentage'
          ? Math.round((Number(formData.price) * Number(formData.depositValue)) / 100)
          : Number(formData.depositValue);

      addService({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        durationMinutes: Number(formData.durationMinutes),
        coverImage: formData.coverImage,
        depositRequired: formData.depositRequired,
        depositType: formData.depositType,
        depositValue: Number(formData.depositValue),
        calculatedDeposit,
        isActive: formData.isActive,
        category: formData.category,
      });
    }

    setModalOpen(false);
    setSearchParams({});
    setEditingServiceId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & New Service CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900 dark:text-white tracking-tight">
            Services & Pricing Menu
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Create, price, and customize beauty packages visible on your public booking page
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs transition-colors duration-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service name or description..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className={`bg-white dark:bg-neutral-900 border rounded-xl overflow-hidden shadow-xs flex flex-col justify-between transition-all group ${
              service.isActive
                ? 'border-neutral-200 dark:border-neutral-800'
                : 'border-neutral-200 dark:border-neutral-800 opacity-60 bg-neutral-50/50 dark:bg-neutral-950/40'
            }`}
          >
            {/* Cover Image & Category tag */}
            <div className="relative h-44 bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <img
                src={service.coverImage || '/src/assets/images/portfolio_soft_glam_1793549255284.jpg'}
                alt={service.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xs text-neutral-900 dark:text-white shadow-xs">
                  {service.category}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => toggleServiceStatus(service.id)}
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1 transition-colors cursor-pointer ${
                    service.isActive
                      ? 'bg-emerald-600/90 text-white'
                      : 'bg-neutral-800/80 text-neutral-300'
                  }`}
                  title={service.isActive ? 'Click to deactivate' : 'Click to activate'}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span>{service.isActive ? 'Active' : 'Inactive'}</span>
                </button>
              </div>
            </div>

            {/* Service Body */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-base font-bold font-heading text-neutral-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Specs & Pricing */}
              <div className="space-y-2.5 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                    <span>{service.durationMinutes} minutes</span>
                  </span>
                  <span className="font-heading font-bold text-lg text-neutral-900 dark:text-white tabular-nums">
                    {formatNaira(service.price)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] bg-violet-50/60 dark:bg-violet-950/40 p-2 rounded-lg border border-violet-100/60 dark:border-violet-900/60">
                  <span className="text-violet-900 dark:text-violet-200 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                    <span>Deposit to book:</span>
                  </span>
                  <span className="font-mono font-bold text-violet-900 dark:text-violet-200 tabular-nums">
                    {formatNaira(service.calculatedDeposit)}
                    {service.depositType === 'percentage' && (
                      <span className="text-[10px] text-violet-600 dark:text-violet-400 ml-1">({service.depositValue}%)</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                <button
                  onClick={() => toggleServiceStatus(service.id)}
                  className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  {service.isActive ? 'Turn Off' : 'Turn On'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(service)}
                    className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:text-violet-700 dark:hover:text-violet-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    title="Edit Service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(service.id)}
                    className="p-1.5 text-neutral-400 dark:text-neutral-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT SERVICE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-lg font-bold font-heading text-neutral-900 dark:text-white">
                {editingServiceId ? 'Edit Service' : 'Add New Styling Service'}
              </h3>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setSearchParams({});
                }}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="E.g. Traditional Wedding Glam & Gele"
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as Service['category'],
                      })
                    }
                    className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="Bridal">Bridal</option>
                    <option value="Traditional">Traditional</option>
                    <option value="Glam">Glam</option>
                    <option value="Editorial">Editorial</option>
                    <option value="Hair & Gele">Hair & Gele</option>
                    <option value="Masterclass">Masterclass</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Duration (Minutes) *
                  </label>
                  <select
                    value={formData.durationMinutes}
                    onChange={(e) =>
                      setFormData({ ...formData, durationMinutes: Number(e.target.value) })
                    }
                    className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins (1 hr)</option>
                    <option value={90}>90 mins (1.5 hrs)</option>
                    <option value={120}>120 mins (2 hrs)</option>
                    <option value={180}>180 mins (3 hrs)</option>
                    <option value={240}>240 mins (4 hrs)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail what is included: skin prep, lash extensions, touchup kit, location, etc."
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Price (NGN ₦) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg font-mono bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Deposit Policy
                  </label>
                  <select
                    value={formData.depositType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        depositType: e.target.value as 'fixed' | 'percentage',
                      })
                    }
                    className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="fixed">Fixed Amount (₦)</option>
                    <option value="percentage">Percentage of Total (%)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {formData.depositType === 'fixed'
                      ? 'Deposit Amount (₦)'
                      : 'Deposit Percentage (%)'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.depositValue}
                    onChange={(e) =>
                      setFormData({ ...formData, depositValue: Number(e.target.value) })
                    }
                    className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg font-mono bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Cover Image
                  </label>
                  <select
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="/src/assets/images/portfolio_bridal_glam_1793549243185.jpg">
                      Bridal Gele Glam
                    </option>
                    <option value="/src/assets/images/portfolio_soft_glam_1793549255284.jpg">
                      Soft Dewy Glam
                    </option>
                    <option value="/src/assets/images/stylist_salon_cover_1793549231440.jpg">
                      Modern Studio Salon
                    </option>
                    <option value="/src/assets/images/stylist_adunni_profile_1793549218901.jpg">
                      Adunni Lead Artist
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-violet-600 focus:ring-violet-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="isActiveToggle" className="font-medium text-neutral-800 dark:text-neutral-200 cursor-pointer">
                  Visible & bookable immediately on public booking page
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
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
                  {editingServiceId ? 'Save Changes' : 'Publish Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE SERVICE CONFIRMATION */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
                Delete Service?
              </h3>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300">
              Are you sure you want to remove this service from your catalog? Existing bookings will remain unaffected.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteService(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
