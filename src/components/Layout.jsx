import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isDarkPage = location.pathname === '/mobile-repair' || location.pathname === '/pc-repair' || location.pathname === '/company' || location.pathname === '/services' || location.pathname === '/schedule' || location.pathname === '/technicians' || location.pathname === '/support' || location.pathname === '/login' || location.pathname === '/register';

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
