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
    const [data, setData] = useState(null);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const [dashboardRes, favoritesRes] = await Promise.all([
                    fetch('http://localhost:5000/api/customers/dashboard', { headers }),
                    fetch('http://localhost:5000/api/customers/favorites', { headers })
                ]);

                if (dashboardRes.ok) {
                    const dashboardData = await dashboardRes.json();
                    setData(dashboardData);
                }

                if (favoritesRes.ok) {
                    const favoritesData = await favoritesRes.json();
                    setFavorites(favoritesData.favorites || []);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
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
                    <TabsContent value="appointments" className="space-y-4">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl">All Appointments</CardTitle>
                                <CardDescription>View and manage your bookings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentBookings.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">No bookings found</div>
                                    ) : (
                                        recentBookings.map(apt => (
                                            <div key={apt._id} className="p-4 sm:p-6 bg-card rounded-lg border shadow hover:shadow-lg transition-all">
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                                            <h3 className="text-lg font-bold">{apt.device?.brand} {apt.device?.model}</h3>
                                                            <Badge variant={getStatusBadgeVariant(apt.status)}>
                                                                {apt.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="space-y-1 text-sm text-muted-foreground">
                                                            <p className="flex items-center"><User className="mr-2 h-4 w-4" /> Technician: <span className="font-medium ml-1">{apt.technician?.name || 'Pending'}</span></p>
                                                            <p className="flex items-center"><Calendar className="mr-2 h-4 w-4" /> Date: <span className="font-medium ml-1">{formatDate(apt.scheduledDate)}</span></p>
                                                            <p className="text-lg font-bold text-primary mt-2">
                                                                <CurrencyDisplay amount={apt.estimatedCost} decimals={0} />
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        {apt.status === 'pending' && (
                                                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                                                Cancel
                                                            </Button>
                                                        )}
                                                        {apt.status === 'confirmed' && (
                                                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                                                Reschedule
                                                            </Button>
                                                        )}
                                                        {apt.status === 'completed' && (
                                                            <Button variant="default" size="sm" className="w-full sm:w-auto">
                                                                Review
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Favorites Tab */}
                    <TabsContent value="favorites" className="space-y-4">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl">Favorite Technicians</CardTitle>
                                <CardDescription>Your trusted repair experts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {favorites.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">No favorite technicians yet</div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {favorites.map(tech => (
                                            <div key={tech._id} className="p-6 bg-card rounded-lg border shadow hover:shadow-lg transition-all">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <Avatar className="h-16 w-16 border-2 border-primary">
                                                        <AvatarImage src={tech.profileImage} alt={tech.name} />
                                                        <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                                                            {tech.name.split(' ').map(n => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h3 className="font-bold">{tech.name}</h3>
                                                        <p className="text-sm text-muted-foreground">{tech.specialization}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                        <span className="font-semibold">{tech.rating}</span>
                                                    </div>
                                                    <span className="text-muted-foreground">{tech.completedJobs} jobs</span>
                                                </div>
                                                <Button className="w-full mt-4">
                                                    Book Now
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity" className="space-y-4">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl">Activity History</CardTitle>
                                <CardDescription>All your recent actions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {recentBookings.map(booking => (
                                        <div key={booking._id} className="flex items-start gap-4 p-4 bg-muted rounded-lg hover:bg-accent transition-all">
                                            <div className="w-3 h-3 bg-primary rounded-full mt-1.5"></div>
                                            <div className="flex-1">
                                                <p className="font-semibold">Booking {booking.status}</p>
                                                <p className="text-sm text-muted-foreground">{booking.device?.brand} {booking.device?.model} - {booking.issue?.description}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(booking.createdAt).toLocaleString()}
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
