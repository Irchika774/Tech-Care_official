import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Wallet, TrendingUp, CheckCircle, Star, Briefcase, Gavel, Smartphone, Monitor, Tablet } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const stats = {
    totalEarnings: 12450,
    monthlyEarnings: 3200,
    completedJobs: 89,
    activeJobs: 5,
    rating: 4.8,
    reviews: 67,
    responseTime: '< 2 hours',
    acceptanceRate: 92
  };

  const recentJobs = [
    {
      id: 1,
      title: "iPhone 14 Screen Replacement",
      customer: "John Doe",
      status: "completed",
      amount: 180,
      date: "2025-11-03",
      rating: 5
    },
    {
      id: 2,
      title: "Samsung Galaxy Battery Fix",
      customer: "Sarah Chen",
      status: "in-progress",
      amount: 120,
      date: "2025-11-05",
      rating: null
    },
    {
      id: 3,
      title: "Gaming PC Diagnosis",
      customer: "Mike Thompson",
      status: "scheduled",
      amount: 350,
      date: "2025-11-06",
      rating: null
    }
  ];

  const earningsData = [
    { month: 'Jun', amount: 2800 },
    { month: 'Jul', amount: 3100 },
    { month: 'Aug', amount: 2900 },
    { month: 'Sep', amount: 3400 },
    { month: 'Oct', amount: 3600 },
    { month: 'Nov', amount: 3200 }
  ];

  const pendingBids = [
    {
      id: 1,
      jobTitle: "iPad Pro Screen Repair",
      bidAmount: 200,
      customer: "Emily White",
      postedDate: "2 hours ago",
      budget: "$150 - $250"
    },
    {
      id: 2,
      jobTitle: "Laptop Won't Charge",
      bidAmount: 150,
      customer: "David Lee",
      postedDate: "5 hours ago",
      budget: "$100 - $200"
    }
  ];

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'scheduled':
        return 'outline';
      default:
        return 'secondary';
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
              <div className="text-3xl font-bold mb-1">${stats.totalEarnings.toLocaleString()}</div>
              <div className="text-sm opacity-90">Total Earnings</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 opacity-80" />
                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">This Month</Badge>
              </div>
              <div className="text-3xl font-bold mb-1">${stats.monthlyEarnings.toLocaleString()}</div>
              <div className="text-sm opacity-90">Monthly Earnings</div>
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
              <div className="text-sm opacity-90">{stats.reviews} Reviews</div>
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
                    <span className="font-semibold">{stats.responseTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Acceptance Rate</span>
                    <span className="font-semibold">{stats.acceptanceRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Active Jobs</span>
                    <span className="font-semibold text-blue-500">{stats.activeJobs}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-semibold text-green-500">98%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <div className="font-medium">Job Completed</div>
                      <div className="text-sm text-muted-foreground">
                        iPhone 14 Screen Replacement
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">2h ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Gavel className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <div className="font-medium">Bid Accepted</div>
                      <div className="text-sm text-muted-foreground">
                        Gaming PC Diagnosis
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">5h ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <div className="flex-1">
                      <div className="font-medium">New Review</div>
                      <div className="text-sm text-muted-foreground">
                        5 stars from John Doe
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">1d ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Bids */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Pending Bids</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingBids.map((bid) => (
                  <div key={bid.id} className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{bid.jobTitle}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>Customer: {bid.customer}</span>
                        <span>Budget: {bid.budget}</span>
                        <span>{bid.postedDate}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">${bid.bidAmount}</div>
                      <div className="text-xs text-muted-foreground">Your Bid</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Recent Jobs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{job.title}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>Customer: {job.customer}</span>
                        <span>Date: {job.date}</span>
                        <Badge variant={getStatusBadgeVariant(job.status)}>
                          {job.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">${job.amount}</div>
                      {job.rating && (
                        <div className="flex items-center gap-1 mt-1 justify-end">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm">{job.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            {/* Monthly Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Monthly Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-64 gap-2">
                  {earningsData.map((data) => (
                    <div key={data.month} className="flex-1 flex flex-col items-center group">
                      <div
                        className="w-full bg-primary rounded-t transition-all group-hover:bg-primary/80"
                        style={{ height: `${(data.amount / 4000) * 100}%` }}
                      ></div>
                      <div className="text-xs mt-2 text-muted-foreground">
                        {data.month}
                      </div>
                      <div className="text-xs font-semibold">${data.amount}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Earnings Breakdown */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">This Week</div>
                  <div className="text-2xl font-bold text-green-500">$780</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">This Month</div>
                  <div className="text-2xl font-bold text-blue-500">${stats.monthlyEarnings}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">This Year</div>
                  <div className="text-2xl font-bold text-purple-500">${stats.totalEarnings}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bids Tab */}
          <TabsContent value="bids">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold">My Bids</CardTitle>
                <Button
                  onClick={() => navigate('/bidding')}
                  variant="outline"
                >
                  Browse More Jobs
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingBids.map((bid) => (
                  <div key={bid.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{bid.jobTitle}</h4>
                        <p className="text-sm text-muted-foreground">
                          Customer: {bid.customer} • Posted {bid.postedDate}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200">
                        Pending
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-sm text-muted-foreground">
                        Budget: {bid.budget}
                      </div>
                      <div className="text-xl font-bold text-primary">${bid.bidAmount}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
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
                          <span className="font-semibold">98%</span>
                        </div>
                        <Progress value={98} className="h-2" indicatorClassName="bg-green-500" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2 text-sm">
                          <span>Customer Satisfaction</span>
                          <span className="font-semibold">96%</span>
                        </div>
                        <Progress value={96} className="h-2" indicatorClassName="bg-blue-500" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2 text-sm">
                          <span>On-Time Delivery</span>
                          <span className="font-semibold">94%</span>
                        </div>
                        <Progress value={94} className="h-2" indicatorClassName="bg-purple-500" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2 text-sm">
                          <span>Bid Win Rate</span>
                          <span className="font-semibold">{stats.acceptanceRate}%</span>
                        </div>
                        <Progress value={stats.acceptanceRate} className="h-2" indicatorClassName="bg-yellow-500" />
                      </div>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div>
                    <h4 className="font-semibold mb-4">Jobs by Category</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-muted-foreground" />
                          <span>Mobile Devices</span>
                        </div>
                        <span className="font-semibold">45 jobs</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4 text-muted-foreground" />
                          <span>PC & Laptops</span>
                        </div>
                        <span className="font-semibold">32 jobs</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <Tablet className="h-4 w-4 text-muted-foreground" />
                          <span>Tablets</span>
                        </div>
                        <span className="font-semibold">12 jobs</span>
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
