import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminFull = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', specialization: '', service: '', device: '',
    date: '', time: '', category: '', price: '', duration: '', status: 'active'
  });

  const [stats, setStats] = useState({
    totalUsers: 0, activeTechnicians: 0, pendingRepairs: 0, revenue: 0,
    completedToday: 0, avgRating: 0, totalAppointments: 0, cancelledAppointments: 0
  });

  const [users, setUsers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([
    { id: 1, name: 'Screen Repair', category: 'Mobile', priceMin: 50, priceMax: 250, duration: '1-2 hours', active: true },
    { id: 2, name: 'Battery Replacement', category: 'Mobile', priceMin: 60, priceMax: 150, duration: '30-60 mins', active: true },
    { id: 3, name: 'Hardware Upgrade', category: 'PC', priceMin: 100, priceMax: 600, duration: '2-4 hours', active: true },
    { id: 4, name: 'Data Recovery', category: 'All', priceMin: 100, priceMax: 500, duration: '1-3 days', active: true },
    { id: 5, name: 'Virus Removal', category: 'All', priceMin: 80, priceMax: 200, duration: '2-3 hours', active: true },
  ]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [dashRes, usersRes, techsRes, bookingsRes, reviewsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/dashboard`, { headers }),
        fetch(`${API_URL}/api/admin/users`, { headers }),
        fetch(`${API_URL}/api/admin/technicians`, { headers }),
        fetch(`${API_URL}/api/admin/bookings`, { headers }),
        fetch(`${API_URL}/api/admin/reviews`, { headers })
      ]);

      if (dashRes.ok) {
        const dashData = await dashRes.json();
        setStats(dashData.stats || stats);
        setNotifications(dashData.recentActivity?.slice(0, 5).map((item, i) => ({
          id: i, type: 'activity', message: `${item.service_type || 'Booking'} - ${item.status}`, time: new Date(item.created_at).toLocaleString(), read: false
        })) || []);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.map(u => ({
          id: u.id, name: u.name || 'No Name', email: u.email, phone: u.phone || 'N/A',
          role: u.role || 'user', status: 'active', joined: new Date(u.created_at).toLocaleDateString(),
          appointments: 0, address: ''
        })));
      }

      if (techsRes.ok) {
        const techsData = await techsRes.json();
        setTechnicians(techsData.map(t => ({
          id: t.id, name: t.name, email: t.email, phone: t.phone || 'N/A',
          specialization: t.specialization?.join(', ') || 'General', rating: t.rating || 0,
          reviews: t.review_count || 0, status: t.status || 'active', earnings: 0,
          location: t.address || 'N/A', experience: `${t.experience || 0} years`
        })));
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setAppointments(bookingsData.map(b => ({
          id: b.id, customer: b.customer?.name || 'Unknown', technician: b.technician?.name || 'Unassigned',
          service: b.service_type || 'General Repair', device: b.device_type || 'Device',
          date: new Date(b.scheduled_date || b.created_at).toLocaleDateString(),
          time: b.scheduled_time || '10:00 AM', status: b.status,
          price: b.estimated_cost || 0, notes: b.description || ''
        })));
      }

      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.map(r => ({
          id: r.id, customer: r.customer?.name || 'Anonymous', technician: r.technician?.name || 'Unknown',
          rating: r.rating, comment: r.comment, date: new Date(r.created_at).toLocaleDateString(),
          status: 'approved'
        })));
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item || { name: '', email: '', phone: '', specialization: '', status: 'active' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
    setFormData({});
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    try {
      if (modalType === 'user') {
        if (editingItem) {
          await fetch(`${API_URL}/api/admin/users/${editingItem.id}`, { method: 'PUT', headers, body: JSON.stringify(formData) });
        }
      } else if (modalType === 'technician') {
        if (editingItem) {
          await fetch(`${API_URL}/api/admin/technicians/${editingItem.id}`, { method: 'PUT', headers, body: JSON.stringify(formData) });
        }
      } else if (modalType === 'appointment') {
        if (editingItem) {
          await fetch(`${API_URL}/api/admin/bookings/${editingItem.id}`, { method: 'PUT', headers, body: JSON.stringify({ status: formData.status }) });
        }
      }
      handleCloseModal();
      fetchAllData();
    } catch (err) {
      console.error('Error saving:', err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/admin/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchAllData();
  };

  const handleDeleteTechnician = async (id) => {
    if (!window.confirm('Delete this technician?')) return;
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/admin/technicians/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchAllData();
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/admin/reviews/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchAllData();
  };

  const handleVerifyTechnician = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/admin/technicians/${id}/verify`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
    fetchAllData();
  };

  const handleUpdateAppointmentStatus = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/admin/bookings/${id}`, {
      method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    fetchAllData();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': case 'approved': case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': case 'scheduled': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'inactive': case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getFilteredData = (data) => {
    let filtered = data;
    if (searchTerm) {
      filtered = filtered.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase())));
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }
    return filtered;
  };

  const paginate = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = (dataLength) => Math.ceil(dataLength / itemsPerPage);

  const renderPagination = (totalItems) => {
    const totalPages = getTotalPages(totalItems);
    if (totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}
            className="px-3 py-1 rounded border disabled:opacity-50">Previous</button>
          {[...Array(Math.min(totalPages, 5))].map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-primary text-white' : 'border'}`}>{i + 1}</button>
          ))}
          <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border disabled:opacity-50">Next</button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderDashboard = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Dashboard Overview</h2>
        <button onClick={fetchAllData} className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
          <span className="material-icons text-sm mr-1">refresh</span> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
            </div>
            <span className="material-icons text-4xl text-primary">people_outline</span>
          </div>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Active Technicians</p>
              <p className="text-3xl font-bold mt-2">{stats.activeTechnicians}</p>
            </div>
            <span className="material-icons text-4xl text-primary">engineering</span>
          </div>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Pending Repairs</p>
              <p className="text-3xl font-bold mt-2">{stats.pendingRepairs}</p>
            </div>
            <span className="material-icons text-4xl text-primary">build_circle</span>
          </div>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-3xl font-bold mt-2">Rs. {stats.revenue?.toLocaleString()}</p>
            </div>
            <span className="material-icons text-4xl text-primary">attach_money</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg mb-4">Recent Appointments</h3>
          <div className="space-y-3">
            {appointments.slice(0, 5).map((apt) => (
              <div key={apt.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="material-icons text-primary">event</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{apt.service}</p>
                  <p className="text-xs text-gray-500">{apt.customer} • {apt.date}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(apt.status)}`}>{apt.status}</span>
              </div>
            ))}
            {appointments.length === 0 && <p className="text-center text-gray-500 py-4">No appointments yet</p>}
          </div>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg mb-4">Recent Reviews</h3>
          <div className="space-y-3">
            {reviews.slice(0, 5).map((review) => (
              <div key={review.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{review.customer}</span>
                  <div className="flex items-center">
                    {[...Array(review.rating)].map((_, i) => <span key={i} className="material-icons text-yellow-500 text-sm">star</span>)}
                  </div>
                </div>
                <p className="text-xs text-gray-500">{review.comment}</p>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-center text-gray-500 py-4">No reviews yet</p>}
          </div>
        </div>
      </div>
    </>
  );

  const renderUsers = () => {
    const filteredUsers = getFilteredData(users);
    const paginatedUsers = paginate(filteredUsers);
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Manage Users</h2>
        </div>
        <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-6 mb-6">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-800">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </div>
                      <div className="ml-4"><div className="font-medium">{user.name}</div></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{user.role}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleOpenModal('user', user)} className="text-primary mr-3"><span className="material-icons text-sm">edit</span></button>
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-600"><span className="material-icons text-sm">delete</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {paginatedUsers.length === 0 && <p className="text-center text-gray-500 py-8">No users found</p>}
          {renderPagination(filteredUsers.length)}
        </div>
      </>
    );
  };

  const renderTechnicians = () => {
    const filteredTechs = getFilteredData(technicians);
    const paginatedTechs = paginate(filteredTechs);
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Manage Technicians</h2>
        </div>
        <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedTechs.map((tech) => (
                <tr key={tech.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 font-medium">{tech.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{tech.email}</td>
                  <td className="px-6 py-4 text-sm">{tech.specialization}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center"><span className="material-icons text-yellow-500 text-sm">star</span><span className="ml-1">{tech.rating}</span></div>
                  </td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(tech.status)}`}>{tech.status}</span></td>
                  <td className="px-6 py-4 text-right">
                    {tech.status === 'pending' && <button onClick={() => handleVerifyTechnician(tech.id)} className="text-green-600 mr-2"><span className="material-icons text-sm">check_circle</span></button>}
                    <button onClick={() => handleOpenModal('technician', tech)} className="text-primary mr-3"><span className="material-icons text-sm">edit</span></button>
                    <button onClick={() => handleDeleteTechnician(tech.id)} className="text-red-600"><span className="material-icons text-sm">delete</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {paginatedTechs.length === 0 && <p className="text-center text-gray-500 py-8">No technicians found</p>}
          {renderPagination(filteredTechs.length)}
        </div>
      </>
    );
  };

  const renderAppointments = () => {
    const filteredApts = getFilteredData(appointments);
    const paginatedApts = paginate(filteredApts);
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Manage Appointments</h2>
        </div>
        <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-6 mb-6">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-800">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technician</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedApts.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 font-medium">{apt.customer}</td>
                  <td className="px-6 py-4 text-sm">{apt.technician}</td>
                  <td className="px-6 py-4 text-sm">{apt.service}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{apt.date}</td>
                  <td className="px-6 py-4">
                    <select value={apt.status} onChange={(e) => handleUpdateAppointmentStatus(apt.id, e.target.value)}
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(apt.status)} border-0 cursor-pointer`}>
                      <option value="pending">Pending</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleOpenModal('appointment', apt)} className="text-primary"><span className="material-icons text-sm">visibility</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {paginatedApts.length === 0 && <p className="text-center text-gray-500 py-8">No appointments found</p>}
          {renderPagination(filteredApts.length)}
        </div>
      </>
    );
  };

  const renderReviews = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Reviews</h2>
      </div>
      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md">
        <div className="divide-y">
          {reviews.map((review) => (
            <div key={review.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{review.customer}</span>
                    <span className="text-gray-400">reviewed</span>
                    <span className="font-semibold">{review.technician}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`material-icons text-sm ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}>star</span>
                    ))}
                    <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                </div>
                <button onClick={() => handleDeleteReview(review.id)} className="text-red-600 hover:text-red-800">
                  <span className="material-icons">delete</span>
                </button>
              </div>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-center text-gray-500 py-8">No reviews yet</p>}
        </div>
      </div>
    </>
  );

  const renderServices = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Services</h2>
        <button onClick={() => handleOpenModal('service')} className="px-4 py-2 bg-primary text-white rounded-lg">Add Service</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">{service.name}</h3>
            <p className="text-sm text-gray-500 mb-2">Category: {service.category}</p>
            <p className="text-sm text-gray-500 mb-2">Price: Rs. {service.priceMin} - Rs. {service.priceMax}</p>
            <p className="text-sm text-gray-500">Duration: {service.duration}</p>
          </div>
        ))}
      </div>
    </>
  );

  const renderModalForm = () => {
    if (modalType === 'user') {
      return (
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div><label className="block text-sm font-medium mb-2">Name</label>
            <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border" /></div>
          <div><label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border" /></div>
          <div><label className="block text-sm font-medium mb-2">Phone</label>
            <input type="tel" name="phone" value={formData.phone || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border" /></div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={handleCloseModal} className="px-6 py-2 border rounded-lg">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg">Save</button>
          </div>
        </form>
      );
    }
    if (modalType === 'technician') {
      return (
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div><label className="block text-sm font-medium mb-2">Name</label>
            <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border" /></div>
          <div><label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border" /></div>
          <div><label className="block text-sm font-medium mb-2">Status</label>
            <select name="status" value={formData.status || 'active'} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border">
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select></div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={handleCloseModal} className="px-6 py-2 border rounded-lg">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg">Save</button>
          </div>
        </form>
      );
    }
    if (modalType === 'appointment') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Customer</label><p className="font-semibold">{formData.customer}</p></div>
            <div><label className="block text-sm font-medium mb-1">Technician</label><p className="font-semibold">{formData.technician}</p></div>
            <div><label className="block text-sm font-medium mb-1">Service</label><p className="font-semibold">{formData.service}</p></div>
            <div><label className="block text-sm font-medium mb-1">Device</label><p className="font-semibold">{formData.device}</p></div>
            <div><label className="block text-sm font-medium mb-1">Date</label><p className="font-semibold">{formData.date}</p></div>
            <div><label className="block text-sm font-medium mb-1">Price</label><p className="font-semibold">Rs. {formData.price}</p></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Notes</label><p className="text-gray-600">{formData.notes || 'No notes'}</p></div>
          <div className="flex justify-end"><button type="button" onClick={handleCloseModal} className="px-6 py-2 border rounded-lg">Close</button></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <aside className="w-64 bg-white dark:bg-gray-800 flex flex-col border-r">
        <div className="p-4 flex items-center space-x-2 border-b">
          <span className="material-icons text-primary text-3xl">admin_panel_settings</span>
          <h1 className="text-xl font-bold">Admin Panel</h1>
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
            ].map((item) => (
              <li key={item.id}>
                <button onClick={() => { setActiveTab(item.id); setCurrentPage(1); setSearchTerm(''); setFilterStatus('all'); }}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition ${activeTab === item.id ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                  <span className="material-icons mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <button onClick={() => navigate('/')} className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
            <span className="material-icons mr-2">home</span>Back to Website
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 border-b bg-white dark:bg-gray-800">
          <span className="text-gray-500">Welcome back, Admin</span>
          <div className="flex items-center space-x-4">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-gray-500 hover:text-primary">
              <span className="material-icons">notifications</span>
              {notifications.some(n => !n.read) && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
            {showNotifications && (
              <div className="absolute top-16 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border p-4 z-50">
                <h3 className="font-bold mb-3">Notifications</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map(notif => (
                    <div key={notif.id} className={`p-2 rounded ${notif.read ? '' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                      <p className="text-sm font-semibold">{notif.message}</p>
                      <p className="text-xs text-gray-500">{notif.time}</p>
                    </div>
                  ))}
                  {notifications.length === 0 && <p className="text-center text-gray-500 py-2">No notifications</p>}
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">AD</div>
              <div><p className="text-sm font-semibold">Admin</p><p className="text-xs text-gray-500">admin@techcare.com</p></div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'technicians' && renderTechnicians()}
          {activeTab === 'appointments' && renderAppointments()}
          {activeTab === 'reviews' && renderReviews()}
          {activeTab === 'services' && renderServices()}
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={handleCloseModal}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">{editingItem ? `Edit ${modalType}` : `Add ${modalType}`}</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-primary"><span className="material-icons">close</span></button>
            </div>
            {renderModalForm()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFull;
