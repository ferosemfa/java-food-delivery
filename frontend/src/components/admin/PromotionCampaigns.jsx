import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiPercent, FiCalendar, FiUsers, FiBarChart2, FiX, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const campaigns = [
  { id: 1, name: 'Summer Feast 2026', type: 'Discount', discount: 25, budget: 50000, spent: 28500, target: 'All Users', starts: '2026-06-01', ends: '2026-07-31', status: 'Active', reach: 24500, conversions: 3200 },
  { id: 2, name: 'New User Welcome', type: 'Flat Discount', discount: 100, budget: 25000, spent: 18200, target: 'New Users', starts: '2026-05-15', ends: '2026-08-15', status: 'Active', reach: 8900, conversions: 1800 },
  { id: 3, name: 'Monsoon Special', type: 'Free Delivery', discount: 0, budget: 15000, spent: 15000, target: 'All Users', starts: '2026-06-10', ends: '2026-06-20', status: 'Ended', reach: 12000, conversions: 1500 },
  { id: 4, name: 'Referral Bonus', type: 'Credit', discount: 50, budget: 10000, spent: 4500, target: 'Existing Users', starts: '2026-06-15', ends: '2026-07-15', status: 'Scheduled', reach: 0, conversions: 0 },
];

export default function PromotionCampaigns() {
  const [campaignList, setCampaignList] = useState(campaigns);
  const [showModal, setShowModal] = useState(false);
  const [editCampaign, setEditCampaign] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm('Delete this campaign?')) setCampaignList(campaignList.filter(c => c.id !== id));
  };

  const handleToggle = (id) => {
    setCampaignList(campaignList.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Paused' : 'Active' } : c));
  };

  const handleSave = (form) => {
    if (editCampaign) {
      setCampaignList(campaignList.map(c => c.id === editCampaign.id ? { ...c, ...form } : c));
    } else {
      setCampaignList([...campaignList, { ...form, id: Date.now(), reach: 0, conversions: 0, spent: 0 }]);
    }
    setShowModal(false);
    setEditCampaign(null);
  };

  const getStatusColor = (s) => {
    switch (s) {
      case 'Active': return 'bg-green-50 text-green-600';
      case 'Paused': return 'bg-yellow-50 text-yellow-600';
      case 'Ended': return 'bg-gray-100 text-gray-500';
      case 'Scheduled': return 'bg-blue-50 text-blue-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Promotion Campaigns</h1>
        <button onClick={() => { setEditCampaign(null); setShowModal(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
          <FiPlus /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {campaignList.map(campaign => (
          <div key={campaign.id} className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-indigo-50 rounded-lg">
                  <FiPercent className="text-indigo-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{campaign.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{campaign.type} • {campaign.target}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(campaign.status)}`}>{campaign.status}</span>
                    {campaign.discount > 0 && (
                      <span className="text-xs text-indigo-600 font-medium">{campaign.discount}% OFF</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleToggle(campaign.id)} className={`p-1.5 rounded-lg ${campaign.status === 'Active' ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}>
                  {campaign.status === 'Active' ? <FiToggleRight /> : <FiToggleLeft />}
                </button>
                <button onClick={() => { setEditCampaign(campaign); setShowModal(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><FiEdit2 /></button>
                <button onClick={() => handleDelete(campaign.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Budget</p>
                <p className="text-sm font-bold text-gray-800">₹{campaign.budget.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Spent: ₹{campaign.spent.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Reach</p>
                <p className="text-sm font-bold text-gray-800">{campaign.reach.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Conversions</p>
                <p className="text-sm font-bold text-gray-800">{campaign.conversions.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{campaign.reach > 0 ? ((campaign.conversions / campaign.reach) * 100).toFixed(1) : 0}% rate</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <FiCalendar /> {campaign.starts} → {campaign.ends}
              <span className="ml-auto">
                {campaign.budget > 0 ? ((campaign.spent / campaign.budget) * 100).toFixed(0) : 0}% budget used
              </span>
            </div>
            <div className="mt-1 w-full bg-gray-100 rounded-full h-1.5">
              <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <CampaignModal campaign={editCampaign} onSave={handleSave} onClose={() => { setShowModal(false); setEditCampaign(null); }} />
      )}
    </div>
  );
}

function CampaignModal({ campaign, onSave, onClose }) {
  const [form, setForm] = useState(campaign || {
    name: '', type: 'Discount', discount: '', budget: '', target: 'All Users', starts: '', ends: '', status: 'Scheduled'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, discount: parseInt(form.discount), budget: parseFloat(form.budget) });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{campaign ? 'Edit Campaign' : 'New Campaign'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX className="text-xl" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
            <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Summer Feast" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Discount</option><option>Flat Discount</option><option>Free Delivery</option><option>Credit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
              <input type="number" min="0" max="100" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
              <input type="number" min="0" required value={form.budget} onChange={e => setForm({...form, budget: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
              <select value={form.target} onChange={e => setForm({...form, target: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>All Users</option><option>New Users</option><option>Existing Users</option><option>High Value</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" required value={form.starts} onChange={e => setForm({...form, starts: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" required value={form.ends} onChange={e => setForm({...form, ends: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">{campaign ? 'Update' : 'Create'} Campaign</button>
          </div>
        </form>
      </div>
    </div>
  );
}
