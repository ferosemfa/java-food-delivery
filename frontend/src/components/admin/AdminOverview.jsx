import { useState, useEffect } from 'react';
import { FiShoppingBag, FiUsers, FiStar, FiTrendingUp, FiTrendingDown, FiClock } from 'react-icons/fi';
import { FaDollarSign } from 'react-icons/fa';

const stats = [
  { id: 1, label: 'Total Orders', value: '45,678', sub: 'Today: 342 / Month: 8,945', icon: FiShoppingBag, color: 'from-blue-500 to-blue-600', trend: 12.5, trendUp: true },
  { id: 2, label: 'Revenue', value: '$1,245,678', sub: 'Today: $12,450 / Month: $289K', icon: FaDollarSign, color: 'from-green-500 to-green-600', trend: 8.3, trendUp: true },
  { id: 3, label: 'Active Users', value: '12,458', sub: '+342 new today', icon: FiUsers, color: 'from-purple-500 to-purple-600', trend: 5.2, trendUp: true },
  { id: 4, label: 'Active Vendors', value: '186', sub: '12 pending approval', icon: FiStar, color: 'from-orange-500 to-orange-600', trend: -2.1, trendUp: false },
  { id: 5, label: 'Avg Order Value', value: '$27.50', sub: '+$2.10 vs last month', icon: FaDollarSign, color: 'from-rose-500 to-rose-600', trend: 6.8, trendUp: true },
];

const recentActivities = [
  { action: 'New vendor registered', detail: 'Tandoori Express - Indian cuisine', time: '2 min ago', type: 'vendor' },
  { action: 'Order #ORD-4521 completed', detail: '$34.50 - Chicken Biryani', time: '5 min ago', type: 'order' },
  { action: 'Dispute raised #DSP-089', detail: 'Late delivery - Priority', time: '12 min ago', type: 'dispute' },
  { action: 'Payment processed', detail: 'Vendor payout - $12,450', time: '18 min ago', type: 'payment' },
  { action: 'New user signup', detail: 'Rajesh Kumar - Bangalore', time: '25 min ago', type: 'user' },
];

export default function AdminOverview() {
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
        <h1 className="text-2xl font-bold text-gray-800">{greeting}, Admin!</h1>
        <p className="text-gray-500 mt-1">Here's your platform overview for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10 shadow-sm`}>
                <stat.icon className="text-white text-lg" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                stat.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.trendUp ? <FiTrendingUp /> : <FiTrendingDown />}
                {Math.abs(stat.trend)}%
              </span>
            </div>
            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Platform Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((act, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div className={`p-2 rounded-lg ${
                  act.type === 'vendor' ? 'bg-orange-50' :
                  act.type === 'order' ? 'bg-blue-50' :
                  act.type === 'dispute' ? 'bg-red-50' :
                  act.type === 'payment' ? 'bg-green-50' : 'bg-purple-50'
                }`}>
                  <FiClock className={`text-sm ${
                    act.type === 'vendor' ? 'text-orange-500' :
                    act.type === 'order' ? 'text-blue-500' :
                    act.type === 'dispute' ? 'text-red-500' :
                    act.type === 'payment' ? 'text-green-500' : 'text-purple-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{act.action}</p>
                  <p className="text-xs text-gray-500">{act.detail}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Review Vendors', color: 'bg-orange-500', count: '12' },
              { label: 'Pending Disputes', color: 'bg-red-500', count: '3' },
              { label: 'Moderate Content', color: 'bg-blue-500', count: '8' },
              { label: 'Generate Reports', color: 'bg-green-500' },
              { label: 'Manage Drivers', color: 'bg-purple-500' },
              { label: 'View Analytics', color: 'bg-indigo-500' },
            ].map((action, idx) => (
              <button key={idx} className={`${action.color} text-white rounded-lg py-3 px-4 text-sm font-medium hover:opacity-90 transition-opacity relative text-left`}>
                {action.label}
                {action.count && <span className="absolute top-1 right-1 bg-white bg-opacity-30 text-xs rounded-full w-5 h-5 flex items-center justify-center">{action.count}</span>}
              </button>
            ))}
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
            <p className="text-sm font-medium text-indigo-800">📊 Platform Growth: 15.2% this quarter</p>
            <p className="text-xs text-indigo-600 mt-1">Revenue and user base are both showing strong growth trends.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
