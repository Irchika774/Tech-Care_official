import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Wallet, TrendingUp, CheckCircle, Star, Briefcase, Gavel, Smartphone, Monitor, Tablet, Loader2, User, Sparkles, ArrowRight, Activity, Calendar, Edit, Plus, Trash2, ShieldCheck, ShieldAlert, Save, BarChart3, Clock as ClockIcon, Settings, MapPin, Banknote, Bell, AlertCircle, DollarSign, Clock, Send, MessageSquare, Wrench } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { ScrollArea } from '../components/ui/scroll-area';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import CurrencyDisplay from '../components/CurrencyDisplay';
import { formatDistanceToNow } from 'date-fns';
import SEO from '../components/SEO';
import EarningsChart from '../components/EarningsChart';
import { ImageUpload } from '../components/ImageUpload';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import realtimeService from '../utils/realtimeService';

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'profile', 'jobs', 'bids', 'earnings', 'analytics', 'services', 'inventory', 'marketplace', 'pricing'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Profile & Gigs State
  const [profileData, setProfileData] = useState({
    shopName: '',
    description: '',
    address: '',
    district: '',
    phone: '',
    email: '',
    logoUrl: '',
    coverUrl: '',
    services: [], // This will store pricing data now
    verified: false,
    availability: {},
    payoutDetails: { method: 'Bank Transfer', details: '' }
  });

  const [pricingForm, setPricingForm] = useState({
    service: 'screen',
    brand: '',
    model: '',
    price: ''
  });

  const handleAddPricing = async () => {
    if (!pricingForm.brand || !pricingForm.price) {
      toast({ title: "Missing Fields", description: "Please fill in brand and price", variant: "destructive" });
      return;
    }

    const newPricing = {
      id: Date.now().toString(),
      service: pricingForm.service,
      brand: pricingForm.brand,
      model: pricingForm.model || 'All Models',
      price: parseFloat(pricingForm.price)
    };

    const updatedServices = [...(profileData.services || []), newPricing];
    setProfileData({ ...profileData, services: updatedServices });

    // Auto-save
    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      await fetch(`${API_URL}/api/technicians/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...profileData, services: updatedServices })
      });
      toast({ title: "Price Added", description: "Your service pricing has been updated." });
      setPricingForm({ service: 'screen', brand: '', model: '', price: '' });
    } catch (err) {
      toast({ title: "Error", description: "Failed to save pricing", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePricing = async (id) => {
    const updatedServices = profileData.services.filter(s => s.id !== id);
    setProfileData({ ...profileData, services: updatedServices });

    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      await fetch(`${API_URL}/api/technicians/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...profileData, services: updatedServices })
      });
      toast({ title: "Price Removed", description: "Service pricing deleted." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete pricing", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const [gigs, setGigs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [showGigModal, setShowGigModal] = useState(false);
  const [isAddingInventory, setIsAddingInventory] = useState(false);
  const [editingInventoryId, setEditingInventoryId] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', category: 'Part' });
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('Bank Transfer');
  const [withdrawDetails, setWithdrawDetails] = useState('');
  const [currentGig, setCurrentGig] = useState({
    id: null,
    title: '',
    description: '',
    price: '',
    image: '',
    duration: '1'
  });
  const [availableJobs, setAvailableJobs] = useState([]);
  const [submittingBid, setSubmittingBid] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [showBidModal, setShowBidModal] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome!', message: 'Complete your profile to start getting jobs.', time: 'Just now', unread: true }
  ]);
  const [unreadCount, setUnreadCount] = useState(1);
  const [checkingJobs, setCheckingJobs] = useState(false);

  const handleWithdraw = async () => {
    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${API_URL}/api/technicians/withdraw`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(withdrawAmount),
          method: withdrawMethod,
          details: withdrawDetails
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Withdrawal failed');
      }

      toast({
        title: "Success",
        description: "Withdrawal request submitted successfully",
      });
      setShowWithdrawModal(false);
      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvailabilityUpdate = async () => {
    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${API_URL}/api/technicians/availability`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ availability: profileData.availability })
      });

      if (!response.ok) throw new Error('Failed to update availability');

      toast({
        title: "Availability Updated",
        description: "Your work hours have been saved.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone. All your gigs, profile data, and history will be permanently removed.")) {
      return;
    }

    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const handleSavePayoutSettings = async () => {
    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();

      // Update profile with payout details (reusing profile endpoint)
      const response = await fetch(`${API_URL}/api/technicians/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) throw new Error('Failed to save payout settings');

      toast({
        title: "Settings Saved",
        description: "Your payout preferences have been updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleWithdrawBid = async (bidId) => {
    if (!confirm('Are you sure you want to withdraw this bid?')) return;
    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${API_URL}/api/technicians/bids/${bidId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      if (!response.ok) throw new Error('Failed to withdraw bid');

      toast({
        title: "Bid Withdrawn",
        description: "Your bid has been successfully removed.",
      });
      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const fetchAvailableJobs = async () => {
    try {
      setCheckingJobs(true);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const response = await fetch(`${API_URL}/api/technicians/jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setCheckingJobs(false);
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingBid(true);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const bidData = {
        bookingId: selectedJob._id || selectedJob.id,
        amount: parseFloat(bidAmount),
        message: bidMessage,
        estimatedDuration: parseInt(estimatedDuration)
      };

      const response = await fetch(`${API_URL}/api/technicians/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bidData)
      });

      if (response.ok) {
        setShowBidModal(false);
        setBidAmount('');
        setBidMessage('');
        setEstimatedDuration('');
        fetchDashboardData(); // Refresh to update Active Bids count
        toast({
          title: "Bid Submitted",
          description: "Your proposal has been sent to the customer.",
        });
        setActiveTab('bids');
      } else {
        throw new Error('Failed to submit bid');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: error.message,
      });
    } finally {
      setSubmittingBid(false);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const districts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha',
    'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala',
    'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  // Track if we're currently experiencing auth errors to stop polling
  const [authError, setAuthError] = useState(false);

  const fetchDashboardData = async (isBackground = false) => {
    let timeoutId;
    console.log('fetchDashboardData called, user:', user?.id);
    try {
      if (!isBackground) setLoading(true);
      if (!user) {
        console.log('No user, stopping loading');
        setLoading(false);
        return;
      }

      // Add a timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Request timed out')), 10000);
      });

      const fetchDataPromise = (async () => {
        // ALWAYS fetch fresh session to avoid stale token issues after TOKEN_REFRESHED
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        const token = currentSession?.access_token;

        console.log('Using fresh session token length:', token?.length);

        if (!token) {
          console.log('No token available, skipping fetch');
          return null;
        }

        console.log('Fetching dashboard data from:', `${API_URL}/api/technicians/dashboard`);
        const response = await fetch(`${API_URL}/api/technicians/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        console.log('Response received, status:', response.status);

        // Handle 401 specially - stop polling until session is refreshed
        if (response.status === 401 || response.status === 403) {
          console.warn('Auth error detected, stopping polling until session refreshes');
          setAuthError(true);
          throw new Error(`Auth failed: ${response.status}`);
        }

        if (!response.ok) throw new Error(`Failed to fetch dashboard data: ${response.status}`);

        // Clear auth error on success
        setAuthError(false);

        const result = await response.json();
        console.log('Data received:', result ? 'yes' : 'no');
        return result;
      })();

      const result = await Promise.race([fetchDataPromise, timeoutPromise]);
      clearTimeout(timeoutId);

      if (!result) return;

      setData(result);

      if (result.profile) {
        setProfileData({
          shopName: result.profile.shopName || user.user_metadata?.name || user.name || '',
          description: result.profile.description || '',
          address: result.profile.address || '',
          district: result.profile.district || '',
          phone: result.profile.phone || '',
          email: result.profile.email || user.email || '',
          logoUrl: result.profile.logoUrl || '',
          coverUrl: result.profile.coverUrl || '',
          services: result.profile.services || [],
          verified: result.profile.verified || false,
          availability: result.profile.availability || {},
          payoutDetails: result.profile.payoutDetails || { method: 'Bank Transfer', details: '' }
        });
        setGigs(result.gigs || []);
        setReviews(result.reviews || []);
        setInventory(result.inventory || []);
        setRecentTransactions(result.recentTransactions || []);
      } else {
        setProfileData(prev => ({ ...prev, shopName: user.name || '', email: user.email || '' }));
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      // Only set error for non-auth errors (auth errors just stop polling)
      if (!err.message.includes('Auth failed')) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset auth error and refetch when session changes (e.g., after TOKEN_REFRESHED)
  useEffect(() => {
    if (session?.access_token && authError) {
      console.log('[TechnicianDashboard] Session refreshed, resuming polling');
      setAuthError(false);
      fetchDashboardData();
    }
  }, [session?.access_token]);

  useEffect(() => {
    let interval;
    let unsubTechnicians;
    let unsubBookings;
    let unsubBids;
    let unsubReviews;
    let unsubGigs;
    let unsubNotifications;

    if (user?.id) {
      fetchDashboardData();
      fetchAvailableJobs(); // Fetch available jobs on mount

      // Poll every 30 seconds as fallback, but skip if auth error
      interval = setInterval(() => {
        if (!authError) {
          fetchDashboardData(true);
          fetchAvailableJobs();
        } else {
          console.log('[TechnicianDashboard] Polling skipped - auth error state');
        }
      }, 30000);

      // Subscribe to real-time updates using centralized service
      unsubTechnicians = realtimeService.subscribeToTechnicians((payload) => {
        // Only update if it pertains to this technician user
        if (payload.new?.user_id === user.id || payload.old?.user_id === user.id) {
          console.log('[TechnicianDashboard] Technician update:', payload.eventType);
          if (!authError) fetchDashboardData(true);
        }
      });

      unsubBookings = realtimeService.subscribeToBookings((payload) => {
        console.log('[TechnicianDashboard] Booking update:', payload.eventType);
        if (!authError) {
          fetchDashboardData(true);
          fetchAvailableJobs(); // Refresh available jobs when bookings change
        }
      }, user.id);

      unsubBids = realtimeService.subscribeToBids((payload) => {
        console.log('[TechnicianDashboard] Bid update:', payload.eventType);
        if (!authError) {
          fetchDashboardData(true);
          fetchAvailableJobs();
        }
      });

      unsubReviews = realtimeService.subscribeToReviews((payload) => {
        console.log('[TechnicianDashboard] Review update:', payload.eventType);
        if (!authError) fetchDashboardData(true);
      });

      unsubGigs = realtimeService.subscribeToGigs((payload) => {
        console.log('[TechnicianDashboard] Gig update:', payload.eventType);
        if (payload.new?.technician_id === data?.technician?.id && !authError) {
          fetchDashboardData(true);
        }
      });

      // Special notification handling to just refresh dashboard data which includes notif count
      unsubNotifications = realtimeService.subscribeToNotifications(user.id, (payload) => {
        console.log('[TechnicianDashboard] New notification:', payload.new?.type);
        if (!authError) fetchDashboardData(true);
      });
    }

    return () => {
      if (interval) clearInterval(interval);
      if (unsubTechnicians) unsubTechnicians();
      if (unsubBookings) unsubBookings();
      if (unsubBids) unsubBids();
      if (unsubReviews) unsubReviews();
      if (unsubGigs) unsubGigs();
      if (unsubNotifications) unsubNotifications();
    };
  }, [user?.id, authError]);

  const handleStatusUpdate = async (jobId, newStatus) => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const token = currentSession?.access_token;

      const response = await fetch(`${API_URL}/api/bookings/${jobId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      setData(prev => ({
        ...prev,
        activeJobs: prev.activeJobs.map(job =>
          (job._id === jobId || job.id === jobId) ? { ...job, status: newStatus } : job
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
        description: error.message || "Could not update job status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRequestVerification = async () => {
    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${API_URL}/api/technicians/verify-request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to send verification request');

      toast({
        title: "Verification Requested",
        description: "An admin will review your details shortly.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification request.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${API_URL}/api/technicians/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) throw new Error('Failed to update profile');

      toast({
        title: "Profile Updated",
        description: "Your shop details have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGig = async () => {
    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      const method = currentGig.id ? 'PUT' : 'POST';
      const endpoint = currentGig.id ? `${API_URL}/api/technicians/gigs/${currentGig.id}` : `${API_URL}/api/technicians/gigs`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentGig)
      });

      if (!response.ok) throw new Error('Failed to save gig');

      toast({
        title: "Gig Saved",
        description: "Service gig has been updated.",
      });
      setShowGigModal(false);
      setCurrentGig({ id: null, title: '', description: '', price: '', image: '', duration: '1' });
      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGig = async (gigId) => {
    if (!confirm('Are you sure you want to delete this gig?')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${API_URL}/api/technicians/gigs/${gigId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete gig');

      toast({
        title: "Gig Deleted",
        description: "Service gig has been removed.",
      });
      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress':
      case 'in-progress': return 'secondary';
      case 'scheduled': return 'outline';
      default: return 'secondary';
    }
  };

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

  const handleAddInventory = async () => {
    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();

      const method = editingInventoryId ? 'PUT' : 'POST';
      const endpoint = editingInventoryId
        ? `${API_URL}/api/technicians/inventory/${editingInventoryId}`
        : `${API_URL}/api/technicians/inventory`;

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
      });
      if (!response.ok) throw new Error(editingInventoryId ? 'Failed to update item' : 'Failed to add item');

      setIsAddingInventory(false);
      setEditingInventoryId(null);
      setNewItem({ name: '', quantity: '', category: 'Part' });
      fetchDashboardData();
      toast({ title: "Success", description: editingInventoryId ? "Item updated" : "Item added" });
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleEditInventory = (item) => {
    setNewItem({ name: item.name, quantity: item.quantity, category: item.category });
    setEditingInventoryId(item.id);
    setIsAddingInventory(true);
  };

  const handleDeleteInventory = async (itemId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${API_URL}/api/technicians/inventory/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (!response.ok) throw new Error('Failed to delete item');
      fetchDashboardData();
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleReviewResponse = async (reviewId, response) => {
    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${API_URL}/api/technicians/reviews/${reviewId}/respond`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ response })
      });
      if (!res.ok) throw new Error('Failed to save response');
      toast({ title: "Response Saved", description: "Your response to the review has been saved." });
      fetchDashboardData();
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const { stats, activeJobs, activeBids } = data || { stats: {}, activeJobs: [], activeBids: [] };

  if (error && !data) {
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
              supabase.auth.signOut();
              navigate('/login');
            }} className="bg-white text-black hover:bg-gray-100">
              Login Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-['Inter']">
      <SEO
        title="Technician Dashboard - TechCare"
        description="Manage your repair jobs, bids, and earnings as a TechCare technician."
      />

      {loading && !data ? (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
            <p className="text-zinc-400">Loading dashboard data...</p>
          </div>
        </div>
      ) : null}

      <div className="fixed inset-0 bg-black pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <Badge className="mb-2 bg-zinc-800 text-zinc-300 border-zinc-700">
              <Sparkles className="w-3 h-3 mr-1" />
              Technician
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-['Outfit'] font-bold tracking-tight text-white">Technician Dashboard</h1>
            <p className="text-zinc-400 mt-1">
              Welcome back, {user?.user_metadata?.name || user?.name || 'Technician'}! Here's your business overview.
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-white">
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-black" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-zinc-900 border-zinc-800 p-0 text-white" align="end">
                <div className="p-4 border-b border-zinc-800">
                  <h4 className="font-semibold">Notifications</h4>
                </div>
                <ScrollArea className="h-64">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-zinc-500 text-sm">No new notifications</div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className={`p-4 border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors ${notif.unread ? 'bg-zinc-800/30' : ''}`}>
                        <h5 className="font-medium text-sm mb-1">{notif.title}</h5>
                        <p className="text-xs text-zinc-400 mb-1">{notif.message}</p>
                        <span className="text-[10px] text-zinc-500">{notif.time}</span>
                      </div>
                    ))
                  )}
                </ScrollArea>
                <div className="p-2 border-t border-zinc-800">
                  <Button variant="ghost" size="sm" className="w-full text-xs text-zinc-400 hover:text-white" onClick={() => {
                    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                    setUnreadCount(0);
                  }}>
                    Mark all as read
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              onClick={() => navigate('/chat')}
              className="bg-zinc-800 text-white hover:bg-zinc-700 font-semibold py-6 px-8 rounded-full shadow-lg transition-all duration-300"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Messages
            </Button>
            <Button
              onClick={() => setActiveTab('marketplace')}
              className="bg-white text-black hover:bg-gray-100 font-semibold py-6 px-8 rounded-full shadow-lg transition-all duration-300"
            >
              <Briefcase className="mr-2 h-5 w-5" />
              Browse Jobs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {(!profileData.shopName || !profileData.district) && (
          <div className="mb-8 bg-amber-500/10 border border-amber-500/50 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-amber-500 font-bold font-['Outfit']">Complete Your Profile</h3>
              <p className="text-zinc-400 text-sm mt-1">
                Your profile is missing critical details (Shop Name, District). Customers won't be able to find you until you update your settings.
              </p>
              <Button
                variant="link"
                className="text-amber-500 p-0 h-auto font-semibold mt-2"
                onClick={() => setActiveTab('profile')}
              >
                Update Profile →
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Wallet className="h-8 w-8 opacity-80" />
                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">Total</Badge>
              </div>
              <div className="text-3xl font-['Outfit'] font-bold mb-1">
                <CurrencyDisplay amount={stats?.totalEarnings || 0} decimals={0} />
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
                <CurrencyDisplay amount={stats?.todayEarnings || 0} decimals={0} />
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
              <div className="text-3xl font-['Outfit'] font-bold mb-1">{stats?.completedJobs || 0}</div>
              <div className="text-sm opacity-90">Total Jobs Done</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-600 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Star className="h-8 w-8 opacity-80" />
                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">Rating</Badge>
              </div>
              <div className="text-3xl font-['Outfit'] font-bold mb-1">{stats?.rating || '0.0'}</div>
              <div className="text-sm opacity-90">{stats?.reviewCount || 0} Reviews</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="flex flex-wrap h-auto p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
            <TabsTrigger value="overview" className="flex-1 py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Overview</TabsTrigger>
            <TabsTrigger value="jobs" className="flex-1 py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Active Jobs</TabsTrigger>
            <TabsTrigger value="marketplace" onClick={fetchAvailableJobs} className="flex-1 py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Find Jobs</TabsTrigger>
            <TabsTrigger value="services" className="flex-1 py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">My Services</TabsTrigger>
            <TabsTrigger value="pricing" className="flex-1 py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Pricing</TabsTrigger>
            <TabsTrigger value="bids" className="flex-1 py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Bids</TabsTrigger>
            <TabsTrigger value="inventory" className="flex-1 py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Inventory</TabsTrigger>
            <TabsTrigger value="earnings" className="flex-1 py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Earnings</TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1 py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Reviews</TabsTrigger>
            <TabsTrigger value="profile" className="flex-1 py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Shop Profile</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Availability & Settings</TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Analytics</TabsTrigger>
          </TabsList>


          <TabsContent value="jobs">
            {/* ... existing jobs content ... */}
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
                        <div className="mt-2 text-xs flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/chat/${job._id || job.id}`)}
                            className="h-7 border-zinc-700 text-white hover:bg-zinc-800"
                          >
                            <User className="mr-1 h-3 w-3" />
                            Chat
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => { setSelectedJob(job); setShowJobModal(true); }}
                            className="h-7 border-zinc-700 text-white hover:bg-zinc-800"
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                      <Badge variant={getStatusBadgeVariant(job.status)}>{job.status}</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketplace">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg font-['Outfit'] font-bold text-white">Job Marketplace</CardTitle>
                <p className="text-sm text-zinc-500">Pick up new jobs in your area</p>
              </CardHeader>
              <CardContent>
                {checkingJobs ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-white mb-4" />
                    <p className="text-zinc-400">Finding opportunities...</p>
                  </div>
                ) : availableJobs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Briefcase className="h-16 w-16 text-zinc-700 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Available Jobs</h3>
                    <p className="text-zinc-500 max-w-sm">Check back later or expand your service area to find new repair requests.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {availableJobs.map((job) => (
                      <Card key={job._id || job.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all group">
                        <CardHeader>
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className="border-zinc-700 text-zinc-400">{job.device?.type || 'Device'}</Badge>
                            <span className="text-xs text-zinc-500 flex items-center gap-1">
                              <ClockIcon className="h-3 w-3" /> {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <CardTitle className="text-xl group-hover:text-emerald-400 transition-colors text-white">
                            {job.device?.brand} {job.device?.model}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1 text-sm text-zinc-400">
                            <MapPin className="h-3 w-3" /> {job.customer?.location || 'Standard Service Area'}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="p-3 bg-black/30 rounded-lg border border-zinc-800/50">
                            <p className="text-sm text-zinc-300 line-clamp-3 italic">"{job.issue?.description}"</p>
                          </div>
                          <div className="flex justify-between items-center pt-2">
                            <div className="space-y-1">
                              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Estimated Budget</p>
                              <div className="text-2xl font-bold text-white">
                                <CurrencyDisplay amount={job.estimatedCost || 0} decimals={0} />
                              </div>
                            </div>
                            <Button
                              onClick={() => {
                                setSelectedJob(job);
                                setBidAmount(job.estimatedCost?.toString() || '');
                                setShowBidModal(true);
                              }}
                              className="bg-white text-black hover:bg-emerald-500 hover:text-white transition-all rounded-full px-6"
                            >
                              Submit Bid
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Dialog open={showBidModal} onOpenChange={setShowBidModal}>
              <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Submit Your Proposal</DialogTitle>
                  <p className="text-zinc-400">
                    Provide your best price and timeline for {selectedJob?.device?.brand} {selectedJob?.device?.model}
                  </p>
                </DialogHeader>
                <form onSubmit={handleBidSubmit} className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-zinc-300">Bid Amount (LKR)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                          id="amount"
                          type="number"
                          required
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          className="bg-black border-zinc-700 pl-10"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-zinc-300">Duration (Hours)</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                          id="duration"
                          type="number"
                          required
                          value={estimatedDuration}
                          onChange={(e) => setEstimatedDuration(e.target.value)}
                          className="bg-black border-zinc-700 pl-10"
                          placeholder="e.g. 2"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-zinc-300">Message to Customer</Label>
                    <Textarea
                      id="message"
                      value={bidMessage}
                      onChange={(e) => setBidMessage(e.target.value)}
                      placeholder="Explain why you're the best fit for this job..."
                      className="bg-black border-zinc-700 min-h-[100px]"
                    />
                  </div>
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowBidModal(false)}
                      className="text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-white text-black hover:bg-emerald-500 hover:text-white transition-all px-8"
                      disabled={submittingBid}
                    >
                      {submittingBid ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                      Send Proposal
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="bids">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg font-['Outfit'] font-bold text-white">My Active Bids</CardTitle>
                <p className="text-sm text-zinc-500">Track and manage your project proposals</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeBids.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500">
                    <Gavel className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No active bids. Start bidding on jobs to grow your business!</p>
                    <Button
                      variant="link"
                      onClick={() => navigate('/bidding')}
                      className="mt-2 text-white hover:text-zinc-300"
                    >
                      Find Jobs <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  activeBids.map((bid) => (
                    <div key={bid._id} className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                      <div className="flex-1">
                        <h4 className="font-['Outfit'] font-semibold text-white">{bid.booking?.device?.brand} {bid.booking?.device?.model}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-zinc-400">
                          <span>Customer: {bid.booking?.customer?.name}</span>
                          <span>{formatTimeAgo(bid.createdAt)}</span>
                          <Badge variant="outline" className="text-[10px] h-4">
                            {bid.status || 'Pending'}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-['Outfit'] font-bold text-white">
                          <CurrencyDisplay amount={bid.amount} decimals={0} />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          onClick={() => handleWithdrawBid(bid._id || bid.id)}
                        >
                          Withdraw
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-zinc-900 border-zinc-800 p-6">
                  <div className="text-sm text-zinc-400 mb-1">Available for Payout</div>
                  <div className="text-3xl font-bold text-white">
                    <CurrencyDisplay amount={stats?.availableBalance || 0} decimals={0} />
                  </div>
                  <Button
                    className="w-full mt-4 bg-white text-black hover:bg-zinc-200"
                    onClick={() => {
                      if (profileData.payoutDetails?.details) {
                        setWithdrawDetails(profileData.payoutDetails.details);
                        setWithdrawMethod(profileData.payoutDetails.method || 'Bank Transfer');
                      }
                      setShowWithdrawModal(true);
                    }}
                  >
                    Withdraw Funds
                  </Button>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800 p-6">
                  <div className="text-sm text-zinc-400 mb-1">Total Earned</div>
                  <div className="text-3xl font-bold text-zinc-400">
                    <CurrencyDisplay amount={stats?.totalEarnings || 0} decimals={0} />
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">Lifetime revenue through TechCare</p>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800 p-6">
                  <div className="text-sm text-zinc-400 mb-1">Monthly Goal</div>
                  <div className="text-3xl font-bold text-white">
                    {Math.min(100, Math.round(((stats?.totalEarnings || 0) / 100000) * 100))}%
                  </div>
                  <Progress value={Math.min(100, ((stats?.totalEarnings || 0) / 100000) * 100)} className="mt-4 h-2 bg-zinc-800" />
                </Card>
              </div>

              <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Withdraw Funds</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Amount (LKR)</Label>
                      <Input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        className="bg-black border-zinc-700"
                      />
                      <p className="text-xs text-zinc-500">Available: <CurrencyDisplay amount={stats?.availableBalance || 0} /></p>
                    </div>
                    <div className="space-y-2">
                      <Label>Payout Method</Label>
                      <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                        <SelectTrigger className="bg-black border-zinc-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          <SelectItem value="Mobile Wallet">Mobile Wallet (mCash/EzCash)</SelectItem>
                          <SelectItem value="PayPal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Account Details</Label>
                      <Textarea
                        value={withdrawDetails}
                        onChange={(e) => setWithdrawDetails(e.target.value)}
                        placeholder="Bank name, Account number, Branch..."
                        className="bg-black border-zinc-700"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setShowWithdrawModal(false)}>Cancel</Button>
                    <Button
                      className="bg-white text-black hover:bg-zinc-200"
                      onClick={handleWithdraw}
                      disabled={saving || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Banknote className="h-4 w-4 mr-2" />}
                      Request Payout
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-lg font-['Outfit'] font-bold text-white">Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentTransactions.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500">
                      <Wallet className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>No transactions found</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {recentTransactions.map((tx) => (
                        <div key={tx._id} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-full">
                              <ArrowRight className="h-4 w-4 text-emerald-500 rotate-[-45deg]" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{tx.description || 'Repair Job Payment'}</div>
                              <div className="text-xs text-zinc-500">{formatDate(tx.createdAt)}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-emerald-500">
                              +<CurrencyDisplay amount={tx.amount} decimals={0} />
                            </div>
                            <div className="text-[10px] text-zinc-500 uppercase">{tx.status || 'Completed'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg font-['Outfit'] font-bold text-white">Shop Profile Settings</CardTitle>
                <p className="text-sm text-zinc-500">Customize how you appear to customers</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Shop Name</label>
                        <Input
                          value={profileData.shopName}
                          onChange={(e) => setProfileData({ ...profileData, shopName: e.target.value })}
                          className="bg-black border-zinc-700 text-white"
                          placeholder="e.g. QuickFix Mobile Solutions"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Professional Bio</label>
                        <Textarea
                          value={profileData.description}
                          onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                          className="bg-black border-zinc-700 text-white min-h-[120px]"
                          placeholder="Tell customers about your experience and why they should choose you..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Service Area (District)</label>
                        <Select
                          value={profileData.district}
                          onValueChange={(v) => setProfileData({ ...profileData, district: v })}
                        >
                          <SelectTrigger className="bg-black border-zinc-700 text-white">
                            <SelectValue placeholder="Select District" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            {districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Hourly Rate (LKR)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">Rs.</span>
                          <Input
                            type="number"
                            value={profileData.hourlyRate || ''}
                            onChange={(e) => setProfileData({ ...profileData, hourlyRate: e.target.value })}
                            className="bg-black border-zinc-700 text-white pl-10"
                            placeholder="3500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Shop Logo</label>
                        <ImageUpload
                          value={profileData.logoUrl}
                          onChange={(url) => setProfileData({ ...profileData, logoUrl: url })}
                          className="h-32 w-32 rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Cover Image</label>
                        <ImageUpload
                          value={profileData.coverUrl}
                          onChange={(url) => setProfileData({ ...profileData, coverUrl: url })}
                          className="w-full h-32 rounded-xl"
                        />
                      </div>

                      <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-800 space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className={`h-5 w-5 ${profileData.verified ? 'text-emerald-500' : 'text-zinc-500'}`} />
                            <span className="text-sm font-medium text-white">Verification Status</span>
                          </div>
                          <Badge variant={profileData.verified ? 'default' : 'secondary'} className={profileData.verified ? 'bg-emerald-500 text-white' : ''}>
                            {profileData.verified ? 'Verified' : 'Unverified'}
                          </Badge>
                        </div>
                        {!profileData.verified && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full text-xs border-zinc-700 text-white hover:bg-zinc-800"
                            onClick={handleRequestVerification}
                            disabled={saving}
                          >
                            {saving ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <ShieldAlert className="h-3 w-3 mr-2" />}
                            Request Verification
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t border-zinc-800">
                    <Button type="button" variant="ghost" onClick={() => navigate('/')}>Cancel</Button>
                    <Button type="submit" className="bg-white text-black hover:bg-gray-100 px-8" disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Profile
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-['Outfit'] font-bold text-white">My Services (Gigs)</CardTitle>
                  <p className="text-sm text-zinc-500">Manage the services you offer to customers</p>
                </div>
                <Button onClick={() => { setCurrentGig({ id: null, title: '', description: '', price: '', image: '', duration: '1' }); setShowGigModal(true); }} size="sm" className="bg-white text-black hover:bg-zinc-200">
                  <Plus className="h-4 w-4 mr-2" /> Add Service
                </Button>
              </CardHeader>
              <CardContent>
                {gigs.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500">
                    <Briefcase className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No services listed. Add a service to start getting bookings!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gigs.map((gig) => (
                      <div key={gig.id} className="group relative bg-zinc-800/50 rounded-xl border border-zinc-700 overflow-hidden hover:border-zinc-500 transition-all">
                        <div className="aspect-video bg-zinc-800 relative">
                          {gig.image ? (
                            <img src={gig.image} alt={gig.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600">
                              <Wrench className="h-12 w-12" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 text-black hover:bg-white" onClick={() => { setCurrentGig(gig); setShowGigModal(true); }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeleteGig(gig.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-white text-lg mb-1">{gig.title}</h3>
                          <p className="text-zinc-400 text-sm line-clamp-2 mb-3">{gig.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-emerald-400 font-bold"><CurrencyDisplay amount={gig.price} /></span>
                            <span className="text-xs text-zinc-500 flex items-center gap-1"><ClockIcon className="h-3 w-3" /> {gig.duration}h</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Dialog open={showGigModal} onOpenChange={setShowGigModal}>
              <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                <DialogHeader>
                  <DialogTitle>{currentGig.id ? 'Edit Service Gig' : 'Create New Service Gig'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Service Title</Label>
                    <Input
                      value={currentGig.title}
                      onChange={(e) => setCurrentGig({ ...currentGig, title: e.target.value })}
                      placeholder="e.g. iPhone Screen Replacement"
                      className="bg-black border-zinc-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={currentGig.description}
                      onChange={(e) => setCurrentGig({ ...currentGig, description: e.target.value })}
                      placeholder="Describe what's included..."
                      className="bg-black border-zinc-700"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Price (LKR)</Label>
                      <Input
                        type="number"
                        value={currentGig.price}
                        onChange={(e) => setCurrentGig({ ...currentGig, price: e.target.value })}
                        className="bg-black border-zinc-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration (Hours)</Label>
                      <Input
                        type="number"
                        value={currentGig.duration}
                        onChange={(e) => setCurrentGig({ ...currentGig, duration: e.target.value })}
                        className="bg-black border-zinc-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Cover Image</Label>
                    <ImageUpload
                      value={currentGig.image}
                      onChange={(url) => setCurrentGig({ ...currentGig, image: url })}
                      className="w-full h-40"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setShowGigModal(false)}>Cancel</Button>
                  <Button onClick={handleSaveGig} disabled={saving} className="bg-white text-black hover:bg-zinc-200">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Gig
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="pricing">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg font-['Outfit'] font-bold text-white">Specific Pricing</CardTitle>
                <p className="text-sm text-zinc-500">Set custom prices for specific devices and repairs</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-end bg-zinc-800/30 p-4 rounded-xl border border-zinc-800">
                  <div className="w-full md:w-1/4 space-y-2">
                    <Label>Service Type</Label>
                    <Select value={pricingForm.service} onValueChange={(v) => setPricingForm({ ...pricingForm, service: v })}>
                      <SelectTrigger className="bg-black border-zinc-700 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="screen">Screen Repair</SelectItem>
                        <SelectItem value="battery">Battery Replacement</SelectItem>
                        <SelectItem value="water-damage">Water Damage</SelectItem>
                        <SelectItem value="general">General Repair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full md:w-1/4 space-y-2">
                    <Label>Brand</Label>
                    <Input placeholder="Apple" value={pricingForm.brand} onChange={(e) => setPricingForm({ ...pricingForm, brand: e.target.value })} className="bg-black border-zinc-700 text-white" />
                  </div>
                  <div className="w-full md:w-1/4 space-y-2">
                    <Label>Model</Label>
                    <Input placeholder="iPhone 13" value={pricingForm.model} onChange={(e) => setPricingForm({ ...pricingForm, model: e.target.value })} className="bg-black border-zinc-700 text-white" />
                  </div>
                  <div className="w-full md:w-1/4 space-y-2">
                    <Label>Price (LKR)</Label>
                    <Input type="number" placeholder="15000" value={pricingForm.price} onChange={(e) => setPricingForm({ ...pricingForm, price: e.target.value })} className="bg-black border-zinc-700 text-white" />
                  </div>
                  <Button onClick={handleAddPricing} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white"><Plus className="h-4 w-4" /></Button>
                </div>

                <div className="rounded-xl border border-zinc-800 overflow-hidden">
                  <div className="p-3 bg-zinc-800/50 flex text-sm font-medium text-zinc-400">
                    <div className="flex-1">Service</div>
                    <div className="flex-1">Brand</div>
                    <div className="flex-1">Model</div>
                    <div className="flex-1">Price</div>
                    <div className="w-10"></div>
                  </div>
                  {(!profileData.services || profileData.services.length === 0) ? (
                    <div className="p-8 text-center text-zinc-500">No specific pricing added yet.</div>
                  ) : (
                    (profileData.services || []).map((item) => (
                      <div key={item.id} className="p-3 border-t border-zinc-800 flex items-center text-sm text-white hover:bg-zinc-800/30">
                        <div className="flex-1 capitalize">{item.service}</div>
                        <div className="flex-1">{item.brand}</div>
                        <div className="flex-1">{item.model}</div>
                        <div className="flex-1 text-emerald-400 font-bold"><CurrencyDisplay amount={item.price} /></div>
                        <div className="w-10 text-right">
                          <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400 hover:bg-red-900/20" onClick={() => handleDeletePricing(item.id)}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-['Outfit'] font-bold text-white">Tools & Parts Inventory</CardTitle>
                  <p className="text-sm text-zinc-500">Track your available repair components</p>
                </div>
                <Button onClick={() => { setIsAddingInventory(true); setEditingInventoryId(null); setNewItem({ name: '', quantity: '', category: 'Part' }); }} size="sm" className="bg-white text-black hover:bg-zinc-200">
                  <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
              </CardHeader>
              <CardContent>
                {isAddingInventory && (
                  <div className="mb-6 p-4 bg-zinc-800 rounded-xl border border-zinc-700 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input
                        placeholder="Item Name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        className="bg-black border-zinc-700"
                      />
                      <Input
                        placeholder="Quantity"
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                        className="bg-black border-zinc-700"
                      />
                      <Select
                        value={newItem.category}
                        onValueChange={(v) => setNewItem({ ...newItem, category: v })}
                      >
                        <SelectTrigger className="bg-black border-zinc-700">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                          <SelectItem value="Part">Part</SelectItem>
                          <SelectItem value="Tool">Tool</SelectItem>
                          <SelectItem value="Accessory">Accessory</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => setIsAddingInventory(false)}>Cancel</Button>
                      <Button onClick={handleAddInventory} disabled={saving}>{editingInventoryId ? 'Update' : 'Add to List'}</Button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inventory.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-zinc-500">
                      <p>No inventory items added yet.</p>
                    </div>
                  ) : (
                    inventory.map((item) => (
                      <div key={item.id} className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-white">{item.name}</h4>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-[10px] h-4">{item.category}</Badge>
                            <span className="text-xs text-zinc-400">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEditInventory(item)} className="text-zinc-500 hover:text-white">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteInventory(item.id)} className="text-zinc-500 hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg font-['Outfit'] font-bold text-white">Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500">
                    <Star className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No reviews yet. Complete more jobs to get feedback!</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden">
                            {review.customer?.profile_image ? (
                              <img src={review.customer.profile_image} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-full h-full p-2 text-zinc-500" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{review.customer?.name}</h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-600'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-zinc-500">{formatDate(review.created_at)}</span>
                      </div>
                      <p className="text-sm text-zinc-300">{review.comment}</p>

                      {review.technician_response ? (
                        <div className="ml-6 p-3 bg-zinc-900/50 rounded-lg border-l-2 border-emerald-500">
                          <p className="text-xs font-semibold text-emerald-500 mb-1">Your Response</p>
                          <p className="text-xs text-zinc-400">{review.technician_response}</p>
                        </div>
                      ) : (
                        <div className="pt-2">
                          <Textarea
                            placeholder="Write a response..."
                            className="bg-black border-zinc-700 min-h-[60px] text-xs"
                            onBlur={(e) => {
                              if (e.target.value) handleReviewResponse(review.id, e.target.value);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            {selectedJob ? (
              <Card className="bg-zinc-900 border-zinc-800 animate-in fade-in slide-in-from-right-4">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedJob(null)} className="mb-2 -ml-2 text-zinc-400">
                      <ArrowRight className="h-4 w-4 mr-2 rotate-180" /> Back to List
                    </Button>
                    <CardTitle className="text-xl font-['Outfit'] font-bold text-white">
                      Job Details: {selectedJob.device?.brand} {selectedJob.device?.model}
                    </CardTitle>
                  </div>
                  <Badge variant={getStatusBadgeVariant(selectedJob.status)} className="h-6">{selectedJob.status}</Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-zinc-500 uppercase font-bold">Customer Information</label>
                        <div className="mt-2 space-y-2">
                          <p className="flex items-center gap-2 text-white"><User className="h-4 w-4 text-zinc-400" /> {selectedJob.customer?.name}</p>
                          <p className="flex items-center gap-2 text-white"><Smartphone className="h-4 w-4 text-zinc-400" /> {selectedJob.customer?.phone || 'No phone provided'}</p>
                          <p className="flex items-center gap-2 text-white"><Star className="h-4 w-4 text-zinc-400" /> Customer Email: {selectedJob.customer?.email}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 uppercase font-bold">Device & Issue</label>
                        <div className="mt-2 p-3 bg-black/30 rounded-lg border border-zinc-800">
                          <p className="text-sm text-zinc-300">{selectedJob.issue_description || 'No description provided'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-zinc-500 uppercase font-bold">Actions</label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate(`/chat/${selectedJob.id}`)}>
                            Chat with Customer
                          </Button>
                          <Select
                            value={selectedJob.status}
                            onValueChange={(v) => handleStatusUpdate(selectedJob.id, v)}
                          >
                            <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700 text-white">
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                              <SelectItem value="diagnosing">Diagnosing</SelectItem>
                              <SelectItem value="waiting_for_parts">Waiting Parts</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 uppercase font-bold">Job Location</label>
                        <p className="mt-2 text-sm text-zinc-300 flex items-center gap-2">
                          <Activity className="h-4 w-4 text-zinc-400" /> {selectedJob.address || 'Standard Pickup/Delivery'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
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
                      <div key={job.id} className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-zinc-500 transition-colors cursor-pointer" onClick={() => setSelectedJob(job)}>
                        <div className="flex-1">
                          <h4 className="font-['Outfit'] font-semibold text-white">{job.device?.brand} {job.device?.model}</h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-zinc-400">
                            <span>Customer: {job.customer?.name}</span>
                            <span>Date: {formatDate(job.scheduled_date)}</span>
                            <Badge variant={getStatusBadgeVariant(job.status)} className="h-5 text-[10px]">{job.status}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-['Outfit'] font-bold text-white">
                            <CurrencyDisplay amount={job.estimated_cost || job.price} decimals={0} />
                          </div>
                          <Button variant="ghost" size="sm" className="mt-1 h-6 text-xs text-blue-400 hover:text-blue-300">
                            Details <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg font-['Outfit'] font-bold text-white">Availability & Work Hours</CardTitle>
                <p className="text-sm text-zinc-500">Set your weekly recurring work hours</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                      <span className="font-medium text-white">{day}</span>
                      <div className="flex items-center gap-3">
                        <Select
                          value={profileData.availability?.[day]?.start || "09:00"}
                          onValueChange={(v) => setProfileData({
                            ...profileData,
                            availability: {
                              ...profileData.availability,
                              [day]: { ...profileData.availability?.[day], start: v }
                            }
                          })}
                        >
                          <SelectTrigger className="w-24 bg-black border-zinc-700 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800">
                            {Array.from({ length: 24 }).map((_, i) => {
                              const hour = i.toString().padStart(2, '0') + ':00';
                              return <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                            })}
                          </SelectContent>
                        </Select>
                        <span className="text-zinc-500">-</span>
                        <Select
                          value={profileData.availability?.[day]?.end || "18:00"}
                          onValueChange={(v) => setProfileData({
                            ...profileData,
                            availability: {
                              ...profileData.availability,
                              [day]: { ...profileData.availability?.[day], end: v }
                            }
                          })}
                        >
                          <SelectTrigger className="w-24 bg-black border-zinc-700 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800">
                            {Array.from({ length: 24 }).map((_, i) => {
                              const hour = i.toString().padStart(2, '0') + ':00';
                              return <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleAvailabilityUpdate}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Availability
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-['Outfit'] font-bold text-white">Default Payout Method</CardTitle>
                <p className="text-sm text-zinc-500">Save your bank details for faster withdrawals</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select
                      value={profileData.payoutDetails?.method || 'Bank Transfer'}
                      onValueChange={(v) => setProfileData({
                        ...profileData,
                        payoutDetails: { ...profileData.payoutDetails, method: v }
                      })}
                    >
                      <SelectTrigger className="bg-black border-zinc-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Mobile Wallet">Mobile Wallet</SelectItem>
                        <SelectItem value="PayPal">PayPal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Account Details</Label>
                    <Input
                      placeholder="Bank Name, Account Number, Branch"
                      value={profileData.payoutDetails?.details || ''}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        payoutDetails: { ...profileData.payoutDetails, details: e.target.value }
                      })}
                      className="bg-black border-zinc-700"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    className="bg-white text-black hover:bg-zinc-200"
                    onClick={handleSavePayoutSettings}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Payout Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-950/20 border-red-900/50 mt-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-red-500" />
                  <CardTitle className="text-lg font-['Outfit'] font-bold text-red-500">Danger Zone</CardTitle>
                </div>
                <p className="text-sm text-red-400/70">Irreversible account actions</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-red-950/30 rounded-lg border border-red-900/30">
                  <div>
                    <h4 className="font-semibold text-white">Delete Technician Account</h4>
                    <p className="text-sm text-zinc-400 mt-1">
                      Permanently remove your account, profile, gigs, and all data. This action cannot be undone.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    className="shrink-0 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg font-['Outfit'] font-bold text-white">Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <h4 className="font-['Outfit'] font-semibold text-white">Revenue Growth</h4>
                    <EarningsChart
                      data={recentTransactions.map(tx => ({
                        date: tx.completed_date,
                        amount: tx.price || 0,
                        label: new Date(tx.completed_date).toLocaleDateString('en-US', { weekday: 'short' })
                      }))}
                    />
                  </div>
                  <div className="space-y-6">
                    <h4 className="font-['Outfit'] font-semibold text-white">Job Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-black/30 border-zinc-800 p-4">
                        <div className="text-zinc-500 text-xs mb-1 uppercase tracking-wider">Completion Rate</div>
                        <div className="text-2xl font-bold text-white">{stats?.completionRate || 0}%</div>
                        <Progress value={stats?.completionRate || 0} className="h-1 mt-2 bg-zinc-800" />
                      </Card>
                      <Card className="bg-black/30 border-zinc-800 p-4">
                        <div className="text-zinc-500 text-xs mb-1 uppercase tracking-wider">Avg Response</div>
                        <div className="text-2xl font-bold text-white">{stats?.responseTime || 'N/A'}</div>
                      </Card>
                    </div>
                    <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-800">
                      <h4 className="text-sm font-semibold text-white mb-4">Rating Summary</h4>
                      <div className="flex items-center gap-4">
                        <div className="text-5xl font-bold text-white">{stats?.rating || '0.0'}</div>
                        <div className="flex-1">
                          <div className="flex text-yellow-500 mb-1">
                            {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(stats?.rating || 0) ? 'fill-current' : ''}`} />)}
                          </div>
                          <p className="text-xs text-zinc-400">Based on {stats?.reviewCount || 0} customer reviews</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs >
      </main >
    </div >
  );
};

export default TechnicianDashboard;

