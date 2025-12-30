import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';
import { 
    Target, 
    Eye, 
    Users, 
    Award, 
    Sparkles, 
    Shield, 
    Zap, 
    Heart,
    ArrowRight,
    CheckCircle,
    Star,
    TrendingUp,
    Globe,
    Smartphone,
    Monitor,
    Wrench,
    Clock,
    MapPin
} from 'lucide-react';

const Company = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const team = [
        {
            name: 'Saman Perera',
            role: 'CEO & Founder',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
            bio: '15+ years in tech industry, passionate about connecting skilled technicians with customers'
        },
        {
            name: 'Nisha Fernando',
            role: 'CTO',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
            bio: 'Tech enthusiast with expertise in platform development and scalability'
        },
        {
            name: 'Rohan Silva',
            role: 'Head of Operations',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
            bio: 'Ensures smooth operations and quality service delivery'
        },
        {
            name: 'Amali Jayasinghe',
            role: 'Customer Success Manager',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
            bio: 'Dedicated to ensuring customer satisfaction and resolving issues'
        }
    ];

    const milestones = [
        { year: '2023', event: 'TechCare Founded', description: 'Started with a vision to revolutionize tech repair services', icon: Sparkles },
        { year: '2023', event: '100+ Technicians', description: 'Reached our first major milestone', icon: Users },
        { year: '2024', event: 'Expanded Services', description: 'Added PC repair, tablet repair, and more', icon: Monitor },
        { year: '2024', event: '10,000+ Repairs', description: 'Successfully completed thousands of repairs', icon: Wrench },
        { year: '2025', event: 'Going Global', description: 'Expanding to international markets', icon: Globe }
    ];

    const values = [
        { icon: Shield, title: 'Trust', description: 'Building trust through transparency and verification', color: 'from-blue-500 to-cyan-500' },
        { icon: Award, title: 'Quality', description: 'Maintaining high standards in service delivery', color: 'from-amber-500 to-orange-500' },
        { icon: Zap, title: 'Innovation', description: 'Continuously improving our platform and services', color: 'from-purple-500 to-pink-500' },
        { icon: Heart, title: 'Excellence', description: 'Striving for excellence in everything we do', color: 'from-rose-500 to-red-500' }
    ];

    const stats = [
        { value: '500+', label: 'Verified Technicians', icon: Users, color: 'from-blue-600 to-blue-400' },
        { value: '15K+', label: 'Repairs Completed', icon: Wrench, color: 'from-emerald-600 to-emerald-400' },
        { value: '4.8/5', label: 'Average Rating', icon: Star, color: 'from-amber-600 to-amber-400' },
        { value: '98%', label: 'Customer Satisfaction', icon: TrendingUp, color: 'from-purple-600 to-purple-400' }
    ];

    const services = [
        { icon: Smartphone, title: 'Mobile Repair', count: '8000+' },
        { icon: Monitor, title: 'PC Repair', count: '5000+' },
        { icon: Clock, title: 'Same Day Service', count: '90%' },
        { icon: MapPin, title: 'Cities Covered', count: '25+' }
    ];

    return (
        <div className="bg-black text-white">
            <SEO
                title="About Us - TechCare"
                description="Learn about TechCare's mission to revolutionize device repair. Meet our team and discover our story."
                keywords="about techcare, company profile, tech repair mission, our team"
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
                            Sri Lanka's #1 Tech Repair Platform
                        </Badge>
                        
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                            About TechCare
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-zinc-400 mb-8 leading-relaxed">
                            Connecting people with expert tech support, one repair at a time. 
                            We're revolutionizing how Sri Lanka gets their devices fixed.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-full">
                                <Link to="/schedule">
                                    Find a Technician
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300">
                                <Link to="/register">Join Our Network</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 border-y border-zinc-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div 
                                key={index}
                                className="relative group"
                            >
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

            {/* Mission & Vision */}
            <section id="mission" data-animate className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-white/10 text-white border-white/30 px-4 py-2">
                            Our Purpose
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-white">
                            Mission & Vision
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        <Card className="relative bg-zinc-900 border border-zinc-800 overflow-hidden group hover:border-zinc-700 transition-all duration-500">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500" />
                            <CardHeader className="relative">
                                <div className="inline-flex p-4 rounded-2xl bg-white/10 border border-white/20 mb-4 w-fit">
                                    <Target className="w-8 h-8 text-white" />
                                </div>
                                <CardTitle className="text-3xl text-white">Our Mission</CardTitle>
                            </CardHeader>
                            <CardContent className="relative">
                                <p className="text-zinc-300 text-lg leading-relaxed">
                                    To make quality tech repair services accessible to everyone by connecting skilled technicians with customers who need help. We believe that everyone deserves reliable, affordable, and professional tech support.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {['Accessibility', 'Quality', 'Affordability'].map((tag) => (
                                        <Badge key={tag} className="bg-white text-black font-medium px-3 py-1">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="relative bg-zinc-900 border border-zinc-800 overflow-hidden group hover:border-zinc-700 transition-all duration-500">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500" />
                            <CardHeader className="relative">
                                <div className="inline-flex p-4 rounded-2xl bg-white/10 border border-white/20 mb-4 w-fit">
                                    <Eye className="w-8 h-8 text-white" />
                                </div>
                                <CardTitle className="text-3xl text-white">Our Vision</CardTitle>
                            </CardHeader>
                            <CardContent className="relative">
                                <p className="text-zinc-300 text-lg leading-relaxed">
                                    To become the world's most trusted platform for tech repair services, where both customers and technicians can connect, transact, and grow together in a transparent and efficient ecosystem.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {['Global Reach', 'Trust', 'Innovation'].map((tag) => (
                                        <Badge key={tag} className="bg-white text-black font-medium px-3 py-1">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-24 bg-zinc-950">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <Badge className="mb-4 bg-white/10 text-white border-white/30 px-4 py-2">
                                Our Journey
                            </Badge>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                The TechCare Story
                            </h2>
                        </div>

                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardContent className="p-8 md:p-12">
                                <div className="prose prose-invert prose-lg max-w-none">
                                    <p className="text-zinc-300 leading-relaxed mb-6 text-lg">
                                        TechCare was born from a simple frustration: finding a reliable technician to fix a broken phone was harder than it should be. Our founders experienced countless bad repairs, overpricing, and lack of transparency in the tech repair industry.
                                    </p>
                                    <Separator className="my-8 bg-zinc-800" />
                                    <p className="text-zinc-300 leading-relaxed mb-6 text-lg">
                                        We realized that while there were many skilled technicians, customers had no easy way to find and trust them. Similarly, talented technicians struggled to find customers and grow their businesses.
                                    </p>
                                    <Separator className="my-8 bg-zinc-800" />
                                    <p className="text-zinc-300 leading-relaxed text-lg">
                                        TechCare bridges this gap. We've created a platform where verified technicians can showcase their skills, and customers can find them with confidence. With transparent pricing, reviews, and ratings, we're bringing trust back to tech repairs.
                                    </p>
                                </div>

                                <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {services.map((service, index) => (
                                        <div key={index} className="text-center p-4 rounded-xl bg-zinc-800 border border-zinc-700">
                                            <service.icon className="w-8 h-8 text-white mx-auto mb-2" />
                                            <div className="text-2xl font-bold text-white">{service.count}</div>
                                            <div className="text-sm text-zinc-400">{service.title}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-white/10 text-white border-white/30 px-4 py-2">
                            What We Stand For
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Our Core Values
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            These principles guide everything we do at TechCare
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {values.map((value, index) => (
                            <Card 
                                key={index} 
                                className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/80 transition-all duration-500 group overflow-hidden"
                            >
                                <CardContent className="p-8 text-center relative">
                                    <div className="inline-flex p-4 rounded-2xl bg-white/10 mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <value.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                                    <p className="text-zinc-400">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section id="team" className="py-24 bg-zinc-950">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-white/10 text-white border-white/30 px-4 py-2">
                            The People Behind TechCare
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Meet Our Team
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Passionate professionals dedicated to transforming tech repair in Sri Lanka
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {team.map((member, index) => (
                            <Card 
                                key={index} 
                                className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/80 transition-all duration-500 group overflow-hidden"
                            >
                                <CardContent className="p-6 text-center">
                                    <div className="relative mb-6 mx-auto w-32 h-32">
                                        <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                                        <img 
                                            src={member.image} 
                                            alt={member.name}
                                            className="relative w-32 h-32 rounded-full object-cover border-4 border-zinc-700 group-hover:border-zinc-500 transition-all duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                                    <Badge className="mb-4 bg-white/10 text-white border-white/30">
                                        {member.role}
                                    </Badge>
                                    <p className="text-zinc-400 text-sm">{member.bio}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline/Milestones */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-white/10 text-white border-white/30 px-4 py-2">
                            Our Progress
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            The Journey So Far
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-zinc-700" />
                            
                            <div className="space-y-12">
                                {milestones.map((milestone, index) => (
                                    <div 
                                        key={index} 
                                        className={`relative flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                    >
                                        <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} hidden md:block`} />
                                        
                                        <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 z-10">
                                            <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center">
                                                <milestone.icon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>

                                        <div className="flex-1 ml-28 md:ml-0">
                                            <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/80 transition-all duration-500">
                                                <CardContent className="p-6">
                                                    <Badge className="mb-2 bg-white/10 text-white border-white/30">
                                                        {milestone.year}
                                                    </Badge>
                                                    <h3 className="text-xl font-bold text-white mb-2">{milestone.event}</h3>
                                                    <p className="text-zinc-400">{milestone.description}</p>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
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
                            The TechCare Advantage
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {[
                            { title: 'Verified Technicians', desc: 'All technicians undergo background checks and skill verification', icon: CheckCircle },
                            { title: 'Transparent Pricing', desc: 'No hidden fees. Get upfront quotes before any work begins', icon: Shield },
                            { title: 'Quality Guarantee', desc: '30-day warranty on all repairs for peace of mind', icon: Award },
                            { title: 'Fast Turnaround', desc: 'Most repairs completed within 24-48 hours', icon: Zap },
                            { title: 'Secure Payments', desc: 'Safe and secure payment processing with escrow protection', icon: Shield },
                            { title: '24/7 Support', desc: 'Round-the-clock customer support for any issues', icon: Heart }
                        ].map((item, index) => (
                            <Card key={index} className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/80 transition-all duration-500 group">
                                <CardContent className="p-6 flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                            <item.icon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                                        <p className="text-zinc-400 text-sm">{item.desc}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
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
                                Join the Revolution
                            </Badge>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Ready to Get Started?
                            </h2>
                            <p className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto">
                                Whether you need a repair or want to offer your services, TechCare is here to help you succeed.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100 px-10 py-6 text-lg font-semibold rounded-full">
                                    <Link to="/schedule">
                                        Find a Technician
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                </Button>
                                <Button asChild size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-10 py-6 text-lg font-semibold rounded-full transition-all duration-300">
                                    <Link to="/register">Become a Technician</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default Company;
