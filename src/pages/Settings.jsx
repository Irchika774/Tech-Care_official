import SEO from '../components/SEO';

const Settings = () => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
            <SEO
                title="Settings - TechCare"
                description="Manage your TechCare account settings and preferences."
                keywords="settings, account settings, preferences"
            />
            <div className="container mx-auto px-4">
                <main className="py-12">
                    <h1 className="text-3xl font-bold mb-6">Settings</h1>
                    <p>Settings page content coming soon.</p>
                </main>
            </div>
        </div>
    );
};

export default Settings;
