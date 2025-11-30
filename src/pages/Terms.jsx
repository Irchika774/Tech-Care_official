import { useEffect } from 'react';
import SEO from '../components/SEO';

const Terms = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <SEO
                title="Terms of Service - TechCare"
                description="Read our Terms of Service to understand the rules and regulations for using the TechCare platform."
                keywords="terms of service, terms and conditions, user agreement, legal"
            />

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-bold text-text-light dark:text-text-dark mb-8">
                    Terms of Service
                </h1>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            By accessing and using TechCare ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            2. Use License
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            Permission is granted to temporarily access the materials (information or software) on TechCare for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>Modify or copy the materials</li>
                            <li>Use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                            <li>Attempt to decompile or reverse engineer any software contained on TechCare</li>
                            <li>Remove any copyright or other proprietary notations from the materials</li>
                            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            3. User Accounts
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            4. Service Usage
                        </h2>
                        <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-3 mt-4">
                            For Customers:
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>You may use the platform to request repair services for your devices</li>
                            <li>You agree to provide accurate information about the device and issue</li>
                            <li>Payment must be made as agreed with the technician</li>
                            <li>You agree to be available at the scheduled time</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-3 mt-4">
                            For Technicians:
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>You must possess the necessary skills and certifications</li>
                            <li>You agree to provide honest and professional service</li>
                            <li>You must honor confirmed appointments</li>
                            <li>You agree to the platform's commission structure</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            5. Payments and Fees
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            All prices are listed in Sri Lankan Rupees (LKR) by default and may be converted to your local currency based on current exchange rates. The platform facilitates payment between customers and technicians and may charge a service fee.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Technicians agree to pay a commission fee for each completed job through the platform. Customers agree to pay the agreed-upon price for services rendered.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            6. Cancellations and Refunds
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            Customers may cancel bookings up to 24 hours before the scheduled time without penalty. Cancellations within 24 hours may incur a cancellation fee.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Refunds will be processed according to our refund policy and may take 5-10 business days to appear in your account.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            7. Liability
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            TechCare acts as a platform connecting customers with independent technicians. We do not perform repair services ourselves and are not liable for:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>Quality of work performed by technicians</li>
                            <li>Damage to devices during or after repairs</li>
                            <li>Disputes between customers and technicians</li>
                            <li>Loss of data or functionality</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                            However, we maintain a review and rating system to help ensure quality service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            8. Prohibited Activities
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            Users may not:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>Use the platform for any illegal activities</li>
                            <li>Harass, abuse, or harm other users</li>
                            <li>Provide false or misleading information</li>
                            <li>Attempt to bypass payment systems</li>
                            <li>Scrape or collect data from the platform</li>
                            <li>Impersonate others or provide false credentials</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            9. Intellectual Property
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            The Service and its original content, features, and functionality are and will remain the exclusive property of TechCare and its licensors. The Service is protected by copyright, trademark, and other laws.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            10. Termination
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            11. Governing Law
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            These Terms shall be governed and construed in accordance with the laws of Sri Lanka, without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            12. Changes to Terms
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes by posting the new Terms on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                            13. Contact Us
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            If you have any questions about these Terms, please contact us:
                        </p>
                        <ul className="list-none space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                            <li>📧 Email: legal@techcare.com</li>
                            <li>📞 Phone: +94 11 234 5678</li>
                            <li>🏢 Address: Colombo, Sri Lanka</li>
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Terms;
