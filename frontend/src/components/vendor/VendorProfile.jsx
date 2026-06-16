import { useState } from 'react';
import { FiSave, FiClock, FiMapPin, FiPhone, FiMail, FiImage, FiPlus, FiX } from 'react-icons/fi';

export default function VendorProfile() {
  const [profile, setProfile] = useState({
    name: 'Spice Kitchen',
    email: 'contact@spicekitchen.com',
    phone: '+91 9876543210',
    cuisine: 'North Indian, Mughlai',
    description: 'Authentic North Indian cuisine with a modern twist. Serving delicious biryanis, curries, and tandoori specialties since 2020.',
    address: '123, MG Road, Indira Nagar, Bangalore - 560038',
    deliveryFee: 40,
    minOrder: 150,
  });

  const [hours, setHours] = useState({
    Monday: { open: '09:00', close: '23:00' },
    Tuesday: { open: '09:00', close: '23:00' },
    Wednesday: { open: '09:00', close: '23:00' },
    Thursday: { open: '09:00', close: '23:00' },
    Friday: { open: '09:00', close: '00:00' },
    Saturday: { open: '10:00', close: '00:00' },
    Sunday: { open: '10:00', close: '22:00' },
  });

  const [deliveryZones, setDeliveryZones] = useState([
    'Indira Nagar', 'Koramangala', 'MG Road', 'Whitefield', 'JP Nagar', 'HSR Layout',
  ]);

  const [newZone, setNewZone] = useState('');

  const addZone = () => {
    if (newZone.trim() && !deliveryZones.includes(newZone.trim())) {
      setDeliveryZones([...deliveryZones, newZone.trim()]);
      setNewZone('');
    }
  };

  const removeZone = (zone) => {
    setDeliveryZones(deliveryZones.filter(z => z !== zone));
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Vendor Profile Settings</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
            SK
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{profile.cuisine}</p>
            <p className="text-sm text-gray-500">Member since 2024</p>
          </div>
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <FiImage /> Change Photo
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
            <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="text" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type</label>
            <input type="text" value={profile.cuisine} onChange={e => setProfile({...profile, cuisine: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows="3" value={profile.description} onChange={e => setProfile({...profile, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input type="text" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee ($)</label>
            <input type="number" value={profile.deliveryFee} onChange={e => setProfile({...profile, deliveryFee: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Order ($)</label>
            <input type="number" value={profile.minOrder} onChange={e => setProfile({...profile, minOrder: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FiClock className="text-orange-500" /> Business Hours</h3>
        <div className="space-y-3">
          {days.map(day => (
            <div key={day} className="flex items-center gap-4">
              <span className="w-28 text-sm font-medium text-gray-700">{day}</span>
              <input type="time" value={hours[day].open} onChange={e => setHours({...hours, [day]: {...hours[day], open: e.target.value}})}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <span className="text-gray-400">to</span>
              <input type="time" value={hours[day].close} onChange={e => setHours({...hours, [day]: {...hours[day], close: e.target.value}})}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FiMapPin className="text-orange-500" /> Delivery Zones</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {deliveryZones.map(zone => (
            <span key={zone} className="bg-orange-50 text-orange-700 text-sm px-3 py-1.5 rounded-full flex items-center gap-1">
              {zone}
              <button onClick={() => removeZone(zone)} className="hover:text-red-600"><FiX className="text-xs" /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={newZone} onChange={e => setNewZone(e.target.value)} placeholder="Add delivery zone..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            onKeyDown={e => e.key === 'Enter' && addZone()} />
          <button onClick={addZone} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 flex items-center gap-1">
            <FiPlus /> Add
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-orange-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
          <FiSave /> Save Changes
        </button>
      </div>
    </div>
  );
}
