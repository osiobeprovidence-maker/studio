import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_BOOKINGS,
  INITIAL_CLIENTS,
  INITIAL_COUPONS,
  INITIAL_REFERRALS,
  INITIAL_SERVICES,
  INITIAL_SETTINGS,
  INITIAL_STYLIST_PROFILE,
} from '../data/initialData';
import {
  Booking,
  BookingStatus,
  Client,
  Coupon,
  PaymentMethod,
  Referral,
  Service,
  StylistProfile,
  StylistSettings,
  ThemeMode,
  Transaction,
} from '../types';

const STORAGE_KEY = 'studio_crm_data_v1';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface StudioContextType {
  profile: StylistProfile;
  services: Service[];
  bookings: Booking[];
  clients: Client[];
  transactions: Transaction[];
  coupons: Coupon[];
  referrals: Referral[];
  settings: StylistSettings;
  toasts: ToastMessage[];
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;

  // Helpers
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
  formatNaira: (amount: number) => string;

  // Bookings
  addBooking: (booking: Omit<Booking, 'id' | 'reference' | 'createdAt'>) => Booking;
  updateBookingStatus: (id: string, status: BookingStatus, reason?: string) => void;
  rescheduleBooking: (id: string, newDate: string, newStartTime: string, newEndTime: string) => void;
  updateBookingNotes: (id: string, stylistNotes: string) => void;
  deleteBooking: (id: string) => void;

  // Services
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  toggleServiceStatus: (id: string) => void;

  // Clients
  addOrUpdateClient: (clientData: Partial<Client> & { name: string; phone: string }) => Client;
  updateClientNotes: (id: string, notes: string) => void;

  // Transactions
  addTransaction: (tx: Omit<Transaction, 'id' | 'reference' | 'date'>) => Transaction;

  // Coupons
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void;
  toggleCouponStatus: (id: string) => void;
  validateCoupon: (
    code: string,
    bookingAmount: number
  ) => { valid: boolean; discountAmount: number; coupon?: Coupon; error?: string };

  // Referrals
  addReferral: (referral: Omit<Referral, 'id' | 'date'>) => void;

  // Profile & Settings
  updateProfile: (updates: Partial<StylistProfile>) => void;
  updateSettings: (updates: Partial<StylistSettings>) => void;
  resetDemoData: () => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<StylistProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
    return saved ? JSON.parse(saved) : INITIAL_STYLIST_PROFILE;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_services`);
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_bookings`);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_clients`);
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_transactions`);
    if (saved) return JSON.parse(saved);
    // Dynamic import from initialData
    return [
      {
        id: 'txn-1',
        reference: 'TXN-GLW-8921',
        customerName: 'Aisha Oghenekaro',
        bookingId: 'bk-101',
        serviceName: 'Bridal Makeup (White Wedding)',
        amount: 30000,
        platformFee: 750,
        netAmount: 29250,
        paymentMethod: 'Debit Card' as PaymentMethod,
        status: 'Successful',
        date: '2026-10-25 14:32',
        channel: 'Online Checkout',
      },
      {
        id: 'txn-2',
        reference: 'TXN-GLW-8922',
        customerName: 'Chioma Eze',
        bookingId: 'bk-102',
        serviceName: 'Birthday & Event Glam',
        amount: 10000,
        platformFee: 250,
        netAmount: 9750,
        paymentMethod: 'Bank Transfer' as PaymentMethod,
        status: 'Successful',
        date: '2026-10-28 09:18',
        channel: 'Online Checkout',
      },
      {
        id: 'txn-3',
        reference: 'TXN-GLW-8923',
        customerName: 'Blessing Osagie',
        bookingId: 'bk-103',
        serviceName: 'Traditional Wedding Makeup & Gele',
        amount: 15000,
        platformFee: 375,
        netAmount: 14625,
        paymentMethod: 'USSD' as PaymentMethod,
        status: 'Successful',
        date: '2026-10-31 18:22',
        channel: 'Online Checkout',
      },
      {
        id: 'txn-4',
        reference: 'TXN-GLW-8924',
        customerName: 'Folashade Adeyemi',
        bookingId: 'bk-104',
        serviceName: 'Soft Glam & Photoshoot',
        amount: 25000,
        platformFee: 625,
        netAmount: 24375,
        paymentMethod: 'Bank Transfer' as PaymentMethod,
        status: 'Successful',
        date: '2026-10-30 11:47',
        channel: 'Online Checkout',
      },
      {
        id: 'txn-5',
        reference: 'TXN-GLW-8925',
        customerName: 'Nneka Okonkwo',
        bookingId: 'bk-105',
        serviceName: 'Bridal Makeup (White Wedding)',
        amount: 30000,
        platformFee: 750,
        netAmount: 29250,
        paymentMethod: 'Debit Card' as PaymentMethod,
        status: 'Successful',
        date: '2026-10-27 16:12',
        channel: 'Online Checkout',
      },
      {
        id: 'txn-6',
        reference: 'TXN-GLW-8926',
        customerName: 'Tejiri Efetobor',
        bookingId: 'bk-107',
        serviceName: 'Birthday & Event Glam',
        amount: 25000,
        platformFee: 625,
        netAmount: 24375,
        paymentMethod: 'Debit Card' as PaymentMethod,
        status: 'Successful',
        date: '2026-10-29 16:35',
        channel: 'Balance Settlement',
      },
      {
        id: 'txn-7',
        reference: 'TXN-GLW-8927',
        customerName: 'Oghale Akpomiemie',
        bookingId: 'bk-108',
        serviceName: 'Traditional Wedding Makeup & Gele',
        amount: 30000,
        platformFee: 750,
        netAmount: 29250,
        paymentMethod: 'Bank Transfer' as PaymentMethod,
        status: 'Successful',
        date: '2026-10-26 10:35',
        channel: 'Balance Settlement',
      },
      {
        id: 'txn-8',
        reference: 'TXN-GLW-8928',
        customerName: 'Zainab Bello',
        bookingId: 'bk-106',
        serviceName: 'Soft Glam & Photoshoot',
        amount: 10000,
        platformFee: 250,
        netAmount: 9750,
        paymentMethod: 'USSD' as PaymentMethod,
        status: 'Successful',
        date: '2026-10-26 12:04',
        channel: 'Online Checkout',
      },
      {
        id: 'txn-9',
        reference: 'TXN-GLW-8929',
        customerName: 'Elohor Dafiaghor',
        serviceName: 'VIP Private 1-on-1 Masterclass',
        amount: 54000,
        platformFee: 1350,
        netAmount: 52650,
        paymentMethod: 'Debit Card' as PaymentMethod,
        status: 'Pending',
        date: '2026-11-01 07:45',
        channel: 'Online Checkout',
      },
      {
        id: 'txn-10',
        reference: 'TXN-GLW-8930',
        customerName: 'Ejiro Mukoro',
        bookingId: 'bk-109',
        serviceName: 'Avant-Garde Gele Tying & Royal Touch-Up',
        amount: 5000,
        platformFee: 0,
        netAmount: 5000,
        paymentMethod: 'Debit Card' as PaymentMethod,
        status: 'Refunded',
        date: '2026-10-24 13:10',
        channel: 'Customer Refund',
      },
    ];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_coupons`);
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [referrals, setReferrals] = useState<Referral[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_referrals`);
    return saved ? JSON.parse(saved) : INITIAL_REFERRALS;
  });

  const [settings, setSettings] = useState<StylistSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
    return saved ? { ...INITIAL_SETTINGS, ...JSON.parse(saved) } : INITIAL_SETTINGS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const theme: ThemeMode = settings.theme || 'light';

  const setTheme = (newTheme: ThemeMode) => {
    setSettings((prev) => ({ ...prev, theme: newTheme }));
  };

  // Sync theme with HTML document element (.dark class)
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  // Local storage synchronization
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_services`, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_bookings`, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_clients`, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_transactions`, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_coupons`, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_referrals`, JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
  }, [settings]);

  // Toast handlers
  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Naira currency formatter
  const formatNaira = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount).replace('NGN', '₦').trim();
  };

  // Add booking
  const addBooking = (bookingData: Omit<Booking, 'id' | 'reference' | 'createdAt'>): Booking => {
    const id = `bk-${Date.now()}`;
    const reference = `BK-GLW-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...bookingData,
      id,
      reference,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Also update or add client
    addOrUpdateClient({
      name: newBooking.customerName,
      phone: newBooking.customerPhone,
      email: newBooking.customerEmail,
      preferredService: newBooking.serviceName,
      upcomingAppointmentDate: newBooking.date,
    });

    showToast(`Booking ${reference} confirmed for ${newBooking.customerName}!`);
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingStatus, reason?: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const updated = {
          ...b,
          status,
          ...(reason ? { cancellationReason: reason } : {}),
        };
        // If completed, set outstanding balance to 0 and amountPaid to price
        if (status === 'completed') {
          updated.amountPaid = updated.price;
          updated.outstandingBalance = 0;
        }
        return updated;
      })
    );

    const statusLabels: Record<BookingStatus, string> = {
      confirmed: 'Confirmed',
      pending: 'Marked Pending',
      completed: 'Marked Completed',
      cancelled: 'Cancelled',
      rescheduled: 'Rescheduled',
      'no-show': 'Marked No-Show',
    };
    showToast(`Appointment ${statusLabels[status]}`);
  };

  const rescheduleBooking = (
    id: string,
    newDate: string,
    newStartTime: string,
    newEndTime: string
  ) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              date: newDate,
              startTime: newStartTime,
              endTime: newEndTime,
              status: 'rescheduled',
            }
          : b
      )
    );
    showToast(`Appointment rescheduled to ${newDate} at ${newStartTime}`);
  };

  const updateBookingNotes = (id: string, stylistNotes: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, stylistNotes } : b))
    );
    showToast('Appointment notes saved');
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    showToast('Booking deleted');
  };

  // Services
  const addService = (serviceData: Omit<Service, 'id'>) => {
    const id = `srv-${Date.now()}`;
    const calculatedDeposit =
      serviceData.depositType === 'percentage'
        ? Math.round((serviceData.price * serviceData.depositValue) / 100)
        : serviceData.depositValue;

    const newService: Service = {
      ...serviceData,
      id,
      calculatedDeposit,
    };
    setServices((prev) => [newService, ...prev]);
    showToast(`Service "${newService.name}" created`);
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const updated = { ...s, ...updates };
        if (updated.depositType === 'percentage') {
          updated.calculatedDeposit = Math.round((updated.price * updated.depositValue) / 100);
        } else {
          updated.calculatedDeposit = updated.depositValue;
        }
        return updated;
      })
    );
    showToast('Service updated successfully');
  };

  const deleteService = (id: string) => {
    const serviceName = services.find((s) => s.id === id)?.name || 'Service';
    setServices((prev) => prev.filter((s) => s.id !== id));
    showToast(`Service "${serviceName}" removed`);
  };

  const toggleServiceStatus = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  // Clients
  const addOrUpdateClient = (clientData: Partial<Client> & { name: string; phone: string }): Client => {
    const existing = clients.find(
      (c) => c.phone.trim() === clientData.phone.trim() || c.name.toLowerCase() === clientData.name.toLowerCase()
    );

    if (existing) {
      const updated: Client = {
        ...existing,
        ...clientData,
        totalBookings: existing.totalBookings + 1,
        totalSpent: existing.totalSpent + (clientData.totalSpent || 0),
        upcomingAppointmentDate: clientData.upcomingAppointmentDate || existing.upcomingAppointmentDate,
      };
      setClients((prev) => prev.map((c) => (c.id === existing.id ? updated : c)));
      return updated;
    } else {
      const colors = [
        'bg-purple-100 text-purple-700',
        'bg-pink-100 text-pink-700',
        'bg-indigo-100 text-indigo-700',
        'bg-emerald-100 text-emerald-700',
        'bg-amber-100 text-amber-700',
        'bg-rose-100 text-rose-700',
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newClient: Client = {
        id: `cli-${Date.now()}`,
        name: clientData.name,
        phone: clientData.phone,
        email: clientData.email,
        totalBookings: 1,
        totalSpent: clientData.totalSpent || 0,
        upcomingAppointmentDate: clientData.upcomingAppointmentDate,
        joinedDate: new Date().toISOString().split('T')[0],
        notes: clientData.notes || '',
        avatarColor: randomColor,
        preferredService: clientData.preferredService,
      };
      setClients((prev) => [newClient, ...prev]);
      return newClient;
    }
  };

  const updateClientNotes = (id: string, notes: string) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, notes } : c)));
    showToast('Client notes updated');
  };

  // Transactions
  const addTransaction = (txData: Omit<Transaction, 'id' | 'reference' | 'date'>): Transaction => {
    const id = `txn-${Date.now()}`;
    const reference = `TXN-GLW-${Math.floor(1000 + Math.random() * 9000)}`;
    const date = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newTx: Transaction = {
      ...txData,
      id,
      reference,
      date,
    };
    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  };

  // Coupons
  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usedCount'>) => {
    const id = `cpn-${Date.now()}`;
    const newCoupon: Coupon = {
      ...couponData,
      id,
      usedCount: 0,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    showToast(`Coupon ${newCoupon.code} created`);
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const validateCoupon = (
    code: string,
    bookingAmount: number
  ): { valid: boolean; discountAmount: number; coupon?: Coupon; error?: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode);

    if (!found) {
      return { valid: false, discountAmount: 0, error: 'Invalid coupon code' };
    }
    if (!found.isActive) {
      return { valid: false, discountAmount: 0, error: 'This coupon is no longer active' };
    }
    if (new Date(found.expirationDate) < new Date('2026-11-01')) {
      return { valid: false, discountAmount: 0, error: 'This coupon has expired' };
    }
    if (found.usedCount >= found.usageLimit) {
      return { valid: false, discountAmount: 0, error: 'Coupon usage limit reached' };
    }
    if (bookingAmount < found.minBookingAmount) {
      return {
        valid: false,
        discountAmount: 0,
        error: `Requires a minimum booking amount of ${formatNaira(found.minBookingAmount)}`,
      };
    }

    let discountAmount = 0;
    if (found.discountType === 'percentage') {
      discountAmount = Math.round((bookingAmount * found.discountValue) / 100);
    } else {
      discountAmount = Math.min(found.discountValue, bookingAmount);
    }

    return { valid: true, discountAmount, coupon: found };
  };

  // Referrals
  const addReferral = (refData: Omit<Referral, 'id' | 'date'>) => {
    const id = `ref-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    const newRef: Referral = {
      ...refData,
      id,
      date,
    };
    setReferrals((prev) => [newRef, ...prev]);
    showToast('Referral invitation logged');
  };

  // Profile & Settings
  const updateProfile = (updates: Partial<StylistProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    showToast('Business profile updated');
  };

  const updateSettings = (updates: Partial<StylistSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    showToast('Settings saved successfully');
  };

  const resetDemoData = () => {
    setProfile(INITIAL_STYLIST_PROFILE);
    setServices(INITIAL_SERVICES);
    setBookings(INITIAL_BOOKINGS);
    setClients(INITIAL_CLIENTS);
    setCoupons(INITIAL_COUPONS);
    setReferrals(INITIAL_REFERRALS);
    setSettings(INITIAL_SETTINGS);

    localStorage.removeItem(`${STORAGE_KEY}_profile`);
    localStorage.removeItem(`${STORAGE_KEY}_services`);
    localStorage.removeItem(`${STORAGE_KEY}_bookings`);
    localStorage.removeItem(`${STORAGE_KEY}_clients`);
    localStorage.removeItem(`${STORAGE_KEY}_transactions`);
    localStorage.removeItem(`${STORAGE_KEY}_coupons`);
    localStorage.removeItem(`${STORAGE_KEY}_referrals`);
    localStorage.removeItem(`${STORAGE_KEY}_settings`);

    showToast('Demo data reset to default factory state', 'info');
  };

  return (
    <StudioContext.Provider
      value={{
        profile,
        services,
        bookings,
        clients,
        transactions,
        coupons,
        referrals,
        settings,
        toasts,
        theme,
        setTheme,
        showToast,
        dismissToast,
        formatNaira,
        addBooking,
        updateBookingStatus,
        rescheduleBooking,
        updateBookingNotes,
        deleteBooking,
        addService,
        updateService,
        deleteService,
        toggleServiceStatus,
        addOrUpdateClient,
        updateClientNotes,
        addTransaction,
        addCoupon,
        toggleCouponStatus,
        validateCoupon,
        addReferral,
        updateProfile,
        updateSettings,
        resetDemoData,
      }}
    >
      {children}

      {/* Global Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-lg shadow-lg border text-sm font-medium flex items-center justify-between gap-3 animate-slide-up transition-all ${
              toast.type === 'success'
                ? 'bg-neutral-900 text-white border-neutral-800'
                : toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-800'
                : toast.type === 'warning'
                ? 'bg-amber-900 text-white border-amber-800'
                : 'bg-neutral-800 text-neutral-100 border-neutral-700'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-neutral-400 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
