import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FiMapPin, FiTrendingUp, FiUsers } from 'react-icons/fi';

const performanceData = [
  { name: 'Jan', orders: 4500, revenue: 125000 },
  { name: 'Feb', orders: 5200, revenue: 142000 },
  { name: 'Mar', orders: 5800, revenue: 158000 },
  { name: 'Apr', orders: 6100, revenue: 172000 },
  { name: 'May', orders: 6500, revenue: 185000 },
  { name: 'Jun', orders: 7200, revenue: 210000 },
];

const vendorComparison = [
  { name: 'Spice Kitchen', orders: 2450, revenue: 65200 },
  { name: 'Pizza Planet', orders: 1820, revenue: 48000 },
  { name: 'South Spice', orders: 2100, revenue: 58500 },
  { name: 'Sweet Bengal', orders: 920, revenue: 23500 },
  { name: 'Dragon Wok', orders: 1100, revenue: 28000 },
];

const topCategories = [
  { name: 'Biryani', value: 28 },
  { name: 'Curry', value: 22 },
  { name: 'Bread', value: 15 },
  { name: 'Desserts', value: 12 },
  { name: 'Beverages', value: 10 },
  { name: 'Starters', value: 8 },
  { name: 'Rice', value: 5 },
];

const userGrowth = [
  { name: 'Jan', customers: 12000, vendors: 120 },
  { name: 'Feb', customers: 13500, vendors: 135 },
  { name: 'Mar', customers: 14800, vendors: 148 },
  { name: 'Apr', customers: 16200, vendors: 160 },
  { name: 'May', customers: 17800, vendors: 175 },
  { name: 'Jun', customers: 19200, vendors: 186 },
];

const geographicData = [
  { city: 'Bangalore', orders: 12500, color: 'bg-indigo-500' },
  { city: 'Mumbai', orders: 9800, color: 'bg-purple-500' },
  { city: 'Delhi', orders: 8500, color: 'bg-pink-500' },
  { city: 'Hyderabad', orders: 7200, color: 'bg-blue-500' },
  { city: 'Pune', orders: 5400, color: 'bg-teal-500' },
  { city: 'Chennai', orders: 4800, color: 'bg-cyan-500' },
  { city: 'Kolkata', orders: 3200, color: 'bg-orange-500' },
];

export default function AdminAnalytics() {
  const maxOrders = Math.max(...geographicData.map(d => d.orders));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Platform Analytics</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={2} name="Orders" dot={{ fill: '#f97316' }} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue ($)" dot={{ fill: '#3b82f6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Vendor Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vendorComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#f97316" name="Orders" radius={[4, 4, 0, 0]} />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FiMapPin className="text-indigo-500" /> Geographic Distribution</h3>
          <div className="space-y-3">
            {geographicData.map((city, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="w-24 text-sm text-gray-600">{city.city}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div className={`h-full rounded-full ${city.color} transition-all duration-500`}
                    style={{ width: `${(city.orders / maxOrders) * 100}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-800 w-20 text-right">{city.orders.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCategories} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={90} />
              <Tooltip />
              <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]} barSize={20} name="% of Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FiTrendingUp className="text-green-500" /> User Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={userGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="customers" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} name="Customers" />
            <Area type="monotone" dataKey="vendors" stroke="#f97316" fill="#f97316" fillOpacity={0.1} strokeWidth={2} name="Vendors" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
