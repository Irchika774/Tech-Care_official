
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { format, isSameDay, setHours, setMinutes, isAfter } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { servicesAPI } from '../lib/api';
import {
  Smartphone,
  Laptop,
  Monitor,
  Battery,
  Droplets,
  Wrench,
  User,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  MapPin,
  CreditCard,
  ArrowRight,
  CalendarCheck,
  Shield,
  Star,
  Zap,
  ChevronLeft,
  Loader2,
  Search,
  Filter
} from 'lucide-react';
import SEO from '../components/SEO';
import CurrencyDisplay from '../components/CurrencyDisplay';
import { useToast } from '../hooks/use-toast';
import { PLATFORM_FEES } from '../lib/constants';

const Schedule = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const initialData = location.state || {};

  const [step, setStep] = useState(() => {
    if (initialData.paymentConfirmed) return 2;
    return 1;
  });

  const [isSuccess, setIsSuccess] = useState(false);

  // Form States
  const [deviceType, setDeviceType] = useState(() => {
    if (initialData.service === 'PC Repair') return 'pc';
    if (initialData.deviceType) return initialData.deviceType;
    return localStorage.getItem('techcare_booking_deviceType') || 'smartphone';
  });

  const [deviceBrand, setDeviceBrand] = useState(() => localStorage.getItem('techcare_booking_brand') || '');
  const [deviceModel, setDeviceModel] = useState(() => localStorage.getItem('techcare_booking_model') || '');
  const [repairService, setRepairService] = useState(() => localStorage.getItem('techcare_booking_service') || 'general');
  const [issueDescription, setIssueDescription] = useState(() => initialData.service || localStorage.getItem('techcare_booking_description') || '');
  const [technician, setTechnician] = useState(() => {
    if (initialData.technician) return initialData.technician.id || initialData.technician._id;
    return localStorage.getItem('techcare_booking_tech') || 'pending';
  });

  const [techAvailability, setTechAvailability] = useState([]);

  // Schedule States
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState('');

  // Data States
  const [techniciansList, setTechnicians] = useState([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter States
  const [techSearchTerm, setTechSearchTerm] = useState('');
  const [techMinRating, setTechMinRating] = useState('0');
  const [techShowOnlyVerified, setTechShowOnlyVerified] = useState(false);
  const [showTechFilters, setShowTechFilters] = useState(false);

  // Persistence
  useEffect(() => {
    if (step === 1 && !isSuccess) {
      localStorage.setItem('techcare_booking_deviceType', deviceType);
      localStorage.setItem('techcare_booking_brand', deviceBrand);
      localStorage.setItem('techcare_booking_model', deviceModel);
      localStorage.setItem('techcare_booking_service', repairService);
      localStorage.setItem('techcare_booking_description', issueDescription);
      localStorage.setItem('techcare_booking_tech', technician);
    }
  }, [deviceType, deviceBrand, deviceModel, repairService, issueDescription, technician, step, isSuccess]);

  // Auth & Role Check
  useEffect(() => {
    if (user && ['technician', 'admin'].includes(user.role)) {
      toast({
        title: "Access Restricted",
        description: "Staff accounts cannot create bookings.",
        variant: "destructive"
      });
      navigate(user.role === 'technician' ? '/technician-dashboard' : '/admin');
    }
  }, [user, navigate, toast]);

  // Data Fetching
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data: services, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (services?.length) setAvailableServices(services);
        else {
          setAvailableServices([
            { id: 'battery', name: 'Battery Replacement', price: 1500 },
            { id: 'screen', name: 'Screen Repair', price: 2500 },
            { id: 'water-damage', name: 'Water Damage', price: 3000 },
            { id: 'general', name: 'General Repair', price: 1000 },
          ]);
        }
      } catch (err) {
        console.error("Services fetch error:", err);
      }
    };

    const fetchTechnicians = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const techRes = await fetch(`${apiUrl}/api/technicians`);
        const techData = await techRes.json();
        setTechnicians(Array.isArray(techData) ? techData : []);
      } catch (err) {
        console.error("Technician fetch error:", err);
      }
    };

    fetchServices();
    fetchTechnicians();
  }, []);

  // Fetch technician specific services when a technician is selected
  useEffect(() => {
    const fetchTechServices = async () => {
      if (!technician || technician === 'pending') {
        // Reset to global services if no technician selected
        const { data: services } = await supabase.from('services').select('*');
        if (services) setAvailableServices(services);
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/technicians/${technician}/services`);
        const result = await res.json();

        if (result.success && result.data?.length > 0) {
          setAvailableServices(result.data);
          // If current repairService is not in the new list, reset to first or general
          if (!result.data.find(s => (s.id || s._id) === repairService)) {
            setRepairService(result.data[0].id || result.data[0]._id);
          }
        } else {
          // Fallback to global services if tech has none defined
          const { data: services } = await supabase.from('services').select('*');
          if (services) setAvailableServices(services);
        }
      } catch (err) {
        console.error("Error fetching tech services:", err);
      }
    };

    fetchTechServices();
  }, [technician]);

  // Fetch technician availability
  useEffect(() => {
    const fetchTechAvail = async () => {
      if (!technician || technician === 'pending') {
        setTechAvailability([]);
        return;
      }
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/technicians/${technician}/availability`);
        const result = await res.json();
        if (result.success) setTechAvailability(result.data);
      } catch (err) {
        console.error("Error fetching tech availability:", err);
      }
    };
    fetchTechAvail();
  }, [technician]);

  // Pricing Calculation
  const selectedServiceInfo = availableServices.find(s => (s.id || s._id) === repairService) || availableServices.find(s => (s.id || s._id) === 'general');
  const serviceAmount = Number(selectedServiceInfo?.price || 0);
  const platformFee = PLATFORM_FEES.BOOKING_FEE;
  const totalAmount = serviceAmount + platformFee;

  // Smart Time Slots
  const availableTimeSlots = useMemo(() => {
    const defaultSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

    // If technician selected, find their availability for this day of week
    let daySlots = defaultSlots;
    if (technician !== 'pending' && techAvailability.length > 0) {
      const dayOfWeek = date.getDay(); // 0-6
      const daySetting = techAvailability.find(a => a.day_of_week === dayOfWeek);

      if (daySetting) {
        if (!daySetting.is_available) return []; // Not working this day

        // Filter slots based on start/end time
        const start = daySetting.start_time; // HH:mm:ss
        const end = daySetting.end_time;

        daySlots = defaultSlots.filter(slot => {
          const [time, period] = slot.split(' ');
          const [hours, minutes] = time.split(':').map(Number);
          let hours24 = period === 'PM' && hours !== 12 ? hours + 12 : (period === 'AM' && hours === 12 ? 0 : hours);
          const slotTime = `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          return slotTime >= start.slice(0, 5) && slotTime < end.slice(0, 5);
        });
      }
    }

    if (!date || !isSameDay(date, new Date())) return daySlots;

    const now = new Date();
    return daySlots.filter(slot => {
      const [time, period] = slot.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let slotDate = setHours(date, period === 'PM' && hours !== 12 ? hours + 12 : (period === 'AM' && hours === 12 ? 0 : hours));
      slotDate = setMinutes(slotDate, minutes);
      return isAfter(slotDate, now);
    });
  }, [date, technician, techAvailability]);

  useEffect(() => {
    // Reset time slot if date changes and current slot becomes invalid
    if (timeSlot && !availableTimeSlots.includes(timeSlot)) {
      setTimeSlot('');
    }
  }, [date, availableTimeSlots, timeSlot]);

  // Apply technician filters
  useEffect(() => {
    let filtered = [...techniciansList];

    if (techSearchTerm.trim()) {
      const search = techSearchTerm.toLowerCase();
      filtered = filtered.filter(tech =>
        tech.name?.toLowerCase().includes(search) ||
        tech.business_name?.toLowerCase().includes(search) ||
        tech.bio?.toLowerCase().includes(search) ||
        tech.services?.some(s => s.toLowerCase().includes(search)) ||
        tech.specialization?.some(s => s.toLowerCase().includes(search))
      );
    }

    const minRating = parseFloat(techMinRating);
    if (minRating > 0) {
      filtered = filtered.filter(tech => (tech.rating || 0) >= minRating);
    }

    if (techShowOnlyVerified) {
      filtered = filtered.filter(tech => tech.is_verified === true);
    }

    setFilteredTechnicians(filtered);
  }, [techniciansList, techSearchTerm, techMinRating, techShowOnlyVerified]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: '/schedule', ...initialData } });
      return;
    }

    setLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    try {
      if (step === 1) {
        // Initialize Booking & Payment
        const payload = {
          technician_id: technician === 'pending' ? null : technician,
          device_type: deviceType,
          device_brand: deviceBrand || 'Generic',
          device_model: deviceModel || 'Unknown',
          issue_description: issueDescription || selectedServiceInfo?.name,
          status: 'pending',
          estimated_cost: totalAmount
        };

        const res = await fetch(`${apiUrl}/api/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Booking initialization failed');
        const bookingResponse = await res.json();
        const bookingData = bookingResponse.data;

        navigate('/payment', {
          state: {
            booking: { ...bookingData, total: totalAmount, serviceType: selectedServiceInfo?.name, technicianName: techniciansList.find(t => t.id === (technician === 'pending' ? null : technician))?.name }
          }
        });
      } else if (step === 2) {
        // Finalize Schedule
        const bookingId = initialData.booking?.id || initialData.booking?._id;
        if (!bookingId) throw new Error('Missing booking reference');

        const res = await fetch(`${apiUrl}/api/bookings/${bookingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            scheduled_date: date.toISOString(),
            time_slot: timeSlot,
            status: 'confirmed'
          })
        });

        if (!res.ok) throw new Error('Failed to confirm schedule');

        setIsSuccess(true);
        // Clean up storage
        ['deviceType', 'brand', 'model', 'service', 'description', 'tech'].forEach(key =>
          localStorage.removeItem(`techcare_booking_${key}`)
        );
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <SEO title="Booking Confirmed - TechCare" />
        <Card className="max-w-md w-full bg-zinc-900 border-zinc-800 text-center p-8 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2">All Set!</h2>
          <p className="text-zinc-400 mb-8">
            Your repair appointment has been confirmed for <br />
            <span className="text-white font-semibold">
              {format(date, 'MMMM d, yyyy')} at {timeSlot}
            </span>
          </p>
          <div className="space-y-4">
            <Button
              onClick={() => navigate('/customer-dashboard')}
              className="w-full h-12 text-lg bg-primary hover:bg-primary-dark"
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen pb-20">
      <SEO title="Schedule Repair - TechCare" description="Book your device repair today." />

      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-zinc-400 hover:text-white">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex gap-2">
            <div className={`h-2 w-12 rounded-full transition-colors ${step === 1 ? 'bg-primary' : 'bg-zinc-700'}`} />
            <div className={`h-2 w-12 rounded-full transition-colors ${step === 2 ? 'bg-primary' : 'bg-zinc-700'}`} />
          </div>
          <div className="w-16" /> {/* Spacer */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
            {step === 1 ? 'Configure Your Repair' : 'Select a Time Slot'}
          </h1>
          <p className="text-zinc-400">
            {step === 1 ? 'Tell us about your device and choose a service.' : 'Pick a convenient time for our technician to visit.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">

            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                {/* Device Type Selection */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader><CardTitle className="flex items-center gap-2"><Monitor className="w-5 h-5 text-primary" /> Device Type</CardTitle></CardHeader>
                  <CardContent>
                    <RadioGroup value={deviceType} onValueChange={setDeviceType} className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'smartphone', icon: Smartphone, label: 'Phone' },
                        { id: 'laptop', icon: Laptop, label: 'Laptop' },
                        { id: 'pc', icon: Monitor, label: 'Desktop' }
                      ].map((item) => (
                        <div key={item.id}>
                          <RadioGroupItem value={item.id} id={item.id} className="sr-only peer" />
                          <Label htmlFor={item.id} className="cursor-pointer flex flex-col items-center gap-3 p-4 rounded-xl border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary transition-all">
                            <item.icon className="w-8 h-8" />
                            <span className="font-medium">{item.label}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Details */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Device Details</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-zinc-400">Brand</Label>
                        <Input
                          required
                          placeholder="e.g. Apple"
                          value={deviceBrand}
                          onChange={e => setDeviceBrand(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-zinc-400">Model</Label>
                        <Input
                          required
                          placeholder="e.g. iPhone 13"
                          value={deviceModel}
                          onChange={e => setDeviceModel(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-400">Service</Label>
                      <Select value={repairService} onValueChange={setRepairService}>
                        <SelectTrigger className="w-full h-12 bg-zinc-950 border-zinc-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                          {availableServices.map(s => (
                            <SelectItem key={s.id || s._id} value={s.id || s._id} className="focus:bg-zinc-800 focus:text-white cursor-pointer">
                              <div className="flex justify-between items-center w-full gap-4">
                                <span>{s.name}</span>
                                <span className="text-zinc-400"><CurrencyDisplay amount={s.price} /></span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Technician Selection */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Select Technician</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTechFilters(!showTechFilters)}
                      className="text-zinc-400 hover:text-white mt-2"
                    >
                      <Filter className="w-4 h-4 mr-1" />
                      {showTechFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {/* Filter Controls */}
                    {showTechFilters && (
                      <div className="mb-4 p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-3 animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-2">
                          <Search className="w-4 h-4 text-zinc-500" />
                          <Input
                            placeholder="Search technicians..."
                            value={techSearchTerm}
                            onChange={(e) => setTechSearchTerm(e.target.value)}
                            className="bg-zinc-900 border-zinc-800"
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Label className="text-zinc-400 text-xs">Min Rating:</Label>
                            <Select value={techMinRating} onValueChange={setTechMinRating}>
                              <SelectTrigger className="w-20 h-8 bg-zinc-900 border-zinc-800">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectItem value="0">Any</SelectItem>
                                <SelectItem value="3">3+ ⭐</SelectItem>
                                <SelectItem value="4">4+ ⭐</SelectItem>
                                <SelectItem value="4.5">4.5+ ⭐</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="verify-filter"
                              checked={techShowOnlyVerified}
                              onCheckedChange={(checked) => setTechShowOnlyVerified(checked === true)}
                            />
                            <Label htmlFor="verify-filter" className="text-zinc-400 text-xs">Verified Only</Label>
                          </div>
                        </div>
                        {filteredTechnicians.length !== techniciansList.length && (
                          <p className="text-xs text-zinc-500">
                            Showing {filteredTechnicians.length} of {techniciansList.length} technicians
                          </p>
                        )}
                      </div>
                    )}
                    <RadioGroup value={technician} onValueChange={setTechnician} className="space-y-3">
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900/80 cursor-pointer">
                        <RadioGroupItem value="pending" id="tech-auto" />
                        <Label htmlFor="tech-auto" className="flex-1 cursor-pointer flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary"><Zap className="w-5 h-5" /></div>
                          <div>
                            <p className="font-medium">Auto-assign Best Available</p>
                            <p className="text-xs text-zinc-500">Fastest response time guaranteed</p>
                          </div>
                        </Label>
                      </div>
                      <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-3">
                          {filteredTechnicians.length > 0 ? (
                            filteredTechnicians.map(tech => (
                              <div key={tech.id} className="flex items-center space-x-2 p-3 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900/80 cursor-pointer">
                                <RadioGroupItem value={tech.id} id={`tech-${tech.id}`} />
                                <Label htmlFor={`tech-${tech.id}`} className="flex-1 cursor-pointer flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={tech.avatar_url} />
                                    <AvatarFallback>{tech.name?.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium">{tech.name}</p>
                                      {tech.is_verified && (
                                        <Badge variant="secondary" className="text-xs bg-emerald-900/50 text-emerald-300 border-emerald-700">
                                          ✓ Verified
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-amber-500 flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> {tech.rating || 'New'}</p>
                                  </div>
                                </Label>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-zinc-500">
                              <p>No technicians match your filters</p>
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => {
                                  setTechSearchTerm('');
                                  setTechMinRating('0');
                                  setTechShowOnlyVerified(false);
                                }}
                                className="text-primary"
                              >
                                Clear filters
                              </Button>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1">
                        <Label className="block text-lg font-semibold mb-4 flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-primary" /> Select Date</Label>
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(d) => d && setDate(d)}
                          disabled={(d) => d < new Date().setHours(0, 0, 0, 0)}
                          className="rounded-lg border border-zinc-800 bg-zinc-950"
                        />
                      </div>
                      <div className="flex-1">
                        <Label className="block text-lg font-semibold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Available Time</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {availableTimeSlots.length > 0 ? availableTimeSlots.map(slot => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTimeSlot(slot)}
                              className={`p-3 rounded-lg text-sm font-medium transition-all ${timeSlot === slot ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-zinc-300'}`}
                            >
                              {slot}
                            </button>
                          )) : (
                            <p className="col-span-2 text-zinc-500 text-center py-8">No available slots for this date.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="bg-zinc-900/80 backdrop-blur border-zinc-800 shadow-xl">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Service</span>
                    <span>{selectedServiceInfo?.name || 'Unknown Service'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Device</span>
                    <span>{deviceBrand} {deviceModel}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Technician</span>
                    <span>{technician === 'pending' ? 'Auto-assign' : techniciansList.find(t => t.id === technician)?.name || 'Selected'}</span>
                  </div>
                  <div className="border-t border-zinc-800 pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary"><CurrencyDisplay amount={totalAmount} /></span>
                  </div>

                  {step === 2 && (
                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-sm text-green-400">
                      <CheckCircle2 className="w-5 h-5" /> Payment Confirmed
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading || (step === 2 && !timeSlot)}
                    className="w-full h-12 text-lg font-semibold bg-white text-black hover:bg-zinc-200 mt-4"
                  >
                    {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                    {step === 1 ? 'Proceed to Pay' : 'Confirm Appointment'}
                  </Button>
                </CardContent>
              </Card>

              <div className="flex gap-4 flex-wrap justify-center text-xs text-zinc-500">
                <div className="flex items-center gap-1"><Shield className="w-3 h-3" /> Verified Techs</div>
                <div className="flex items-center gap-1"><Zap className="w-3 h-3" /> Fast Service</div>
                <div className="flex items-center gap-1"><Star className="w-3 h-3" /> 4.8/5 Rated</div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Schedule;
