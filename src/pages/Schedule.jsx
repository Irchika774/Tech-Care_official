import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Badge } from '../components/ui/badge';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
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

const Schedule = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [deviceType, setDeviceType] = useState('smartphone');
  const [deviceBrand, setDeviceBrand] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [repairService, setRepairService] = useState('battery');
  const [issueDescription, setIssueDescription] = useState('');
  const [technician, setTechnician] = useState('pending');
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState('09:00 AM');
  const [techniciansList, setTechnicians] = useState([]);

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const serviceDetails = {
    battery: { label: 'Battery Replacement', price: 5000 },
    screen: { label: 'Screen Repair', price: 12000 },
    'water-damage': { label: 'Water Damage', price: 8500 },
    general: { label: 'General Repair', price: 4000 }
  };

  const selectedServiceInfo = serviceDetails[repairService];
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
      navigate('/login', { state: { from: '/schedule' } });
      return;
    }

    setLoading(true);
    try {
      const selectedTech = technicianOptions[technician];
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const bookingPayload = {
        customer_id: user.extendedProfile?.id,
        technician_id: technician === 'pending' ? null : technician,
        device_type: deviceType,
        device_brand: deviceBrand || deviceType,
        device_model: deviceModel || 'Unknown',
        issue_description: issueDescription || selectedServiceInfo?.label,
        scheduled_date: date ? date.toISOString() : new Date().toISOString(),
        estimated_cost: totalAmount
      };

      const response = await fetch(`${apiUrl}/api/bookings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingPayload)
      });

      if (!response.ok) throw new Error('Failed to create booking');
      
      const bookingData = await response.json();
      
      const enrichedBooking = {
        ...bookingData,
        serviceType: selectedServiceInfo?.label || 'General Repair',
        device: {
          brand: bookingData.device_brand,
          model: bookingData.device_model
        },
        technician: {
          name: selectedTech?.name || 'Assigned Technician',
          rating: selectedTech?.rating || 5.0
        },
        amount: serviceAmount,
        serviceFee: platformFee,
        total: totalAmount
      };

      navigate('/payment', { state: { booking: enrichedBooking } });
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to schedule repair. Please try again.');
    } finally {
      setLoading(false);
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
              { num: 1, label: 'Select Service' },
              { num: 2, label: 'Choose Date & Time' },
              { num: 3, label: 'Confirm Details' }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    step >= s.num 
                      ? 'bg-white border-white text-black' 
                      : 'border-zinc-700 text-zinc-500 bg-zinc-900'
                  }`}>
                    {step > s.num ? <CheckCircle2 className="h-6 w-6" /> : s.num}
                  </div>
                  <span className={`text-sm mt-2 ${step >= s.num ? 'text-white font-semibold' : 'text-zinc-500'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div className={`flex-1 h-1 mx-4 transition-all ${
                    step > s.num ? 'bg-white' : 'bg-zinc-800'
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
                  {step === 3 && <CheckCircle2 className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-white">
                    {step === 1 && 'Select Your Device & Service'}
                    {step === 2 && 'Choose Date & Time'}
                    {step === 3 && 'Review & Confirm'}
                  </CardTitle>
                  <CardDescription className="text-zinc-400 mt-1">
                    {step === 1 && 'Tell us about your device and the repair you need'}
                    {step === 2 && 'Pick a convenient time for your repair'}
                    {step === 3 && 'Review your booking details before payment'}
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
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Issue Description */}
                    <div className="space-y-4">
                      <Label htmlFor="issue" className="text-lg font-bold text-white flex items-center gap-2">
                        <Clock className="h-5 w-5 text-white" />
                        Issue Description
                      </Label>
                      <textarea
                        id="issue"
                        value={issueDescription}
                        onChange={(e) => setIssueDescription(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white transition-colors resize-none"
                        placeholder="Describe the issue with your device (optional)"
                      />
                    </div>

                    {/* Technician Selection */}
                    <div className="space-y-4">
                      <Label htmlFor="technician" className="text-lg font-bold text-white flex items-center gap-2">
                        <User className="h-5 w-5 text-white" />
                        Select Technician
                      </Label>
                      <Select value={technician} onValueChange={setTechnician}>
                        <SelectTrigger id="technician" className="h-14 text-lg border-zinc-700 bg-zinc-800 text-white hover:border-zinc-500 transition-colors">
                          <SelectValue placeholder="Choose technician (optional)" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                          <SelectItem value="pending" className="text-white hover:bg-zinc-700">
                            <div className="py-1">Auto-assign best available</div>
                          </SelectItem>
                          {techniciansList.map((tech) => (
                            <SelectItem key={tech.id} value={tech.id} className="text-white hover:bg-zinc-700">
                              <div className="flex items-center justify-between gap-4 py-1">
                                <span>{tech.name} - {tech.specialization?.[0] || 'Expert'}</span>
                                <span className="text-yellow-500">★ {tech.rating || '5.0'}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      type="button" 
                      onClick={() => setStep(2)} 
                      className="w-full h-14 text-lg bg-white text-black hover:bg-gray-100 font-semibold rounded-full"
                    >
                      Continue <ArrowRight className="ml-2 h-5 w-5" />
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
                              className={`px-4 py-4 rounded-xl border-2 font-semibold transition-all ${
                                timeSlot === slot
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

                    <div className="flex gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setStep(1)} 
                        className="flex-1 h-14 text-lg bg-transparent border-2 border-zinc-600 text-white hover:bg-zinc-800 rounded-full"
                      >
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => setStep(3)} 
                        className="flex-1 h-14 text-lg bg-white text-black hover:bg-gray-100 font-semibold rounded-full"
                      >
                        Continue <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-zinc-800/50 border border-zinc-700 p-8 rounded-xl">
                      <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                        Booking Summary
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-4 border-b border-zinc-700">
                          <span className="text-zinc-400 flex items-center gap-2">
                            <Monitor className="h-5 w-5" /> Device
                          </span>
                          <span className="font-semibold text-white capitalize">{deviceType}</span>
                        </div>
                        {(deviceBrand || deviceModel) && (
                          <div className="flex items-center justify-between py-4 border-b border-zinc-700">
                            <span className="text-zinc-400 flex items-center gap-2">
                              <Smartphone className="h-5 w-5" /> Model
                            </span>
                            <span className="font-semibold text-white">{deviceBrand} {deviceModel}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between py-4 border-b border-zinc-700">
                          <span className="text-zinc-400 flex items-center gap-2">
                            <Wrench className="h-5 w-5" /> Service
                          </span>
                          <span className="font-semibold text-white capitalize">{repairService.replace('-', ' ')}</span>
                        </div>
                        <div className="flex items-center justify-between py-4 border-b border-zinc-700">
                          <span className="text-zinc-400 flex items-center gap-2">
                            <User className="h-5 w-5" /> Technician
                          </span>
                          <span className="font-semibold text-white capitalize">
                            {technician === 'pending' ? 'Auto-assign' : (techniciansList.find(t => t.id === technician)?.name || 'Assigned')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-4 border-b border-zinc-700">
                          <span className="text-zinc-400 flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5" /> Date
                          </span>
                          <span className="font-semibold text-white">{date ? format(date, 'PPP') : 'Not selected'}</span>
                        </div>
                        <div className="flex items-center justify-between py-4 border-b border-zinc-700">
                          <span className="text-zinc-400 flex items-center gap-2">
                            <Clock className="h-5 w-5" /> Time
                          </span>
                          <span className="font-semibold text-white">{timeSlot}</span>
                        </div>

                        {/* Pricing Breakdown */}
                        <div className="mt-6 pt-6 border-t border-zinc-600 space-y-3">
                          <div className="flex items-center justify-between text-zinc-300">
                            <span>Service Cost</span>
                            <span>LKR {serviceAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-300">
                            <span>Platform Fee</span>
                            <span>LKR {platformFee.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between py-4 mt-4 border-t border-zinc-600">
                            <span className="text-xl font-bold text-white flex items-center gap-2">
                              <CreditCard className="h-6 w-6" /> Total Cost
                            </span>
                            <span className="text-2xl font-bold text-white">LKR {totalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { icon: Shield, text: 'Secure Payment' },
                        { icon: CheckCircle2, text: '30-Day Warranty' },
                        { icon: Star, text: 'Verified Techs' },
                        { icon: Zap, text: 'Fast Service' }
                      ].map((badge, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
                          <badge.icon className="w-5 h-5 text-white" />
                          <span className="text-sm text-zinc-300">{badge.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setStep(2)} 
                        className="flex-1 h-14 text-lg bg-transparent border-2 border-zinc-600 text-white hover:bg-zinc-800 rounded-full"
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="flex-1 h-14 text-lg bg-white text-black hover:bg-gray-100 font-semibold rounded-full disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Proceed to Payment'}
                        {!loading && <CreditCard className="ml-2 h-5 w-5" />}
                      </Button>
                    </div>
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
