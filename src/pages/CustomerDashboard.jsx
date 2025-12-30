import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { Calendar, Clock, Star, CreditCard, User, Smartphone, Wrench, Droplets, Battery, CheckCircle, XCircle, AlertCircle, Activity, History, Heart, Loader2, Sparkles, ArrowRight, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import CurrencyDisplay from '../components/CurrencyDisplay';
import { formatDistanceToNow } from 'date-fns';
import SEO from '../components/SEO';

function CustomerDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                setLoading(true);
                // Get the access token from Supabase session
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token;

                if (!token) {
                    throw new Error('No authentication token available');
                }

                const headers = { Authorization: `Bearer ${token}` };

                const [dashboardRes, favoritesRes] = await Promise.all([
                    fetch(`${API_URL}/api/customers/dashboard`, { headers }),
                    fetch(`${API_URL}/api/customers/favorites`, { headers })
                ]);

                if (!dashboardRes.ok) {
                    throw new Error(`Failed to fetch dashboard data: ${dashboardRes.statusText}`);
                }

                const dashboardData = await dashboardRes.json();
                setData(dashboardData);

                if (favoritesRes.ok) {
                    const favoritesData = await favoritesRes.json();
                    setFavorites(favoritesData.favorites || []);
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Refresh data every 30 seconds for real-time updates
        const interval = setInterval(fetchData, 30000);
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
                    <AlertCircle className="h-12 w-12 text-red-500" />
                </div>
                <h2 className="text-2xl font-['Outfit'] font-bold text-white mb-2">
                    {isAuthError ? 'Session Update Required' : 'Something went wrong'}
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

    const { customer, stats, activeBookings, recentBookings } = data;

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'confirmed':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'completed':
                return 'outline';
            case 'cancelled':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-['Inter']">
            <SEO
                title="Customer Dashboard - TechCare"
                description="Manage your device repairs, track bookings, and view your service history."
            />

            {/* Background Effects */}
            <div className="fixed inset-0 bg-black pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <div className="relative border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-zinc-700 ring-4 ring-zinc-800">
                                <AvatarImage src={customer.profileImage} alt={customer.name} />
                                <AvatarFallback className="bg-zinc-800 text-white text-2xl sm:text-3xl font-['Outfit'] font-bold">
                                    {customer.name ? customer.name.split(' ').map(n => n[0]).join('') : 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <Badge className="mb-2 bg-zinc-800 text-zinc-300 border-zinc-700">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Customer
                                </Badge>
                                <h1 className="text-3xl sm:text-4xl font-['Outfit'] font-bold text-white">
                                    Welcome, {customer.name}
                                </h1>
                                <p className="text-zinc-400 mt-1">
                                    {customer.email}
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => navigate('/schedule')}
                            className="w-full sm:w-auto bg-white text-black hover:bg-gray-100 font-semibold py-6 px-8 rounded-full shadow-lg transition-all duration-300"
                        >
                            Book New Service
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-['Inter'] font-medium opacity-90">Total Bookings</CardTitle>
                                <Calendar className="h-5 w-5 opacity-80" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-['Outfit'] font-bold">{stats.totalBookings}</div>
                            <p className="text-xs opacity-80 mt-1">All time</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-['Inter'] font-medium opacity-90">Active Bookings</CardTitle>
                                <Activity className="h-5 w-5 opacity-80" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-['Outfit'] font-bold">{stats.activeBookings}</div>
                            <p className="text-xs opacity-80 mt-1">In progress</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-['Inter'] font-medium opacity-90">Total Spent</CardTitle>
                                <CreditCard className="h-5 w-5 opacity-80" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-['Outfit'] font-bold">
                                <CurrencyDisplay amount={stats.totalSpent} decimals={0} />
                            </div>
                            <p className="text-xs opacity-80 mt-1">Lifetime value</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-amber-600 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-['Inter'] font-medium opacity-90">Loyalty Points</CardTitle>
                                <Star className="h-5 w-5 opacity-80" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-['Outfit'] font-bold">{Math.floor(stats.totalSpent / 100)}</div>
                            <p className="text-xs opacity-80 mt-1">Redeem for discounts</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs Section */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Overview</TabsTrigger>
                        <TabsTrigger value="appointments" className="data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Appointments</TabsTrigger>
                        <TabsTrigger value="favorites" className="data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Favorites</TabsTrigger>
                        <TabsTrigger value="activity" className="data-[state=active]:bg-white data-[state=active]:text-black rounded-lg font-['Inter']">Activity</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Upcoming Appointments */}
                            <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-xl font-['Outfit'] flex items-center text-white">
                                        <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                                        Active Bookings
                                    </CardTitle>
                                    <CardDescription className="text-zinc-400">Your in-progress services</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {activeBookings.length === 0 ? (
                                        <div className="text-center py-8 text-zinc-500">
                                            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                            <p>No active bookings</p>
                                        </div>
                                    ) : (
                                        activeBookings.map(apt => (
                                            <div key={apt._id} className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-zinc-600 transition-all">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                                    <h3 className="font-['Outfit'] font-semibold text-white">{apt.device?.brand} {apt.device?.model}</h3>
                                                    <Badge variant={getStatusBadgeVariant(apt.status)} className="w-fit">
                                                        {apt.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-zinc-400">Technician: {apt.technician?.name || 'Pending Assignment'}</p>
                                                <p className="text-sm text-zinc-400">Issue: {apt.issue?.description}</p>
                                                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-zinc-400">
                                                    <span className="flex items-center"><Calendar className="mr-1 h-3 w-3" /> {formatDate(apt.scheduledDate)}</span>
                                                    <span className="font-semibold text-white">
                                                        <CurrencyDisplay amount={apt.estimatedCost} decimals={0} />
                                                    </span>
                                                </div>
                                                <div className="flex gap-2 mt-4">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => navigate(`/tracker/${apt._id || apt.id}`)}
                                                        className="flex-1 border-zinc-700 text-white hover:bg-zinc-800"
                                                    >
                                                        <Activity className="mr-2 h-4 w-4" />
                                                        Track
                                                    </Button>
                                                    {apt.technician && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => navigate(`/chat/${apt._id || apt.id}`)}
                                                            className="flex-1 bg-white text-black hover:bg-gray-100"
                                                        >
                                                            <User className="mr-2 h-4 w-4" />
                                                            Chat
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-xl font-['Outfit'] flex items-center text-white">
                                        <Activity className="mr-2 h-5 w-5 text-emerald-500" />
                                        Recent Bookings
                                    </CardTitle>
                                    <CardDescription className="text-zinc-400">Your latest service history</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {recentBookings.length === 0 ? (
                                        <div className="text-center py-8 text-zinc-500">
                                            <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                            <p>No recent activity</p>
                                        </div>
                                    ) : (
                                        recentBookings.slice(0, 5).map(booking => (
                                            <div key={booking._id} className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-all">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-['Inter'] font-medium text-sm text-white">Booking {booking.status}</p>
                                                    <p className="text-sm text-zinc-400 truncate">{booking.device?.brand} {booking.device?.model}</p>
                                                    <p className="text-xs text-zinc-500 mt-1">
                                                        {formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Appointments Tab */}
                    <TabsContent value="appointments">
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="font-['Outfit'] text-white">All Appointments</CardTitle>
                                <CardDescription className="text-zinc-400">History of all your service requests</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {recentBookings.length === 0 ? (
                                    <div className="text-center py-12 text-zinc-500">
                                        <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                        <p>No booking history found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {recentBookings.map(booking => (
                                            <div key={booking._id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-['Outfit'] font-semibold text-white">{booking.device?.brand} {booking.device?.model}</h4>
                                                        <Badge variant={getStatusBadgeVariant(booking.status)}>{booking.status}</Badge>
                                                    </div>
                                                    <p className="text-sm text-zinc-400 mt-1">
                                                        {formatDate(booking.scheduledDate)} • {booking.issue?.type}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                                    <div className="text-right">
                                                        <div className="font-['Outfit'] font-bold text-white">
                                                            <CurrencyDisplay amount={booking.estimatedCost} decimals={0} />
                                                        </div>
                                                        <div className="text-xs text-zinc-500">Estimated Cost</div>
                                                    </div>
                                                    <Button variant="outline" size="sm" className="border-zinc-700 text-white hover:bg-zinc-800">View Details</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Favorites Tab */}
                    <TabsContent value="favorites">
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="font-['Outfit'] text-white">Favorite Technicians</CardTitle>
                                <CardDescription className="text-zinc-400">Technicians you've saved for quick access</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {favorites.length === 0 ? (
                                    <div className="text-center py-12 text-zinc-500">
                                        <Heart className="mx-auto h-16 w-16 opacity-50 mb-4" />
                                        <p className="mb-4">No favorite technicians yet</p>
                                        <Button variant="outline" onClick={() => navigate('/technicians')} className="border-zinc-700 text-white hover:bg-zinc-800">
                                            Browse Technicians
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {favorites.map(tech => (
                                            <div key={tech._id} className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl hover:border-zinc-600 transition-all">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Avatar>
                                                        <AvatarImage src={tech.profileImage} />
                                                        <AvatarFallback className="bg-zinc-700 text-white">{tech.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h4 className="font-['Outfit'] font-semibold text-white">{tech.name}</h4>
                                                        <div className="flex items-center text-sm text-yellow-500">
                                                            <Star className="h-3 w-3 fill-current mr-1" />
                                                            {tech.rating} ({tech.reviewCount})
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button className="w-full bg-white text-black hover:bg-gray-100">Book Again</Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity">
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="font-['Outfit'] text-white">Account Activity</CardTitle>
                                <CardDescription className="text-zinc-400">Recent actions and notifications</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentBookings.slice(0, 10).map((action, i) => (
                                        <div key={i} className="flex gap-4 pb-4 border-b border-zinc-800 last:border-0 last:pb-0">
                                            <div className="mt-1">
                                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-['Inter'] font-medium text-white">Booking Status Update</p>
                                                <p className="text-sm text-zinc-400">
                                                    Your booking for {action.device?.brand} {action.device?.model} is now {action.status}
                                                </p>
                                                <p className="text-xs text-zinc-500 mt-1">
                                                    {formatDistanceToNow(new Date(action.updatedAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default CustomerDashboard;
