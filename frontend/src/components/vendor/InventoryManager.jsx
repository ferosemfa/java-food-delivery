import { useState } from 'react';
import { FiPackage, FiAlertTriangle, FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';

const initialInventory = [
  { id: 1, name: 'Basmati Rice', category: 'Grains', stock: 25, unit: 'kg', minStock: 10, cost: 2.5 },
  { id: 2, name: 'Chicken Breast', category: 'Meat', stock: 15, unit: 'kg', minStock: 10, cost: 8.0 },
  { id: 3, name: 'Tomatoes', category: 'Vegetables', stock: 5, unit: 'kg', minStock: 8, cost: 1.2 },
  { id: 4, name: 'Onions', category: 'Vegetables', stock: 3, unit: 'kg', minStock: 5, cost: 0.8 },
  { id: 5, name: 'Butter', category: 'Dairy', stock: 12, unit: 'kg', minStock: 5, cost: 4.5 },
  { id: 6, name: 'Cream', category: 'Dairy', stock: 2, unit: 'liters', minStock: 5, cost: 3.0 },
  { id: 7, name: 'Spices Mix', category: 'Spices', stock: 8, unit: 'kg', minStock: 3, cost: 6.0 },
  { id: 8, name: 'Cooking Oil', category: 'Oils', stock: 20, unit: 'liters', minStock: 10, cost: 2.0 },
];

export default function InventoryManager() {
  const [inventory, setInventory] = useState(initialInventory);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const filtered = inventory.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockItems = inventory.filter(i => i.stock <= i.minStock);

  const handleDelete = (id) => {
    if (window.confirm('Delete this item?')) setInventory(inventory.filter(i => i.id !== id));
  };

  const handleSave = (form) => {
    if (editItem) {
      setInventory(inventory.map(i => i.id === editItem.id ? { ...i, ...form } : i));
    } else {
      setInventory([...inventory, { ...form, id: Date.now() }]);
    }
    setShowModal(false);
    setEditItem(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center gap-2">
          <FiPlus /> Add Item
        </button>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <FiAlertTriangle className="text-lg" />
            <span className="font-semibold">Low Stock Alert</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map(item => (
              <span key={item.id} className="bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {item.name} ({item.stock} {item.unit})
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search inventory..." value={search} onChange={e => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full max-w-md" />
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Item</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Category</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Stock</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Min Stock</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Cost/Unit</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(item => {
              const status = item.stock <= item.minStock ? 'Low' : item.stock <= item.minStock * 2 ? 'Medium' : 'Good';
              const statusColor = status === 'Good' ? 'bg-green-50 text-green-600' : status === 'Medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600';
              const barWidth = Math.min(100, (item.stock / (item.minStock * 3)) * 100);
              const barColor = status === 'Good' ? 'bg-green-500' : status === 'Medium' ? 'bg-yellow-500' : 'bg-red-500';

              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center"><FiPackage className="text-gray-500" /></div>
                      <span className="text-sm font-medium text-gray-800">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800">{item.stock}</span>
                      <span className="text-xs text-gray-400">{item.unit}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${barWidth}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.minStock} {item.unit}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">${item.cost.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor}`}>{status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setEditItem(item); setShowModal(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg mr-1"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <InventoryModal item={editItem} onSave={handleSave} onClose={() => { setShowModal(false); setEditItem(null); }} />
      )}
    </div>
  );
}

function InventoryModal({ item, onSave, onClose }) {
  const [form, setForm] = useState(item || { name: '', category: 'Grains', stock: '', unit: 'kg', minStock: '', cost: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      stock: parseFloat(form.stock),
      minStock: parseFloat(form.minStock),
      cost: parseFloat(form.cost),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{item ? 'Edit Item' : 'Add Inventory Item'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX className="text-xl" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option>Grains</option><option>Meat</option><option>Vegetables</option>
                <option>Dairy</option><option>Spices</option><option>Oils</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option>kg</option><option>liters</option><option>pieces</option><option>packs</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input type="number" min="0" step="0.1" required value={form.stock} onChange={e => setForm({...form, stock: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
              <input type="number" min="0" step="0.1" required value={form.minStock} onChange={e => setForm({...form, minStock: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost/Unit ($)</label>
              <input type="number" min="0" step="0.01" required value={form.cost} onChange={e => setForm({...form, cost: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">{item ? 'Update' : 'Add'} Item</button>
          </div>
        </form>
      </div>
    </div>
  );
}
