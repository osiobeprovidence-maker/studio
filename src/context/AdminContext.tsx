import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminStylist, AdminPayout, PlatformConfig, Transaction } from '../types';
import { INITIAL_ADMIN_STYLISTS, INITIAL_ADMIN_PAYOUTS, INITIAL_PLATFORM_CONFIG } from '../data/adminInitialData';
import { useStudio } from './StudioContext';

const ADMIN_STORAGE_KEY = 'studio_admin_data_v1';

interface AdminContextType {
  stylists: AdminStylist[];
  payouts: AdminPayout[];
  config: PlatformConfig;
  updateStylistStatus: (id: string, status: AdminStylist['status']) => void;
  addAdminStylist: (data: Omit<AdminStylist, 'id' | 'totalBookings' | 'lifetimeRevenue' | 'platformFeesGenerated' | 'joinedDate'>) => void;
  deleteStylist: (id: string) => void;
  processPayout: (id: string) => void;
  batchDisburseQueuedPayouts: () => void;
  updateConfig: (updates: Partial<PlatformConfig>) => void;
  impersonateStylist: (stylist: AdminStylist) => void;

  // Aggregate Platform Metrics
  totalGMV: number;
  totalPlatformRevenue: number;
  totalActiveStylists: number;
  totalBookings: number;
  pendingPayoutsTotal: number;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { updateProfile, updateSettings, showToast } = useStudio();

  const [stylists, setStylists] = useState<AdminStylist[]>(() => {
    const saved = localStorage.getItem(`${ADMIN_STORAGE_KEY}_stylists`);
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_STYLISTS;
  });

  const [payouts, setPayouts] = useState<AdminPayout[]>(() => {
    const saved = localStorage.getItem(`${ADMIN_STORAGE_KEY}_payouts`);
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_PAYOUTS;
  });

  const [config, setConfig] = useState<PlatformConfig>(() => {
    const saved = localStorage.getItem(`${ADMIN_STORAGE_KEY}_config`);
    return saved ? JSON.parse(saved) : INITIAL_PLATFORM_CONFIG;
  });

  // Persist admin state
  useEffect(() => {
    localStorage.setItem(`${ADMIN_STORAGE_KEY}_stylists`, JSON.stringify(stylists));
  }, [stylists]);

  useEffect(() => {
    localStorage.setItem(`${ADMIN_STORAGE_KEY}_payouts`, JSON.stringify(payouts));
  }, [payouts]);

  useEffect(() => {
    localStorage.setItem(`${ADMIN_STORAGE_KEY}_config`, JSON.stringify(config));
  }, [config]);

  // Aggregate metrics
  const totalGMV = stylists.reduce((acc, s) => acc + s.lifetimeRevenue, 0);
  const totalPlatformRevenue = stylists.reduce((acc, s) => acc + s.platformFeesGenerated, 0);
  const totalActiveStylists = stylists.filter((s) => s.status === 'Verified').length;
  const totalBookings = stylists.reduce((acc, s) => acc + s.totalBookings, 0);
  const pendingPayoutsTotal = payouts
    .filter((p) => p.status === 'Queued')
    .reduce((acc, p) => acc + p.amount, 0);

  const updateStylistStatus = (id: string, status: AdminStylist['status']) => {
    setStylists((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    showToast(`Stylist status updated to ${status}`, 'info');
  };

  const addAdminStylist = (data: Omit<AdminStylist, 'id' | 'totalBookings' | 'lifetimeRevenue' | 'platformFeesGenerated' | 'joinedDate'>) => {
    const newStylist: AdminStylist = {
      ...data,
      id: `sty-${Date.now()}`,
      totalBookings: 0,
      lifetimeRevenue: 0,
      platformFeesGenerated: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setStylists((prev) => [newStylist, ...prev]);
    showToast(`Stylist ${data.businessName} successfully registered!`, 'success');
  };

  const deleteStylist = (id: string) => {
    setStylists((prev) => prev.filter((s) => s.id !== id));
    showToast('Stylist record removed from platform directory', 'info');
  };

  const processPayout = (id: string) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Processed' } : p))
    );
    showToast('Direct bank transfer marked as Processed via NIP settlement', 'success');
  };

  const batchDisburseQueuedPayouts = () => {
    const queuedCount = payouts.filter((p) => p.status === 'Queued').length;
    if (queuedCount === 0) {
      showToast('No queued payouts awaiting settlement', 'info');
      return;
    }

    setPayouts((prev) =>
      prev.map((p) => (p.status === 'Queued' ? { ...p, status: 'Processed' } : p))
    );
    showToast(`Successfully disbursed ${queuedCount} batch bank payouts!`, 'success');
  };

  const updateConfig = (updates: Partial<PlatformConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
    showToast('Platform global configuration updated', 'success');
  };

  const impersonateStylist = (stylist: AdminStylist) => {
    updateProfile({
      id: stylist.id,
      slug: stylist.slug,
      businessName: stylist.businessName,
      ownerName: stylist.ownerName,
      title: stylist.category,
      location: `${stylist.location}, ${stylist.city}`,
      phone: stylist.phone,
      whatsapp: stylist.phone,
      email: stylist.email,
      profileImage: stylist.avatar,
    });

    updateSettings({
      bankAccount: {
        bankName: stylist.bankName,
        accountNumber: stylist.accountNumber,
        accountName: stylist.accountName,
      },
    });

    showToast(`Impersonating ${stylist.businessName} workspace`, 'info');
  };

  return (
    <AdminContext.Provider
      value={{
        stylists,
        payouts,
        config,
        updateStylistStatus,
        addAdminStylist,
        deleteStylist,
        processPayout,
        batchDisburseQueuedPayouts,
        updateConfig,
        impersonateStylist,
        totalGMV,
        totalPlatformRevenue,
        totalActiveStylists,
        totalBookings,
        pendingPayoutsTotal,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
