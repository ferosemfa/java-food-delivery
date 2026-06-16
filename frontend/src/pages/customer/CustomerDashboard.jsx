import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiPackage, FiUser, FiHeart, FiPercent } from 'react-icons/fi';
import RestaurantList from '../../components/customer/RestaurantList';
import Cart from '../../components/customer/Cart';
import Checkout from '../../components/customer/Checkout';
import OrderTracking from '../../components/customer/OrderTracking';
import OrderHistory from '../../components/customer/OrderHistory';
import FavoritesList from '../../components/customer/FavoritesList';
import OffersCarousel from '../../components/customer/OffersCarousel';
import AccountPage from '../../components/customer/AccountPage';
import SearchFilters from '../../components/customer/SearchFilters';
import MenuList from '../../components/customer/MenuList';

const navItems = [
  { id: 'home', label: 'Home', icon: FiHome, path: '/customer' },
  { id: 'search', label: 'Search', icon: FiSearch, path: '/customer/search' },
  { id: 'orders', label: 'Orders', icon: FiPackage, path: '/customer/orders' },
  { id: 'account', label: 'Account', icon: FiUser, path: '/customer/account' },
];

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const currentPath = location.pathname;
  const activeTab = navItems.find((item) => {
    if (item.path === '/customer') return currentPath === '/customer';
    return currentPath.startsWith(item.path);
  })?.id || 'home';

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, delta) => {
    setCartItems((prev) => {
      return prev
        .map((i) => i.id === itemId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)
        .filter((i) => i.quantity > 0);
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const clearCart = () => setCartItems([]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6">
        <Routes>
          <Route index element={
            <>
              <OffersCarousel />
              <div className="mt-6">
                <RestaurantList addToCart={addToCart} />
              </div>
            </>
          } />
          <Route path="search" element={<SearchFilters addToCart={addToCart} />} />
          <Route path="restaurant/:id" element={<MenuList addToCart={addToCart} />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="track/:id" element={<OrderTracking />} />
          <Route path="favorites" element={<FavoritesList addToCart={addToCart} />} />
          <Route path="offers" element={<OffersCarousel />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="checkout" element={
            <Checkout cartItems={cartItems} clearCart={clearCart} />
          } />
        </Routes>
      </div>

      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeFromCart}
        onCheckout={() => {
          setCartOpen(false);
          navigate('/customer/checkout');
        }}
      />

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = item.id === activeTab;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 relative ${
                  isActive ? 'text-brand-500' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {item.id === 'orders' && item.icon === FiPackage && (
                  <div className="relative">
                    <item.icon size={20} />
                  </div>
                )}
                {item.id !== 'orders' && <item.icon size={20} />}
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-1 bg-brand-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
