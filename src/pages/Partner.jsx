import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Partner = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <SEO
                title="Partner with Us - TechCare"
                description="Grow your repair business by partnering with TechCare. Get access to more customers and professional tools."
            />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-secondary to-primary text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Grow Your Repair Business
                    </h1>
                    <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8">
                        Join the TechCare network and start receiving high-quality repair leads in your area today.
                    </p>
                    <Link to="/register">
                        <button className="bg-white text-secondary hover:bg-gray-100 font-bold py-4 px-10 rounded-full text-xl transition-all shadow-xl">
                            Apply to Partner
                        </button>
                    </Link>
                </div>
            </section>

            <main className="container mx-auto px-4 py-16 max-w-6xl">
                {/* Benefits for Shops */}
                <section className="mb-20 text-center">
                    <h2 className="text-3xl font-bold text-text-light dark:text-text-dark mb-12">
                        Why Partner with TechCare?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-6">
                            <div className="text-5xl mb-4">📈</div>
                            <h3 className="text-xl font-bold mb-2">More Customers</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Get access to a steady stream of customers looking for repairs in your specific area.
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="text-5xl mb-4">🛠️</div>
                            <h3 className="text-xl font-bold mb-2">Business Tools</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Use our professional dashboard to manage bookings, payments, and customer communications.
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="text-5xl mb-4">💳</div>
                            <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Never worry about collections. We handle all payments and deposit them directly to you.
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="text-5xl mb-4">🌟</div>
                            <h3 className="text-xl font-bold mb-2">Brand Growth</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Build your online reputation with verified customer reviews and our "TechCare Partner" badge.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Who we look for */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <div>
                        <h2 className="text-3xl font-bold text-text-light dark:text-text-dark mb-6">
                            Who are we looking for?
                        </h2>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <span className="text-green-500 font-bold">✓</span>
                                <p className="text-gray-700 dark:text-gray-300">Established repair shops with a physical location.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-green-500 font-bold">✓</span>
                                <p className="text-gray-700 dark:text-gray-300">Independent technicians with 3+ years of professional experience.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-green-500 font-bold">✓</span>
                                <p className="text-gray-700 dark:text-gray-300">Commitment to high-quality parts and exceptional service.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-green-500 font-bold">✓</span>
                                <p className="text-gray-700 dark:text-gray-300">Active business registration or professional certifications.</p>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-800 rounded-3xl h-80 flex items-center justify-center text-gray-500 text-xl italic shadow-inner">
                        [ Image of a Professional Repair Shop ]
                    </div>
                </section>

                {/* Success Stories */}
                <section className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-8 md:p-12 mb-20">
                    <h2 className="text-2xl font-bold text-center mb-10">Partner Success Stories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <blockquote className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow">
                            <p className="text-gray-600 dark:text-gray-300 italic mb-6">
                                "Since joining TechCare, my shop's monthly bookings have increased by 40%. The platform is so easy to use, and I love that I don't have to worry about marketing anymore."
                            </p>
                            <cite className="font-bold text-text-light dark:text-text-dark not-italic">
                                - Kamal, Owner of K-Tech Solutions
                            </cite>
                        </blockquote>
                        <blockquote className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow">
                            <p className="text-gray-600 dark:text-gray-300 italic mb-6">
                                "The secure payment system is a game-changer. I know I'll get paid on time for every job I complete. TechCare has really helped me professionalize my freelance work."
                            </p>
                            <cite className="font-bold text-text-light dark:text-text-dark not-italic">
                                - Sarah, Independent Technician
                            </cite>
                        </blockquote>
                    </div>
                </section>

                {/* Application Form */}
                {/* CTA Section */}
                <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of verified technicians on TechCare. Creating an account takes less than 2 minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register">
                            <button className="w-full sm:w-auto bg-secondary hover:bg-secondary-dark text-white font-bold py-4 px-10 rounded-full text-lg transition-all shadow-lg transform hover:scale-105">
                                Create Technician Account
                            </button>
                        </Link>
                        <Link to="/how-it-works">
                            <button className="w-full sm:w-auto bg-transparent border-2 border-gray-300 dark:border-gray-600 hover:border-secondary text-gray-700 dark:text-gray-200 font-bold py-4 px-10 rounded-full text-lg transition-all">
                                Learn More
                            </button>
                        </Link>
                    </div>
                    <p className="mt-6 text-sm text-gray-500">
                        Already have an account? <Link to="/login" className="text-secondary hover:underline font-bold">Log in here</Link>
                    </p>
                </section>
            </main>
        </div>
    );
};

export default Partner;
