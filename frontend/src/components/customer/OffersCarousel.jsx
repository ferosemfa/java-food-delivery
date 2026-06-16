import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiPercent, FiGift } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const offers = [
  { id: 1, title: '50% OFF', subtitle: 'On your first order', description: 'Use code: AZLAAN50', color: 'from-brand-500 to-brand-600', bg: 'bg-brand-50', icon: '🎉' },
  { id: 2, title: 'Free Delivery', subtitle: 'On orders above $30', description: 'Auto-applied at checkout', color: 'from-primary-500 to-primary-600', bg: 'bg-primary-50', icon: '🚚' },
  { id: 3, title: 'Combo Deals', subtitle: 'Burger + Fries + Drink', description: 'Only $12.99', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', icon: '🍔' },
  { id: 4, title: 'Family Pack', subtitle: '4 meals + sides', description: 'Save 25%', color: 'from-green-500 to-green-600', bg: 'bg-green-50', icon: '👨‍👩‍👧‍👦' },
  { id: 5, title: 'Midnight Special', subtitle: 'Orders after 10 PM', description: 'Extra 15% off', color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50', icon: '🌙' },
];

export default function OffersCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % offers.length);
  };

  const offer = offers[current];

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FiPercent size={18} className="text-brand-500" />
          Best Offers
        </h2>
        <div className="flex gap-2">
          <button onClick={prev} className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
            <FiChevronLeft size={16} />
          </button>
          <button onClick={next} className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={offer.id}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className={`relative bg-gradient-to-r ${offer.color} rounded-2xl p-6 sm:p-8 text-white overflow-hidden`}
          >
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-4xl mb-2 block">{offer.icon}</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold mt-2">{offer.title}</h3>
                  <p className="text-lg text-white/80 mt-1">{offer.subtitle}</p>
                  <p className="text-sm text-white/60 mt-2">{offer.description}</p>
                  <button className="mt-4 bg-white text-gray-900 font-semibold px-5 py-2 rounded-lg text-sm hover:bg-white/90 transition-colors shadow-lg">
                    Grab Now
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 text-8xl opacity-10">🏷️</div>
            <div className="absolute -bottom-4 -right-4 text-6xl opacity-10">⭐</div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {offers.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`h-2 rounded-full transition-all ${idx === current ? 'w-8 bg-brand-500' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        {offers.slice(0, 4).map((offer) => (
          <button
            key={offer.id}
            onClick={() => goTo(offers.indexOf(offer))}
            className="bg-white border border-gray-100 rounded-xl p-4 text-left hover:shadow-md transition-shadow"
          >
            <span className="text-2xl">{offer.icon}</span>
            <p className="font-semibold text-gray-900 text-sm mt-2">{offer.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{offer.subtitle}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
