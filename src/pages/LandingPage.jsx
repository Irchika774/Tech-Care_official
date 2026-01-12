import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: '📱',
            title: 'Mobile Repair',
            description: 'Expert repairs for smartphones and tablets. Screen replacements, battery fixes, water damage recovery, and more. Same-day service available with warranty protection.'
        },
        {
            icon: '💻',
            title: 'PC & Laptop Repair',
            description: 'Professional computer repair services. Hardware upgrades, virus removal, data recovery, and performance optimization by certified technicians.'
        },
        {
            icon: '⭐',
            title: 'Verified Technicians',
            description: 'All technicians are background-checked, certified, and rated by real customers. Average 4.8/5 rating across 50,000+ completed repairs.'
        },
        {
            icon: '🗺️',
            title: 'Location-Based',
            description: 'Find nearby technicians with Google Maps integration. Real-time tracking, accurate ETAs, and transparent location sharing for peace of mind.'
        },
        {
            icon: '💳',
            title: 'Secure Payments',
            description: 'Industry-standard encryption and Stripe integration. Multiple payment options with instant receipts and refund protection for your security.'
        },
        {
            icon: '🔔',
            title: 'Real-Time Updates',
            description: 'Live notifications for booking confirmations, technician arrivals, repair progress, and completion. Stay informed every step of the way.'
        },
        {
            icon: '🛡️',
            title: 'Quality Guarantee',
            description: 'All repairs come with warranty coverage. Satisfaction guaranteed or money back. We stand behind every repair with confidence.'
        },
        {
            icon: '⚡',
            title: 'Fast Service',
            description: 'Average response time under 2 hours. Same-day repairs available for most common issues. Express service for urgent situations.'
        },
        {
            icon: '🎯',
            title: 'Competitive Bidding',
            description: 'Technicians bid on your job, ensuring competitive prices. Compare quotes, ratings, and availability before choosing the perfect match.'
        }
    ];

    const stats = [
        { value: '10,000+', label: 'Happy Customers' },
        { value: '50,000+', label: 'Repairs Completed' },
        { value: '500+', label: 'Expert Technicians' },
        { value: '4.8/5', label: 'Average Rating' }
    ];

    const partners = [
        'Google Maps API',
        'Stripe Payments',
        'MongoDB',
        'React',
        'Node.js',
        'Express'
    ];

    return (
        <>
            <SEO
                title="TechCare - Professional Device Repair Platform"
                description="Connect with verified technicians for mobile, PC, and electronics repair. Fast, reliable, and secure service."
            />

            <div className="landing-page">
                {/* Navigation */}
                <nav className={`landing-navbar ${scrolled ? 'scrolled' : ''}`}>
                    <div className="nav-container">
                        <div className="logo" onClick={() => navigate('/')}>TechCare</div>
                        <div className="nav-links">
                            <a href="#about" className="nav-link">About</a>
                            <a href="#features" className="nav-link">Features</a>
                            <a href="#stats" className="nav-link">Stats</a>
                            <a href="#contact" className="nav-link">Contact</a>
                            <button onClick={() => navigate('/')} className="cta-button">
                                Get Started
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <header className="hero" id="section-home">
                    <div className="hero-video-wrapper">
                        <video autoPlay muted loop playsInline className="hero-video">
                            <source src="https://assets.mprez.fr/lithosquare/lithosquare.mp4" type="video/mp4" />
                            <source src="https://assets.mprez.fr/lithosquare/lithosquare.webm" type="video/webm" />
                        </video>
                        <div className="hero-overlay"></div>
                    </div>
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Professional<br />Device Repair
                        </h1>
                        <p className="hero-subtitle">
                            TechCare redefines device repair by connecting customers with verified technicians.
                            Fast service, expert care, transparent pricing, and guaranteed quality.
                        </p>
                        <div className="hero-buttons">
                            <button
                                onClick={() => {
                                    const el = document.getElementById('features');
                                    el?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="hero-button primary"
                            >
                                Learn More
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="hero-button secondary"
                            >
                                Join Us
                            </button>
                        </div>
                    </div>
                </header>

                {/* About Section */}
                <section className="section" id="about">
                    <h2 className="section-title">Building Reliable Connections</h2>
                    <p className="section-subtitle">
                        Device repairs are essential to our digital lives, but finding trustworthy technicians is challenging.
                        We drive the shift with verified professionals and transparent processes built for reliability.
                    </p>

                    <div className="features-grid" id="features">
                        {features.map((feature, index) => (
                            <div 
                              key={index} 
                              className="feature-card"
                              id={feature.title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}
                            >
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mobile & PC Repair Sections (Hidden or part of features) */}
                <div id="mobile-repair" className="sr-only">Mobile Repair Section</div>
                <div id="pc-repair" className="sr-only">PC Repair Section</div>

                {/* Stats Section */}
                <section className="stats-section" id="stats">
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-item">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Terms & Privacy Placeholders for Scroll */}
                <div id="terms" className="sr-only">Terms of Service</div>
                <div id="privacy" className="sr-only">Privacy Policy</div>

                {/* Partners Section */}
                <section className="partners-section">
                    <h2 className="section-title">Trusted By Industry Leaders</h2>
                    <div className="partners-grid">
                        {partners.map((partner, index) => (
                            <div key={index} className="partner-logo">{partner}</div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="cta-section" id="contact">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Get Started?</h2>
                        <p className="cta-description">
                            Join thousands of satisfied customers who trust TechCare for all their device repair needs.
                            Fast, reliable, and secure service is just a click away.
                        </p>
                        <div className="hero-buttons">
                            <button
                                onClick={() => navigate('/register')}
                                className="hero-button primary"
                            >
                                Create Account
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="hero-button secondary"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="landing-footer">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3>TechCare</h3>
                            <p>
                                Professional device repair platform connecting customers with verified technicians.
                            </p>
                        </div>
                        <div className="footer-section">
                            <h3>Services</h3>
                            <ul className="footer-links">
                                <li><a onClick={() => navigate('/mobile-repair')}>Mobile Repair</a></li>
                                <li><a onClick={() => navigate('/pc-repair')}>PC Repair</a></li>
                                <li><a onClick={() => navigate('/services')}>All Services</a></li>
                                <li><a onClick={() => navigate('/pricing')}>Pricing</a></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h3>Company</h3>
                            <ul className="footer-links">
                                <li><a onClick={() => {
                                    const el = document.getElementById('about');
                                    el?.scrollIntoView({ behavior: 'smooth' });
                                }}>About Us</a></li>
                                <li><a onClick={() => {
                                    const el = document.getElementById('contact');
                                    el?.scrollIntoView({ behavior: 'smooth' });
                                }}>Contact</a></li>
                                <li><a onClick={() => navigate('/register')}>Become a Technician</a></li>
                                <li><a onClick={() => navigate('/blog')}>Blog</a></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h3>Legal</h3>
                            <ul className="footer-links">
                                <li><a onClick={() => navigate('/privacy')}>Privacy Policy</a></li>
                                <li><a onClick={() => navigate('/terms')}>Terms of Service</a></li>
                                <li><a onClick={() => {
                                    const el = document.getElementById('features');
                                    el?.scrollIntoView({ behavior: 'smooth' });
                                }}>Our Team</a></li>
                                <li><a onClick={() => navigate('/support')}>Support</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2025 TechCare. All rights reserved. Made with ❤️ for the tech repair industry.</p>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default LandingPage;
