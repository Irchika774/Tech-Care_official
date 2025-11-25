import { useState } from 'react';
import {
  Calendar,
  Clock,
  Smartphone,
  User,
  DollarSign,
  Star,
  History as HistoryIcon,
  Filter,
  MoreVertical,
  CalendarDays
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";

const History = () => {
  const [filter, setFilter] = useState('all');

  const appointments = [
    {
      id: 1,
      date: '2025-10-28',
      time: '2:00 PM',
      technician: 'Mobile Wizards',
      service: 'Screen Repair',
      device: 'iPhone 14 Pro',
      status: 'completed',
      price: '$150',
      rating: 5
    },
    {
      id: 2,
      date: '2025-10-15',
      time: '11:00 AM',
      technician: 'Circuit Masters',
      service: 'Hardware Upgrade',
      device: 'Custom PC',
      status: 'completed',
      price: '$300',
      rating: 5
    },
    {
      id: 3,
      date: '2025-11-05',
      time: '3:00 PM',
      technician: 'Tech Solutions Hub',
      service: 'Data Recovery',
      device: 'MacBook Pro',
      status: 'upcoming',
      price: '$200',
      rating: null
    },
    {
      id: 4,
      date: '2025-09-20',
      time: '10:00 AM',
      technician: 'Fone Fixers',
      service: 'Battery Replacement',
      device: 'Samsung Galaxy S23',
      status: 'completed',
      price: '$80',
      rating: 4
    },
    {
      id: 5,
      date: '2025-10-30',
      time: '1:00 PM',
      technician: 'ProFix Electronics',
      service: 'Virus Removal',
      device: 'Desktop PC',
      status: 'cancelled',
      price: '$100',
      rating: null
    }
  ];

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'default'; // Green-ish usually
      case 'upcoming':
        return 'secondary'; // Blue-ish usually
      case 'cancelled':
        return 'destructive'; // Red-ish usually
      default:
        return 'outline';
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`}
      />
    ));
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
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
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6 space-y-6">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getStatusVariant(appointment.status)}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
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
                      <CardTitle className="text-xl">{appointment.service}</CardTitle>
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
                        <DropdownMenuItem>Download Invoice</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {appointment.status === 'upcoming' ? (
                          <>
                            <DropdownMenuItem>Reschedule</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Cancel Appointment</DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem>Book Again</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Smartphone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Device</p>
                        <p className="text-sm text-muted-foreground">{appointment.device}</p>
                      </div>
                    </div>
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
                        <p className="text-sm font-medium">Price</p>
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
                    {appointment.status === 'completed' && !appointment.rating && (
                      <Button size="sm">Leave Review</Button>
                    )}
                    {appointment.status === 'upcoming' && (
                      <>
                        <Button variant="outline" size="sm">Reschedule</Button>
                        <Button variant="destructive" size="sm">Cancel</Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm">View Details</Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card className="text-center py-16">
              <CardContent>
                <div className="bg-muted/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HistoryIcon className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No appointments found</h3>
                <p className="text-muted-foreground mb-6">
                  You don&apos;t have any {filter !== 'all' ? filter : ''} appointments yet.
                </p>
                <Button onClick={() => setFilter('all')}>
                  View All History
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default History;
