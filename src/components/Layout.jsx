import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
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
