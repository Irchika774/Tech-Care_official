import { useEffect } from 'react';
import SEO from '../components/SEO';

const Privacy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <SEO
                title="Privacy Policy - TechCare"
                description="Learn how TechCare collects, uses, and protects your personal information."
                keywords="privacy policy, data protection, personal information, data security"
            />

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-bold text-text-light dark:text-text-dark mb-8">
                    Privacy Policy
                </h1>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        TechCare ("us", "we", or "our") operates the TechCare platform. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            1. Information We Collect
                        </h2>

                        <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-3 mt-4">
                            Personal Information
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            We collect the following types of personal information:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>Name and contact information (email, phone number)</li>
                            <li>Account credentials (username, password)</li>
                            <li>Payment information (processed securely through third-party providers)</li>
                            <li>Profile information (profile picture, bio, skills for technicians)</li>
                            <li>Location data (for finding nearby technicians)</li>
                            <li>Device information (for service requests)</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-3 mt-4">
                            Usage Data
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We automatically collect information about how you interact with our Service, including IP address, browser type, pages visited, time spent on pages, and other diagnostic data.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            2. How We Use Your Information
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            We use collected data for various purposes:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>To provide and maintain our Service</li>
                            <li>To notify you about changes to our Service</li>
                            <li>To allow you to participate in interactive features</li>
                            <li>To provide customer support</li>
                            <li>To gather analysis or valuable information to improve our Service</li>
                            <li>To monitor the usage of our Service</li>
                            <li>To detect, prevent and address technical issues</li>
                            <li>To match customers with appropriate technicians</li>
                            <li>To process payments and transactions</li>
                            <li>To send you notifications and updates</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            3. Location Data
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            We use IP-based geolocation to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>Detect your country and display prices in your local currency</li>
                            <li>Find nearby technicians for service requests</li>
                            <li>Improve service relevance and recommendations</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                            You can manually override currency settings at any time. Technicians may choose to share precise location data to enable location-based features.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            4. Data Sharing and Disclosure
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            We may share your information in the following situations:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li><strong>With Service Providers:</strong> Payment processors, cloud storage providers</li>
                            <li><strong>Between Users:</strong> Customers and technicians can see each other's names, ratings, and contact info when booking</li>
                            <li><strong>For Legal Compliance:</strong> When required by law or to protect our rights</li>
                            <li><strong>Business Transfers:</strong> In connection with mergers, sales, or asset transfers</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                            We do NOT sell your personal information to third parties.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            5. Data Security
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            We implement appropriate technical and organizational measures to protect your personal data:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>Passwords are encrypted using industry-standard hashing</li>
                            <li>Secure HTTPS connections for all data transmission</li>
                            <li>Regular security audits and updates</li>
                            <li>Access controls and authentication</li>
                            <li>Payment data is handled by PCI-compliant processors</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                            However, no method of transmission over the Internet is 100% secure. While we strive to protect your personal data, we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            6. Data Retention
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We retain your personal data only for as long as necessary for the purposes set out in this Privacy Policy. We will retain and use your data to comply with legal obligations, resolve disputes, and enforce our agreements.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            7. Your Rights
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            You have the following rights regarding your personal data:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li><strong>Access:</strong> Request copies of your personal data</li>
                            <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
                            <li><strong>Erasure:</strong> Request deletion of your data</li>
                            <li><strong>Restriction:</strong> Request restriction of processing</li>
                            <li><strong>Portability:</strong> Request transfer of your data</li>
                            <li><strong>Objection:</strong> Object to our processing of your data</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                            To exercise these rights, please contact us using the information provided below.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            8. Cookies and Tracking
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            We use cookies and similar tracking technologies to track activity on our Service:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li><strong>Essential Cookies:</strong> Required for the Service to function</li>
                            <li><strong>Preference Cookies:</strong> Remember your settings (theme, currency)</li>
                            <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                            You can instruct your browser to refuse all cookies or indicate when a cookie is  being sent. However, if you do not accept cookies, some parts of our Service may not function properly.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            9. Third-Party Services
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            Our Service may contain links to third-party services or integrate with:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>Google Maps API for location services</li>
                            <li>Payment processors (Stripe,PayPal)</li>
                            <li>IP geolocation services</li>
                            <li>Currency exchange rate APIs</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                            These third-party services have their own privacy policies. We have no control over and assume no responsibility for their content or practices.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            10. Children's Privacy
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Our Service is not intended for children under 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal data, please contact us.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            11. Changes to Privacy Policy
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            12. Contact Us
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            If you have any questions about this Privacy Policy, please contact us:
                        </p>
                        <ul className="list-none space-y-2 text-gray-700 dark:text-gray-300">
                            <li>📧 Email: privacy@techcare.com</li>
                            <li>📞 Phone: +94 11 234 5678</li>
                            <li>🏢 Address: Colombo, Sri Lanka</li>
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Privacy;
