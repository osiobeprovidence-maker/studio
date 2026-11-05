/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StudioProvider } from './context/StudioContext';
import { AdminProvider } from './context/AdminContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { BookingsPage } from './pages/dashboard/BookingsPage';
import { ServicesPage } from './pages/dashboard/ServicesPage';
import { ClientsPage } from './pages/dashboard/ClientsPage';
import { PaymentsPage } from './pages/dashboard/PaymentsPage';
import { CouponsPage } from './pages/dashboard/CouponsPage';
import { ReferralsPage } from './pages/dashboard/ReferralsPage';
import { NotificationsPage } from './pages/dashboard/NotificationsPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';
import { PublicBookingPage } from './pages/public/PublicBookingPage';
import { LandingPage } from './pages/public/LandingPage';
import { CreateAccountPage } from './pages/public/CreateAccountPage';
import { LoginPage } from './pages/public/LoginPage';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminStylistsPage } from './pages/admin/AdminStylistsPage';
import { AdminTransactionsPage } from './pages/admin/AdminTransactionsPage';
import { AdminPayoutsPage } from './pages/admin/AdminPayoutsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export default function App() {
  return (
    <StudioProvider>
      <AdminProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Marketing Landing Page */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<LandingPage />} />

            {/* Authentication & Stylist Onboarding */}
            <Route path="/create-account" element={<CreateAccountPage />} />
            <Route path="/signup" element={<CreateAccountPage />} />
            <Route path="/register" element={<CreateAccountPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signin" element={<LoginPage />} />

            {/* Stylist Dashboard Routes wrapped in DashboardLayout */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard/overview" replace />} />
              <Route path="overview" element={<OverviewPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="coupons" element={<CouponsPage />} />
              <Route path="referrals" element={<ReferralsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Super Admin Control Center Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/overview" replace />} />
              <Route path="overview" element={<AdminOverviewPage />} />
              <Route path="stylists" element={<AdminStylistsPage />} />
              <Route path="transactions" element={<AdminTransactionsPage />} />
              <Route path="payouts" element={<AdminPayoutsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Public Customer Booking Page (Shareable link for stylist) */}
            <Route path="/book" element={<PublicBookingPage />} />
            <Route path="/:slug" element={<PublicBookingPage />} />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </StudioProvider>
  );
}
