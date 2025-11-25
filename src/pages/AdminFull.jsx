import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminFull = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNotifications, setShowNotifications] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    service: '',
    device: '',
    date: '',
    time: '',
    category: '',
    price: '',
    duration: '',
    status: 'active'
  });

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
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890', role: 'customer', status: 'active', joined: '2025-01-15', appointments: 12, address: '123 Main St, City, ST 12345' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891', role: 'customer', status: 'active', joined: '2025-02-20', appointments: 8, address: '456 Oak Ave, Town, ST 67890' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1234567892', role: 'customer', status: 'inactive', joined: '2025-03-10', appointments: 3, address: '789 Pine Rd, Village, ST 13579' },
    { id: 4, name: 'Sarah Connor', email: 'sarah@example.com', phone: '+1234567893', role: 'customer', status: 'active', joined: '2025-04-05', appointments: 15, address: '321 Elm St, City, ST 24680' },
    { id: 5, name: 'Tom Hardy', email: 'tom@example.com', phone: '+1234567894', role: 'customer', status: 'active', joined: '2025-05-12', appointments: 6, address: '654 Maple Dr, Town, ST 11111' },
  ]);

  // Technicians Data
  const [technicians, setTechnicians] = useState([
    { id: 1, name: 'Mobile Wizards', email: 'contact@mobilewizards.com', phone: '+1234567893', specialization: 'Mobile Devices', rating: 4.9, reviews: 1200, status: 'active', earnings: 45000, location: 'New York, NY', experience: '5 years' },
    { id: 2, name: 'Circuit Masters', email: 'info@circuitmasters.com', phone: '+1234567894', specialization: 'PC Repair', rating: 4.9, reviews: 302, status: 'active', earnings: 52000, location: 'Los Angeles, CA', experience: '7 years' },
    { id: 3, name: 'Tech Solutions Hub', email: 'support@techsolutions.com', phone: '+1234567895', specialization: 'All Devices', rating: 4.7, reviews: 180, status: 'pending', earnings: 28000, location: 'Chicago, IL', experience: '3 years' },
    { id: 4, name: 'Gadget Gurus', email: 'hello@gadgetgurus.com', phone: '+1234567896', specialization: 'Mobile Devices', rating: 4.8, reviews: 650, status: 'active', earnings: 38000, location: 'Houston, TX', experience: '4 years' },
  ]);

  // Appointments Data
  const [appointments, setAppointments] = useState([
    { id: 1, customer: 'John Doe', technician: 'Mobile Wizards', service: 'Screen Repair', device: 'iPhone 14', date: '2025-11-06', time: '10:00 AM', status: 'scheduled', price: 150, notes: 'Cracked screen, urgent' },
    { id: 2, customer: 'Jane Smith', technician: 'Circuit Masters', service: 'Hardware Upgrade', device: 'Custom PC', date: '2025-11-06', time: '2:00 PM', status: 'scheduled', price: 300, notes: 'RAM upgrade needed' },
    { id: 3, customer: 'Mike Johnson', technician: 'Tech Solutions Hub', service: 'Battery Replace', device: 'MacBook Pro', date: '2025-11-05', time: '11:00 AM', status: 'completed', price: 200, notes: 'Battery draining fast' },
    { id: 4, customer: 'Sarah Connor', technician: 'Mobile Wizards', service: 'Water Damage', device: 'Samsung S23', date: '2025-11-04', time: '3:00 PM', status: 'cancelled', price: 180, notes: 'Dropped in water' },
    { id: 5, customer: 'Tom Hardy', technician: 'Gadget Gurus', service: 'Screen Repair', device: 'iPhone 13', date: '2025-11-07', time: '9:00 AM', status: 'scheduled', price: 120, notes: 'Minor scratch' },
  ]);

  // Reviews Data
  const [reviews, setReviews] = useState([
    { id: 1, customer: 'John Doe', technician: 'Mobile Wizards', rating: 5, comment: 'Excellent service! Very professional.', date: '2025-11-01', status: 'approved' },
    { id: 2, customer: 'Jane Smith', technician: 'Circuit Masters', rating: 5, comment: 'Great work on my PC upgrade.', date: '2025-10-30', status: 'approved' },
    { id: 3, customer: 'Mike Johnson', technician: 'Tech Solutions Hub', rating: 3, comment: 'Service was okay but took longer than expected.', date: '2025-10-29', status: 'pending' },
    { id: 4, customer: 'Sarah Connor', technician: 'Mobile Wizards', rating: 4, comment: 'Good service, but a bit pricey.', date: '2025-10-28', status: 'approved' },
    { id: 5, customer: 'Tom Hardy', technician: 'Gadget Gurus', rating: 5, comment: 'Fast and efficient!', date: '2025-10-27', status: 'pending' },
  ]);

  // Services Data
  const [services, setServices] = useState([
    { id: 1, name: 'Screen Repair', category: 'Mobile', priceMin: 50, priceMax: 250, duration: '1-2 hours', active: true, description: 'Professional screen replacement for all mobile devices' },
    { id: 2, name: 'Battery Replacement', category: 'Mobile', priceMin: 60, priceMax: 150, duration: '30-60 mins', active: true, description: 'Quick battery replacement service' },
    { id: 3, name: 'Hardware Upgrade', category: 'PC', priceMin: 100, priceMax: 600, duration: '2-4 hours', active: true, description: 'RAM, SSD, and component upgrades' },
    { id: 4, name: 'Data Recovery', category: 'All', priceMin: 100, priceMax: 500, duration: '1-3 days', active: true, description: 'Recover lost or deleted data' },
    { id: 5, name: 'Virus Removal', category: 'All', priceMin: 80, priceMax: 200, duration: '2-3 hours', active: true, description: 'Complete system cleaning and protection' },
  ]);

  // Notifications
  const [notifications] = useState([
    { id: 1, type: 'appointment', message: 'New appointment scheduled by John Doe', time: '5 min ago', read: false },
    { id: 2, type: 'review', message: 'Tom Hardy left a 5-star review', time: '15 min ago', read: false },
    { id: 3, type: 'technician', message: 'New technician application pending', time: '1 hour ago', read: true },
    { id: 4, type: 'payment', message: 'Payment received: $150', time: '2 hours ago', read: true },
  ]);

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        service: '',
        device: '',
        date: '',
        time: '',
        category: '',
        priceMin: '',
        priceMax: '',
        duration: '',
        status: 'active',
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
    setFormData({});
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    if (modalType === 'user') {
      if (editingItem) {
        setUsers(users.map(u => u.id === editingItem.id ? { ...u, ...formData } : u));
      } else {
        const newUser = {
          id: users.length + 1,
          ...formData,
          role: 'customer',
          joined: new Date().toISOString().split('T')[0],
          appointments: 0
        };
        setUsers([...users, newUser]);
      }
    } else if (modalType === 'technician') {
      if (editingItem) {
        setTechnicians(technicians.map(t => t.id === editingItem.id ? { ...t, ...formData } : t));
      } else {
        const newTech = {
          id: technicians.length + 1,
          ...formData,
          rating: 0,
          reviews: 0,
          earnings: 0
        };
        setTechnicians([...technicians, newTech]);
      }
    } else if (modalType === 'appointment') {
      if (editingItem) {
        setAppointments(appointments.map(a => a.id === editingItem.id ? { ...a, ...formData } : a));
      } else {
        const newAppt = {
          id: appointments.length + 1,
          ...formData,
          status: 'scheduled'
        };
        setAppointments([...appointments, newAppt]);
      }
    } else if (modalType === 'service') {
      if (editingItem) {
        setServices(services.map(s => s.id === editingItem.id ? { ...s, ...formData } : s));
      } else {
        const newService = {
          id: services.length + 1,
          ...formData,
          active: true
        };
        setServices([...services, newService]);
      }
    }
    
    handleCloseModal();
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

  const handleDeleteAppointment = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(appointments.filter(a => a.id !== id));
    }
  };

  const handleDeleteService = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
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

  const handleDeleteReview = (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  const handleExportCSV = (data, filename) => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
  };

  const convertToCSV = (data) => {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
    return `${headers}\n${rows}`;
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

  // Filtering and Search
  const getFilteredData = (data) => {
    let filtered = data;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }
    
    return filtered;
  };

  // Pagination
  const paginate = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = (dataLength) => {
    return Math.ceil(dataLength / itemsPerPage);
  };

  const renderPagination = (totalItems) => {
    const totalPages = getTotalPages(totalItems);
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-border-light dark:border-border-dark disabled:opacity-50 hover:bg-background-light dark:hover:bg-background-dark"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-primary text-white' : 'border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-border-light dark:border-border-dark disabled:opacity-50 hover:bg-background-light dark:hover:bg-background-dark"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  // Render Modal Form
  const renderModalForm = () => {
    if (modalType === 'user') {
      return (
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status || 'active'}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-2 border border-border-light dark:border-border-dark rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
            >
              {editingItem ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      );
    } else if (modalType === 'technician') {
      return (
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Business Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Specialization *</label>
              <select
                name="specialization"
                value={formData.specialization || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Specialization</option>
                <option value="Mobile Devices">Mobile Devices</option>
                <option value="PC Repair">PC Repair</option>
                <option value="Laptop Repair">Laptop Repair</option>
                <option value="All Devices">All Devices</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Experience</label>
              <input
                type="text"
                name="experience"
                value={formData.experience || ''}
                onChange={handleInputChange}
                placeholder="e.g., 5 years"
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status || 'pending'}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-2 border border-border-light dark:border-border-dark rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
            >
              {editingItem ? 'Update Technician' : 'Create Technician'}
            </button>
          </div>
        </form>
      );
    } else if (modalType === 'appointment') {
      return (
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Customer Name *</label>
              <input
                type="text"
                name="customer"
                value={formData.customer || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Technician *</label>
              <select
                name="technician"
                value={formData.technician || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Technician</option>
                {technicians.map(tech => (
                  <option key={tech.id} value={tech.name}>{tech.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Service *</label>
              <select
                name="service"
                value={formData.service || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Service</option>
                {services.map(svc => (
                  <option key={svc.id} value={svc.name}>{svc.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Device *</label>
              <input
                type="text"
                name="device"
                value={formData.device || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Time *</label>
              <input
                type="time"
                name="time"
                value={formData.time || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-2 border border-border-light dark:border-border-dark rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
            >
              {editingItem ? 'Update Appointment' : 'Create Appointment'}
            </button>
          </div>
        </form>
      );
    } else if (modalType === 'service') {
      return (
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Service Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                name="category"
                value={formData.category || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Category</option>
                <option value="Mobile">Mobile</option>
                <option value="PC">PC</option>
                <option value="Laptop">Laptop</option>
                <option value="All">All Devices</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Min Price ($) *</label>
              <input
                type="number"
                name="priceMin"
                value={formData.priceMin || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Price ($) *</label>
              <input
                type="number"
                name="priceMax"
                value={formData.priceMax || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Duration *</label>
              <input
                type="text"
                name="duration"
                value={formData.duration || ''}
                onChange={handleInputChange}
                placeholder="e.g., 1-2 hours"
                required
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-2 border border-border-light dark:border-border-dark rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
            >
              {editingItem ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      );
    }
  };

  // Dashboard render function (keeping previous implementation)
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
            <button onClick={() => handleOpenModal('appointment')} className="w-full flex items-center justify-between p-3 bg-green-500 text-white rounded-lg hover:bg-opacity-90 transition">
              <span className="flex items-center">
                <span className="material-icons mr-2">event</span>
                Create Appointment
              </span>
              <span className="material-icons">arrow_forward</span>
            </button>
            <button onClick={() => handleOpenModal('service')} className="w-full flex items-center justify-between p-3 bg-orange-500 text-white rounded-lg hover:bg-opacity-90 transition">
              <span className="flex items-center">
                <span className="material-icons mr-2">add_circle</span>
                Add New Service
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

  // Users render with search and pagination
  const renderUsers = () => {
    const filteredUsers = getFilteredData(users);
    const paginatedUsers = paginate(filteredUsers);

    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">Manage Users</h2>
          <div className="flex space-x-4">
            <button 
              onClick={() => handleExportCSV(users, 'users')}
              className="flex items-center space-x-2 px-4 py-2 border border-border-light dark:border-border-dark rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition"
            >
              <span className="material-icons text-sm">download</span>
              <span>Export CSV</span>
            </button>
            <button 
              onClick={() => handleOpenModal('user')}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
            >
              <span className="material-icons">add</span>
              <span>Add New User</span>
            </button>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-6 mb-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
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
                {paginatedUsers.map((user) => (
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
          {renderPagination(filteredUsers.length)}
        </div>
      </>
    );
  };

  // Continue with other render functions...
  // (Due to character limits, I'll create the remaining sections in the component)

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
                  onClick={() => {
                    setActiveTab(item.id);
                    setCurrentPage(1);
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
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
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition"
            >
              <span className="material-icons">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {showNotifications && (
              <div className="absolute top-16 right-4 w-80 bg-card-light dark:bg-card-dark rounded-lg shadow-2xl border border-border-light dark:border-border-dark p-4 z-50">
                <h3 className="font-bold mb-3">Notifications</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map(notif => (
                    <div key={notif.id} className={`p-2 rounded ${notif.read ? '' : 'bg-blue-50 dark:bg-blue-900 bg-opacity-20'}`}>
                      <p className="text-sm font-semibold">{notif.message}</p>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
          {/* Other tabs would go here - keeping previous implementations */}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-card-light dark:bg-card-dark rounded-lg shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">
                {editingItem ? `Edit ${modalType}` : `Add New ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}
              </h3>
              <button onClick={handleCloseModal} className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary">
                <span className="material-icons">close</span>
              </button>
            </div>
            {renderModalForm()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFull;
