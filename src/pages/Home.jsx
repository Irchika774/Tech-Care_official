import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
    Smartphone,
    Wrench,
    Star,
    TrendingUp,
    MapPin,
    Clock,
    Shield,
    ThumbsUp,
    Zap,
    Award,
    Users,
    CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const navigate = useNavigate();

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const features = [
        {
            icon: Star,
            title: "Top-Rated Technicians",
            description: "All technicians are verified, rated, and reviewed by real customers with 4.8+ average ratings",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: TrendingUp,
            title: "Real-Time Updates",
            description: "Live tracking, real-time availability, and instant notifications for complete transparency",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: MapPin,
            title: "Location-Based",
            description: "Find nearby technicians with Google Maps integration and see their exact locations",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: Shield,
            title: "100% Secure",
            description: "Secure payment processing and data protection with industry-standard encryption",
            color: "from-orange-500 to-red-500"
        },
        {
            icon: Clock,
            title: "Fast Service",
            description: "Same-day repairs available with average response time under 2 hours",
            color: "from-indigo-500 to-purple-500"
        },
        {
            icon: ThumbsUp,
            title: "Guaranteed Quality",
            description: "All repairs come with warranty and satisfaction guarantee or money back",
            color: "from-pink-500 to-rose-500"
        }
    ];

    const stats = [
        { icon: Users, value: "10,000+", label: "Happy Customers" },
        { icon: Wrench, value: "50,000+", label: "Repairs Completed" },
        { icon: Award, value: "500+", label: "Expert Technicians" },
        { icon: Star, value: "4.8/5", label: "Average Rating" }
    ];

    return (
        <div className="min-h-screen overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <main>
                    {/* Hero Section */}
                    <motion.section
                        className="py-16 sm:py-24"
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                    >
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <motion.div variants={fadeInUp} className="space-y-6">
                                <motion.div
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Zap className="h-4 w-4 text-purple-600" />
                                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                        #1 Device Repair Platform
                                    </span>
                                </motion.div>

                                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                                    <span className="text-gradient bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                                        Your Trusted Partner
                                    </span>
                                    <br />
                                    for Device Repairs
                                </h1>

                                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                                    Connect with <span className="font-semibold text-purple-600">verified technicians</span> for smartphones, tablets, and computers.
                                    Experience <span className="font-semibold text-blue-600">fast, reliable service</span> with real-time tracking and expert care.
                                </p>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Button
                                        size="lg"
                                        onClick={() => navigate('/mobile-repair')}
                                        className="px-8 py-6 text-lg gradient-primary hover:opacity-90 transition-all hover-lift btn-shine group"
                                    >
                                        <Smartphone className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                        Mobile Repair
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        onClick={() => navigate('/pc-repair')}
                                        className="px-8 py-6 text-lg border-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 hover-lift group"
                                    >
                                        <Wrench className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                                        PC Repair
                                    </Button>
                                </div>

                                {/* Trust Indicators */}
                                <div className="flex flex-wrap items-center gap-6 pt-6">
                                    {stats.slice(0, 2).map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            className="flex items-center gap-2"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            <stat.icon className="h-5 w-5 text-purple-600" />
                                            <div>
                                                <div className="font-bold text-lg">{stat.value}</div>
                                                <div className="text-xs text-muted-foreground">{stat.label}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                variants={fadeInUp}
                                className="relative"
                            >
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl hover-lift">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 z-10"></div>
                                    <img
                                        alt="Professional technician repairing a device"
                                        className="rounded-2xl w-full h-auto"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_lzbEzJb4eEjVp0CIkCF6L2MNjhlw1xLi7dmxYmuqoLwryRiNBI1VTAwgtvBqiY7LXEiNQZB2hXrT4aeQNiqUhsYxCkwRNztvR21MVk2g35oQSp7KS8aId4T60lKrASdFVY3xvLRljwUZow5uCZ3rBp4Ug5pkwiLRL1Wm8PXR1hqcd9jT08Iq-m20c787tlth48nRiT1RkQ_tfcrAihjmPFyFDQDRI8UVGeLZXOlB3S3Q1QRh60nsPYF7UvdwI3IQ1euw5jlCjtFR"
                                    />
                                    <div className="absolute bottom-4 left-4 right-4 z-20">
                                        <div className="glass rounded-xl p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>
                                                <span className="text-white font-semibold">4.8/5 Rating</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Floating Cards */}
                                <motion.div
                                    className="absolute -top-6 -right-6 glass-dark rounded-2xl p-4 shadow-xl"
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.section>

                    {/* Stats Section */}
                    <motion.section
                        className="py-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="card-glass p-6 text-center hover-lift"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <stat.icon className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                                    <div className="text-3xl font-bold mb-1 text-gradient">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Features Section */}
                    <motion.section
                        className="py-16 sm:py-24"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-center mb-16">
                            <motion.h2
                                className="text-4xl sm:text-5xl font-bold mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                Why Choose <span className="text-gradient">TechCare</span>?
                            </motion.h2>
                            <motion.p
                                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                Experience the difference with our premium repair services
                            </motion.p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="group relative card-glass p-8 hover-lift"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 group-hover:text-gradient transition-all">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* CTA Section */}
                    <motion.section
                        className="py-16 sm:py-24"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative rounded-3xl overflow-hidden">
                            <div className="absolute inset-0 gradient-primary opacity-90"></div>
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>

                            <div className="relative px-8 py-16 sm:py-20 text-center text-white">
                                <motion.h2
                                    className="text-4xl sm:text-5xl font-bold mb-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                >
                                    Ready to Get Started?
                                </motion.h2>
                                <motion.p
                                    className="text-xl mb-8 max-w-2xl mx-auto opacity-90"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                >
                                    Join thousands of satisfied customers who trust TechCare for all their device repair needs
                                </motion.p>

                                <motion.div
                                    className="flex flex-wrap gap-4 justify-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Button
                                        size="lg"
                                        onClick={() => navigate('/register')}
                                        className="px-8 py-6 text-lg bg-white text-purple-600 hover:bg-gray-100 transition-all hover-lift btn-shine"
                                    >
                                        Get Started as Customer
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        onClick={() => navigate('/register', { state: { role: 'technician' } })}
                                        className="px-8 py-6 text-lg border-2 border-white text-white hover:bg-white/10 transition-all hover-lift"
                                    >
                                        Register as Technician
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.section>
                </main>
            </div>
        </div>
    );
};

export default Home;
