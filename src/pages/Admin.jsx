import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Users, Wrench, Calendar, Star, Settings, LayoutDashboard, LogOut, Bell, Search, Plus,
  MoreVertical, CheckCircle, XCircle, Clock, DollarSign, Filter, ChevronRight,
  ArrowUpRight, ArrowDownRight, Briefcase, Mail, Phone, MapPin, Trash2, Edit, Eye,
  TrendingUp, Activity, Download, RefreshCw, UserPlus, AlertCircle, BarChart3,
  FileText, Shield, Zap
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from '../hooks/use-toast';

import { useAuth } from '../context/AuthContext';
import CurrencyDisplay from '../components/CurrencyDisplay';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Admin = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Real-time data states
  const [users, setUsers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTechnicians: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    totalRevenue: 0,
    avgRating: 0,
    totalReviews: 0,
    cancelledAppointments: 0
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
    specialization: [],
    brands: [],
    experience: 0,
    priceRange: { min: 0, max: 0 },
    location: { address: '', coordinates: [] },
    description: '',
    status: 'active'
  });

  // Auto-refresh interval (30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAllData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Initial data load
  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        fetchUsers(),
        fetchTechnicians(),
        fetchAppointments(),
        fetchReviews()
      ]);
      calculateStats();
    } catch (error) {
      console.error('[ADMIN] Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load admin data"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh all data (for manual refresh button)
  const refreshAllData = async () => {
    setIsRefreshing(true);
    await fetchAllData();
    setTimeout(() => setIsRefreshing(false), 500);
    toast({
      title: "Refreshed",
      description: "All data has been updated"
    });
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('[ADMIN] Error fetching users:', error);
      // Fallback to basic user fetch if admin endpoint doesn't exist yet
      try {
        const response = await axios.get(`${API_URL}/api/users`);
        setUsers(response.data);
      } catch (err) {
        console.error('[ADMIN] Fallback fetch also failed:', err);
      }
    }
  };

  // Fetch Technicians
  const fetchTechnicians = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/technicians/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTechnicians(response.data);
    } catch (error) {
      console.error('[ADMIN] Error fetching technicians:', error);
      // Fallback
      try {
        const response = await axios.get(`${API_URL}/api/technicians/nearby?lng=79.8612&lat=6.9271&dist=5000000`);
        setTechnicians(response.data.filter(t => t.role === 'technician'));
      } catch (err) {
        console.error('[ADMIN] Fallback fetch also failed:', err);
      }
    }
  };

  // Fetch Appointments
  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/appointments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('[ADMIN] Error fetching appointments:', error);
      setAppointments([]);
    }
  };

  // Fetch Reviews
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/reviews`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setReviews(response.data);
    } catch (error) {
      console.error('[ADMIN] Error fetching reviews:', error);
      setReviews([]);
    }
  };

  // Calculate statistics from real data
  const calculateStats = useCallback(() => {
    const totalUsers = users.filter(u => u.role !== 'technician').length;
    const activeTechnicians = technicians.filter(t => t.role === 'technician').length;
    const pendingAppointments = appointments.filter(a => a.status === 'pending' || a.status === 'scheduled').length;
    const completedAppointments = appointments.filter(a => a.status === 'completed').length;
    const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;

    const totalRevenue = appointments
      .filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + (a.price || 0), 0);

    const avgRating = technicians.length > 0
      ? technicians.reduce((sum, t) => sum + (t.rating || 0), 0) / technicians.length
      : 0;

    const totalReviews = reviews.length;

    setStats({
      totalUsers,
      activeTechnicians,
      pendingAppointments,
      completedAppointments,
      totalRevenue,
      avgRating: parseFloat(avgRating.toFixed(2)),
      totalReviews,
      cancelledAppointments
    });
  }, [users, technicians, appointments, reviews]);

  // Recalculate stats whenever data changes
  useEffect(() => {
    calculateStats();
  }, [users, technicians, appointments, reviews, calculateStats]);

  // Handle Create User
  const handleCreateUser = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, data);
      toast({
        title: "Success",
        description: "User created successfully"
      });
      await fetchUsers();
      return true;
    } catch (error) {
      console.error('[ADMIN] Error creating user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to create user"
      });
      return false;
    }
  };

  // Handle Update User
  const handleUpdateUser = async (userId, data) => {
    try {
      await axios.put(`${API_URL}/api/admin/users/${userId}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast({
        title: "Success",
        description: "User updated successfully"
      });
      await fetchUsers();
      return true;
    } catch (error) {
      console.error('[ADMIN] Error updating user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user"
      });
      return false;
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`${API_URL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
      await fetchUsers();
    } catch (error) {
      console.error('[ADMIN] Error deleting user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user"
      });
    }
  };

  // Handle Delete Technician
  const handleDeleteTechnician = async (techId) => {
    if (!window.confirm('Are you sure you want to delete this technician?')) return;

    try {
      await axios.delete(`${API_URL}/api/admin/users/${techId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast({
        title: "Success",
        description: "Technician deleted successfully"
      });
      await fetchTechnicians();
    } catch (error) {
      console.error('[ADMIN] Error deleting technician:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete technician"
      });
    }
  };

  // Handle Update Appointment Status
  const handleUpdateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/appointments/${appointmentId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast({
        title: "Success",
        description: `Appointment ${newStatus}`
      });
      await fetchAppointments();
    } catch (error) {
      console.error('[ADMIN] Error updating appointment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update appointment"
      });
    }
  };

  // Handle Update Review Status
  const handleUpdateReviewStatus = async (reviewId, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/reviews/${reviewId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast({
        title: "Success",
        description: `Review ${newStatus}`
      });
      await fetchReviews();
    } catch (error) {
      console.error('[ADMIN] Error updating review:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update review"
      });
    }
  };

  // Modal handlers
  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: type === 'technician' ? 'technician' : 'user',
        specialization: [],
        brands: [],
        experience: 0,
        priceRange: { min: 0, max: 0 },
        location: { address: '', coordinates: [] },
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
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    let success = false;
    if (modalType === 'user' || modalType === 'technician') {
      if (editingItem) {
        success = await handleUpdateUser(editingItem._id, formData);
      } else {
        success = await handleCreateUser(formData);
      }
    }

    if (success) {
      handleCloseModal();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'approved':
      case 'completed':
        return 'default';
      case 'pending':
      case 'scheduled':
        return 'secondary';
      case 'inactive':
      case 'cancelled':
      case 'rejected':
        return 'destructive';
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={refreshAllData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">●</span> Active customers
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Technicians</CardTitle>
            <Wrench className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTechnicians}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">●</span> Registered technicians
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAppointments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-orange-500">●</span> Awaiting service
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CurrencyDisplay amount={stats.totalRevenue} decimals={0} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">●</span> From {stats.completedAppointments} jobs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed Jobs</p>
              <p className="text-2xl font-bold mt-1">{stats.completedAppointments}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500 opacity-80" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
              <p className="text-2xl font-bold mt-1">{stats.avgRating}/5.0</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500 opacity-80" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
              <p className="text-2xl font-bold mt-1">{stats.totalReviews}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500 opacity-80" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cancellations</p>
              <p className="text-2xl font-bold mt-1">{stats.cancelledAppointments}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500 opacity-80" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => handleOpenModal('user')} className="w-full justify-between" size="lg">
              <span className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
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
            <Button onClick={() => setActiveTab('appointments')} variant="outline" className="w-full justify-between" size="lg">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                View Appointments
              </span>
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button onClick={() => setActiveTab('reviews')} variant="ghost" className="w-full justify-between border" size="lg">
              <span className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Manage Reviews
              </span>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px]">
              {appointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No appointments yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.slice(0, 5).map((apt) => (
                    <div key={apt._id} className="flex items-start space-x-4 p-3 rounded-lg border bg-card hover:bg-accent transition-colors">
                      <div className="bg-primary/10 p21 rounded-full">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">New Appointment</p>
                        <p className="text-xs text-muted-foreground">
                          {apt.customerName || 'Customer'} • {new Date(apt.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(apt.status)}>
                        {apt.status || 'pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Top Technicians */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Top Performing Technicians
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {technicians.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Wrench className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No technicians registered yet</p>
              </div>
            ) : (
              technicians.slice(0, 5).map((tech, index) => (
                <div key={tech._id} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                    #{index + 1}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={tech.profileImage} />
                    <AvatarFallback>{tech.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{tech.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {tech.specialization?.join(', ') || 'General Services'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{tech.rating || 0}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{tech.reviewCount || 0} reviews</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Users</h2>
          <p className="text-muted-foreground">{users.length} total users</p>
        </div>
        <Button onClick={() => handleOpenModal('user')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No users found</p>
              <Button onClick={() => handleOpenModal('user')} variant="link" className="mt-2">
                Add your first user
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.profileImage} />
                          <AvatarFallback>{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal('user', user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderTechnicians = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Technicians</h2>
          <p className="text-muted-foreground">{technicians.length} registered technicians</p>
        </div>
        <Button onClick={() => handleOpenModal('technician')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Technician
        </Button>
      </div>

      {technicians.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Wrench className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No technicians found</p>
            <Button onClick={() => handleOpenModal('technician')} variant="link" className="mt-2">
              Add your first technician
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicians.map((tech) => (
            <Card key={tech._id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={tech.profileImage} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {tech.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{tech.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {tech.experience || 0} years exp.
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="default">{tech.role}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{tech.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  {tech.phone || '-'}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Star className="mr-1 h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold mr-1">{tech.rating || 0}</span>
                    <span className="text-muted-foreground">({tech.reviewCount || 0})</span>
                  </div>
                  {tech.specialization && tech.specialization.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {tech.specialization[0]}
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" className="flex-1" onClick={() => handleOpenModal('technician', tech)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteTechnician(tech._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Appointments</h2>
          <p className="text-muted-foreground">{appointments.length} total appointments</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No appointments yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((apt) => (
                  <TableRow key={apt._id}>
                    <TableCell className="font-mono text-xs">
                      #{apt._id?.substring(0, 8)}
                    </TableCell>
                    <TableCell>{apt.customerName || 'N/A'}</TableCell>
                    <TableCell>{apt.technicianName || 'N/A'}</TableCell>
                    <TableCell>{new Date(apt.date || apt.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={apt.status || 'pending'}
                        onValueChange={(value) => handleUpdateAppointmentStatus(apt._id, value)}
                      >
                        <SelectTrigger className="h-8 w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="font-semibold">Rs.{apt.price || 0}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Reviews</h2>
          <p className="text-muted-foreground">{reviews.length} total reviews</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {review.customerName?.substring(0, 2).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{review.customerName || 'Anonymous'}</p>
                        <p className="text-xs text-muted-foreground">
                          For: {review.technicianName || 'Unknown Technician'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < (review.rating || 0)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                      <Select
                        defaultValue={review.status || 'pending'}
                        onValueChange={(value) => handleUpdateReviewStatus(review._id, value)}
                      >
                        <SelectTrigger className="h-8 w-[110px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <p className="text-sm">{review.comment || 'No comment provided'}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage system configuration</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Database Status</p>
                <p className="text-sm text-muted-foreground">MongoDB Connection</p>
              </div>
              <Badge variant="default">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Connected
                </span>
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">API Server</p>
                <p className="text-sm text-muted-foreground">{API_URL}</p>
              </div>
              <Badge variant="default">Running</Badge>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Auto Refresh</p>
                <p className="text-sm text-muted-foreground">Updates every 30 seconds</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Data Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span className="font-medium">Total Records</span>
                <span className="text-2xl font-bold">
                  {users.length + technicians.length + appointments.length + reviews.length}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Users</p>
                  <p className="text-xl font-bold">{users.length}</p>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Technicians</p>
                  <p className="text-xl font-bold">{technicians.length}</p>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Appointments</p>
                  <p className="text-xl font-bold">{appointments.length}</p>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Reviews</p>
                  <p className="text-xl font-bold">{reviews.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 border border-red-500/50 rounded-lg bg-red-500/5">
              <div>
                <p className="font-medium text-red-500">Clear All Data</p>
                <p className="text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
              <Button variant="destructive" size="sm">
                Clear Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <RefreshCw className="h-12 w-12 mx-auto animate-spin text-primary" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                TechCare Admin
              </h1>
              <p className="text-sm text-muted-foreground">System Management Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('dashboard')}
            className="gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('users')}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Users
          </Button>
          <Button
            variant={activeTab === 'technicians' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('technicians')}
            className="gap-2"
          >
            <Wrench className="h-4 w-4" />
            Technicians
          </Button>
          <Button
            variant={activeTab === 'appointments' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('appointments')}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            Appointments
          </Button>
          <Button
            variant={activeTab === 'reviews' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('reviews')}
            className="gap-2"
          >
            <Star className="h-4 w-4" />
            Reviews
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('settings')}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>

        <div className="mt-6">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'technicians' && renderTechnicians()}
          {activeTab === 'appointments' && renderAppointments()}
          {activeTab === 'reviews' && renderReviews()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>

      {/* User/Technician Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit' : 'Add New'} {modalType === 'technician' ? 'Technician' : 'User'}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update' : 'Create'} {modalType} information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            {!editingItem && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password || ''}
                  onChange={handleInputChange}
                  required={!editingItem}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit">
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
