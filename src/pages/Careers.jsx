import { useEffect } from 'react';
import SEO from '../components/SEO';

const Careers = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <SEO
                title="Careers - TechCare"
                description="Join the TechCare team and help us build the future of tech repair. View our current job openings."
            />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Work with TechCare
                    </h1>
                    <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8">
                        Join a fast-growing team dedicated to making tech repair accessible and reliable for everyone.
                    </p>
                    <a 
                        href="#openings" 
                        className="bg-white text-primary hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-all inline-block shadow-lg"
                    >
                        View Openings
                    </a>
                </div>
            </section>

            <main className="container mx-auto px-4 py-16 max-w-6xl">
                {/* Values */}
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-text-light dark:text-text-dark mb-12 text-center">
                        Why Join Us?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
                            <div className="text-4xl mb-4">🚀</div>
                            <h3 className="text-xl font-bold mb-3">Growth Opportunity</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                We are scaling fast. Join early and grow your career with us as we expand globally.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
                            <div className="text-4xl mb-4">🏠</div>
                            <h3 className="text-xl font-bold mb-3">Work Flexibility</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                We value results over hours. Many of our roles offer remote or hybrid work options.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
                            <div className="text-4xl mb-4">🎁</div>
                            <h3 className="text-xl font-bold mb-3">Great Benefits</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Competitive salary, health insurance, and continuous learning opportunities.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Openings */}
                <section id="openings" className="mb-20">
                    <h2 className="text-3xl font-bold text-text-light dark:text-text-dark mb-8">
                        Current Openings
                    </h2>
                    <div className="space-y-4">
                        {jobs.map((job, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between hover:border-primary transition-colors cursor-pointer group">
                                <div>
                                    <h3 className="text-xl font-bold text-text-light dark:text-text-dark group-hover:text-primary transition-colors">
                                        {job.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span>📍 {job.location}</span>
                                        <span>💼 {job.type}</span>
                                        <span>🏢 {job.department}</span>
                                    </div>
                                </div>
                                <button className="mt-4 md:mt-0 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white px-6 py-2 rounded-lg font-bold transition-all">
                                    Apply Now
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Culture */}
                <section className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark mb-6">
                        Don't see a perfect fit?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
                        We are always looking for talented individuals who are passionate about tech. Send your resume to <span className="text-primary font-bold">careers@techcare.com</span> and we'll keep you in mind!
                    </p>
                </section>
            </main>
        </div>
    );
};

export default Careers;
