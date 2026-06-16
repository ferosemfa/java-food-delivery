import { useState } from 'react';
import { FiTruck, FiStar, FiMapPin, FiPhone, FiSearch, FiCheck, FiX, FiClock } from 'react-icons/fi';

const initialDrivers = [
  { id: 1, name: 'Suresh Kumar', phone: '+91 9988776655', vehicle: 'Hero Splendor', plate: 'KA-01-AB-1234', zone: 'Indira Nagar', status: 'Available', rating: 4.8, deliveries: 1245, online: true },
  { id: 2, name: 'Mohan Raj', phone: '+91 8877665544', vehicle: 'Honda Activa', plate: 'KA-02-CD-5678', zone: 'Koramangala', status: 'On Delivery', rating: 4.6, deliveries: 980, online: true },
  { id: 3, name: 'Deepak Singh', phone: '+91 7766554433', vehicle: 'Bajaj Pulsar', plate: 'KA-03-EF-9012', zone: 'MG Road', status: 'Available', rating: 4.9, deliveries: 1567, online: true },
  { id: 4, name: 'Ramesh Gupta', phone: '+91 6655443322', vehicle: 'TVS Jupiter', plate: 'KA-04-GH-3456', zone: 'Whitefield', status: 'Offline', rating: 4.2, deliveries: 450, online: false },
  { id: 5, name: 'Vijay Patil', phone: '+91 5544332211', vehicle: 'Hero HF Deluxe', plate: 'KA-05-IJ-7890', zone: 'JP Nagar', status: 'On Delivery', rating: 4.5, deliveries: 780, online: true },
  { id: 6, name: 'Arun Nair', phone: '+91 4433221100', vehicle: 'Honda Dio', plate: 'KA-06-KL-1234', zone: 'HSR Layout', status: 'Available', rating: 4.7, deliveries: 1100, online: true },
];

export default function DriverManagement() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = drivers.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.zone.toLowerCase().includes(search.toLowerCase()) || d.plate.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || d.status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleToggleOnline = (id) => {
    setDrivers(drivers.map(d => d.id === id ? { ...d, online: !d.online, status: d.status === 'Offline' ? 'Available' : 'Offline' } : d));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Driver Management</h1>
        <span className="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
          {drivers.filter(d => d.online).length} online / {drivers.length} total
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search drivers, zones, or plates..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="flex gap-2">
          {['all', 'available', 'on delivery', 'offline'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 text-sm font-medium rounded-lg capitalize ${
                filter === f ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(driver => (
          <div key={driver.id} className={`bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow ${!driver.online && 'opacity-60'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                  driver.online ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  {driver.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{driver.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <FiStar className="text-yellow-400 text-xs fill-yellow-400" />
                    <span className="text-xs font-medium text-gray-600">{driver.rating}</span>
                    <span className="text-xs text-gray-400">({driver.deliveries} deliveries)</span>
                  </div>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${driver.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2"><FiPhone className="text-xs" /> {driver.phone}</p>
              <p className="flex items-center gap-2"><FiTruck className="text-xs" /> {driver.vehicle} ({driver.plate})</p>
              <p className="flex items-center gap-2"><FiMapPin className="text-xs" /> {driver.zone}</p>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                driver.status === 'Available' ? 'bg-green-50 text-green-600' :
                driver.status === 'On Delivery' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
              }`}>{driver.status}</span>
              <button onClick={() => handleToggleOnline(driver.id)}
                className={`ml-auto text-xs font-medium px-3 py-1.5 rounded-lg ${
                  driver.online ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}>
                {driver.online ? 'Go Offline' : 'Go Online'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
