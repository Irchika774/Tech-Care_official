import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../context/AuthContext';
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
import {
  User, Mail, Phone, MapPin, Shield, Bell, CreditCard, Settings, Edit3, LogOut,
  Calendar, Star, Truck, Briefcase, Award, DollarSign, TrendingUp, Clock,
  CheckCircle, XCircle, Users, FileText, BarChart3, Wrench, Package
} from 'lucide-react';

// Mock data for customer
const mockCustomerOrders = [
  { id: '#12345', date: '2025-11-20', service: 'iPhone Screen Repair', technician: 'Mobile Wizards', status: 'completed', total: '$180', rating: 5 },
  { id: '#12346', date: '2025-11-18', service: 'PC Motherboard Repair', technician: 'PC Masters', status: 'in-progress', total: '$350', rating: null },
  { id: '#12347', date: '2025-11-15', service: 'Battery Replacement', technician: 'Fone Fixers', status: 'cancelled', total: '$80', rating: null }
];

// Mock data for technician
const mockTechnicianJobs = [
  { id: '#T-101', date: '2025-11-22', service: 'Laptop Repair', customer: 'Sarah Johnson', status: 'pending', amount: '$250', location: 'Downtown' },
  { id: '#T-102', date: '2025-11-21', service: 'Phone Screen Replacement', customer: 'Mike Davis', status: 'in-progress', amount: '$150', location: 'Uptown' },
  { id: '#T-103', date: '2025-11-20', service: 'Data Recovery', customer: 'Emma Wilson', status: 'completed', amount: '$400', location: 'Midtown' }
];

const mockTechnicianStats = {
  totalJobs: 127,
  completedJobs: 115,
  activeJobs: 8,
  rating: 4.9,
  earnings: 15750,
  monthlyRevenue: 2840
};

// Mock data for admin
const mockAdminStats = {
  totalUsers: 1247,
  totalTechnicians: 89,
  activeJobs: 156,
  revenue: 125430,
  pendingApprovals: 12
};

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || ''
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    console.log('Profile updated:', profileForm);
    setEditMode(false);
  };

  const demoLogin = (role = 'customer') => {
    const demoUsers = {
      customer: {
        id: 1, name: 'Demo Customer', email: 'customer@techcare.com',
        phone: '+1 (555) 123-4567', address: '123 Demo Street, Demo City',
        bio: 'Demo customer account.', role: 'user',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop'
      },
      technician: {
        id: 2, name: 'Demo Technician', email: 'tech@techcare.com',
        phone: '+1 (555) 987-6543', address: '456 Tech Avenue, Tech City',
        bio: 'Expert technician with 10+ years experience.', role: 'technician',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop',
        specialization: ['Mobile Repair', 'PC Repair', 'Data Recovery'],
        yearsExperience: 10
      },
      admin: {
        id: 3, name: 'Demo Admin', email: 'admin@techcare.com',
        phone: '+1 (555) 111-2222', address: '789 Admin Blvd, Admin City',
        bio: 'System administrator.', role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=256&h=256&fit=crop'
      }
    };

    const selectedUser = demoUsers[role];
    localStorage.setItem('user', JSON.stringify(selectedUser));
    localStorage.setItem('token', 'demo-token');
    window.location.reload();
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
          <p className="text-muted-foreground mb-8 text-center">Choose a demo account to explore</p>
          <div className="grid md:grid-cols-3 gap-4">
            <Button onClick={() => demoLogin('customer')} className="flex-col h-auto py-6">
              <User className="h-8 w-8 mb-2" />
              <span>Customer Account</span>
            </Button>
            <Button onClick={() => demoLogin('technician')} variant="outline" className="flex-col h-auto py-6">
              <Wrench className="h-8 w-8 mb-2" />
              <span>Technician Account</span>
            </Button>
            <Button onClick={() => demoLogin('admin')} variant="secondary" className="flex-col h-auto py-6">
              <Shield className="h-8 w-8 mb-2" />
              <span>Admin Account</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const userRole = user.role === 'user' ? 'customer' : user.role;

  // Customer Profile View
  const CustomerProfile = () => (
    <>
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
            <CardDescription>Your recent activity and stats</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">{mockCustomerOrders.filter(o => o.status === 'completed').length}</div>
              <div className="text-sm text-muted-foreground">Completed Repairs</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">${mockCustomerOrders.reduce((sum, o) => sum + parseFloat(o.total.replace('$', '')), 0).toFixed(0)}</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">{mockCustomerOrders.length}</div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600 mb-2">4.8</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="orders">
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>Track all your repair orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCustomerOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-6 border rounded-xl hover:bg-muted/50 transition">
                  <div className="space-y-1 flex-1">
                    <div className="font-semibold text-lg">{order.service}</div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Wrench className="h-4 w-4" />{order.technician}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{order.date}</span>
                      <span className="flex items-center gap-1">ID: {order.id}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="font-bold text-xl">{order.total}</div>
                    <Badge variant={order.status === 'completed' ? 'default' : order.status === 'in-progress' ? 'secondary' : 'destructive'}>
                      {order.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                    {order.rating && (
                      <div className="flex items-center gap-1 text-xs text-yellow-600">
                        <Star className="h-3 w-3 fill-current" />{order.rating}/5
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );

  // Technician Profile View
  const TechnicianProfile = () => (
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
                <div className="text-3xl font-bold text-green-600">${mockTechnicianStats.earnings.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Earnings</div>
                <div className="text-xs text-green-600 mt-1">+${mockTechnicianStats.monthlyRevenue} this month</div>
              </div>
              <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-200">
                <div className="flex justify-between items-start mb-2">
                  <Briefcase className="h-8 w-8 text-blue-600" />
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600">{mockTechnicianStats.completedJobs}</div>
                <div className="text-sm text-muted-foreground">Jobs Completed</div>
                <div className="text-xs text-blue-600 mt-1">{mockTechnicianStats.activeJobs} active jobs</div>
              </div>
              <div className="p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl border border-yellow-200">
                <div className="flex justify-between items-start mb-2">
                  <Star className="h-8 w-8 text-yellow-600 fill-yellow-600" />
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="text-3xl font-bold text-yellow-600">{mockTechnicianStats.rating}</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
                <div className="text-xs text-yellow-600 mt-1">Top rated technician</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specializations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(user.specialization || ['Mobile Repair', 'PC Repair', 'Data Recovery']).map((spec) => (
                  <Badge key={spec} variant="secondary" className="px-4 py-2">{spec}</Badge>
                ))}
              </div>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span><strong>{user.yearsExperience || 10}</strong> years of experience</span>
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
              {mockTechnicianJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-6 border rounded-xl hover:bg-muted/50 transition">
                  <div className="space-y-1 flex-1">
                    <div className="font-semibold text-lg">{job.service}</div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="h-4 w-4" />{job.customer}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{job.date}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="font-bold text-xl">{job.amount}</div>
                    <Badge variant={job.status === 'completed' ? 'default' : job.status === 'in-progress' ? 'secondary' : 'outline'}>
                      {job.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                    {job.status === 'pending' && (
                      <Button size="sm" className="w-full mt-2">Accept Job</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );

  // Admin Profile View
  const AdminProfile = () => (
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
              <div className="text-3xl font-bold text-purple-600">{mockAdminStats.totalUsers}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-200">
              <Wrench className="h-8 w-8 text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-blue-600">{mockAdminStats.totalTechnicians}</div>
              <div className="text-sm text-muted-foreground">Active Technicians</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-200">
              <DollarSign className="h-8 w-8 text-green-600 mb-2" />
              <div className="text-3xl font-bold text-green-600">${mockAdminStats.revenue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl border border-orange-200">
              <Briefcase className="h-8 w-8 text-orange-600 mb-2" />
              <div className="text-3xl font-bold text-orange-600">{mockAdminStats.activeJobs}</div>
              <div className="text-sm text-muted-foreground">Active Jobs</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl border border-red-200">
              <Clock className="h-8 w-8 text-red-600 mb-2" />
              <div className="text-3xl font-bold text-red-600">{mockAdminStats.pendingApprovals}</div>
              <div className="text-sm text-muted-foreground">Pending Approvals</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-teal-500/10 to-teal-600/10 rounded-xl border border-teal-200">
              <TrendingUp className="h-8 w-8 text-teal-600 mb-2" />
              <div className="text-3xl font-bold text-teal-600">94%</div>
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

  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl">{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold">{user.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="capitalize">{userRole}</Badge>
                  {userRole === 'technician' && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{mockTechnicianStats.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg">
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} rows={3} />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1">Save Changes</Button>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview"><User className="mr-2 h-4 w-4" />Overview</TabsTrigger>
            <TabsTrigger value="orders"><Truck className="mr-2 h-4 w-4" />{userRole === 'admin' ? 'Manage' : userRole === 'technician' ? 'Jobs' : 'Orders'}</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4" />Settings</TabsTrigger>
            <TabsTrigger value="security"><Shield className="mr-2 h-4 w-4" />Security</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4" />Notifications</TabsTrigger>
          </TabsList>

          {/* Role-specific content */}
          {userRole === 'customer' && <CustomerProfile />}
          {userRole === 'technician' && <TechnicianProfile />}
          {userRole === 'admin' && <AdminProfile />}

          {/* Common Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Preferences
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Theme</Label>
                      <Select defaultValue="system">
                        <SelectTrigger><SelectValue placeholder="Theme" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger><SelectValue placeholder="Language" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Methods
                  </h3>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <span>**** **** **** 1234</span>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <Button variant="outline" className="w-full">Add Payment Method</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Common Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security & Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Change Password
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input placeholder="Current Password" type="password" />
                    <Input placeholder="New Password" type="password" />
                    <Input placeholder="Confirm New Password" type="password" className="md:col-span-2" />
                    <Button className="md:col-span-2">Update Password</Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Active Sessions</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span>Chrome on Windows • Today</span>
                      <Button variant="ghost" size="sm">Log out</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Common Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <input type="checkbox" checked={notifications.email} onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })} className="w-5 h-5 rounded" />
                      Email notifications
                    </Label>
                    <p className="text-sm text-muted-foreground ml-7">Order updates, promotions, new messages</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <input type="checkbox" checked={notifications.sms} onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })} className="w-5 h-5 rounded" />
                      SMS notifications
                    </Label>
                    <p className="text-sm text-muted-foreground ml-7">Urgent order updates only</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <input type="checkbox" checked={notifications.push} onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })} className="w-5 h-5 rounded" />
                      Push notifications
                    </Label>
                    <p className="text-sm text-muted-foreground ml-7">App notifications for real-time updates</p>
                  </div>
                </div>
                <Button className="w-full">Save Notification Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
