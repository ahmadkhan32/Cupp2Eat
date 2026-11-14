'use client';
import { useState } from 'react';
import { Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_REVIEWS = [
  { id: 'rev-1', product: 'Masala Magic Cup Noodles', author: 'Priya Sharma', rating: 5, comment: 'Hands down the most flavorful instant noodles in India. Not overly salty, just right!', date: '2024-11-10', approved: true },
  { id: 'rev-2', product: 'Belgian Chocolate Lava Cup Cake', author: 'Rahul Verma', rating: 5, comment: 'Microwaved for 30 seconds and the chocolate melted gorgeously. Loved it.', date: '2024-11-11', approved: true },
  { id: 'rev-3', product: 'Tomato Twist Soup Cup', author: 'Deepak Roy', rating: 4, comment: 'Nice tangy soup. Would love if croutons were packed separately.', date: '2024-11-12', approved: false },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  const toggleApproval = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, approved: !r.approved } : r));
    toast.success('Review moderation updated');
  };

  const handleDelete = (id) => {
    setReviews(reviews.filter(r => r.id !== id));
    toast.success('Review removed');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-charcoal">Review Moderation</h1>
        <p className="text-gray-500 text-sm mt-1">Approve, moderate, or remove verified customer feedback.</p>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-brand-charcoal text-sm">{r.product}</span>
                <span className="text-xs text-gray-400">• by {r.author}</span>
                <span className="text-xs text-gray-400">• {r.date}</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-brand-gold text-brand-gold' : 'text-gray-200'}`} />
                ))}
              </div>
              <p className="text-xs text-gray-600 italic">"{r.comment}"</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => toggleApproval(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  r.approved
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {r.approved ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {r.approved ? 'Approved' : 'Pending Approval'}
              </button>
              <button onClick={() => handleDelete(r.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
