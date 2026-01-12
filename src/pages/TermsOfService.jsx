export default function TermsOfService() {
    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">Last updated: November 29, {currentYear}</p>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                By accessing and using TechCare's services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Use of Services</h2>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">2.1 Eligibility</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                You must be at least 18 years old to use our services. By using TechCare, you represent that you meet this requirement.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">2.2 Account Registration</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities under your account.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">2.3 Prohibited Activities</h3>
                            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                                <li>Violating any applicable laws or regulations</li>
                                <li>Impersonating another person or entity</li>
                                <li>Interfering with or disrupting the services</li>
                                <li>Attempting to gain unauthorized access to our systems</li>
                                <li>Using automated systems to access the services</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Service Bookings</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                All service bookings are subject to technician availability. TechCare acts as a platform connecting customers with independent technicians. We do not directly provide repair services.
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Customers agree to pay the quoted price for services rendered. Cancellations must be made at least 24 hours in advance to avoid cancellation fees.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. For Technicians</h2>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">4.1 Professional Conduct</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Technicians agree to provide professional, high-quality services and to treat customers with respect. All work must meet industry standards.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">4.2 Certification</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Technicians must provide valid certifications and maintain accurate skill listings. False claims may result in account suspension.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">4.3 Payment Terms</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                TechCare processes payments and deducts a service fee before releasing funds to technicians. Payment processing typically takes 3-5 business days.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Payments and Refunds</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                All prices are displayed in your local currency. Payment is required before services are rendered. Refunds are handled on a case-by-case basis in accordance with our refund policy.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Warranties and Disclaimers</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                All repairs come with a 90-day warranty on parts and labor, provided by the technician. TechCare is not responsible for the quality of work performed by independent technicians but will assist in dispute resolution.
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 mb-4 font-semibold">
                                THE SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Limitation of Liability</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                TechCare shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the services.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Termination</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                We reserve the right to terminate or suspend your account at any time for violating these terms. You may terminate your account at any time through your account settings.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Changes to Terms</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the platform.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Contact Information</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-2">
                                If you have questions about these Terms of Service, please contact us:
                            </p>
                            <ul className="list-none text-gray-700 dark:text-gray-300 space-y-1">
                                <li>Email: legal@techcare.lk</li>
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
