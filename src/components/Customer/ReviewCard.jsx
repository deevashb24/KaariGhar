import React from 'react';
import { Star } from 'lucide-react';

export default function ReviewCard({ review }) {
    const stars = Array.from({ length: 5 }, (_, i) => i < review.rating);
    const date = new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <div className="review-card">
            <div className="review-card-header">
                <div className="review-card-avatar">{(review.customer?.name || 'A')[0].toUpperCase()}</div>
                <div>
                    <span className="review-card-name">{review.customer?.name || 'Anonymous'}</span>
                    <span className="review-card-date">{date}</span>
                </div>
                <div className="review-card-stars">
                    {stars.map((filled, i) => (
                        <Star key={i} size={14} fill={filled ? '#d4af37' : 'none'} color={filled ? '#d4af37' : 'rgba(255,255,255,0.2)'} />
                    ))}
                </div>
            </div>
            {review.comment && <p className="review-card-comment">{review.comment}</p>}
        </div>
    );
}
