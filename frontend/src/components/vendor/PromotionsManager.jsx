import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiPercent, FiCalendar, FiTag, FiX, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const initialPromos = [
  { id: 1, name: 'Summer Special', type: 'percentage', value: 20, code: 'SUMMER20', minOrder: 299, starts: '2026-06-01', ends: '2026-07-31', active: true, used: 45 },
  { id: 2, name: 'Free Delivery', type: 'flat', value: 50, code: 'FREEDEL', minOrder: 399, starts: '2026-06-10', ends: '2026-06-30', active: true, used: 28 },
  { id: 3, name: 'Weekend Feast', type: 'percentage', value: 15, code: 'WEEKEND15', minOrder: 499, starts: '2026-06-01', ends: '2026-07-15', active: false, used: 12 },
];

export default function PromotionsManager() {
  const [promos, setPromos] = useState(initialPromos);
  const [showModal, setShowModal] = useState(false);
  const [editPromo, setEditPromo] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm('Delete this promotion?')) {
      setPromos(promos.filter(p => p.id !== id));
    }
  };

  const handleToggle = (id) => {
    setPromos(promos.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const handleSave = (form) => {
    if (editPromo) {
      setPromos(promos.map(p => p.id === editPromo.id ? { ...p, ...form } : p));
    } else {
      setPromos([...promos, { ...form, id: Date.now(), used: 0 }]);
    }
    setShowModal(false);
    setEditPromo(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Promotions & Offers</h1>
        <button onClick={() => { setEditPromo(null); setShowModal(true); }} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center gap-2">
          <FiPlus /> Create Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promos.map(promo => (
          <div key={promo.id} className={`bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow ${!promo.active && 'opacity-60'}`}>
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-green-50 rounded-lg">
                <FiPercent className="text-green-600 text-xl" />
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleToggle(promo.id)} className={`p-1.5 rounded-lg ${promo.active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}>
                  {promo.active ? <FiToggleRight /> : <FiToggleLeft />}
                </button>
                <button onClick={() => { setEditPromo(promo); setShowModal(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><FiEdit2 /></button>
                <button onClick={() => handleDelete(promo.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mt-3">{promo.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-orange-50 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-full">{promo.code}</span>
              <span className="text-xs text-gray-500">{promo.type === 'percentage' ? `${promo.value}% OFF` : `$${promo.value} OFF`}</span>
            </div>
            <div className="mt-3 space-y-1.5 text-sm text-gray-500">
              <p className="flex items-center gap-1"><FiCalendar className="text-xs" /> {promo.starts} to {promo.ends}</p>
              <p className="flex items-center gap-1"><FiTag className="text-xs" /> Min order: ${promo.minOrder}</p>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">{promo.used} uses</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${promo.active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                {promo.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <PromoModal promo={editPromo} onSave={handleSave} onClose={() => { setShowModal(false); setEditPromo(null); }} />
      )}
    </div>
  );
}

function PromoModal({ promo, onSave, onClose }) {
  const [form, setForm] = useState(promo || { name: '', type: 'percentage', value: '', code: '', minOrder: '', starts: '', ends: '', active: true });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      value: parseFloat(form.value),
      minOrder: parseFloat(form.minOrder),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{promo ? 'Edit Offer' : 'Create Offer'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX className="text-xl" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Offer Name</label>
            <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. Summer Special" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
              <input type="number" min="1" required value={form.value} onChange={e => setForm({...form, value: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder={form.type === 'percentage' ? '20' : '50'} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
              <input type="text" required value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase" placeholder="SUMMER20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Order ($)</label>
              <input type="number" min="0" required value={form.minOrder} onChange={e => setForm({...form, minOrder: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="299" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" required value={form.starts} onChange={e => setForm({...form, starts: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" required value={form.ends} onChange={e => setForm({...form, ends: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="active" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})}
              className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
            <label htmlFor="active" className="text-sm text-gray-700">Active</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">{promo ? 'Update' : 'Create'} Offer</button>
          </div>
        </form>
      </div>
    </div>
  );
}
