import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminOverview from '../../components/admin/AdminOverview';
import UserManagement from '../../components/admin/UserManagement';
import VendorManagement from '../../components/admin/VendorManagement';
import ContentModeration from '../../components/admin/ContentModeration';
import DisputeResolution from '../../components/admin/DisputeResolution';
import AdminAnalytics from '../../components/admin/AdminAnalytics';
import ReportsDashboard from '../../components/admin/ReportsDashboard';
import PaymentManagement from '../../components/admin/PaymentManagement';
import DriverManagement from '../../components/admin/DriverManagement';
import SystemHealth from '../../components/admin/SystemHealth';
import PromotionCampaigns from '../../components/admin/PromotionCampaigns';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white text-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <h2 className="text-xl font-semibold text-white">Admin Panel</h2>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">5</span>
              </button>
              <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm">A</div>
            </div>
          </div>
        </header>
        <div className="p-6 bg-gray-50 min-h-screen">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="vendors" element={<VendorManagement />} />
            <Route path="orders" element={<div className="text-center py-12 text-gray-500">Order Management - Coming Soon</div>} />
            <Route path="payments" element={<PaymentManagement />} />
            <Route path="content" element={<ContentModeration />} />
            <Route path="disputes" element={<DisputeResolution />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="reports" element={<ReportsDashboard />} />
            <Route path="drivers" element={<DriverManagement />} />
            <Route path="promotions" element={<PromotionCampaigns />} />
            <Route path="settings" element={<div className="text-center py-12 text-gray-500">Admin Settings - Coming Soon</div>} />
            <Route path="health" element={<SystemHealth />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
