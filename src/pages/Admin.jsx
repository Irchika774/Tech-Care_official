import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Wrench,
  Calendar,
  Star,
  Settings,
  LayoutDashboard,
  LogOut,
  Bell,
  Search,
  Plus,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Filter,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    specialization: '',
    location: '',
    experience: '',
    customer: '',
    technician: '',
    service: '',
    device: '',
    date: '',
    time: '',
    price: '',
    notes: '',
    category: '',
    priceRange: '',
    duration: '',
    description: '',
    status: 'active'
  });

  const [formErrors, setFormErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
    setFormErrors({});

    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        specialization: '',
        location: '',
        experience: '',
        customer: '',
        technician: '',
        service: '',
        device: '',
        date: '',
        time: '',
        price: '',
        notes: '',
        category: '',
        priceRange: '',
        duration: '',
        description: '',
        status: 'active'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
    setFormData({});
    setFormErrors({});
    setShowSuccessMessage(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (modalType === 'user') {
      if (!formData.name || formData.name.trim() === '') {
        errors.name = 'Name is required';
      }
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Valid email is required';
      }
      if (!formData.phone || formData.phone.trim() === '') {
        errors.phone = 'Phone is required';
      }
    } else if (modalType === 'technician') {
      if (!formData.name || formData.name.trim() === '') {
        errors.name = 'Business name is required';
      }
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Valid email is required';
      }
      if (!formData.phone || formData.phone.trim() === '') {
        errors.phone = 'Phone is required';
      }
      if (!formData.specialization) {
        errors.specialization = 'Specialization is required';
      }
    } else if (modalType === 'appointment') {
      if (!formData.customer || formData.customer.trim() === '') {
        errors.customer = 'Customer name is required';
      }
      if (!formData.technician) {
        errors.technician = 'Technician is required';
      }
      if (!formData.service) {
        errors.service = 'Service is required';
      }
      if (!formData.device || formData.device.trim() === '') {
        errors.device = 'Device is required';
      }
      if (!formData.date) {
        errors.date = 'Date is required';
      }
      if (!formData.time) {
        errors.time = 'Time is required';
      }
      if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
        errors.price = 'Valid price is required';
      }
    } else if (modalType === 'service') {
      if (!formData.name || formData.name.trim() === '') {
        errors.name = 'Service name is required';
      }
      if (!formData.category) {
        errors.category = 'Category is required';
      }
      if (!formData.priceRange || formData.priceRange.trim() === '') {
        errors.priceRange = 'Price range is required';
      }
      if (!formData.duration || formData.duration.trim() === '') {
        errors.duration = 'Duration is required';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (modalType === 'user') {
      if (editingItem) {
        setUsers(users.map(u =>
          u.id === editingItem.id ? { ...u, ...formData } : u
        ));
      } else {
        const newUser = {
          id: Math.max(...users.map(u => u.id), 0) + 1,
          ...formData,
          role: 'customer',
          joined: new Date().toISOString().split('T')[0],
          appointments: 0
        };
        setUsers([...users, newUser]);
      }
    } else if (modalType === 'technician') {
      if (editingItem) {
        setTechnicians(technicians.map(t =>
          t.id === editingItem.id ? { ...t, ...formData } : t
        ));
      } else {
        const newTech = {
          id: Math.max(...technicians.map(t => t.id), 0) + 1,
          ...formData,
          rating: 0,
          reviews: 0,
          earnings: 0
        };
        setTechnicians([...technicians, newTech]);
      }
    } else if (modalType === 'appointment') {
      if (editingItem) {
        setAppointments(appointments.map(a =>
          a.id === editingItem.id ? { ...a, ...formData } : a
        ));
      } else {
        const newAppt = {
          id: Math.max(...appointments.map(a => a.id), 0) + 1,
          ...formData,
          status: 'scheduled',
          price: Number(formData.price)
        };
        setAppointments([...appointments, newAppt]);
      }
    } else if (modalType === 'service') {
      if (editingItem) {
        setServices(services.map(s =>
          s.id === editingItem.id ? { ...s, ...formData, price: formData.priceRange } : s
        ));
      } else {
        const newService = {
          id: Math.max(...services.map(s => s.id), 0) + 1,
          ...formData,
          price: formData.priceRange,
          active: true
        };
        setServices([...services, newService]);
      }
    }

    setShowSuccessMessage(true);
    setTimeout(() => {
      handleCloseModal();
    }, 1500);
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

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'completed':
        return 'default'; // Green-ish usually
      case 'pending':
      case 'scheduled':
        return 'secondary'; // Yellow-ish usually
      case 'inactive':
      case 'cancelled':
        return 'destructive'; // Red-ish usually
      default:
        return 'outline';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">Welcome back, {user?.name || 'Admin'}</p>
        </div>
        <Button variant="outline" className="gap-2">
          Last 30 Days
          <ChevronRight className="h-4 w-4 rotate-90" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">+12%</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Technicians</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTechnicians}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">+5%</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Repairs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRepairs}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              <span className="text-red-500 font-medium">-3%</span>
              <span className="ml-1">from last week</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">+8%</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
              <p className="text-2xl font-bold mt-1">{stats.completedToday}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500 opacity-80" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
              <p className="text-2xl font-bold mt-1">{stats.avgRating}/5.0</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500 opacity-80" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Appointments</p>
              <p className="text-2xl font-bold mt-1">{stats.totalAppointments}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500 opacity-80" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cancellation Rate</p>
              <p className="text-2xl font-bold mt-1">{((stats.cancelledAppointments / stats.totalAppointments) * 100).toFixed(1)}%</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500 opacity-80" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => handleOpenModal('user')} className="w-full justify-between" size="lg">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Add New User
              </span>
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button onClick={() => handleOpenModal('technician')} variant="secondary" className="w-full justify-between" size="lg">
              <span className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Add New Technician
              </span>
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button onClick={() => handleOpenModal('service')} variant="outline" className="w-full justify-between" size="lg">
              <span className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Service
              </span>
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button onClick={() => setActiveTab('appointments')} variant="ghost" className="w-full justify-between border" size="lg">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                View All Appointments
              </span>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[240px]">
              <div className="space-y-4">
                {appointments.slice(0, 4).map((apt) => (
                  <div key={apt.id} className="flex items-start space-x-4 p-3 rounded-lg border bg-card hover:bg-accent transition-colors">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{apt.service}</p>
                      <p className="text-xs text-muted-foreground">{apt.customer} • {apt.date}</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(apt.status)}>
                      {apt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Manage Users</h2>
        <Button onClick={() => handleOpenModal('user')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Appointments</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.joined}</TableCell>
                  <TableCell>{user.appointments}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal('user', user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderTechnicians = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Manage Technicians</h2>
        <Button onClick={() => handleOpenModal('technician')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Technician
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {technicians.map((tech) => (
          <Card key={tech.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {tech.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{tech.name}</CardTitle>
                  <CardDescription>{tech.specialization}</CardDescription>
                </div>
              </div>
              <Badge variant={getStatusBadgeVariant(tech.status)}>
                {tech.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3 mt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" />
                {tech.email}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="mr-2 h-4 w-4" />
                {tech.phone}
              </div>
              <div className="flex items-center text-sm">
                <Star className="mr-2 h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold mr-1">{tech.rating}</span>
                <span className="text-muted-foreground">({tech.reviews} reviews)</span>
              </div>
              <div className="flex items-center text-sm">
                <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                <span className="font-semibold">${tech.earnings.toLocaleString()}</span>
                <span className="ml-1 text-muted-foreground">earnings</span>
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" className="flex-1" onClick={() => handleOpenModal('technician', tech)}>
                Edit
              </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDeleteTechnician(tech.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Manage Appointments</h2>
        <div className="w-[200px]">
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell className="font-medium">#{apt.id}</TableCell>
                  <TableCell>{apt.customer}</TableCell>
                  <TableCell>{apt.technician}</TableCell>
                  <TableCell>
                    <div>{apt.service}</div>
                    <div className="text-xs text-muted-foreground">{apt.device}</div>
                  </TableCell>
                  <TableCell>
                    <div>{apt.date}</div>
                    <div className="text-xs text-muted-foreground">{apt.time}</div>
                  </TableCell>
                  <TableCell className="font-semibold text-primary">${apt.price}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={apt.status}
                      onValueChange={(value) => handleUpdateAppointmentStatus(apt.id, value)}
                    >
                      <SelectTrigger className={`h-8 w-[110px] ${apt.status === 'completed' ? 'text-green-600' :
                        apt.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Manage Reviews</h2>
        <div className="flex gap-2">
          <Button variant="default">All</Button>
          <Button variant="outline">Pending</Button>
          <Button variant="outline">Approved</Button>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {review.customer.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{review.customer}</h3>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      For: <span className="font-semibold text-foreground">{review.technician}</span>
                    </p>
                    <p className="text-sm mt-2">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={getStatusBadgeVariant(review.status)}>
                    {review.status}
                  </Badge>
                  {review.status === 'pending' && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleUpdateReviewStatus(review.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Manage Services</h2>
        <Button onClick={() => handleOpenModal('service')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <CardDescription>{service.category}</CardDescription>
              </div>
              <Badge variant={service.active ? 'default' : 'secondary'}>
                {service.active ? 'Active' : 'Inactive'}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3 mt-4">
              <div className="flex items-center text-sm">
                <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{service.price}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{service.duration}</span>
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" className="flex-1" onClick={() => handleOpenModal('service', service)}>
                Edit
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <h4 className="font-semibold">Maintenance Mode</h4>
                <p className="text-sm text-muted-foreground">Temporarily disable the platform</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <h4 className="font-semibold">Auto-Approve Technicians</h4>
                <p className="text-sm text-muted-foreground">Automatically approve new technician registrations</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-semibold">Email Notifications</h4>
                <p className="text-sm text-muted-foreground">Send email notifications to users</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commission Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Platform Commission (%)</Label>
              <Input type="number" defaultValue="15" />
            </div>
            <div className="space-y-2">
              <Label>Minimum Withdrawal Amount ($)</Label>
              <Input type="number" defaultValue="100" />
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-4">
            <Button variant="outline">Reset</Button>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col">
        <div className="p-6 flex items-center gap-2 border-b">
          <Settings className="text-primary h-6 w-6" />
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-6 flex-1 px-4 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'users', icon: Users, label: 'Users' },
            { id: 'technicians', icon: Wrench, label: 'Technicians' },
            { id: 'appointments', icon: Calendar, label: 'Appointments' },
            { id: 'reviews', icon: Star, label: 'Reviews' },
            { id: 'services', icon: Briefcase, label: 'Services' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
            <LogOut className="mr-2 h-4 w-4" />
            Back to Website
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b bg-card">
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">Welcome back, Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@techcare.com</p>
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
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? `Edit ${modalType}` : `Add New ${modalType}`}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Make changes to the item here.' : 'Fill in the details to create a new item.'}
            </DialogDescription>
          </DialogHeader>

          {showSuccessMessage && (
            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              <span>{editingItem ? 'Updated' : 'Created'} successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmitForm} className="space-y-4 py-4">
            {modalType === 'user' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className={formErrors.name ? 'border-red-500' : ''}
                    />
                    {formErrors.name && <p className="text-red-500 text-xs">{formErrors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      className={formErrors.email ? 'border-red-500' : ''}
                    />
                    {formErrors.email && <p className="text-red-500 text-xs">{formErrors.email}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className={formErrors.phone ? 'border-red-500' : ''}
                    />
                    {formErrors.phone && <p className="text-red-500 text-xs">{formErrors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      name="status"
                      value={formData.status || 'active'}
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            {modalType === 'technician' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tech-name">Business Name *</Label>
                    <Input
                      id="tech-name"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className={formErrors.name ? 'border-red-500' : ''}
                    />
                    {formErrors.name && <p className="text-red-500 text-xs">{formErrors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tech-email">Email *</Label>
                    <Input
                      id="tech-email"
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      className={formErrors.email ? 'border-red-500' : ''}
                    />
                    {formErrors.email && <p className="text-red-500 text-xs">{formErrors.email}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tech-phone">Phone *</Label>
                    <Input
                      id="tech-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className={formErrors.phone ? 'border-red-500' : ''}
                    />
                    {formErrors.phone && <p className="text-red-500 text-xs">{formErrors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization *</Label>
                    <Select
                      name="specialization"
                      value={formData.specialization || ''}
                      onValueChange={(value) => handleSelectChange('specialization', value)}
                    >
                      <SelectTrigger className={formErrors.specialization ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select Specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mobile Devices">Mobile Devices</SelectItem>
                        <SelectItem value="PC Repair">PC Repair</SelectItem>
                        <SelectItem value="Laptop Repair">Laptop Repair</SelectItem>
                        <SelectItem value="All Devices">All Devices</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.specialization && <p className="text-red-500 text-xs">{formErrors.specialization}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., New York, NY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience</Label>
                    <Input
                      id="experience"
                      name="experience"
                      value={formData.experience || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., 5 years"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tech-status">Status</Label>
                  <Select
                    name="status"
                    value={formData.status || 'pending'}
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {modalType === 'appointment' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer">Customer Name *</Label>
                    <Input
                      id="customer"
                      name="customer"
                      value={formData.customer || ''}
                      onChange={handleInputChange}
                      className={formErrors.customer ? 'border-red-500' : ''}
                    />
                    {formErrors.customer && <p className="text-red-500 text-xs">{formErrors.customer}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="technician">Technician *</Label>
                    <Select
                      name="technician"
                      value={formData.technician || ''}
                      onValueChange={(value) => handleSelectChange('technician', value)}
                    >
                      <SelectTrigger className={formErrors.technician ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select Technician" />
                      </SelectTrigger>
                      <SelectContent>
                        {technicians.map(tech => (
                          <SelectItem key={tech.id} value={tech.name}>{tech.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.technician && <p className="text-red-500 text-xs">{formErrors.technician}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service">Service *</Label>
                    <Select
                      name="service"
                      value={formData.service || ''}
                      onValueChange={(value) => handleSelectChange('service', value)}
                    >
                      <SelectTrigger className={formErrors.service ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select Service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map(svc => (
                          <SelectItem key={svc.id} value={svc.name}>{svc.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.service && <p className="text-red-500 text-xs">{formErrors.service}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="device">Device *</Label>
                    <Input
                      id="device"
                      name="device"
                      value={formData.device || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., iPhone 14"
                      className={formErrors.device ? 'border-red-500' : ''}
                    />
                    {formErrors.device && <p className="text-red-500 text-xs">{formErrors.device}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      name="date"
                      value={formData.date || ''}
                      onChange={handleInputChange}
                      className={formErrors.date ? 'border-red-500' : ''}
                    />
                    {formErrors.date && <p className="text-red-500 text-xs">{formErrors.date}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      name="time"
                      value={formData.time || ''}
                      onChange={handleInputChange}
                      className={formErrors.time ? 'border-red-500' : ''}
                    />
                    {formErrors.time && <p className="text-red-500 text-xs">{formErrors.time}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      name="price"
                      value={formData.price || ''}
                      onChange={handleInputChange}
                      className={formErrors.price ? 'border-red-500' : ''}
                    />
                    {formErrors.price && <p className="text-red-500 text-xs">{formErrors.price}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {modalType === 'service' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service-name">Service Name *</Label>
                    <Input
                      id="service-name"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className={formErrors.name ? 'border-red-500' : ''}
                    />
                    {formErrors.name && <p className="text-red-500 text-xs">{formErrors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      name="category"
                      value={formData.category || ''}
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger className={formErrors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mobile">Mobile</SelectItem>
                        <SelectItem value="PC">PC</SelectItem>
                        <SelectItem value="Laptop">Laptop</SelectItem>
                        <SelectItem value="All">All Devices</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.category && <p className="text-red-500 text-xs">{formErrors.category}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priceRange">Price Range *</Label>
                    <Input
                      id="priceRange"
                      name="priceRange"
                      value={formData.priceRange || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., 50-250"
                      className={formErrors.priceRange ? 'border-red-500' : ''}
                    />
                    {formErrors.priceRange && <p className="text-red-500 text-xs">{formErrors.priceRange}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <Input
                      id="duration"
                      name="duration"
                      value={formData.duration || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., 1-2 hours"
                      className={formErrors.duration ? 'border-red-500' : ''}
                    />
                    {formErrors.duration && <p className="text-red-500 text-xs">{formErrors.duration}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={showSuccessMessage}>
                {editingItem ? 'Update' : 'Create'} {modalType?.charAt(0).toUpperCase() + modalType?.slice(1)}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
