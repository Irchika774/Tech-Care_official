import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { Skeleton } from '../components/ui/skeleton';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import {
  Calendar,
  Clock,
  Star,
  CreditCard,
  User,
  Smartphone,
  Wrench,
  Droplets,
  Battery,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  History as HistoryIcon,
  Heart,
  Loader2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Plus,
  Trash2,
  LayoutDashboard,
  Settings,
  MessageSquare,
  Package,
  ShieldCheck,
  Laptop,
  Shield,
  Bell,
  LogOut,
  Edit3,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import CurrencyDisplay from '../components/CurrencyDisplay';
import EmptyState from '../components/EmptyState';
import { QuickBookingForm } from '../components/QuickBookingForm';
import LoyaltyPoints from '../components/LoyaltyPoints';
import { format, formatDistanceToNow } from 'date-fns';
import realtimeService from '../utils/realtimeService';

import { useToast } from '../hooks/use-toast';

function CustomerDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, session, logout } = useAuth(); // Get session directly from context
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [devices, setDevices] = useState([]);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [isEditDeviceModalOpen, setIsEditDeviceModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [initialBookingData, setInitialBookingData] = useState(null);
  const [newDevice, setNewDevice] = useState({ brand: '', model: '', type: 'smartphone', serial_number: '' });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleQuickRepair = (device) => {
    setInitialBookingData({
      brand: device.brand,
      model: device.model,
      type: device.type
    });
    setActiveTab('schedule');
  };

  const handleAddDevice = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('user_devices').insert([{
        ...newDevice,
        user_id: user.id
      }]);
      if (error) throw error;
      setIsAddDeviceModalOpen(false);
      setNewDevice({ brand: '', model: '', type: 'smartphone', serial_number: '' });
      fetchData();
      toast({ title: "Device Added", description: "New device registered successfully." });
    } catch (err) {
      console.error('Error adding device:', err);
    }
  };

  const handleEditDevice = (device) => {
    setEditingDevice(device);
    setIsEditDeviceModalOpen(true);
  };

  const handleUpdateDevice = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('user_devices')
        .update({
          brand: editingDevice.brand,
          model: editingDevice.model,
          type: editingDevice.type,
          serial_number: editingDevice.serial_number
        })
        .eq('id', editingDevice.id);

      if (error) throw error;
      setIsEditDeviceModalOpen(false);
      setEditingDevice(null);
      fetchData();
      toast({ title: "Device Updated", description: "Device details saved successfully." });
    } catch (err) {
      console.error('Error updating device:', err);
      toast({ variant: "destructive", title: "Update Failed", description: err.message });
    }
  };

  const fetchData = async (isBackground = false) => {
    try {
      if (!isBackground && !data) setLoading(true); // Only show full screen loader if no data yet

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // If no session, we can't fetch. User might be logged out.
        return;
      }

      // 1. Fetch Customer Profile
      const { data: customerRecord, error: profileError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching customer profile:', profileError);
      }

      const customerId = customerRecord?.id;

      // 2. Fetch Bookings (Direct from Supabase)
      let bookings = [];
      if (customerId) {
        const { data, error: bookingError } = await supabase
          .from('bookings')
          .select(`
            *,
            technician:technicians(id, name, email, phone, rating)
          `)
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false });

        if (bookingError) throw bookingError;

        // Format bookings to match UI expectations (flattened device/issue info)
        bookings = (data || []).map(b => ({
          ...b,
          device: {
            brand: b.device_brand,
            model: b.device_model,
            type: b.device_type
          },
          issue: {
            description: b.issue_description,
            type: b.issue_type
          }
        }));
      }

      // 3. Calculate Stats Locally
      const active = bookings.filter(b => ['pending', 'confirmed', 'scheduled', 'in_progress'].includes(b.status));
      const completed = bookings.filter(b => b.status === 'completed');
      const totalSpent = completed.reduce((sum, b) => sum + (Number(b.price || b.estimated_cost) || 0), 0);

      // 4. Update Main State
      setData({
        customer: {
          name: customerRecord?.name || user.user_metadata?.name || user.email,
          email: customerRecord?.email || user.email,
          profileImage: customerRecord?.profile_image || user.user_metadata?.avatar_url,
          phone: customerRecord?.phone
        },
        stats: {
          activeBookings: active.length,
          completedBookings: completed.length,
          totalSpent: totalSpent
        },
        activeBookings: active,
        recentBookings: bookings.slice(0, 5) // Last 5 bookings
      });

      // 5. Fetch Favorites
      if (customerId) {
        const { data: favoritesData } = await supabase
          .from('favorites')
          .select('*, technician:technicians(*)')
          .eq('customer_id', customerId);

        setFavorites((favoritesData || []).map(f => ({
          _id: f.technician?.id,
          ...f.technician,
          rating: f.technician?.rating || 0,
          reviewCount: f.technician?.review_count || 0,
          profileImage: f.technician?.profile_image
        })));
      }

      // 6. Fetch User Devices
      const { data: devicesData, error: devicesError } = await supabase
        .from('user_devices')
        .select('*')
        .eq('user_id', user.id);

      if (devicesError) {
        console.error('Error fetching devices:', devicesError);
      } else {
        setDevices(devicesData || []);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(null); // Prevents blocking the whole UI
      toast({
        variant: "destructive",
        title: "Partial Sync Error",
        description: "Some information could not be loaded directly."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    let unsubBookings;
    let unsubTechnicians;
    let unsubNotifications;
    let unsubBids;

    if (user?.id) {
      fetchData(); // Fetch immediately when user ID is available

      // Subscribe using centralized service
      unsubBookings = realtimeService.subscribeToBookings(() => {
        console.log('[CustomerDashboard] Booking update');
        fetchData(true);
      }, user.id);

      unsubTechnicians = realtimeService.subscribeToTechnicians(() => {
        console.log('[CustomerDashboard] Technician update');
        fetchData(true);
      });

      unsubNotifications = realtimeService.subscribeToNotifications(user.id, () => {
        console.log('[CustomerDashboard] Notification update');
        fetchData(true);
      });

      unsubBids = realtimeService.subscribeToBids(() => {
        console.log('[CustomerDashboard] Bid update');
        fetchData(true);
      });

      // Fallback polling every 30 seconds
      interval = setInterval(() => fetchData(true), 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (unsubBookings) unsubBookings();
      if (unsubTechnicians) unsubTechnicians();
      if (unsubNotifications) unsubNotifications();
      if (unsubBids) unsubBids();
    };
  }, [user?.id]); // Only re-run if user ID changes (e.g. login/logout)

  const handleDeleteDevice = async (deviceId) => {
    try {
      const { error } = await supabase.from('user_devices').delete().eq('id', deviceId);
      if (error) throw error;
      setDevices(devices.filter(d => d.id !== deviceId));
    } catch (err) {
      console.error('Error deleting device:', err);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please ensure both passwords are the same."
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) throw error;
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully."
      });
      e.target.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone. All your history and data will be permanently removed.")) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();

      // Call backend API to delete user data and auth user
      const response = await fetch(`${API_URL}/api/users/me`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
      });
    } catch (error) {
      console.error("Delete account error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete account. Please contact support.",
      });
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (!response.ok) throw new Error('Failed to cancel booking');

      toast({
        title: "Booking Cancelled",
        description: "Your appointment has been cancelled successfully.",
      });
      fetchData(); // Refresh the list
    } catch (err) {
      console.error("Cancel booking error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
      });
    }
  };

  const DashboardSkeleton = () => (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-32 w-full bg-zinc-900 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96 w-full bg-zinc-900 rounded-xl" />
        <Skeleton className="h-96 w-full bg-zinc-900 rounded-xl" />
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-4">
        <AlertCircle className="h-16 w-16 text-red-500 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Sync Error</h2>
        <p className="text-zinc-400 mb-6 max-w-md">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-white text-black">Retry Connection</Button>
      </div>
    );
  }

  const { customer, stats, activeBookings, recentBookings } = data || { customer: {}, stats: {}, activeBookings: [], recentBookings: [] };

  return (
    <div className="min-h-screen bg-black text-white font-['Inter'] pb-20">
      <SEO title="User Dashboard - TechCare" description="Manage your repairs and devices" />

      {/* Hero Header */}
      <div className="relative border-b border-zinc-800 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
            {/* User Profile Info */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-zinc-800 ring-2 ring-zinc-700 shadow-2xl">
                  <AvatarImage src={customer?.profileImage} />
                  <AvatarFallback className="bg-zinc-800 text-3xl font-bold">
                    {customer?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 md:w-6 md:h-6 rounded-full border-4 border-black" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-['Outfit'] mb-1">
                  Hello, {customer?.name?.split(' ')[0]}
                </h1>
                <p className="text-zinc-400 flex items-center gap-2 text-sm md:text-base">
                  <User className="w-4 h-4" /> {customer?.email}
                </p>
                {/* Mobile Loyalty Badge (visible only on small screens) */}
                <div className="mt-3 md:hidden">
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/50">
                    Rewards Member
                  </Badge>
                </div>
              </div>
            </div>

            {/* Loyalty Status Card (Desktop) */}
            <div className="hidden md:flex flex-1 justify-center max-w-sm mx-auto xl:mx-0">
              <div className="w-full transform transition-all hover:scale-105 duration-300">
                <LoyaltyPoints userId={user.id} compact={true} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap md:flex-nowrap gap-3 items-center justify-start xl:justify-end">
              <Button
                onClick={() => setActiveTab('schedule')}
                className="bg-white text-black hover:bg-gray-100 font-bold px-6 md:px-8 rounded-full h-12 shadow-lg hover:scale-105 transition-all text-sm md:text-base whitespace-nowrap"
              >
                Book Now
                <Plus className="ml-2 w-4 h-4 md:w-5 md:h-5" />
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/chat')}
                  className="border-zinc-800 text-white hover:bg-zinc-900 rounded-full h-12 px-6"
                >
                  <MessageSquare className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Messages
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/support')}
                  className="border-zinc-800 text-white hover:bg-zinc-900 rounded-full h-12 px-6"
                >
                  Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? <DashboardSkeleton /> : (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Active Repairs', val: stats.activeBookings, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { label: 'Completed', val: stats.completedBookings, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { label: 'Total Spent', val: <CurrencyDisplay amount={stats.totalSpent} />, icon: CreditCard, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                { label: 'My Devices', val: devices.length, icon: Smartphone, color: 'text-amber-500', bg: 'bg-amber-500/10' }
              ].map((stat, i) => (
                <Card key={i} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all cursor-default">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-zinc-400 text-sm font-medium">{stat.label}</p>
                      <div className={`${stat.bg} p-2 rounded-lg`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold font-['Outfit']">{stat.val}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-zinc-900 border-zinc-800 p-1 rounded-xl h-14">
                <TabsTrigger value="overview" className="rounded-lg h-full px-6 data-[state=active]:bg-white data-[state=active]:text-black">
                  <LayoutDashboard className="w-4 h-4 mr-2" /> Overview
                </TabsTrigger>
                <TabsTrigger value="schedule" className="rounded-lg h-full px-6 data-[state=active]:bg-white data-[state=active]:text-black">
                  <Calendar className="w-4 h-4 mr-2" /> Schedule
                </TabsTrigger>
                <TabsTrigger value="history" className="rounded-lg h-full px-6 data-[state=active]:bg-white data-[state=active]:text-black">
                  <HistoryIcon className="w-4 h-4 mr-2" /> History
                </TabsTrigger>
                <TabsTrigger value="devices" className="rounded-lg h-full px-6 data-[state=active]:bg-white data-[state=active]:text-black">
                  <Smartphone className="w-4 h-4 mr-2" /> My Devices
                </TabsTrigger>
                <TabsTrigger value="favorites" className="rounded-lg h-full px-6 data-[state=active]:bg-white data-[state=active]:text-black">
                  <Heart className="w-4 h-4 mr-2" /> Favorites
                </TabsTrigger>
                <TabsTrigger value="loyalty" className="rounded-lg h-full px-6 data-[state=active]:bg-white data-[state=active]:text-black">
                  <Award className="w-4 h-4 mr-2" /> Loyalty Rewards
                </TabsTrigger>

                <TabsTrigger value="settings" className="rounded-lg h-full px-6 data-[state=active]:bg-white data-[state=active]:text-black">
                  <Settings className="w-4 h-4 mr-2" /> Preferences
                </TabsTrigger>
                <TabsTrigger value="security" className="rounded-lg h-full px-6 data-[state=active]:bg-white data-[state=active]:text-black">
                  <ShieldCheck className="w-4 h-4 mr-2" /> Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    {/* Active Tracking */}
                    <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800 shadow-xl overflow-hidden">
                      <CardHeader className="bg-zinc-800/30">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-xl flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-500" />
                            Live Repair Tracker
                          </CardTitle>
                          <Badge variant="outline" className="text-blue-500 border-blue-500/30">
                            {activeBookings.length} Active
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        {activeBookings.length === 0 ? (
                          <EmptyState
                            icon={Package}
                            title="No Active Repairs"
                            description="You don't have any devices being repaired right now. When you start a repair, you can track its progress here in real-time."
                            buttonText="Start a New Repair"
                            onAction={() => setActiveTab('schedule')}
                          />
                        ) : (
                          <div className="divide-y divide-zinc-800">
                            {activeBookings.map((booking) => (
                              <div key={booking.id} className="p-6 hover:bg-zinc-800/20 transition-all group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                  <div>
                                    <div className="flex items-center gap-3 mb-1">
                                      <h4 className="text-lg font-bold">{booking.device?.brand} {booking.device?.model}</h4>
                                      <Badge className="bg-blue-600/10 text-blue-500 border-0">{booking.status}</Badge>
                                    </div>
                                    <p className="text-sm text-zinc-400 flex items-center gap-2">
                                      <Clock className="w-4 h-4" /> Last update: {formatDistanceToNow(new Date(booking.updated_at || booking.created_at), { addSuffix: true })}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="border-zinc-700 hover:bg-zinc-800 rounded-full" onClick={() => navigate(`/tracker/${booking.id}`)}>
                                      Track Detail
                                    </Button>
                                    <Button size="sm" className="bg-white text-black hover:bg-gray-200 rounded-full" onClick={() => navigate(`/chat/${booking.id}`)}>
                                      <MessageSquare className="w-4 h-4 mr-2" /> Chat
                                    </Button>
                                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-500 hover:bg-red-500/10 hover:text-red-400 rounded-full"
                                        onClick={() => handleCancelBooking(booking.id || booking._id)}
                                      >
                                        Cancel
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-xs text-zinc-500 mb-1 font-medium">
                                    <span>Pickup</span>
                                    <span>Diagnosis</span>
                                    <span>Repairing</span>
                                    <span>Testing</span>
                                    <span>Delivery</span>
                                  </div>
                                  <Progress value={booking.status === 'pending' ? 20 : booking.status === 'confirmed' ? 40 : booking.status === 'in_progress' ? 70 : 100} className="h-2 bg-zinc-800" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Device Vault Preview */}
                    <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800 shadow-xl">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-amber-500" />
                          My Registered Devices
                        </CardTitle>
                        <Button variant="ghost" className="text-zinc-400 hover:text-white" onClick={() => setActiveTab('devices')}>
                          Manage All
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {devices.length === 0 ? (
                          <div className="text-center py-6 border-2 border-dashed border-zinc-800 rounded-xl">
                            <p className="text-zinc-500 mb-4">No devices registered yet</p>
                            <Button size="sm" variant="outline" className="border-zinc-700" onClick={() => setActiveTab('devices')}>
                              Add Your First Device
                            </Button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {devices.slice(0, 2).map(device => (
                              <div key={device.id} className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 flex items-center gap-4">
                                <div className="p-3 bg-zinc-900 rounded-lg">
                                  {device.type === 'smartphone' ? <Smartphone className="w-6 h-6 text-blue-500" /> : <Laptop className="w-6 h-6 text-emerald-500" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-bold truncate">{device.brand} {device.model}</h5>
                                  <p className="text-xs text-zinc-500">{device.serial_number || 'No serial'}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-8">
                    {/* Activity Feed */}
                    <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800 shadow-xl">
                      <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-emerald-500" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {recentBookings.slice(0, 4).map((booking, i) => (
                          <div key={i} className="flex gap-4 group">
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 rounded-full bg-zinc-700 group-first:bg-emerald-500 shadow-lg" />
                              <div className="w-0.5 flex-1 bg-zinc-800 group-last:bg-transparent" />
                            </div>
                            <div className="pb-6">
                              <p className="text-sm font-bold text-zinc-200">Repair Status Update</p>
                              <p className="text-xs text-zinc-500 mb-1">{booking.device?.brand} {booking.device?.model} is now <span className="text-zinc-300 font-medium">{booking.status}</span></p>
                              <span className="text-[10px] text-zinc-600 uppercase tracking-wider">{format(new Date(booking.created_at), 'MMM d, h:mm a')}</span>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Promotion Card */}
                    <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 border-0 overflow-hidden relative group cursor-pointer">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-24 h-24" />
                      </div>
                      <CardContent className="p-6 relative z-10">
                        <h4 className="text-xl font-bold mb-2">Refer a Friend</h4>
                        <p className="text-blue-100 text-sm mb-4">Get LKR 1,000 off your next repair when you refer a colleague.</p>
                        <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50 rounded-full font-bold">
                          Share Code
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="loyalty">
                <div className="max-w-4xl mx-auto">
                  <LoyaltyPoints userId={user.id} />
                </div>
              </TabsContent>

              <TabsContent value="schedule">
                <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800 border-2 shadow-2xl overflow-hidden">
                  <CardHeader className="border-b border-zinc-800 bg-zinc-800/20">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl font-['Outfit'] flex items-center gap-3">
                          <Wrench className="w-6 h-6 text-blue-500" />
                          Schedule a Repair
                        </CardTitle>
                        <CardDescription>Complete your request and we'll handle the rest</CardDescription>
                      </div>
                      {initialBookingData && (
                        <Button variant="ghost" size="sm" onClick={() => setInitialBookingData(null)} className="text-zinc-500 hover:text-white">
                          Clear Pre-fill
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <QuickBookingForm
                      initialData={initialBookingData}
                      onSuccess={() => {
                        setActiveTab('overview');
                        setInitialBookingData(null);
                        fetchData();
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800">
                  <CardHeader>
                    <CardTitle>Repair History</CardTitle>
                    <CardDescription>All your past service requests and invoices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-800">
                            <th className="py-4 font-semibold text-zinc-500">Device</th>
                            <th className="py-4 font-semibold text-zinc-500">Service</th>
                            <th className="py-4 font-semibold text-zinc-500">Date</th>
                            <th className="py-4 font-semibold text-zinc-500">Status</th>
                            <th className="py-4 font-semibold text-zinc-500 text-right">Cost</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                          {recentBookings.map((booking) => (
                            <tr key={booking.id} className="group hover:bg-zinc-800/30 transition-all">
                              <td className="py-4">
                                <div className="font-bold">{booking.device?.brand}</div>
                                <div className="text-xs text-zinc-500">{booking.device?.model}</div>
                              </td>
                              <td className="py-4 text-zinc-300 capitalize">{booking.issue?.type || booking.service_type || 'General'}</td>
                              <td className="py-4 text-zinc-400 text-sm">{format(new Date(booking.created_at), 'dd MMM yyyy')}</td>
                              <td className="py-4"><Badge variant="outline" className="capitalize">{booking.status}</Badge></td>
                              <td className="py-4 text-right">
                                <div className="font-bold mb-1"><CurrencyDisplay amount={booking.estimated_cost} /></div>
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 text-[10px] text-blue-400 hover:text-blue-300 px-2"
                                    onClick={() => {
                                      toast({ title: "Downloading...", description: "Your receipt is being generated." });
                                    }}
                                  >
                                    Receipt
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 text-[10px] text-emerald-400 hover:text-emerald-300 px-2"
                                    onClick={() => handleQuickRepair(booking.device)}
                                  >
                                    Re-book
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}

                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="favorites">
                <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800">
                  <CardHeader>
                    <CardTitle>My Favorite Technicians</CardTitle>
                    <CardDescription>Quick access to experts you trust</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {favorites.length === 0 ? (
                      <div className="text-center py-12 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl">
                        <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>You haven't saved any favorites yet</p>
                        <Button variant="link" onClick={() => navigate('/technicians')} className="text-blue-500 mt-2">
                          Explore Technicians
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {favorites.map((fav) => (
                          <div key={fav.id || fav._id} className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12 border border-zinc-700">
                                <AvatarImage src={fav.profile_image} />
                                <AvatarFallback>{fav.name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h5 className="font-bold text-white">{fav.name}</h5>
                                <div className="flex items-center gap-1 text-xs text-yellow-500">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span>{fav.rating || '5.0'}</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="bg-white text-black hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                              onClick={() => navigate('/schedule', { state: { technician: fav } })}
                            >
                              Book
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="devices">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {devices.map((device) => (
                    <Card key={device.id} className="bg-zinc-900 border-zinc-800 group relative">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-zinc-800 rounded-xl">
                            {device.type === 'smartphone' ? <Smartphone className="w-6 h-6 text-blue-500" /> : <Laptop className="w-6 h-6 text-emerald-500" />}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" onClick={() => handleEditDevice(device)} className="text-zinc-400 hover:text-white">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteDevice(device.id)} className="text-zinc-600 hover:text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <h4 className="text-xl font-bold mb-1">{device.brand}</h4>
                        <p className="text-zinc-400 font-medium mb-4">{device.model}</p>
                        <div className="space-y-2 pt-4 border-t border-zinc-800">
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-500">Serial</span>
                            <span className="text-zinc-300 font-mono">{device.serial_number || '---'}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-500">Purchased</span>
                            <span className="text-zinc-300">{device.purchase_date ? format(new Date(device.purchase_date), 'PPP') : '---'}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="link" className="p-0 text-blue-500 h-auto" onClick={() => handleQuickRepair(device)}>
                          Quick Repair
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  <button
                    onClick={() => setIsAddDeviceModalOpen(true)}
                    className="flex flex-col items-center justify-center p-8 bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-xl hover:bg-zinc-900/50 hover:border-zinc-700 transition-all group h-[280px]"
                  >
                    <Plus className="w-10 h-10 text-zinc-700 group-hover:text-blue-500 transition-colors mb-2" />
                    <span className="font-bold text-zinc-500 group-hover:text-zinc-300">Add New Device</span>
                  </button>
                </div>
              </TabsContent>
              <TabsContent value="settings">
                <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-white">Profile Settings</CardTitle>
                    <CardDescription>Update your personal information and contact details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const updates = {
                          name: formData.get('name'),
                          phone: formData.get('phone'),
                          address: formData.get('address'),
                          bio: formData.get('bio')
                        };

                        try {
                          const { data: { session: currentSession } } = await supabase.auth.getSession();
                          const response = await fetch(`${API_URL}/api/customers/profile`, {
                            method: 'PATCH',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${currentSession?.access_token}`
                            },
                            body: JSON.stringify(updates)
                          });

                          if (response.ok) {
                            fetchData();
                            toast({
                              title: "Profile Updated",
                              description: "Your profile has been updated successfully.",
                            });
                          }
                        } catch (err) {
                          console.error('Update profile error:', err);
                          toast({
                            variant: "destructive",
                            title: "Update Failed",
                            description: "Could not update profile. Please try again.",
                          });
                        }
                      }}
                      className="space-y-6 max-w-lg"
                    >
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Full Name</label>
                        <Input
                          name="name"
                          defaultValue={customer?.name}
                          className="bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Email Address (Read-only)</label>
                        <Input
                          disabled
                          value={customer?.email}
                          className="bg-zinc-800/50 border-zinc-700 text-zinc-500 cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Phone Number</label>
                        <Input
                          name="phone"
                          defaultValue={customer?.phone}
                          className="bg-zinc-800 border-zinc-700 text-white"
                          placeholder="+94 77 123 4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Address</label>
                        <Input
                          name="address"
                          defaultValue={customer?.address}
                          className="bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <Button type="submit" className="bg-white text-black hover:bg-gray-200 font-bold px-8 rounded-full">
                        Save Changes
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-white">Security</CardTitle>
                    <CardDescription>Manage your password and account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4 max-w-lg">
                      <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-zinc-400">New Password</Label>
                          <Input name="password" type="password" placeholder="••••••••" className="bg-zinc-800 border-zinc-700 text-white" required />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-400">Confirm Password</Label>
                          <Input name="confirmPassword" type="password" placeholder="••••••••" className="bg-zinc-800 border-zinc-700 text-white" required />
                        </div>
                        <Button type="submit" className="bg-white text-black hover:bg-gray-100 rounded-full">Update Password</Button>
                      </form>
                    </div>
                    <div className="pt-6 border-t border-zinc-800">
                      <h4 className="text-red-500 font-bold mb-2">Danger Zone</h4>
                      <p className="text-sm text-zinc-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                      <Button
                        variant="destructive"
                        className="rounded-full"
                        onClick={handleDeleteAccount}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Add Device Modal */}
      {isAddDeviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle>Register New Device</CardTitle>
              <CardDescription>Add a device to your vault for faster bookings</CardDescription>
            </CardHeader>
            <form onSubmit={handleAddDevice}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Device Type</label>
                  <Select value={newDevice.type} onValueChange={(v) => setNewDevice({ ...newDevice, type: v })}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="smartphone">Smartphone</SelectItem>
                      <SelectItem value="laptop">Laptop</SelectItem>
                      <SelectItem value="pc">Desktop PC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Brand</label>
                    <input
                      required
                      className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-2"
                      placeholder="Apple"
                      value={newDevice.brand}
                      onChange={(e) => setNewDevice({ ...newDevice, brand: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Model</label>
                    <input
                      required
                      className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-2"
                      placeholder="iPhone 15"
                      value={newDevice.model}
                      onChange={(e) => setNewDevice({ ...newDevice, model: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Serial Number (Optional)</label>
                  <input
                    className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-2"
                    placeholder="SN-123456"
                    value={newDevice.serial_number}
                    onChange={(e) => setNewDevice({ ...newDevice, serial_number: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAddDeviceModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-white text-black hover:bg-gray-100">Add Device</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

      {/* Edit Device Modal */}
      {isEditDeviceModalOpen && editingDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle>Edit Device Details</CardTitle>
              <CardDescription>Update your device information</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateDevice}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Device Type</label>
                  <Select value={editingDevice.type} onValueChange={(v) => setEditingDevice({ ...editingDevice, type: v })}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="smartphone">Smartphone</SelectItem>
                      <SelectItem value="laptop">Laptop</SelectItem>
                      <SelectItem value="pc">Desktop PC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Brand</label>
                    <input
                      required
                      className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-2"
                      value={editingDevice.brand}
                      onChange={(e) => setEditingDevice({ ...editingDevice, brand: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Model</label>
                    <input
                      required
                      className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-2"
                      value={editingDevice.model}
                      onChange={(e) => setEditingDevice({ ...editingDevice, model: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Serial Number (Optional)</label>
                  <input
                    className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-2"
                    value={editingDevice.serial_number || ''}
                    onChange={(e) => setEditingDevice({ ...editingDevice, serial_number: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditDeviceModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-white text-black hover:bg-gray-100 font-bold">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
}

export default CustomerDashboard;
