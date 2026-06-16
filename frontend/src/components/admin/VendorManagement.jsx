import { useState } from 'react';
import { FiSearch, FiCheck, FiX, FiEye, FiStar, FiShield } from 'react-icons/fi';

const vendors = [
  { id: 1, name: 'Spice Kitchen', owner: 'Rajesh Kumar', email: 'rajesh@spicekitchen.com', phone: '+91 9876543210', cuisine: 'North Indian', status: 'Active', verified: true, rating: 4.7, orders: 1458, joined: '2025-08-15' },
  { id: 2, name: 'Pizza Planet', owner: 'Amit Shah', email: 'amit@pizzaplanet.com', phone: '+91 8765432109', cuisine: 'Italian', status: 'Active', verified: true, rating: 4.5, orders: 982, joined: '2025-10-20' },
  { id: 3, name: 'Dragon Wok', owner: 'Li Wei', email: 'li@dragonwok.com', phone: '+91 7654321098', cuisine: 'Chinese', status: 'Pending', verified: false, rating: 0, orders: 0, joined: '2026-06-10' },
  { id: 4, name: 'Tandoori Express', owner: 'Gurpreet Singh', email: 'gurpreet@tandooriexpress.com', phone: '+91 6543210987', cuisine: 'Mughlai', status: 'Pending', verified: false, rating: 0, orders: 0, joined: '2026-06-12' },
  { id: 5, name: 'Sweet Bengal', owner: 'Ananya Das', email: 'ananya@sweetbengal.com', phone: '+91 5432109876', cuisine: 'Bengali', status: 'Suspended', verified: true, rating: 3.2, orders: 124, joined: '2025-12-01' },
  { id: 6, name: 'South Spice', owner: 'Mohan Rao', email: 'mohan@southspice.com', phone: '+91 4321098765', cuisine: 'South Indian', status: 'Active', verified: true, rating: 4.8, orders: 2100, joined: '2025-06-01' },
];

export default function VendorManagement() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [vendorList, setVendorList] = useState(vendors);

  const filtered = vendorList.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.owner.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || v.status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleStatus = (id, newStatus) => {
    setVendorList(vendorList.map(v => v.id === id ? { ...v, status: newStatus } : v));
  };

  const handleVerify = (id) => {
    setVendorList(vendorList.map(v => v.id === id ? { ...v, verified: !v.verified } : v));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-50 text-green-600';
      case 'Pending': return 'bg-yellow-50 text-yellow-600';
      case 'Suspended': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Vendor Management</h1>
        <span className="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border shadow-sm">{vendorList.length} vendors</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search vendors or owners..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'pending', 'suspended'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 text-sm font-medium rounded-lg capitalize ${
                filter === f ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Vendor</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Owner</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Cuisine</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Rating</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Orders</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Verified</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(vendor => (
              <tr key={vendor.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {vendor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{vendor.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-gray-800">{vendor.owner}</p>
                  <p className="text-xs text-gray-500">{vendor.email}</p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{vendor.cuisine}</td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-gray-800">{vendor.rating > 0 ? vendor.rating : '-'}</span>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{vendor.orders.toLocaleString()}</td>
                <td className="px-4 py-3">
                  {vendor.verified ? (
                    <FiShield className="text-green-500 text-lg" title="Verified" />
                  ) : (
                    <FiShield className="text-gray-300 text-lg" title="Not Verified" />
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(vendor.status)}`}>{vendor.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {vendor.status === 'Pending' && (
                      <>
                        <button onClick={() => handleStatus(vendor.id, 'Active')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Approve"><FiCheck /></button>
                        <button onClick={() => handleStatus(vendor.id, 'Suspended')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Reject"><FiX /></button>
                      </>
                    )}
                    {vendor.status === 'Active' && (
                      <button onClick={() => handleStatus(vendor.id, 'Suspended')} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg" title="Suspend"><FiX /></button>
                    )}
                    {vendor.status === 'Suspended' && (
                      <button onClick={() => handleStatus(vendor.id, 'Active')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Reactivate"><FiCheck /></button>
                    )}
                    <button onClick={() => handleVerify(vendor.id)} className={`p-1.5 rounded-lg ${vendor.verified ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`} title={vendor.verified ? 'Unverify' : 'Verify'}>
                      <FiShield />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
