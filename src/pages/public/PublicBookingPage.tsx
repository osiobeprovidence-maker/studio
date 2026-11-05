import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageCircle,
  Instagram,
  Star,
  MapPin,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Building,
  ArrowRight,
  Sparkles,
  Info,
  Tag,
  Check,
  Share2,
  AlertCircle
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { Coupon, Service } from '../../types';

export const PublicBookingPage: React.FC = () => {
  const {
    profile,
    services,
    formatNaira,
    validateCoupon,
    addBooking,
    addTransaction,
    settings,
    showToast,
  } = useStudio();

  const navigate = useNavigate();
  const { slug } = useParams();

  // Active step in booking flow (1 to 7)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Booking state
  const [selectedService, setSelectedService] = useState<Service | null>(
    services.find((s) => s.isActive) || services[0] || null
  );

  // Default to tomorrow 2026-11-02
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-03');
  const [selectedTime, setSelectedTime] = useState<string>('10:00');

  // Customer info
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '+234 ',
    email: '',
    specialRequests: '',
  });

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    coupon: Coupon;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<'Debit Card' | 'Bank Transfer' | 'USSD'>(
    'Debit Card'
  );
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedBookingRef, setCompletedBookingRef] = useState<string>('');

  // Active services list
  const activeServices = services.filter((s) => s.isActive);

  // Available time slots based on stylist working hours and interval
  const availableSlots = [
    '09:00',
    '10:30',
    '12:00',
    '14:00',
    '15:30',
    '17:00',
  ];

  // Coupon application handler
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!selectedService) return;

    const res = validateCoupon(couponCodeInput, selectedService.price);
    if (res.valid && res.coupon) {
      setAppliedCoupon({
        code: res.coupon.code,
        discountAmount: res.discountAmount,
        coupon: res.coupon,
      });
      showToast(`Coupon ${res.coupon.code} applied! -${formatNaira(res.discountAmount)}`);
    } else {
      setCouponError(res.error || 'Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    setCouponError(null);
  };

  // Pricing calculations
  const originalPrice = selectedService?.price || 0;
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalPrice = Math.max(0, originalPrice - discount);

  // Deposit calculation
  const rawDeposit = selectedService?.calculatedDeposit || 10000;
  // If discount exceeds balance, deposit shouldn't exceed final price
  const depositPayableNow = Math.min(rawDeposit, finalPrice);
  const balancePayableLater = Math.max(0, finalPrice - depositPayableNow);
  const checkoutProcessingFee = 0; // free checkout for customer
  const totalDueNow = depositPayableNow + checkoutProcessingFee;

  // Complete Simulated Checkout
  const handleCompletePayment = () => {
    if (!selectedService) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      // Calculate end time
      const [h, m] = selectedTime.split(':').map(Number);
      const totalMinutes = h * 60 + m + selectedService.durationMinutes;
      const endH = Math.floor(totalMinutes / 60)
        .toString()
        .padStart(2, '0');
      const endM = (totalMinutes % 60).toString().padStart(2, '0');
      const endTime = `${endH}:${endM}`;

      // Create new booking in context
      const newBooking = addBooking({
        customerName: customerInfo.name || 'Valued Client',
        customerPhone: customerInfo.phone || '+234 800 000 0000',
        customerEmail: customerInfo.email || undefined,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        date: selectedDate,
        startTime: selectedTime,
        endTime,
        durationMinutes: selectedService.durationMinutes,
        price: finalPrice,
        depositAmount: depositPayableNow,
        amountPaid: depositPayableNow,
        outstandingBalance: balancePayableLater,
        status: 'confirmed',
        customerNotes: customerInfo.specialRequests || undefined,
        paymentMethod,
      });

      // Also log the transaction in financial ledger
      const platformFee = Math.round((depositPayableNow * settings.transactionFeePercent) / 100);
      addTransaction({
        customerName: customerInfo.name || 'Valued Client',
        bookingId: newBooking.id,
        serviceName: selectedService.name,
        amount: depositPayableNow,
        platformFee,
        netAmount: depositPayableNow - platformFee,
        paymentMethod,
        status: 'Successful',
        channel: 'Public Booking Checkout',
      });

      setCompletedBookingRef(newBooking.reference);
      setIsProcessingPayment(false);
      setCurrentStep(7); // Go to step 7: Confirmation
    }, 1200);
  };

  const stepsList = [
    'Service',
    'Date',
    'Time',
    'Details',
    'Review',
    'Payment',
    'Confirmed',
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-16">
      {/* Top Banner with Direct Links to Home and Stylist Dashboard */}
      <div className="bg-neutral-900 text-white text-xs py-2 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-1.5 hover:text-violet-300 transition-colors font-medium">
            <span className="w-5 h-5 rounded bg-violet-600 text-white font-bold flex items-center justify-center text-[10px]">S</span>
            <span className="font-heading font-semibold">Studio</span>
          </Link>
          <span className="text-neutral-500">·</span>
          <span className="hidden sm:inline text-neutral-400">Public Booking Page · studio.app/{profile.slug}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/create-account"
            className="hidden sm:inline text-neutral-400 hover:text-white transition-colors"
          >
            Create Your Page
          </Link>
          <span className="hidden sm:inline text-neutral-600">|</span>
          <Link
            to="/dashboard/overview"
            className="text-violet-300 hover:text-white font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Stylist Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Hero Stylist Profile Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="relative h-44 sm:h-56 bg-neutral-800 overflow-hidden">
          <img
            src={profile.coverImage}
            alt={profile.businessName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative pb-6">
          {/* Avatar and Badges */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
            <div className="flex items-end gap-4">
              <img
                src={profile.profileImage}
                alt={profile.ownerName}
                referrerPolicy="no-referrer"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white shadow-md bg-white shrink-0"
              />
              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900">
                    {profile.businessName}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
                    Verified
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 font-medium">{profile.title}</p>
                <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{profile.location}</span>
                </div>
              </div>
            </div>

            {/* Ratings & Contact buttons */}
            <div className="flex items-center gap-2 self-start sm:self-end">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-bold text-amber-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{profile.rating}</span>
                <span className="text-[11px] font-normal text-amber-700">({profile.reviewCount} reviews)</span>
              </div>

              <a
                href={`tel:${profile.phone}`}
                className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs transition-colors"
                title="Call Stylist"
              >
                <Phone className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs transition-colors"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Bio text */}
          <p className="text-xs sm:text-sm text-neutral-600 mt-4 leading-relaxed max-w-3xl">
            {profile.bio}
          </p>

          {/* Portfolio Showcase Carousel / Grid */}
          <div className="mt-5 pt-4 border-t border-neutral-100">
            <h4 className="text-xs font-bold font-heading text-neutral-800 uppercase tracking-wider mb-2.5">
              Portfolio & Recent Client Looks
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {profile.portfolio.map((item) => (
                <div key={item.id} className="relative rounded-lg overflow-hidden border border-neutral-200 group h-32 sm:h-36">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[11px] text-white font-medium line-clamp-1">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Step Customer Booking Experience Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {/* Step Progress Header */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4 mb-6 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs">
                {currentStep}
              </span>
              <span className="text-neutral-900 font-heading text-sm">
                Step {currentStep} of 7: {stepsList[currentStep - 1]}
              </span>
            </div>
            {currentStep > 1 && currentStep < 7 && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="text-neutral-500 hover:text-neutral-900 flex items-center gap-1 cursor-pointer text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
          </div>

          {/* Step Dots Progress bar */}
          <div className="grid grid-cols-7 gap-1 mt-3">
            {stepsList.map((step, idx) => {
              const stepNum = idx + 1;
              const isDone = currentStep > stepNum;
              const isCurrent = currentStep === stepNum;
              return (
                <div key={step} className="flex flex-col gap-1">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      isDone
                        ? 'bg-violet-600'
                        : isCurrent
                        ? 'bg-violet-500'
                        : 'bg-neutral-200'
                    }`}
                  />
                  <span
                    className={`text-[9px] truncate hidden sm:block ${
                      isCurrent ? 'font-bold text-violet-700' : 'text-neutral-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 1: SELECT SERVICE */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-heading text-neutral-900">
                  Select a Styling Service
                </h2>
                <p className="text-xs text-neutral-500">
                  Choose from our curated bridal, event, and editorial glam packages
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeServices.map((service) => {
                const isSelected = selectedService?.id === service.id;
                return (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`bg-white border rounded-xl overflow-hidden p-4 flex gap-4 transition-all cursor-pointer group shadow-xs ${
                      isSelected
                        ? 'border-violet-600 ring-2 ring-violet-500/30'
                        : 'border-neutral-200 hover:border-violet-300'
                    }`}
                  >
                    <img
                      src={service.coverImage || '/src/assets/images/portfolio_soft_glam_1793549255284.jpg'}
                      alt={service.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-neutral-900 group-hover:text-violet-700 truncate">
                            {service.name}
                          </h3>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 line-clamp-2 mt-1">
                          {service.description}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs border-t border-neutral-100">
                        <span className="font-bold text-neutral-900 font-heading text-sm">
                          {formatNaira(service.price)}
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          {service.durationMinutes} mins · Deposit: {formatNaira(service.calculatedDeposit)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!selectedService}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                <span>Continue to Date Selection</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT DATE */}
        {currentStep === 2 && (
          <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-6 shadow-xs">
            <div>
              <h2 className="text-lg font-bold font-heading text-neutral-900">
                Choose an Appointment Date
              </h2>
              <p className="text-xs text-neutral-500">
                Available dates according to Glow by Adunni's schedule (Monday to Saturday)
              </p>
            </div>

            {/* Quick 14-day interactive date selector cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {[
                { date: '2026-11-02', day: 'Mon', num: '02' },
                { date: '2026-11-03', day: 'Tue', num: '03' },
                { date: '2026-11-04', day: 'Wed', num: '04' },
                { date: '2026-11-05', day: 'Thu', num: '05' },
                { date: '2026-11-06', day: 'Fri', num: '06' },
                { date: '2026-11-07', day: 'Sat', num: '07' },
                { date: '2026-11-09', day: 'Mon', num: '09' },
                { date: '2026-11-10', day: 'Tue', num: '10' },
                { date: '2026-11-11', day: 'Wed', num: '11' },
                { date: '2026-11-12', day: 'Thu', num: '12' },
                { date: '2026-11-13', day: 'Fri', num: '13' },
                { date: '2026-11-14', day: 'Sat', num: '14' },
                { date: '2026-11-16', day: 'Mon', num: '16' },
                { date: '2026-11-17', day: 'Tue', num: '17' },
              ].map((d) => {
                const isSelected = selectedDate === d.date;
                return (
                  <button
                    key={d.date}
                    onClick={() => setSelectedDate(d.date)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-violet-600 bg-violet-50 text-violet-900 shadow-xs ring-2 ring-violet-500/20'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <span className="text-[11px] uppercase font-semibold text-neutral-400 block">
                      {d.day}
                    </span>
                    <span className="text-lg font-bold font-heading block mt-0.5">{d.num}</span>
                    <span className="text-[10px] text-neutral-500 block">Nov</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Date Input Fallback */}
            <div className="pt-2 flex items-center gap-3 text-xs">
              <span className="text-neutral-500">Or pick another date:</span>
              <input
                type="date"
                value={selectedDate}
                min="2026-11-02"
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-2 border border-neutral-200 rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-900 text-xs font-semibold"
              >
                Change Service
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <span>Select Time Slot</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SELECT TIME SLOT */}
        {currentStep === 3 && (
          <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-6 shadow-xs">
            <div>
              <h2 className="text-lg font-bold font-heading text-neutral-900">
                Choose Available Time Slot
              </h2>
              <p className="text-xs text-neutral-500">
                For {selectedDate} ({selectedService?.durationMinutes} minutes session)
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableSlots.map((slot) => {
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-violet-600 bg-violet-600 text-white shadow-xs'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800'
                    }`}
                  >
                    <span className="text-sm font-bold font-mono block">{slot}</span>
                    <span
                      className={`text-[10px] mt-0.5 block ${
                        isSelected ? 'text-violet-100' : 'text-neutral-400'
                      }`}
                    >
                      Available
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-900 text-xs font-semibold"
              >
                Back to Date
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <span>Enter Your Information</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ENTER CUSTOMER DETAILS */}
        {currentStep === 4 && (
          <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-6 shadow-xs">
            <div>
              <h2 className="text-lg font-bold font-heading text-neutral-900">
                Your Contact Information
              </h2>
              <p className="text-xs text-neutral-500">
                No account or app download required. We will send your booking confirmation via WhatsApp.
              </p>
            </div>

            <div className="space-y-4 text-xs max-w-xl">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  placeholder="E.g. Pamela Osamudiame"
                  className="w-full p-2.5 border border-neutral-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Phone Number (WhatsApp Active) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  placeholder="+234 803 123 4567"
                  className="w-full p-2.5 border border-neutral-200 rounded-lg font-mono text-xs"
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Used to receive appointment updates, directions, and reminder texts.
                </span>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  placeholder="pamela@example.com"
                  className="w-full p-2.5 border border-neutral-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Special Requests / Notes
                </label>
                <textarea
                  rows={3}
                  value={customerInfo.specialRequests}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, specialRequests: e.target.value })
                  }
                  placeholder="Let Adunni know about skin sensitivities, lash preferences, or event themes..."
                  className="w-full p-2.5 border border-neutral-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-900 text-xs font-semibold"
              >
                Back to Time
              </button>
              <button
                onClick={() => {
                  if (!customerInfo.name.trim()) {
                    showToast('Please enter your full name', 'warning');
                    return;
                  }
                  if (customerInfo.phone.trim().length < 8) {
                    showToast('Please enter a valid phone number', 'warning');
                    return;
                  }
                  setCurrentStep(5);
                }}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <span>Review Booking</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW BOOKING INFORMATION & POLICIES & COUPON */}
        {currentStep === 5 && selectedService && (
          <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-6 shadow-xs">
            <div>
              <h2 className="text-lg font-bold font-heading text-neutral-900">
                Review Your Appointment Details
              </h2>
              <p className="text-xs text-neutral-500">
                Please verify service, schedule, and cancellation policies before proceeding to deposit
              </p>
            </div>

            {/* Appointment Summary Box */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">Service</span>
                  <h3 className="text-base font-bold text-neutral-900">{selectedService.name}</h3>
                  <span className="text-neutral-500">{selectedService.durationMinutes} minutes session</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">Total Price</span>
                  <div className="text-lg font-bold text-neutral-900 font-heading">
                    {formatNaira(selectedService.price)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-200">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">Date & Time</span>
                  <p className="font-semibold text-neutral-900">{selectedDate}</p>
                  <p className="text-neutral-500">{selectedTime}</p>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">Location</span>
                  <p className="font-semibold text-neutral-900">{profile.location.split(',')[0]}</p>
                  <p className="text-neutral-500">{profile.fullAddress}</p>
                </div>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="p-4 border border-neutral-200 rounded-xl space-y-3 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                <Tag className="w-4 h-4 text-violet-600" />
                <span>Have a Promo or Coupon Code?</span>
              </div>

              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    placeholder="E.g. FIRSTGLOW, WARRIBEAUTY"
                    className="p-2 border border-neutral-200 rounded-lg uppercase font-mono text-xs flex-1 max-w-xs focus:outline-none focus:border-violet-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Apply Code
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold font-mono">{appliedCoupon.code}</span> applied:
                      <span className="ml-1 font-semibold">
                        -{formatNaira(appliedCoupon.discountAmount)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {couponError}
                </p>
              )}

              <p className="text-[11px] text-neutral-400">
                Demo code tip: Try <span className="font-mono font-semibold text-neutral-700">FIRSTGLOW</span> for 10% off.
              </p>
            </div>

            {/* Stylist Policies Disclosure */}
            <div className="p-4 bg-violet-50/50 border border-violet-100 rounded-xl space-y-2 text-xs text-neutral-700">
              <span className="font-bold text-violet-900 block">Salon Policies & Payment Terms</span>
              <p className="text-[11px] leading-relaxed">
                <span className="font-semibold text-neutral-900">Cancellation Policy: </span>
                {profile.cancellationPolicy}
              </p>
              <p className="text-[11px] leading-relaxed">
                <span className="font-semibold text-neutral-900">Deposit Requirement: </span>
                {profile.paymentTerms}
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-900 text-xs font-semibold"
              >
                Back to Details
              </button>
              <button
                onClick={() => setCurrentStep(6)}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <span>Proceed to Payment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: PAYMENT & CHECKOUT */}
        {currentStep === 6 && selectedService && (
          <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-6 shadow-xs">
            <div>
              <h2 className="text-lg font-bold font-heading text-neutral-900">
                Secure Simulated Checkout
              </h2>
              <p className="text-xs text-neutral-500">
                Lock your appointment slot by paying the required booking deposit
              </p>
            </div>

            {/* Price & Balance breakdown */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-neutral-600 font-sans">
                <span>Service Price:</span>
                <span className="font-mono font-medium text-neutral-900">{formatNaira(originalPrice)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-sans">
                  <span>Coupon Discount ({appliedCoupon?.code}):</span>
                  <span className="font-mono font-bold">-{formatNaira(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600 font-sans">
                <span>Checkout Processing Fee:</span>
                <span className="font-mono text-emerald-700 font-medium">₦0 (Free)</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm font-bold text-violet-900 font-sans">
                <span>Deposit Payable Now:</span>
                <span className="font-mono">{formatNaira(totalDueNow)}</span>
              </div>

              <div className="flex justify-between text-[11px] text-amber-700 pt-1 font-sans font-medium">
                <span>Remaining Balance Due on Arrival:</span>
                <span className="font-mono font-bold">{formatNaira(balancePayableLater)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-neutral-700 block">
                Select Payment Method
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {[
                  { id: 'Debit Card', label: 'Debit Card', icon: CreditCard, desc: 'Mastercard, Visa, Verve' },
                  { id: 'Bank Transfer', label: 'Bank Transfer', icon: Building, desc: 'Direct NUBAN transfer' },
                  { id: 'USSD', label: 'Pay with USSD', icon: Phone, desc: '*737#, *894#, *966#' },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-violet-600 bg-violet-50 text-violet-900 shadow-xs ring-2 ring-violet-500/20'
                          : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-violet-600' : 'text-neutral-500'}`} />
                        <span className="font-bold">{m.label}</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1">{m.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prototype Payment Notice */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                Demo Sandbox: Real card/bank accounts are not debited. Clicking Pay now will simulate an instant successful transaction.
              </span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
              <button
                onClick={() => setCurrentStep(5)}
                disabled={isProcessingPayment}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-900 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={handleCompletePayment}
                disabled={isProcessingPayment}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing {formatNaira(totalDueNow)}...</span>
                  </>
                ) : (
                  <>
                    <span>Pay Deposit of {formatNaira(totalDueNow)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: BOOKING CONFIRMATION & RECEIPT */}
        {currentStep === 7 && (
          <div className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs text-center max-w-xl mx-auto">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded border border-violet-200">
                {completedBookingRef}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900 pt-2">
                Booking Confirmed!
              </h2>
              <p className="text-xs text-neutral-500">
                Thank you, {customerInfo.name || 'Valued Client'}. Your appointment slot is securely locked with Glow by Adunni.
              </p>
            </div>

            {/* Summary Ticket */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-xs text-left space-y-3 font-mono">
              <div className="flex justify-between pb-2 border-b border-neutral-200 font-sans">
                <span className="text-neutral-500">Stylist:</span>
                <span className="font-semibold text-neutral-900">{profile.businessName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-neutral-200 font-sans">
                <span className="text-neutral-500">Service:</span>
                <span className="font-semibold text-neutral-900">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-neutral-200">
                <span className="text-neutral-500 font-sans">Schedule:</span>
                <span className="font-semibold text-neutral-900 font-sans">{selectedDate} at {selectedTime}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-neutral-200">
                <span className="text-neutral-500 font-sans">Deposit Paid ({paymentMethod}):</span>
                <span className="font-bold text-emerald-700">+{formatNaira(depositPayableNow)}</span>
              </div>
              <div className="flex justify-between text-amber-800 font-bold font-sans">
                <span>Balance Due at Salon:</span>
                <span className="font-mono">{formatNaira(balancePayableLater)}</span>
              </div>
            </div>

            {/* WhatsApp simulated confirmation notice */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs text-left flex items-start gap-2.5">
              <MessageCircle className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <span className="font-bold block">WhatsApp Confirmation Sent</span>
                <span className="text-[11px] text-emerald-700">
                  A receipt and calendar invite has been simulated to {customerInfo.phone}.
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/dashboard/bookings"
                className="w-full sm:w-auto px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span>View in Stylist Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => {
                  setCurrentStep(1);
                  setAppliedCoupon(null);
                  setCustomerInfo({ name: '', phone: '+234 ', email: '', specialRequests: '' });
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Public Page Footer with Studio Links */}
      <footer className="mt-12 text-center text-xs text-neutral-500 max-w-xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-1">
          <Link to="/" className="font-semibold text-neutral-700 hover:text-neutral-900 transition-colors">
            Powered by Studio
          </Link>
          <span>·</span>
          <Link to="/create-account" className="text-violet-600 hover:text-violet-700 font-medium hover:underline transition-colors">
            Are you a stylist? Create your free booking link
          </Link>
        </div>
        <p className="text-[11px] text-neutral-400">
          Accept client deposits, manage your calendar & eliminate no-shows across Nigeria.
        </p>
      </footer>
    </div>
  );
};
