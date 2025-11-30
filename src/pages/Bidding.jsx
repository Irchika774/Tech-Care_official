import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import CurrencyDisplay from '../components/CurrencyDisplay';
import SEO from '../components/SEO';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Briefcase, DollarSign, Clock, MapPin } from 'lucide-react';

const Bidding = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('available');
    const [availableJobs, setAvailableJobs] = useState([]);
    const [myBids, setMyBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [bidMessage, setBidMessage] = useState('');
    const [estimatedDuration, setEstimatedDuration] = useState('');
    const [showBidModal, setShowBidModal] = useState(false);

    useEffect(() => {
        // Redirect if not logged in or not a technician
        if (!user) {
            // Wait for auth to load
            return;
        }

        if (user.role !== 'technician') {
            navigate('/login');
            return;
        }

        fetchAvailableJobs();
        fetchMyBids();
    }, [user, navigate]);

    const fetchAvailableJobs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/technicians/jobs', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setAvailableJobs(data.jobs || []);
            } else {
                // Fallback for demo/testing if API fails
                console.log('Using fallback data for jobs');
                setAvailableJobs([]);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyBids = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/technicians/bids', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMyBids(data.bids || []);
            }
        } catch (error) {
            console.error('Error fetching bids:', error);
        }
    };

    const handleSubmitBid = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const bidData = {
                bookingId: selectedJob._id,
                amount: parseFloat(bidAmount),
                message: bidMessage,
                estimatedDuration: parseInt(estimatedDuration)
            };

            const response = await fetch('http://localhost:5000/api/technicians/bids', {
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
                fetchMyBids();
                alert('Bid submitted successfully!');
            } else {
                alert('Failed to submit bid');
            }
        } catch (error) {
            console.error('Error submitting bid:', error);
            alert('Error submitting bid');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <SEO
                title="Job Bidding - TechCare"
                description="Browse available repair jobs and submit bids. Find new opportunities for technicians."
                keywords="repair jobs, technician bidding, freelance repair, tech jobs"
            />
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Job Bidding Center</h1>
                <p className="text-muted-foreground">Browse available jobs and submit your bids</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="available">Available Jobs ({availableJobs.length})</TabsTrigger>
                    <TabsTrigger value="myBids">My Bids ({myBids.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="available" className="mt-6">
                    {loading ? (
                        <div className="text-center py-12">Loading jobs...</div>
                    ) : availableJobs.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No Available Jobs</h3>
                                <p className="text-muted-foreground">Check back later for new opportunities</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {availableJobs.map((job) => (
                                <Card key={job._id}>
                                    <CardHeader>
                                        <CardTitle>{job.device?.brand} {job.device?.model}</CardTitle>
                                        <CardDescription>{job.customer?.name} • {job.customer?.location}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p>{job.issue?.description}</p>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4" />
                                                <DollarSign className="h-4 w-4" />
                                                <span className="font-bold">
                                                    <CurrencyDisplay amount={job.estimatedCost || 0} decimals={0} />
                                                </span>
                                            </div>
                                            <Button onClick={() => {
                                                setSelectedJob(job);
                                                setBidAmount(job.estimatedCost?.toString() || '');
                                                setShowBidModal(true);
                                            }}>
                                                Submit Bid
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="myBids" className="mt-6">
                    {myBids.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No Bids Yet</h3>
                                <p className="text-muted-foreground mb-4">Submit bids on available jobs to see them here</p>
                                <Button onClick={() => setActiveTab('available')}>Browse Jobs</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {myBids.map((bid) => (
                                <Card key={bid._id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>{bid.booking?.device?.brand} {bid.booking?.device?.model}</CardTitle>
                                                <CardDescription>Customer: {bid.booking?.customer?.name}</CardDescription>
                                            </div>
                                            <Badge variant={bid.status === 'accepted' ? 'default' : 'secondary'}>
                                                {bid.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Bid Amount</p>
                                                <p className="text-sm text-muted-foreground">Bid Amount</p>
                                                <p className="font-semibold">
                                                    <CurrencyDisplay amount={bid.amount} decimals={0} />
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Duration</p>
                                                <p className="font-semibold">{bid.estimatedDuration}h</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Submitted</p>
                                                <p className="font-semibold">{new Date(bid.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        {bid.message && (
                                            <p className="mt-4 text-sm"><strong>Message:</strong> {bid.message}</p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Bid Modal */}
            {showBidModal && selectedJob && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="max-w-md w-full m-4">
                        <CardHeader>
                            <CardTitle>Submit Bid</CardTitle>
                            <CardDescription>{selectedJob.device?.brand} {selectedJob.device?.model}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmitBid} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Bid Amount (LKR)</label>
                                    <input
                                        type="number"
                                        required
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Estimated Duration (hours)</label>
                                    <input
                                        type="number"
                                        required
                                        value={estimatedDuration}
                                        onChange={(e) => setEstimatedDuration(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Message</label>
                                    <textarea
                                        value={bidMessage}
                                        onChange={(e) => setBidMessage(e.target.value)}
                                        rows="3"
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" onClick={() => setShowBidModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Submit Bid</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Bidding;
