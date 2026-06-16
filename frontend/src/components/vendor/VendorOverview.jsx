import { useState, useEffect } from 'react';
import { FiShoppingBag, FiCoffee, FiStar, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { FaDollarSign } from 'react-icons/fa';

const initialStats = [
  { id: 1, label: "Today's Orders", value: '42', icon: FiShoppingBag, color: 'bg-blue-500', trend: 12, trendUp: true },
  { id: 2, label: 'Revenue', value: '$1,847', icon: FaDollarSign, color: 'bg-green-500', trend: 8, trendUp: true },
  { id: 3, label: 'Active Items', value: '68', icon: FiCoffee, color: 'bg-orange-500', trend: 3, trendUp: true },
  { id: 4, label: 'Avg Rating', value: '4.7', icon: FiStar, color: 'bg-purple-500', trend: 2, trendUp: false },
];

const recentOrders = [
  { id: '#1234', customer: 'John Doe', items: '2 items', amount: '$24.50', status: 'New' },
  { id: '#1233', customer: 'Jane Smith', items: '3 items', amount: '$36.75', status: 'Preparing' },
  { id: '#1232', customer: 'Bob Wilson', items: '1 item', amount: '$12.00', status: 'Out for Delivery' },
  { id: '#1231', customer: 'Alice Brown', items: '4 items', amount: '$48.20', status: 'Completed' },
];

export default function VendorOverview() {
  const [stats] = useState(initialStats);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{greeting}, Vendor!</h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your restaurant today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`text-xl ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                stat.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.trendUp ? <FiTrendingUp /> : <FiTrendingDown />}
                {stat.trend}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-3">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{order.id} - {order.customer}</p>
                  <p className="text-xs text-gray-500">{order.items} • {order.amount}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  order.status === 'New' ? 'bg-blue-50 text-blue-600' :
                  order.status === 'Preparing' ? 'bg-yellow-50 text-yellow-600' :
                  order.status === 'Out for Delivery' ? 'bg-purple-50 text-purple-600' :
                  'bg-green-50 text-green-600'
                }`}>{order.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Menu Item', color: 'bg-orange-500' },
              { label: 'View Orders', color: 'bg-blue-500' },
              { label: 'Check Analytics', color: 'bg-green-500' },
              { label: 'Update Profile', color: 'bg-purple-500' },
            ].map((action, idx) => (
              <button key={idx} className={`${action.color} text-white rounded-lg py-3 px-4 text-sm font-medium hover:opacity-90 transition-opacity`}>
                {action.label}
              </button>
            ))}
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100">
            <p className="text-sm font-medium text-orange-800">💡 Tip: Items with photos sell 65% more!</p>
            <p className="text-xs text-orange-600 mt-1">Add images to your menu items to boost orders.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
