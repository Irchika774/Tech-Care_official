import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
    Sparkles,
    HelpCircle,
    Mail,
    Phone,
    Clock,
    ChevronDown,
    ChevronUp,
    Wrench,
    CreditCard,
    User,
    Search,
    MessageCircle,
    Shield,
    Zap,
    CheckCircle,
    ArrowRight,
    Send
} from 'lucide-react';

const Support = () => {
    const [openFaq, setOpenFaq] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const faqs = [
        {
            category: 'General',
            icon: HelpCircle,
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
            category: 'Pricing & Payments',
            icon: CreditCard,
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
            category: 'Account & Profile',
            icon: User,
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
            category: 'For Customers',
            icon: Search,
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
            category: 'For Technicians',
            icon: Wrench,
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

    const filteredFaqs = searchQuery
        ? faqs.map(category => ({
            ...category,
            questions: category.questions.filter(
                q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    q.a.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(category => category.questions.length > 0)
        : faqs;

    const contactMethods = [
        { icon: Mail, title: 'Email Us', value: 'support@techcare.com', description: 'Get a response within 24 hours' },
        { icon: Phone, title: 'Call Us', value: '+94 11 234 5678', description: 'Available during business hours' },
        { icon: Clock, title: 'Support Hours', value: '24/7 Available', description: 'We\'re always here to help' }
    ];

    const stats = [
        { value: '24/7', label: 'Support Available', icon: Clock },
        { value: '<2hr', label: 'Response Time', icon: Zap },
        { value: '98%', label: 'Resolution Rate', icon: CheckCircle },
        { value: '4.9/5', label: 'Support Rating', icon: Shield }
    ];

    return (
        <div className="bg-black text-white">
            <SEO
                title="Support Center - TechCare"
                description="Get help with your TechCare account, bookings, and payments. Browse our FAQs or contact our support team."
                keywords="techcare support, customer service, help center, faq, contact us"
            />

            {/* Hero Section */}
            <section className="relative pt-16 pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-black" />
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                </div>

                <div className="relative container mx-auto px-4">
                    <div className="text-center max-w-4xl mx-auto">
                        <Badge className="mb-6 bg-white/10 text-white border-white/30 backdrop-blur-sm px-4 py-2">
                            <Sparkles className="w-4 h-4 mr-2" />
                            We're Here to Help
                        </Badge>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                            Support Center
                        </h1>

                        <p className="text-xl md:text-2xl text-zinc-400 mb-8 leading-relaxed">
                            Find answers to common questions or contact our support team directly
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="Search for answers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-full text-white placeholder-zinc-500 focus:outline-none focus:border-white/50 transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 border-y border-zinc-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="relative group">
                                <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/80 transition-all duration-500 overflow-hidden">
                                    <CardContent className="p-6 text-center relative">
                                        <div className="inline-flex p-3 rounded-xl bg-white/10 mb-4">
                                            <stat.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                                        <div className="text-zinc-400 text-sm">{stat.label}</div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQs Section */}
            <section className="py-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-white/10 text-white border-white/30 px-4 py-2">
                            Frequently Asked Questions
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Common Questions
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Quick answers to help you get started with TechCare
                        </p>
                    </div>

                    <div className="space-y-8">
                        {filteredFaqs.map((category, categoryIndex) => (
                            <Card key={categoryIndex} className="bg-zinc-900 border-zinc-800 overflow-hidden">
                                <CardHeader className="bg-zinc-800/50 border-b border-zinc-700 p-6">
                                    <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                                        <div className="p-2 bg-white/10 rounded-lg">
                                            <category.icon className="w-6 h-6 text-white" />
                                        </div>
                                        {category.category}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-3">
                                        {category.questions.map((faq, questionIndex) => {
                                            const isOpen = openFaq === `${categoryIndex}-${questionIndex}`;
                                            return (
                                                <div
                                                    key={questionIndex}
                                                    className="border border-zinc-800 rounded-xl overflow-hidden"
                                                >
                                                    <button
                                                        onClick={() => toggleFaq(categoryIndex, questionIndex)}
                                                        className="w-full text-left flex justify-between items-center gap-4 p-5 hover:bg-zinc-800/50 transition-colors"
                                                    >
                                                        <span className="font-medium text-white">
                                                            {faq.q}
                                                        </span>
                                                        <span className="flex-shrink-0 p-2 rounded-lg bg-white/10">
                                                            {isOpen ? (
                                                                <ChevronUp className="w-5 h-5 text-white" />
                                                            ) : (
                                                                <ChevronDown className="w-5 h-5 text-white" />
                                                            )}
                                                        </span>
                                                    </button>
                                                    {isOpen && (
                                                        <div className="px-5 pb-5 text-zinc-400 leading-relaxed border-t border-zinc-800 pt-4">
                                                            {faq.a}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredFaqs.length === 0 && (
                        <div className="text-center py-16">
                            <div className="inline-flex p-4 rounded-full bg-zinc-900 border border-zinc-800 mb-4">
                                <Search className="w-8 h-8 text-zinc-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                            <p className="text-zinc-400">Try a different search term or contact our support team</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-24 bg-zinc-950">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-white/10 text-white border-white/30 px-4 py-2">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Get In Touch
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Still Have Questions?
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Send us a message and we'll get back to you within 24 hours
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Methods */}
                        <div className="space-y-6">
                            {contactMethods.map((method, index) => (
                                <Card key={index} className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/80 transition-all duration-500">
                                    <CardContent className="p-6 flex items-start gap-4">
                                        <div className="flex-shrink-0 p-3 rounded-xl bg-white/10">
                                            <method.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">{method.title}</h3>
                                            <p className="text-white font-medium mb-1">{method.value}</p>
                                            <p className="text-sm text-zinc-400">{method.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Contact Form */}
                        <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800">
                            <CardContent className="p-8">
                                <form className="space-y-6" onSubmit={(e) => {
                                    e.preventDefault();
                                    toast({
                                        title: "Message Sent",
                                        description: "We've received your message and will get back to you soon.",
                                    });
                                    e.target.reset();
                                }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                                                Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                required
                                                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white/50 transition-colors"
                                                placeholder="Your name"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                required
                                                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white/50 transition-colors"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            required
                                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white/50 transition-colors"
                                            placeholder="How can we help?"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
                                            Category *
                                        </label>
                                        <select
                                            id="category"
                                            required
                                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-white/50 transition-colors"
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
                                        <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            rows="5"
                                            required
                                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white/50 transition-colors resize-none"
                                            placeholder="Please describe your issue in detail..."
                                        ></textarea>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-6 text-lg rounded-full"
                                    >
                                        Send Message
                                        <Send className="ml-2 w-5 h-5" />
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <Card className="relative bg-zinc-900 border border-zinc-800 overflow-hidden">
                        <div className="absolute inset-0">
                            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                        </div>
                        <CardContent className="relative p-12 md:p-16 text-center">
                            <Badge className="mb-6 bg-white/10 text-white border-white/30 px-4 py-2">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Get Started Today
                            </Badge>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Ready to Fix Your Device?
                            </h2>
                            <p className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto">
                                Browse our expert technicians and schedule a repair service today
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100 px-10 py-6 text-lg font-semibold rounded-full">
                                    <Link to="/schedule">
                                        Book a Repair
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                </Button>
                                <Button asChild size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-10 py-6 text-lg font-semibold rounded-full transition-all duration-300">
                                    <Link to="/technicians">Find Technicians</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default Support;
