import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiLogOut, FiPackage, FiHeart, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onCartClick, cartItemsCount = 0 }) {
  const { user, isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/customer/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    ...(isAuthenticated && role === 'CUSTOMER' ? [{ to: '/customer', label: 'Dashboard' }] : []),
    ...(isAuthenticated && role === 'VENDOR' ? [{ to: '/vendor', label: 'Vendor Panel' }] : []),
    ...(isAuthenticated && role === 'ADMIN' ? [{ to: '/admin', label: 'Admin Panel' }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="text-2xl">🍕</span>
              <span className="text-xl font-bold bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                Azlaan
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-brand-500 rounded-lg hover:bg-brand-50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurants or dishes..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            {isAuthenticated && role === 'CUSTOMER' && (
              <button
                onClick={onCartClick}
                className="relative p-2.5 text-gray-600 hover:text-brand-500 hover:bg-brand-50 rounded-full transition-colors"
                aria-label="Cart"
              >
                <FiShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </button>
            )}

            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 text-gray-600 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-brand-600">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium">{user?.name || 'User'}</span>
                  <FiChevronDown size={14} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user?.email || ''}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-brand-50 text-brand-600 text-xs font-medium rounded-full capitalize">
                        {role?.toLowerCase() || 'user'}
                      </span>
                    </div>
                    <div className="py-1">
                      <Link to="/customer/account" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <FiUser size={16} /> Profile
                      </Link>
                      <Link to="/customer/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <FiPackage size={16} /> Orders
                      </Link>
                      <Link to="/customer/favorites" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <FiHeart size={16} /> Favorites
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                        <FiLogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Log In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-gray-600 hover:text-brand-500 rounded-lg">
              {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-slide-down">
          <div className="px-4 py-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:bg-white focus:border-brand-500"
                />
              </div>
            </form>
          </div>
          <div className="pb-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-brand-500 hover:bg-brand-50"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
