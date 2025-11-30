import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Services = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const services = [
        {
            id: 1,
            title: 'Mobile Phone Repair',
            icon: '📱',
            description: 'Comprehensive mobile phone repair services for all brands',
            services: [
                'Screen replacement',
                'Battery replacement',
                'Water damage repair',
                'Charging port repair',
                'Camera repair',
                'Software troubleshooting'
            ],
            link: '/mobile-repair'
        },
        {
            id: 2,
            title: 'PC & Laptop Repair',
            icon: '💻',
            description: 'Expert PC and laptop repair services',
            services: [
                'Hardware diagnostics',
                'Component replacement',
                'OS installation',
                'Virus removal',
                'Data recovery',
                'Performance optimization'
            ],
            link: '/pc-repair'
        },
        {
            id: 3,
            title: 'Tablet Repair',
            icon: '📟',
            description: 'Professional tablet repair services',
            services: [
                'Screen repair',
                'Battery replacement',
                'Port repair',
                'Software issues',
                'Touch screen calibration',
                'Hardware upgrades'
            ],
            link: '/mobile-repair'
        },
        {
            id: 4,
            title: 'Gaming Console Repair',
            icon: '🎮',
            description: 'Gaming console repair and maintenance',
            services: [
                'PlayStation repair',
                'Xbox repair',
                'Nintendo repair',
                'Controller repair',
                'Disc drive replacement',
                'Cooling system service'
            ],
            link: '/schedule'
        },
        {
            id: 5,
            title: 'Smart Home Devices',
            icon: '🏠',
            description: 'Smart home device setup and repair',
            services: [
                'Smart speaker setup',
                'Security camera installation',
                'Smart thermostat',
                'Home automation',
                'IoT device configuration',
                'Network setup'
            ],
            link: '/schedule'
        },
        {
            id: 6,
            title: 'Accessories & Peripherals',
            icon: '⌨️',
            description: 'Repair and setup of tech accessories',
            services: [
                'Keyboard repair',
                'Mouse repair',
                'Headphone repair',
                'Monitor calibration',
                'Printer setup',
                'Speaker repair'
            ],
            link: '/schedule'
        }
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <SEO
                title="Our Services - TechCare"
                description="Explore our wide range of tech repair services including mobile, PC, tablet, and smart home device repairs."
                keywords="tech repair services, mobile repair, pc repair, tablet repair, smart home repair"
            />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Our Services
                    </h1>
                    <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
                        Professional repair services for all your tech devices
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <main className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="text-5xl mb-4">{service.icon}</div>
                            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-3">
                                {service.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                {service.description}
                            </p>
                            <ul className="space-y-2 mb-6">
                                {service.services.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start text-gray-700 dark:text-gray-300"
                                    >
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                to={service.link}
                                className="inline-block w-full text-center bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                            >
                                Book Now
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Why Choose Us */}
                <section className="mt-16">
                    <h2 className="text-3xl font-bold text-center text-text-light dark:text-text-dark mb-8">
                        Why Choose TechCare?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center p-6">
                            <div className="text-4xl mb-3">⚡</div>
                            <h3 className="text-xl font-semibold mb-2 text-text-light dark:text-text-dark">
                                Fast Service
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Quick turnaround time for most repairs
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="text-4xl mb-3">👨‍🔧</div>
                            <h3 className="text-xl font-semibold mb-2 text-text-light dark:text-text-dark">
                                Expert Technicians
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Certified and experienced professionals
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="text-4xl mb-3">💰</div>
                            <h3 className="text-xl font-semibold mb-2 text-text-light dark:text-text-dark">
                                Fair Pricing
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Transparent pricing with no hidden fees
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="text-4xl mb-3">🛡️</div>
                            <h3 className="text-xl font-semibold mb-2 text-text-light dark:text-text-dark">
                                Warranty
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                All repairs backed by warranty
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-lg p-8 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">
                        Need Help with Your Device?
                    </h2>
                    <p className="text-xl mb-6 opacity-90">
                        Get connected with expert technicians in your area
                    </p>
                    <Link
                        to="/schedule"
                        className="inline-block bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
                    >
                        Schedule a Repair
                    </Link>
                </section>
            </main>
        </div>
    );
};

export default Services;
