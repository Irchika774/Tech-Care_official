import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, MapPin, Clock, DollarSign, Smartphone, Monitor, Tablet, Gavel, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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
    e.preventDefault(); // Keep this for form submission behavior
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
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-indigo-700 rounded-xl p-8 text-primary-foreground shadow-lg">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Get Competitive Bids for Your Repair</h1>
          <p className="text-lg opacity-90">
            Post your repair job and receive bids from verified technicians. Compare prices, read reviews, and choose the best option for you.
          </p>
          <Dialog open={showPostJobModal} onOpenChange={setShowPostJobModal}>
            <DialogTrigger asChild>
              <Button size="lg" variant="secondary" className="font-semibold gap-2">
                <Plus className="h-5 w-5" />
                Post a Repair Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Post a Repair Job</DialogTitle>
              </DialogHeader>
              <form onSubmit={handlePostJob} className="space-y-4 mt-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    placeholder="e.g., iPhone 14 Screen Replacement"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    placeholder="Describe the problem in detail..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={jobForm.category}
                      onValueChange={(value) => setJobForm({ ...jobForm, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mobile">Mobile</SelectItem>
                        <SelectItem value="PC">PC</SelectItem>
                        <SelectItem value="Laptop">Laptop</SelectItem>
                        <SelectItem value="Tablet">Tablet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="urgency">Urgency *</Label>
                    <Select
                      value={jobForm.urgency}
                      onValueChange={(value) => setJobForm({ ...jobForm, urgency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent (Same Day)</SelectItem>
                        <SelectItem value="normal">Normal (1-3 Days)</SelectItem>
                        <SelectItem value="flexible">Flexible (Any Time)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="brand">Device Brand *</Label>
                    <Input
                      id="brand"
                      value={jobForm.deviceBrand}
                      onChange={(e) => setJobForm({ ...jobForm, deviceBrand: e.target.value })}
                      placeholder="e.g., Apple"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="model">Device Model *</Label>
                    <Input
                      id="model"
                      value={jobForm.deviceModel}
                      onChange={(e) => setJobForm({ ...jobForm, deviceModel: e.target.value })}
                      placeholder="e.g., iPhone 14 Pro"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    placeholder="e.g., New York, NY"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Budget Range ($) *</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      value={jobForm.budgetMin}
                      onChange={(e) => setJobForm({ ...jobForm, budgetMin: e.target.value })}
                      placeholder="Min"
                      required
                    />
                    <Input
                      type="number"
                      value={jobForm.budgetMax}
                      onChange={(e) => setJobForm({ ...jobForm, budgetMax: e.target.value })}
                      placeholder="Max"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Post Job</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary">{jobs.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Active Jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-500">
              {jobs.reduce((sum, job) => sum + job.bids.length, 0)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Total Bids</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-500">
              ${Math.round(jobs.reduce((sum, job) => sum + ((job.budgetMin + job.budgetMax) / 2), 0) / jobs.length)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Avg Budget</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-500">4.8</div>
            <p className="text-sm text-muted-foreground mt-1">Avg Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Mobile">Mobile Devices</SelectItem>
                  <SelectItem value="PC">PC & Laptops</SelectItem>
                  <SelectItem value="Tablet">Tablets</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Urgency</Label>
              <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                <SelectTrigger>
                  <SelectValue placeholder="All Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="budget-high">Highest Budget</SelectItem>
                  <SelectItem value="budget-low">Lowest Budget</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setFilterCategory('all');
                  setFilterUrgency('all');
                  setSortBy('newest');
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">
          Open Repair Jobs ({filteredJobs.length})
        </h2>

        {filteredJobs.map((job) => (
          <Card key={job.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold">{job.title}</h3>
                    {job.urgency === 'urgent' && (
                      <Badge variant="destructive">URGENT</Badge>
                    )}
                    <Badge variant="secondary">{job.category}</Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {job.description}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <span>{job.deviceBrand} {job.deviceModel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-primary">{job.budget}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{job.postedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bids Section */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Gavel className="h-4 w-4" />
                    Bids Received ({job.bids.length})
                  </h4>
                  <Dialog open={showBidModal && selectedJob?.id === job.id} onOpenChange={(open) => {
                    if (!open) setShowBidModal(false);
                    else {
                      setSelectedJob(job);
                      setShowBidModal(true);
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setSelectedJob(job)}>
                        Place Bid
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Place Your Bid</DialogTitle>
                        <DialogDescription>
                          Bidding for: {selectedJob?.title}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmitBid} className="space-y-4 mt-4">
                        <div className="p-4 bg-muted rounded-lg text-sm">
                          <p><strong>Budget:</strong> {selectedJob?.budget}</p>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="bidAmount">Your Bid Amount ($) *</Label>
                          <Input
                            id="bidAmount"
                            type="number"
                            value={bidForm.bidAmount}
                            onChange={(e) => setBidForm({ ...bidForm, bidAmount: e.target.value })}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="estimatedTime">Estimated Time *</Label>
                          <Input
                            id="estimatedTime"
                            value={bidForm.estimatedTime}
                            onChange={(e) => setBidForm({ ...bidForm, estimatedTime: e.target.value })}
                            placeholder="e.g., 2 hours"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="warranty">Warranty Period *</Label>
                          <Select
                            value={bidForm.warranty}
                            onValueChange={(value) => setBidForm({ ...bidForm, warranty: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Warranty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30 days">30 Days</SelectItem>
                              <SelectItem value="60 days">60 Days</SelectItem>
                              <SelectItem value="90 days">90 Days</SelectItem>
                              <SelectItem value="6 months">6 Months</SelectItem>
                              <SelectItem value="1 year">1 Year</SelectItem>
                              <SelectItem value="Lifetime">Lifetime</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            value={bidForm.message}
                            onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })}
                            placeholder="Explain why you're the best choice..."
                            required
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit">Submit Bid</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {job.bids.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
                    <p>No bids yet. Be the first to bid!</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {job.bids.map((bid) => (
                      <Card key={bid.id} className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-semibold">{bid.technicianName}</h5>
                                <Badge variant="outline" className="gap-1">
                                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                  {bid.technicianRating}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {bid.postedDate}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-primary">${bid.bidAmount}</div>
                              <div className="text-xs text-muted-foreground">
                                {bid.estimatedTime}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm mb-3">{bid.message}</p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                              <CheckCircle className="h-4 w-4" />
                              <span>Warranty: {bid.warranty}</span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => navigate('/schedule', { state: { bid, job } })}
                            >
                              Accept Bid
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Bidding;
