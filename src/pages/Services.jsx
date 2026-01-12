import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
    Smartphone,
    Laptop,
    Tablet,
    Gamepad2,
    Home,
    Keyboard,
    Zap,
    Users,
    DollarSign,
    Shield,
    ArrowRight,
    Check,
    Sparkles
} from 'lucide-react';

const Services = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const services = [
        {
            id: 1,
            title: 'Mobile Phone Repair',
            icon: Smartphone,
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
            icon: Laptop,
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
            icon: Tablet,
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
            icon: Gamepad2,
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
            icon: Home,
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
            icon: Keyboard,
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

    const whyChooseUs = [
        { icon: Zap, title: 'Fast Service', description: 'Quick turnaround time for most repairs' },
        { icon: Users, title: 'Expert Technicians', description: 'Certified and experienced professionals' },
        { icon: DollarSign, title: 'Fair Pricing', description: 'Transparent pricing with no hidden fees' },
        { icon: Shield, title: 'Warranty', description: 'All repairs backed by warranty' }
    ];

    return (
        <div className="bg-black text-white min-h-screen">
            <SEO
                title="Our Services - TechCare"
                description="Explore our wide range of tech repair services including mobile, PC, tablet, and smart home device repairs."
                keywords="tech repair services, mobile repair, pc repair, tablet repair, smart home repair"
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
                            Professional Tech Repair
                        </Badge>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                            Our Services
                        </h1>

                        <p className="text-xl md:text-2xl text-zinc-400 mb-8 leading-relaxed">
                            Professional repair services for all your tech devices.
                            Expert technicians, quality parts, guaranteed results.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24 border-t border-zinc-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <Card
                                key={service.id}
                                className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all duration-500 group overflow-hidden"
                            >
                                <CardContent className="p-8">
                                    <div className="inline-flex p-4 rounded-2xl bg-white/10 mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <service.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-3">
                                        {service.title}
                                    </h2>
                                    <p className="text-zinc-400 mb-6">
                                        {service.description}
                                    </p>
                                    <ul className="space-y-3 mb-8">
                                        {service.services.map((item, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start text-zinc-300"
                                            >
                                                <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button asChild className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-6 rounded-full">
                                        <Link to={service.link} state={{ service: service.title }}>
                                            Book Now
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 bg-zinc-950">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-white/10 text-white border-white/30 px-4 py-2">
                            Why TechCare
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Why Choose TechCare?
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {whyChooseUs.map((item, index) => (
                            <Card key={index} className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/80 transition-all duration-500 group">
                                <CardContent className="p-8 text-center">
                                    <div className="inline-flex p-4 rounded-2xl bg-white/10 mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <item.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3 text-white">
                                        {item.title}
                                    </h3>
                                    <p className="text-zinc-400">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-white/10 text-white border-white/30 px-4 py-2">
                            Pricing
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Transparent Pricing
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            No hidden fees, no surprises. Get upfront quotes before any work begins.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all duration-500">
                            <CardContent className="p-8">
                                <h3 className="text-xl font-bold text-center mb-4 text-white">Diagnostic</h3>
                                <div className="text-5xl font-bold text-center text-white mb-4">Free</div>
                                <p className="text-center text-zinc-400 mb-6">Initial checkup and quote</p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center text-sm text-zinc-300">
                                        <Check className="w-5 h-5 text-white mr-3" /> Device analysis
                                    </li>
                                    <li className="flex items-center text-sm text-zinc-300">
                                        <Check className="w-5 h-5 text-white mr-3" /> Problem identification
                                    </li>
                                    <li className="flex items-center text-sm text-zinc-300">
                                        <Check className="w-5 h-5 text-white mr-3" /> No obligation quote
                                    </li>
                                </ul>
                                <Button asChild variant="outline" className="w-full border-white text-white hover:bg-white hover:text-black py-6 rounded-full transition-all duration-300">
                                    <Link to="/schedule" state={{ service: 'General Diagnostic' }}>Get Started</Link>
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="bg-zinc-900 border-2 border-white relative transform scale-105 hover:border-zinc-300 transition-all duration-500">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <Badge className="bg-white text-black font-semibold px-4 py-1">
                                    Most Popular
                                </Badge>
                            </div>
                            <CardContent className="p-8 pt-10">
                                <h3 className="text-xl font-bold text-center mb-4 text-white">Standard Repair</h3>
                                <div className="text-5xl font-bold text-center text-white mb-4">From $49</div>
                                <p className="text-center text-zinc-400 mb-6">Common hardware fixes</p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center text-sm text-zinc-300">
                                        <Check className="w-5 h-5 text-white mr-3" /> Screen replacement
                                    </li>
                                    <li className="flex items-center text-sm text-zinc-300">
                                        <Check className="w-5 h-5 text-white mr-3" /> Battery replacement
                                    </li>
                                    <li className="flex items-center text-sm text-zinc-300">
                                        <Check className="w-5 h-5 text-white mr-3" /> 30-day warranty
                                    </li>
                                </ul>
                                <Button asChild className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-6 rounded-full">
                                    <Link to="/schedule" state={{ service: 'Standard Repair' }}>Book Now</Link>
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all duration-500">
                            <CardContent className="p-8">
                                <h3 className="text-xl font-bold text-center mb-4 text-white">Advanced Repair</h3>
                                <div className="text-5xl font-bold text-center text-white mb-4">From $99</div>
                                <p className="text-center text-zinc-400 mb-6">Complex issues & logic board</p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center text-sm text-zinc-300">
                                        <Check className="w-5 h-5 text-white mr-3" /> Water damage repair
                                    </li>
                                    <li className="flex items-center text-sm text-zinc-300">
                                        <Check className="w-5 h-5 text-white mr-3" /> Logic board repair
                                    </li>
                                    <li className="flex items-center text-sm text-zinc-300">
                                        <Check className="w-5 h-5 text-white mr-3" /> 90-day warranty
                                    </li>
                                </ul>
                                <Button asChild variant="outline" className="w-full border-white text-white hover:bg-white hover:text-black py-6 rounded-full transition-all duration-300">
                                    <Link to="/schedule" state={{ service: 'Advanced Repair' }}>Book Now</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-zinc-950">
                <div className="container mx-auto px-4">
                    <Card className="relative bg-zinc-900 border border-zinc-800 overflow-hidden">
                        <div className="absolute inset-0">
                            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                        </div>
                        <CardContent className="relative p-12 md:p-16 text-center">
                            <Badge className="mb-6 bg-white/10 text-white border-white/30 px-4 py-2">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Get Help Today
                            </Badge>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Need Help with Your Device?
                            </h2>
                            <p className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto">
                                Get connected with expert technicians in your area. Fast, reliable, and affordable.
                            </p>
                            <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100 px-10 py-6 text-lg font-semibold rounded-full">
                                <Link to="/schedule" state={{ service: 'General Inquiry' }}>
                                    Schedule a Repair
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default Services;
