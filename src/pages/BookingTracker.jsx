import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import CurrencyDisplay from '../components/CurrencyDisplay';
import SEO from '../components/SEO';
import {
    CheckCircle,
    Clock,
    MapPin,
    Phone,
    MessageCircle,
    Star,
    Package,
    Wrench,
    Truck,
    Sparkles,
    ArrowLeft,
    Loader2,
    AlertCircle,
    Calendar,
    User
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

const BookingTracker = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { user, session } = useAuth(); // Get session
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const statusSteps = [
        { key: 'pending', label: 'Submitted', icon: Package, description: 'Booking received' },
        { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, description: 'Technician assigned' },
        { key: 'in_progress', label: 'In Progress', icon: Wrench, description: 'Repair underway' },
        { key: 'completed', label: 'Completed', icon: Sparkles, description: 'Service finished' }
    ];

    const getStatusIndex = (status) => {
        const index = statusSteps.findIndex(s => s.key === status);
        return index >= 0 ? index : 0;
    };

    useEffect(() => {
        if (!bookingId || !user) return;

        const fetchBooking = async () => {
            try {
                setLoading(true);
                // Use session from context
                let token = session?.access_token;
                if (!token) {
                    const { data: { session: currentSession } } = await supabase.auth.getSession();
                    token = currentSession?.access_token;
                }

                if (!token) {
                    throw new Error('Authentication required');
                }

                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await fetch(`${apiUrl}/api/bookings/${bookingId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch booking details');
                }

                const data = await response.json();
                setBooking(data.booking);
            } catch (err) {
                console.error('Error fetching booking:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();

        // Subscribe to real-time updates
        const channel = supabase
            .channel(`booking-${bookingId}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'bookings', filter: `id=eq.${bookingId}` },
                (payload) => {
                    setBooking(prev => ({ ...prev, ...payload.new }));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [bookingId, user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-white mx-auto" />
                    <p className="mt-4 text-zinc-400">Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Card className="bg-zinc-900 border-zinc-800 max-w-md mx-4">
                    <CardContent className="text-center py-12 px-8">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">Booking Not Found</h2>
                        <p className="text-zinc-400 mb-6">{error || "We couldn't find this booking."}</p>
                        <Button onClick={() => navigate(-1)} variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentStatusIndex = getStatusIndex(booking.status);
    const progress = ((currentStatusIndex + 1) / statusSteps.length) * 100;

    return (
        <div className="min-h-screen bg-black text-white">
            <SEO
                title={`Tracking Booking - TechCare`}
                description="Track your device repair booking status in real-time."
            />

            {/* Background Effects */}
            <div className="fixed inset-0 bg-black pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <div className="relative border-b border-zinc-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(user?.role === 'technician' ? '/technician-dashboard' : '/customer-dashboard')}
                        className="text-zinc-400 hover:text-white mb-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <div className="flex items-center justify-between">
                        <div>
                            <Badge className="mb-2 bg-white/10 text-white border-white/30">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Booking Tracker
                            </Badge>
                            <h1 className="text-2xl sm:text-3xl font-bold">
                                {booking.device_brand} {booking.device_model}
                            </h1>
                            <p className="text-zinc-400 mt-1">
                                Booking ID: {booking.id?.slice(0, 8)}...
                            </p>
                        </div>
                        <Badge
                            className={`text-sm px-4 py-2 ${booking.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                booking.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                    booking.status === 'confirmed' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                }`}
                        >
                            {booking.status?.replace('_', ' ').toUpperCase()}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Progress Tracker */}
                <Card className="bg-zinc-900 border-zinc-800 mb-6">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Repair Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Progress value={progress} className="h-2 mb-6" />
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {statusSteps.map((step, index) => {
                                const isActive = index <= currentStatusIndex;
                                const isCurrent = index === currentStatusIndex;
                                return (
                                    <div
                                        key={step.key}
                                        className={`text-center p-4 rounded-xl transition-all ${isCurrent ? 'bg-white/10 border border-white/20' :
                                            isActive ? 'bg-zinc-800/50' : 'opacity-50'
                                            }`}
                                    >
                                        <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isActive ? 'bg-white text-black' : 'bg-zinc-700 text-zinc-400'
                                            }`}>
                                            <step.icon className="h-6 w-6" />
                                        </div>
                                        <p className={`font-semibold ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                                            {step.label}
                                        </p>
                                        <p className="text-xs text-zinc-400 mt-1">{step.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Booking Details */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white">Booking Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Package className="h-5 w-5 text-zinc-400 mt-1" />
                                <div>
                                    <p className="text-sm text-zinc-400">Device</p>
                                    <p className="text-white">{booking.device_type} - {booking.device_brand} {booking.device_model}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Wrench className="h-5 w-5 text-zinc-400 mt-1" />
                                <div>
                                    <p className="text-sm text-zinc-400">Issue</p>
                                    <p className="text-white">{booking.issue_description || 'General repair'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-zinc-400 mt-1" />
                                <div>
                                    <p className="text-sm text-zinc-400">Scheduled Date</p>
                                    <p className="text-white">
                                        {booking.scheduled_date ? format(new Date(booking.scheduled_date), 'PPP') : 'TBD'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-zinc-400 mt-1" />
                                <div>
                                    <p className="text-sm text-zinc-400">Estimated Cost</p>
                                    <p className="text-white font-semibold">
                                        <CurrencyDisplay amount={booking.estimated_cost || booking.price} />
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Technician Info */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white">Assigned Technician</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {booking.technician ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-16 w-16 border-2 border-zinc-700">
                                            <AvatarImage src={booking.technician.profile_image} />
                                            <AvatarFallback className="bg-zinc-800 text-white text-xl">
                                                {booking.technician.name?.charAt(0) || 'T'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{booking.technician.name}</h3>
                                            <div className="flex items-center gap-2 text-yellow-500">
                                                <Star className="h-4 w-4 fill-current" />
                                                <span>{booking.technician.rating || '5.0'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-4">
                                        {booking.technician.phone && (
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-zinc-700 text-white hover:bg-zinc-800"
                                                asChild
                                            >
                                                <a href={`tel:${booking.technician.phone}`}>
                                                    <Phone className="mr-2 h-4 w-4" />
                                                    Call
                                                </a>
                                            </Button>
                                        )}
                                        <Button
                                            className="flex-1 bg-white text-black hover:bg-gray-100"
                                            onClick={() => navigate(`/chat/${bookingId}`)}
                                        >
                                            <MessageCircle className="mr-2 h-4 w-4" />
                                            Chat
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <User className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
                                    <p className="text-zinc-400">Technician will be assigned soon</p>
                                    <p className="text-zinc-500 text-sm mt-1">We're finding the best match for your repair</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Timeline */}
                <Card className="bg-zinc-900 border-zinc-800 mt-6">
                    <CardHeader>
                        <CardTitle className="text-white">Activity Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-3 h-3 bg-white rounded-full mt-1.5"></div>
                                <div>
                                    <p className="text-white font-medium">Booking Created</p>
                                    <p className="text-zinc-400 text-sm">
                                        {booking.created_at ? formatDistanceToNow(new Date(booking.created_at), { addSuffix: true }) : 'Recently'}
                                    </p>
                                </div>
                            </div>
                            {booking.status !== 'pending' && (
                                <div className="flex gap-4">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full mt-1.5"></div>
                                    <div>
                                        <p className="text-white font-medium">Booking Confirmed</p>
                                        <p className="text-zinc-400 text-sm">Technician assigned to your repair</p>
                                    </div>
                                </div>
                            )}
                            {booking.status === 'in_progress' && (
                                <div className="flex gap-4">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5"></div>
                                    <div>
                                        <p className="text-white font-medium">Repair In Progress</p>
                                        <p className="text-zinc-400 text-sm">Your device is being repaired</p>
                                    </div>
                                </div>
                            )}
                            {booking.status === 'completed' && (
                                <div className="flex gap-4">
                                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                                    <div>
                                        <p className="text-white font-medium">Repair Completed</p>
                                        <p className="text-zinc-400 text-sm">
                                            {booking.completed_date ? formatDistanceToNow(new Date(booking.completed_date), { addSuffix: true }) : 'Completed'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default BookingTracker;
