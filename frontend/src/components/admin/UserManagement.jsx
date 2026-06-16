import { useState } from 'react';
import { FiSearch, FiFilter, FiCheck, FiX, FiAlertCircle, FiEye, FiChevronDown } from 'react-icons/fi';

const users = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@email.com', phone: '+91 9876543210', location: 'Bangalore', orders: 24, joined: '2026-01-15', status: 'Active' },
  { id: 2, name: 'Priya Patel', email: 'priya@email.com', phone: '+91 8765432109', location: 'Mumbai', orders: 18, joined: '2026-02-20', status: 'Active' },
  { id: 3, name: 'Amit Kumar', email: 'amit@email.com', phone: '+91 7654321098', location: 'Delhi', orders: 3, joined: '2026-05-10', status: 'Pending' },
  { id: 4, name: 'Neha Singh', email: 'neha@email.com', phone: '+91 6543210987', location: 'Pune', orders: 0, joined: '2026-06-01', status: 'Suspended' },
  { id: 5, name: 'Vikram Reddy', email: 'vikram@email.com', phone: '+91 5432109876', location: 'Hyderabad', orders: 42, joined: '2025-11-05', status: 'Active' },
  { id: 6, name: 'Ananya Gupta', email: 'ananya@email.com', phone: '+91 4321098765', location: 'Chennai', orders: 7, joined: '2026-04-18', status: 'Active' },
  { id: 7, name: 'Ravi Verma', email: 'ravi@email.com', phone: '+91 3210987654', location: 'Kolkata', orders: 1, joined: '2026-06-10', status: 'Pending' },
];

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [userList, setUserList] = useState(users);

  const filtered = userList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || u.status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleStatus = (id, newStatus) => {
    setUserList(userList.map(u => u.id === id ? { ...u, status: newStatus } : u));
  };

  const [expandedId, setExpandedId] = useState(null);

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
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <span className="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border shadow-sm">{userList.length} total users</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
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
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">User</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Location</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Orders</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Joined</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.location}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{user.orders}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{user.joined}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(user.status)}`}>{user.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {user.status === 'Pending' && (
                      <>
                        <button onClick={() => handleStatus(user.id, 'Active')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Approve"><FiCheck /></button>
                        <button onClick={() => handleStatus(user.id, 'Suspended')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Reject"><FiX /></button>
                      </>
                    )}
                    {user.status === 'Active' && (
                      <button onClick={() => handleStatus(user.id, 'Suspended')} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg" title="Suspend"><FiAlertCircle /></button>
                    )}
                    {user.status === 'Suspended' && (
                      <button onClick={() => handleStatus(user.id, 'Active')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Reactivate"><FiCheck /></button>
                    )}
                    <button onClick={() => setExpandedId(expandedId === user.id ? null : user.id)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg">
                      <FiEye />
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
