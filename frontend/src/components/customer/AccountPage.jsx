import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMapPin, FiCreditCard, FiLogOut, FiChevronRight, FiPlus, FiEdit2, FiTrash2, FiSmartphone, FiPhone, FiMail, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const savedAddresses = [
  { id: 1, label: 'Home', address: '123 Main Street, Apt 4B, New York, NY 10001', isDefault: true },
  { id: 2, label: 'Work', address: '456 Business Ave, Suite 200, New York, NY 10002', isDefault: false },
];

const savedCards = [
  { id: 1, type: 'Visa', last4: '4242', exp: '12/26', isDefault: true },
  { id: 2, type: 'Mastercard', last4: '8888', exp: '08/25', isDefault: false },
];

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [addresses, setAddresses] = useState(savedAddresses);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', street: '', city: '', state: '', zip: '' });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddAddress = () => {
    if (!newAddress.label || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zip) {
      toast.error('Please fill all fields');
      return;
    }
    setAddresses((prev) => [...prev, { id: Date.now(), ...newAddress, isDefault: false }]);
    setNewAddress({ label: '', street: '', city: '', state: '', zip: '' });
    setShowAddAddress(false);
    toast.success('Address added successfully');
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'addresses', label: 'Saved Addresses', icon: FiMapPin },
    { id: 'payment', label: 'Payment Methods', icon: FiCreditCard },
    { id: 'security', label: 'Security', icon: FiShield },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-6">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeSection === section.id
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  {section.label}
                </button>
              );
            })}
            <hr className="my-2 border-gray-100" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
            >
              <FiLogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {activeSection === 'profile' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-brand-600">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user?.name || 'User'}</h2>
                  <p className="text-sm text-gray-500 capitalize">{user?.role || 'Customer'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Full Name</label>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2.5">
                      <FiUser size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-900">{user?.name || 'User'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Email</label>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2.5">
                      <FiMail size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-900">{user?.email || 'user@example.com'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Phone</label>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2.5">
                      <FiPhone size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-900">{user?.phone || '+1 (555) 000-0000'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Member Since</label>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2.5">
                      <FiSmartphone size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-900">June 2024</span>
                    </div>
                  </div>
                </div>
                <button className="btn-secondary text-sm mt-2">Edit Profile</button>
              </div>
            </div>
          )}

          {activeSection === 'addresses' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Saved Addresses</h2>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="flex items-center gap-1 text-brand-600 hover:text-brand-700 text-sm font-medium"
                >
                  <FiPlus size={16} /> Add New
                </button>
              </div>
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div key={addr.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <FiMapPin size={18} className="text-brand-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">{addr.label}</span>
                        {addr.isDefault && <span className="bg-brand-100 text-brand-600 text-[10px] font-bold px-2 py-0.5 rounded-full">DEFAULT</span>}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{addr.address}</p>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => setAddresses((prev) => prev.filter((a) => a.id !== addr.id))}
                        className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {showAddAddress && (
                <div className="mt-4 p-4 bg-brand-50 rounded-xl space-y-3">
                  <h3 className="font-semibold text-gray-900 text-sm">New Address</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={newAddress.label}
                        onChange={(e) => setNewAddress((p) => ({ ...p, label: e.target.value }))}
                        placeholder="Label (Home, Work, etc.)"
                        className="input-field text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress((p) => ({ ...p, street: e.target.value }))}
                        placeholder="Street Address"
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))}
                        placeholder="City"
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress((p) => ({ ...p, state: e.target.value }))}
                        placeholder="State"
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={newAddress.zip}
                        onChange={(e) => setNewAddress((p) => ({ ...p, zip: e.target.value }))}
                        placeholder="ZIP Code"
                        className="input-field text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleAddAddress} className="btn-primary text-sm py-2">Save Address</button>
                    <button onClick={() => setShowAddAddress(false)} className="btn-secondary text-sm py-2">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'payment' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h2>
              <div className="space-y-3">
                {savedCards.map((card) => (
                  <div key={card.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-sm font-bold text-blue-600">
                        {card.type === 'Visa' ? 'V' : 'MC'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{card.type} •••• {card.last4}</p>
                        <p className="text-xs text-gray-500">Expires {card.exp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {card.isDefault && <span className="bg-brand-100 text-brand-600 text-[10px] font-bold px-2 py-0.5 rounded-full">DEFAULT</span>}
                      <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium text-sm mt-4">
                <FiPlus size={16} /> Add Payment Method
              </button>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Security Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Password</p>
                    <p className="text-xs text-gray-500">Last changed 3 months ago</p>
                  </div>
                  <button className="btn-secondary text-sm py-1.5 px-3">Change</button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500">Add extra security to your account</p>
                  </div>
                  <button className="btn-secondary text-sm py-1.5 px-3">Enable</button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Active Sessions</p>
                    <p className="text-xs text-gray-500">You're logged in on 2 devices</p>
                  </div>
                  <button className="btn-secondary text-sm py-1.5 px-3">Manage</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
