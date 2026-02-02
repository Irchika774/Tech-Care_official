import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';
import { successResponse, errorResponse } from '../lib/response.js';

const router = express.Router();

// Get all reviews with pagination and filters
router.get('/', async (req, res) => {
    try {
        const {
            limit = 20,
            skip = 0,
            technicianId,
            customerId,
            rating,
            sortBy = 'created_at',
            sortOrder = 'desc'
        } = req.query;

        let query = supabaseAdmin
            .from('reviews')
            .select(`
                *,
                technician:technician_id (id, name, profile_image, services),
                customer:customer_id (id, name, profile_image),
                booking:booking_id (id, device_type, device_brand, device_model, issue_type)
            `, { count: 'exact' });

        // Apply filters
        if (technicianId) {
            query = query.eq('technician_id', technicianId);
        }
        if (customerId) {
            query = query.eq('customer_id', customerId);
        }
        if (rating) {
            query = query.eq('rating', parseInt(rating));
        }

        // Apply sorting
        const validSortFields = ['created_at', 'rating', 'helpful_count'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
        query = query.order(sortField, { ascending: sortOrder === 'asc' });

        // Apply pagination
        query = query.range(parseInt(skip), parseInt(skip) + parseInt(limit) - 1);

        const { data: reviews, count, error } = await query;

        if (error) throw error;

        // Calculate average rating if technician filter is applied
        let averageRating = null;
        if (technicianId) {
            const { data: avgData } = await supabaseAdmin
                .from('reviews')
                .select('rating')
                .eq('technician_id', technicianId);

            if (avgData && avgData.length > 0) {
                averageRating = avgData.reduce((sum, r) => sum + r.rating, 0) / avgData.length;
            }
        }

        return successResponse(res, {
            reviews: reviews || [],
            total: count || 0,
            averageRating: averageRating ? parseFloat(averageRating.toFixed(1)) : null,
            hasMore: (count || 0) > parseInt(skip) + parseInt(limit),
            pagination: {
                limit: parseInt(limit),
                skip: parseInt(skip),
                total: count || 0
            }
        });
    } catch (error) {
        console.error('Reviews fetch error:', error);
        return errorResponse(res, 'Failed to fetch reviews');
    }
});

// Get a single review
router.get('/:id', async (req, res) => {
    try {
        const { data: review, error } = await supabaseAdmin
            .from('reviews')
            .select(`
                *,
                technician:technician_id (id, name, profile_image, services),
                customer:customer_id (id, name, profile_image),
                booking:booking_id (id, device_type, device_brand, device_model, issue_type)
            `)
            .eq('id', req.params.id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return errorResponse(res, 'Review not found', 404);
            }
            throw error;
        }

        return successResponse(res, review);
    } catch (error) {
        console.error('Review fetch error:', error);
        return errorResponse(res, 'Failed to fetch review');
    }
});

// Create a new review (requires authentication)
router.post('/', supabaseAuth, async (req, res) => {
    try {
        const {
            technician_id,
            booking_id,
            rating,
            title,
            comment,
            service_quality,
            communication,
            value_for_money,
            would_recommend
        } = req.body;

        // Validate required fields
        if (!technician_id || !rating) {
            return errorResponse(res, 'Missing required fields: technician_id and rating are required', 400);
        }

        if (rating < 1 || rating > 5) {
            return errorResponse(res, 'Rating must be between 1 and 5', 400);
        }

        // Get customer ID from authenticated user
        const customerId = req.user.customerId || req.user.id;

        // Check if user has already reviewed this technician for this booking
        if (booking_id) {
            const { data: existingReview } = await supabaseAdmin
                .from('reviews')
                .select('id')
                .eq('customer_id', customerId)
                .eq('technician_id', technician_id)
                .eq('booking_id', booking_id)
                .single();

            if (existingReview) {
                return errorResponse(res, 'You have already reviewed this technician for this booking', 400);
            }
        }

        // Create the review
        const { data: review, error } = await supabaseAdmin
            .from('reviews')
            .insert([{
                customer_id: customerId,
                technician_id,
                booking_id: booking_id || null,
                rating,
                title: title || null,
                comment: comment || null,
                service_quality: service_quality || rating,
                communication: communication || rating,
                value_for_money: value_for_money || rating,
                would_recommend: would_recommend !== false,
                helpful_count: 0,
                status: 'published'
            }])
            .select(`
                *,
                technician:technician_id (id, name),
                customer:customer_id (id, name)
            `)
            .single();

        if (error) throw error;

        // Update technician's average rating
        await updateTechnicianRating(technician_id);

        // Notify technician about the new review
        try {
            const { data: techData } = await supabaseAdmin
                .from('technicians')
                .select('user_id')
                .eq('id', technician_id)
                .single();

            if (techData?.user_id) {
                await supabaseAdmin.from('notifications').insert([{
                    user_id: techData.user_id,
                    title: 'New Review Received! ⭐',
                    message: `You received a ${rating}-star review${title ? `: "${title}"` : ''}.`,
                    type: 'review_received',
                    data: { review_id: review.id, booking_id: booking_id, rating }
                }]);
            }
        } catch (notifyError) {
            console.error('Failed to notify technician about review:', notifyError);
        }

        // AWARD LOYALTY POINTS FOR REVIEW
        try {
            const pointsToAward = 50;
            const { data: customer } = await supabaseAdmin
                .from('customers')
                .select('loyalty_points')
                .eq('id', customerId)
                .single();

            const newPoints = (customer?.loyalty_points || 0) + pointsToAward;

            await supabaseAdmin
                .from('customers')
                .update({ loyalty_points: newPoints })
                .eq('id', customerId);

            await supabaseAdmin.from('notifications').insert([{
                user_id: customerId,
                title: 'Review Bonus Earned! ⭐',
                message: `You've earned ${pointsToAward} loyalty points for leaving a review.`,
                type: 'loyalty_earned',
                data: { points: pointsToAward, total: newPoints }
            }]);
        } catch (loyaltyError) {
            console.error('Failed to award review loyalty points:', loyaltyError);
        }

        return successResponse(res, review, 'Review created successfully', 201);
    } catch (error) {
        console.error('Review creation error:', error);
        return errorResponse(res, 'Failed to create review');
    }
});

// Update a review (only by the author)
router.patch('/:id', supabaseAuth, async (req, res) => {
    try {
        const customerId = req.user.customerId || req.user.id;

        // Check ownership or admin status
        const { data: existingReview } = await supabaseAdmin
            .from('reviews')
            .select('customer_id, technician_id')
            .eq('id', req.params.id)
            .single();

        if (!existingReview) {
            return errorResponse(res, 'Review not found', 404);
        }

        const isAdmin = req.user.role === 'admin';

        if (existingReview.customer_id !== customerId && !isAdmin) {
            return errorResponse(res, 'You can only edit your own reviews', 403);
        }

        const allowedFields = ['rating', 'title', 'comment', 'service_quality', 'communication', 'value_for_money', 'would_recommend', 'status'];
        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                if (field === 'status' && !isAdmin) continue;
                updates[field] = req.body[field];
            }
        }

        if (isAdmin && req.body.status) {
            updates.status = req.body.status;
        }
        updates.updated_at = new Date().toISOString();

        const { data: review, error } = await supabaseAdmin
            .from('reviews')
            .update(updates)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;

        // Update technician's average rating if rating changed
        if (updates.rating) {
            await updateTechnicianRating(existingReview.technician_id);
        }

        return successResponse(res, review, 'Review updated successfully');
    } catch (error) {
        console.error('Review update error:', error);
        return errorResponse(res, 'Failed to update review');
    }
});

// Delete a review (only by the author or admin)
router.delete('/:id', supabaseAuth, async (req, res) => {
    try {
        const customerId = req.user.customerId || req.user.id;
        const isAdmin = req.user.role === 'admin';

        // Check ownership
        const { data: existingReview } = await supabaseAdmin
            .from('reviews')
            .select('customer_id, technician_id')
            .eq('id', req.params.id)
            .single();

        if (!existingReview) {
            return errorResponse(res, 'Review not found', 404);
        }

        if (existingReview.customer_id !== customerId && !isAdmin) {
            return errorResponse(res, 'You can only delete your own reviews', 403);
        }

        const { error } = await supabaseAdmin
            .from('reviews')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;

        // Update technician's average rating
        await updateTechnicianRating(existingReview.technician_id);

        return successResponse(res, null, 'Review deleted successfully');
    } catch (error) {
        console.error('Review deletion error:', error);
        return errorResponse(res, 'Failed to delete review');
    }
});

// Mark a review as helpful
router.post('/:id/helpful', supabaseAuth, async (req, res) => {
    try {
        const { data: review, error } = await supabaseAdmin
            .from('reviews')
            .select('helpful_count')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;

        const { data: updatedReview, error: updateError } = await supabaseAdmin
            .from('reviews')
            .update({ helpful_count: (review.helpful_count || 0) + 1 })
            .eq('id', req.params.id)
            .select()
            .single();

        if (updateError) throw updateError;

        return successResponse(res, { helpful_count: updatedReview.helpful_count }, 'Marked as helpful');
    } catch (error) {
        console.error('Helpful mark error:', error);
        return errorResponse(res, 'Failed to mark review as helpful');
    }
});

// Report a review
router.post('/:id/report', supabaseAuth, async (req, res) => {
    try {
        const { reason } = req.body;
        const reporterId = req.user.customerId || req.user.technicianId || req.user.id;

        const { error } = await supabaseAdmin
            .from('reviews')
            .update({
                status: 'flagged',
                report_reason: reason,
                reported_by: reporterId,
                reported_at: new Date().toISOString()
            })
            .eq('id', req.params.id);

        if (error) throw error;

        return successResponse(res, null, 'Review reported successfully');
    } catch (error) {
        console.error('Review report error:', error);
        return errorResponse(res, 'Failed to report review');
    }
});

// Get review statistics for a technician
router.get('/stats/:technicianId', async (req, res) => {
    try {
        const { technicianId } = req.params;

        const { data: reviews, error } = await supabaseAdmin
            .from('reviews')
            .select('rating, service_quality, communication, value_for_money, would_recommend')
            .eq('technician_id', technicianId)
            .eq('status', 'published');

        if (error) throw error;

        if (!reviews || reviews.length === 0) {
            return successResponse(res, {
                totalReviews: 0,
                averageRating: 0,
                ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                categoryAverages: {
                    service_quality: 0,
                    communication: 0,
                    value_for_money: 0
                },
                recommendationRate: 0
            });
        }

        // Calculate statistics
        const totalReviews = reviews.length;
        const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

        // Rating distribution
        const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(r => {
            ratingDistribution[r.rating] = (ratingDistribution[r.rating] || 0) + 1;
        });

        // Category averages
        const categoryAverages = {
            service_quality: reviews.reduce((sum, r) => sum + (r.service_quality || r.rating), 0) / totalReviews,
            communication: reviews.reduce((sum, r) => sum + (r.communication || r.rating), 0) / totalReviews,
            value_for_money: reviews.reduce((sum, r) => sum + (r.value_for_money || r.rating), 0) / totalReviews
        };

        // Recommendation rate
        const recommendCount = reviews.filter(r => r.would_recommend !== false).length;
        const recommendationRate = (recommendCount / totalReviews) * 100;

        return successResponse(res, {
            totalReviews,
            averageRating: parseFloat(averageRating.toFixed(1)),
            ratingDistribution,
            categoryAverages: {
                service_quality: parseFloat(categoryAverages.service_quality.toFixed(1)),
                communication: parseFloat(categoryAverages.communication.toFixed(1)),
                value_for_money: parseFloat(categoryAverages.value_for_money.toFixed(1))
            },
            recommendationRate: parseFloat(recommendationRate.toFixed(0))
        });
    } catch (error) {
        console.error('Review stats error:', error);
        return errorResponse(res, 'Failed to fetch review statistics');
    }
});

// Helper function to update technician's average rating
async function updateTechnicianRating(technicianId) {
    try {
        const { data: reviews } = await supabaseAdmin
            .from('reviews')
            .select('rating')
            .eq('technician_id', technicianId)
            .eq('status', 'published');

        if (reviews && reviews.length > 0) {
            const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

            await supabaseAdmin
                .from('technicians')
                .update({
                    rating: parseFloat(avgRating.toFixed(1)),
                    total_reviews: reviews.length
                })
                .eq('id', technicianId);
        }
    } catch (error) {
        // Log error but don't reject
        console.error('Error updating technician rating:', error);
    }
}

export default router;
