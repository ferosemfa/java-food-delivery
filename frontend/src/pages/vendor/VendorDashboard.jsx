import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import VendorSidebar from '../../components/vendor/VendorSidebar';
import VendorOverview from '../../components/vendor/VendorOverview';
import MenuManagement from '../../components/vendor/MenuManagement';
import OrderManagement from '../../components/vendor/OrderManagement';
import VendorAnalytics from '../../components/vendor/VendorAnalytics';
import ReviewsDisplay from '../../components/vendor/ReviewsDisplay';
import CustomerMessaging from '../../components/vendor/CustomerMessaging';
import PromotionsManager from '../../components/vendor/PromotionsManager';
import InventoryManager from '../../components/vendor/InventoryManager';
import VendorProfile from '../../components/vendor/VendorProfile';

export default function VendorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <VendorSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 hover:text-gray-900 text-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <h2 className="text-xl font-semibold text-gray-800">Vendor Dashboard</h2>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </button>
              <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm">V</div>
            </div>
          </div>
        </header>
        <div className="p-6">
          <Routes>
            <Route index element={<VendorOverview />} />
            <Route path="menu" element={<MenuManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="analytics" element={<VendorAnalytics />} />
            <Route path="reviews" element={<ReviewsDisplay />} />
            <Route path="messages" element={<CustomerMessaging />} />
            <Route path="promotions" element={<PromotionsManager />} />
            <Route path="inventory" element={<InventoryManager />} />
            <Route path="settings" element={<VendorProfile />} />
            <Route path="*" element={<Navigate to="/vendor" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
