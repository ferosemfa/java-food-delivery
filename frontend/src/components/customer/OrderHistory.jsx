import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiChevronRight, FiRefreshCw, FiStar, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const sampleOrders = [
  { id: 'ORD-2024-001', restaurant: 'The Gourmet Kitchen', status: 'delivered', items: ['Truffle Pasta', 'Garlic Bread', 'Tiramisu'], total: 49.96, date: '2024-06-15T18:30:00', rating: 5, estimatedTime: '25 min', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop' },
  { id: 'ORD-2024-002', restaurant: 'Spice Garden', status: 'delivered', items: ['Butter Chicken', 'Naan', 'Biryani'], total: 36.50, date: '2024-06-14T19:45:00', rating: 4, estimatedTime: '20 min', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=100&h=100&fit=crop' },
  { id: 'ORD-2024-003', restaurant: 'The Burger House', status: 'cancelled', items: ['Double Cheeseburger', 'Fries', 'Milkshake'], total: 22.99, date: '2024-06-13T12:15:00', rating: null, estimatedTime: '15 min', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=100&h=100&fit=crop' },
  { id: 'ORD-2024-004', restaurant: 'Bella Napoli', status: 'delivered', items: ['Margherita Pizza', 'Caesar Salad'], total: 28.50, date: '2024-06-12T20:00:00', rating: 5, estimatedTime: '30 min', image: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?w=100&h=100&fit=crop' },
  { id: 'ORD-2024-005', restaurant: 'Sakura Sushi Bar', status: 'preparing', items: ['Dragon Roll', 'Miso Soup', 'Edamame'], total: 42.00, date: '2024-06-16T12:00:00', rating: null, estimatedTime: '25 min', image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=100&h=100&fit=crop' },
];

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      setOrders(sampleOrders);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredOrders = activeTab === 'all'
    ? orders
    : activeTab === 'active'
      ? orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled')
      : orders.filter((o) => o.status === activeTab);

  const handleReorder = (order) => {
    toast.success(`Re-ordering from ${order.restaurant}...`);
    setTimeout(() => {
      navigate(`/customer/restaurant/${order.id}`);
    }, 1000);
  };

  const handleTrack = (orderId) => {
    navigate(`/customer/track/${orderId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'badge-green';
      case 'preparing': return 'badge-yellow';
      case 'out_for_delivery': return 'badge-blue';
      case 'cancelled': return 'badge-red';
      default: return 'badge-blue';
    }
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading orders..." />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-brand-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiPackage size={32} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No orders found</h3>
          <p className="text-sm text-gray-500">{activeTab === 'all' ? 'You haven\'t placed any orders yet' : `No ${activeTab} orders`}</p>
          <button onClick={() => navigate('/customer')} className="btn-primary mt-4">Browse Restaurants</button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  <img src={order.image} alt={order.restaurant} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.restaurant}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <span className={`${getStatusColor(order.status)} capitalize text-xs`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 truncate">
                    {order.items.join(', ')}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900 text-sm">${order.total.toFixed(2)}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <FiClock size={12} /> {order.estimatedTime}
                      </span>
                    </div>
                    {order.rating && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <FiStar size={14} className="fill-current" />
                        <span className="text-xs font-medium">{order.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    {order.status === 'delivered' ? (
                      <>
                        <button onClick={() => handleReorder(order)} className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
                          <FiRefreshCw size={12} /> Re-order
                        </button>
                        <button className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
                          <FiStar size={12} /> Rate
                        </button>
                      </>
                    ) : order.status === 'cancelled' ? (
                      <button onClick={() => handleReorder(order)} className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
                        <FiRefreshCw size={12} /> Order Again
                      </button>
                    ) : (
                      <button onClick={() => handleTrack(order.id)} className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
                        Track Order
                      </button>
                    )}
                    <button onClick={() => navigate(`/customer/track/${order.id}`)} className="ml-auto text-gray-400 hover:text-gray-600 p-1">
                      <FiChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
