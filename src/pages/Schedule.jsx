import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Badge } from '../components/ui/badge';
import { format } from 'date-fns';
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
  Sparkles,
  Shield,
  Star,
  Zap
} from 'lucide-react';
import SEO from '../components/SEO';
import CurrencyDisplay from '../components/CurrencyDisplay';

const Schedule = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Initialize state from location.state if available
  const initialData = location.state || {};

  const [step, setStep] = useState(initialData.paymentConfirmed ? 2 : 1);
  const [deviceType, setDeviceType] = useState(initialData.service === 'PC Repair' ? 'pc' : 'smartphone');
  const [showFlowError, setShowFlowError] = useState(false);

  useEffect(() => {
    // If coming back from payment success, we skip to Step 2
    if (initialData.paymentConfirmed) {
      setStep(2);
    }
  }, [initialData.paymentConfirmed]);

  useEffect(() => {
    // Restrict direct access
    if (!initialData.service && !initialData.technician && step === 1 && !deviceBrand) {
      navigate('/services', { replace: true });
    }
  }, [initialData, navigate, step, deviceBrand]);
  const [deviceBrand, setDeviceBrand] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [repairService, setRepairService] = useState('general');
  const [issueDescription, setIssueDescription] = useState(initialData.service || '');
  const [technician, setTechnician] = useState(initialData.technician?.id || initialData.technician?._id || 'pending');
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState('09:00 AM');
  const [techniciansList, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If a technician was passed in state, make sure they are in the list or handled
    if (initialData.technician) {
      setTechnician(initialData.technician.id || initialData.technician._id);
    }
  }, [initialData]);

  const [availableServices, setAvailableServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await servicesAPI.getAll();
        const servicesList = Array.isArray(data) ? data : (data.services || []);
        if (servicesList.length > 0) {
          setAvailableServices(servicesList);
        }
      } catch (err) {
        console.error("Failed to fetch services", err);
      }
    };
    fetchServices();
  }, []);

  // Compute serviceDetails dynamically
  const serviceDetails = availableServices.length > 0
    ? availableServices.reduce((acc, curr) => ({
      ...acc,
      [curr.id || curr._id]: { label: curr.name, price: Number(curr.price) }
    }), {})
    : {
      battery: { label: 'Battery Replacement', price: 5000 },
      screen: { label: 'Screen Repair', price: 12000 },
      'water-damage': { label: 'Water Damage', price: 8500 },
      general: { label: 'General Repair', price: 4000 }
    };

  const selectedServiceInfo = serviceDetails[repairService] || serviceDetails['general'];
  const serviceAmount = selectedServiceInfo?.price || 4000;
  const platformFee = 500;
  const totalAmount = serviceAmount + platformFee;

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const technicianOptions = techniciansList.reduce((acc, tech) => {
    acc[tech.id] = tech;
    return acc;
  }, {
    pending: { name: 'Auto-assign', rating: 5.0 }
  });

  useEffect(() => {
    const fetchTechs = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/technicians`);
        const data = await response.json();
        setTechnicians(data || []);
      } catch (error) {
        console.error('Error fetching technicians:', error);
      }
    };
    fetchTechs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login', { state: { from: '/schedule', ...initialData } });
      return;
    }

    if (step === 1) {
      // Create pending booking and go to payment
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        const bookingPayload = {
          technician_id: technician === 'pending' ? null : technician,
          device_type: deviceType,
          device_brand: deviceBrand || deviceType,
          device_model: deviceModel || 'Unknown',
          issue_description: issueDescription || selectedServiceInfo?.label,
          status: 'pending_payment',
          estimated_cost: totalAmount
        };

        const response = await fetch(`${apiUrl}/api/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(bookingPayload)
        });

        if (!response.ok) throw new Error('Failed to create initial booking');
        const bookingData = await response.json();

        navigate('/payment', {
          state: {
            booking: {
              ...bookingData,
              total: totalAmount,
              serviceType: selectedServiceInfo?.label
            }
          }
        });
      } catch (error) {
        console.error('Pre-payment booking error:', error);
        alert('Failed to initiate booking.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (step === 2) {
      // Update booking with schedule after payment
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const bookingId = initialData.booking?.id || initialData.booking?._id;

        if (!bookingId) throw new Error('No booking ID found to update schedule');

        const response = await fetch(`${apiUrl}/api/bookings/${bookingId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            scheduled_date: date.toISOString(),
            time_slot: timeSlot,
            status: 'confirmed'
          })
        });

        if (!response.ok) throw new Error('Failed to update schedule');

        toast({
          title: "Schedule Confirmed",
          description: "Your repair has been successfully scheduled!",
        });
        navigate('/customer-dashboard');
      } catch (error) {
        console.error('Scheduling error:', error);
        alert('Failed to save your schedule.');
      } finally {
        setLoading(false);
      }
    }
  };

  const features = [
    { icon: Shield, text: 'Verified Technicians' },
    { icon: Star, text: '4.8/5 Average Rating' },
    { icon: Zap, text: 'Same Day Service' },
    { icon: CheckCircle2, text: '30-Day Warranty' }
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      <SEO
        title="Schedule Repair - TechCare"
        description="Book a certified technician for your device repair. Select your device, service, and preferred time."
        keywords="schedule repair, book technician, repair appointment, device repair booking"
      />

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-6 bg-white/10 text-white border-white/30 backdrop-blur-sm px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Book Your Repair
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Schedule Your Service
            </h1>

            <p className="text-xl text-zinc-400 mb-8">
              Book a certified technician for your device repair in just a few simple steps
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full">
                  <feature.icon className="w-4 h-4 text-white" />
                  <span className="text-sm text-zinc-300">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Repair Details' },
              { num: 2, label: 'Payment' },
              { num: 3, label: 'Choose Schedule' }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${(initialData.paymentConfirmed && s.num === 3) || (!initialData.paymentConfirmed && step >= s.num)
                      ? 'bg-white border-white text-black'
                      : 'border-zinc-700 text-zinc-500 bg-zinc-900'
                    }`}>
                    {(initialData.paymentConfirmed && s.num < 3) ? <CheckCircle2 className="h-6 w-6" /> : s.num}
                  </div>
                  <span className={`text-sm mt-2 ${(initialData.paymentConfirmed && s.num === 3) || (!initialData.paymentConfirmed && step >= s.num)
                      ? 'text-white font-semibold' : 'text-zinc-500'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div className={`flex-1 h-1 mx-4 transition-all ${(initialData.paymentConfirmed || step > s.num) ? 'bg-white' : 'bg-zinc-800'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Main Form */}
      <div className="container mx-auto px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
            <CardHeader className="bg-zinc-800/50 border-b border-zinc-700 p-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-xl">
                  {step === 1 && <Wrench className="w-6 h-6 text-white" />}
                  {step === 2 && <CalendarIcon className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-white">
                    {step === 1 ? 'Repair Details & Summary' : 'Choose Your Schedule'}
                  </CardTitle>
                  <CardDescription className="text-zinc-400 mt-1">
                    {step === 1 ? 'Review your repair selection and proceed to payment' : 'Pick a convenient time for your repair'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {step === 1 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Device Type */}
                    <div className="space-y-4">
                      <Label className="text-lg font-bold text-white flex items-center gap-2">
                        <Monitor className="h-5 w-5 text-white" />
                        Select Device Type
                      </Label>
                      <RadioGroup defaultValue="smartphone" value={deviceType} onValueChange={setDeviceType} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { value: 'smartphone', icon: Smartphone, label: 'Smartphone' },
                          { value: 'laptop', icon: Laptop, label: 'Laptop' },
                          { value: 'pc', icon: Monitor, label: 'Desktop PC' }
                        ].map(({ value, icon: Icon, label }) => (
                          <div key={value}>
                            <RadioGroupItem value={value} id={value} className="peer sr-only" />
                            <Label
                              htmlFor={value}
                              className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-zinc-700 bg-zinc-800/50 p-6 hover:border-zinc-500 hover:bg-zinc-800 peer-data-[state=checked]:border-white peer-data-[state=checked]:bg-white/10 cursor-pointer transition-all duration-200"
                            >
                              <Icon className="h-10 w-10 text-white" />
                              <span className="font-semibold text-white">{label}</span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Device Brand & Model */}
                    <div className="space-y-4">
                      <Label className="text-lg font-bold text-white flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-white" />
                        Device Details
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="brand" className="text-sm font-medium text-zinc-400 mb-2 block">
                            Brand
                          </Label>
                          <input
                            type="text"
                            id="brand"
                            value={deviceBrand}
                            onChange={(e) => setDeviceBrand(e.target.value)}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white transition-colors"
                            placeholder="e.g. Apple, Samsung"
                          />
                        </div>
                        <div>
                          <Label htmlFor="model" className="text-sm font-medium text-zinc-400 mb-2 block">
                            Model
                          </Label>
                          <input
                            type="text"
                            id="model"
                            value={deviceModel}
                            onChange={(e) => setDeviceModel(e.target.value)}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white transition-colors"
                            placeholder="e.g. iPhone 14, Galaxy S23"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Repair Service */}
                    <div className="space-y-4">
                      <Label htmlFor="service" className="text-lg font-bold text-white flex items-center gap-2">
                        <Wrench className="h-5 w-5 text-white" />
                        Choose Repair Service
                      </Label>
                      <Select value={repairService} onValueChange={setRepairService}>
                        <SelectTrigger id="service" className="h-14 text-lg border-zinc-700 bg-zinc-800 text-white hover:border-zinc-500 transition-colors">
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                          {availableServices.length > 0 ? (
                            availableServices.map((service) => (
                              <SelectItem key={service.id || service._id} value={service.id || service._id} className="text-white hover:bg-zinc-700">
                                <div className="flex items-center gap-2 py-1">
                                  <Wrench className="h-5 w-5 text-white" />
                                  <span>{service.name} - <CurrencyDisplay amount={service.price} /></span>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <>
                              <SelectItem value="battery" className="text-white hover:bg-zinc-700">
                                <div className="flex items-center gap-2 py-1">
                                  <Battery className="h-5 w-5 text-yellow-500" />
                                  <span>Battery Replacement - LKR 5,000</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="screen" className="text-white hover:bg-zinc-700">
                                <div className="flex items-center gap-2 py-1">
                                  <Monitor className="h-5 w-5 text-blue-400" />
                                  <span>Screen Repair - LKR 12,000</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="water-damage" className="text-white hover:bg-zinc-700">
                                <div className="flex items-center gap-2 py-1">
                                  <Droplets className="h-5 w-5 text-cyan-400" />
                                  <span>Water Damage - LKR 8,500</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="general" className="text-white hover:bg-zinc-700">
                                <div className="flex items-center gap-2 py-1">
                                  <Wrench className="h-5 w-5 text-white" />
                                  <span>General Repair - LKR 4,000</span>
                                </div>
                              </SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-zinc-400">Service Fee</span>
                        <span className="text-white font-medium">LKR {Math.abs(serviceAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-zinc-400">Platform Fee</span>
                        <span className="text-white font-medium">LKR {Math.abs(platformFee).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 mt-4 border-t border-zinc-600">
                        <span className="text-xl font-bold text-white">Total Amount</span>
                        <span className="text-2xl font-bold text-white">LKR {Math.abs(totalAmount).toLocaleString()}</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 text-lg bg-white text-black hover:bg-gray-100 font-semibold rounded-full"
                    >
                      {loading ? 'Initiating...' : 'Proceed to Payment'} <CreditCard className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Calendar */}
                      <div className="space-y-4">
                        <Label className="text-lg font-bold text-white flex items-center gap-2">
                          <CalendarIcon className="h-5 w-5 text-white" />
                          Select Date
                        </Label>
                        <div className="flex justify-center p-4 bg-zinc-800 rounded-xl border border-zinc-700">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(date) => date < new Date()}
                            className="rounded-md text-white"
                          />
                        </div>
                      </div>

                      {/* Time Slots */}
                      <div className="space-y-4">
                        <Label className="text-lg font-bold text-white flex items-center gap-2">
                          <Clock className="h-5 w-5 text-white" />
                          Choose Time Slot
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTimeSlot(slot)}
                              className={`px-4 py-4 rounded-xl border-2 font-semibold transition-all ${timeSlot === slot
                                ? 'border-white bg-white/10 text-white'
                                : 'border-zinc-700 hover:border-zinc-500 bg-zinc-800 text-zinc-300'
                                }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700">
                      <div className="flex items-center gap-4 text-emerald-400">
                        <CheckCircle2 className="h-6 w-6" />
                        <div>
                          <p className="font-bold">Payment Confirmed</p>
                          <p className="text-sm opacity-80">Reference: {initialData.booking?.id || initialData.booking?._id}</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading || !date || !timeSlot}
                      className="w-full h-14 text-lg bg-white text-black hover:bg-gray-100 font-semibold rounded-full"
                    >
                      {loading ? 'Saving Schedule...' : 'Confirm Schedule'} <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
