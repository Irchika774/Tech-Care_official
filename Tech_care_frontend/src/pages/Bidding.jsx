import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const initialJobs = [
  {
    id: 1,
    title: "iPhone 14 Pro Screen Replacement",
    description: "Cracked screen after drop. Phone works fine, just needs screen replacement. Urgent repair needed.",
    category: "Mobile",
    deviceBrand: "Apple",
    deviceModel: "iPhone 14 Pro",
    issue: "Screen Repair",
    location: "New York, NY",
    budget: "$150 - $250",
    budgetMin: 150,
    budgetMax: 250,
    urgency: "urgent",
    postedBy: "John Doe",
    postedDate: "2025-11-05",
    status: "open",
    bids: [
      {
        id: 1,
        technicianName: "Mobile Wizards",
        technicianRating: 4.9,
        bidAmount: 180,
        estimatedTime: "2 hours",
        message: "I can fix your iPhone screen today. I have the original quality parts in stock.",
        warranty: "90 days",
        postedDate: "2025-11-05 10:30 AM"
      },
      {
        id: 2,
        technicianName: "Fone Fixers",
        technicianRating: 4.8,
        bidAmount: 200,
        estimatedTime: "1.5 hours",
        message: "Quick turnaround with lifetime warranty on the screen.",
        warranty: "Lifetime",
        postedDate: "2025-11-05 11:15 AM"
      }
    ],
    photos: []
  },
  {
    id: 2,
    title: "Gaming PC Not Booting - Hardware Issue",
    description: "PC powers on but no display. Suspect motherboard or GPU issue. Need diagnosis and repair.",
    category: "PC",
    deviceBrand: "Custom Built",
    deviceModel: "Gaming PC",
    issue: "Hardware Failure",
    location: "Los Angeles, CA",
    budget: "$200 - $500",
    budgetMin: 200,
    budgetMax: 500,
    urgency: "normal",
    postedBy: "Sarah Chen",
    postedDate: "2025-11-04",
    status: "open",
    bids: [
      {
        id: 3,
        technicianName: "Circuit Masters",
        technicianRating: 4.9,
        bidAmount: 350,
        estimatedTime: "4-6 hours",
        message: "I'll diagnose the issue first (free). Most likely GPU or RAM problem. Can fix same day.",
        warranty: "6 months",
        postedDate: "2025-11-04 02:45 PM"
      }
    ],
    photos: []
  },
  {
    id: 3,
    title: "Samsung Galaxy S23 Water Damage",
    description: "Phone fell in water yesterday. Won't turn on now. Need data recovery and repair if possible.",
    category: "Mobile",
    deviceBrand: "Samsung",
    deviceModel: "Galaxy S23",
    issue: "Water Damage",
    location: "Chicago, IL",
    budget: "$100 - $300",
    budgetMin: 100,
    budgetMax: 300,
    urgency: "urgent",
    postedBy: "Mike Thompson",
    postedDate: "2025-11-05",
    status: "open",
    bids: [],
    photos: []
  }
];

const Bidding = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(initialJobs);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Post job form state
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    category: 'Mobile',
    deviceBrand: '',
    deviceModel: '',
    issue: '',
    location: '',
    budgetMin: '',
    budgetMax: '',
    urgency: 'normal'
  });

  // Bid form state
  const [bidForm, setBidForm] = useState({
    bidAmount: '',
    estimatedTime: '',
    message: '',
    warranty: '30 days'
  });

  const handlePostJob = (e) => {
    e.preventDefault();
    const newJob = {
      id: jobs.length + 1,
      ...jobForm,
      budget: `$${jobForm.budgetMin} - $${jobForm.budgetMax}`,
      postedBy: "You",
      postedDate: new Date().toISOString().split('T')[0],
      status: "open",
      bids: [],
      photos: []
    };
    setJobs([newJob, ...jobs]);
    setShowPostJobModal(false);
    setJobForm({
      title: '',
      description: '',
      category: 'Mobile',
      deviceBrand: '',
      deviceModel: '',
      issue: '',
      location: '',
      budgetMin: '',
      budgetMax: '',
      urgency: 'normal'
    });
  };

  const handleSubmitBid = (e) => {
    e.preventDefault();
    const newBid = {
      id: Date.now(),
      technicianName: "Your Business Name",
      technicianRating: 4.8,
      ...bidForm,
      postedDate: new Date().toLocaleString()
    };
    
    setJobs(jobs.map(job => 
      job.id === selectedJob.id 
        ? { ...job, bids: [...job.bids, newBid] }
        : job
    ));
    
    setShowBidModal(false);
    setBidForm({
      bidAmount: '',
      estimatedTime: '',
      message: '',
      warranty: '30 days'
    });
  };

  const getFilteredJobs = () => {
    let filtered = [...jobs];

    if (filterCategory !== 'all') {
      filtered = filtered.filter(job => job.category === filterCategory);
    }

    if (filterUrgency !== 'all') {
      filtered = filtered.filter(job => job.urgency === filterUrgency);
    }

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
    } else if (sortBy === 'budget-high') {
      filtered.sort((a, b) => b.budgetMax - a.budgetMax);
    } else if (sortBy === 'budget-low') {
      filtered.sort((a, b) => a.budgetMin - b.budgetMin);
    }

    return filtered;
  };

  const filteredJobs = getFilteredJobs();

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        
        <main className="py-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-primary to-indigo-700 rounded-lg p-8 mb-8 text-white">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-4">Get Competitive Bids for Your Repair</h1>
              <p className="text-lg mb-6">
                Post your repair job and receive bids from verified technicians. Compare prices, read reviews, and choose the best option for you.
              </p>
              <button
                onClick={() => setShowPostJobModal(true)}
                className="bg-white text-primary font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition inline-flex items-center gap-2"
              >
                <span className="material-icons">add_circle</span>
                Post a Repair Job
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-primary">{jobs.length}</div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">Active Jobs</div>
            </div>
            <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-500">
                {jobs.reduce((sum, job) => sum + job.bids.length, 0)}
              </div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">Total Bids</div>
            </div>
            <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-500">
                ${Math.round(jobs.reduce((sum, job) => sum + ((job.budgetMin + job.budgetMax) / 2), 0) / jobs.length)}
              </div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">Avg Budget</div>
            </div>
            <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-yellow-500">4.8</div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">Avg Rating</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full py-2 px-4 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Categories</option>
                  <option value="Mobile">Mobile Devices</option>
                  <option value="PC">PC & Laptops</option>
                  <option value="Tablet">Tablets</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Urgency</label>
                <select
                  value={filterUrgency}
                  onChange={(e) => setFilterUrgency(e.target.value)}
                  className="w-full py-2 px-4 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Urgency</option>
                  <option value="urgent">Urgent</option>
                  <option value="normal">Normal</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full py-2 px-4 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="budget-high">Highest Budget</option>
                  <option value="budget-low">Lowest Budget</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilterCategory('all');
                    setFilterUrgency('all');
                    setSortBy('newest');
                  }}
                  className="w-full py-2 px-4 border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              Open Repair Jobs ({filteredJobs.length})
            </h2>
            
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{job.title}</h3>
                      {job.urgency === 'urgent' && (
                        <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-semibold rounded-full">
                          URGENT
                        </span>
                      )}
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-full">
                        {job.category}
                      </span>
                    </div>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark mb-3">
                      {job.description}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          devices
                        </span>
                        <span>{job.deviceBrand} {job.deviceModel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          location_on
                        </span>
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          attach_money
                        </span>
                        <span className="font-semibold text-primary">{job.budget}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          schedule
                        </span>
                        <span>{job.postedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bids Section */}
                <div className="border-t border-border-light dark:border-border-dark pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">
                      Bids Received ({job.bids.length})
                    </h4>
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setShowBidModal(true);
                      }}
                      className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition inline-flex items-center gap-2"
                    >
                      <span className="material-icons text-sm">gavel</span>
                      Place Bid
                    </button>
                  </div>

                  {job.bids.length === 0 ? (
                    <div className="text-center py-6 text-text-secondary-light dark:text-text-secondary-dark">
                      <span className="material-icons text-4xl mb-2">inbox</span>
                      <p>No bids yet. Be the first to bid!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {job.bids.map((bid) => (
                        <div key={bid.id} className="bg-background-light dark:bg-background-dark rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-semibold">{bid.technicianName}</h5>
                                <div className="flex items-center gap-1">
                                  <span className="material-icons text-yellow-500 text-sm">star</span>
                                  <span className="text-sm">{bid.technicianRating}</span>
                                </div>
                              </div>
                              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                                {bid.postedDate}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">${bid.bidAmount}</div>
                              <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                {bid.estimatedTime}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm mb-2">{bid.message}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <span className="material-icons text-sm text-green-500">verified</span>
                              <span>Warranty: {bid.warranty}</span>
                            </div>
                            <button
                              onClick={() => navigate('/schedule', { state: { bid, job } })}
                              className="ml-auto bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 transition"
                            >
                              Accept Bid
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
        
        <Footer />
      </div>

      {/* Post Job Modal */}
      {showPostJobModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPostJobModal(false)}
        >
          <div 
            className="bg-card-light dark:bg-card-dark rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold">Post a Repair Job</h2>
              <button 
                onClick={() => setShowPostJobModal(false)}
                className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded-lg transition"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <form onSubmit={handlePostJob} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., iPhone 14 Screen Replacement"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    value={jobForm.description}
                    onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows="4"
                    placeholder="Describe the problem in detail..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      value={jobForm.category}
                      onChange={(e) => setJobForm({...jobForm, category: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="Mobile">Mobile</option>
                      <option value="PC">PC</option>
                      <option value="Laptop">Laptop</option>
                      <option value="Tablet">Tablet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Urgency *</label>
                    <select
                      value={jobForm.urgency}
                      onChange={(e) => setJobForm({...jobForm, urgency: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="urgent">Urgent (Same Day)</option>
                      <option value="normal">Normal (1-3 Days)</option>
                      <option value="flexible">Flexible (Any Time)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Device Brand *</label>
                    <input
                      type="text"
                      value={jobForm.deviceBrand}
                      onChange={(e) => setJobForm({...jobForm, deviceBrand: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Apple, Samsung"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Device Model *</label>
                    <input
                      type="text"
                      value={jobForm.deviceModel}
                      onChange={(e) => setJobForm({...jobForm, deviceModel: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., iPhone 14 Pro"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., New York, NY"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Budget Range *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      value={jobForm.budgetMin}
                      onChange={(e) => setJobForm({...jobForm, budgetMin: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Min ($)"
                      required
                    />
                    <input
                      type="number"
                      value={jobForm.budgetMax}
                      onChange={(e) => setJobForm({...jobForm, budgetMax: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Max ($)"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border-light dark:border-border-dark">
                <button
                  type="button"
                  onClick={() => setShowPostJobModal(false)}
                  className="px-6 py-2 border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition"
                >
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bid Modal */}
      {showBidModal && selectedJob && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowBidModal(false)}
        >
          <div 
            className="bg-card-light dark:bg-card-dark rounded-lg shadow-2xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Place Your Bid</h2>
              <button 
                onClick={() => setShowBidModal(false)}
                className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded-lg transition"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitBid} className="p-6">
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold mb-1">{selectedJob.title}</h3>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Budget: {selectedJob.budget}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Bid Amount ($) *</label>
                  <input
                    type="number"
                    value={bidForm.bidAmount}
                    onChange={(e) => setBidForm({...bidForm, bidAmount: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your bid amount"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estimated Time *</label>
                  <input
                    type="text"
                    value={bidForm.estimatedTime}
                    onChange={(e) => setBidForm({...bidForm, estimatedTime: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., 2 hours, Same day"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Warranty Period *</label>
                  <select
                    value={bidForm.warranty}
                    onChange={(e) => setBidForm({...bidForm, warranty: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="30 days">30 Days</option>
                    <option value="60 days">60 Days</option>
                    <option value="90 days">90 Days</option>
                    <option value="6 months">6 Months</option>
                    <option value="1 year">1 Year</option>
                    <option value="Lifetime">Lifetime</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message to Customer *</label>
                  <textarea
                    value={bidForm.message}
                    onChange={(e) => setBidForm({...bidForm, message: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows="4"
                    placeholder="Explain why you're the best choice for this job..."
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border-light dark:border-border-dark">
                <button
                  type="button"
                  onClick={() => setShowBidModal(false)}
                  className="px-6 py-2 border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition"
                >
                  Submit Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bidding;
