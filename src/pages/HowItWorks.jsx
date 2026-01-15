import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { FileText, Search, CreditCard, Wrench, Shield, FileCheck, MessageCircle, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const steps = [
        {
            title: 'Request a Service',
            description: 'Tell us what is wrong with your device. Choose from our list of services or describe a custom problem.',
            icon: FileText,
            color: 'bg-blue-500/10',
            iconColor: 'text-blue-500'
        },
        {
            title: 'Browse & Compare',
            description: 'View profiles of verified technicians in your area. Compare their ratings, reviews, and previous work.',
            icon: Search,
            color: 'bg-purple-500/10',
            iconColor: 'text-purple-500'
        },
        {
            title: 'Book & Pay Securely',
            description: 'Schedule a time that works for you. Pay securely through our platform to ensure your money is protected.',
            icon: CreditCard,
            color: 'bg-emerald-500/10',
            iconColor: 'text-emerald-500'
        },
        {
            title: 'Get it Fixed',
            description: 'Meet your technician at your preferred location or visit their shop. Get your device fixed with a warranty.',
            icon: Wrench,
            color: 'bg-orange-500/10',
            iconColor: 'text-orange-500'
        }
    ];

    const features = [
        { icon: Shield, title: 'Buyer Protection', description: 'We hold your payment until the job is completed to your satisfaction. Your money is always safe with TechCare.', accent: 'border-emerald-500' },
        { icon: FileCheck, title: 'Service Warranty', description: 'All repairs booked through our platform come with a minimum 30-day warranty on parts and labor.', accent: 'border-blue-500' },
        { icon: MessageCircle, title: 'Real-time Chat', description: 'Communicate directly with your technician. Ask questions, send photos of the damage, and get updates instantly.', accent: 'border-purple-500' },
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            <SEO
                title="How It Works - TechCare"
                description="Discover how TechCare makes device repair easy and reliable. From requesting a service to getting it fixed."
            />

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-4 md:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-40 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="w-3 h-3 bg-blue-500" />
                        <span className="text-sm tracking-[0.3em] uppercase text-gray-400">Process</span>
                        <div className="w-3 h-3 bg-blue-500" />
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
                        How TechCare
                        <br />
                        <span className="text-gray-500">Works</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
                        Your simple path to professional tech repair
                    </p>
                </div>
            </section>

            {/* Steps Section */}
            <section className="px-4 md:px-8 py-20 bg-zinc-950 border-y border-white/10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="flex gap-6 p-6 bg-white/5 border border-white/10 hover:border-white/30 transition-all group">
                                <div className={`w-16 h-16 ${step.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                    <step.icon className={`h-8 w-8 ${step.iconColor}`} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-gray-500 tracking-widest mb-2">
                                        STEP {index + 1}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section className="px-4 md:px-8 py-20 bg-black">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-zinc-900 border border-white/10 p-8 md:p-16 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

                        <div className="text-center relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-8">
                                The TechCare Experience
                            </h2>

                            <div className="aspect-video max-w-4xl mx-auto bg-black/50 border border-white/10 flex flex-col items-center justify-center relative group">
                                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 flex flex-col items-center p-8">
                                    <div className="w-20 h-20 bg-emerald-500/10 flex items-center justify-center mb-6 animate-pulse border border-emerald-500/20">
                                        <Shield className="h-10 w-10 text-emerald-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">Professional. Secure. Guaranteed.</h3>
                                    <p className="text-gray-500 max-w-md mx-auto text-center">
                                        Watch as our verified technicians bring expert care directly to your device, backed by our industrial-grade security and warranty.
                                    </p>
                                </div>

                                {/* Animated elements */}
                                <div className="absolute bottom-8 left-8 flex gap-2">
                                    <div className="h-1 w-12 bg-emerald-500" style={{ animation: 'pulse 2s infinite' }} />
                                    <div className="h-1 w-8 bg-emerald-500/50" style={{ animation: 'pulse 2s infinite 0.2s' }} />
                                    <div className="h-1 w-16 bg-emerald-500/20" style={{ animation: 'pulse 2s infinite 0.4s' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="px-4 md:px-8 py-20 bg-zinc-950 border-y border-white/10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className={`bg-white/5 border border-white/10 ${feature.accent} border-b-4 p-8 hover:bg-white/10 transition-all`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <feature.icon className="h-6 w-6 text-white" />
                                    <h3 className="text-lg font-bold">{feature.title}</h3>
                                </div>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Link */}
            <section className="px-4 md:px-8 py-16 bg-black">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">
                        Still have questions?
                    </h2>
                    <Link
                        to="/support"
                        className="text-blue-400 font-bold text-lg hover:underline inline-flex items-center gap-2"
                    >
                        Visit our Support Center
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-4 md:px-8 py-20 bg-zinc-950 border-t border-white/10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to experience better tech repair?
                    </h2>
                    <Link to="/services">
                        <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium hover:bg-emerald-500 hover:text-white transition-all">
                            Get Started Now
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HowItWorks;
