import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TechnicianDashboard = () => {
  const navigate = useNavigate();
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

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        
        <main className="py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Technician Dashboard</h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
                Welcome back! Here's your business overview.
              </p>
            </div>
            <button
              onClick={() => navigate('/bidding')}
              className="bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-opacity-90 transition inline-flex items-center gap-2"
            >
              <span className="material-icons">work</span>
              Browse Jobs
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="material-icons text-3xl opacity-80">account_balance_wallet</span>
                <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">Total</span>
              </div>
              <div className="text-3xl font-bold mb-1">${stats.totalEarnings.toLocaleString()}</div>
              <div className="text-sm opacity-90">Total Earnings</div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="material-icons text-3xl opacity-80">trending_up</span>
                <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">This Month</span>
              </div>
              <div className="text-3xl font-bold mb-1">${stats.monthlyEarnings.toLocaleString()}</div>
              <div className="text-sm opacity-90">Monthly Earnings</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="material-icons text-3xl opacity-80">check_circle</span>
                <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">Completed</span>
              </div>
              <div className="text-3xl font-bold mb-1">{stats.completedJobs}</div>
              <div className="text-sm opacity-90">Total Jobs Done</div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="material-icons text-3xl opacity-80">star</span>
                <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">Rating</span>
              </div>
              <div className="text-3xl font-bold mb-1">{stats.rating}</div>
              <div className="text-sm opacity-90">{stats.reviews} Reviews</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md mb-6">
            <div className="border-b border-border-light dark:border-border-dark">
              <div className="flex overflow-x-auto">
                {['overview', 'jobs', 'bids', 'earnings', 'analytics'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 font-medium capitalize whitespace-nowrap transition ${
                      activeTab === tab
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-primary'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Performance Metrics */}
                  <div>
                    <h3 className="text-lg font-bold mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary-light dark:text-text-secondary-dark">Response Time</span>
                        <span className="font-semibold">{stats.responseTime}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary-light dark:text-text-secondary-dark">Acceptance Rate</span>
                        <span className="font-semibold">{stats.acceptanceRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary-light dark:text-text-secondary-dark">Active Jobs</span>
                        <span className="font-semibold text-blue-500">{stats.activeJobs}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary-light dark:text-text-secondary-dark">Completion Rate</span>
                        <span className="font-semibold text-green-500">98%</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-background-light dark:bg-background-dark rounded-lg">
                        <span className="material-icons text-green-500">check_circle</span>
                        <div className="flex-1">
                          <div className="font-medium">Job Completed</div>
                          <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            iPhone 14 Screen Replacement
                          </div>
                        </div>
                        <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">2h ago</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-background-light dark:bg-background-dark rounded-lg">
                        <span className="material-icons text-blue-500">gavel</span>
                        <div className="flex-1">
                          <div className="font-medium">Bid Accepted</div>
                          <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            Gaming PC Diagnosis
                          </div>
                        </div>
                        <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">5h ago</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-background-light dark:bg-background-dark rounded-lg">
                        <span className="material-icons text-yellow-500">star</span>
                        <div className="flex-1">
                          <div className="font-medium">New Review</div>
                          <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            5 stars from John Doe
                          </div>
                        </div>
                        <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">1d ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pending Bids */}
                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-4">Pending Bids</h3>
                  <div className="space-y-3">
                    {pendingBids.map((bid) => (
                      <div key={bid.id} className="flex justify-between items-center p-4 bg-background-light dark:bg-background-dark rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold">{bid.jobTitle}</h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            <span>Customer: {bid.customer}</span>
                            <span>Budget: {bid.budget}</span>
                            <span>{bid.postedDate}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">${bid.bidAmount}</div>
                          <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Your Bid</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4">Recent Jobs</h3>
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="flex justify-between items-center p-4 bg-background-light dark:bg-background-dark rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{job.title}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          <span>Customer: {job.customer}</span>
                          <span>Date: {job.date}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            job.status === 'completed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                            job.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                            'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                          }`}>
                            {job.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">${job.amount}</div>
                        {job.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="material-icons text-yellow-500 text-sm">star</span>
                            <span className="text-sm">{job.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4">Earnings Overview</h3>
                
                {/* Monthly Chart */}
                <div className="bg-background-light dark:bg-background-dark rounded-lg p-6 mb-6">
                  <h4 className="font-semibold mb-4">Monthly Earnings</h4>
                  <div className="flex items-end justify-between h-64 gap-2">
                    {earningsData.map((data) => (
                      <div key={data.month} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-primary rounded-t transition-all hover:bg-opacity-80"
                          style={{ height: `${(data.amount / 4000) * 100}%` }}
                        ></div>
                        <div className="text-xs mt-2 text-text-secondary-light dark:text-text-secondary-dark">
                          {data.month}
                        </div>
                        <div className="text-xs font-semibold">${data.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Earnings Breakdown */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-background-light dark:bg-background-dark rounded-lg p-4">
                    <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">This Week</div>
                    <div className="text-2xl font-bold text-green-500">$780</div>
                  </div>
                  <div className="bg-background-light dark:bg-background-dark rounded-lg p-4">
                    <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">This Month</div>
                    <div className="text-2xl font-bold text-blue-500">${stats.monthlyEarnings}</div>
                  </div>
                  <div className="bg-background-light dark:bg-background-dark rounded-lg p-4">
                    <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">This Year</div>
                    <div className="text-2xl font-bold text-purple-500">${stats.totalEarnings}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Bids Tab */}
            {activeTab === 'bids' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">My Bids</h3>
                  <button
                    onClick={() => navigate('/bidding')}
                    className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition"
                  >
                    Browse More Jobs
                  </button>
                </div>
                <div className="space-y-4">
                  {pendingBids.map((bid) => (
                    <div key={bid.id} className="p-4 bg-background-light dark:bg-background-dark rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{bid.jobTitle}</h4>
                          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            Customer: {bid.customer} • Posted {bid.postedDate}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-semibold rounded-full">
                          Pending
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          Budget: {bid.budget}
                        </div>
                        <div className="text-xl font-bold text-primary">${bid.bidAmount}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="p-6">
                <h3 className="text-lg font-bold mb-6">Performance Analytics</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Job Statistics */}
                  <div className="bg-background-light dark:bg-background-dark rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Job Statistics</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Completion Rate</span>
                          <span className="font-semibold">98%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: '98%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Customer Satisfaction</span>
                          <span className="font-semibold">96%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: '96%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>On-Time Delivery</span>
                          <span className="font-semibold">94%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500" style={{ width: '94%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Bid Win Rate</span>
                          <span className="font-semibold">{stats.acceptanceRate}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500" style={{ width: `${stats.acceptanceRate}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className="bg-background-light dark:bg-background-dark rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Jobs by Category</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Mobile Devices</span>
                        <span className="font-semibold">45 jobs</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>PC & Laptops</span>
                        <span className="font-semibold">32 jobs</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tablets</span>
                        <span className="font-semibold">12 jobs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default TechnicianDashboard;
