import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { Calendar, Clock, Star, CreditCard, User, Smartphone, Wrench, Droplets, Battery, CheckCircle, XCircle, AlertCircle, Activity, History, Heart } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

function CustomerDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    // Mock customer data
    const [customerData] = useState({
        name: user?.name || 'Guest User',
        email: user?.email || 'guest@example.com',
        phone: '+94 77 123 4567',
        memberSince: 'January 2024',
        totalBookings: 12,
        activeBookings: 2,
        completedBookings: 10,
        totalSpent: 45000,
        loyaltyPoints: 450,
        avatar: null
    });

    const [appointments] = useState([
        {
            id: 1,
            service: 'Screen Replacement',
            technician: 'Sarah Johnson',
            date: '2024-11-20',
            time: '10:00 AM',
            status: 'confirmed',
            price: 5500,
            device: 'iPhone 13 Pro'
        },
        {
            id: 2,
            service: 'Battery Replacement',
            technician: 'Mike Chen',
            date: '2024-11-22',
            time: '2:00 PM',
            status: 'pending',
            price: 3500,
            device: 'Samsung Galaxy S21'
        },
        {
            id: 3,
            service: 'Water Damage Repair',
            technician: 'Emily Davis',
            date: '2024-11-15',
            time: '11:00 AM',
            status: 'completed',
            price: 8500,
            device: 'iPad Air'
        },
        {
            id: 4,
            service: 'Charging Port Repair',
            technician: 'David Wilson',
            date: '2024-11-10',
            time: '3:00 PM',
            status: 'completed',
            price: 2500,
            device: 'OnePlus 9'
        }
    ]);

    const [favorites] = useState([
        {
            id: 1,
            name: 'Sarah Johnson',
            specialty: 'Screen Repairs',
            rating: 4.9,
            completedJobs: 234,
            avatar: null
        },
        {
            id: 2,
            name: 'Mike Chen',
            specialty: 'Battery Expert',
            rating: 4.8,
            completedJobs: 189,
            avatar: null
        }
    ]);

    const [recentActivity] = useState([
        { id: 1, action: 'Booked appointment', detail: 'Screen Replacement', date: '2024-11-18', time: '2:30 PM' },
        { id: 2, action: 'Review submitted', detail: 'Water Damage Repair - 5 stars', date: '2024-11-16', time: '4:15 PM' },
        { id: 3, action: 'Payment completed', detail: 'LKR 8,500', date: '2024-11-15', time: '12:00 PM' },
        { id: 4, action: 'Added to favorites', detail: 'Sarah Johnson', date: '2024-11-14', time: '9:45 AM' }
    ]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-500';
            case 'pending':
                return 'bg-yellow-500';
            case 'completed':
                return 'bg-blue-500';
            case 'cancelled':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'confirmed':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'completed':
                return 'outline';
            default:
                return 'destructive';
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
                                <AvatarImage src={customerData.avatar} alt={customerData.name} />
                                <AvatarFallback className="bg-primary text-primary-foreground text-xl sm:text-2xl font-bold">
                                    {customerData.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold">
                                    Welcome, {customerData.name}
                                </h1>
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    Member since {customerData.memberSince}
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
                            <div className="text-3xl sm:text-4xl font-bold">{customerData.totalBookings}</div>
                            <p className="text-xs opacity-80 mt-1">All time</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Active Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl sm:text-4xl font-bold">{customerData.activeBookings}</div>
                            <p className="text-xs opacity-80 mt-1">In progress</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Total Spent</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl sm:text-3xl font-bold">LKR {customerData.totalSpent.toLocaleString()}</div>
                            <p className="text-xs opacity-80 mt-1">Lifetime value</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Loyalty Points</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl sm:text-4xl font-bold">{customerData.loyaltyPoints}</div>
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
                                        Upcoming Appointments
                                    </CardTitle>
                                    <CardDescription>Your scheduled services</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {appointments.filter(apt => apt.status !== 'completed').map(apt => (
                                        <div key={apt.id} className="p-4 bg-muted rounded-lg border hover:shadow-md transition-all">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                                <h3 className="font-semibold text-foreground">{apt.service}</h3>
                                                <Badge variant={getStatusBadgeVariant(apt.status)} className="w-fit">
                                                    {apt.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">Technician: {apt.technician}</p>
                                            <p className="text-sm text-muted-foreground">Device: {apt.device}</p>
                                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                <span className="flex items-center"><Calendar className="mr-1 h-3 w-3" /> {apt.date}</span>
                                                <span className="flex items-center"><Clock className="mr-1 h-3 w-3" /> {apt.time}</span>
                                                <span className="font-semibold text-primary">LKR {apt.price.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center">
                                        <Activity className="mr-2 h-5 w-5" />
                                        Recent Activity
                                    </CardTitle>
                                    <CardDescription>Your latest actions</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {recentActivity.slice(0, 4).map(activity => (
                                        <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg hover:bg-accent transition-all">
                                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm">{activity.action}</p>
                                                <p className="text-sm text-muted-foreground truncate">{activity.detail}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {activity.date} at {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Loyalty Progress */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center">
                                    <Star className="mr-2 h-5 w-5 text-yellow-500" />
                                    Loyalty Rewards Progress
                                </CardTitle>
                                <CardDescription>Earn points with every booking</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium">Current Points: {customerData.loyaltyPoints}</span>
                                            <span className="text-sm text-muted-foreground">Next Reward: 500 points</span>
                                        </div>
                                        <Progress value={(customerData.loyaltyPoints / 500) * 100} className="h-3" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">10%</div>
                                            <div className="text-sm text-muted-foreground">Discount at 500 pts</div>
                                        </div>
                                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">20%</div>
                                            <div className="text-sm text-muted-foreground">Discount at 1000 pts</div>
                                        </div>
                                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-300">Free</div>
                                            <div className="text-sm text-muted-foreground">Service at 2000 pts</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
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
                                    {appointments.map(apt => (
                                        <div key={apt.id} className="p-4 sm:p-6 bg-card rounded-lg border shadow hover:shadow-lg transition-all">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <h3 className="text-lg font-bold">{apt.service}</h3>
                                                        <Badge variant={getStatusBadgeVariant(apt.status)}>
                                                            {apt.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="space-y-1 text-sm text-muted-foreground">
                                                        <p className="flex items-center"><User className="mr-2 h-4 w-4" /> Technician: <span className="font-medium ml-1">{apt.technician}</span></p>
                                                        <p className="flex items-center"><Smartphone className="mr-2 h-4 w-4" /> Device: <span className="font-medium ml-1">{apt.device}</span></p>
                                                        <p className="flex items-center"><Calendar className="mr-2 h-4 w-4" /> Date: <span className="font-medium ml-1">{apt.date}</span></p>
                                                        <p className="flex items-center"><Clock className="mr-2 h-4 w-4" /> Time: <span className="font-medium ml-1">{apt.time}</span></p>
                                                        <p className="text-lg font-bold text-primary mt-2">
                                                            LKR {apt.price.toLocaleString()}
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
                                    ))}
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {favorites.map(tech => (
                                        <div key={tech.id} className="p-6 bg-card rounded-lg border shadow hover:shadow-lg transition-all">
                                            <div className="flex items-center gap-4 mb-4">
                                                <Avatar className="h-16 w-16 border-2 border-primary">
                                                    <AvatarImage src={tech.avatar} alt={tech.name} />
                                                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                                                        {tech.name.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-bold">{tech.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{tech.specialty}</p>
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
                                    {recentActivity.map(activity => (
                                        <div key={activity.id} className="flex items-start gap-4 p-4 bg-muted rounded-lg hover:bg-accent transition-all">
                                            <div className="w-3 h-3 bg-primary rounded-full mt-1.5"></div>
                                            <div className="flex-1">
                                                <p className="font-semibold">{activity.action}</p>
                                                <p className="text-sm text-muted-foreground">{activity.detail}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {activity.date} at {activity.time}
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
