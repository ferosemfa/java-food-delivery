import { useState } from 'react';
import { FiCheck, FiX, FiEye, FiImage, FiStar, FiMessageSquare } from 'react-icons/fi';

const pendingMenuItems = [
  { id: 1, name: 'Schezwan Noodles', vendor: 'Dragon Wok', description: 'Hot and spicy noodles with vegetables', price: 11.99, image: '' },
  { id: 2, name: 'Chicken 65', vendor: 'South Spice', description: 'Deep-fried chicken with spices', price: 13.49, image: '' },
  { id: 3, name: 'Paneer Tikka', vendor: 'Tandoori Express', description: 'Marinated paneer grilled in tandoor', price: 10.99, image: '' },
];

const pendingReviews = [
  { id: 4, reviewer: 'Rajesh K.', vendor: 'Spice Kitchen', rating: 1, text: 'Terrible experience. Food was cold and late.', date: '2026-06-15' },
  { id: 5, reviewer: 'Meena S.', vendor: 'Pizza Planet', rating: 1, text: 'Pizza was burnt. Worst pizza ever!', date: '2026-06-14' },
  { id: 6, reviewer: 'Arun P.', vendor: 'Sweet Bengal', rating: 2, text: 'Not authentic Bengali food.', date: '2026-06-13' },
];

export default function ContentModeration() {
  const [tab, setTab] = useState('menu');
  const [menuItems, setMenuItems] = useState(pendingMenuItems);
  const [reviews, setReviews] = useState(pendingReviews);

  const handleApproveItem = (id) => setMenuItems(menuItems.filter(i => i.id !== id));
  const handleRejectItem = (id) => setMenuItems(menuItems.filter(i => i.id !== id));
  const handleApproveReview = (id) => setReviews(reviews.filter(r => r.id !== id));
  const handleRejectReview = (id) => setReviews(reviews.filter(r => r.id !== id));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Content Moderation</h1>
        <span className="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
          {menuItems.length + reviews.length} pending
        </span>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {[
          { key: 'menu', label: 'Menu Items', icon: FiImage, count: menuItems.length },
          { key: 'reviews', label: 'Reviews', icon: FiMessageSquare, count: reviews.length },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
              tab === t.key ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            <t.icon /> {t.label} <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">{t.count}</span>
          </button>
        ))}
      </div>

      {tab === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-500">No items pending moderation</div>
          ) : menuItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl border shadow-sm p-5">
              <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <FiImage className="text-3xl text-gray-400" />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-xs text-gray-500">{item.vendor}</p>
                </div>
                <span className="text-sm font-bold text-indigo-600">${item.price.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">{item.description}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleApproveItem(item.id)} className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 flex items-center justify-center gap-1">
                  <FiCheck /> Approve
                </button>
                <button onClick={() => handleRejectItem(item.id)} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 flex items-center justify-center gap-1">
                  <FiX /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'reviews' && (
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No reviews pending moderation</div>
          ) : reviews.map(review => (
            <div key={review.id} className="bg-white rounded-xl border shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{review.reviewer}</span>
                    <span className="text-xs text-gray-500">reviewed {review.vendor}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <FiStar key={s} className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2 italic">"{review.text}"</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleApproveReview(review.id)} className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 flex items-center justify-center gap-1">
                  <FiCheck /> Approve
                </button>
                <button onClick={() => handleRejectReview(review.id)} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 flex items-center justify-center gap-1">
                  <FiX /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
