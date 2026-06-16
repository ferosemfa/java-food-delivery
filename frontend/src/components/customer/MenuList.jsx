import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlus, FiMinus, FiClock, FiStar, FiChevronLeft, FiMapPin, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const sampleMenu = {
  1: {
    name: 'The Gourmet Kitchen',
    rating: 4.8,
    deliveryTime: '25-35 min',
    minOrder: '$10',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop',
    tags: ['Italian', 'Continental'],
    deliveryFee: '$2.99',
    distance: '1.2 km',
    categories: [
      {
        name: 'Starters',
        items: [
          { id: 101, name: 'Bruschetta', description: 'Toasted bread with tomatoes, basil, and mozzarella', price: 8.99, image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=200&h=200&fit=crop', popular: true },
          { id: 102, name: 'Calamari Fritti', description: 'Crispy fried squid with marinara sauce', price: 10.99, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200&h=200&fit=crop', popular: false },
          { id: 103, name: 'Garlic Bread', description: 'Oven-baked bread with garlic butter and herbs', price: 5.99, image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa125a2?w=200&h=200&fit=crop', popular: false },
        ],
      },
      {
        name: 'Main Course',
        items: [
          { id: 104, name: 'Truffle Pasta', description: 'Handmade pasta with black truffle cream sauce', price: 18.99, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=200&fit=crop', popular: true },
          { id: 105, name: 'Grilled Salmon', description: 'Atlantic salmon with lemon butter sauce and vegetables', price: 22.99, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop', popular: false },
          { id: 106, name: 'Chicken Parmesan', description: 'Breaded chicken breast with marinara and melted cheese', price: 16.99, image: 'https://images.unsplash.com/photo-1632778149955-e80d8ce7921b?w=200&h=200&fit=crop', popular: true },
          { id: 107, name: 'Ribeye Steak', description: '12oz ribeye with roasted potatoes and asparagus', price: 28.99, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200&h=200&fit=crop', popular: false },
        ],
      },
      {
        name: 'Desserts',
        items: [
          { id: 108, name: 'Tiramisu', description: 'Classic Italian coffee-flavored dessert', price: 7.99, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200&h=200&fit=crop', popular: true },
          { id: 109, name: 'Panna Cotta', description: 'Italian cream dessert with berry compote', price: 6.99, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop', popular: false },
        ],
      },
      {
        name: 'Beverages',
        items: [
          { id: 110, name: 'Espresso', description: 'Double shot espresso', price: 3.50, image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=200&h=200&fit=crop', popular: false },
          { id: 111, name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice', price: 4.99, image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=200&h=200&fit=crop', popular: false },
          { id: 112, name: 'Italian Soda', description: 'Sparkling water with fruit syrup', price: 3.99, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&h=200&fit=crop', popular: true },
        ],
      },
    ],
  },
};

export default function MenuList({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRestaurant(sampleMenu[id] || sampleMenu[1]);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading menu..." />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-gray-900">Restaurant not found</h2>
        <button onClick={() => navigate(-1)} className="btn-primary mt-4">Go Back</button>
      </div>
    );
  }

  const handleAdd = (item) => {
    addToCart(item);
    setQuantities((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
    toast.success(`${item.name} added to cart`);
  };

  const categoryNames = restaurant.categories?.map((c) => c.name) || [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden mb-6">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <FiChevronLeft size={20} />
        </button>
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          <p className="text-sm text-white/80 flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1">
              <FiStar size={14} className="fill-yellow-400 text-yellow-400" />
              {restaurant.rating}
            </span>
            <span className="flex items-center gap-1">
              <FiClock size={14} />
              {restaurant.deliveryTime}
            </span>
            <span className="flex items-center gap-1">
              <FiMapPin size={14} />
              {restaurant.distance}
            </span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-gray-600">
          <span>Min. order: <strong>{restaurant.minOrder}</strong></span>
          <span>Delivery fee: <strong>{restaurant.deliveryFee || 'Free'}</strong></span>
        </div>
        <div className="flex gap-1">
          {restaurant.tags?.map((tag) => (
            <span key={tag} className="bg-brand-50 text-brand-600 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      {categoryNames.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categoryNames.map((name, idx) => (
            <button
              key={name}
              onClick={() => setActiveCategory(idx)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === idx
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-6">
        {restaurant.categories?.map((category, catIdx) => (
          <div key={category.name} className={catIdx === activeCategory ? '' : 'hidden'}>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              {category.name}
              <span className="text-sm font-normal text-gray-400">({category.items.length})</span>
            </h2>
            <div className="space-y-3">
              {category.items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      {item.popular && <span className="bg-brand-50 text-brand-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">BESTSELLER</span>}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-base font-bold text-gray-900">${item.price.toFixed(2)}</span>
                      <div className="flex items-center">
                        {quantities[item.id] ? (
                          <div className="flex items-center gap-2 bg-brand-500 text-white rounded-lg">
                            <button
                              onClick={(e) => { e.stopPropagation(); setQuantities((prev) => {
                                const q = (prev[item.id] || 0) - 1;
                                if (q <= 0) {
                                  const copy = { ...prev };
                                  delete copy[item.id];
                                  return copy;
                                }
                                return { ...prev, [item.id]: q };
                              }); }}
                              className="w-8 h-8 flex items-center justify-center hover:bg-brand-600 rounded-l-lg"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="text-sm font-semibold w-6 text-center">{quantities[item.id]}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleAdd(item); }}
                              className="w-8 h-8 flex items-center justify-center hover:bg-brand-600 rounded-r-lg"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAdd(item); }}
                            className="px-4 py-1.5 border-2 border-brand-500 text-brand-600 font-semibold text-sm rounded-lg hover:bg-brand-500 hover:text-white transition-colors"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  {item.image && (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
