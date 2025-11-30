import { useEffect, useState } from 'react';
import SEO from '../components/SEO';

const Support = () => {
    const [openFaq, setOpenFaq] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const faqs = [
        {
            category: '🔧 General',
            questions: [
                {
                    q: 'How does TechCare work?',
                    a: 'TechCare connects you with verified technicians in your area. Simply describe your device issue, browse available technicians, and book a service. Technicians can also bid on your service request, allowing you to choose the best option.'
                },
                {
                    q: 'What types of devices can be repaired?',
                    a: 'We support repairs for mobile phones, laptops, PCs, tablets, gaming consoles, and other electronic devices. Our technicians specialize in various brands including Apple, Samsung, HP, Dell, and more.'
                },
                {
                    q: 'How do I book a service?',
                    a: 'Click on the type of service you need (Mobile Repair, PC Repair, etc.), browse technicians, select one you like, and schedule an appointment. You can also create a service request and let technicians bid on it.'
                }
            ]
        },
        {
            category: '💰 Pricing & Payments',
            questions: [
                {
                    q: 'How much do services cost?',
                    a: 'Prices vary by technician and service complexity. All prices are displayed in Sri Lankan Rupees (LKR) by default, automatically converted to your local currency. You can see estimated costs before booking.'
                },
                {
                    q: 'What payment methods do you accept?',
                    a: 'We accept credit/debit cards, bank transfers, and mobile payments. All payments are processed securely through our payment partners.'
                },
                {
                    q: 'Can I get a refund?',
                    a: 'Yes, if you cancel at least 24 hours before the scheduled time. For cancellations within 24 hours or disputes about service quality, please contact our support team.'
                },
                {
                    q: 'Is there a service fee?',
                    a: 'TechCare charges a small service fee to maintain the platform. This is transparently shown during checkout. Technicians pay a commission on completed jobs.'
                }
            ]
        },
        {
            category: '👤 Account & Profile',
            questions: [
                {
                    q: 'How do I create an account?',
                    a: 'Click "Register" in the top right, choose your role (Customer or Technician), and fill in your details. Email verification may be required.'
                },
                {
                    q: 'Can I be both a customer and a technician?',
                    a: 'Currently, each account must be either a customer or technician. However, you can create separate accounts with different email addresses.'
                },
                {
                    q: 'How do I update my profile?',
                    a: 'Log in and go to your Profile or Account page. You can update your name, contact information, address, and other details.'
                },
                {
                    q: 'I forgot my password. What do I do?',
                    a: 'Click "Forgot Password" on the login page and follow the instructions sent to your email.'
                }
            ]
        },
        {
            category: '🔍 For Customers',
            questions: [
                {
                    q: 'How do I find nearby technicians?',
                    a: 'We automatically detect your location (with permission) to show nearby technicians. You can also manually enter your address or use the map to search specific areas.'
                },
                {
                    q: 'How do I know if a technician is reliable?',
                    a: 'All technicians have ratings and reviews from previous customers. We also verify technician credentials and experience. Look for the "Verified" badge.'
                },
                {
                    q: 'Can I reschedule or cancel an appointment?',
                    a: 'Yes, go to your dashboard, find the booking, and click Reschedule or Cancel. Note that cancellations within 24 hours may incur a fee.'
                },
                {
                    q: 'What if I\'m not satisfied with the service?',
                    a: 'Contact us immediately through the support form below. We take quality seriously and will work to resolve any issues.'
                }
            ]
        },
        {
            category: '👨‍🔧 For Technicians',
            questions: [
                {
                    q: 'How do I register as a technician?',
                    a: 'Click "Register as Technician" and provide your professional details, certifications, areas of expertise, and service area. Verification may take 1-2 business days.'
                },
                {
                    q: 'How does bidding work?',
                    a: 'When customers post service requests, you can submit bids with your proposed price and timeline. The customer reviews all bids and selects one.'
                },
                {
                    q: 'When do I get paid?',
                    a: 'Payment is released after the customer confirms job completion. Funds are typically available in your account within 2-3 business days.'
                },
                {
                    q: 'What is the commission fee?',
                    a: 'TechCare charges a small percentage commission on completed jobs to maintain the platform. Exact rates are provided during registration.'
                }
            ]
        }
    ];

    const toggleFaq = (categoryIndex, questionIndex) => {
        const id = `${categoryIndex}-${questionIndex}`;
        setOpenFaq(openFaq === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <SEO
                title="Support Center - TechCare"
                description="Get help with your TechCare account, bookings, and payments. Browse our FAQs or contact our support team."
                keywords="techcare support, customer service, help center, faq, contact us"
            />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Support Center
                    </h1>
                    <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
                        We're here to help! Find answers to common questions or contact us directly.
                    </p>
                </div>
            </section>

            <main className="container mx-auto px-4 py-12 max-w-6xl">
                {/* FAQs */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-center text-text-light dark:text-text-dark mb-8">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-8">
                        {faqs.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                                <h3 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                                    {category.category}
                                </h3>
                                <div className="space-y-3">
                                    {category.questions.map((faq, questionIndex) => {
                                        const isOpen = openFaq === `${categoryIndex}-${questionIndex}`;
                                        return (
                                            <div
                                                key={questionIndex}
                                                className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-3"
                                            >
                                                <button
                                                    onClick={() => toggleFaq(categoryIndex, questionIndex)}
                                                    className="w-full text-left flex justify-between items-center gap-4 py-2 hover:text-primary transition-colors"
                                                >
                                                    <span className="font-medium text-text-light dark:text-text-dark">
                                                        {faq.q}
                                                    </span>
                                                    <span className="text-2xl text-primary flex-shrink-0">
                                                        {isOpen ? '−' : '+'}
                                                    </span>
                                                </button>
                                                {isOpen && (
                                                    <div className="mt-2 text-gray-700 dark:text-gray-300 pl-4 leading-relaxed">
                                                        {faq.a}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Form */}
                <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-center text-text-light dark:text-text-dark mb-2">
                        Still Have Questions?
                    </h2>
                    <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
                        Send us a message and we'll get back to you within 24 hours
                    </p>

                    <form className="max-w-2xl mx-auto space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                                Subject *
                            </label>
                            <input
                                type="text"
                                id="subject"
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="How can we help?"
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                                Category *
                            </label>
                            <select
                                id="category"
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Select a category</option>
                                <option value="general">General Inquiry</option>
                                <option value="technical">Technical Support</option>
                                <option value="billing">Billing & Payments</option>
                                <option value="account">Account Issues</option>
                                <option value="complaint">Complaint</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                                Message *
                            </label>
                            <textarea
                                id="message"
                                rows="6"
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="Please describe your issue in detail..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                        >
                            Send Message
                        </button>
                    </form>
                </section>

                {/* Contact Info */}
                <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                        <div className="text-4xl mb-3">📧</div>
                        <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                            Email Us
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            support@techcare.com
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                        <div className="text-4xl mb-3">📞</div>
                        <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                            Call Us
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            +94 11 234 5678
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                        <div className="text-4xl mb-3">⏰</div>
                        <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                            Support Hours
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            24/7 Available
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Support;
