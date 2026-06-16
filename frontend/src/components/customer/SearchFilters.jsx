import { useState, useEffect } from 'react';
import { FiSearch, FiSliders, FiX } from 'react-icons/fi';
import RestaurantCard from './RestaurantCard';
import LoadingSpinner from '../common/LoadingSpinner';

const allRestaurants = [
  { id: 1, name: 'The Gourmet Kitchen', rating: 4.8, deliveryTime: '25-35 min', minOrder: '$10', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop', tags: ['Italian', 'Continental'], cuisine: 'Italian, Continental', discount: 20, distance: '1.2 km' },
  { id: 2, name: 'Spice Garden', rating: 4.6, deliveryTime: '20-30 min', minOrder: '$8', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=250&fit=crop', tags: ['Indian', 'Mughlai'], cuisine: 'Indian, Mughlai', discount: 15, distance: '0.8 km' },
  { id: 3, name: 'Sakura Sushi Bar', rating: 4.9, deliveryTime: '30-40 min', minOrder: '$15', image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=400&h=250&fit=crop', tags: ['Japanese', 'Sushi'], cuisine: 'Japanese, Sushi', discount: 10, distance: '2.1 km' },
  { id: 4, name: 'Bella Napoli', rating: 4.7, deliveryTime: '25-35 min', minOrder: '$12', image: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?w=400&h=250&fit=crop', tags: ['Pizza', 'Italian'], cuisine: 'Pizza, Italian', distance: '1.5 km' },
  { id: 5, name: 'Dragon Wok', rating: 4.5, deliveryTime: '20-30 min', minOrder: '$9', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=250&fit=crop', tags: ['Chinese', 'Asian'], cuisine: 'Chinese, Asian', discount: 25, distance: '1.0 km' },
  { id: 6, name: 'The Burger House', rating: 4.4, deliveryTime: '15-25 min', minOrder: '$7', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=250&fit=crop', tags: ['Burgers', 'American'], cuisine: 'Burgers, American', discount: 30, distance: '0.5 km' },
  { id: 7, name: 'Taco Fiesta', rating: 4.3, deliveryTime: '20-30 min', minOrder: '$6', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=250&fit=crop', tags: ['Mexican', 'Tacos'], cuisine: 'Mexican', distance: '1.8 km' },
  { id: 8, name: 'Green Leaf Bistro', rating: 4.7, deliveryTime: '20-30 min', minOrder: '$11', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=250&fit=crop', tags: ['Healthy', 'Salads'], cuisine: 'Healthy, Salads', discount: 15, distance: '2.5 km' },
  { id: 9, name: 'Mediterranean Delight', rating: 4.6, deliveryTime: '25-35 min', minOrder: '$13', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=250&fit=crop', tags: ['Mediterranean', 'Greek'], cuisine: 'Mediterranean', distance: '3.0 km' },
  { id: 10, name: 'Golden Dragon', rating: 4.2, deliveryTime: '30-45 min', minOrder: '$10', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=250&fit=crop', tags: ['Chinese', 'Thai'], cuisine: 'Chinese, Thai', discount: 20, distance: '2.2 km' },
  { id: 11, name: 'Le Petit Pain', rating: 4.8, deliveryTime: '15-25 min', minOrder: '$5', image: 'https://images.unsplash.com/photo-1509722747041-616f39b5756a?w=400&h=250&fit=crop', tags: ['French', 'Bakery'], cuisine: 'French, Bakery', distance: '0.3 km' },
  { id: 12, name: 'BBQ Nation', rating: 4.5, deliveryTime: '35-50 min', minOrder: '$18', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=250&fit=crop', tags: ['BBQ', 'Grill'], cuisine: 'BBQ, Grill', discount: 10, distance: '4.0 km' },
];

const cuisines = ['Italian', 'Indian', 'Japanese', 'Chinese', 'Mexican', 'American', 'French', 'Mediterranean', 'BBQ', 'Healthy'];

export default function SearchFilters({ addToCart }) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ cuisine: '', minRating: 0, maxPrice: '', sortBy: 'rating' });
  const [results, setResults] = useState(allRestaurants);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    setQuery(q);
    performSearch(q, filters);
  }, []);

  const performSearch = (searchQuery, activeFilters) => {
    setLoading(true);
    setTimeout(() => {
      let filtered = [...allRestaurants];

      if (searchQuery.trim()) {
        const lower = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.name.toLowerCase().includes(lower) ||
            r.cuisine.toLowerCase().includes(lower) ||
            r.tags.some((t) => t.toLowerCase().includes(lower))
        );
      }

      if (activeFilters.cuisine) {
        filtered = filtered.filter((r) => r.tags.includes(activeFilters.cuisine));
      }

      if (activeFilters.minRating > 0) {
        filtered = filtered.filter((r) => r.rating >= activeFilters.minRating);
      }

      if (activeFilters.sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (activeFilters.sortBy === 'delivery') {
        filtered.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
      } else if (activeFilters.sortBy === 'discount') {
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      }

      setResults(filtered);
      setLoading(false);
    }, 300);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(query, filters);
  };

  const clearFilters = () => {
    const emptyFilters = { cuisine: '', minRating: 0, maxPrice: '', sortBy: 'rating' };
    setFilters(emptyFilters);
    performSearch(query, emptyFilters);
  };

  const hasActiveFilters = filters.cuisine || filters.minRating > 0;

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for restaurants or cuisines..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-2 ${
              showFilters || hasActiveFilters
                ? 'bg-brand-500 text-white border-brand-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
            }`}
          >
            <FiSliders size={18} />
            <span className="hidden sm:inline text-sm font-medium">Filters</span>
            {hasActiveFilters && <span className="w-2 h-2 bg-white rounded-full" />}
          </button>
        </div>
      </form>

      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            <button onClick={clearFilters} className="text-sm text-brand-600 hover:text-brand-700 font-medium">Clear all</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Cuisine</label>
              <div className="flex flex-wrap gap-2">
                {cuisines.map((c) => (
                  <button
                    key={c}
                    onClick={() => setFilters((prev) => ({ ...prev, cuisine: prev.cuisine === c ? '' : c }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filters.cuisine === c
                        ? 'bg-brand-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Minimum Rating</label>
              <div className="flex gap-2">
                {[0, 3, 3.5, 4, 4.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setFilters((prev) => ({ ...prev, minRating: prev.minRating === r ? 0 : r }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filters.minRating === r
                        ? 'bg-brand-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } ${r === 0 ? '' : ''}`}
                  >
                    {r === 0 ? 'Any' : `${r}+`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
                className="input-field text-sm"
              >
                <option value="rating">Highest Rated</option>
                <option value="delivery">Fastest Delivery</option>
                <option value="discount">Best Offers</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {loading ? 'Searching...' : `${results.length} restaurant${results.length !== 1 ? 's' : ''} found`}
        </p>
        {query && (
          <button onClick={() => { setQuery(''); performSearch('', filters); }} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
            <FiX size={14} /> Clear search
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner text="Searching..." />
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {results.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} addToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
