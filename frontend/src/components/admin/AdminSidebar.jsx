import { NavLink } from 'react-router-dom';
import {
  FiGrid, FiUsers, FiShoppingBag, FiFileText,
  FiShield, FiBarChart2, FiClipboard, FiTruck, FiPercent, FiSettings, FiActivity
} from 'react-icons/fi';
import { FaDollarSign } from 'react-icons/fa';

const navItems = [
  { to: '/admin', icon: FiGrid, label: 'Dashboard', end: true },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
  { to: '/admin/vendors', icon: FiShoppingBag, label: 'Vendors' },
  { to: '/admin/orders', icon: FiFileText, label: 'Orders' },
  { to: '/admin/payments', icon: FaDollarSign, label: 'Payments' },
  { to: '/admin/content', icon: FiShield, label: 'Content' },
  { to: '/admin/disputes', icon: FiClipboard, label: 'Disputes' },
  { to: '/admin/analytics', icon: FiBarChart2, label: 'Analytics' },
  { to: '/admin/reports', icon: FiBarChart2, label: 'Reports' },
  { to: '/admin/drivers', icon: FiTruck, label: 'Drivers' },
  { to: '/admin/promotions', icon: FiPercent, label: 'Promotions' },
  { to: '/admin/health', icon: FiActivity, label: 'Health' },
  { to: '/admin/settings', icon: FiSettings, label: 'Settings' },
];

export default function AdminSidebar({ open, setOpen }) {
  return (
    <aside className={`fixed left-0 top-0 h-full bg-gray-800 border-r border-gray-700 shadow-xl z-40 transition-all duration-300 ${open ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center gap-3 px-4 h-16 border-b border-gray-700">
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">AD</span>
        </div>
        {open && <span className="text-lg font-bold text-white whitespace-nowrap">Admin Panel</span>}
      </div>
      <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <item.icon className="text-xl flex-shrink-0" />
            {open && <span className="whitespace-nowrap">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      {!open && (
        <button onClick={() => setOpen(true)} className="absolute -right-3 top-20 bg-gray-700 border border-gray-600 rounded-full p-1 shadow-md text-gray-400 hover:text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
        </button>
      )}
      {open && (
        <button onClick={() => setOpen(false)} className="absolute -right-3 top-20 bg-gray-700 border border-gray-600 rounded-full p-1 shadow-md text-gray-400 hover:text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
        </button>
      )}
    </aside>
  );
}
