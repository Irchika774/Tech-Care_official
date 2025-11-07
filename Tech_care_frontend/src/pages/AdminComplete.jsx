import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminComplete = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // Dashboard Statistics
  const [stats] = useState({
    totalUsers: 2500,
    activeTechnicians: 320,
    pendingRepairs: 78,
    revenue: 125450,
    completedToday: 45,
    avgRating: 4.8,
    totalAppointments: 1234,
    cancelledAppointments: 23
  });

  // Users Data
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890', role: 'customer', status: 'active', joined: '2025-01-15', appointments: 12 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891', role: 'customer', status: 'active', joined: '2025-02-20', appointments: 8 },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1234567892', role: 'customer', status: 'inactive', joined: '2025-03-10', appointments: 3 },
  ]);

  // Technicians Data
  const [technicians, setTechnicians] = useState([
    { id: 1, name: 'Mobile Wizards', email: 'contact@mobilewizards.com', phone: '+1234567893', specialization: 'Mobile Devices', rating: 4.9, reviews: 1200, status: 'active', earnings: 45000 },
    { id: 2, name: 'Circuit Masters', email: 'info@circuitmasters.com', phone: '+1234567894', specialization: 'PC Repair', rating: 4.9, reviews: 302, status: 'active', earnings: 52000 },
    { id: 3, name: 'Tech Solutions Hub', email: 'support@techsolutions.com', phone: '+1234567895', specialization: 'All Devices', rating: 4.7, reviews: 180, status: 'pending', earnings: 28000 },
  ]);

  // Appointments Data
  const [appointments, setAppointments] = useState([
    { id: 1, customer: 'John Doe', technician: 'Mobile Wizards', service: 'Screen Repair', device: 'iPhone 14', date: '2025-11-06', time: '10:00 AM', status: 'scheduled', price: 150 },
    { id: 2, customer: 'Jane Smith', technician: 'Circuit Masters', service: 'Hardware Upgrade', device: 'Custom PC', date: '2025-11-06', time: '2:00 PM', status: 'scheduled', price: 300 },
    { id: 3, customer: 'Mike Johnson', technician: 'Tech Solutions Hub', service: 'Battery Replace', device: 'MacBook Pro', date: '2025-11-05', time: '11:00 AM', status: 'completed', price: 200 },
    { id: 4, customer: 'Sarah Connor', technician: 'Mobile Wizards', service: 'Water Damage', device: 'Samsung S23', date: '2025-11-04', time: '3:00 PM', status: 'cancelled', price: 180 },
  ]);

  // Reviews Data
  const [reviews, setReviews] = useState([
    { id: 1, customer: 'John Doe', technician: 'Mobile Wizards', rating: 5, comment: 'Excellent service! Very professional.', date: '2025-11-01', status: 'approved' },
    { id: 2, customer: 'Jane Smith', technician: 'Circuit Masters', rating: 5, comment: 'Great work on my PC upgrade.', date: '2025-10-30', status: 'approved' },
    { id: 3, customer: 'Mike Johnson', technician: 'Tech Solutions Hub', rating: 3, comment: 'Service was okay but took longer than expected.', date: '2025-10-29', status: 'pending' },
  ]);

  // Services Data
  const [services, setServices] = useState([
    { id: 1, name: 'Screen Repair', category: 'Mobile', price: '50-250', duration: '1-2 hours', active: true },
    { id: 2, name: 'Battery Replacement', category: 'Mobile', price: '60-150', duration: '30-60 mins', active: true },
    { id: 3, name: 'Hardware Upgrade', category: 'PC', price: '100-600', duration: '2-4 hours', active: true },
    { id: 4, name: 'Data Recovery', category: 'All', price: '100-500', duration: '1-3 days', active: true },
  ]);

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleDeleteTechnician = (id) => {
    if (window.confirm('Are you sure you want to delete this technician?')) {
      setTechnicians(technicians.filter(t => t.id !== id));
    }
  };

  const handleUpdateAppointmentStatus = (id, newStatus) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
  };

  const handleUpdateReviewStatus = (id, newStatus) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status: newStatus } : review
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'inactive':
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const renderDashboard = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">Dashboard Overview</h2>
        <button className="flex items-center space-x-2 px-4 py-2 border border-border-light dark:border-border-dark rounded-md bg-card-light dark:bg-card-dark text-text-secondary-light dark:text-text-secondary-dark text-sm hover:bg-background-light dark:hover:bg-background-dark transition">
          <span>Last 30 Days</span>
          <span className="material-icons text-sm">expand_more</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Total Users</p>
              <p className="text-3xl font-bold mt-2 text-text-light dark:text-text-dark">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-green-500 mt-1">↑ +12% from last month</p>
            </div>
            <span className="material-icons text-4xl text-primary">people_outline</span>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Active Technicians</p>
              <p className="text-3xl font-bold mt-2 text-text-light dark:text-text-dark">{stats.activeTechnicians}</p>
              <p className="text-xs text-green-500 mt-1">↑ +5% from last month</p>
            </div>
            <span className="material-icons text-4xl text-primary">engineering</span>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Pending Repairs</p>
              <p className="text-3xl font-bold mt-2 text-text-light dark:text-text-dark">{stats.pendingRepairs}</p>
              <p className="text-xs text-red-500 mt-1">↓ -3% from last week</p>
            </div>
            <span className="material-icons text-4xl text-primary">build_circle</span>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Revenue</p>
              <p className="text-3xl font-bold mt-2 text-text-light dark:text-text-dark">${stats.revenue.toLocaleString()}</p>
              <p className="text-xs text-green-500 mt-1">↑ +8% from last month</p>
            </div>
            <span className="material-icons text-4xl text-primary">attach_money</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Completed Today</p>
              <p className="text-2xl font-bold mt-1 text-text-light dark:text-text-dark">{stats.completedToday}</p>
            </div>
            <span className="material-icons text-3xl text-green-500">check_circle</span>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Average Rating</p>
              <p className="text-2xl font-bold mt-1 text-text-light dark:text-text-dark">{stats.avgRating}/5.0</p>
            </div>
            <span className="material-icons text-3xl text-yellow-500">star</span>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Total Appointments</p>
              <p className="text-2xl font-bold mt-1 text-text-light dark:text-text-dark">{stats.totalAppointments}</p>
            </div>
            <span className="material-icons text-3xl text-blue-500">event</span>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Cancellation Rate</p>
              <p className="text-2xl font-bold mt-1 text-text-light dark:text-text-dark">{((stats.cancelledAppointments / stats.totalAppointments) * 100).toFixed(1)}%</p>
            </div>
            <span className="material-icons text-3xl text-red-500">cancel</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg text-text-light dark:text-text-dark mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => handleOpenModal('user')} className="w-full flex items-center justify-between p-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition">
              <span className="flex items-center">
                <span className="material-icons mr-2">person_add</span>
                Add New User
              </span>
              <span className="material-icons">arrow_forward</span>
            </button>
            <button onClick={() => handleOpenModal('technician')} className="w-full flex items-center justify-between p-3 bg-blue-500 text-white rounded-lg hover:bg-opacity-90 transition">
              <span className="flex items-center">
                <span className="material-icons mr-2">engineering</span>
                Add New Technician
              </span>
              <span className="material-icons">arrow_forward</span>
            </button>
            <button onClick={() => handleOpenModal('service')} className="w-full flex items-center justify-between p-3 bg-green-500 text-white rounded-lg hover:bg-opacity-90 transition">
              <span className="flex items-center">
                <span className="material-icons mr-2">add_circle</span>
                Add New Service
              </span>
              <span className="material-icons">arrow_forward</span>
            </button>
            <button onClick={() => setActiveTab('appointments')} className="w-full flex items-center justify-between p-3 bg-orange-500 text-white rounded-lg hover:bg-opacity-90 transition">
              <span className="flex items-center">
                <span className="material-icons mr-2">event_available</span>
                View All Appointments
              </span>
              <span className="material-icons">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg text-text-light dark:text-text-dark mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {appointments.slice(0, 4).map((apt) => (
              <div key={apt.id} className="flex items-start space-x-3 p-3 bg-background-light dark:bg-background-dark rounded-lg">
                <span className="material-icons text-primary">event</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-light dark:text-text-dark">{apt.service}</p>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{apt.customer} • {apt.date}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(apt.status)}`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderUsers = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">Manage Users</h2>
        <button 
          onClick={() => handleOpenModal('user')}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
        >
          <span className="material-icons">add</span>
          <span>Add New User</span>
        </button>
      </div>

      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-light dark:bg-background-dark">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase">Appointments</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-background-light dark:hover:bg-background-dark transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-text-light dark:text-text-dark">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary-light dark:text-text-secondary-dark">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary-light dark:text-text-secondary-dark">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary-light dark:text-text-secondary-dark">{user.joined}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary-light dark:text-text-secondary-dark">{user.appointments}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenModal('user', user)} className="text-primary hover:text-indigo-700 mr-3">
                      <span className="material-icons text-sm">edit</span>
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800">
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderTechnicians = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">Manage Technicians</h2>
        <button 
          onClick={() => handleOpenModal('technician')}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
        >
          <span className="material-icons">add</span>
          <span>Add New Technician</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {technicians.map((tech) => (
          <div key={tech.id} className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
                  {tech.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="ml-3">
                  <h3 className="font-bold text-text-light dark:text-text-dark">{tech.name}</h3>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{tech.specialization}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(tech.status)}`}>
                {tech.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
                <span className="material-icons text-sm mr-2">email</span>
                {tech.email}
              </div>
              <div className="flex items-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
                <span className="material-icons text-sm mr-2">phone</span>
                {tech.phone}
              </div>
              <div className="flex items-center text-sm">
                <span className="material-icons text-yellow-500 text-sm mr-2">star</span>
                <span className="font-semibold text-text-light dark:text-text-dark">{tech.rating}</span>
                <span className="text-text-secondary-light dark:text-text-secondary-dark ml-1">({tech.reviews} reviews)</span>
              </div>
              <div className="flex items-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
                <span className="material-icons text-green-500 text-sm mr-2">paid</span>
                <span className="font-semibold text-text-light dark:text-text-dark">${tech.earnings.toLocaleString()}</span>
                <span className="ml-1">earnings</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button onClick={() => handleOpenModal('technician', tech)} className="flex-1 py-2 px-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition text-sm">
                Edit
              </button>
              <button onClick={() => handleDeleteTechnician(tech.id)} className="py-2 px-3 bg-red-500 text-white rounded-lg hover:bg-opacity-90 transition text-sm">
                <span className="material-icons text-sm">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderAppointments = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">Manage Appointments</h2>
        <div className="flex space-x-2">
          <select className="px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark">
            <option>All Status</option>
            <option>Scheduled</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-light dark:bg-background-dark">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase">Technician</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-background-light dark:hover:bg-background-dark transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark">#{apt.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">{apt.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary-light dark:text-text-secondary-dark">{apt.technician}</td>
                  <td className="px-6 py-4 text-sm text-text-light dark:text-text-dark">
                    <div>{apt.service}</div>
                    <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{apt.device}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    <div>{apt.date}</div>
                    <div className="text-xs">{apt.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">${apt.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select 
                      value={apt.status}
                      onChange={(e) => handleUpdateAppointmentStatus(apt.id, e.target.value)}
                      className={`px-2 py-1 text-xs rounded-full border-0 ${getStatusColor(apt.status)}`}
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-primary hover:text-indigo-700 mr-3">
                      <span className="material-icons text-sm">visibility</span>
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <span className="material-icons text-sm">edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderReviews = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">Manage Reviews</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition">All</button>
          <button className="px-4 py-2 border border-border-light dark:border-border-dark rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition">Pending</button>
          <button className="px-4 py-2 border border-border-light dark:border-border-dark rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition">Approved</button>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  {review.customer.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-bold text-text-light dark:text-text-dark">{review.customer}</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`material-icons text-sm ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">
                    For: <span className="font-semibold text-text-light dark:text-text-dark">{review.technician}</span>
                  </p>
                  <p className="text-text-light dark:text-text-dark mb-2">{review.comment}</p>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{review.date}</p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(review.status)}`}>
                  {review.status}
                </span>
                {review.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleUpdateReviewStatus(review.id, 'approved')}
                      className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-opacity-90 transition"
                    >
                      Approve
                    </button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-opacity-90 transition">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderServices = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">Manage Services</h2>
        <button 
          onClick={() => handleOpenModal('service')}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
        >
          <span className="material-icons">add</span>
          <span>Add New Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-text-light dark:text-text-dark">{service.name}</h3>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{service.category}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${service.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {service.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
                <span className="material-icons text-sm mr-2">attach_money</span>
                <span className="font-semibold text-text-light dark:text-text-dark">{service.price}</span>
              </div>
              <div className="flex items-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
                <span className="material-icons text-sm mr-2">schedule</span>
                <span className="font-semibold text-text-light dark:text-text-dark">{service.duration}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button onClick={() => handleOpenModal('service', service)} className="flex-1 py-2 px-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition text-sm">
                Edit
              </button>
              <button className="py-2 px-3 border border-border-light dark:border-border-dark rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition text-sm">
                <span className="material-icons text-sm">more_vert</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderSettings = () => (
    <>
      <h2 className="text-3xl font-bold text-text-light dark:text-text-dark mb-6">System Settings</h2>
      
      <div className="space-y-6">
        <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-4">Platform Configuration</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark">
              <div>
                <h4 className="font-semibold text-text-light dark:text-text-dark">Maintenance Mode</h4>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Temporarily disable the platform</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark">
              <div>
                <h4 className="font-semibold text-text-light dark:text-text-dark">Auto-Approve Technicians</h4>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Automatically approve new technician registrations</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-semibold text-text-light dark:text-text-dark">Email Notifications</h4>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Send email notifications to users</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-4">Commission Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                Platform Commission (%)
              </label>
              <input 
                type="number" 
                defaultValue="15"
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                Minimum Withdrawal Amount ($)
              </label>
              <input 
                type="number" 
                defaultValue="100"
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button className="px-6 py-2 border border-border-light dark:border-border-dark rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition">
            Reset
          </button>
          <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition">
            Save Changes
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-card-light dark:bg-card-dark flex flex-col border-r border-border-light dark:border-border-dark">
        <div className="p-4 flex items-center space-x-2 border-b border-border-light dark:border-border-dark">
          <span className="material-icons text-primary text-3xl">admin_panel_settings</span>
          <h1 className="text-xl font-bold text-text-light dark:text-text-dark">Admin Panel</h1>
        </div>
        <nav className="mt-4 flex-1 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {[
              { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
              { id: 'users', icon: 'group', label: 'Users' },
              { id: 'technicians', icon: 'engineering', label: 'Technicians' },
              { id: 'appointments', icon: 'event', label: 'Appointments' },
              { id: 'reviews', icon: 'rate_review', label: 'Reviews' },
              { id: 'services', icon: 'build', label: 'Services' },
              { id: 'settings', icon: 'settings', label: 'Settings' },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                    activeTab === item.id
                      ? 'bg-primary text-white'
                      : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-background-light dark:hover:bg-background-dark'
                  }`}
                >
                  <span className="material-icons mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-border-light dark:border-border-dark">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center px-4 py-2 bg-background-light dark:bg-background-dark rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <span className="material-icons mr-2">home</span>
            <span>Back to Website</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark">
          <div className="flex items-center space-x-4">
            <span className="text-text-secondary-light dark:text-text-secondary-dark">Welcome back, Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition">
              <span className="material-icons">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                AD
              </div>
              <div>
                <p className="text-sm font-semibold text-text-light dark:text-text-dark">Admin User</p>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">admin@techcare.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'technicians' && renderTechnicians()}
          {activeTab === 'appointments' && renderAppointments()}
          {activeTab === 'reviews' && renderReviews()}
          {activeTab === 'services' && renderServices()}
          {activeTab === 'settings' && renderSettings()}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-card-light dark:bg-card-dark rounded-lg shadow-2xl w-full max-w-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">
                {editingItem ? `Edit ${modalType}` : `Add New ${modalType}`}
              </h3>
              <button onClick={handleCloseModal} className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary">
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className="text-center py-8">
              <span className="material-icons text-6xl text-primary mb-4">construction</span>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Form for {modalType} will be implemented here
              </p>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button onClick={handleCloseModal} className="px-6 py-2 border border-border-light dark:border-border-dark rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition">
                Cancel
              </button>
              <button onClick={handleCloseModal} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition">
                {editingItem ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplete;
