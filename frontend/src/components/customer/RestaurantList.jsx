import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import RestaurantCard from './RestaurantCard';
import LoadingSpinner from '../common/LoadingSpinner';

const allRestaurants = [
  { id: 1, name: 'The Gourmet Kitchen', rating: 4.8, deliveryTime: '25-35 min', minOrder: '$10', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop', tags: ['Italian', 'Continental'], cuisine: 'Italian, Continental', discount: 20, distance: '1.2 km', eta: '25 min', isOpen: true, featuredItems: ['Truffle Pasta', 'Tiramisu'] },
  { id: 2, name: 'Spice Garden', rating: 4.6, deliveryTime: '20-30 min', minOrder: '$8', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=250&fit=crop', tags: ['Indian', 'Mughlai'], cuisine: 'Indian, Mughlai', discount: 15, distance: '0.8 km', eta: '20 min', isOpen: true, featuredItems: ['Butter Chicken', 'Naan'] },
  { id: 3, name: 'Sakura Sushi Bar', rating: 4.9, deliveryTime: '30-40 min', minOrder: '$15', image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=400&h=250&fit=crop', tags: ['Japanese', 'Sushi'], cuisine: 'Japanese, Sushi', discount: 10, distance: '2.1 km', eta: '30 min', isOpen: true, featuredItems: ['Dragon Roll', 'Miso Soup'] },
  { id: 4, name: 'Bella Napoli', rating: 4.7, deliveryTime: '25-35 min', minOrder: '$12', image: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?w=400&h=250&fit=crop', tags: ['Pizza', 'Italian'], cuisine: 'Pizza, Italian', distance: '1.5 km', eta: '25 min', isOpen: true, featuredItems: ['Margherita', 'Calzone'] },
  { id: 5, name: 'Dragon Wok', rating: 4.5, deliveryTime: '20-30 min', minOrder: '$9', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=250&fit=crop', tags: ['Chinese', 'Asian'], cuisine: 'Chinese, Asian', discount: 25, distance: '1.0 km', eta: '20 min', isOpen: false, featuredItems: ['Kung Pao Chicken', 'Fried Rice'] },
  { id: 6, name: 'The Burger House', rating: 4.4, deliveryTime: '15-25 min', minOrder: '$7', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=250&fit=crop', tags: ['Burgers', 'American'], cuisine: 'Burgers, American', discount: 30, distance: '0.5 km', eta: '15 min', isOpen: true, featuredItems: ['Double Cheeseburger', 'Fries'] },
  { id: 7, name: 'Taco Fiesta', rating: 4.3, deliveryTime: '20-30 min', minOrder: '$6', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=250&fit=crop', tags: ['Mexican', 'Tacos'], cuisine: 'Mexican', distance: '1.8 km', eta: '20 min', isOpen: true },
  { id: 8, name: 'Green Leaf Bistro', rating: 4.7, deliveryTime: '20-30 min', minOrder: '$11', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=250&fit=crop', tags: ['Healthy', 'Salads'], cuisine: 'Healthy, Salads', discount: 15, distance: '2.5 km', eta: '25 min', isOpen: true },
  { id: 9, name: 'Mediterranean Delight', rating: 4.6, deliveryTime: '25-35 min', minOrder: '$13', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=250&fit=crop', tags: ['Mediterranean', 'Greek'], cuisine: 'Mediterranean', distance: '3.0 km', eta: '30 min', isOpen: true },
  { id: 10, name: 'Golden Dragon', rating: 4.2, deliveryTime: '30-45 min', minOrder: '$10', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=250&fit=crop', tags: ['Chinese', 'Thai'], cuisine: 'Chinese, Thai', discount: 20, distance: '2.2 km', eta: '30 min', isOpen: true },
  { id: 11, name: 'Le Petit Pain', rating: 4.8, deliveryTime: '15-25 min', minOrder: '$5', image: 'https://images.unsplash.com/photo-1509722747041-616f39b5756a?w=400&h=250&fit=crop', tags: ['French', 'Bakery'], cuisine: 'French, Bakery', distance: '0.3 km', eta: '15 min', isOpen: true },
  { id: 12, name: 'BBQ Nation', rating: 4.5, deliveryTime: '35-50 min', minOrder: '$18', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=250&fit=crop', tags: ['BBQ', 'Grill'], cuisine: 'BBQ, Grill', discount: 10, distance: '4.0 km', eta: '35 min', isOpen: true },
];

const categories = [
  { id: 'all', label: 'All' },
  { id: 'offers', label: 'Offers' },
  { id: 'pizza', label: 'Pizza' },
  { id: 'burgers', label: 'Burgers' },
  { id: 'indian', label: 'Indian' },
  { id: 'chinese', label: 'Chinese' },
  { id: 'italian', label: 'Italian' },
  { id: 'sushi', label: 'Sushi' },
  { id: 'healthy', label: 'Healthy' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'mexican', label: 'Mexican' },
];

export default function RestaurantList({ addToCart }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRestaurants(allRestaurants);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filtered = activeCategory === 'all'
    ? restaurants
    : activeCategory === 'offers'
      ? restaurants.filter((r) => r.discount)
      : restaurants.filter((r) => r.tags?.some((t) => t.toLowerCase().includes(activeCategory)));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Restaurants Near You</h2>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} restaurants</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-brand-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300 hover:text-brand-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="Finding restaurants near you..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No restaurants found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your filters or search for something else</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} addToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
