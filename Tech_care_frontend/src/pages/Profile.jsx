import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    bio: 'Tech enthusiast and regular customer of TechCare services.'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        
        <main className="py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-indigo-600 h-32"></div>
              
              <div className="px-8 pb-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start -mt-16 mb-6">
                  <div className="w-32 h-32 bg-white dark:bg-gray-700 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center text-4xl font-bold text-primary shadow-lg">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </div>
                  <div className="sm:ml-6 mt-4 sm:mt-16 text-center sm:text-left flex-1">
                    <h1 className="text-3xl font-bold">{profile.firstName} {profile.lastName}</h1>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">{profile.email}</p>
                  </div>
                  <div className="mt-4 sm:mt-16">
                    {!isEditing ? (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition flex items-center space-x-2"
                      >
                        <span className="material-icons text-sm">edit</span>
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button 
                          onClick={handleSave}
                          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-200 dark:bg-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-border-light dark:border-border-dark pt-6">
                  <form onSubmit={handleSave}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={profile.firstName}
                          onChange={(e) => handleChange('firstName', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={profile.lastName}
                          onChange={(e) => handleChange('lastName', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          value={profile.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={profile.city}
                          onChange={(e) => handleChange('city', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          value={profile.state}
                          onChange={(e) => handleChange('state', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                          Bio
                        </label>
                        <textarea
                          value={profile.bio}
                          onChange={(e) => handleChange('bio', e.target.value)}
                          disabled={!isEditing}
                          rows="4"
                          className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </form>
                </div>

                <div className="mt-8 border-t border-border-light dark:border-border-dark pt-6">
                  <h2 className="text-xl font-bold mb-4">Account Statistics</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-primary">12</div>
                      <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">Total Appointments</div>
                    </div>
                    <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-primary">8</div>
                      <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">Reviews Written</div>
                    </div>
                    <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-primary">5</div>
                      <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">Saved Technicians</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
