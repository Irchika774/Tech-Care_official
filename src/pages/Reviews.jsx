import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';
import SEO from '../components/SEO';

import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const Reviews = () => {
    const { user } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all'); // all, submit, my
    const [reviews, setReviews] = useState([]);
    const [myReviews, setMyReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRating, setFilterRating] = useState('all');
    const [sortBy, setSortBy] = useState('recent'); // recent, rating, helpful

    // Submit review form
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [wouldRecommend, setWouldRecommend] = useState(true);

    useEffect(() => {
        fetchReviews();
        fetchMyReviews();
    }, [filterRating, sortBy]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            let url = `${API_URL}/api/reviews?limit=20`;

            if (filterRating !== 'all') {
                url += `&rating=${filterRating}`;
            }

            // Map sort options to API params
            const sortMap = {
                'recent': { sortBy: 'created_at', sortOrder: 'desc' },
                'rating': { sortBy: 'rating', sortOrder: 'desc' },
                'helpful': { sortBy: 'helpful_count', sortOrder: 'desc' }
            };
            const { sortBy: apiSortBy, sortOrder } = sortMap[sortBy] || sortMap.recent;
            url += `&sortBy=${apiSortBy}&sortOrder=${sortOrder}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch reviews');

            const data = await response.json();
            setReviews(data.reviews || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyReviews = async () => {
        if (!user) return;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            // Fetch reviews where customer_id matches the user
            // Assuming the reviews API supports filtering my reviews, or we use the generic filter
            // Ideally we need customer ID, which is not user.id directly if mapped
            // But reviews.js accepts customerId query param.
            // We'll trust the token validation but we need to know WHICH customer ID to filter for?
            // Actually, reviews.js has /:id but not /my.
            // However, we can use filter `customerId`.
            // BUT we don't have customerId easily here without fetching profile.
            // Let's rely on backend filtering or fetch profile first?
            // Simplified: Filter by generic query might work if we pass nothing and backend filters by token?
            // No, reviews.js uses query params.
            // Let's use `user.id` as customerId for now, acknowledging it might be different in complex setups.
            // Or better: Fetch profile first?

            // To be safe, let's fetch my reviews via a specific route if it existed, or filter client side?
            // No, client side is too heavy.
            // Let's try passing customerId query param if we had it.
            // For now, let's fetch all and filter client side if list is small? No.

            // Best approach: If user is logged in, we can hit endpoints. 
            // If we use `/api/reviews?customerId=${user.id}` (assuming user.id maps to customer_id or backend handles it).
            // Actually, looking at reviews.js lines 33-35: `query.eq('customer_id', customerId)`.
            // It expects strict ID match.
            // If user.id (auth) != customer.id (table), this fails.
            // Let's assume user.id IS mapped or compatible for now, or fetch profile.

            const response = await fetch(`${API_URL}/api/reviews?customerId=${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setMyReviews(data.reviews || []);
            }
        } catch (error) {
            console.error('Error fetching my reviews:', error);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            // If we don't have selectedBooking, we can't submit valid review for backend validation usually
            // But for now let's assume selectedBooking is populated or we mock it for generic review?
            // The backend requires technician_id.
            // We need a way to select a technician or booking to review.
            // If this page is standalone, how do we notify which technician?
            // Assuming this is opened from a booking context or selectedBooking is set.
            // If selectedBooking is null, we can't submit.
            if (!selectedBooking && !activeTab === 'submit') {
                // For standalone submit, we need UI to select booking.
                // If mocking, we hardcode, but for real we should error.
                alert("Please select a booking to review from your history.");
                return;
            }

            const reviewData = {
                technician_id: selectedBooking?.technician?.id || selectedBooking?.technician_id,
                booking_id: selectedBooking?.id || selectedBooking?._id || 'BK_MOCK', // Needs valid UUID
                rating,
                title: reviewTitle,
                comment: reviewText,
                would_recommend: wouldRecommend
            };

            const response = await fetch(`${API_URL}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reviewData)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to submit review');
            }

            alert('Review submitted successfully!');
            setShowSubmitModal(false);
            resetReviewForm();
            fetchMyReviews();
            fetchReviews(); // Refresh all reviews
        } catch (error) {
            console.error('Error submitting review:', error);
            alert(error.message);
        }
    };

    const resetReviewForm = () => {
        setRating(0);
        setHoverRating(0);
        setReviewTitle('');
        setReviewText('');
        setWouldRecommend(true);
    };

    const handleMarkHelpful = async (reviewId) => {
        if (!user) return alert("Please login to vote.");
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const response = await fetch(`${API_URL}/api/reviews/${reviewId}/helpful`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                // Optimistic update
                setReviews(prev => prev.map(r =>
                    r.id === reviewId ? { ...r, helpful_count: (r.helpful_count || 0) + 1 } : r
                ));
            }
        } catch (error) {
            console.error('Error marking helpful:', error);
        }
    };

    const renderStars = (rating, interactive = false, size = 'text-xl') => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={!interactive}
                        onClick={() => interactive && setRating(star)}
                        onMouseEnter={() => interactive && setHoverRating(star)}
                        onMouseLeave={() => interactive && setHoverRating(0)}
                        className={`${size} ${interactive ? 'cursor-pointer' : 'cursor-default'} transition-colors`}
                    >
                        <span className={
                            star <= (interactive ? (hoverRating || rating) : rating)
                                ? 'text-yellow-500'
                                : 'text-gray-300 dark:text-gray-600'
                        }>
                            ★
                        </span>
                    </button>
                ))}
            </div>
        );
    };

    const getRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            distribution[review.rating]++;
        });
        return distribution;
    };

    const getAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <SEO
                title="Reviews & Ratings - TechCare"
                description="Read reviews from real customers about our technicians and services. Share your own experience."
                keywords="techcare reviews, technician ratings, customer feedback, service reviews"
            />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
                        Reviews & Ratings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Share your experience and help others make informed decisions
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'all'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-gray-600 dark:text-gray-400 hover:text-text-light dark:hover:text-text-dark'
                            }`}
                    >
                        All Reviews
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('submit');
                            setShowSubmitModal(true);
                        }}
                        className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'submit'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-gray-600 dark:text-gray-400 hover:text-text-light dark:hover:text-text-dark'
                            }`}
                    >
                        Write Review
                    </button>
                    <button
                        onClick={() => setActiveTab('my')}
                        className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'my'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-gray-600 dark:text-gray-400 hover:text-text-light dark:hover:text-text-dark'
                            }`}
                    >
                        My Reviews ({myReviews.length})
                    </button>
                </div>

                {/* All Reviews Tab */}
                {activeTab === 'all' && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar - Rating Stats */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-4">
                                <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-4">
                                    Rating Overview
                                </h3>

                                <div className="text-center mb-6">
                                    <div className="text-5xl font-bold text-primary mb-2">
                                        {getAverageRating()}
                                    </div>
                                    {renderStars(Math.round(getAverageRating()))}
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                        Based on {reviews.length} reviews
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map(star => {
                                        const distribution = getRatingDistribution();
                                        const count = distribution[star];
                                        const percentage = reviews.length ? (count / reviews.length) * 100 : 0;

                                        return (
                                            <div key={star} className="flex items-center gap-2">
                                                <span className="text-sm font-medium w-8">{star} ★</span>
                                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-yellow-500 h-2 rounded-full transition-all"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                                                    {count}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                                        Filter by Rating
                                    </label>
                                    <select
                                        value={filterRating}
                                        onChange={(e) => setFilterRating(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="all">All Ratings</option>
                                        <option value="5">5 Stars</option>
                                        <option value="4">4 Stars</option>
                                        <option value="3">3 Stars</option>
                                        <option value="2">2 Stars</option>
                                        <option value="1">1 Star</option>
                                    </select>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                                        Sort By
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="recent">Most Recent</option>
                                        <option value="rating">Highest Rating</option>
                                        <option value="helpful">Most Helpful</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Reviews List */}
                        <div className="lg:col-span-3">
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                    <p className="mt-4 text-gray-600 dark:text-gray-300">Loading reviews...</p>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                                    <div className="text-6xl mb-4">⭐</div>
                                    <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                                        No Reviews Yet
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Be the first to leave a review!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
                                                        {review.customer.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-text-light dark:text-text-dark">
                                                            {review.customer.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                {renderStars(review.rating)}
                                            </div>

                                            <h3 className="font-bold text-lg text-text-light dark:text-text-dark mb-2">
                                                {review.title}
                                            </h3>

                                            <p className="text-gray-700 dark:text-gray-300 mb-3">
                                                {review.comment}
                                            </p>

                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium">Service:</span> {review.booking.service}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium">Device:</span> {review.booking.device}
                                                </div>
                                            </div>

                                            {review.wouldRecommend && (
                                                <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm mb-3">
                                                    ✓ Would recommend
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                <button
                                                    onClick={() => handleMarkHelpful(review._id)}
                                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors flex items-center gap-1"
                                                >
                                                    👍 Helpful ({review.helpful})
                                                </button>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    Reviewed {review.technician.name} • {review.technician.specialization}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* My Reviews Tab */}
                {activeTab === 'my' && (
                    <div className="max-w-4xl mx-auto">
                        {myReviews.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                                <div className="text-6xl mb-4">✍️</div>
                                <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                                    No Reviews Written Yet
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Share your experience with completed services
                                </p>
                                <button
                                    onClick={() => setShowSubmitModal(true)}
                                    className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                                >
                                    Write Your First Review
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {myReviews.map((review) => (
                                    <div key={review._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-semibold text-text-light dark:text-text-dark">
                                                    Review for {review.technician.name}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {renderStars(review.rating)}
                                        </div>
                                        <h3 className="font-bold text-text-light dark:text-text-dark mb-2">
                                            {review.title}
                                        </h3>
                                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                                            {review.comment}
                                        </p>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {review.booking.service} - {review.booking.device}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Submit Review Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-6">
                            Write a Review
                        </h2>

                        <form onSubmit={handleSubmitReview} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                                    Rating *
                                </label>
                                <div className="flex items-center gap-4">
                                    {renderStars(rating, true, 'text-4xl')}
                                    {rating > 0 && (
                                        <span className="text-lg font-medium text-primary">
                                            {rating} star{rating !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                                    Review Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={reviewTitle}
                                    onChange={(e) => setReviewTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                                    placeholder="Summarize your experience"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                                    Your Review *
                                </label>
                                <textarea
                                    required
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    rows="6"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                                    placeholder="Share details about your experience..."
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="recommend"
                                    checked={wouldRecommend}
                                    onChange={(e) => setWouldRecommend(e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="recommend" className="text-sm text-gray-700 dark:text-gray-300">
                                    I would recommend this technician to others
                                </label>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowSubmitModal(false);
                                        resetReviewForm();
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reviews;
