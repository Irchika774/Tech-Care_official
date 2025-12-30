import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';

const BlogPost = () => {
    const { id } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    // Mock data for a blog post
    const post = {
        title: '5 Common Signs Your Phone Needs a New Battery',
        date: 'December 20, 2025',
        author: 'TechCare Team',
        category: 'Mobile Repair',
        image: '🔋',
        content: `
            <p className="mb-4">Is your phone dying too fast? It's one of the most common frustrations for smartphone users today. While modern batteries are designed to last a long time, they inevitably degrade over time.</p>
            
            <h2 className="text-2xl font-bold mb-4 mt-8">1. Your Phone Dies Quickly</h2>
            <p className="mb-4">This is the most obvious sign. If you started the day with 100% and you're searching for a charger by noon with light usage, your battery's capacity has likely dropped significantly.</p>
            
            <h2 className="text-2xl font-bold mb-4 mt-8">2. Sudden Shutdowns</h2>
            <p className="mb-4">Does your phone turn off unexpectedly even when it shows 20% or 30% remaining? This happens because the battery can no longer provide enough voltage to keep the device running during peak processing tasks.</p>
            
            <h2 className="text-2xl font-bold mb-4 mt-8">3. Overheating During Charging</h2>
            <p className="mb-4">While it's normal for a phone to get slightly warm while charging, excessive heat is a sign of internal resistance in the battery. This not only indicates a failing battery but can also be a safety hazard.</p>
            
            <h2 className="text-2xl font-bold mb-4 mt-8">4. It Only Works When Plugged In</h2>
            <p className="mb-4">If your phone becomes a "landline" that only functions when connected to a power source, the battery is almost completely dead and can no longer hold a charge.</p>
            
            <h2 className="text-2xl font-bold mb-4 mt-8">5. Bulging Battery or Screen Lifting</h2>
            <p className="mb-4">This is a critical sign. If you notice your screen lifting or the back of your phone bulging, stop using it immediately. The battery has likely swollen due to gas buildup and could pose a fire risk.</p>
            
            <div className="bg-primary/10 p-6 rounded-lg mt-8 mb-8 border-l-4 border-primary">
                <h3 className="text-xl font-bold mb-2">Need a Battery Replacement?</h3>
                <p>Our expert technicians can replace your phone battery in under 30 minutes with a high-quality replacement and warranty.</p>
                <a href="/schedule" class="inline-block mt-4 bg-primary text-white px-6 py-2 rounded-lg font-bold">Book Now</a>
            </div>
        `
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark py-12">
            <SEO
                title={`${post.title} - TechCare Blog`}
                description={post.title}
            />

            <article className="container mx-auto px-4 max-w-4xl">
                <Link to="/blog" className="text-primary hover:underline mb-8 inline-block">
                    ← Back to Blog
                </Link>

                <header className="mb-12">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                            {post.category}
                        </span>
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>By {post.author}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark mb-8 leading-tight">
                        {post.title}
                    </h1>
                    <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-9xl shadow-inner">
                        {post.image}
                    </div>
                </header>

                <div 
                    className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                                TC
                            </div>
                            <div>
                                <h4 className="font-bold text-text-light dark:text-text-dark">TechCare Team</h4>
                                <p className="text-sm text-gray-500">Official TechCare Editorial Team</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white transition-colors">
                                🐦
                            </button>
                            <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white transition-colors">
                                📘
                            </button>
                            <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white transition-colors">
                                🔗
                            </button>
                        </div>
                    </div>
                </footer>
            </article>
        </div>
    );
};

export default BlogPost;
