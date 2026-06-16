import { useState } from 'react';
import { FiClock, FiCheck, FiX, FiPackage, FiTruck, FiCheckCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const tabs = ['New', 'Preparing', 'Out for Delivery', 'Completed', 'Cancelled'];

const initialOrders = [
  { id: '#ORD-1245', customer: 'Rahul Sharma', items: [{ name: 'Chicken Biryani', qty: 2 }, { name: 'Raita', qty: 1 }], total: 28.97, status: 'New', time: '2 mins ago', address: '123, MG Road, Bangalore' },
  { id: '#ORD-1244', customer: 'Priya Patel', items: [{ name: 'Butter Chicken', qty: 1 }, { name: 'Garlic Naan', qty: 3 }], total: 24.96, status: 'New', time: '5 mins ago', address: '456, Indira Nagar, Bangalore' },
  { id: '#ORD-1243', customer: 'Amit Kumar', items: [{ name: 'Dal Makhani', qty: 1 }, { name: 'Tandoori Roti', qty: 2 }], total: 14.97, status: 'Preparing', time: '12 mins ago', address: '789, Koramangala, Bangalore' },
  { id: '#ORD-1242', customer: 'Neha Singh', items: [{ name: 'Chicken Biryani', qty: 1 }], total: 12.99, status: 'Preparing', time: '18 mins ago', address: '321, Whitefield, Bangalore' },
  { id: '#ORD-1241', customer: 'Vikram Reddy', items: [{ name: 'Paneer Butter Masala', qty: 2 }, { name: 'Naan', qty: 4 }], total: 34.98, status: 'Out for Delivery', time: '25 mins ago', address: '654, Electronic City, Bangalore' },
  { id: '#ORD-1240', customer: 'Ananya Gupta', items: [{ name: 'Biryani', qty: 1 }, { name: 'Gulab Jamun', qty: 2 }], total: 18.97, status: 'Completed', time: '45 mins ago', address: '987, JP Nagar, Bangalore' },
  { id: '#ORD-1239', customer: 'Ravi Verma', items: [{ name: 'Chicken Curry', qty: 1 }], total: 10.99, status: 'Cancelled', time: '1 hr ago', address: '147, HSR Layout, Bangalore' },
];

const statusFlow = ['New', 'Preparing', 'Out for Delivery', 'Completed'];

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState('New');
  const [orders, setOrders] = useState(initialOrders);
  const [expanded, setExpanded] = useState(null);

  const filteredOrders = orders.filter(o => o.status === activeTab);

  const handleAccept = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'Preparing' } : o));
  };

  const handleReject = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o));
  };

  const handleNextStatus = (id) => {
    setOrders(orders.map(o => {
      if (o.id !== id) return o;
      const idx = statusFlow.indexOf(o.status);
      return idx < statusFlow.length - 1 ? { ...o, status: statusFlow[idx + 1] } : o;
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'New': return <FiClock className="text-blue-500" />;
      case 'Preparing': return <FiPackage className="text-yellow-500" />;
      case 'Out for Delivery': return <FiTruck className="text-purple-500" />;
      case 'Completed': return <FiCheckCircle className="text-green-500" />;
      case 'Cancelled': return <FiX className="text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-50 text-blue-600';
      case 'Preparing': return 'bg-yellow-50 text-yellow-600';
      case 'Out for Delivery': return 'bg-purple-50 text-purple-600';
      case 'Completed': return 'bg-green-50 text-green-600';
      case 'Cancelled': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
        <span className="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
          {orders.filter(o => o.status === 'New').length} new orders
        </span>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            <span className="hidden sm:inline">{tab}</span>
            <span className="sm:hidden text-xs">{tab.split(' ')[0]}</span>
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-500'
            }`}>{orders.filter(o => o.status === tab).length}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border shadow-sm">
            <FiPackage className="text-5xl text-gray-300 mx-auto" />
            <p className="text-gray-500 mt-3">No {activeTab.toLowerCase()} orders</p>
          </div>
        ) : filteredOrders.map(order => (
          <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-gray-50">{getStatusIcon(order.status)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{order.id}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>{order.status}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{order.customer}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{order.time} • {order.address}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">${order.total.toFixed(2)}</p>
                  <button onClick={() => setExpanded(expanded === order.id ? null : order.id)} className="text-xs text-orange-600 hover:text-orange-700 mt-1 flex items-center gap-1">
                    {expanded === order.id ? <><FiChevronUp /> Less</> : <><FiChevronDown /> Details</>}
                  </button>
                </div>
              </div>

              {expanded === order.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{item.name} <span className="text-gray-400">x{item.qty}</span></span>
                        <span className="text-gray-800 font-medium">${(order.items.reduce((a, b) => a + b.qty, 0) > 0 ? order.total : 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-3">
                {activeTab === 'New' && (
                  <>
                    <button onClick={() => handleAccept(order.id)} className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                      <FiCheck /> Accept
                    </button>
                    <button onClick={() => handleReject(order.id)} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                      <FiX /> Reject
                    </button>
                  </>
                )}
                {activeTab === 'Preparing' && (
                  <button onClick={() => handleNextStatus(order.id)} className="flex-1 bg-purple-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors flex items-center justify-center gap-2">
                    <FiTruck /> Mark as Out for Delivery
                  </button>
                )}
                {activeTab === 'Out for Delivery' && (
                  <button onClick={() => handleNextStatus(order.id)} className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                    <FiCheckCircle /> Mark as Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
