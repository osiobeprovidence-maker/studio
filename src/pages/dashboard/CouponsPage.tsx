import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Percent,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Copy,
  Check,
  ToggleLeft,
  ToggleRight,
  ShieldAlert
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { Coupon } from '../../types';

export const CouponsPage: React.FC = () => {
  const { coupons, formatNaira, addCoupon, toggleCouponStatus, showToast } = useStudio();
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const initialForm = {
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 10,
    expirationDate: '2026-12-31',
    usageLimit: 30,
    minBookingAmount: 25000,
    isActive: true,
    description: '',
  };

  const [formData, setFormData] = useState(initialForm);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon code ${code} copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = formData.code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (!cleanCode) return;

    addCoupon({
      code: cleanCode,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      expirationDate: formData.expirationDate,
      usageLimit: Number(formData.usageLimit),
      minBookingAmount: Number(formData.minBookingAmount),
      isActive: formData.isActive,
      description: formData.description || `${formData.discountValue}${formData.discountType === 'percentage' ? '%' : '₦'} promotion code`,
    });

    setModalOpen(false);
    setFormData(initialForm);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900 dark:text-white tracking-tight">
            Coupons & Promotional Discounts
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Create special discount codes for seasonal campaigns, bridal specials, and first-time clients
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {coupons.map((coupon) => {
          const isExpired = new Date(coupon.expirationDate) < new Date('2026-11-01');
          const isLimitReached = coupon.usedCount >= coupon.usageLimit;
          const usagePercent = Math.min(100, Math.round((coupon.usedCount / coupon.usageLimit) * 100));

          return (
            <div
              key={coupon.id}
              className={`bg-white dark:bg-neutral-900 border rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xs transition-all ${
                !coupon.isActive || isExpired || isLimitReached
                  ? 'border-neutral-200 dark:border-neutral-800 opacity-65 bg-neutral-50/50 dark:bg-neutral-950/40'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-violet-300 dark:hover:border-violet-700'
              }`}
            >
              <div className="space-y-3">
                {/* Coupon Code badge & Active Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-mono font-bold text-sm rounded-lg border border-violet-200 dark:border-violet-800 tracking-wider">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(coupon.code)}
                      className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded transition-colors"
                      title="Copy code"
                    >
                      {copiedCode === coupon.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => toggleCouponStatus(coupon.id)}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded cursor-pointer ${
                      coupon.isActive && !isExpired && !isLimitReached
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {isExpired
                      ? 'Expired'
                      : isLimitReached
                      ? 'Limit Reached'
                      : coupon.isActive
                      ? 'Active'
                      : 'Disabled'}
                  </button>
                </div>

                {/* Discount Value */}
                <div>
                  <div className="text-xl font-bold font-heading text-neutral-900 dark:text-white">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}% OFF`
                      : `${formatNaira(coupon.discountValue)} OFF`}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{coupon.description}</p>
                </div>

                {/* Progress bar of usage */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                    <span>Usage: {coupon.usedCount} of {coupon.usageLimit} redemptions</span>
                    <span className="font-mono">{usagePercent}%</span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      style={{ width: `${usagePercent}%` }}
                      className={`h-full ${usagePercent >= 100 ? 'bg-amber-500' : 'bg-violet-600'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Conditions & Expiry Footer */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-1 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                <div className="flex justify-between">
                  <span className="font-sans">Minimum Booking:</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{formatNaira(coupon.minBookingAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans">Valid Until:</span>
                  <span className="text-neutral-700 dark:text-neutral-300">{coupon.expirationDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE COUPON MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-base font-bold font-heading text-neutral-900 dark:text-white">
                Create Discount Coupon
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="E.g. FIRSTGLOW, WARRIBEST, BRIDAL2026"
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg uppercase font-mono tracking-wider bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value as 'percentage' | 'fixed',
                      })
                    }
                    className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Naira Amount (₦)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({ ...formData, discountValue: Number(e.target.value) })
                    }
                    placeholder={formData.discountType === 'percentage' ? '10' : '5000'}
                    className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg font-mono bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Minimum Booking (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.minBookingAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, minBookingAmount: Number(e.target.value) })
                    }
                    className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg font-mono bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Usage Cap (Clients) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.usageLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, usageLimit: Number(e.target.value) })
                    }
                    className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg font-mono bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Expiration Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="E.g. 10% welcome discount on any glam package"
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
