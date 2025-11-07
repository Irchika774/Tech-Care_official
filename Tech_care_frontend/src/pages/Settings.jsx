import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '../hooks/useTheme';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    appointmentReminders: true,
    reviewRequests: true,
    twoFactorAuth: false,
    language: 'en',
    currency: 'usd',
    autoSave: true
  });

  const handleToggle = (setting) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleSelect = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        
        <main className="py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
                Manage your account preferences and settings
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="material-icons text-primary mr-2">notifications</span>
                  Notifications
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark">
                    <div>
                      <h3 className="font-semibold">Email Notifications</h3>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Receive updates via email
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggle('emailNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.emailNotifications ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark">
                    <div>
                      <h3 className="font-semibold">SMS Notifications</h3>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Receive text message alerts
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggle('smsNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.smsNotifications ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark">
                    <div>
                      <h3 className="font-semibold">Push Notifications</h3>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Receive browser notifications
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggle('pushNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.pushNotifications ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark">
                    <div>
                      <h3 className="font-semibold">Marketing Emails</h3>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Receive promotional offers
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggle('marketingEmails')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.marketingEmails ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h3 className="font-semibold">Appointment Reminders</h3>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Get reminders before appointments
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggle('appointmentReminders')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.appointmentReminders ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.appointmentReminders ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="material-icons text-primary mr-2">palette</span>
                  Appearance
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h3 className="font-semibold">Dark Mode</h3>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Toggle dark theme
                      </p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isDark ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isDark ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="material-icons text-primary mr-2">security</span>
                  Security
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark">
                    <div>
                      <h3 className="font-semibold">Two-Factor Authentication</h3>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Add extra security to your account
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggle('twoFactorAuth')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.twoFactorAuth ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <button className="w-full text-left py-3 border-b border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition px-4 rounded">
                    <h3 className="font-semibold">Change Password</h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      Update your password regularly
                    </p>
                  </button>
                  <button className="w-full text-left py-3 hover:bg-background-light dark:hover:bg-background-dark transition px-4 rounded">
                    <h3 className="font-semibold">Connected Devices</h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      Manage your logged-in devices
                    </p>
                  </button>
                </div>
              </div>

              <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="material-icons text-primary mr-2">language</span>
                  Preferences
                </h2>
                <div className="space-y-4">
                  <div className="py-3 border-b border-border-light dark:border-border-dark">
                    <label className="block font-semibold mb-2">Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSelect('language', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                  <div className="py-3">
                    <label className="block font-semibold mb-2">Currency</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleSelect('currency', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="usd">USD ($)</option>
                      <option value="eur">EUR (€)</option>
                      <option value="gbp">GBP (£)</option>
                      <option value="jpy">JPY (¥)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center text-red-600 dark:text-red-400">
                  <span className="material-icons mr-2">warning</span>
                  Danger Zone
                </h2>
                <div className="space-y-4">
                  <button className="w-full bg-red-50 dark:bg-red-900 dark:bg-opacity-20 text-red-600 dark:text-red-400 py-3 px-4 rounded-lg hover:bg-red-100 dark:hover:bg-opacity-30 transition text-left">
                    <h3 className="font-semibold">Deactivate Account</h3>
                    <p className="text-sm">Temporarily disable your account</p>
                  </button>
                  <button className="w-full bg-red-50 dark:bg-red-900 dark:bg-opacity-20 text-red-600 dark:text-red-400 py-3 px-4 rounded-lg hover:bg-red-100 dark:hover:bg-opacity-30 transition text-left">
                    <h3 className="font-semibold">Delete Account</h3>
                    <p className="text-sm">Permanently delete your account and all data</p>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button className="border border-border-light dark:border-border-dark px-6 py-3 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition">
                Reset to Defaults
              </button>
              <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition">
                Save Changes
              </button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Settings;
