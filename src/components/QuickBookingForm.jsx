import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Badge } from './ui/badge';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
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
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickBookingForm({ onSuccess, onCancel, initialData }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [deviceType, setDeviceType] = useState(initialData?.type || 'smartphone');
  const [deviceBrand, setDeviceBrand] = useState(initialData?.brand || '');
  const [deviceModel, setDeviceModel] = useState(initialData?.model || '');
  const [repairService, setRepairService] = useState('general');
  const [issueDescription, setIssueDescription] = useState('');
  const [technician, setTechnician] = useState('pending');
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState('09:00 AM');
  const [techniciansList, setTechnicians] = useState([]);
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
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('No authentication token');

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

      if (!response.ok) throw new Error('Failed to create booking');
      const bookingData = await response.json();

      const enrichedBooking = {
        ...bookingData,
        serviceType: selectedServiceInfo?.label || 'General Repair',
        total: totalAmount
      };

      navigate('/payment', { state: { booking: enrichedBooking } });
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to initiate booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'smartphone', icon: Smartphone, label: 'Smartphone' },
            { value: 'laptop', icon: Laptop, label: 'Laptop' },
            { value: 'pc', icon: Monitor, label: 'Desktop PC' }
          ].map(({ value, icon: Icon, label }) => (
            <Button
              key={value}
              variant={deviceType === value ? 'default' : 'outline'}
              className={`h-24 flex flex-col gap-2 ${deviceType === value ? 'bg-white text-black' : 'border-zinc-800 bg-zinc-900/50 text-white'}`}
              onClick={() => setDeviceType(value)}
            >
              <Icon className="h-8 w-8" />
              <span>{label}</span>
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-zinc-400">Brand</Label>
            <input
              type="text"
              value={deviceBrand}
              onChange={(e) => setDeviceBrand(e.target.value)}
              className="w-full bg-zinc-900 border-zinc-800 rounded-lg p-2.5 text-white"
              placeholder="e.g. Apple"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Model</Label>
            <input
              type="text"
              value={deviceModel}
              onChange={(e) => setDeviceModel(e.target.value)}
              className="w-full bg-zinc-900 border-zinc-800 rounded-lg p-2.5 text-white"
              placeholder="e.g. iPhone 15"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-400">Service Type</Label>
          <Select value={repairService} onValueChange={setRepairService}>
            <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="battery" className="text-white">Battery Replacement (LKR 5,000)</SelectItem>
              <SelectItem value="screen" className="text-white">Screen Repair (LKR 12,000)</SelectItem>
              <SelectItem value="water-damage" className="text-white">Water Damage (LKR 8,500)</SelectItem>
              <SelectItem value="general" className="text-white">General Repair (LKR 4,000)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Platform Fee</span>
            <span className="text-white">LKR {Math.abs(platformFee).toLocaleString()}</span>
          </div>
          <div className="pt-4 border-t border-zinc-800 flex justify-between">
            <span className="text-white font-bold">Initial Total</span>
            <span className="text-white font-bold">LKR {Math.abs(totalAmount).toLocaleString()}</span>
          </div>
        </div>

        <Button className="w-full h-12 bg-white text-black font-bold rounded-full" disabled={loading} onClick={handleSubmit}>
          {loading ? 'Processing...' : 'Proceed to Payment'} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
