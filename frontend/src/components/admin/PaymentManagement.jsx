import { useState } from 'react';
import { FaDollarSign } from 'react-icons/fa';
import { FiSearch, FiDownload, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

const transactions = [
  { id: '#TXN-8921', vendor: 'Spice Kitchen', amount: 1250.00, commission: 187.50, net: 1062.50, method: 'UPI', status: 'Completed', date: '2026-06-16', time: '10:30 AM' },
  { id: '#TXN-8920', vendor: 'Pizza Planet', amount: 890.00, commission: 133.50, net: 756.50, method: 'Card', status: 'Completed', date: '2026-06-16', time: '09:45 AM' },
  { id: '#TXN-8919', vendor: 'South Spice', amount: 1560.00, commission: 234.00, net: 1326.00, method: 'UPI', status: 'Pending', date: '2026-06-16', time: '08:15 AM' },
  { id: '#TXN-8918', vendor: 'Sweet Bengal', amount: 340.00, commission: 51.00, net: 289.00, method: 'Wallet', status: 'Failed', date: '2026-06-15', time: '11:20 PM' },
  { id: '#TXN-8917', vendor: 'Dragon Wok', amount: 675.00, commission: 101.25, net: 573.75, method: 'UPI', status: 'Completed', date: '2026-06-15', time: '10:00 PM' },
  { id: '#TXN-8916', vendor: 'Tandoori Express', amount: 920.00, commission: 138.00, net: 782.00, method: 'Card', status: 'Completed', date: '2026-06-15', time: '08:30 PM' },
];

const pendingPayouts = [
  { vendor: 'Spice Kitchen', amount: 4250.00, period: 'Jun 1-15, 2026', due: '2026-06-20' },
  { vendor: 'South Spice', amount: 3800.00, period: 'Jun 1-15, 2026', due: '2026-06-20' },
  { vendor: 'Pizza Planet', amount: 2900.00, period: 'Jun 1-15, 2026', due: '2026-06-20' },
];

export default function PaymentManagement() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('transactions');
  const [txnList] = useState(transactions);

  const filtered = txnList.filter(t =>
    t.vendor.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = txnList.reduce((sum, t) => sum + t.amount, 0);
  const totalCommission = txnList.reduce((sum, t) => sum + t.commission, 0);
  const pendingAmount = pendingPayouts.reduce((sum, p) => sum + p.amount, 0);

  const getStatusColor = (s) => {
    switch (s) {
      case 'Completed': return 'bg-green-50 text-green-600';
      case 'Pending': return 'bg-yellow-50 text-yellow-600';
      case 'Failed': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusIcon = (s) => {
    switch (s) {
      case 'Completed': return <FiCheckCircle className="text-green-500" />;
      case 'Pending': return <FiClock className="text-yellow-500" />;
      case 'Failed': return <FiXCircle className="text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Payment Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-80">Total Revenue</p>
          <p className="text-2xl font-bold mt-1">${totalRevenue.toLocaleString()}</p>
          <p className="text-xs opacity-70">Last 24 hours</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-80">Commission Earned</p>
          <p className="text-2xl font-bold mt-1">${totalCommission.toLocaleString()}</p>
          <p className="text-xs opacity-70">15% avg commission</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-80">Pending Payouts</p>
          <p className="text-2xl font-bold mt-1">${pendingAmount.toLocaleString()}</p>
          <p className="text-xs opacity-70">{pendingPayouts.length} vendors</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-80">Transactions</p>
          <p className="text-2xl font-bold mt-1">{txnList.length}</p>
          <p className="text-xs opacity-70">Today</p>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {['transactions', 'payouts'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg capitalize transition-all ${
              tab === t ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>{t}</button>
        ))}
      </div>

      {tab === 'transactions' && (
        <>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by ID or vendor..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full max-w-md" />
          </div>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Transaction ID</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Vendor</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Commission</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Net</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Method</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(txn => (
                  <tr key={txn.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{txn.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{txn.vendor}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">${txn.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">${txn.commission.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-green-600">${txn.net.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{txn.method}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(txn.status)}`}>
                        {getStatusIcon(txn.status)} {txn.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{txn.date}<br /><span className="text-xs">{txn.time}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'payouts' && (
        <div className="space-y-3">
          {pendingPayouts.map((payout, idx) => (
            <div key={idx} className="bg-white rounded-xl border shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-green-50 rounded-lg">
                    <FaDollarSign className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{payout.vendor}</h3>
                    <p className="text-xs text-gray-500">Period: {payout.period}</p>
                    <p className="text-xs text-gray-500">Due: {payout.due}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">${payout.amount.toLocaleString()}</p>
                  <button className="mt-2 bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1">
                    <FiCheckCircle /> Process Payout
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
