import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { Calendar, Clock, Star, CreditCard, User, Smartphone, Wrench, Droplets, Battery, CheckCircle, XCircle, AlertCircle, Activity, History, Heart, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CurrencyDisplay from '../components/CurrencyDisplay';
import { formatDistanceToNow } from 'date-fns';

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
                const token = localStorage.getItem('token');
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
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        const isAuthError = error.includes('404') || error.includes('Not Found') ||
            error.includes('401') || error.includes('403') ||
            error.includes('Forbidden');

        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                    {isAuthError ? 'Session Update Required' : 'Something went wrong'}
                </h2>
                <p className="text-muted-foreground mb-4">
                    {isAuthError
                        ? 'Please login again to update your account permissions.'
                        : error}
                </p>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                    {isAuthError && (
                        <Button onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            window.location.href = '/login';
                        }}>
                            Login Again
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    if (!data) return null;

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-background border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-primary">
                                <AvatarImage src={customer.profileImage} alt={customer.name} />
                                <AvatarFallback className="bg-primary text-primary-foreground text-xl sm:text-2xl font-bold">
                                    {customer.name ? customer.name.split(' ').map(n => n[0]).join('') : 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold">
                                    Welcome, {customer.name}
                                </h1>
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    {customer.email}
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => navigate('/schedule')}
                            className="w-full sm:w-auto shadow-lg"
                        >
                            Book New Service
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    <Card className="bg-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Total Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl sm:text-4xl font-bold">{stats.totalBookings}</div>
                            <p className="text-xs opacity-80 mt-1">All time</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Active Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl sm:text-4xl font-bold">{stats.activeBookings}</div>
                            <p className="text-xs opacity-80 mt-1">In progress</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Total Spent</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl sm:text-3xl font-bold">
                                <CurrencyDisplay amount={stats.totalSpent} decimals={0} />
                            </div>
                            <p className="text-xs opacity-80 mt-1">Lifetime value</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Loyalty Points</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl sm:text-4xl font-bold">{Math.floor(stats.totalSpent / 100)}</div>
                            <p className="text-xs opacity-80 mt-1">Redeem for discounts</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs Section */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 p-1">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="appointments">Appointments</TabsTrigger>
                        <TabsTrigger value="favorites">Favorites</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Upcoming Appointments */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center">
                                        <Calendar className="mr-2 h-5 w-5" />
                                        Active Bookings
                                    </CardTitle>
                                    <CardDescription>Your in-progress services</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {activeBookings.length === 0 ? (
                                        <div className="text-center py-4 text-muted-foreground">No active bookings</div>
                                    ) : (
                                        activeBookings.map(apt => (
                                            <div key={apt._id} className="p-4 bg-muted rounded-lg border hover:shadow-md transition-all">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                                    <h3 className="font-semibold text-foreground">{apt.device?.brand} {apt.device?.model}</h3>
                                                    <Badge variant={getStatusBadgeVariant(apt.status)} className="w-fit">
                                                        {apt.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">Technician: {apt.technician?.name || 'Pending Assignment'}</p>
                                                <p className="text-sm text-muted-foreground">Issue: {apt.issue?.description}</p>
                                                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                      <span className="flex items-center"><Calendar className="mr-1 h-3 w-3" /> {formatDate(apt.scheduledDate)}</span>
                                                      <span className="font-semibold text-primary">
                                                          <CurrencyDisplay amount={apt.estimatedCost} decimals={0} />
                                                      </span>
                                                  </div>
                                                  <div className="flex gap-2 mt-4">
                                                      <Button 
                                                          size="sm" 
                                                          variant="outline"
                                                          onClick={() => navigate(`/tracker/${apt._id || apt.id}`)}
                                                          className="flex-1"
                                                      >
                                                          <Activity className="mr-2 h-4 w-4" />
                                                          Track
                                                      </Button>
                                                      {apt.technician && (
                                                          <Button 
                                                              size="sm"
                                                              onClick={() => navigate(`/chat/${apt._id || apt.id}`)}
                                                              className="flex-1"
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
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center">
                                        <Activity className="mr-2 h-5 w-5" />
                                        Recent Bookings
                                    </CardTitle>
                                    <CardDescription>Your latest service history</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {recentBookings.length === 0 ? (
                                        <div className="text-center py-4 text-muted-foreground">No recent activity</div>
                                    ) : (
                                        recentBookings.slice(0, 5).map(booking => (
                                            <div key={booking._id} className="flex items-start gap-3 p-3 bg-muted rounded-lg hover:bg-accent transition-all">
                                                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm">Booking {booking.status}</p>
                                                    <p className="text-sm text-muted-foreground truncate">{booking.device?.brand} {booking.device?.model}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
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
                        <Card>
                            <CardHeader>
                                <CardTitle>All Appointments</CardTitle>
                                <CardDescription>History of all your service requests</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {recentBookings.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">No booking history found</div>
                                ) : (
                                    <div className="space-y-4">
                                        {recentBookings.map(booking => (
                                            <div key={booking._id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-muted rounded-lg gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-semibold">{booking.device?.brand} {booking.device?.model}</h4>
                                                        <Badge variant={getStatusBadgeVariant(booking.status)}>{booking.status}</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {formatDate(booking.scheduledDate)} • {booking.issue?.type}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                                    <div className="text-right">
                                                        <div className="font-bold text-primary">
                                                            <CurrencyDisplay amount={booking.estimatedCost} decimals={0} />
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">Estimated Cost</div>
                                                    </div>
                                                    <Button variant="outline" size="sm">View Details</Button>
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Favorite Technicians</CardTitle>
                                <CardDescription>Technicians you've saved for quick access</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {favorites.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Heart className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                                        <p>No favorite technicians yet</p>
                                        <Button variant="link" onClick={() => navigate('/technicians')}>Browse Technicians</Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {favorites.map(tech => (
                                            <div key={tech._id} className="p-4 border rounded-lg hover:shadow-md transition-all">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Avatar>
                                                        <AvatarImage src={tech.profileImage} />
                                                        <AvatarFallback>{tech.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h4 className="font-semibold">{tech.name}</h4>
                                                        <div className="flex items-center text-sm text-yellow-500">
                                                            <Star className="h-3 w-3 fill-current mr-1" />
                                                            {tech.rating} ({tech.reviewCount})
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button className="w-full" variant="secondary">Book Again</Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Activity</CardTitle>
                                <CardDescription>Recent actions and notifications</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentBookings.slice(0, 10).map((action, i) => (
                                        <div key={i} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                                            <div className="mt-1">
                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Booking Status Update</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Your booking for {action.device?.brand} {action.device?.model} is now {action.status}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
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
