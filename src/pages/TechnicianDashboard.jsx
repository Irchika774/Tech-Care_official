import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Wallet, TrendingUp, CheckCircle, Star, Briefcase, Gavel, Smartphone, Monitor, Tablet, Loader2, User, Sparkles, ArrowRight, Activity, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import CurrencyDisplay from '../components/CurrencyDisplay';
import { formatDistanceToNow } from 'date-fns';
import SEO from '../components/SEO';

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // Get the access token from Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          throw new Error('No authentication token available');
        }

        const response = await fetch(`${API_URL}/api/technicians/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Refresh data every 30 seconds for real-time updates
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
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
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
      case 'in-progress':
        return 'secondary';
      case 'scheduled':
        return 'outline';
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <Badge className="mb-2 bg-zinc-800 text-zinc-300 border-zinc-700">
              <Sparkles className="w-3 h-3 mr-1" />
              Technician
            </Badge>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
            <TabsTrigger value="overview" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Overview</TabsTrigger>
            <TabsTrigger value="jobs" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Jobs</TabsTrigger>
            <TabsTrigger value="bids" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Bids</TabsTrigger>
            <TabsTrigger value="earnings" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Earnings</TabsTrigger>
            <TabsTrigger value="analytics" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
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
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
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
                          <Badge variant={getStatusBadgeVariant(job.status)}>
                            {job.status.replace('_', ' ')}
                          </Badge>
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
          </TabsContent>

          {/* Bids Tab */}
          <TabsContent value="bids">
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
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
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
            <div className="text-center text-zinc-500 py-8">
              <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Detailed earnings history chart coming soon...</p>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TechnicianDashboard;
