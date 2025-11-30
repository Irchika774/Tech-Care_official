import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Wallet, TrendingUp, CheckCircle, Star, Briefcase, Gavel, Smartphone, Monitor, Tablet, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CurrencyDisplay from '../components/CurrencyDisplay';
import { formatDistanceToNow } from 'date-fns';

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/technicians/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

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
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Technician Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name || 'Technician'}! Here's your business overview.
            </p>
          </div>
          <Button
            onClick={() => navigate('/bidding')}
            className="shadow-lg"
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Browse Jobs
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Wallet className="h-8 w-8 opacity-80" />
                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">Total</Badge>
              </div>
              <div className="text-3xl font-bold mb-1">
                <CurrencyDisplay amount={stats.totalEarnings} decimals={0} />
              </div>
              <div className="text-sm opacity-90">Total Earnings</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 opacity-80" />
                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">Today</Badge>
              </div>
              <div className="text-3xl font-bold mb-1">
                <CurrencyDisplay amount={stats.todayEarnings} decimals={0} />
              </div>
              <div className="text-sm opacity-90">Today's Earnings</div>
            </CardContent>
          </Card>

          <Card className="bg-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="h-8 w-8 opacity-80" />
                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">Completed</Badge>
              </div>
              <div className="text-3xl font-bold mb-1">{stats.completedJobs}</div>
              <div className="text-sm opacity-90">Total Jobs Done</div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Star className="h-8 w-8 opacity-80" />
                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">Rating</Badge>
              </div>
              <div className="text-3xl font-bold mb-1">{stats.rating}</div>
              <div className="text-sm opacity-90">{stats.reviewCount} Reviews</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto p-1 bg-muted rounded-lg">
            <TabsTrigger value="overview" className="py-2">Overview</TabsTrigger>
            <TabsTrigger value="jobs" className="py-2">Jobs</TabsTrigger>
            <TabsTrigger value="bids" className="py-2">Bids</TabsTrigger>
            <TabsTrigger value="earnings" className="py-2">Earnings</TabsTrigger>
            <TabsTrigger value="analytics" className="py-2">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Response Time</span>
                    <span className="font-semibold">{stats.responseTime || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-semibold text-green-500">{stats.completionRate || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Active Jobs</span>
                    <span className="font-semibold text-blue-500">{stats.activeJobs}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Active Bids</span>
                    <span className="font-semibold text-yellow-500">{stats.activeBids}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Active Jobs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeJobs.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">No active jobs</div>
                  ) : (
                    activeJobs.map(job => (
                      <div key={job._id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div className="flex-1">
                          <div className="font-medium">{job.device?.brand} {job.device?.model}</div>
                          <div className="text-sm text-muted-foreground">
                            {job.customer?.name}
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Recent Bids</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeBids.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No active bids</div>
                ) : (
                  activeBids.map((bid) => (
                    <div key={bid._id} className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{bid.booking?.device?.brand} {bid.booking?.device?.model}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>Customer: {bid.booking?.customer?.name}</span>
                          <span>{formatTimeAgo(bid.createdAt)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">
                          <CurrencyDisplay amount={bid.amount} decimals={0} />
                        </div>
                        <div className="text-xs text-muted-foreground">Your Bid</div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Active Jobs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeJobs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No active jobs found</div>
                ) : (
                  activeJobs.map((job) => (
                    <div key={job._id} className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{job.device?.brand} {job.device?.model}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>Customer: {job.customer?.name}</span>
                          <span>Date: {formatDate(job.scheduledDate)}</span>
                          <Badge variant={getStatusBadgeVariant(job.status)}>
                            {job.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold">My Active Bids</CardTitle>
                <Button
                  onClick={() => navigate('/bidding')}
                  variant="outline"
                >
                  Browse More Jobs
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeBids.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No active bids found</div>
                ) : (
                  activeBids.map((bid) => (
                    <div key={bid._id} className="p-4 bg-muted rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{bid.booking?.device?.brand} {bid.booking?.device?.model}</h4>
                          <p className="text-sm text-muted-foreground">
                            Customer: {bid.booking?.customer?.name} • Posted {formatTimeAgo(bid.createdAt)}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200">
                          {bid.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <div className="text-sm text-muted-foreground">
                          Duration: {bid.estimatedDuration}h
                        </div>
                        <div className="text-xl font-bold text-primary">
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
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Today</div>
                  <div className="text-2xl font-bold text-green-500">
                    <CurrencyDisplay amount={stats.todayEarnings} decimals={0} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Available Balance</div>
                  <div className="text-2xl font-bold text-blue-500">
                    <CurrencyDisplay amount={stats.availableBalance} decimals={0} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Total Earnings</div>
                  <div className="text-2xl font-bold text-purple-500">
                    <CurrencyDisplay amount={stats.totalEarnings} decimals={0} />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="text-center text-muted-foreground py-8">
              Detailed earnings history chart coming soon...
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Job Statistics */}
                  <div className="space-y-6">
                    <h4 className="font-semibold">Job Statistics</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2 text-sm">
                          <span>Completion Rate</span>
                          <span className="font-semibold">{stats.completionRate || 0}%</span>
                        </div>
                        <Progress value={stats.completionRate || 0} className="h-2" indicatorClassName="bg-green-500" />
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
