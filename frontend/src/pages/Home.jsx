import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiArrowRight, FiStar, FiClock, FiShield, FiTruck, FiSmartphone, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const categories = [
  { name: 'Pizza', icon: '🍕', color: 'bg-red-50 text-red-500' },
  { name: 'Burger', icon: '🍔', color: 'bg-orange-50 text-orange-500' },
  { name: 'Sushi', icon: '🍣', color: 'bg-pink-50 text-pink-500' },
  { name: 'Pasta', icon: '🍝', color: 'bg-yellow-50 text-yellow-500' },
  { name: 'Indian', icon: '🍛', color: 'bg-amber-50 text-amber-500' },
  { name: 'Desserts', icon: '🍰', color: 'bg-purple-50 text-purple-500' },
  { name: 'Beverages', icon: '🥤', color: 'bg-cyan-50 text-cyan-500' },
  { name: 'Salads', icon: '🥗', color: 'bg-green-50 text-green-500' },
  { name: 'BBQ', icon: '🍖', color: 'bg-red-50 text-red-500' },
  { name: 'Breakfast', icon: '🥞', color: 'bg-blue-50 text-blue-500' },
];

const featuredRestaurants = [
  { id: 1, name: 'The Gourmet Kitchen', rating: 4.8, time: '25-35 min', minOrder: '$10', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop', tags: ['Italian', 'Continental'] },
  { id: 2, name: 'Spice Garden', rating: 4.6, time: '20-30 min', minOrder: '$8', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=250&fit=crop', tags: ['Indian', 'Mughlai'] },
  { id: 3, name: 'Sakura Sushi Bar', rating: 4.9, time: '30-40 min', minOrder: '$15', image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=400&h=250&fit=crop', tags: ['Japanese', 'Sushi'] },
  { id: 4, name: 'Bella Napoli', rating: 4.7, time: '25-35 min', minOrder: '$12', image: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?w=400&h=250&fit=crop', tags: ['Pizza', 'Italian'] },
  { id: 5, name: 'Dragon Wok', rating: 4.5, time: '20-30 min', minOrder: '$9', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=250&fit=crop', tags: ['Chinese', 'Asian'] },
  { id: 6, name: 'The Burger House', rating: 4.4, time: '15-25 min', minOrder: '$7', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=250&fit=crop', tags: ['Burgers', 'American'] },
];

const howItWorks = [
  { step: 1, title: 'Browse Restaurants', desc: 'Explore top-rated restaurants near you and discover cuisines you love.', icon: '🔍' },
  { step: 2, title: 'Choose Your Food', desc: 'Browse menus, customize your order, and add items to your cart.', icon: '📋' },
  { step: 3, title: 'Place an Order', desc: 'Choose payment method, confirm your address, and place the order.', icon: '✅' },
  { step: 4, title: 'Fast Delivery', desc: 'Track your order in real-time and enjoy your meal hot & fresh!', icon: '🚀' },
];

const testimonials = [
  { name: 'Sarah M.', rating: 5, text: 'Best food delivery service! The tracking feature is amazing. Always hot and on time.', avatar: '👩' },
  { name: 'James K.', rating: 5, text: 'Incredible variety of restaurants. I discovered so many new places I love!', avatar: '👨' },
  { name: 'Priya S.', rating: 4, text: 'The loyalty program is great. I earn points on every order and get free meals!', avatar: '👩‍🦱' },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);

  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: 'Delicious Food, Delivered Fresh',
      subtitle: 'Order from the best local restaurants with easy tracking and fast delivery right to your doorstep.',
      cta: isAuthenticated ? 'Order Now' : 'Get Started',
      link: isAuthenticated ? '/customer' : '/register',
      bg: 'from-brand-500 via-brand-600 to-brand-800',
    },
    {
      title: 'Your Cravings, Just a Click Away',
      subtitle: 'From pizza to sushi, burgers to biryani — whatever you crave, we deliver it hot & fresh.',
      cta: 'Explore Restaurants',
      link: '/customer',
      bg: 'from-primary-500 via-primary-600 to-primary-800',
    },
    {
      title: 'Earn While You Eat',
      subtitle: 'Join our loyalty program and earn rewards with every order. Free meals, discounts, and more!',
      cta: 'Learn More',
      link: '#',
      bg: 'from-purple-500 via-purple-600 to-purple-800',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(isAuthenticated ? `/customer/search?q=${encodeURIComponent(searchQuery.trim())}` : '/register');
    }
  };

  return (
    <div>
      <section className={`relative bg-gradient-to-br ${heroSlides[currentSlide].bg} text-white overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 text-8xl">🍕</div>
          <div className="absolute top-40 right-20 text-7xl">🍔</div>
          <div className="absolute bottom-20 left-1/3 text-9xl">🍜</div>
          <div className="absolute top-1/3 left-1/2 text-6xl">🥗</div>
          <div className="absolute bottom-40 right-1/4 text-7xl">🍣</div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-2xl">
            <motion.h1
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4"
            >
              {heroSlides[currentSlide].title}
            </motion.h1>
            <motion.p
              key={`p-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg sm:text-xl text-white/80 mb-8 max-w-lg leading-relaxed"
            >
              {heroSlides[currentSlide].subtitle}
            </motion.p>

            <form onSubmit={handleSearch} className="flex gap-3 max-w-lg mb-6">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for restaurants or dishes..."
                  className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-300 shadow-lg"
                />
              </div>
              <button type="submit" className="bg-white text-brand-600 font-semibold px-6 py-3.5 rounded-xl hover:bg-brand-50 transition-colors shadow-lg flex items-center gap-2">
                Search <FiArrowRight size={18} />
              </button>
            </form>

            <div className="flex items-center gap-4 text-sm">
              <Link to={isAuthenticated ? '/customer' : '/register'} className="bg-white/15 hover:bg-white/25 backdrop-blur-sm px-5 py-2.5 rounded-full font-medium transition-colors">
                {heroSlides[currentSlide].cta} →
              </Link>
              <span className="text-white/50">|</span>
              <span className="text-white/70">50+ restaurants in your area</span>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentSlide ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">What's on your mind?</h2>
            <div className="flex gap-2">
              <button onClick={() => setActiveCategory(Math.max(0, activeCategory - 1))} className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600">
                <FiChevronLeft size={18} />
              </button>
              <button onClick={() => setActiveCategory(Math.min(categories.length - 4, activeCategory + 1))} className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600">
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={isAuthenticated ? `/customer/search?cuisine=${cat.name.toLowerCase()}` : '/register'}
                className="flex flex-col items-center gap-2 min-w-[100px] group"
              >
                <div className={`w-20 h-20 ${cat.color} rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-sm`}>
                  {cat.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-brand-600">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Featured Restaurants</h2>
              <p className="text-gray-500 mt-1">Hand-picked favorites for you</p>
            </div>
            <Link to={isAuthenticated ? '/customer' : '/register'} className="text-brand-600 hover:text-brand-700 font-medium text-sm flex items-center gap-1">
              View All <FiArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRestaurants.map((rest) => (
              <motion.div
                key={rest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="card overflow-hidden group cursor-pointer"
                onClick={() => isAuthenticated ? navigate(`/customer/restaurant/${rest.id}`) : navigate('/register')}
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={rest.image} alt={rest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {rest.tags.map((tag) => (
                      <span key={tag} className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{rest.name}</h3>
                    <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-lg text-sm font-medium">
                      <FiStar size={14} className="fill-current" />
                      {rest.rating}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><FiClock size={14} /> {rest.time}</span>
                    <span>Min. {rest.minOrder}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">How It Works</h2>
            <p className="text-gray-500 mt-2">Simple steps to get your food delivered</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item) => (
              <div key={item.step} className="text-center group">
                <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 group-hover:bg-brand-100 transition-all">
                  {item.icon}
                </div>
                <div className="w-10 h-10 bg-brand-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose Azlaan?</h2>
            <p className="text-gray-500 mt-2">We make food delivery better</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FiTruck size={28} />, title: 'Fast Delivery', desc: 'Real-time tracking so you know exactly when your food arrives.' },
              { icon: <FiShield size={28} />, title: 'Safe & Secure', desc: 'Contactless delivery and secure payment options for your safety.' },
              { icon: <FiStar size={28} />, title: 'Top Quality', desc: 'Carefully selected restaurants with verified reviews and ratings.' },
              { icon: <FiSmartphone size={28} />, title: 'Easy Ordering', desc: 'Simple interface to browse, order, and track in just a few taps.' },
            ].map((feature) => (
              <div key={feature.title} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-14 h-14 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-brand-500 to-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Download Our App</h2>
              <p className="text-brand-100 max-w-lg leading-relaxed">Get the full experience. Order on the go, track in real-time, and enjoy exclusive app-only offers.</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-6">
                <a href="#" className="bg-black/20 hover:bg-black/30 backdrop-blur-sm px-5 py-3 rounded-xl flex items-center gap-3 transition-colors">
                  <span className="text-2xl">🍎</span>
                  <div className="text-left">
                    <p className="text-xs text-white/70">Download on the</p>
                    <p className="text-sm font-semibold">App Store</p>
                  </div>
                </a>
                <a href="#" className="bg-black/20 hover:bg-black/30 backdrop-blur-sm px-5 py-3 rounded-xl flex items-center gap-3 transition-colors">
                  <span className="text-2xl">📱</span>
                  <div className="text-left">
                    <p className="text-xs text-white/70">Get it on</p>
                    <p className="text-sm font-semibold">Google Play</p>
                  </div>
                </a>
              </div>
            </div>
            <div className="text-8xl opacity-30">📱</div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="text-gray-500 mt-2">Trusted by thousands of food lovers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-gray-50 p-6 rounded-xl">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <FiStar key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{t.avatar}</span>
                  <span className="font-medium text-gray-900 text-sm">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Ready to Order?</h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-6">Join thousands of satisfied customers and get your favorite food delivered to your doorstep.</p>
            <Link to={isAuthenticated ? '/customer' : '/register'} className="btn-primary inline-flex items-center gap-2 text-lg py-3 px-8">
              {isAuthenticated ? 'Start Ordering' : 'Get Started'} <FiArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
