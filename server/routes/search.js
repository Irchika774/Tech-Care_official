import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { successResponse, errorResponse } from '../lib/response.js';

const router = express.Router();

// POST /api/search/technicians - Search and filter technicians
router.post('/technicians', async (req, res) => {
    try {
        const {
            searchTerm,
            serviceType,
            brands,
            specializations,
            minRating,
            maxPrice,
            sortBy = 'rating',
            limit = 20,
            skip = 0
        } = req.body;

        let query = supabaseAdmin
            .from('technicians')
            .select('*', { count: 'exact' });

        // Text search
        if (searchTerm) {
            query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
        }

        // Service type/expertise filter
        if (serviceType) {
            query = query.contains('expertise', [serviceType]);
        }

        // Brand filter
        if (brands && brands.length > 0) {
            query = query.contains('brands', brands);
        }

        // Specialization filter
        if (specializations && specializations.length > 0) {
            query = query.contains('specialization', specializations);
        }

        // Rating filter
        if (minRating) {
            query = query.gte('rating', parseFloat(minRating));
        }

        // Price filter
        if (maxPrice) {
            query = query.lte('price_range_min', parseFloat(maxPrice));
        }

        // Sorting
        if (sortBy === 'rating') {
            query = query.order('rating', { ascending: false });
        } else if (sortBy === 'price') {
            query = query.order('price_range_min', { ascending: true });
        } else {
            query = query.order('created_at', { ascending: false });
        }

        const { data: technicians, count, error } = await query
            .range(skip, skip + limit - 1);

        if (error) throw error;

        return successResponse(res, {
            technicians: technicians || [],
            total: count || 0,
            hasMore: (count || 0) > skip + limit
        });
    } catch (error) {
        console.error('Technician search error:', error);
        return errorResponse(res, 'Failed to search technicians');
    }
});

// GET /api/search/filters - Get available filter options
router.get('/filters', async (req, res) => {
    try {
        // In a real app, these might be stored in a config table or derived from active technicians
        const { data: techs } = await supabaseAdmin
            .from('technicians')
            .select('brands, specialization, expertise');

        const brands = [...new Set(techs?.flatMap(t => t.brands || []) || [])].sort();
        const specializations = [...new Set(techs?.flatMap(t => t.specialization || []) || [])].sort();
        const expertise = [...new Set(techs?.flatMap(t => t.expertise || []) || [])].sort();

        return successResponse(res, {
            brands,
            specializations,
            expertise,
            priceRange: { minPrice: 0, maxPrice: 10000, avgPrice: 2000 }
        });
    } catch (error) {
        console.error('Get filters error:', error);
        return errorResponse(res, 'Failed to get filter options');
    }
});

export default router;
