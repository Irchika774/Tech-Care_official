import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const History = () => {
  const [filter, setFilter] = useState('all');

  const appointments = [
    {
      id: 1,
      date: '2025-10-28',
      time: '2:00 PM',
      technician: 'Mobile Wizards',
      service: 'Screen Repair',
      device: 'iPhone 14 Pro',
      status: 'completed',
      price: '$150',
      rating: 5
    },
    {
      id: 2,
      date: '2025-10-15',
      time: '11:00 AM',
      technician: 'Circuit Masters',
      service: 'Hardware Upgrade',
      device: 'Custom PC',
      status: 'completed',
      price: '$300',
      rating: 5
    },
    {
      id: 3,
      date: '2025-11-05',
      time: '3:00 PM',
      technician: 'Tech Solutions Hub',
      service: 'Data Recovery',
      device: 'MacBook Pro',
      status: 'upcoming',
      price: '$200',
      rating: null
    },
    {
      id: 4,
      date: '2025-09-20',
      time: '10:00 AM',
      technician: 'Fone Fixers',
      service: 'Battery Replacement',
      device: 'Samsung Galaxy S23',
      status: 'completed',
      price: '$80',
      rating: 4
    },
    {
      id: 5,
      date: '2025-10-30',
      time: '1:00 PM',
      technician: 'ProFix Electronics',
      service: 'Virus Removal',
      device: 'Desktop PC',
      status: 'cancelled',
      price: '$100',
      rating: null
    }
  ];

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`material-icons text-sm ${i < rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}>
        star
      </span>
    ));
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        
        <main className="py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Service History</h1>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
                  Track all your past and upcoming appointments
                </p>
              </div>
              <div className="flex items-center space-x-2 bg-card-light dark:bg-card-dark rounded-lg p-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg transition ${filter === 'all' ? 'bg-primary text-white' : 'hover:bg-background-light dark:hover:bg-background-dark'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-4 py-2 rounded-lg transition ${filter === 'completed' ? 'bg-primary text-white' : 'hover:bg-background-light dark:hover:bg-background-dark'}`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setFilter('upcoming')}
                  className={`px-4 py-2 rounded-lg transition ${filter === 'upcoming' ? 'bg-primary text-white' : 'hover:bg-background-light dark:hover:bg-background-dark'}`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setFilter('cancelled')}
                  className={`px-4 py-2 rounded-lg transition ${filter === 'cancelled' ? 'bg-primary text-white' : 'hover:bg-background-light dark:hover:bg-background-dark'}`}
                >
                  Cancelled
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                        <span className="text-text-secondary-light dark:text-text-secondary-dark">
                          {appointment.date} at {appointment.time}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{appointment.service}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        <div className="flex items-center space-x-2">
                          <span className="material-icons text-primary text-base">devices</span>
                          <span>{appointment.device}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="material-icons text-primary text-base">person</span>
                          <span>{appointment.technician}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="material-icons text-primary text-base">payments</span>
                          <span className="font-semibold text-primary">{appointment.price}</span>
                        </div>
                      </div>
                      {appointment.rating && (
                        <div className="flex items-center space-x-2 mt-3">
                          <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Your Rating:</span>
                          <div className="flex">{renderStars(appointment.rating)}</div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2">
                      {appointment.status === 'completed' && !appointment.rating && (
                        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition text-sm">
                          Leave Review
                        </button>
                      )}
                      {appointment.status === 'upcoming' && (
                        <>
                          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition text-sm">
                            Reschedule
                          </button>
                          <button className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-4 py-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition text-sm">
                            Cancel
                          </button>
                        </>
                      )}
                      <button className="border border-border-light dark:border-border-dark px-4 py-2 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAppointments.length === 0 && (
              <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-12 text-center">
                <span className="material-icons text-6xl text-text-secondary-light dark:text-text-secondary-dark mb-4">
                  history
                </span>
                <h3 className="text-xl font-bold mb-2">No appointments found</h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  You don&apos;t have any {filter !== 'all' ? filter : ''} appointments yet.
                </p>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default History;
