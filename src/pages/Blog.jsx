import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Blog = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const posts = [
        {
            id: 1,
            title: '5 Common Signs Your Phone Needs a New Battery',
            excerpt: 'Is your phone dying too fast? Learn the top signs that it is time for a battery replacement.',
            date: 'December 20, 2025',
            author: 'TechCare Team',
            category: 'Mobile Repair',
            image: '🔋'
        },
        {
            id: 2,
            title: 'How to Keep Your Laptop Cool During Summer',
            excerpt: 'Overheating can damage your laptop. Follow these tips to keep your device cool and efficient.',
            date: 'December 15, 2025',
            author: 'Rohan Silva',
            category: 'Maintenance',
            image: '💻'
        },
        {
            id: 3,
            title: 'The Future of Smart Home Technology in 2026',
            excerpt: 'What to expect in the world of IoT and smart home automation in the coming year.',
            date: 'December 10, 2025',
            author: 'Nisha Fernando',
            category: 'Smart Home',
            image: '🏠'
        },
        {
            id: 4,
            title: 'Why You Should Never Use a Cracked Screen',
            excerpt: 'A small crack can lead to big problems. Here is why you should fix your screen immediately.',
            date: 'December 5, 2025',
            author: 'TechCare Team',
            category: 'Safety',
            image: '📱'
        },
        {
            id: 5,
            title: 'Data Privacy: How to Secure Your Devices',
            excerpt: 'Protect your personal information with these essential device security tips.',
            date: 'November 28, 2025',
            author: 'Amali Jayasinghe',
            category: 'Security',
            image: '🛡️'
        },
        {
            id: 6,
            title: 'DIY vs Professional Repair: When to Call the Experts',
            excerpt: 'Some fixes are easy, others are risky. Know when to DIY and when to call a pro.',
            date: 'November 20, 2025',
            author: 'Rohan Silva',
            category: 'Tips',
            image: '👨‍🔧'
        }
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <SEO
                title="Blog - TechCare"
                description="Stay updated with the latest tech news, repair tips, and device maintenance guides from TechCare experts."
                keywords="tech blog, repair tips, phone maintenance, laptop care, smart home news"
            />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        TechCare Blog
                    </h1>
                    <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
                        Latest news, repair tips, and tech insights from our experts
                    </p>
                </div>
            </section>

            <main className="container mx-auto px-4 py-12">
                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {['All', 'Mobile Repair', 'Maintenance', 'Smart Home', 'Safety', 'Security', 'Tips'].map((cat) => (
                        <button
                            key={cat}
                            className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 font-medium"
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <article
                            key={post.id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                        >
                            <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-6xl">
                                {post.image}
                            </div>
                            <div className="p-6 flex-grow">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                                        {post.category}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {post.date}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-3 line-clamp-2">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                    {post.excerpt}
                                </p>
                            </div>
                            <div className="p-6 border-t border-gray-100 dark:border-gray-700 mt-auto">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                                        By {post.author}
                                    </span>
                                    <Link
                                        to={`/blog/${post.id}`}
                                        className="text-primary font-bold hover:underline"
                                    >
                                        Read More →
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-12 flex justify-center gap-2">
                    <button className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                        1
                    </button>
                    <button className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white transition-colors">
                        2
                    </button>
                    <button className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white transition-colors">
                        3
                    </button>
                </div>

                {/* Newsletter */}
                <section className="mt-20 bg-gray-100 dark:bg-gray-800 rounded-lg p-8 md:p-12 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark mb-4">
                        Subscribe to Our Newsletter
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        Get the latest tech repair tips and exclusive offers delivered straight to your inbox.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            className="flex-grow px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 whitespace-nowrap"
                        >
                            Subscribe
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default Blog;
