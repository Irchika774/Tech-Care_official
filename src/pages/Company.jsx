import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Company = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const team = [
        {
            name: 'Saman Perera',
            role: 'CEO & Founder',
            image: '👨‍💼',
            bio: '15+ years in tech industry, passionate about connecting skilled technicians with customers'
        },
        {
            name: 'Nisha Fernando',
            role: 'CTO',
            image: '👩‍💻',
            bio: 'Tech enthusiast with expertise in platform development and scalability'
        },
        {
            name: 'Rohan Silva',
            role: 'Head of Operations',
            image: '👨‍💼',
            bio: 'Ensures smooth operations and quality service delivery'
        },
        {
            name: 'Amali Jayasinghe',
            role: 'Customer Success Manager',
            image: '👩‍💼',
            bio: 'Dedicated to ensuring customer satisfaction and resolving issues'
        }
    ];

    const milestones = [
        { year: '2023', event: 'TechCare Founded', description: 'Started with a vision to revolutionize tech repair services' },
        { year: '2023', event: '100+ Technicians', description: 'Reached our first major milestone' },
        { year: '2024', event: 'Expanded Services', description: 'Added PC repair, tablet repair, and more' },
        { year: '2024', event: '10,000+ Repairs', description: 'Successfully completed thousands of repairs' },
        { year: '2025', event: 'Going Global', description: 'Expanding to international markets' }
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <SEO
                title="About Us - TechCare"
                description="Learn about TechCare's mission to revolutionize device repair. Meet our team and discover our story."
                keywords="about techcare, company profile, tech repair mission, our team"
            />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        About TechCare
                    </h1>
                    <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
                        Connecting people with expert tech support, one repair at a time
                    </p>
                </div>
            </section>

            <main className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Mission & Vision */}
                <section className="mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                            <div className="text-4xl mb-4">🎯</div>
                            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
                                Our Mission
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                To make quality tech repair services accessible to everyone by connecting skilled technicians with customers who need help. We believe that everyone deserves reliable, affordable, and professional tech support.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                            <div className="text-4xl mb-4">🔭</div>
                            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
                                Our Vision
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                To become the world's most trusted platform for tech repair services, where both customers and technicians can connect, transact, and grow together in a transparent and efficient ecosystem.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Story */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-center text-text-light dark:text-text-dark mb-8">
                        Our Story
                    </h2>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            TechCare was born from a simple frustration: finding a reliable technician to fix a broken phone was harder than it should be. Our founders experienced countless bad repairs, overpricing, and lack of transparency in the tech repair industry.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            We realized that while there were many skilled technicians, customers had no easy way to find and trust them. Similarly, talented technicians struggled to find customers and grow their businesses.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            TechCare bridges this gap. We've created a platform where verified technicians can showcase their skills, and customers can find them with confidence. With transparent pricing, reviews, and ratings, we're bringing trust back to tech repairs.
                        </p>
                    </div>
                </section>

                {/* Values */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-center text-text-light dark:text-text-dark mb-8">
                        Our Values
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                            <div className="text-4xl mb-3">🤝</div>
                            <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                                Trust
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Building trust through transparency and verification
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                            <div className="text-4xl mb-3">⭐</div>
                            <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                                Quality
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Maintaining high standards in service delivery
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                            <div className="text-4xl mb-3">💡</div>
                            <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                                Innovation
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Continuously improving our platform and services
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                            <div className="text-4xl mb-3">🌟</div>
                            <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                                Excellence
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Striving for excellence in everything we do
                            </p>
                        </div>
                    </div>
                </section>

                {/* Team */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-center text-text-light dark:text-text-dark mb-8">
                        Meet Our Team
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {team.map((member, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                                <div className="text-6xl mb-4">{member.image}</div>
                                <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-primary font-medium mb-3">{member.role}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {member.bio}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Milestones */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-center text-text-light dark:text-text-dark mb-8">
                        Our Journey
                    </h2>
                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary hidden md:block"></div>
                        <div className="space-y-8">
                            {milestones.map((milestone, index) => (
                                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                    <div className="flex-1"></div>
                                    <div className="relative flex items-center justify-center">
                                        <div className="w-4 h-4 bg-primary rounded-full border-4 border-white dark:border-gray-900"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mx-4">
                                            <div className="text-primary font-bold text-lg mb-2">{milestone.year}</div>
                                            <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                                                {milestone.event}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {milestone.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="mb-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-lg shadow-lg p-6 text-center">
                            <div className="text-4xl font-bold mb-2">500+</div>
                            <div className="text-sm opacity-90">Verified Technicians</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6 text-center">
                            <div className="text-4xl font-bold mb-2">15K+</div>
                            <div className="text-sm opacity-90">Repairs Completed</div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6 text-center">
                            <div className="text-4xl font-bold mb-2">4.8/5</div>
                            <div className="text-sm opacity-90">Average Rating</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6 text-center">
                            <div className="text-4xl font-bold mb-2">98%</div>
                            <div className="text-sm opacity-90">Customer Satisfaction</div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-gradient-to-r from-primary to-secondary rounded-lg p-8 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Join the TechCare Community</h2>
                    <p className="text-xl mb-6 opacity-90">
                        Whether you need a repair or want to offer your services, we're here for you
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/schedule"
                            className="inline-block bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
                        >
                            Find a Technician
                        </Link>
                        <Link
                            to="/register"
                            className="inline-block bg-transparent border-2 border-white hover:bg-white hover:text-primary text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
                        >
                            Become a Technician
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Company;
