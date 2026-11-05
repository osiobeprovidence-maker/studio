export type BookingStatus =
  | 'confirmed'
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'rescheduled'
  | 'no-show';

export interface Booking {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  price: number;
  depositAmount: number;
  amountPaid: number;
  outstandingBalance: number;
  status: BookingStatus;
  customerNotes?: string;
  stylistNotes?: string;
  cancellationReason?: string;
  paymentMethod?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number; // in NGN
  durationMinutes: number;
  coverImage?: string;
  depositRequired: boolean;
  depositType: 'fixed' | 'percentage';
  depositValue: number; // amount or percentage
  calculatedDeposit: number;
  isActive: boolean;
  category: 'Bridal' | 'Glam' | 'Traditional' | 'Hair & Gele' | 'Editorial' | 'Masterclass';
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalBookings: number;
  totalSpent: number;
  lastAppointmentDate?: string;
  upcomingAppointmentDate?: string;
  notes?: string;
  joinedDate: string;
  avatarColor: string;
  preferredService?: string;
}

export type PaymentStatus = 'Successful' | 'Pending' | 'Failed' | 'Refunded';
export type PaymentMethod = 'Debit Card' | 'Bank Transfer' | 'USSD';

export interface Transaction {
  id: string;
  reference: string;
  customerName: string;
  bookingId?: string;
  serviceName: string;
  amount: number;
  platformFee: number; // typically 2.5%
  netAmount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  date: string; // ISO string or YYYY-MM-DD HH:mm
  channel: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g., 10 for 10% or 15000 for ₦15,000
  expirationDate: string; // YYYY-MM-DD
  usageLimit: number;
  usedCount: number;
  minBookingAmount: number;
  isActive: boolean;
  description: string;
}

export interface Referral {
  id: string;
  referredStylistName: string;
  businessName: string;
  referralCode: string;
  status: 'Completed' | 'Pending' | 'Reward Paid';
  rewardAmount: number;
  date: string;
  payoutDate?: string;
}

export interface StylistProfile {
  id: string;
  slug: string;
  businessName: string;
  ownerName: string;
  title: string;
  bio: string;
  location: string;
  fullAddress: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  email: string;
  profileImage: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  cancellationPolicy: string;
  paymentTerms: string;
  portfolio: {
    id: string;
    title: string;
    category: string;
    image: string;
  }[];
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface StylistSettings {
  theme: ThemeMode;
  workingDays: number[]; // 0: Sun, 1: Mon, ..., 6: Sat
  workingHoursStart: string; // "09:00"
  workingHoursEnd: string; // "18:00"
  breakPeriods: { start: string; end: string; label: string }[];
  bufferMinutes: number;
  advanceBookingDaysLimit: number;
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  transactionFeePercent: number; // 2.5%
  payoutFrequency: 'Daily' | 'Weekly' | 'Instant';
  whatsappNotifications: {
    connected: boolean;
    phoneNumber: string;
    sendNewBooking: boolean;
    sendConfirmation: boolean;
    sendReminder: boolean;
    sendCancellation: boolean;
    sendReschedule: boolean;
    sendPaymentConfirmation: boolean;
    sendDailySummary: boolean;
    reminderTiming: '24h' | '12h' | '2h' | '30m';
  };
}

export interface AdminStylist {
  id: string;
  ownerName: string;
  businessName: string;
  email: string;
  phone: string;
  slug: string;
  category: string;
  location: string;
  city: string;
  status: 'Verified' | 'Pending Review' | 'Suspended';
  totalBookings: number;
  lifetimeRevenue: number;
  platformFeesGenerated: number;
  joinedDate: string;
  avatar: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface AdminPayout {
  id: string;
  reference: string;
  stylistName: string;
  businessName: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  status: 'Processed' | 'Queued' | 'Failed';
  date: string;
  batchId: string;
}

export interface PlatformConfig {
  platformFeePercent: number;
  minimumDepositAmount: number;
  activePaymentGateway: 'Paystack' | 'Flutterwave' | 'Monnify' | 'Squad';
  announcementMessage: string;
  announcementActive: boolean;
  autoPayoutEnabled: boolean;
  payoutSchedule: 'Instant' | 'Daily (10:00 PM)' | 'Weekly (Monday)';
}
