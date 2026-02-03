import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';
import { successResponse, errorResponse } from '../lib/response.js';

const router = express.Router();

const mockPosts = [
    {
        id: '1',
        title: 'Essential Smartphone Maintenance Tips',
        content: 'Learn how to extend your battery life and keep your screen scratch-free with these simple daily habits. Modern smartphones are marvels of engineering, but they still need care...',
        author: 'Sarah Chen',
        category: 'Maintenance',
        image_url: 'https://images.unsplash.com/photo-1512054502232-120feb11f725?q=80&w=2000',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        tags: ['battery', 'screen', 'tips']
    },
    {
        id: '2',
        title: 'Common Laptop Issues & How to Fix Them',
        content: 'From overheating to keyboard failures, we cover the most frequent problems laptop users face and when to seek professional help. Overheating is the number one enemy of performance...',
        author: 'Mike Ross',
        category: 'Repair Guide',
        image_url: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=2000',
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        tags: ['laptop', 'hardware', 'guide']
    },
    {
        id: '3',
        title: 'The Future of Right to Repair',
        content: 'Understanding the new legislation and what it means for device owners and independent repair shops. The movement is gaining momentum across the globe...',
        author: 'TechCare Editorial',
        category: 'Industry News',
        image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000',
        created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        tags: ['news', 'legal', 'sustainability']
    }
];

// Get all blog posts
router.get('/', async (req, res) => {
    try {
        const { data: posts, error } = await supabaseAdmin
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
                console.log('Blog table missing, using mock data');
                return successResponse(res, mockPosts);
            }
            throw error;
        }
        return successResponse(res, posts);
    } catch (error) {
        console.error('Blog fetch error:', error);
        return errorResponse(res, 'Failed to fetch blog posts');
    }
});

// Get a single blog post
router.get('/:id', async (req, res) => {
    try {
        const { data: post, error } = await supabaseAdmin
            .from('blog_posts')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) {
            if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
                const post = mockPosts.find(p => p.id === req.params.id);
                if (post) return successResponse(res, post);
                return errorResponse(res, 'Post not found', 404);
            }
            throw error;
        }
        return successResponse(res, post);
    } catch (error) {
        console.error('Blog post fetch error:', error);
        return errorResponse(res, 'Failed to fetch blog post');
    }
});

// Create a blog post (Admin only)
router.post('/', supabaseAuth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return errorResponse(res, 'Only admins can create blog posts', 403);
        }

        const { title, content, author, image_url, category, tags } = req.body;

        const { data: post, error } = await supabaseAdmin
            .from('blog_posts')
            .insert([{
                title,
                content,
                author: author || req.user.name,
                image_url,
                category,
                tags,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return successResponse(res, post, 'Blog post created successfully', 201);
    } catch (error) {
        console.error('Blog creation error:', error);
        return errorResponse(res, 'Failed to create blog post');
    }
});

export default router;
