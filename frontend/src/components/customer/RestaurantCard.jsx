import { useNavigate } from 'react-router-dom';
import { FiStar, FiClock, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function RestaurantCard({ restaurant, addToCart }) {
  const navigate = useNavigate();

  if (!restaurant) return null;

  const handleClick = () => {
    navigate(`/customer/restaurant/${restaurant.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop'}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {restaurant.discount && (
          <div className="absolute top-3 left-3 bg-brand-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg">
            {restaurant.discount}% OFF
          </div>
        )}
        {restaurant.isOpen === false && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Closed</span>
          </div>
        )}
        {restaurant.eta && (
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-medium px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
            <FiClock size={12} />
            {restaurant.eta}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 mr-2">
            <h3 className="font-semibold text-gray-900 text-base truncate">{restaurant.name}</h3>
            {restaurant.cuisine && (
              <p className="text-xs text-gray-500 mt-0.5 truncate">{restaurant.cuisine}</p>
            )}
          </div>
          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-lg text-sm font-medium shrink-0">
            <FiStar size={13} className="fill-current" />
            <span>{restaurant.rating || '4.0'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          {restaurant.deliveryTime && (
            <span className="flex items-center gap-1">
              <FiClock size={12} />
              {restaurant.deliveryTime}
            </span>
          )}
          {restaurant.minOrder && (
            <span>Min. {restaurant.minOrder}</span>
          )}
          {restaurant.distance && (
            <span className="flex items-center gap-1">
              <FiMapPin size={12} />
              {restaurant.distance}
            </span>
          )}
        </div>

        {restaurant.tags && restaurant.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {restaurant.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
            {restaurant.tags.length > 3 && (
              <span className="text-[10px] text-gray-400">+{restaurant.tags.length - 3}</span>
            )}
          </div>
        )}

        {restaurant.featuredItems && restaurant.featuredItems.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium mb-1">Popular</p>
            <div className="flex flex-wrap gap-1.5">
              {restaurant.featuredItems.slice(0, 2).map((item) => (
                <span key={item} className="text-xs text-gray-600">• {item}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
