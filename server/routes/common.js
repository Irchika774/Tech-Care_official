import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { successResponse, errorResponse } from '../lib/response.js';

const router = express.Router();

// Submit job application
router.post('/apply', async (req, res) => {
    try {
        const { jobId, name, email, phone, resume_url, cover_letter } = req.body;

        const { data, error } = await supabaseAdmin
            .from('job_applications')
            .insert([{
                job_id: jobId,
                candidate_name: name,
                candidate_email: email,
                candidate_phone: phone,
                resume_url,
                cover_letter,
                status: 'pending',
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return successResponse(res, data, 'Application submitted successfully', 201);
    } catch (error) {
        console.error('Job application error:', error);
        return errorResponse(res, 'Failed to submit application');
    }
});

// Submit partnership request
router.post('/partner-request', async (req, res) => {
    try {
        const { businessName, ownerName, email, phone, businessType, location, experience } = req.body;

        const { data, error } = await supabaseAdmin
            .from('partner_requests')
            .insert([{
                business_name: businessName,
                owner_name: ownerName,
                email,
                phone,
                business_type: businessType,
                location,
                experience,
                status: 'pending',
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return successResponse(res, data, 'Partnership request submitted successfully', 201);
    } catch (error) {
        console.error('Partner request error:', error);
        return errorResponse(res, 'Failed to submit partner request');
    }
});

export default router;
