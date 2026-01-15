import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';
import SEO from '../components/SEO';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../lib/supabase';

const Reviews = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
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

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const fetchReviews = async () => {
        try {
            setLoading(true);

            // Build query params
            const params = new URLSearchParams();
            params.append('limit', '50');
            params.append('sortBy', sortBy === 'recent' ? 'created_at' : sortBy);
            params.append('sortOrder', 'desc');
            if (filterRating !== 'all') {
                params.append('rating', filterRating);
            }

            const response = await fetch(`${API_URL}/api/reviews?${params.toString()}`);

            if (response.ok) {
                const data = await response.json();
                // Transform API response to match UI expectations
                const transformedReviews = (data.reviews || data || []).map(r => ({
                    _id: r.id || r._id,
                    customer: {
                        name: r.customer?.name || r.customer_name || 'Anonymous',
                        profileImage: r.customer?.profile_image
                    },
                    technician: {
                        name: r.technician?.name || r.technician_name || 'Technician',
                        specialization: r.technician?.specialization || r.technician?.services?.[0] || 'General Repair'
                    },
                    rating: r.rating,
                    title: r.title || 'Review',
                    comment: r.comment || r.review_text || '',
                    wouldRecommend: r.would_recommend !== false,
                    helpful: r.helpful_count || 0,
                    createdAt: new Date(r.created_at || r.createdAt),
                    booking: {
                        service: r.booking?.issue_type || r.booking?.service_type || 'Repair Service',
                        device: r.booking?.device_brand ? `${r.booking.device_brand} ${r.booking.device_model || ''}` : 'Device'
                    }
                }));
                setReviews(transformedReviews);
            } else {
                // Log the actual error from server for debugging
                const errData = await response.json().catch(() => ({}));
                console.error('Reviews API Error Details:', errData);

                // Fallback to mock data if API fails
                console.warn('Reviews API unavailable, using sample data');
                setReviews(getSampleReviews());
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            // Fallback to sample data
            setReviews(getSampleReviews());
        } finally {
            setLoading(false);
        }
    };

    const getSampleReviews = () => [
        {
            _id: '1',
            customer: { name: 'Sarah Johnson', profileImage: null },
            technician: { name: 'John Smith', specialization: 'Mobile Repair' },
            rating: 5,
            title: 'Excellent Service!',
            comment: 'Very professional and quick. Fixed my iPhone screen in under an hour. Highly recommended!',
            wouldRecommend: true,
            helpful: 24,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            booking: { service: 'Screen Replacement', device: 'iPhone 13' }
        },
        {
            _id: '2',
            customer: { name: 'Michael Brown', profileImage: null },
            technician: { name: 'Jane Doe', specialization: 'PC Repair' },
            rating: 4,
            title: 'Good experience',
            comment: 'Fixed my laptop battery issue. Service was good but took a bit longer than expected.',
            wouldRecommend: true,
            helpful: 15,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            booking: { service: 'Battery Replacement', device: 'Dell XPS 15' }
        },
        {
            _id: '3',
            customer: { name: 'Emily Davis', profileImage: null },
            technician: { name: 'Alex Kumar', specialization: 'Mobile Repair' },
            rating: 5,
            title: 'Best technician!',
            comment: 'Amazing work! Very knowledgeable and explained everything clearly. Will definitely use again.',
            wouldRecommend: true,
            helpful: 32,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            booking: { service: 'Water Damage Repair', device: 'Samsung S21' }
        },
        {
            _id: '4',
            customer: { name: 'David Wilson', profileImage: null },
            technician: { name: 'Maria Garcia', specialization: 'PC Repair' },
            rating: 3,
            title: 'Average service',
            comment: 'The issue was fixed but communication could have been better.',
            wouldRecommend: false,
            helpful: 5,
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            booking: { service: 'Software Installation', device: 'HP Pavilion' }
        }
    ];

    const fetchMyReviews = async () => {
        try {
            // Get auth token from Supabase
            const {
                data: { session },
            } = await supabase.auth.getSession();



            if (!session) {
                setMyReviews([]);
                return;
            }

            const response = await fetch(`${API_URL}/api/reviews?customerId=${session.user.id}`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const transformedReviews = (data.reviews || data || []).map(r => ({
                    _id: r.id || r._id,
                    technician: { name: r.technician?.name || 'Technician' },
                    rating: r.rating,
                    title: r.title || 'My Review',
                    comment: r.comment || '',
                    createdAt: new Date(r.created_at || r.createdAt),
                    booking: {
                        service: r.booking?.issue_type || r.booking?.service_type || 'Repair',
                        device: r.booking?.device_brand || 'Device'
                    }
                }));
                setMyReviews(transformedReviews);
            } else {
                const errData = await response.json().catch(() => ({}));
                console.error('My Reviews API Error Details:', errData);
                setMyReviews([]);
            }
        } catch (error) {
            console.error('Error fetching my reviews:', error);
            setMyReviews([]);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast({
                variant: 'destructive',
                title: 'Rating Required',
                description: 'Please select a rating before submitting.',
            });
            return;
        }

        try {
            // Get auth token from session
            const {
                data: { session },
            } = await supabase.auth.getSession();



            if (!session) {
                toast({
                    variant: "destructive",
                    title: "Login Required",
                    description: "Please log in to submit a review.",
                });
                return;
            }

            const reviewData = {
                technician_id: selectedBooking?.technician_id,
                booking_id: selectedBooking?._id || selectedBooking?.id,
                rating,
                title: reviewTitle,
                comment: reviewText,
                would_recommend: wouldRecommend
            };

            const response = await fetch(`${API_URL}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify(reviewData)
            });

            if (response.ok) {
                toast({
                    title: "Review Submitted!",
                    description: "Thank you for sharing your feedback.",
                });
                setShowSubmitModal(false);
                resetReviewForm();
                fetchMyReviews();
                fetchReviews();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: error.message || "Failed to submit review. Please try again.",
            });
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
        try {
            const response = await fetch(`${API_URL}/api/reviews/${reviewId}/helpful`, {
                method: 'POST'
            });

            if (response.ok) {
                toast({
                    title: "Marked as Helpful",
                    description: "Thanks for your feedback!",
                });
                fetchReviews(); // Refresh to show updated count
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
                                : 'text-zinc-700'
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
        <div className="min-h-screen bg-black text-white">
            <SEO
                title="Reviews & Ratings - TechCare"
                description="Read reviews from real customers about our technicians and services. Share your own experience."
                keywords="techcare reviews, technician ratings, customer feedback, service reviews"
            />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Reviews & Ratings
                    </h1>
                    <p className="text-gray-400">
                        Share your experience and help others make informed decisions
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 border-b border-white/10 mb-6">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'all'
                            ? 'border-b-2 border-emerald-500 text-emerald-500'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        All Reviews
                    </button>
                    <button
                        onClick={() => {
                            setShowSubmitModal(true);
                        }}
                        className={`pb-3 px-4 font-medium transition-colors text-gray-400 hover:text-white`}
                    >
                        Write Review
                    </button>
                    <button
                        onClick={() => setActiveTab('my')}
                        className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'my'
                            ? 'border-b-2 border-emerald-500 text-emerald-500'
                            : 'text-gray-400 hover:text-white'
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
                            <div className="bg-zinc-900 border border-white/10 p-6 sticky top-4">
                                <h3 className="text-lg font-bold text-white mb-4">
                                    Rating Overview
                                </h3>

                                <div className="text-center mb-6">
                                    <div className="text-5xl font-bold text-emerald-500 mb-2">
                                        {getAverageRating()}
                                    </div>
                                    {renderStars(Math.round(getAverageRating()))}
                                    <p className="text-sm text-gray-400 mt-2">
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
                                                <span className="text-sm font-medium w-8 text-gray-300">{star} ★</span>
                                                <div className="flex-1 bg-white/10 h-2">
                                                    <div
                                                        className="bg-yellow-500 h-2 transition-all"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm text-gray-400 w-8">
                                                    {count}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Filter by Rating
                                    </label>
                                    <select
                                        value={filterRating}
                                        onChange={(e) => setFilterRating(e.target.value)}
                                        className="w-full px-3 py-2 border border-white/20 bg-zinc-800 text-white"
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
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Sort By
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-3 py-2 border border-white/20 bg-zinc-800 text-white"
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
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                                    <p className="mt-4 text-gray-400">Loading reviews...</p>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="bg-zinc-900 border border-white/10 p-12 text-center">
                                    <div className="text-6xl mb-4">⭐</div>
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        No Reviews Yet
                                    </h3>
                                    <p className="text-gray-400">
                                        Be the first to leave a review!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review._id} className="bg-zinc-900 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xl font-bold text-white">
                                                        {review.customer.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-white">
                                                            {review.customer.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-400">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                {renderStars(review.rating)}
                                            </div>

                                            <h3 className="font-bold text-lg text-white mb-2">
                                                {review.title}
                                            </h3>

                                            <p className="text-gray-300 mb-3">
                                                {review.comment}
                                            </p>

                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="text-sm text-gray-400">
                                                    <span className="font-medium text-gray-300">Service:</span> {review.booking.service}
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    <span className="font-medium text-gray-300">Device:</span> {review.booking.device}
                                                </div>
                                            </div>

                                            {review.wouldRecommend && (
                                                <div className="inline-flex items-center px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-sm mb-3 border border-emerald-500/20">
                                                    ✓ Would recommend
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4 pt-3 border-t border-white/10">
                                                <button
                                                    onClick={() => handleMarkHelpful(review._id)}
                                                    className="text-sm text-gray-400 hover:text-emerald-500 transition-colors flex items-center gap-1"
                                                >
                                                    👍 Helpful ({review.helpful})
                                                </button>
                                                <span className="text-sm text-gray-500">
                                                    Reviewed {review.technician.name} • {review.technician.specialization}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* My Reviews Tab */}
                {activeTab === 'my' && (
                    <div className="max-w-4xl mx-auto">
                        {myReviews.length === 0 ? (
                            <div className="bg-zinc-900 border border-white/10 rounded-lg p-12 text-center">
                                <div className="text-6xl mb-4">✍️</div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    No Reviews Written Yet
                                </h3>
                                <p className="text-gray-400 mb-4">
                                    Share your experience with completed services
                                </p>
                                <button
                                    onClick={() => setShowSubmitModal(true)}
                                    className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                                >
                                    Write Your First Review
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {myReviews.map((review) => (
                                    <div key={review._id} className="bg-zinc-900 border border-white/10 rounded-lg p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-semibold text-white">
                                                    Review for {review.technician.name}
                                                </h4>
                                                <p className="text-sm text-gray-400">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {renderStars(review.rating)}
                                        </div>
                                        <h3 className="font-bold text-white mb-2">
                                            {review.title}
                                        </h3>
                                        <p className="text-gray-300 mb-3">
                                            {review.comment}
                                        </p>
                                        <div className="text-sm text-gray-500">
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
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-white/10 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Write a Review
                        </h2>

                        <form onSubmit={handleSubmitReview} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Rating *
                                </label>
                                <div className="flex items-center gap-4">
                                    {renderStars(rating, true, 'text-4xl')}
                                    {rating > 0 && (
                                        <span className="text-lg font-medium text-emerald-500">
                                            {rating} star{rating !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Review Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={reviewTitle}
                                    onChange={(e) => setReviewTitle(e.target.value)}
                                    className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-600"
                                    placeholder="Summarize your experience"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Your Review *
                                </label>
                                <textarea
                                    required
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    rows="6"
                                    className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-600"
                                    placeholder="Share details about your experience..."
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="recommend"
                                    checked={wouldRecommend}
                                    onChange={(e) => setWouldRecommend(e.target.checked)}
                                    className="mr-2 accent-emerald-500 w-4 h-4"
                                />
                                <label htmlFor="recommend" className="text-sm text-gray-300 cursor-pointer">
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
                                    className="flex-1 px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
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
