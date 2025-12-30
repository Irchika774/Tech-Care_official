import React from 'react';

const Home = () => {
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