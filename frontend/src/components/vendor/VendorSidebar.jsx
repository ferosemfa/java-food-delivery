import { NavLink } from 'react-router-dom';
import { FiGrid, FiBook, FiPackage, FiBarChart2, FiStar, FiMessageSquare, FiPercent, FiBox, FiSettings } from 'react-icons/fi';

const navItems = [
  { to: '/vendor', icon: FiGrid, label: 'Dashboard', end: true },
  { to: '/vendor/menu', icon: FiBook, label: 'Menu' },
  { to: '/vendor/orders', icon: FiPackage, label: 'Orders' },
  { to: '/vendor/analytics', icon: FiBarChart2, label: 'Analytics' },
  { to: '/vendor/reviews', icon: FiStar, label: 'Reviews' },
  { to: '/vendor/messages', icon: FiMessageSquare, label: 'Messages' },
  { to: '/vendor/promotions', icon: FiPercent, label: 'Promotions' },
  { to: '/vendor/inventory', icon: FiBox, label: 'Inventory' },
  { to: '/vendor/settings', icon: FiSettings, label: 'Settings' },
];

export default function VendorSidebar({ open, setOpen }) {
  return (
    <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm z-40 transition-all duration-300 ${open ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center gap-3 px-4 h-16 border-b border-gray-200">
        <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">FD</span>
        </div>
        {open && <span className="text-lg font-bold text-gray-800 whitespace-nowrap">FoodDelivery</span>}
      </div>
      <nav className="p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-orange-50 text-orange-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="text-xl flex-shrink-0" />
            {open && <span className="whitespace-nowrap">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      {!open && (
        <button onClick={() => setOpen(true)} className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-md text-gray-400 hover:text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
        </button>
      )}
      {open && (
        <button onClick={() => setOpen(false)} className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-md text-gray-400 hover:text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
        </button>
      )}
    </aside>
  );
}
