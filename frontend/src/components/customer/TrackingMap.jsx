import { FiMapPin, FiNavigation } from 'react-icons/fi';

export default function TrackingMap() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="font-semibold text-gray-900 mb-4">Live Location</h2>
      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-64 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="200" fill="#e5e7eb" />
            <line x1="50" y1="40" x2="350" y2="40" stroke="#d1d5db" strokeWidth="2" />
            <line x1="50" y1="80" x2="350" y2="80" stroke="#d1d5db" strokeWidth="2" />
            <line x1="50" y1="120" x2="350" y2="120" stroke="#d1d5db" strokeWidth="2" />
            <line x1="50" y1="160" x2="350" y2="160" stroke="#d1d5db" strokeWidth="2" />
            <line x1="100" y1="20" x2="100" y2="180" stroke="#d1d5db" strokeWidth="2" />
            <line x1="200" y1="20" x2="200" y2="180" stroke="#d1d5db" strokeWidth="2" />
            <line x1="300" y1="20" x2="300" y2="180" stroke="#d1d5db" strokeWidth="2" />
            <rect x="80" y="30" width="40" height="30" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" rx="3" />
            <rect x="280" y="130" width="30" height="20" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" rx="3" />
            <rect x="180" y="20" width="20" height="15" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" rx="2" />
            <circle cx="60" cy="150" r="8" fill="#9ca3af" />
            <circle cx="340" cy="50" r="6" fill="#9ca3af" />
          </svg>
        </div>

        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 z-10">
          <p className="text-xs font-medium text-gray-700">📍 Restaurant</p>
          <p className="text-[10px] text-gray-500 mt-0.5">The Gourmet Kitchen</p>
        </div>
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 z-10">
          <p className="text-xs font-medium text-gray-700">🏠 Your Location</p>
          <p className="text-[10px] text-gray-500 mt-0.5">456 Home Ave</p>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 bg-brand-500/20 rounded-full absolute -top-8 -left-8 animate-ping" />
            <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center shadow-lg shadow-brand-500/50 relative z-10">
              <FiNavigation size={16} className="text-white" />
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/4 -translate-y-1/2">
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
            <FiMapPin size={14} className="text-white" />
          </div>
        </div>

        <div className="absolute top-1/4 right-1/4">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <FiMapPin size={14} className="text-white" />
          </div>
        </div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <line x1="25%" y1="50%" x2="50%" y2="50%" stroke="#f97316" strokeWidth="2" strokeDasharray="6,4" />
          <circle cx="50%" cy="50%" r="4" fill="#f97316" />
        </svg>

        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm z-10">
          <p className="text-xs text-gray-600">
            <span className="font-medium">Live:</span> Delivery partner is 1.2 km away
          </p>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">
        Map integration requires an API key. Showing approximate delivery location.
      </p>
    </div>
  );
}
