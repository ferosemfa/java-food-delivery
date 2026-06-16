import { useState } from 'react';
import { FiStar, FiThumbsUp, FiMessageSquare, FiSend, FiFilter } from 'react-icons/fi';

const initialReviews = [
  { id: 1, customer: 'Rahul Sharma', rating: 5, date: '2026-06-15', text: 'Amazing Chicken Biryani! Perfectly spiced and generous portions. Will order again!', avatar: 'RS', responded: false },
  { id: 2, customer: 'Priya Patel', rating: 4, date: '2026-06-14', text: 'Butter Chicken was delicious. Naan could be a bit softer but overall great experience.', avatar: 'PP', responded: true, response: 'Thank you Priya! We will work on making our naan softer.' },
  { id: 3, customer: 'Amit Verma', rating: 2, date: '2026-06-13', text: 'Delivery was late and the food was cold. Very disappointed.', avatar: 'AV', responded: false },
  { id: 4, customer: 'Neha Gupta', rating: 5, date: '2026-06-12', text: 'Best restaurant in town! Love the Dal Makhani and Gulab Jamun.', avatar: 'NG', responded: false },
  { id: 5, customer: 'Vikram Singh', rating: 3, date: '2026-06-11', text: 'Average food. Quantity is good but taste could be better.', avatar: 'VS', responded: true, response: 'Thank you for your feedback Vikram! We are constantly improving our recipes.' },
];

export default function ReviewsDisplay() {
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState('all');
  const [responses, setResponses] = useState({});
  const [showRespond, setShowRespond] = useState(null);

  const filtered = filter === 'all' ? reviews : filter === 'positive' ? reviews.filter(r => r.rating >= 4) : reviews.filter(r => r.rating <= 2);

  const handleRespond = (id) => {
    if (!responses[id]?.trim()) return;
    setReviews(reviews.map(r => r.id === id ? { ...r, responded: true, response: responses[id] } : r));
    setResponses({ ...responses, [id]: '' });
    setShowRespond(null);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar key={i} className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Customer Reviews</h1>
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-400" />
          {['all', 'positive', 'negative'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg capitalize ${
                filter === f ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(review => (
          <div key={review.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {review.avatar}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{review.customer}</p>
                  <p className="text-xs text-gray-400">{review.date}</p>
                </div>
              </div>
              <div className="flex">{renderStars(review.rating)}</div>
            </div>
            <p className="text-sm text-gray-600 mt-3">{review.text}</p>

            {review.responded && review.response && (
              <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-orange-700">Your Response</span>
                </div>
                <p className="text-sm text-orange-800">{review.response}</p>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3">
              <button className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1">
                <FiThumbsUp /> Helpful ({Math.floor(Math.random() * 10) + 1})
              </button>
              {!review.responded && (
                <button onClick={() => setShowRespond(showRespond === review.id ? null : review.id)}
                  className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1">
                  <FiMessageSquare /> Respond
                </button>
              )}
            </div>

            {showRespond === review.id && (
              <div className="mt-3 flex gap-2">
                <input type="text" value={responses[review.id] || ''} onChange={e => setResponses({...responses, [review.id]: e.target.value})}
                  placeholder="Write your response..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                <button onClick={() => handleRespond(review.id)} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 flex items-center gap-1">
                  <FiSend /> Send
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
