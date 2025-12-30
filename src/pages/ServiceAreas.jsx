import { useEffect } from 'react';
import SEO from '../components/SEO';

const ServiceAreas = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const regions = [
        {
            name: 'Colombo District',
            cities: ['Colombo 1-15', 'Dehiwala', 'Mount Lavinia', 'Moratuwa', 'Kotte', 'Maharagama', 'Kaduwela', 'Homagama'],
            status: 'Full Coverage',
            count: '150+ Technicians'
        },
        {
            name: 'Gampaha District',
            cities: ['Negombo', 'Gampaha', 'Wattala', 'Kelaniya', 'Ja-Ela', 'Kadawatha', 'Kiribathgoda'],
            status: 'Full Coverage',
            count: '85+ Technicians'
        },
        {
            name: 'Kandy District',
            cities: ['Kandy City', 'Peradeniya', 'Katugastota', 'Gampola', 'Kundasale'],
            status: 'Full Coverage',
            count: '40+ Technicians'
        },
        {
            name: 'Galle District',
            cities: ['Galle City', 'Hikkaduwa', 'Ambalangoda', 'Karapitiya'],
            status: 'Partial Coverage',
            count: '25+ Technicians'
        },
        {
            name: 'Kalutara District',
            cities: ['Kalutara', 'Panadura', 'Horana', 'Beruwala'],
            status: 'Partial Coverage',
            count: '20+ Technicians'
        },
        {
            name: 'Other Major Cities',
            cities: ['Kurunegala', 'Matara', 'Jaffna', 'Anuradhapura', 'Ratnapura'],
            status: 'Expanding Soon',
            count: 'Varies'
        }
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <SEO
                title="Service Areas - TechCare"
                description="Find out where TechCare operates. We provide tech repair services across major districts in Sri Lanka."
            />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Service Areas
                    </h1>
                    <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
                        Find expert tech repair services near you
                    </p>
                </div>
            </section>

            <main className="container mx-auto px-4 py-16 max-w-6xl">
                {/* Search Bar Placeholder */}
                <div className="max-w-2xl mx-auto mb-16">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Enter your city or postal code..."
                            className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-primary/20 focus:border-primary focus:ring-0 dark:bg-gray-800 dark:text-white text-lg shadow-lg"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">📍</span>
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-full font-bold hover:bg-primary-dark transition-colors">
                            Check
                        </button>
                    </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-gray-200 dark:bg-gray-800 rounded-3xl h-96 mb-20 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl italic shadow-inner border-4 border-white dark:border-gray-700">
                    [ Interactive Service Area Map - Sri Lanka ]
                </div>

                {/* Regions Grid */}
                <h2 className="text-3xl font-bold text-text-light dark:text-text-dark mb-12 text-center">
                    Districts We Cover
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {regions.map((region, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-t-4 border-primary hover:scale-[1.02] transition-transform duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-text-light dark:text-text-dark">
                                    {region.name}
                                </h3>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${
                                    region.status === 'Full Coverage' ? 'bg-green-100 text-green-700' : 
                                    region.status === 'Partial Coverage' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {region.status}
                                </span>
                            </div>
                            <div className="text-primary font-bold text-sm mb-4">{region.count}</div>
                            <div className="flex flex-wrap gap-2">
                                {region.cities.map((city, cIndex) => (
                                    <span key={cIndex} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                                        {city}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Not in area? */}
                <section className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark mb-4">
                        Don't see your area?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
                        We are rapidly expanding our network across the country. Let us know where you are, and we'll prioritize your area!
                    </p>
                    <button className="bg-secondary text-white font-bold py-3 px-8 rounded-full hover:bg-secondary-dark transition-colors shadow-lg">
                        Notify Me When Available
                    </button>
                </section>
            </main>
        </div>
    );
};

export default ServiceAreas;
