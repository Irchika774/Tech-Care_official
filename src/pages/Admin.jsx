import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Users, Wrench, Calendar, Star, Settings, LayoutDashboard, LogOut, Bell, Search, Plus,
  MoreVertical, CheckCircle, XCircle, Clock, DollarSign, Filter, ChevronRight,
  ArrowUpRight, ArrowDownRight, Briefcase, Mail, Phone, MapPin, Trash2, Edit, Eye,
  TrendingUp, Activity, Download, RefreshCw, UserPlus, AlertCircle, BarChart3,
  FileText, Shield, Zap, Sparkles, ArrowRight, ShieldCheck
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
import { supabase } from '../lib/supabase';
import CurrencyDisplay from '../components/CurrencyDisplay';
import SEO from '../components/SEO';
import ServiceManagement from '../components/admin/ServiceManagement';
import TransactionHistory from '../components/admin/TransactionHistory';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Admin = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');

  const getAuthHeader = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return { Authorization: `Bearer ${session?.access_token}` };
  };
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [techFilter, setTechFilter] = useState('all');

  const handleToggleVerification = async (techId, currentStatus) => {
    try {
      await axios.patch(`${API_URL}/api/admin/technicians/${techId}/verify`,
        { verified: !currentStatus },
        { headers: await getAuthHeader() }
      );
      toast({
        title: !currentStatus ? "Technician Verified" : "Verification Removed",
        description: `Technician status has been updated.`
      });
      fetchTechnicians();
    } catch (error) {
      console.error('Error toggling verification:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status"
      });
    }
  };

  // Real-time data states
  const [users, setUsers] = useState([]);
  const [pendingGigs, setPendingGigs] = useState([]);

  const fetchPendingGigs = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/gigs/pending`, {
        headers: await getAuthHeader()
      });
      setPendingGigs(response.data);
    } catch (error) {
      console.error('[ADMIN] Error fetching pending gigs:', error);
    }
  };

  const handleApproveGig = async (gigId, status, feedback) => {
    try {
      await axios.patch(`${API_URL}/api/admin/gigs/${gigId}/approve`,
        { status, feedback },
        { headers: await getAuthHeader() }
      );
      toast({
        title: status === 'approved' ? "Gig Approved" : "Gig Rejected",
        description: `Service status updated successfully.`
      });
      fetchPendingGigs();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update gig status"
      });
    }
  };
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
        fetchReviews(),
        fetchPendingGigs()
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

  // Refresh all data
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
        headers: await getAuthHeader()
      });
      setUsers(response.data);
    } catch (error) {
      console.error('[ADMIN] Error fetching users:', error);
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
        headers: await getAuthHeader()
      });
      setTechnicians(response.data);
    } catch (error) {
      console.error('[ADMIN] Error fetching technicians:', error);
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
        headers: await getAuthHeader()
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
        headers: await getAuthHeader()
      });
      setReviews(response.data);
    } catch (error) {
      console.error('[ADMIN] Error fetching reviews:', error);
      setReviews([]);
    }
  };

  // Calculate statistics
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

  useEffect(() => {
    calculateStats();
  }, [users, technicians, appointments, reviews, calculateStats]);

  // Handle Create User
  const handleCreateUser = async (data) => {
    try {
      await axios.post(`${API_URL}/api/auth/register`, data);
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
        headers: await getAuthHeader()
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
        headers: await getAuthHeader()
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
        headers: await getAuthHeader()
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
        { headers: await getAuthHeader() }
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
        { headers: await getAuthHeader() }
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

  // Loading state
  if (isLoading && users.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="mt-4 text-zinc-400 font-['Inter']">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-['Outfit'] font-bold tracking-tight text-white">Dashboard Overview</h2>
          <p className="text-zinc-400 font-['Inter']">Welcome back, {user?.name || 'Admin'}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={refreshAllData}
            disabled={isRefreshing}
            className="border-zinc-700 text-white hover:bg-zinc-800"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" className="gap-2 border-zinc-700 text-white hover:bg-zinc-800">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-['Inter'] font-medium opacity-90">Total Users</CardTitle>
            <Users className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-['Outfit'] font-bold">{stats.totalUsers}</div>
            <p className="text-xs opacity-80 mt-1">Active customers</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-['Inter'] font-medium opacity-90">Technicians</CardTitle>
            <Wrench className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-['Outfit'] font-bold">{stats.activeTechnicians}</div>
            <p className="text-xs opacity-80 mt-1">Registered technicians</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-600 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-['Inter'] font-medium opacity-90">Pending Jobs</CardTitle>
            <Clock className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-['Outfit'] font-bold">{stats.pendingAppointments}</div>
            <p className="text-xs opacity-80 mt-1">Awaiting service</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-['Inter'] font-medium opacity-90">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-['Outfit'] font-bold">
              <CurrencyDisplay amount={stats.totalRevenue} decimals={0} />
            </div>
            <p className="text-xs opacity-80 mt-1">From {stats.completedAppointments} jobs</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-['Inter'] font-medium text-zinc-400">Completed Jobs</p>
              <p className="text-2xl font-['Outfit'] font-bold text-white mt-1">{stats.completedAppointments}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-500 opacity-80" />
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-['Inter'] font-medium text-zinc-400">Avg Rating</p>
              <p className="text-2xl font-['Outfit'] font-bold text-white mt-1">{stats.avgRating}/5.0</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500 opacity-80" />
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-['Inter'] font-medium text-zinc-400">Total Reviews</p>
              <p className="text-2xl font-['Outfit'] font-bold text-white mt-1">{stats.totalReviews}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500 opacity-80" />
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-['Inter'] font-medium text-zinc-400">Cancellations</p>
              <p className="text-2xl font-['Outfit'] font-bold text-white mt-1">{stats.cancelledAppointments}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500 opacity-80" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-['Outfit'] text-white">
              <Zap className="h-5 w-5 text-yellow-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => handleOpenModal('user')} className="w-full justify-between bg-white text-black hover:bg-gray-100" size="lg">
              <span className="flex items-center gap-2 font-['Inter']">
                <UserPlus className="h-5 w-5" />
                Add New User
              </span>
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button onClick={() => handleOpenModal('technician')} variant="outline" className="w-full justify-between border-zinc-700 text-white hover:bg-zinc-800" size="lg">
              <span className="flex items-center gap-2 font-['Inter']">
                <Wrench className="h-5 w-5" />
                Add New Technician
              </span>
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button onClick={() => setActiveTab('appointments')} variant="outline" className="w-full justify-between border-zinc-700 text-white hover:bg-zinc-800" size="lg">
              <span className="flex items-center gap-2 font-['Inter']">
                <Calendar className="h-5 w-5" />
                View Appointments
              </span>
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button onClick={() => setActiveTab('reviews')} variant="outline" className="w-full justify-between border-zinc-700 text-white hover:bg-zinc-800" size="lg">
              <span className="flex items-center gap-2 font-['Inter']">
                <Star className="h-5 w-5" />
                Manage Reviews
              </span>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-['Outfit'] text-white">
              <Activity className="h-5 w-5 text-emerald-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px]">
              {appointments.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="font-['Inter']">No appointments yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.slice(0, 5).map((apt) => (
                    <div key={apt._id} className="flex items-start space-x-4 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 transition-colors">
                      <div className="bg-blue-500/20 p-2 rounded-full">
                        <Calendar className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-['Inter'] font-medium text-white">New Appointment</p>
                        <p className="text-xs text-zinc-400">
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
      <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-['Outfit'] text-white">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Top Performing Technicians
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {technicians.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                <Wrench className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="font-['Inter']">No technicians registered yet</p>
              </div>
            ) : (
              technicians.slice(0, 5).map((tech, index) => (
                <div key={tech._id} className="flex items-center gap-4 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black font-['Outfit'] font-bold">
                    #{index + 1}
                  </div>
                  <Avatar className="h-10 w-10 border-2 border-zinc-600">
                    <AvatarImage src={tech.profileImage} />
                    <AvatarFallback className="bg-zinc-700 text-white font-['Outfit']">{tech.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-['Outfit'] font-medium text-white">{tech.name}</p>
                    <p className="text-xs text-zinc-400 font-['Inter']">
                      {tech.specialization?.join(', ') || 'General Services'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-['Inter'] font-semibold text-white">{tech.rating || 0}</span>
                    </div>
                    <p className="text-xs text-zinc-400">{tech.reviewCount || 0} reviews</p>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-['Outfit'] font-bold tracking-tight text-white">Manage Users</h2>
          <p className="text-zinc-400 font-['Inter']">{users.length} total users</p>
        </div>
        <Button onClick={() => handleOpenModal('user')} className="bg-white text-black hover:bg-gray-100">
          <Plus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
        <CardContent className="p-0">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-zinc-500 opacity-50" />
              <p className="text-zinc-400 font-['Inter']">No users found</p>
              <Button onClick={() => handleOpenModal('user')} variant="link" className="mt-2 text-white">
                Add your first user
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                  <TableHead className="text-zinc-400 font-['Inter']">Name</TableHead>
                  <TableHead className="text-zinc-400 font-['Inter']">Email</TableHead>
                  <TableHead className="text-zinc-400 font-['Inter']">Phone</TableHead>
                  <TableHead className="text-zinc-400 font-['Inter']">Role</TableHead>
                  <TableHead className="text-zinc-400 font-['Inter']">Joined</TableHead>
                  <TableHead className="text-right text-zinc-400 font-['Inter']">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} className="border-zinc-800 hover:bg-zinc-800/50">
                    <TableCell className="font-['Inter'] font-medium text-white">
                      <div className="flex items-center gap-3">
                        <Avatar className="border-2 border-zinc-600">
                          <AvatarImage src={user.profileImage} />
                          <AvatarFallback className="bg-zinc-700 text-white">{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-300">{user.email}</TableCell>
                    <TableCell className="text-zinc-300">{user.phone || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-zinc-600 text-zinc-300">{user.role}</Badge>
                    </TableCell>
                    <TableCell className="text-zinc-300">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal('user', user)} className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-400 hover:bg-zinc-800"
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

  const renderTechnicians = () => {
    const filteredTechnicians = technicians.filter(tech => {
      if (techFilter === 'verified') return tech.verified;
      if (techFilter === 'unverified') return !tech.verified;
      return true;
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-['Outfit'] font-bold tracking-tight text-white">Manage Technicians</h2>
            <p className="text-zinc-400 font-['Inter']">{technicians.length} registered technicians</p>
          </div>
          <div className="flex gap-2">
            <div className="flex bg-zinc-800 p-1 rounded-lg border border-zinc-700">
              <Button
                variant={techFilter === 'all' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTechFilter('all')}
                className={techFilter === 'all' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}
              >
                All
              </Button>
              <Button
                variant={techFilter === 'verified' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTechFilter('verified')}
                className={techFilter === 'verified' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}
              >
                Verified
              </Button>
              <Button
                variant={techFilter === 'unverified' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTechFilter('unverified')}
                className={techFilter === 'unverified' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}
              >
                Unverified
              </Button>
            </div>
            <Button onClick={() => handleOpenModal('technician')} className="bg-white text-black hover:bg-gray-100">
              <Plus className="mr-2 h-4 w-4" />
              Add Technician
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTechnicians.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Wrench className="h-16 w-16 mx-auto mb-4 text-zinc-500 opacity-50" />
              <p className="text-zinc-400 font-['Inter']">No technicians found</p>
            </div>
          ) : (
            filteredTechnicians.map((tech) => (
              <Card key={tech._id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-600 transition-all shadow-xl">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-zinc-600">
                        <AvatarImage src={tech.profileImage} />
                        <AvatarFallback className="bg-zinc-700 text-white font-['Outfit'] font-bold">{tech.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg font-['Outfit'] text-white">{tech.name}</CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm text-zinc-400">{tech.rating || 0} ({tech.reviewCount || 0})</span>
                        </div>
                      </div>
                    </div>
                    {tech.verified ? (
                      <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-zinc-600 text-zinc-400">Pending</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Mail className="h-4 w-4" />
                    <span className="font-['Inter'] truncate">{tech.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Phone className="h-4 w-4" />
                    <span className="font-['Inter']">{tech.phone || 'No phone'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <MapPin className="h-4 w-4" />
                    <span className="font-['Inter'] truncate">{tech.location?.address || 'No location'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tech.specialization?.slice(0, 3).map((spec, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-zinc-700 text-zinc-300">{spec}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-zinc-700 text-white hover:bg-zinc-800"
                    onClick={() => handleToggleVerification(tech._id, tech.verified)}
                  >
                    {tech.verified ? 'Revoke' : 'Verify'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-400 hover:bg-zinc-800"
                    onClick={() => handleDeleteTechnician(tech._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-['Outfit'] font-bold tracking-tight text-white">Appointments</h2>
          <p className="text-zinc-400 font-['Inter']">{appointments.length} total appointments</p>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
        <CardContent className="p-0">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-zinc-500 opacity-50" />
              <p className="text-zinc-400 font-['Inter']">No appointments found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800">
                  <TableHead className="text-zinc-400 font-['Inter']">Customer</TableHead>
                  <TableHead className="text-zinc-400 font-['Inter']">Technician</TableHead>
                  <TableHead className="text-zinc-400 font-['Inter']">Date</TableHead>
                  <TableHead className="text-zinc-400 font-['Inter']">Status</TableHead>
                  <TableHead className="text-right text-zinc-400 font-['Inter']">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((apt) => (
                  <TableRow key={apt._id} className="border-zinc-800 hover:bg-zinc-800/50">
                    <TableCell className="font-['Inter'] text-white">{apt.customerName || '-'}</TableCell>
                    <TableCell className="font-['Inter'] text-zinc-300">{apt.technicianName || 'Pending'}</TableCell>
                    <TableCell className="text-zinc-300">{new Date(apt.scheduledDate || apt.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Select
                        value={apt.status}
                        onValueChange={(value) => handleUpdateAppointmentStatus(apt._id, value)}
                      >
                        <SelectTrigger className="w-32 h-8 bg-zinc-800 border-zinc-700 text-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                          <SelectItem value="pending" className="text-white">Pending</SelectItem>
                          <SelectItem value="confirmed" className="text-white">Confirmed</SelectItem>
                          <SelectItem value="in_progress" className="text-white">In Progress</SelectItem>
                          <SelectItem value="completed" className="text-white">Completed</SelectItem>
                          <SelectItem value="cancelled" className="text-white">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right font-['Outfit'] font-semibold text-white">
                      <CurrencyDisplay amount={apt.price || 0} decimals={0} />
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-['Outfit'] font-bold tracking-tight text-white">Reviews</h2>
          <p className="text-zinc-400 font-['Inter']">{reviews.length} total reviews</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Star className="h-16 w-16 mx-auto mb-4 text-zinc-500 opacity-50" />
            <p className="text-zinc-400 font-['Inter']">No reviews found</p>
          </div>
        ) : (
          reviews.map((review) => (
            <Card key={review._id} className="bg-zinc-900 border-zinc-800 shadow-xl">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="border-2 border-zinc-600">
                      <AvatarFallback className="bg-zinc-700 text-white">{review.customerName?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm font-['Outfit'] text-white">{review.customerName || 'Customer'}</CardTitle>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-600'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <Badge variant={review.status === 'approved' ? 'default' : 'secondary'}>
                    {review.status || 'pending'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-300 font-['Inter'] line-clamp-3">{review.comment || 'No comment'}</p>
                <p className="text-xs text-zinc-500 mt-2">
                  For: {review.technicianName || 'Unknown'} • {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="pt-0 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-zinc-700 text-emerald-400 hover:bg-zinc-800"
                  onClick={() => handleUpdateReviewStatus(review._id, 'approved')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-zinc-700 text-red-400 hover:bg-zinc-800"
                  onClick={() => handleUpdateReviewStatus(review._id, 'rejected')}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-['Outfit'] font-bold tracking-tight text-white">Settings</h2>
        <p className="text-zinc-400 font-['Inter']">Manage your admin preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardHeader>
            <CardTitle className="font-['Outfit'] text-white">Notification Settings</CardTitle>
            <CardDescription className="text-zinc-400">Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Inter'] font-medium text-white">Email Notifications</p>
                <p className="text-sm text-zinc-400">Receive updates via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Inter'] font-medium text-white">New User Alerts</p>
                <p className="text-sm text-zinc-400">Get notified of new registrations</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Inter'] font-medium text-white">Review Alerts</p>
                <p className="text-sm text-zinc-400">Notify on new reviews</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardHeader>
            <CardTitle className="font-['Outfit'] text-white">Account Information</CardTitle>
            <CardDescription className="text-zinc-400">Your admin account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-zinc-600">
                <AvatarImage src={user?.profileImage} />
                <AvatarFallback className="bg-zinc-700 text-white font-['Outfit'] font-bold text-xl">{user?.name?.substring(0, 2).toUpperCase() || 'AD'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-['Outfit'] font-semibold text-xl text-white">{user?.name || 'Admin'}</p>
                <p className="text-zinc-400 font-['Inter']">{user?.email || 'admin@techcare.com'}</p>
                <Badge className="mt-1 bg-purple-500/20 text-purple-400 border-purple-500/50">Administrator</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full border-zinc-700 text-white hover:bg-zinc-800" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderServiceApprovals = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-['Outfit'] font-bold tracking-tight text-white">Service Approvals</h2>
        <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/50">
          {pendingGigs.length} Pending
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingGigs.length === 0 ? (
          <div className="col-span-full text-center py-24 bg-zinc-900/50 rounded-3xl border border-zinc-800">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
            <p className="text-zinc-400">No services awaiting approval</p>
          </div>
        ) : (
          pendingGigs.map((gig) => (
            <Card key={gig.id} className="bg-zinc-900 border-zinc-800 overflow-hidden group">
              <div className="aspect-video relative overflow-hidden bg-zinc-800">
                {gig.image ? (
                  <img src={gig.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-600">
                    <Sparkles className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black/60 backdrop-blur-md text-white border-white/20">
                    <CurrencyDisplay amount={gig.price} />
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-['Outfit'] text-white">{gig.title}</CardTitle>
                    <p className="text-sm text-zinc-400 flex items-center gap-1 mt-1">
                      by <span className="text-white font-medium">{gig.technician?.name}</span>
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-zinc-400 line-clamp-3 mb-4">{gig.description}</p>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {gig.duration} hrs</span>
                  <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> {gig.category || 'Service'}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0 gap-2">
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => handleApproveGig(gig.id, 'approved')}
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-zinc-700 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                  onClick={() => {
                    const feedback = prompt('Enter rejection reason:');
                    if (feedback) handleApproveGig(gig.id, 'rejected', feedback);
                  }}
                >
                  Reject
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
      case 'technicians':
        return renderTechnicians();
      case 'appointments':
        return renderAppointments();
      case 'approvals':
        return renderServiceApprovals();
      case 'reviews':
        return renderReviews();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-['Inter']">
      <SEO
        title="Admin Dashboard - TechCare"
        description="Manage users, technicians, appointments, and reviews on TechCare."
      />

      {/* Background Effects */}
      <div className="fixed inset-0 bg-black pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Badge className="mb-2 bg-purple-500/20 text-purple-400 border-purple-500/50">
                <Shield className="w-3 h-3 mr-1" />
                Administrator
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-['Outfit'] font-bold text-white">
                Admin Dashboard
              </h1>
              <p className="text-zinc-400 mt-1 font-['Inter']">
                Manage your TechCare platform
              </p>
            </div>
            <Button
              onClick={refreshAllData}
              disabled={isRefreshing}
              className="bg-white text-black hover:bg-gray-100 font-semibold py-6 px-8 rounded-full shadow-lg transition-all duration-300"
            >
              <RefreshCw className={`mr-2 h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-7 gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl h-auto">
            <TabsTrigger value="dashboard" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="technicians" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">
              <Wrench className="h-4 w-4 mr-2" />
              Technicians
            </TabsTrigger>
            <TabsTrigger value="approvals" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Approvals
            </TabsTrigger>
            <TabsTrigger value="services" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">
              <Zap className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="financials" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">
              <DollarSign className="h-4 w-4 mr-2" />
              Financials
            </TabsTrigger>
            <TabsTrigger value="appointments" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">
              <Calendar className="h-4 w-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="reviews" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">
              <Star className="h-4 w-4 mr-2" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="settings" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">{renderDashboard()}</TabsContent>
          <TabsContent value="users">{renderUsers()}</TabsContent>
          <TabsContent value="technicians">{renderTechnicians()}</TabsContent>
          <TabsContent value="appointments">{renderAppointments()}</TabsContent>
          <TabsContent value="services"><ServiceManagement /></TabsContent>
          <TabsContent value="financials"><TransactionHistory /></TabsContent>
          <TabsContent value="reviews">{renderReviews()}</TabsContent>
          <TabsContent value="settings">{renderSettings()}</TabsContent>
        </Tabs>
      </div>

      {/* Modal for Adding/Editing Users */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="font-['Outfit']">
              {editingItem ? `Edit ${modalType}` : `Add New ${modalType}`}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {editingItem ? 'Update the details below' : 'Fill in the details to create a new user'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>
            {!editingItem && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password || ''}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-zinc-300">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-zinc-300">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="user" className="text-white">Customer</SelectItem>
                  <SelectItem value="technician" className="text-white">Technician</SelectItem>
                  <SelectItem value="admin" className="text-white">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal} className="border-zinc-700 text-white hover:bg-zinc-800">
                Cancel
              </Button>
              <Button type="submit" className="bg-white text-black hover:bg-gray-100">
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
