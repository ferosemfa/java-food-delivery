import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiGrid, FiList, FiToggleLeft, FiToggleRight, FiImage, FiX, FiSearch } from 'react-icons/fi';

const categories = ['All', 'Biryani', 'Curry', 'Bread', 'Rice', 'Desserts', 'Beverages', 'Starters'];

const initialMenuItems = [
  { id: 1, name: 'Chicken Biryani', description: 'Fragrant basmati rice with tender chicken', price: 12.99, category: 'Biryani', available: true, image: '' },
  { id: 2, name: 'Butter Chicken', description: 'Creamy tomato-based curry', price: 14.99, category: 'Curry', available: true, image: '' },
  { id: 3, name: 'Garlic Naan', description: 'Tandoor-baked leavened bread with garlic', price: 3.99, category: 'Bread', available: true, image: '' },
  { id: 4, name: 'Gulab Jamun', description: 'Deep-fried milk solid dumplings', price: 5.99, category: 'Desserts', available: false, image: '' },
  { id: 5, name: 'Mango Lassi', description: 'Yogurt-based mango drink', price: 4.99, category: 'Beverages', available: true, image: '' },
];

export default function MenuManagement() {
  const [items, setItems] = useState(initialMenuItems);
  const [view, setView] = useState('grid');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = items.filter(item =>
    (activeCategory === 'All' || item.category === activeCategory) &&
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const handleToggle = (id) => {
    setItems(items.map(i => i.id === id ? { ...i, available: !i.available } : i));
  };

  const handleSave = (form) => {
    if (editItem) {
      setItems(items.map(i => i.id === editItem.id ? { ...i, ...form } : i));
    } else {
      setItems([...items, { ...form, id: Date.now() }]);
    }
    setShowModal(false);
    setEditItem(null);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setShowModal(true);
  };

  const openAdd = () => {
    setEditItem(null);
    setShowModal(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-48" />
          </div>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}><FiGrid /></button>
            <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}><FiList /></button>
          </div>
          <button onClick={openAdd} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
            <FiPlus /> Add Item
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{cat}</button>
        ))}
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(item => (
            <div key={item.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow ${!item.available && 'opacity-60'}`}>
              <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <FiImage className="text-3xl text-gray-400" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>
                  </div>
                  <span className="text-sm font-bold text-orange-600">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <button onClick={() => handleToggle(item.id)} className={`text-sm flex items-center gap-1 ${item.available ? 'text-green-600' : 'text-gray-400'}`}>
                    {item.available ? <FiToggleRight className="text-lg" /> : <FiToggleLeft className="text-lg" />}
                    {item.available ? 'Available' : 'Unavailable'}
                  </button>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Item</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Category</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Price</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><FiImage className="text-gray-400" /></div>
                      <div><p className="text-sm font-medium text-gray-800">{item.name}</p><p className="text-xs text-gray-500">{item.description}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.category}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.available ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleToggle(item.id)} className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg mr-1"><FiToggleRight /></button>
                    <button onClick={() => openEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg mr-1"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <MenuItemModal item={editItem} onSave={handleSave} onClose={() => { setShowModal(false); setEditItem(null); }} />
      )}
    </div>
  );
}

function MenuItemModal({ item, onSave, onClose }) {
  const [form, setForm] = useState(item || { name: '', description: '', price: '', category: 'Biryani', available: true, image: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, price: parseFloat(form.price) });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{item ? 'Edit Item' : 'Add Menu Item'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX className="text-xl" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center justify-center h-32 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-orange-300 transition-colors">
            <div className="text-center">
              <FiImage className="text-2xl text-gray-400 mx-auto" />
              <p className="text-xs text-gray-500 mt-1">Click to upload image</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter item name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Describe the item" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input type="number" step="0.01" min="0" required value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="available" checked={form.available} onChange={e => setForm({...form, available: e.target.checked})}
              className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
            <label htmlFor="available" className="text-sm text-gray-700">Available</label>
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
