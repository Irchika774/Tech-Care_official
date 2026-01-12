import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user, loading, isAdmin, isTechnician, isCustomer } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            if (isAdmin()) {
                navigate('/admin');
            } else if (isTechnician()) {
                navigate('/technician-dashboard');
            } else if (isCustomer()) {
                navigate('/customer-dashboard');
            }
        }
    }, [user, loading, isAdmin, isTechnician, isCustomer, navigate]);

    // Cache-busting timestamp to force reload of landing page with updated footer
    const cacheBuster = Date.now();

    return (
        <div className="w-full h-screen overflow-hidden">
            <iframe
                src={`/landing/www.techcare.com/index.html?v=${cacheBuster}`}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="TechCare Landing Page"
            />
        </div>
    );
};

export default Home;