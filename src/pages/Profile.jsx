import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import CurrencyDisplay from '../components/CurrencyDisplay';
import { ImageUpload } from '../components/ImageUpload';
import {
  User, Mail, Phone, MapPin, Shield, Bell, CreditCard, Settings, Edit3, LogOut,
  Calendar, Star, Truck, Briefcase, Award, DollarSign, TrendingUp, Clock,
  CheckCircle, Users, BarChart3, Wrench, Package, Loader2, AlertCircle
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || '',
    profileImage: user?.avatar || ''
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (user) {
      fetchProfileData();
      // Refresh data every 30 seconds for real-time updates
      const interval = setInterval(fetchProfileData, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const headers = { Authorization: `Bearer ${session?.access_token}` };

      const userRole = user.role === 'user' ? 'customers' : user.role === 'technician' ? 'technicians' : 'admin';

      if (userRole === 'admin') {
        // Admin gets data from admin dashboard
        const adminRes = await fetch(`${API_URL}/api/admin/dashboard`, { headers });
        if (adminRes.ok) {
          const adminData = await adminRes.json();
          setDashboardData(adminData);
          setProfileData({ name: user.name, email: user.email, phone: user.phone });
        }
      } else {
        // Fetch profile and dashboard data
        const [profileRes, dashboardRes] = await Promise.all([
          fetch(`${API_URL}/api/${userRole}/profile`, { headers }),
          fetch(`${API_URL}/api/${userRole}/dashboard`, { headers })
        ]);

        if (profileRes.ok) {
          const profile = await profileRes.json();
          const pData = userRole === 'customers' ? profile.customer : profile.technician;
          setProfileData(pData);
          setProfileForm({
            name: pData.name || '',
            email: pData.email || '',
            phone: pData.phone || '',
            address: pData.address || '',
            bio: pData.bio || '',
            profileImage: pData.profile_image || pData.profileImage || ''
          });
        }

        if (dashboardRes.ok) {
          const dashboard = await dashboardRes.json();
          setDashboardData(dashboard);
        }
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers = {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json'
      };

      const userRole = user.role === 'user' ? 'customers' : 'technicians';

      // Map frontend state to backend expected fields (snake_case)
      const payload = {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        address: profileForm.address,
        bio: profileForm.bio,
        profile_image: profileForm.profileImage // Map profileImage to profile_image
      };

      const response = await fetch(`${API_URL}/api/${userRole}/profile`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await fetchProfileData(); // Refresh data
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: errorData.error || "Failed to update profile. Please try again.",
        });
      }
    } catch (err) {
      console.error('Profile update error:', err);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "An error occurred while updating your profile.",
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-card p-8 rounded-2xl shadow-xl border">
          <h1 className="text-3xl font-bold mb-6 text-center">Account Access</h1>
          <p className="text-muted-foreground mb-8 text-center">Please login to access your account</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/login')}>Login</Button>
            <Button variant="outline" onClick={() => navigate('/register')}>Register</Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchProfileData}>Retry</Button>
      </div>
    );
  }

  const userRole = user.role === 'user' ? 'customer' : user.role;

  // Customer Profile View
  const CustomerProfile = () => {
    if (!dashboardData || !dashboardData.stats) return null;

    const { stats, recentBookings = [] } = dashboardData;

    return (
      <>
        <TabsContent value="overview">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Account Overview</CardTitle>
              <CardDescription className="text-zinc-400">Your recent activity and stats</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-500/30">
                <div className="text-3xl font-bold text-blue-400 mb-2">{stats.completedBookings || 0}</div>
                <div className="text-sm text-zinc-400">Completed Repairs</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl border border-green-500/30">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  <CurrencyDisplay amount={stats.totalSpent || 0} decimals={0} />
                </div>
                <div className="text-sm text-zinc-400">Total Spent</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl border border-purple-500/30">
                <div className="text-3xl font-bold text-purple-400 mb-2">{stats.totalBookings || 0}</div>
                <div className="text-sm text-zinc-400">Total Orders</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl border border-yellow-500/30">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.activeBookings || 0}</div>
                <div className="text-sm text-zinc-400">Active Orders</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Order History</CardTitle>
              <CardDescription className="text-zinc-400">Track all your repair orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500">No orders found</div>
                ) : (
                  recentBookings.map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-6 border border-zinc-700 rounded-xl hover:bg-zinc-800/50 transition bg-zinc-800/30">
                      <div className="space-y-1 flex-1">
                        <div className="font-semibold text-lg text-white">{order.device?.brand} {order.device?.model}</div>
                        <div className="flex items-center gap-4 text-sm text-zinc-400">
                          <span className="flex items-center gap-1"><Wrench className="h-4 w-4" />{order.technician?.name || 'Pending'}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(order.scheduledDate).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1">ID: {order._id.substring(0, 8)}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="font-bold text-xl text-white">
                          <CurrencyDisplay amount={order.estimatedCost || order.actualCost || 0} decimals={0} />
                        </div>
                        <Badge variant={order.status === 'completed' ? 'default' : order.status === 'in_progress' ? 'secondary' : 'destructive'}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </>
    );
  };

  // Technician Profile View
  const TechnicianProfile = () => {
    if (!dashboardData || !dashboardData.stats) return null;

    const { stats, activeJobs = [] } = dashboardData;

    return (
      <>
        <TabsContent value="overview">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Dashboard</CardTitle>
                <CardDescription>Your business metrics at a glance</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-200">
                  <div className="flex justify-between items-start mb-2">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    <CurrencyDisplay amount={stats.totalEarnings || 0} decimals={0} />
                  </div>
                  <div className="text-sm text-muted-foreground">Total Earnings</div>
                  <div className="text-xs text-green-600 mt-1">
                    +<CurrencyDisplay amount={stats.todayEarnings || 0} decimals={0} /> this month
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-200">
                  <div className="flex justify-between items-start mb-2">
                    <Briefcase className="h-8 w-8 text-blue-600" />
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{stats.completedJobs || 0}</div>
                  <div className="text-sm text-muted-foreground">Jobs Completed</div>
                  <div className="text-xs text-blue-600 mt-1">{stats.activeJobs || 0} active jobs</div>
                </div>
                <div className="p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl border border-yellow-200">
                  <div className="flex justify-between items-start mb-2">
                    <Star className="h-8 w-8 text-yellow-600 fill-yellow-600" />
                    <Award className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="text-3xl font-bold text-yellow-600">{stats.rating || 0}</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                  <div className="text-xs text-yellow-600 mt-1">{stats.reviewCount || 0} reviews</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Specializations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(profileData?.expertise || profileData?.specialization || ['Mobile Repair', 'PC Repair', 'Data Recovery']).map((spec) => (
                    <Badge key={spec} variant="secondary" className="px-4 py-2">{spec}</Badge>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span><strong>{profileData?.experience || 10}</strong> years of experience</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Job Management</CardTitle>
              <CardDescription>All your repair jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeJobs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No active jobs</div>
                ) : (
                  activeJobs.map((job) => (
                    <div key={job._id} className="flex items-center justify-between p-6 border rounded-xl hover:bg-muted/50 transition">
                      <div className="space-y-1 flex-1">
                        <div className="font-semibold text-lg">{job.device?.brand} {job.device?.model}</div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><User className="h-4 w-4" />{job.customer?.name || 'Unknown'}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location || 'N/A'}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(job.scheduledDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="font-bold text-xl">
                          <CurrencyDisplay amount={job.estimatedCost || job.actualCost || 0} decimals={0} />
                        </div>
                        <Badge variant={job.status === 'completed' ? 'default' : job.status === 'in_progress' ? 'secondary' : 'outline'}>
                          {job.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </>
    );
  };

  // Admin Profile View
  const AdminProfile = () => {
    if (!dashboardData) return null;

    const stats = dashboardData.stats || dashboardData; // Handle different response structures

    return (
      <>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>Platform-wide statistics and metrics</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-200">
                <Users className="h-8 w-8 text-purple-600 mb-2" />
                <div className="text-3xl font-bold text-purple-600">{stats.totalUsers || stats.totalCustomers || 0}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
              <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-200">
                <Wrench className="h-8 w-8 text-blue-600 mb-2" />
                <div className="text-3xl font-bold text-blue-600">{stats.totalTechnicians || 0}</div>
                <div className="text-sm text-muted-foreground">Active Technicians</div>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-200">
                <DollarSign className="h-8 w-8 text-green-600 mb-2" />
                <div className="text-3xl font-bold text-green-600">
                  <CurrencyDisplay amount={stats.totalRevenue || stats.revenue || 0} decimals={0} />
                </div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </div>
              <div className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl border border-orange-200">
                <Briefcase className="h-8 w-8 text-orange-600 mb-2" />
                <div className="text-3xl font-bold text-orange-600">{stats.activeBookings || stats.activeJobs || 0}</div>
                <div className="text-sm text-muted-foreground">Active Jobs</div>
              </div>
              <div className="p-6 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl border border-red-200">
                <Clock className="h-8 w-8 text-red-600 mb-2" />
                <div className="text-3xl font-bold text-red-600">{stats.pendingApprovals || stats.pendingBookings || 0}</div>
                <div className="text-sm text-muted-foreground">Pending Approvals</div>
              </div>
              <div className="p-6 bg-gradient-to-br from-teal-500/10 to-teal-600/10 rounded-xl border border-teal-200">
                <TrendingUp className="h-8 w-8 text-teal-600 mb-2" />
                <div className="text-3xl font-bold text-teal-600">{stats.completedBookings || stats.completionRate || 94}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>System Management</CardTitle>
              <CardDescription>Quick access to admin functions</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-24 flex-col" onClick={() => navigate('/admin')}>
                <Users className="h-8 w-8 mb-2" />
                <span>Manage Users</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col">
                <Wrench className="h-8 w-8 mb-2" />
                <span>Manage Technicians</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col">
                <Package className="h-8 w-8 mb-2" />
                <span>Job Overview</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col">
                <BarChart3 className="h-8 w-8 mb-2" />
                <span>Analytics</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 ring-4 ring-zinc-700 border-4 border-zinc-800">
                <AvatarImage src={profileData?.profileImage || user.avatar} />
                <AvatarFallback className="text-2xl bg-zinc-800 text-white">{(profileData?.name || user.name)?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold">{profileData?.name || user.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="capitalize bg-zinc-800 text-zinc-200 border-zinc-700">{userRole}</Badge>
                  {userRole === 'technician' && dashboardData?.stats && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{dashboardData.stats.rating || 0}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="border-zinc-700 text-white hover:bg-zinc-800">
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="flex justify-center mb-6">
                      <div className="w-32 h-32 relative">
                        <Avatar className="w-32 h-32">
                          <AvatarImage src={profileForm.profileImage} />
                          <AvatarFallback>{profileForm.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0">
                          <ImageUpload
                            bucket="avatars"
                            folder={user.id}
                            onUploadComplete={(url) => setProfileForm({ ...profileForm, profileImage: url })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-zinc-300">Full Name</Label>
                      <Input id="name" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-zinc-300">Email</Label>
                      <Input id="email" type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-zinc-300">Phone</Label>
                      <Input id="phone" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-zinc-300">Address</Label>
                      <Input id="address" value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-zinc-300">Bio</Label>
                      <Textarea id="bio" value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} rows={3} className="bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500" />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1 bg-white text-black hover:bg-gray-100">Save Changes</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="destructive" onClick={handleLogout} size="lg">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-zinc-900 border border-zinc-800 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-black text-zinc-400"><User className="mr-2 h-4 w-4" />Overview</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:text-black text-zinc-400"><Truck className="mr-2 h-4 w-4" />{userRole === 'admin' ? 'Manage' : userRole === 'technician' ? 'Jobs' : 'Orders'}</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-black text-zinc-400"><Settings className="mr-2 h-4 w-4" />Settings</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:text-black text-zinc-400"><Shield className="mr-2 h-4 w-4" />Security</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:text-black text-zinc-400"><Bell className="mr-2 h-4 w-4" />Notifications</TabsTrigger>
          </TabsList>

          {/* Role-specific content */}
          {userRole === 'customer' && <CustomerProfile />}
          {userRole === 'technician' && <TechnicianProfile />}
          {userRole === 'admin' && <AdminProfile />}

          {/* Common Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-white">
                    <Settings className="h-5 w-5 text-zinc-400" />
                    Preferences
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-zinc-300">Theme</Label>
                      <Select defaultValue="system">
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white"><SelectValue placeholder="Theme" /></SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700">
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-zinc-300">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white"><SelectValue placeholder="Language" /></SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700">
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-white">
                    <CreditCard className="h-5 w-5 text-zinc-400" />
                    Payment Methods
                  </h3>
                  <div className="flex items-center justify-between p-4 border border-zinc-700 rounded-lg bg-zinc-800/50">
                    <span className="text-zinc-300">**** **** **** 1234</span>
                    <Button variant="outline" size="sm" className="border-zinc-600 text-white hover:bg-zinc-700">Edit</Button>
                  </div>
                  <Button variant="outline" className="w-full border-zinc-700 text-white hover:bg-zinc-800">Add Payment Method</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Common Security Tab */}
          <TabsContent value="security">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Security & Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-white">
                    <Shield className="h-5 w-5 text-zinc-400" />
                    Change Password
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input placeholder="Current Password" type="password" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
                    <Input placeholder="New Password" type="password" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
                    <Input placeholder="Confirm New Password" type="password" className="md:col-span-2 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
                    <Button className="md:col-span-2 bg-white text-black hover:bg-gray-100">Update Password</Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-white">Active Sessions</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                      <span className="text-zinc-300">Chrome on Windows • Today</span>
                      <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-zinc-700">Log out</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Common Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-white cursor-pointer">
                      <input type="checkbox" checked={notifications.email} onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })} className="w-5 h-5 rounded bg-zinc-800 border-zinc-600 text-green-500 focus:ring-green-500" />
                      Email notifications
                    </Label>
                    <p className="text-sm text-zinc-500 ml-7">Order updates, promotions, new messages</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-white cursor-pointer">
                      <input type="checkbox" checked={notifications.sms} onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })} className="w-5 h-5 rounded bg-zinc-800 border-zinc-600 text-green-500 focus:ring-green-500" />
                      SMS notifications
                    </Label>
                    <p className="text-sm text-zinc-500 ml-7">Urgent order updates only</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-white cursor-pointer">
                      <input type="checkbox" checked={notifications.push} onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })} className="w-5 h-5 rounded bg-zinc-800 border-zinc-600 text-green-500 focus:ring-green-500" />
                      Push notifications
                    </Label>
                    <p className="text-sm text-zinc-500 ml-7">App notifications for real-time updates</p>
                  </div>
                </div>
                <Button className="w-full bg-white text-black hover:bg-gray-100">Save Notification Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
