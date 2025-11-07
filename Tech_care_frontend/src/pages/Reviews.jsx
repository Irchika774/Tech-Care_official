import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const initialReviewsData = [
  {
    id: 1,
    name: "Alice Johnson",
    rating: 5,
    date: "2023-10-26",
    comment: "TechCare fixed my laptop quickly and efficiently! The technician was very knowledgeable and friendly. Highly recommend their services.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLzKhF535EikviVxpN8hGOA8q8HbhHT2VoQeNoAeXNjG-aek6ssWgwo6uy9fcotaQN2PyWqYbN9HBwT8IFIpk0Ws551ipCoucQAnwZgeEOCbSD_NUuOBFiD5mpVlCO83AViUdNAIW6A5zEFT7JftxXqQ0_BeGMt2_KDl199g9wkePqLc7WO8-oJShfXAmiXxkJ8uKPzb8T1zS0g1HBnZGnYBtL878lk06bXjQuxCZioMzbGffYASG4K9DGUw0tbuT8kO7UGB8CIeuZ",
    helpful: 12,
    verified: true
  },
  {
    id: 2,
    name: "Robert Smith",
    rating: 4,
    date: "2023-10-25",
    comment: "Good service overall, but the wait time was a bit long. My phone screen replacement was done well.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBz1FdFAQquagOE_gbkXPIoSQj86gEN4BghFJ3Yq0SYr9w-WOZvnQayRnZhNTG37WAldtHPA0qwB6DiMz-f1u-i7LOS5a2TLwxKxaXlr4m5tciMR4Vpb6QlJ6SWmPcNDsok50ngdWJ880Ep5bUAi4pOq-LRK--6MuihkhXECZe1ZD1l0QeY_uJTBxsbNVE3kJCnF5anpNavBOy62Nia4gQRex9uoPHVsmF6CY0EXoQnF3OfaIO_Arna2vt2IurOCWph9s-st6Qxlzxm",
    helpful: 8,
    verified: true
  },
  {
    id: 3,
    name: "Emily White",
    rating: 5,
    date: "2023-10-24",
    comment: "Fantastic experience! My gaming PC was crashing constantly, and they diagnosed and fixed the issue within a day. Excellent communication!",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAa_pEXziv4tytO4EC2QtisaYXhqcR4FdUMb1UMcYuJ-R95i3-mVmjAwFRdDjJmBwYagMqCLNb2I1KA0JGsYwAVxuie_Sj2QJew-W7hFxRQKksDaWD_ufBhmGfeS-8D35tKWY0QKU6Tj62v5W_yqrbYyGUCkoNqGyjRCR8PzpmycyHUAY1SZ4YDPYOH9BkEdTAkvHnyhpQ_WZ5BbktrqqGjvMyMAac9emgmmRKQjFk123rZOgvO0OU-AYgRr25T2uupUG1tHJ_QvthB",
    helpful: 15,
    verified: false
  },
  {
    id: 4,
    name: "David Lee",
    rating: 3,
    date: "2023-10-23",
    comment: "The repair was okay, but I felt the price was a bit high for the work done. Service was polite though.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVesBBTNu6hjvZ8P8Vs-GGyLH1coe5rW5-vmsID5iTjBArPNQVu6FHQ4C6NC0OuuFAuZMjKroKpWpANkUSufWOflcV406a4Y10FQIVdoqW6ZewF7_aYrz9_QcAMR3VBGjluPNXFassnelBzg2qCxX1QXuQ-MMnSihVy881xVsoYbpV93dflW2zs-sWzDmN_h4WB1BnsGMtXQYkO1bZv5TWwBCWKaM6D6MnEw2Iv4PG2AN1NuPaHFjGtGK5Xuq-3k6FavfH4AHC9kc5",
    helpful: 3,
    verified: true
  },
  {
    id: 5,
    name: "Sarah Martinez",
    rating: 5,
    date: "2023-10-22",
    comment: "Absolutely wonderful service! They went above and beyond. My tablet works like new again. Will definitely return!",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLzKhF535EikviVxpN8hGOA8q8HbhHT2VoQeNoAeXNjG-aek6ssWgwo6uy9fcotaQN2PyWqYbN9HBwT8IFIpk0Ws551ipCoucQAnwZgeEOCbSD_NUuOBFiD5mpVlCO83AViUdNAIW6A5zEFT7JftxXqQ0_BeGMt2_KDl199g9wkePqLc7WO8-oJShfXAmiXxkJ8uKPzb8T1zS0g1HBnZGnYBtL878lk06bXjQuxCZioMzbGffYASG4K9DGUw0tbuT8kO7UGB8CIeuZ",
    helpful: 20,
    verified: true
  },
  {
    id: 6,
    name: "Michael Chen",
    rating: 4,
    date: "2023-10-21",
    comment: "Great work on my phone battery replacement. Quick turnaround and fair pricing.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBz1FdFAQquagOE_gbkXPIoSQj86gEN4BghFJ3Yq0SYr9w-WOZvnQayRnZhNTG37WAldtHPA0qwB6DiMz-f1u-i7LOS5a2TLwxKxaXlr4m5tciMR4Vpb6QlJ6SWmPcNDsok50ngdWJ880Ep5bUAi4pOq-LRK--6MuihkhXECZe1ZD1l0QeY_uJTBxsbNVE3kJCnF5anpNavBOy62Nia4gQRex9uoPHVsmF6CY0EXoQnF3OfaIO_Arna2vt2IurOCWph9s-st6Qxlzxm",
    helpful: 6,
    verified: false
  },
  {
    id: 7,
    name: "Jennifer Garcia",
    rating: 2,
    date: "2023-10-20",
    comment: "Had some issues with the initial repair. They fixed it on the second visit but wasn't happy with the delay.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAa_pEXziv4tytO4EC2QtisaYXhqcR4FdUMb1UMcYuJ-R95i3-mVmjAwFRdDjJmBwYagMqCLNb2I1KA0JGsYwAVxuie_Sj2QJew-W7hFxRQKksDaWD_ufBhmGfeS-8D35tKWY0QKU6Tj62v5W_yqrbYyGUCkoNqGyjRCR8PzpmycyHUAY1SZ4YDPYOH9BkEdTAkvHnyhpQ_WZ5BbktrqqGjvMyMAac9emgmmRKQjFk123rZOgvO0OU-AYgRr25T2uupUG1tHJ_QvthB",
    helpful: 2,
    verified: true
  },
  {
    id: 8,
    name: "James Wilson",
    rating: 5,
    date: "2023-10-19",
    comment: "Professional and efficient. Fixed my laptop screen perfectly. Highly recommend!",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVesBBTNu6hjvZ8P8Vs-GGyLH1coe5rW5-vmsID5iTjBArPNQVu6FHQ4C6NC0OuuFAuZMjKroKpWpANkUSufWOflcV406a4Y10FQIVdoqW6ZewF7_aYrz9_QcAMR3VBGjluPNXFassnelBzg2qCxX1QXuQ-MMnSihVy881xVsoYbpV93dflW2zs-sWzDmN_h4WB1BnsGMtXQYkO1bZv5TWwBCWKaM6D6MnEw2Iv4PG2AN1NuPaHFjGtGK5Xuq-3k6FavfH4AHC9kc5",
    helpful: 10,
    verified: true
  }
];

const Reviews = () => {
  const [reviews, setReviews] = useState(initialReviewsData);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [helpfulClicks, setHelpfulClicks] = useState({});

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    if (reviewText.trim() === '') {
      alert('Please write a review');
      return;
    }

    const newReview = {
      id: reviews.length + 1,
      name: "You (Current User)",
      rating: rating,
      date: new Date().toISOString().split('T')[0],
      comment: reviewText,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLzKhF535EikviVxpN8hGOA8q8HbhHT2VoQeNoAeXNjG-aek6ssWgwo6uy9fcotaQN2PyWqYbN9HBwT8IFIpk0Ws551ipCoucQAnwZgeEOCbSD_NUuOBFiD5mpVlCO83AViUdNAIW6A5zEFT7JftxXqQ0_BeGMt2_KDl199g9wkePqLc7WO8-oJShfXAmiXxkJ8uKPzb8T1zS0g1HBnZGnYBtL878lk06bXjQuxCZioMzbGffYASG4K9DGUw0tbuT8kO7UGB8CIeuZ",
      helpful: 0,
      verified: false
    };

    setReviews([newReview, ...reviews]);
    setRating(0);
    setReviewText('');
  };

  const handleHelpful = (reviewId) => {
    if (helpfulClicks[reviewId]) {
      return; // Already marked as helpful
    }
    setReviews(reviews.map(review => 
      review.id === reviewId ? { ...review, helpful: review.helpful + 1 } : review
    ));
    setHelpfulClicks({ ...helpfulClicks, [reviewId]: true });
  };

  // Calculate rating statistics
  const calculateStats = () => {
    const total = reviews.length;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = total > 0 ? (sum / total).toFixed(1) : 0;
    
    const distribution = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: reviews.filter(r => r.rating === star).length,
      percentage: total > 0 ? (reviews.filter(r => r.rating === star).length / total * 100).toFixed(0) : 0
    }));

    return { total, average, distribution };
  };

  // Filter and sort reviews
  const getFilteredReviews = () => {
    let filtered = [...reviews];

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(review =>
        review.name.toLowerCase().includes(searchLower) ||
        review.comment.toLowerCase().includes(searchLower)
      );
    }

    // Rating filter
    if (filterRating !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(filterRating));
    }

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'highest') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      filtered.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === 'helpful') {
      filtered.sort((a, b) => b.helpful - a.helpful);
    }

    return filtered;
  };

  const stats = calculateStats();
  const filteredReviews = getFilteredReviews();

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        
        <main className="max-w-5xl mx-auto py-8">
          {/* Overall Rating Section */}
          <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Average Rating */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start mb-4">
                  <span className="material-icons text-yellow-400 text-5xl">star</span>
                  <span className="text-5xl font-bold ml-3">{stats.average}</span>
                </div>
                <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark">
                  Based on {stats.total} reviews
                </p>
              </div>

              {/* Right: Rating Distribution */}
              <div className="space-y-2">
                {stats.distribution.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-12">{star} star{star !== 1 ? 's' : ''}</span>
                    <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark w-12 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Write Review Section */}
          <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Write a Review</h2>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Your Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none hover:scale-110 transition-transform"
                    >
                      <span className={`material-icons text-4xl ${
                        star <= (hoverRating || rating) 
                          ? 'text-yellow-400' 
                          : 'text-gray-300 dark:text-gray-600'
                      }`}>
                        {star <= (hoverRating || rating) ? 'star' : 'star_outline'}
                      </span>
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-3 text-lg font-semibold text-primary">
                      {rating} {rating === 1 ? 'star' : 'stars'}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Your Review</label>
                <textarea 
                  className="w-full h-32 p-4 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary resize-none" 
                  placeholder="Share your experience with our service..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    setRating(0);
                    setReviewText('');
                  }}
                  className="px-6 py-2 border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>

          {/* Filters and Search */}
          <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">
                  search
                </span>
                <input 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Search reviews..." 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="w-full py-2 px-4 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <select 
                className="w-full py-2 px-4 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
            <div className="mt-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Showing {Math.min(visibleCount, filteredReviews.length)} of {filteredReviews.length} reviews
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {filteredReviews.slice(0, visibleCount).map((review) => (
              <div key={review.id} className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <img 
                    alt={`${review.name} avatar`} 
                    className="w-12 h-12 rounded-full" 
                    src={review.avatar}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{review.name}</h3>
                          {review.verified && (
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full flex items-center gap-1">
                              <span className="material-icons text-xs">verified</span>
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="material-icons text-sm">
                                {i < review.rating ? 'star' : 'star_outline'}
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-text-light dark:text-text-dark mb-4">{review.comment}</p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleHelpful(review.id)}
                        disabled={helpfulClicks[review.id]}
                        className={`flex items-center gap-2 text-sm ${
                          helpfulClicks[review.id] 
                            ? 'text-primary cursor-not-allowed' 
                            : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-primary'
                        } transition`}
                      >
                        <span className="material-icons text-base">thumb_up</span>
                        <span>Helpful ({review.helpful})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredReviews.length && (
            <div className="text-center mt-8">
              <button 
                onClick={() => setVisibleCount(prev => prev + 5)}
                className="bg-background-light dark:bg-card-dark border border-border-light dark:border-border-dark font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Load More Reviews
              </button>
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Reviews;
