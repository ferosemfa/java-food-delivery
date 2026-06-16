import { useState } from 'react';
import { FiAlertCircle, FiCheck, FiX, FiMessageSquare, FiSend, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const initialDisputes = [
  { id: '#DSP-089', customer: 'Rahul Sharma', vendor: 'Spice Kitchen', type: 'Late Delivery', description: 'Order arrived 45 minutes late. Food was cold.', status: 'Open', priority: 'High', date: '2026-06-16', messages: [
    { from: 'customer', text: 'My order arrived very late and food was cold', time: '10:30 AM' },
    { from: 'vendor', text: 'We apologize. There was heavy traffic.', time: '10:35 AM' },
  ]},
  { id: '#DSP-088', customer: 'Priya Patel', vendor: 'Pizza Planet', type: 'Wrong Item', description: 'Received Veg Pizza instead of Chicken Pizza ordered.', status: 'Open', priority: 'Medium', date: '2026-06-15', messages: [
    { from: 'customer', text: 'I ordered Chicken Pizza but got Veg Pizza', time: '7:15 PM' },
  ]},
  { id: '#DSP-087', customer: 'Amit Kumar', vendor: 'Sweet Bengal', type: 'Refund Issue', description: 'Requested refund but not processed yet.', status: 'Resolved', priority: 'Low', date: '2026-06-14', messages: [] },
  { id: '#DSP-086', customer: 'Neha Singh', vendor: 'South Spice', type: 'Quality Issue', description: 'Food quality was very poor. Items were undercooked.', status: 'In Review', priority: 'High', date: '2026-06-13', messages: [] },
];

export default function DisputeResolution() {
  const [disputes, setDisputes] = useState(initialDisputes);
  const [expanded, setExpanded] = useState(null);
  const [newMessages, setNewMessages] = useState({});

  const handleSendMessage = (id) => {
    if (!newMessages[id]?.trim()) return;
    setDisputes(disputes.map(d => d.id === id ? {
      ...d,
      messages: [...d.messages, { from: 'admin', text: newMessages[id], time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
    } : d));
    setNewMessages({...newMessages, [id]: ''});
  };

  const handleResolve = (id, resolution) => {
    setDisputes(disputes.map(d => d.id === id ? { ...d, status: resolution, resolution: 'Dispute resolved by admin' } : d));
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'High': return 'bg-red-50 text-red-600';
      case 'Medium': return 'bg-yellow-50 text-yellow-600';
      case 'Low': return 'bg-green-50 text-green-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusColor = (s) => {
    switch (s) {
      case 'Open': return 'bg-red-50 text-red-600';
      case 'In Review': return 'bg-yellow-50 text-yellow-600';
      case 'Resolved': return 'bg-green-50 text-green-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dispute Resolution</h1>
        <span className="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
          {disputes.filter(d => d.status !== 'Resolved').length} open disputes
        </span>
      </div>

      <div className="space-y-3">
        {disputes.map(dispute => (
          <div key={dispute.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-5 cursor-pointer" onClick={() => setExpanded(expanded === dispute.id ? null : dispute.id)}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-lg ${dispute.priority === 'High' ? 'bg-red-50' : dispute.priority === 'Medium' ? 'bg-yellow-50' : 'bg-green-50'}`}>
                    <FiAlertCircle className={`text-lg ${dispute.priority === 'High' ? 'text-red-500' : dispute.priority === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{dispute.id}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPriorityColor(dispute.priority)}`}>{dispute.priority}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(dispute.status)}`}>{dispute.status}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{dispute.type} - {dispute.customer} vs {dispute.vendor}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{dispute.date}</p>
                  </div>
                </div>
                <div className="text-gray-400">
                  {expanded === dispute.id ? <FiChevronUp /> : <FiChevronDown />}
                </div>
              </div>
            </div>

            {expanded === dispute.id && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-700 mb-4"><strong>Description:</strong> {dispute.description}</p>

                {dispute.messages.length > 0 && (
                  <div className="mb-4 space-y-2 bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                    {dispute.messages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                          msg.from === 'admin' ? 'bg-indigo-500 text-white rounded-br-md' :
                          msg.from === 'vendor' ? 'bg-orange-100 text-gray-800' :
                          'bg-white text-gray-800 border border-gray-200'
                        }`}>
                          <p className="text-xs font-medium opacity-70 mb-0.5 capitalize">{msg.from}</p>
                          <p>{msg.text}</p>
                          <p className="text-[10px] opacity-70 mt-1">{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mb-4">
                  <input type="text" placeholder="Type a message..." value={newMessages[dispute.id] || ''} onChange={e => setNewMessages({...newMessages, [dispute.id]: e.target.value})}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage(dispute.id)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <button onClick={() => handleSendMessage(dispute.id)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 flex items-center gap-1">
                    <FiSend /> Send
                  </button>
                </div>

                {dispute.status !== 'Resolved' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleResolve(dispute.id, 'Resolved')} className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 flex items-center justify-center gap-1">
                      <FiCheck /> Resolve in Favor of Customer
                    </button>
                    <button onClick={() => handleResolve(dispute.id, 'Resolved')} className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center justify-center gap-1">
                      <FiCheck /> Resolve in Favor of Vendor
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
