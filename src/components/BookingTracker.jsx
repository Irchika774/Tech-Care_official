import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2, CheckCircle2, Clock, MapPin, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function BookingTracker({ bookingId: propBookingId }) {
    const { bookingId: paramBookingId } = useParams();
    const bookingId = propBookingId || paramBookingId;
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!bookingId) return;

        const fetchBooking = async () => {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    technician:technicians(name, phone, rating, latitude, longitude)
                `)
                .eq('id', bookingId)
                .single();

            if (!error) setBooking(data);
            setLoading(false);
        };

        fetchBooking();

        // Subscribe to real-time updates
        const channel = supabase
            .channel(`booking-tracker-${bookingId}`)
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
    }, [bookingId]);

    if (loading) return <Loader2 className="animate-spin h-8 w-8 mx-auto" />;
    if (!booking) return <div>Booking not found.</div>;

    const steps = [
        { label: 'Confirmed', status: ['confirmed', 'scheduled', 'in_progress', 'completed'], icon: CheckCircle2 },
        { label: 'Technician En Route', status: ['in_progress', 'completed'], icon: MapPin },
        { label: 'Repair in Progress', status: ['in_progress', 'completed'], icon: Clock },
        { label: 'Completed', status: ['completed'], icon: CheckCircle2 },
    ];

    const currentStepIndex = steps.findIndex(step => !step.status.includes(booking.status)) - 1;
    const finalIndex = currentStepIndex === -2 ? steps.length - 1 : currentStepIndex;

    return (
        <Card className="w-full max-w-2xl mx-auto overflow-hidden">
            <CardHeader className="bg-primary/5 border-b">
                <div className="flex justify-between items-center">
                    <CardTitle>Repair Status</CardTitle>
                    <Badge variant={booking.status === 'completed' ? 'success' : 'secondary'}>
                        {booking.status.toUpperCase()}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-8">
                <div className="relative flex justify-between">
                    {/* Progress Line */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10" />
                    <div 
                        className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 -z-10" 
                        style={{ width: `${(finalIndex / (steps.length - 1)) * 100}%` }}
                    />
                    
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index <= finalIndex;
                        return (
                            <div key={index} className="flex flex-col items-center gap-2 bg-background px-2">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                                    isActive ? 'border-primary bg-primary text-primary-foreground' : 'border-muted bg-background text-muted-foreground'
                                }`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <span className={`text-xs font-medium text-center max-w-[80px] ${
                                    isActive ? 'text-primary' : 'text-muted-foreground'
                                }`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {booking.technician && (
                    <div className="mt-12 p-4 border rounded-xl bg-muted/30 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xl font-bold text-primary">{booking.technician.name[0]}</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold">{booking.technician.name}</h4>
                            <p className="text-sm text-muted-foreground">Your assigned technician</p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                            <a href={`tel:${booking.technician.phone}`}>
                                <Phone className="h-4 w-4 mr-2" />
                                Call
                            </a>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
