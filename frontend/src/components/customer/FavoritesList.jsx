import { useState, useEffect } from 'react';
import { FiHeart, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from './RestaurantCard';
import LoadingSpinner from '../common/LoadingSpinner';

const favoriteRestaurants = [
  { id: 1, name: 'The Gourmet Kitchen', rating: 4.8, deliveryTime: '25-35 min', minOrder: '$10', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop', tags: ['Italian', 'Continental'], cuisine: 'Italian, Continental', distance: '1.2 km' },
  { id: 3, name: 'Sakura Sushi Bar', rating: 4.9, deliveryTime: '30-40 min', minOrder: '$15', image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=400&h=250&fit=crop', tags: ['Japanese', 'Sushi'], cuisine: 'Japanese, Sushi', distance: '2.1 km' },
  { id: 6, name: 'The Burger House', rating: 4.4, deliveryTime: '15-25 min', minOrder: '$7', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=250&fit=crop', tags: ['Burgers', 'American'], cuisine: 'Burgers, American', distance: '0.5 km' },
  { id: 8, name: 'Green Leaf Bistro', rating: 4.7, deliveryTime: '20-30 min', minOrder: '$11', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=250&fit=crop', tags: ['Healthy', 'Salads'], cuisine: 'Healthy, Salads', distance: '2.5 km' },
];

export default function FavoritesList({ addToCart }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFavorites(favoriteRestaurants);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading favorites..." />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Favorites</h1>
          <p className="text-sm text-gray-500 mt-0.5">{favorites.length} saved restaurant{favorites.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiHeart size={32} className="text-red-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No favorites yet</h3>
          <p className="text-sm text-gray-500 mb-6">Save your favorite restaurants for quick access</p>
          <button onClick={() => navigate('/customer')} className="btn-primary">Browse Restaurants</button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">{favorites.length}</span> saved
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {favorites.map((restaurant) => (
              <div key={restaurant.id} className="relative group">
                <RestaurantCard restaurant={restaurant} addToCart={addToCart} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFavorites((prev) => prev.filter((r) => r.id !== restaurant.id));
                  }}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10"
                >
                  <FiHeart size={16} className="text-red-500 fill-red-500" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
