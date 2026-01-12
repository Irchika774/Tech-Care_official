import { useState, useEffect } from 'react';
import { bookingsAPI, reviewsAPI } from '../lib/api';
import {
  Calendar,
  Clock,
  User,
  DollarSign,
  Star,
  History as HistoryIcon,
  MoreVertical,
  CalendarDays
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const History = () => {
  const [filter, setFilter] = useState('all');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Reschedule State
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newDate, setNewDate] = useState(new Date());

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getAll({ limit: 50 }); // Fetch more for history
      const data = response.data?.bookings || [];

      const formattedData = data.map(apt => ({
        id: apt.id,
        date: apt.scheduled_date ? format(new Date(apt.scheduled_date), 'yyyy-MM-dd') : 'N/A',
        time: apt.scheduled_date ? format(new Date(apt.scheduled_date), 'hh:mm a') : 'TBD',
        technician: apt.technician?.name || 'Pending Assignment',
        technicianId: apt.technician?.id,
        service: apt.issue_description || 'Repair Service',
        device: `${apt.device_brand} ${apt.device_model}`,
        status: apt.status || 'pending',
        price: apt.estimated_cost ? `LKR ${apt.estimated_cost}` : 'TBD',
        rating: apt.rating || null,
        rawDate: apt.scheduled_date // Keep raw for logic
      }));
      setAppointments(formattedData);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: "Error fetching history",
        description: "Could not load your appointment history.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment? This action cannot be undone.")) {
      return;
    }

    try {
      await bookingsAPI.cancel(id);
      toast({
        title: "Booking Cancelled",
        description: "Your appointment has been successfully cancelled.",
      });
      fetchHistory(); // Refresh list
    } catch (error) {
      console.error('Cancel error:', error);
      toast({
        title: "Cancellation Failed",
        description: error.response?.data?.error || "Could not cancel booking.",
        variant: "destructive"
      });
    }
  };

  const openReschedule = (booking) => {
    setSelectedBooking(booking);
    setNewDate(new Date(booking.rawDate || Date.now()));
    setIsRescheduleOpen(true);
  };

  const openReview = (booking) => {
    setSelectedBooking(booking);
    setReviewData({ rating: 5, comment: '' });
    setIsReviewOpen(true);
  };

  const handleRescheduleSubmit = async () => {
    if (!selectedBooking || !newDate) return;

    try {
      await bookingsAPI.reschedule(selectedBooking.id, newDate.toISOString());
      toast({
        title: "Rescheduled Successfully",
        description: `Your appointment is now set for ${format(newDate, 'PPP')}.`,
      });
      setIsRescheduleOpen(false);
      fetchHistory();
    } catch (error) {
      console.error('Reschedule error:', error);
      toast({
        title: "Reschedule Failed",
        description: error.response?.data?.error || "Could not reschedule booking.",
        variant: "destructive"
      });
    }
  };

  const handleReviewSubmit = async () => {
    if (!selectedBooking) return;
    setReviewLoading(true);
    try {
      await reviewsAPI.create({
        bookingId: selectedBooking.id,
        technicianId: selectedBooking.technicianId,
        rating: reviewData.rating,
        comment: reviewData.comment
      });

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
      setIsReviewOpen(false);
      fetchHistory();
    } catch (error) {
      console.error('Review error:', error);
      toast({
        title: "Submission Failed",
        description: error.response?.data?.error || "Could not submit review.",
        variant: "destructive"
      });
    } finally {
      setReviewLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed': return 'default'; // primary/black
      case 'scheduled': return 'default';
      case 'confirmed': return 'secondary';
      case 'pending': return 'outline';
      case 'cancelled': return 'destructive';
      case 'in_progress': return 'secondary';
      default: return 'outline';
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-300'}`}
      />
    ));
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Service History</h1>
          <p className="text-lg text-muted-foreground">
            Track all your past and upcoming appointments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <CalendarDays className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px] bg-muted/50">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="scheduled">Upcoming</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6 space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="overflow-hidden border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-3 bg-muted/20">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getStatusVariant(appointment.status)} className="capitalize">
                          {appointment.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {appointment.date}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {appointment.time}
                        </span>
                      </div>
                      <CardTitle className="text-xl">{appointment.device}</CardTitle>
                      <p className="text-sm text-muted-foreground">{appointment.service}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {['pending', 'confirmed', 'scheduled'].includes(appointment.status) && (
                          <>
                            <DropdownMenuItem onClick={() => openReschedule(appointment)}>Reschedule</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleCancel(appointment.id)}>
                              Cancel Appointment
                            </DropdownMenuItem>
                          </>
                        )}
                        {['completed', 'cancelled'].includes(appointment.status) && (
                          <>
                            <DropdownMenuItem>Book Again</DropdownMenuItem>
                            {appointment.status === 'completed' && (
                              <DropdownMenuItem onClick={() => openReview(appointment)}>Leave Review</DropdownMenuItem>
                            )}
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 pb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Technician</p>
                        <p className="text-sm text-muted-foreground">{appointment.technician}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Estimated Cost</p>
                        <p className="text-sm text-muted-foreground">{appointment.price}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t bg-muted/20 flex justify-between items-center">
                  <div>
                    {appointment.rating && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Your Rating:</span>
                        <div className="flex gap-0.5">{renderStars(appointment.rating)}</div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {['pending', 'confirmed', 'scheduled'].includes(appointment.status) && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => openReschedule(appointment)}>Reschedule</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleCancel(appointment.id)}>Cancel</Button>
                      </>
                    )}
                    {['completed', 'cancelled'].includes(appointment.status) && (
                      <Button variant="ghost" size="sm">Book Again</Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card className="text-center py-16 border-dashed">
              <CardContent>
                <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HistoryIcon className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No appointments found</h3>
                <p className="text-muted-foreground mb-6">
                  You don&apos;t have any {filter !== 'all' ? filter : ''} appointments yet.
                </p>
                <Button onClick={() => setFilter('all')} variant="outline">
                  View All History
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Reschedule Dialog */}
      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Select a new date for your service. Changes must be made 24 hours in advance.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 justify-center">
            <CalendarComponent
              mode="single"
              selected={newDate}
              onSelect={setNewDate}
              disabled={(date) => date < new Date()}
              initialFocus
              className="rounded-md border"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRescheduleOpen(false)}>Cancel</Button>
            <Button onClick={handleRescheduleSubmit}>Confirm New Date</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
            <DialogDescription>How was your service with {selectedBooking?.technician}?</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer ${star <= reviewData.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                  onClick={() => setReviewData({ ...reviewData, rating: star })}
                />
              ))}
            </div>
            <textarea
              className="w-full h-24 p-2 border rounded-md"
              placeholder="Share your feedback..."
              value={reviewData.comment}
              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewOpen(false)}>Cancel</Button>
            <Button onClick={handleReviewSubmit} disabled={reviewLoading}>Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default History;
