import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiCalendar, FiUsers, FiClock } from 'react-icons/fi';

const salesData = {
  daily: [
    { name: 'Mon', orders: 32, revenue: 420 },
    { name: 'Tue', orders: 28, revenue: 380 },
    { name: 'Wed', orders: 45, revenue: 610 },
    { name: 'Thu', orders: 38, revenue: 520 },
    { name: 'Fri', orders: 52, revenue: 720 },
    { name: 'Sat', orders: 65, revenue: 890 },
    { name: 'Sun', orders: 58, revenue: 780 },
  ],
  weekly: [
    { name: 'W1', orders: 245, revenue: 3450 },
    { name: 'W2', orders: 280, revenue: 4100 },
    { name: 'W3', orders: 310, revenue: 4560 },
    { name: 'W4', orders: 290, revenue: 4320 },
  ],
  monthly: [
    { name: 'Jan', orders: 980, revenue: 14200 },
    { name: 'Feb', orders: 1050, revenue: 15300 },
    { name: 'Mar', orders: 1200, revenue: 17800 },
    { name: 'Apr', orders: 1150, revenue: 16500 },
    { name: 'May', orders: 1350, revenue: 19200 },
    { name: 'Jun', orders: 1280, revenue: 18500 },
  ],
};

const popularItems = [
  { name: 'Chicken Biryani', orders: 342 },
  { name: 'Butter Chicken', orders: 289 },
  { name: 'Garlic Naan', orders: 245 },
  { name: 'Dal Makhani', orders: 198 },
  { name: 'Gulab Jamun', orders: 156 },
];

const revenueBreakdown = [
  { name: 'Food', value: 65 },
  { name: 'Beverages', value: 20 },
  { name: 'Desserts', value: 10 },
  { name: 'Others', value: 5 },
];

const COLORS = ['#f97316', '#3b82f6', '#22c55e', '#a855f7'];

const customerInsights = [
  { name: 'Mon', new: 12, returning: 28 },
  { name: 'Tue', new: 8, returning: 25 },
  { name: 'Wed', new: 15, returning: 32 },
  { name: 'Thu', new: 10, returning: 30 },
  { name: 'Fri', new: 18, returning: 38 },
  { name: 'Sat', new: 22, returning: 42 },
  { name: 'Sun', new: 20, returning: 40 },
];

const peakHours = [
  { hour: '8AM', orders: 5 }, { hour: '9AM', orders: 8 }, { hour: '10AM', orders: 12 },
  { hour: '11AM', orders: 18 }, { hour: '12PM', orders: 35 }, { hour: '1PM', orders: 42 },
  { hour: '2PM', orders: 28 }, { hour: '3PM', orders: 15 }, { hour: '4PM', orders: 10 },
  { hour: '5PM', orders: 14 }, { hour: '6PM', orders: 25 }, { hour: '7PM', orders: 38 },
  { hour: '8PM', orders: 45 }, { hour: '9PM', orders: 32 }, { hour: '10PM', orders: 18 },
];

export default function VendorAnalytics() {
  const [period, setPeriod] = useState('daily');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {['daily', 'weekly', 'monthly'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${
                period === p ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>{p}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData[period]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={2} name="Orders" dot={{ fill: '#f97316' }} />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue ($)" dot={{ fill: '#3b82f6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Items</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={popularItems} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={120} />
              <Tooltip />
              <Bar dataKey="orders" fill="#f97316" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Breakdown</h3>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="60%" height={250}>
              <PieChart>
                <Pie data={revenueBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                  {revenueBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {revenueBreakdown.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-medium text-gray-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Insights</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={customerInsights}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="new" fill="#22c55e" name="New Customers" radius={[4, 4, 0, 0]} />
              <Bar dataKey="returning" fill="#f97316" name="Returning Customers" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FiClock className="text-orange-500" /> Peak Hours Analysis</h3>
        <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-15 gap-2">
          {peakHours.map((ph, idx) => {
            const intensity = ph.orders / 45;
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div className="w-full rounded-md transition-all duration-200 hover:scale-105"
                  style={{ height: `${Math.max(20, intensity * 100)}px`, backgroundColor: `rgba(249, 115, 22, ${Math.max(0.15, intensity)})` }} />
                <span className="text-[10px] text-gray-500">{ph.hour}</span>
                <span className="text-[10px] font-medium text-gray-700">{ph.orders}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-5 text-white">
          <FiUsers className="text-2xl opacity-80" />
          <p className="text-3xl font-bold mt-2">156</p>
          <p className="text-sm opacity-80">Total Customers (30d)</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-5 text-white">
          <FiClock className="text-2xl opacity-80" />
          <p className="text-3xl font-bold mt-2">24min</p>
          <p className="text-sm opacity-80">Avg Preparation Time</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white">
          <FiCalendar className="text-2xl opacity-80" />
          <p className="text-3xl font-bold mt-2">94%</p>
          <p className="text-sm opacity-80">Order Fulfillment Rate</p>
        </div>
      </div>
    </div>
  );
}
