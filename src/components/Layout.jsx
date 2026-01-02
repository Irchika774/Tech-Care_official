import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const normalizedPath = location.pathname.toLowerCase().replace(/\/$/, '') || '/';
    const darkRoutes = [
        '/mobile-repair', '/pc-repair', '/company', '/services', '/schedule',
        '/technicians', '/support', '/login', '/register', '/customer-dashboard',
        '/technician-dashboard', '/admin', '/bidding', '/account', '/settings',
        '/history', '/favorites', '/compare', '/payment', '/payment-success',
        '/reviews', '/terms', '/privacy', '/diagnostics', '/service-areas'
    ];
    const isDarkPage = darkRoutes.includes(normalizedPath);

    if (isHomePage) {
        return (
            <div className="flex flex-col min-h-screen bg-black text-white font-sans antialiased">
                <main className="flex-1 w-full h-full p-0 m-0">
                    {children}
                </main>
            </div>
        );
    }

    if (isDarkPage) {
        return (
            <div className="flex flex-col min-h-screen bg-black text-white font-sans antialiased">
                <Header />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans antialiased">
            <Header />
            <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
