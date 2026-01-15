import { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import { useToast } from '../hooks/use-toast';
import { Briefcase, MapPin, Clock, Building2, ArrowRight, Users, Zap, Gift } from 'lucide-react';

const Careers = () => {
    const { toast } = useToast();
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleApply = (job) => {
        // Open email client with job application
        const subject = encodeURIComponent(`Application for ${job.title}`);
        const body = encodeURIComponent(`Hi TechCare Team,\n\nI am interested in applying for the ${job.title} position.\n\nPlease find my resume attached.\n\nBest regards`);
        window.location.href = `mailto:careers@techcare.com?subject=${subject}&body=${body}`;

        toast({
            title: "Email Client Opened",
            description: `Apply for ${job.title} by sending your resume.`,
        });
    };

    const jobs = [
        {
            title: 'Senior Electronics Technician',
            location: 'Colombo, Sri Lanka',
            type: 'Full-time',
            department: 'Service Delivery'
        },
        {
            title: 'Customer Support Specialist',
            location: 'Remote',
            type: 'Part-time',
            department: 'Support'
        },
        {
            title: 'Full Stack Developer',
            location: 'Colombo / Remote',
            type: 'Full-time',
            department: 'Engineering'
        },
        {
            title: 'Operations Coordinator',
            location: 'Kandy, Sri Lanka',
            type: 'Full-time',
            department: 'Operations'
        }
    ];

    const benefits = [
        { icon: Zap, title: 'Growth Opportunity', description: 'We are scaling fast. Join early and grow your career with us as we expand globally.' },
        { icon: Users, title: 'Work Flexibility', description: 'We value results over hours. Many of our roles offer remote or hybrid work options.' },
        { icon: Gift, title: 'Great Benefits', description: 'Competitive salary, health insurance, and continuous learning opportunities.' },
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            <SEO
                title="Careers - TechCare"
                description="Join the TechCare team and help us build the future of tech repair. View our current job openings."
            />

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-4 md:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-40 left-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="w-3 h-3 bg-emerald-500" />
                        <span className="text-sm tracking-[0.3em] uppercase text-gray-400">Careers</span>
                        <div className="w-3 h-3 bg-emerald-500" />
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
                        Work with
                        <br />
                        <span className="text-gray-500">TechCare</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
                        Join a fast-growing team dedicated to making tech repair accessible and reliable for everyone.
                    </p>

                    <a
                        href="#openings"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium hover:bg-gray-200 transition-all"
                    >
                        View Openings
                        <ArrowRight className="h-5 w-5" />
                    </a>
                </div>
            </section>

            {/* Values Section */}
            <section className="px-4 md:px-8 py-20 bg-zinc-950 border-y border-white/10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-2 h-2 bg-white" />
                        <h2 className="text-3xl md:text-4xl font-bold">Why Join Us?</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="bg-white/5 border border-white/10 p-8 hover:border-white/30 transition-all group">
                                <div className="w-14 h-14 bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-all">
                                    <benefit.icon className="h-7 w-7 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Openings Section */}
            <section id="openings" className="px-4 md:px-8 py-20 bg-black">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-2 h-2 bg-white" />
                        <h2 className="text-3xl md:text-4xl font-bold">Current Openings</h2>
                    </div>

                    <div className="space-y-4">
                        {jobs.map((job, index) => (
                            <div
                                key={index}
                                className="bg-zinc-900 border border-white/10 p-6 hover:border-white/30 transition-all cursor-pointer group"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-3">
                                            {job.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                            <span className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                {job.location}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                {job.type}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4" />
                                                {job.department}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleApply(job)}
                                        className="px-6 py-3 bg-white text-black font-medium hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2"
                                    >
                                        Apply Now
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="px-4 md:px-8 py-20 bg-zinc-950 border-t border-white/10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Don't see a perfect fit?
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                        We are always looking for talented individuals who are passionate about tech.
                        Send your resume to <span className="text-emerald-400 font-bold">careers@techcare.com</span> and we'll keep you in mind!
                    </p>
                    <a
                        href="mailto:careers@techcare.com"
                        className="inline-flex items-center gap-3 px-8 py-4 border border-white/30 text-white hover:bg-white hover:text-black transition-all"
                    >
                        <Briefcase className="h-5 w-5" />
                        Send Your Resume
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Careers;
