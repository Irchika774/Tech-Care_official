import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';

const RatingReviewDialog = ({
    isOpen,
    onClose,
    booking,
    technician,
    onReviewSubmitted
}) => {
    const { toast } = useToast();
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [title, setTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasExistingReview, setHasExistingReview] = useState(false);

    // Reset state when dialog opens
    useEffect(() => {
        if (isOpen) {
            setRating(0);
            setComment('');
            setTitle('');
            setHasExistingReview(false);
            checkExistingReview();
        }
    }, [isOpen, booking?.id]);

    const checkExistingReview = async () => {
        if (!booking?.id) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            const response = await fetch(`${API_URL}/api/reviews?booking_id=${booking.id}`, {
                headers: { Authorization: `Bearer ${session?.access_token}` }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.data?.reviews?.length > 0) {
                    setHasExistingReview(true);
                    const existingReview = result.data.reviews[0];
                    setRating(existingReview.rating);
                    setComment(existingReview.comment || '');
                    setTitle(existingReview.title || '');
                }
            }
        } catch (error) {
            console.error('Error checking existing review:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast({
                variant: "destructive",
                title: "Rating Required",
                description: "Please select a star rating before submitting your review."
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            const response = await fetch(`${API_URL}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    technician_id: technician?.id || booking?.technician_id,
                    booking_id: booking?.id,
                    rating,
                    title: title || null,
                    comment: comment || null
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit review');
            }

            toast({
                title: hasExistingReview ? "Review Updated" : "Review Submitted",
                description: hasExistingReview
                    ? "Your review has been updated successfully."
                    : "Thank you for your feedback! You've earned 50 loyalty points."
            });

            if (onReviewSubmitted) {
                onReviewSubmitted();
            }
            onClose();
        } catch (error) {
            console.error('Review submission error:', error);
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: error.message || "Failed to submit review. Please try again."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= (hoveredRating || rating);
            return (
                <button
                    key={star}
                    type="button"
                    className={`p-1 transition-transform hover:scale-110 ${isFilled ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                >
                    <Star
                        className={`w-8 h-8 ${isFilled ? 'fill-current' : ''}`}
                    />
                </button>
            );
        });
    };

    const getRatingLabel = (rating) => {
        const labels = {
            1: 'Poor',
            2: 'Fair',
            3: 'Good',
            4: 'Very Good',
            5: 'Excellent'
        };
        return labels[rating] || 'Rate your experience';
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {hasExistingReview ? 'Update Your Review' : 'Rate Your Experience'}
                    </DialogTitle>
                    <DialogDescription>
                        {hasExistingReview
                            ? 'Edit your review for this service.'
                            : `How was your experience with ${technician?.name || 'the technician'}?`
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center py-4">
                        <div className="flex gap-1">
                            {renderStars()}
                        </div>
                        <p className="mt-2 text-sm font-medium text-muted-foreground">
                            {getRatingLabel(hoveredRating || rating)}
                        </p>
                    </div>

                    {/* Review Title */}
                    <div className="space-y-2">
                        <Label htmlFor="review-title">Review Title (Optional)</Label>
                        <input
                            id="review-title"
                            type="text"
                            placeholder="Summarize your experience"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        />
                    </div>

                    {/* Review Comment */}
                    <div className="space-y-2">
                        <Label htmlFor="review-comment">Your Review</Label>
                        <Textarea
                            id="review-comment"
                            placeholder="Tell us more about your experience with the technician..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                    </div>

                    <DialogFooter className="flex gap-2 justify-end mt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting || rating === 0}>
                            {isSubmitting ? (
                                <>
                                    <span className="animate-spin mr-2">⏳</span>
                                    Submitting...
                                </>
                            ) : (
                                hasExistingReview ? 'Update Review' : 'Submit Review'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RatingReviewDialog;
