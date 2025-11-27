import Header from '../components/Header';
import Footer from '../components/Footer';

const Payment = () => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
            <div className="container mx-auto px-4">
                <Header />
                <main className="py-12">
                    <h1 className="text-3xl font-bold mb-6">Payment</h1>
                    <p>Payment page content coming soon.</p>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Payment;
