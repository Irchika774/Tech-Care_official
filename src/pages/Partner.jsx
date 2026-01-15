import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { TrendingUp, Wrench, CreditCard, Star, CheckCircle, ArrowRight, Quote } from 'lucide-react';

const Partner = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const benefits = [
        { icon: TrendingUp, title: 'More Customers', description: 'Get access to a steady stream of customers looking for repairs in your specific area.' },
        { icon: Wrench, title: 'Business Tools', description: 'Use our professional dashboard to manage bookings, payments, and customer communications.' },
        { icon: CreditCard, title: 'Secure Payments', description: 'Never worry about collections. We handle all payments and deposit them directly to you.' },
        { icon: Star, title: 'Brand Growth', description: 'Build your online reputation with verified customer reviews and our "TechCare Partner" badge.' },
    ];

    const requirements = [
        'Established repair shops with a physical location.',
        'Independent technicians with 3+ years of professional experience.',
        'Commitment to high-quality parts and exceptional service.',
        'Active business registration or professional certifications.',
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            <SEO
                title="Partner with Us - TechCare"
                description="Grow your repair business by partnering with TechCare. Get access to more customers and professional tools."
            />

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-4 md:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-40 right-20 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="w-3 h-3 bg-orange-500" />
                        <span className="text-sm tracking-[0.3em] uppercase text-gray-400">Partner Program</span>
                        <div className="w-3 h-3 bg-orange-500" />
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
                        Grow Your
                        <br />
                        <span className="text-gray-500">Business</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
                        Join the TechCare network and start receiving high-quality repair leads in your area today.
                    </p>

                    <a href="mailto:partners@techcare.com">
                        <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium hover:bg-gray-200 transition-all">
                            Apply to Partner
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </a>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="px-4 md:px-8 py-20 bg-zinc-950 border-y border-white/10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-2 h-2 bg-white" />
                        <h2 className="text-3xl md:text-4xl font-bold">Why Partner with TechCare?</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="bg-white/5 border border-white/10 p-8 hover:border-white/30 transition-all group">
                                <div className="w-14 h-14 bg-orange-500/10 flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-all">
                                    <benefit.icon className="h-7 w-7 text-orange-500" />
                                </div>
                                <h3 className="text-lg font-bold mb-3">{benefit.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Requirements Section */}
            <section className="px-4 md:px-8 py-20 bg-black">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-2 h-2 bg-white" />
                                <h2 className="text-3xl md:text-4xl font-bold">Who are we looking for?</h2>
                            </div>

                            <div className="space-y-4">
                                {requirements.map((req, index) => (
                                    <div key={index} className="flex gap-4 items-start">
                                        <div className="w-6 h-6 bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                                        </div>
                                        <p className="text-gray-300 leading-relaxed">{req}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-zinc-900 border border-white/10 overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=2070&auto=format&fit=crop"
                                alt="Professional Repair Shop"
                                className="w-full h-80 object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="px-4 md:px-8 py-20 bg-zinc-950 border-y border-white/10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-12 justify-center">
                        <div className="w-2 h-2 bg-white" />
                        <h2 className="text-3xl md:text-4xl font-bold text-center">Partner Success Stories</h2>
                        <div className="w-2 h-2 bg-white" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white/5 border border-white/10 p-8 relative">
                            <Quote className="h-10 w-10 text-orange-500/30 absolute top-6 right-6" />
                            <p className="text-gray-300 italic mb-6 text-lg leading-relaxed">
                                "Since joining TechCare, my shop's monthly bookings have increased by 40%. The platform is so easy to use, and I love that I don't have to worry about marketing anymore."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg">
                                    K
                                </div>
                                <div>
                                    <p className="font-bold text-white">Kamal</p>
                                    <p className="text-gray-500 text-sm">Owner of K-Tech Solutions</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-8 relative">
                            <Quote className="h-10 w-10 text-orange-500/30 absolute top-6 right-6" />
                            <p className="text-gray-300 italic mb-6 text-lg leading-relaxed">
                                "The secure payment system is a game-changer. I know I'll get paid on time for every job I complete. TechCare has really helped me professionalize my freelance work."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                                    S
                                </div>
                                <div>
                                    <p className="font-bold text-white">Sarah</p>
                                    <p className="text-gray-500 text-sm">Independent Technician</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-4 md:px-8 py-20 bg-black">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Grow Your Business?
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                        Join thousands of verified technicians on TechCare. Creating an account takes less than 2 minutes.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register">
                            <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium hover:bg-orange-500 hover:text-white transition-all">
                                Create Technician Account
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </Link>
                        <Link to="/how-it-works">
                            <button className="inline-flex items-center gap-3 px-8 py-4 border border-white/30 text-white hover:bg-white hover:text-black transition-all">
                                Learn More
                            </button>
                        </Link>
                    </div>

                    <p className="mt-8 text-gray-500 text-sm">
                        Already have an account? <Link to="/login" className="text-orange-400 hover:underline font-bold">Log in here</Link>
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Partner;
