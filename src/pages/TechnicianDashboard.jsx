import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Wallet, TrendingUp, CheckCircle, Star, Briefcase, Gavel, Smartphone, Monitor, Tablet, Loader2, User, Sparkles, ArrowRight, Activity, Calendar, Shield, Settings, Wrench } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import CurrencyDisplay from '../components/CurrencyDisplay';
import { formatDistanceToNow } from 'date-fns';
import SEO from '../components/SEO';
import EarningsChart from '../components/EarningsChart';
import { POLLING_INTERVALS } from '../lib/constants';
import realtimeService from '../utils/realtimeService';

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [completeJob, setCompleteJob] = useState({
    id: null,
    isOpen: false,
    actualCost: '',
    notes: ''
  });

  // Availability State
  const [availability, setAvailability] = useState({
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    startTime: '09:00',
    endTime: '17:00'
  });

  // Services Management State
  const [services, setServices] = useState([]);
  const [availableMasterServices, setAvailableMasterServices] = useState([]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceIndex, setEditingServiceIndex] = useState(null);
  const [newService, setNewService] = useState({
    service: 'general',
    brand: '',
    model: '',
    price: '',
    description: '',
    duration: '',
    warranty: ''
  });

  // Profile Management State
  const [profileData, setProfileData] = useState({
    name: '',
    description: '',
    experience: '',
    district: '',
    profile_image: '',
    phone: '',
    address: ''
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const isFetchingRef = useRef(false);

  useEffect(() => {
    const fetchDashboardData = async (isInitial = false) => {
      if (!user) return;
      if (isFetchingRef.current) return;

      // Fetch master services list once
      if (isInitial) {
        supabase.from('services').select('*').eq('is_active', true).then(({ data, error }) => {
          if (!error && data) setAvailableMasterServices(data);
        });
      }

      let loadingTimeout;
      try {
        isFetchingRef.current = true;

        // Only show full-screen loading on the very first load if we have no data
        // and add a tiny delay to avoid flashing if data comes from cache/fast network
        if (isInitial && !data) {
          loadingTimeout = setTimeout(() => {
            if (isFetchingRef.current) setLoading(true);
          }, 300);
        }

        // Fetch technician profile from Supabase
        const { data: techProfile, error: techError } = await supabase
          .from('technicians')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (techError && techError.code !== 'PGRST116') {
          console.error('Technician profile error:', techError);
        }

        const technicianId = techProfile?.id;

        // Fetch bookings assigned to this technician
        let activeJobs = [];
        let completedJobs = [];
        if (technicianId) {
          const { data: bookings, error: bookingsError } = await supabase
            .from('bookings')
            .select(`
              *,
              customer:customers(id, name, email, phone)
            `)
            .eq('technician_id', technicianId)
            .order('created_at', { ascending: false });

          if (bookingsError) console.error('Bookings error:', bookingsError);

          // Transform bookings to match expected format and deduplicate
          const uniqueBookingsMap = new Map();
          (bookings || []).forEach(b => {
            if (!uniqueBookingsMap.has(b.id)) {
              uniqueBookingsMap.set(b.id, {
                _id: b.id,
                id: b.id,
                status: b.status,
                customer: b.customer,
                device: {
                  brand: b.device_brand,
                  model: b.device_model,
                  type: b.device_type
                },
                issue: {
                  description: b.issue_description,
                  type: b.issue_type
                },
                estimatedCost: b.estimated_cost || b.price,
                scheduledDate: b.scheduled_date,
                createdAt: b.created_at
              });
            }
          });

          const formattedBookings = Array.from(uniqueBookingsMap.values());
          activeJobs = formattedBookings.filter(b => !['completed', 'cancelled'].includes(b.status));
          completedJobs = formattedBookings.filter(b => b.status === 'completed');
        }

        // Fetch active bids for this technician
        let activeBids = [];
        if (technicianId) {
          const { data: bids, error: bidsError } = await supabase
            .from('bids')
            .select(`
              *,
              booking:bookings(
                *,
                customer:customers(id, name, email)
              )
            `)
            .eq('technician_id', technicianId)
            .in('status', ['pending', 'submitted'])
            .order('created_at', { ascending: false });

          if (bidsError) console.error('Bids error:', bidsError);
          activeBids = (bids || []).map(bid => ({
            _id: bid.id,
            amount: bid.amount,
            status: bid.status,
            estimatedDuration: bid.estimated_duration,
            createdAt: bid.created_at,
            booking: bid.booking ? {
              device: {
                brand: bid.booking.device_brand,
                model: bid.booking.device_model
              },
              customer: bid.booking.customer
            } : null
          }));
        }

        // Calculate stats
        const totalEarnings = completedJobs.reduce((sum, j) => sum + (Number(j.estimatedCost) || 0), 0);
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEarnings = completedJobs
          .filter(j => new Date(j.createdAt) >= todayStart)
          .reduce((sum, j) => sum + (Number(j.estimatedCost) || 0), 0);

        const stats = {
          totalEarnings,
          todayEarnings,
          completedJobs: completedJobs.length,
          activeJobs: activeJobs.length,
          activeBids: activeBids.length,
          rating: techProfile?.rating || 0,
          reviewCount: techProfile?.review_count || 0,
          responseTime: techProfile?.response_time || 'N/A',
          completionRate: completedJobs.length > 0 ? Math.round((completedJobs.length / (completedJobs.length + activeJobs.length)) * 100) : 0,
          availableBalance: totalEarnings * 0.85 // Assuming 15% platform fee
        };

        setData({
          technician: techProfile,
          stats,
          activeJobs,
          activeBids
        });

        if (techProfile?.availability) {
          setAvailability(techProfile.availability);
        }
        if (techProfile?.services) {
          setServices(techProfile.services || []);
        }

        // Set profile data
        setProfileData({
          name: techProfile?.name || user.user_metadata?.name || '',
          description: techProfile?.description || '',
          experience: techProfile?.experience || '',
          district: techProfile?.district || '',
          profile_image: techProfile?.profile_image || user.user_metadata?.avatar_url || '',
          phone: techProfile?.phone || user.user_metadata?.phone || '',
          address: techProfile?.address || techProfile?.location || ''
        });

        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        // Only show error if we don't have any data yet
        if (!data) {
          setError(err.message);
        }
      } finally {
        if (loadingTimeout) clearTimeout(loadingTimeout);
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchDashboardData(true);

    // Subscribe to real-time updates for bookings
    const unsubscribeBookings = realtimeService.subscribeToBookings(() => {
      console.log('[TechnicianDashboard] Real-time booking update received');
      fetchDashboardData(false);
    });

    // Refresh data every 30 seconds as a fallback
    const interval = setInterval(() => fetchDashboardData(false), POLLING_INTERVALS.DASHBOARD_REFRESH);

    return () => {
      clearInterval(interval);
      if (unsubscribeBookings) unsubscribeBookings();
    };
  }, [user?.id]); // Use user.id specifically for more stable dependency

  // Synchronize activeTab with search params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="mt-4 text-zinc-400 font-['Inter']">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const isAuthError = error.includes('404') || error.includes('Not Found') ||
      error.includes('401') || error.includes('403') ||
      error.includes('Forbidden');

    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-4">
        <div className="p-4 rounded-full bg-zinc-900 mb-6">
          <TrendingUp className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-['Outfit'] font-bold text-white mb-2">
          {isAuthError ? 'Session Update Required' : 'Dashboard Error'}
        </h2>
        <p className="text-zinc-400 font-['Inter'] mb-6 max-w-md">
          {isAuthError
            ? 'Please login again to update your account permissions.'
            : error}
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => window.location.reload()} className="border-zinc-700 text-white hover:bg-zinc-800">
            Retry
          </Button>
          {isAuthError && (
            <Button onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }} className="bg-white text-black hover:bg-gray-100">
              Login Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white mx-auto" />
          <p className="mt-4 text-zinc-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const { stats, activeJobs, activeBids } = data;

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'confirmed':
      case 'pending':
      case 'in_progress':
      case 'in-progress':
        return 'secondary';
      case 'scheduled':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  // Helper to format date safely
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  const formatTimeAgo = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };



  const handleStatusUpdate = async (jobId, newStatus) => {
    // If status is completed, open modal instead of immediate update
    if (newStatus === 'completed') {
      const job = activeJobs.find(j => (j._id || j.id) === jobId);
      setCompleteJob({
        id: jobId,
        isOpen: true,
        actualCost: job.estimatedCost || '',
        notes: ''
      });
      return;
    }

    try {
      // Update directly in Supabase
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', jobId);

      if (error) throw error;

      // Update local state
      setData(prev => ({
        ...prev,
        activeJobs: prev.activeJobs.map(job =>
          (job._id || job.id) === jobId ? { ...job, status: newStatus } : job
        )
      }));

      toast({
        title: "Status Updated",
        description: `Job status changed to ${newStatus.replace('_', ' ')}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Update Failed",
        description: "Could not update job status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCompleteJobSubmit = async () => {
    try {
      // Update booking to completed status directly in Supabase
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'completed',
          price: parseFloat(completeJob.actualCost),
          completion_notes: completeJob.notes,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', completeJob.id);

      if (error) throw error;

      // Update local state
      setData(prev => ({
        ...prev,
        activeJobs: prev.activeJobs.filter(job => (job._id || job.id) !== completeJob.id),
        stats: {
          ...prev.stats,
          completedJobs: (prev.stats.completedJobs || 0) + 1,
          totalEarnings: (prev.stats.totalEarnings || 0) + (parseFloat(completeJob.actualCost) || 0)
        }
      }));

      setCompleteJob({ id: null, isOpen: false, actualCost: '', notes: '' });

      toast({
        title: "Job Completed",
        description: "Job marked as complete and earnings updated.",
      });
    } catch (error) {
      console.error('Error completing job:', error);
      toast({
        title: "Completion Failed",
        description: "Could not complete job. Please try again.",
      });
    }
  };

  const saveSettings = async () => {
    try {
      const { error } = await supabase
        .from('technicians')
        .update({
          availability: availability,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({ title: "Settings Saved", description: "Your availability controls have been updated." });
    } catch (err) {
      console.error('Save settings error:', err);
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    }
  };

  const handleSaveService = async () => {
    try {
      if (!newService.price || isNaN(newService.price)) {
        toast({ title: "Invalid Price", description: "Please enter a valid price.", variant: "destructive" });
        return;
      }

      const updatedServices = [...services];
      const serviceEntry = {
        ...newService,
        price: Number(newService.price)
      };

      if (editingServiceIndex !== null) {
        updatedServices[editingServiceIndex] = serviceEntry;
      } else {
        updatedServices.push(serviceEntry);
      }

      const { error } = await supabase
        .from('technicians')
        .update({
          services: updatedServices,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setServices(updatedServices);
      setIsServiceModalOpen(false);
      setEditingServiceIndex(null);
      setNewService({ service: 'general', brand: '', model: '', price: '', description: '', duration: '', warranty: '' });

      toast({
        title: editingServiceIndex !== null ? "Service Updated" : "Service Added",
        description: "Your service pricing has been updated.",
        variant: "default"
      });
    } catch (err) {
      console.error('Save service error:', err);
      toast({ title: "Error", description: "Failed to update services.", variant: "destructive" });
    }
  };

  const handleDeleteService = async (index) => {
    if (!window.confirm("Are you sure you want to remove this service?")) return;

    try {
      const updatedServices = services.filter((_, i) => i !== index);

      const { error } = await supabase
        .from('technicians')
        .update({
          services: updatedServices,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setServices(updatedServices);
      toast({ title: "Service Removed", description: "Service configuration deleted." });
    } catch (err) {
      console.error('Delete service error:', err);
      toast({ title: "Error", description: "Failed to delete service.", variant: "destructive" });
    }
  };

  const openServiceModal = (service = null, index = null) => {
    if (service) {
      setNewService(service);
      setEditingServiceIndex(index);
    } else {
      setNewService({ service: 'general', brand: '', model: '', price: '', description: '', duration: '', warranty: '' });
      setEditingServiceIndex(null);
    }
    setIsServiceModalOpen(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdatingProfile(true);
    try {
      const { error } = await supabase
        .from('technicians')
        .update({
          name: profileData.name,
          description: profileData.description,
          experience: profileData.experience,
          district: profileData.district,
          profile_image: profileData.profile_image,
          phone: profileData.phone,
          address: profileData.address,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your technician profile has been updated successfully.",
      });

      // Refresh data
      // Actually, since we updated it, we can just update local data state
      setData(prev => ({
        ...prev,
        technician: {
          ...prev.technician,
          ...profileData
        }
      }));
    } catch (err) {
      console.error('Update profile error:', err);
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update profile.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-['Inter']">
      <SEO
        title="Technician Dashboard - TechCare"
        description="Manage your repair jobs, bids, and earnings as a TechCare technician."
      />

      {/* Background Effects */}
      <div className="fixed inset-0 bg-black pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Completion Dialog */}
        <Dialog open={completeJob.isOpen} onOpenChange={(open) => !open && setCompleteJob(prev => ({ ...prev, isOpen: false }))}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Job</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="actualCost">Final Cost (LKR)</Label>
                <Input
                  id="actualCost"
                  type="number"
                  value={completeJob.actualCost}
                  onChange={(e) => setCompleteJob(prev => ({ ...prev, actualCost: e.target.value }))}
                  placeholder="Enter final amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Completion Notes</Label>
                <Textarea
                  id="notes"
                  value={completeJob.notes}
                  onChange={(e) => setCompleteJob(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Describe the repair details..."
                />
              </div>
              <Button onClick={handleCompleteJobSubmit} className="w-full bg-emerald-600 hover:bg-emerald-700">
                Confirm Completion
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Service Edit Modal */}
        <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle>{editingServiceIndex !== null ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Service Type</Label>
                <Select
                  value={newService.service}
                  onValueChange={(val) => setNewService({ ...newService, service: val })}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {availableMasterServices.length > 0 ? (
                      availableMasterServices.map(s => (
                        <SelectItem key={s.id} value={s.id} className="text-white">
                          {s.name}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="general">General Repair</SelectItem>
                        <SelectItem value="screen">Screen Replacement</SelectItem>
                        <SelectItem value="battery">Battery Replacement</SelectItem>
                        <SelectItem value="water-damage">Water Damage</SelectItem>
                        <SelectItem value="software">Software Issue</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Brand (Optional)</Label>
                  <Input
                    value={newService.brand}
                    onChange={(e) => setNewService({ ...newService, brand: e.target.value })}
                    placeholder="e.g. Apple"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Model (Optional)</Label>
                  <Input
                    value={newService.model}
                    onChange={(e) => setNewService({ ...newService, model: e.target.value })}
                    placeholder="e.g. iPhone 13"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Price (LKR)</Label>
                <Input
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  placeholder="0.00"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Textarea
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Describe what's included in this service..."
                  className="bg-zinc-800 border-zinc-700 min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input
                    value={newService.duration}
                    onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                    placeholder="e.g. 1 hour"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Warranty</Label>
                  <Input
                    value={newService.warranty}
                    onChange={(e) => setNewService({ ...newService, warranty: e.target.value })}
                    placeholder="e.g. 6 Months"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>

              <Button onClick={handleSaveService} className="w-full bg-white text-black hover:bg-zinc-200">
                {editingServiceIndex !== null ? 'Update Service' : 'Add Service'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <Badge className="mb-2 bg-zinc-800 text-zinc-300 border-zinc-700">
              <Sparkles className="w-3 h-3 mr-1" />
              Technician
            </Badge>
            {data.technician?.isVerified ? (
              <Badge className="mb-2 ml-2 bg-emerald-900/50 text-emerald-300 border-emerald-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            ) : (
              <Badge className="mb-2 ml-2 bg-amber-900/50 text-amber-300 border-amber-700">
                <Shield className="w-3 h-3 mr-1" />
                Unverified
              </Badge>
            )}
            <h1 className="text-3xl sm:text-4xl font-['Outfit'] font-bold tracking-tight text-white">Technician Dashboard</h1>
            <p className="text-zinc-400 mt-1">
              Welcome back, {user?.name || 'Technician'}! Here's your business overview.
            </p>
          </div>
          <Button
            onClick={() => navigate('/bidding')}
            className="bg-white text-black hover:bg-gray-100 font-semibold py-6 px-8 rounded-full shadow-lg transition-all duration-300"
          >
            <Briefcase className="mr-2 h-5 w-5" />
            Browse Jobs
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Wallet className="h-8 w-8 opacity-80" />
                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">Total</Badge>
              </div>
              <div className="text-3xl font-['Outfit'] font-bold mb-1">
                <CurrencyDisplay amount={stats.totalEarnings} decimals={0} />
              </div>
              <div className="text-sm opacity-90">Total Earnings</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 opacity-80" />
                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">Today</Badge>
              </div>
              <div className="text-3xl font-['Outfit'] font-bold mb-1">
                <CurrencyDisplay amount={stats.todayEarnings} decimals={0} />
              </div>
              <div className="text-sm opacity-90">Today's Earnings</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="h-8 w-8 opacity-80" />
                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">Completed</Badge>
              </div>
              <div className="text-3xl font-['Outfit'] font-bold mb-1">{stats.completedJobs}</div>
              <div className="text-sm opacity-90">Total Jobs Done</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-600 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Star className="h-8 w-8 opacity-80" />
                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">Rating</Badge>
              </div>
              <div className="text-3xl font-['Outfit'] font-bold mb-1">{stats.rating}</div>
              <div className="text-sm opacity-90">{stats.reviewCount} Reviews</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 h-auto p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
            <TabsTrigger value="overview" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Overview</TabsTrigger>
            <TabsTrigger value="jobs" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Jobs</TabsTrigger>
            <TabsTrigger value="bids" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Bids</TabsTrigger>
            <TabsTrigger value="earnings" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Earnings</TabsTrigger>
            <TabsTrigger value="analytics" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Stats</TabsTrigger>
            <TabsTrigger value="services" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Services</TabsTrigger>
            <TabsTrigger value="profile" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Profile</TabsTrigger>
            <TabsTrigger value="settings" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']"><Settings className="w-4 h-4 mr-2" />Settings</TabsTrigger>
          </TabsList >

          <TabsContent value="profile" className="animate-in fade-in duration-500">
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
              <CardHeader className="bg-zinc-800/30 font-['Outfit'] border-b border-zinc-800">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Your Public Profile
                </CardTitle>
                <CardDescription>This information is visible to customers when they browse technicians.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleUpdateProfile} className="space-y-8 max-w-2xl mx-auto">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-zinc-800 bg-zinc-950">
                          {profileData.profile_image ? (
                            <img src={profileData.profile_image} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-700">
                              <User className="w-12 h-12" />
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl cursor-pointer">
                          <Edit3 className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Profile Photo</p>
                    </div>

                    <div className="flex-1 space-y-6 w-full">
                      <div className="space-y-2">
                        <Label className="text-zinc-400">Display Name</Label>
                        <Input
                          required
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          placeholder="e.g. John Doe"
                          className="bg-zinc-950 border-zinc-800 focus:border-white transition-all h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-zinc-400">Profile Image URL</Label>
                        <Input
                          value={profileData.profile_image}
                          onChange={(e) => setProfileData({ ...profileData, profile_image: e.target.value })}
                          placeholder="https://example.com/photo.jpg"
                          className="bg-zinc-950 border-zinc-800 focus:border-white transition-all h-12"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800">
                    <div className="space-y-2">
                      <Label className="text-zinc-400">District / Service Area</Label>
                      <Select
                        value={profileData.district}
                        onValueChange={(val) => setProfileData({ ...profileData, district: val })}
                      >
                        <SelectTrigger className="bg-zinc-950 border-zinc-800 h-12">
                          <SelectValue placeholder="Select Area" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                          <SelectItem value="Colombo">Colombo</SelectItem>
                          <SelectItem value="Gampaha">Gampaha</SelectItem>
                          <SelectItem value="Kalutara">Kalutara</SelectItem>
                          <SelectItem value="Kandy">Kandy</SelectItem>
                          <SelectItem value="Galle">Galle</SelectItem>
                          <SelectItem value="Matara">Matara</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-zinc-400">Experience</Label>
                      <Input
                        value={profileData.experience}
                        onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                        placeholder="e.g. 5+ Years"
                        className="bg-zinc-950 border-zinc-800 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-400">Provider Bio / Description</Label>
                    <Textarea
                      value={profileData.description}
                      onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                      placeholder="Tell customers about your skills, tools, and repair philosophy..."
                      className="bg-zinc-950 border-zinc-800 min-h-[150px] resize-none focus:border-white transition-all p-4"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-zinc-400">Phone Number</Label>
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="+94 7X XXX XXXX"
                        className="bg-zinc-950 border-zinc-800 h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-400">Business Address</Label>
                      <Input
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        placeholder="123 Repair St, Colombo"
                        className="bg-zinc-950 border-zinc-800 h-12"
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <Button
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="bg-white text-black hover:bg-zinc-200 px-10 h-12 rounded-full font-bold shadow-xl transition-all"
                    >
                      {isUpdatingProfile ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        'Save Profile Changes'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          < TabsContent value="overview" className="space-y-6" >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-['Outfit'] font-bold text-white">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Response Time</span>
                    <span className="font-['Inter'] font-semibold text-white">{stats.responseTime || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Completion Rate</span>
                    <span className="font-['Inter'] font-semibold text-emerald-500">{stats.completionRate || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Active Jobs</span>
                    <span className="font-['Inter'] font-semibold text-blue-500">{stats.activeJobs}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Active Bids</span>
                    <span className="font-['Inter'] font-semibold text-amber-500">{stats.activeBids}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Jobs */}
              <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-['Outfit'] font-bold text-white">Active Jobs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeJobs.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500">
                      <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No active jobs</p>
                    </div>
                  ) : (
                    activeJobs.map(job => (
                      <div key={job._id} className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700">
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                        <div className="flex-1">
                          <div className="font-['Inter'] font-medium text-white">{job.device?.brand} {job.device?.model}</div>
                          <div className="text-sm text-zinc-400">
                            {job.customer?.name}
                          </div>
                          <div className="mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/chat/${job._id || job.id}`)}
                              className="h-7 text-xs border-zinc-700 text-white hover:bg-zinc-800"
                            >
                              <User className="mr-1 h-3 w-3" />
                              Chat
                            </Button>
                          </div>
                        </div>
                        <Badge variant={getStatusBadgeVariant(job.status)}>{job.status}</Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Pending Bids */}
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-['Outfit'] font-bold text-white">Recent Bids</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeBids.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500">
                    <Gavel className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No active bids</p>
                  </div>
                ) : (
                  activeBids.map((bid) => (
                    <div key={bid._id} className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                      <div className="flex-1">
                        <h4 className="font-['Outfit'] font-semibold text-white">{bid.booking?.device?.brand} {bid.booking?.device?.model}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-zinc-400">
                          <span>Customer: {bid.booking?.customer?.name}</span>
                          <span>{formatTimeAgo(bid.createdAt)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-['Outfit'] font-bold text-white">
                          <CurrencyDisplay amount={bid.amount} decimals={0} />
                        </div>
                        <div className="text-xs text-zinc-500">Your Bid</div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent >

          {/* Jobs Tab */}
          < TabsContent value="jobs" >
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg font-['Outfit'] font-bold text-white">Active Jobs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeJobs.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500">
                    <Briefcase className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No active jobs found</p>
                  </div>
                ) : (
                  activeJobs.map((job) => (
                    <div key={job._id} className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                      <div className="flex-1">
                        <h4 className="font-['Outfit'] font-semibold text-white">{job.device?.brand} {job.device?.model}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-zinc-400">
                          <span>Customer: {job.customer?.name}</span>
                          <span>Date: {formatDate(job.scheduledDate)}</span>
                          <div className="z-10 relative" onClick={(e) => e.stopPropagation()}>
                            <Select
                              value={job.status}
                              onValueChange={(value) => handleStatusUpdate(job._id || job.id, value)}
                            >
                              <SelectTrigger className="w-[160px] h-7 bg-zinc-900 border-zinc-700 text-xs">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="diagnosing">Diagnosing</SelectItem>
                                <SelectItem value="waiting_for_parts">Waiting Parts</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-['Outfit'] font-bold text-white">
                          <CurrencyDisplay amount={job.estimatedCost} decimals={0} />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent >

          {/* Bids Tab */}
          < TabsContent value="bids" >
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-['Outfit'] font-bold text-white">My Active Bids</CardTitle>
                <Button
                  onClick={() => navigate('/bidding')}
                  variant="outline"
                  className="border-zinc-700 text-white hover:bg-zinc-800"
                >
                  Browse More Jobs
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeBids.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500">
                    <Gavel className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No active bids found</p>
                  </div>
                ) : (
                  activeBids.map((bid) => (
                    <div key={bid._id} className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-['Outfit'] font-semibold text-white">{bid.booking?.device?.brand} {bid.booking?.device?.model}</h4>
                          <p className="text-sm text-zinc-400">
                            Customer: {bid.booking?.customer?.name} • Posted {formatTimeAgo(bid.createdAt)}
                          </p>
                        </div>
                        <Badge className="bg-amber-900/50 text-amber-200 border-amber-700">
                          {bid.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <div className="text-sm text-zinc-400">
                          Duration: {bid.estimatedDuration}h
                        </div>
                        <div className="text-xl font-['Outfit'] font-bold text-white">
                          <CurrencyDisplay amount={bid.amount} decimals={0} />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent >

          {/* Earnings Tab */}
          < TabsContent value="earnings" className="space-y-6" >
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="text-sm text-zinc-400 mb-1">Today</div>
                  <div className="text-2xl font-['Outfit'] font-bold text-emerald-500">
                    <CurrencyDisplay amount={stats.todayEarnings} decimals={0} />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="text-sm text-zinc-400 mb-1">Available Balance</div>
                  <div className="text-2xl font-['Outfit'] font-bold text-blue-500">
                    <CurrencyDisplay amount={stats.availableBalance} decimals={0} />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="text-sm text-zinc-400 mb-1">Total Earnings</div>
                  <div className="text-2xl font-['Outfit'] font-bold text-purple-500">
                    <CurrencyDisplay amount={stats.totalEarnings} decimals={0} />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6">
              <EarningsChart
                title="Earnings History"
                loading={loading}
                currency="LKR"
              />
            </div>
          </TabsContent >

          {/* Analytics Tab */}
          < TabsContent value="analytics" >
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg font-['Outfit'] font-bold text-white">Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Job Statistics */}
                  <div className="space-y-6">
                    <h4 className="font-['Outfit'] font-semibold text-white">Job Statistics</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="text-zinc-400">Completion Rate</span>
                          <span className="font-['Inter'] font-semibold text-white">{stats.completionRate || 0}%</span>
                        </div>
                        <Progress value={stats.completionRate || 0} className="h-2 bg-zinc-800" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent >

          <TabsContent value="services" className="animate-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
              <CardHeader className="bg-zinc-800/20 border-b border-zinc-800 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-['Outfit'] font-bold text-white">Service Management</CardTitle>
                  <CardDescription>Configure your rates and repair types for maximum reach.</CardDescription>
                </div>
                <Button onClick={() => openServiceModal()} className="bg-white text-black hover:bg-zinc-200">
                  <Plus className="w-4 h-4 mr-2" /> Add Service
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-zinc-950/50 text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
                      <tr>
                        <th className="px-6 py-4">Service Type</th>
                        <th className="px-6 py-4">Device Focus</th>
                        <th className="px-6 py-4">Price (LKR)</th>
                        <th className="px-6 py-4">Status & Warranty</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {services.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-20 text-center text-zinc-500">
                            <Wrench className="h-10 w-10 mx-auto mb-3 opacity-20" />
                            <p>No custom services configured yet.</p>
                            <Button variant="link" onClick={() => openServiceModal()} className="text-primary mt-1">Configure your first rate</Button>
                          </td>
                        </tr>
                      ) : (
                        services.map((s, idx) => (
                          <tr key={idx} className="hover:bg-zinc-800/20 transition-colors">
                            <td className="px-6 py-4">
                              <span className="font-bold text-white capitalize">{s.service?.replace('-', ' ')}</span>
                            </td>
                            <td className="px-6 py-4 text-zinc-300">
                              {s.brand || 'All Brands'} {s.model ? `• ${s.model}` : ''}
                            </td>
                            <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                              {Number(s.price).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-xs text-zinc-500">
                              {s.duration || 'Flexible'} {s.warranty ? `• ${s.warranty}` : ''}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => openServiceModal(s, idx)} className="h-8 w-8 text-zinc-400 hover:text-white">
                                  <Edit3 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteService(idx)} className="h-8 w-8 text-zinc-600 hover:text-red-500">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
                <CardHeader className="bg-amber-500/10 border-b border-zinc-800">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-500" />
                    Availability Blocks
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <Label className="text-zinc-400">Working Days</Label>
                    <div className="flex flex-wrap gap-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            const newDays = availability.days.includes(day)
                              ? availability.days.filter(d => d !== day)
                              : [...availability.days, day];
                            setAvailability({ ...availability, days: newDays });
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${availability.days.includes(day)
                            ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                            : 'bg-zinc-950 border border-zinc-800 text-zinc-500 hover:border-zinc-700'
                            }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Start Time</Label>
                      <Input
                        type="time"
                        value={availability.startTime}
                        onChange={(e) => setAvailability({ ...availability, startTime: e.target.value })}
                        className="bg-zinc-950 border-zinc-800 h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">End Time</Label>
                      <Input
                        type="time"
                        value={availability.endTime}
                        onChange={(e) => setAvailability({ ...availability, endTime: e.target.value })}
                        className="bg-zinc-950 border-zinc-800 h-10"
                      />
                    </div>
                  </div>

                  <Button onClick={saveSettings} className="w-full bg-amber-500 text-black hover:bg-amber-600 font-bold">
                    Save Schedule Pattern
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
                <CardHeader className="bg-zinc-800/10 border-b border-zinc-800">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Settings className="w-5 h-5 text-zinc-500" />
                    System Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="p-4 bg-zinc-950/80 rounded-xl border border-zinc-800 flex items-center justify-between group cursor-pointer hover:border-zinc-700 transition-all">
                    <div>
                      <p className="font-bold text-white">Vacation Mode</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-tight">Temporarily hide your profile from search</p>
                    </div>
                    <div className="w-12 h-6 bg-zinc-800 rounded-full relative">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-zinc-600 rounded-full shadow-lg" />
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-950/80 rounded-xl border border-zinc-800 flex items-center justify-between group cursor-pointer hover:border-zinc-700 transition-all">
                    <div>
                      <p className="font-bold text-white font-['Outfit']">Instant Booking</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-tight">Accept orders without prior bidding</p>
                    </div>
                    <div className="w-12 h-6 bg-emerald-500/20 border border-emerald-500/50 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" />
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button variant="outline" className="w-full border-red-900/30 text-red-500 hover:bg-red-500/10 hover:text-red-400 h-12 rounded-xl">
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent >
        </Tabs >
      </main >
    </div >
  );
};

export default TechnicianDashboard;
