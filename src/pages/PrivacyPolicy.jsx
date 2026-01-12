export default function PrivacyPolicy() {
    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">Last updated: November 29, {currentYear}</p>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>

                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">1.1 Personal Information</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                We collect information that you provide directly to us, including:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                                <li>Name, email address, and phone number</li>
                                <li>Physical address and location data</li>
                                <li>Payment information (processed securely through third-party providers)</li>
                                <li>Profile information and photos</li>
                                <li>Service requests and communication history</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">1.2 Automatically Collected Information</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                When you use our services, we automatically collect:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                                <li>IP address and geographical location</li>
                                <li>Browser type and device information</li>
                                <li>Usage data and analytics</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                We use the collected information for the following purposes:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                                <li>To provide, maintain, and improve our services</li>
                                <li>To connect customers with technicians</li>
                                <li>To process payments and transactions</li>
                                <li>To send notifications about your bookings and services</li>
                                <li>To detect location and automatically convert currency</li>
                                <li>To personalize your experience</li>
                                <li>To communicate with you about updates and promotions</li>
                                <li>To ensure security and prevent fraud</li>
                                <li>To comply with legal obligations</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Information Sharing</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                We do not sell your personal information. We may share your information in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                                <li><strong>With Technicians:</strong> When you book a service, we share necessary information with the assigned technician</li>
                                <li><strong>Service Providers:</strong> We work with third-party service providers for payment processing, email delivery, and analytics</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                                <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Location Data</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                We use your location data to:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                                <li>Find nearby technicians</li>
                                <li>Automatically detect your currency based on IP location</li>
                                <li>Provide accurate service estimates and arrival times</li>
                                <li>Display relevant local services</li>
                            </ul>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                You can disable location services, but this may limit functionality.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Data Security</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                We implement appropriate technical and organizational measures to protect your personal information, including:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                                <li>Encryption of data in transit and at rest</li>
                                <li>Secure authentication and access controls</li>
                                <li>Regular security audits and updates</li>
                                <li>Limited employee access to personal data</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Cookies and Tracking</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                We use cookies and similar technologies to enhance your experience. You can control cookie settings through your browser preferences. Note that disabling cookies may affect functionality.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Your Rights</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                You have the right to:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                                <li>Access your personal information</li>
                                <li>Correct inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Object to or restrict processing</li>
                                <li>Data portability</li>
                                <li>Withdraw consent at any time</li>
                            </ul>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                To exercise these rights, contact us at privacy@techcare.lk
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Data Retention</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                We retain your personal information for as long as necessary to provide services and comply with legal obligations. You can request data deletion through your account settings.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Children's Privacy</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Our services are not intended for children under 18. We do not knowingly collect information from children. If we discover such information, we will delete it promptly.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. International Data Transfers</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Changes to This Policy</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through the platform. Your continued use after changes constitutes acceptance.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">12. Contact Us</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-2">
                                If you have questions about this Privacy Policy, please contact us:
                            </p>
                            <ul className="list-none text-gray-700 dark:text-gray-300 space-y-1">
                                <li>Email: privacy@techcare.lk</li>
                                <li>Phone: +94 11 234 5678</li>
                                <li>Address: 123 Tech Street, Colombo 00700, Sri Lanka</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
