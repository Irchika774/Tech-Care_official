import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const HowItWorks = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const steps = [
        {
            title: 'Request a Service',
            description: 'Tell us what is wrong with your device. Choose from our list of services or describe a custom problem.',
            icon: '📝',
            color: 'bg-blue-100 dark:bg-blue-900/30'
        },
        {
            title: 'Browse & Compare',
            description: 'View profiles of verified technicians in your area. Compare their ratings, reviews, and previous work.',
            icon: '🔍',
            color: 'bg-purple-100 dark:bg-purple-900/30'
        },
        {
            title: 'Book & Pay Securely',
            description: 'Schedule a time that works for you. Pay securely through our platform to ensure your money is protected.',
            icon: '💳',
            color: 'bg-green-100 dark:bg-green-900/30'
        },
        {
            title: 'Get it Fixed',
            description: 'Meet your technician at your preferred location or visit their shop. Get your device fixed with a warranty.',
            icon: '🔧',
            color: 'bg-orange-100 dark:bg-orange-900/30'
        }
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <SEO
                title="How It Works - TechCare"
                description="Discover how TechCare makes device repair easy and reliable. From requesting a service to getting it fixed."
            />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        How TechCare Works
                    </h1>
                    <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
                        Your simple path to professional tech repair
                    </p>
                </div>
            </section>

            <main className="container mx-auto px-4 py-16 max-w-6xl">
                {/* Steps Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    {steps.map((step, index) => (
                        <div key={index} className="flex gap-6 items-start">
                            <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center text-4xl flex-shrink-0 shadow-lg`}>
                                {step.icon}
                            </div>
                            <div>
                                <div className="text-primary font-bold mb-1">STEP {index + 1}</div>
                                <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-3">
                                    {step.title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Video/Visual Placeholder */}
                <section className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-8 md:p-12 mb-20 text-center">
                    <h2 className="text-3xl font-bold text-text-light dark:text-text-dark mb-8">
                        See it in Action
                    </h2>
                    <div className="aspect-video max-w-4xl mx-auto bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-gray-400 text-xl italic shadow-inner">
                        [ Professional Explainer Video Placeholder ]
                    </div>
                </section>

                {/* Features Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-b-4 border-primary">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>🛡️</span> Buyer Protection
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            We hold your payment until the job is completed to your satisfaction. Your money is always safe with TechCare.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-b-4 border-secondary">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>📜</span> Service Warranty
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            All repairs booked through our platform come with a minimum 30-day warranty on parts and labor.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-b-4 border-green-500">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>💬</span> Real-time Chat
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Communicate directly with your technician. Ask questions, send photos of the damage, and get updates instantly.
                        </p>
                    </div>
                </section>

                {/* FAQ Link */}
                <section className="text-center">
                    <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
                        Still have questions?
                    </h2>
                    <Link 
                        to="/support" 
                        className="text-primary font-bold text-lg hover:underline"
                    >
                        Visit our Support Center →
                    </Link>
                </section>
            </main>

            {/* Final CTA */}
            <section className="bg-primary py-16 text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to experience better tech repair?
                    </h2>
                    <Link
                        to="/schedule"
                        className="bg-white text-primary hover:bg-gray-100 font-bold py-4 px-10 rounded-full text-xl transition-all hover:scale-105 inline-block shadow-xl"
                    >
                        Get Started Now
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HowItWorks;
