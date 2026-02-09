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
  Tablet,
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
import { useToast } from '../hooks/use-toast';

export function QuickBookingForm({ onSuccess, onCancel, initialData }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [deviceType, setDeviceType] = useState(initialData?.type || 'smartphone');
  const [deviceBrand, setDeviceBrand] = useState(initialData?.brand || '');
  const [deviceModel, setDeviceModel] = useState(initialData?.model || '');
  const [repairService, setRepairService] = useState('general');
  const [issueDescription, setIssueDescription] = useState('');
  const [technician, setTechnician] = useState(null); // Changed to object to store full tech data
  const [techniciansList, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTechList, setShowTechList] = useState(false);

  useEffect(() => {
    if (initialData) {
      setDeviceType(initialData.type || 'smartphone');
      setDeviceBrand(initialData.brand || '');
      setDeviceModel(initialData.model || '');
    }
  }, [initialData]);

  const serviceDetails = {
    battery: { label: 'Battery Replacement' },
    screen: { label: 'Screen Repair' },
    'water-damage': { label: 'Water Damage' },
    general: { label: 'General Repair' }
  };

  const getCustomPrice = (tech) => {
    if (!tech?.services || !Array.isArray(tech.services)) return null;

    // 1. Exact Match: Service + Brand + Model
    const exactMatch = tech.services.find(s =>
      s.service === repairService &&
      s.brand?.toLowerCase() === deviceBrand?.toLowerCase() &&
      s.model?.toLowerCase() === deviceModel?.toLowerCase()
    );
    // 2. Brand Match: Service + Brand
    const brandMatch = tech.services.find(s =>
      s.service === repairService &&
      s.brand?.toLowerCase() === deviceBrand?.toLowerCase()
    );

    // 3. Service Match: Just Service
    const serviceMatch = tech.services.find(s =>
      s.service === repairService
    );

    return exactMatch || brandMatch || serviceMatch || null;
  };

  const getAveragePrice = () => {
    if (!techniciansList.length) return 4000; // Fallback if no techs

    // Get all valid prices for this service from all techs
    const prices = techniciansList
      .map(tech => {
        const s = getCustomPrice(tech);
        return s ? Number(s.price) : null;
      })
      .filter(p => p !== null && p > 0);

    if (!prices.length) return 4000; // Fallback if no prices found

    const sum = prices.reduce((a, b) => a + b, 0);
    return Math.round(sum / prices.length);
  };

  // Base price (dynamic average)
  const defaultPrice = getAveragePrice();

  // Effective price: Technician's custom price -> or Default (Average)
  const selectedService = technician ? getCustomPrice(technician) : null;
  const effectivePrice = selectedService ? Number(selectedService.price) : defaultPrice;

  const platformFee = 500;
  const totalAmount = effectivePrice + platformFee;

  const placeholders = {
    smartphone: { brand: 'e.g. Apple', model: 'e.g. iPhone 15' },
    laptop: { brand: 'e.g. Dell', model: 'e.g. XPS 13' },
    tablet: { brand: 'e.g. Samsung', model: 'e.g. Galaxy Tab S9' },
    pc: { brand: 'e.g. Custom Build', model: 'e.g. RTX 4090 Workstation' }
  };

  useEffect(() => {
    const fetchTechs = async () => {
      try {
        const { data: supabaseTechs, error } = await supabase
          .from('technicians')
          .select('*')
          .order('rating', { ascending: false });

        if (!error && supabaseTechs) {
          // Deduplicate by ID
          const uniqueTechsMap = new Map();
          supabaseTechs.forEach(tech => {
            if (!uniqueTechsMap.has(tech.id)) {
              uniqueTechsMap.set(tech.id, tech);
            }
          });
          setTechnicians(Array.from(uniqueTechsMap.values()));
        } else {
          // Fallback
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const response = await fetch(`${apiUrl}/api/technicians`);
          const data = await response.json();
          // Deduplicate fallback data too
          const uniqueDataMap = new Map();
          (data || []).forEach(tech => {
            if (!uniqueDataMap.has(tech.id)) {
              uniqueDataMap.set(tech.id, tech);
            }
          });
          setTechnicians(Array.from(uniqueDataMap.values()));
        }
      } catch (error) {
        console.error('Error fetching technicians:', error);
      }
    };

    fetchTechs();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('public:technicians')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'technicians' }, (payload) => {
        console.log('Technician update received:', payload);
        fetchTechs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Session error: ' + sessionError.message);
      }

      const token = session?.access_token;

      if (!token) {
        throw new Error('No authentication token - please log in again');
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const bookingPayload = {
        technician_id: technician?.id || null,
        device_type: deviceType,
        device_brand: deviceBrand || deviceType,
        device_model: deviceModel || 'Unknown',
        issue_description: issueDescription || serviceDetails[repairService]?.label,
        status: 'pending',
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

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`Failed to create booking: ${response.status} - ${responseText}`);
      }

      const bookingData = JSON.parse(responseText);

      const enrichedBooking = {
        ...bookingData,
        serviceType: serviceDetails[repairService]?.label || 'General Repair',
        total: totalAmount
      };

      navigate('/payment', { state: { booking: enrichedBooking } });
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Error",
        description: error.message || "Failed to initiate booking.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Device Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: 'smartphone', icon: Smartphone, label: 'Smartphone' },
            { value: 'tablet', icon: Tablet, label: 'Tablet' },
            { value: 'laptop', icon: Laptop, label: 'Laptop' },
            { value: 'pc', icon: Monitor, label: 'Desktop PC' }
          ].map(({ value, icon: Icon, label }) => (
            <Button
              key={value}
              variant={deviceType === value ? 'default' : 'outline'}
              className={`h-24 flex flex-col gap-2 ${deviceType === value ? 'bg-white text-black' : 'border-zinc-800 bg-zinc-900/50 text-white'}`}
              onClick={() => {
                setDeviceType(value);
                // Clear previous inputs when switching generic types to trigger new placeholders visually if needed
                // But keeping values might be better UX if they switch accidentally.
                // Let's just switch the type.
              }}
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
              placeholder={placeholders[deviceType]?.brand || 'e.g. Brand'}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Model</Label>
            <input
              type="text"
              value={deviceModel}
              onChange={(e) => setDeviceModel(e.target.value)}
              className="w-full bg-zinc-900 border-zinc-800 rounded-lg p-2.5 text-white"
              placeholder={placeholders[deviceType]?.model || 'e.g. Model'}
            />
          </div>
        </div>

        {/* Service Selection */}
        <div className="space-y-2">
          <Label className="text-zinc-400">Service Type</Label>
          <Select value={repairService} onValueChange={setRepairService}>
            <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="battery" className="text-white">Battery Replacement</SelectItem>
              <SelectItem value="screen" className="text-white">Screen Repair</SelectItem>
              <SelectItem value="water-damage" className="text-white">Water Damage</SelectItem>
              <SelectItem value="general" className="text-white">General Repair</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Issue Description */}
        <div className="space-y-2">
          <Label className="text-zinc-400">Describe the Issue (Optional)</Label>
          <textarea
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white min-h-[80px] resize-none placeholder:text-zinc-600"
            placeholder="Tell us more about what's wrong with your device..."
          />
        </div>

        {/* Technician Selection */}
        <div className="space-y-2">
          <Label className="text-zinc-400">Select Technician</Label>
          {!showTechList ? (
            <div
              className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-600 transition-colors flex justify-between items-center"
              onClick={() => setShowTechList(true)}
            >
              <div className="flex items-center gap-3">
                {technician ? (
                  <>
                    <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">
                      {technician.name?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <div className="text-white font-medium">{technician.name || technician.shopName}</div>
                      <div className="text-xs text-emerald-400 font-medium">
                        {(() => {
                          const s = getCustomPrice(technician);
                          return s
                            ? `Custom Price: LKR ${Number(s.price).toLocaleString()} ${s.warranty ? `(${s.warranty})` : ''}`
                            : 'Standard Rate';
                        })()}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Any Available Technician</div>
                      <div className="text-xs text-zinc-500">We'll assign the best match</div>
                    </div>
                  </>
                )}
              </div>
              <Button variant="ghost" size="sm" className="text-zinc-400">Change</Button>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
              <div
                className="p-3 border-b border-zinc-800 hover:bg-zinc-800 cursor-pointer flex justify-between items-center"
                onClick={() => { setTechnician(null); setShowTechList(false); }}
              >
                <span className="text-white">Any Technician</span>
                <span className="text-emerald-500 text-sm">LKR {defaultPrice.toLocaleString()}</span>
              </div>
              {techniciansList.map(tech => {
                const techPrice = getCustomPrice(tech);
                return (
                  <div
                    key={tech.id}
                    className="p-3 border-b border-zinc-800 hover:bg-zinc-800 cursor-pointer flex justify-between items-center"
                    onClick={() => { setTechnician(tech); setShowTechList(false); }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-white text-xs">
                        {tech.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{tech.name || tech.shopName}</div>
                        <div className="text-xs text-zinc-500 flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-amber-500" /> {tech.rating || 'New'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${techPrice ? 'text-emerald-400' : 'text-zinc-400'}`}>
                        LKR {(techPrice ? Number(techPrice.price) : defaultPrice).toLocaleString()}
                      </div>
                      {techPrice && (
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] text-emerald-500/80">Special Deal</span>
                          {(techPrice.warranty || techPrice.duration) && (
                            <span className="text-[10px] text-zinc-500">
                              {[techPrice.duration, techPrice.warranty].filter(Boolean).join(' • ')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Service Cost</span>
            <span className="text-white">LKR {effectivePrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Platform Fee</span>
            <span className="text-white">LKR {Math.abs(platformFee).toLocaleString()}</span>
          </div>
          <div className="pt-4 border-t border-zinc-800 flex justify-between">
            <span className="text-white font-bold">Estimated Total</span>
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
