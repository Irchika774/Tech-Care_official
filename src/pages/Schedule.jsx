import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { format } from 'date-fns';
import { Smartphone, Laptop, Monitor, Battery, Droplets, Wrench, User, Calendar as CalendarIcon, Clock } from 'lucide-react';
import SEO from '../components/SEO';

const Schedule = () => {
  const navigate = useNavigate();
  const [deviceType, setDeviceType] = useState('smartphone');
  const [repairService, setRepairService] = useState('battery');
  const [technician, setTechnician] = useState('john');
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState('09:00 AM');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/payment', {
      state: {
        device: deviceType,
        service: repairService,
        technician,
        date: date ? format(date, 'PPP') : '',
        time: timeSlot,
        price: 5500 // Example price
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <SEO
        title="Schedule Repair - TechCare"
        description="Book a certified technician for your device repair. Select your device, service, and preferred time."
        keywords="schedule repair, book technician, repair appointment, device repair booking"
      />
      <Card className="w-full max-w-4xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Schedule Your Service</CardTitle>
          <CardDescription className="text-lg mt-2">
            Book a certified technician for your device repair
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Service Details */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Device Type</Label>
                <RadioGroup defaultValue="smartphone" value={deviceType} onValueChange={setDeviceType} className="grid grid-cols-3 gap-4">
                  <div>
                    <RadioGroupItem value="smartphone" id="smartphone" className="peer sr-only" />
                    <Label
                      htmlFor="smartphone"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                    >
                      <Smartphone className="mb-2 h-6 w-6" />
                      Smartphone
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="laptop" id="laptop" className="peer sr-only" />
                    <Label
                      htmlFor="laptop"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                    >
                      <Laptop className="mb-2 h-6 w-6" />
                      Laptop
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="pc" id="pc" className="peer sr-only" />
                    <Label
                      htmlFor="pc"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                    >
                      <Monitor className="mb-2 h-6 w-6" />
                      PC
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label htmlFor="service" className="text-base font-semibold">Repair Service</Label>
                <Select value={repairService} onValueChange={setRepairService}>
                  <SelectTrigger id="service" className="h-12">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="battery">
                      <div className="flex items-center">
                        <Battery className="mr-2 h-4 w-4" />
                        Battery Replacement
                      </div>
                    </SelectItem>
                    <SelectItem value="screen">
                      <div className="flex items-center">
                        <Smartphone className="mr-2 h-4 w-4" />
                        Screen Repair
                      </div>
                    </SelectItem>
                    <SelectItem value="water">
                      <div className="flex items-center">
                        <Droplets className="mr-2 h-4 w-4" />
                        Water Damage
                      </div>
                    </SelectItem>
                    <SelectItem value="general">
                      <div className="flex items-center">
                        <Wrench className="mr-2 h-4 w-4" />
                        General Diagnostic
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="technician" className="text-base font-semibold">Technician</Label>
                <Select value={technician} onValueChange={setTechnician}>
                  <SelectTrigger id="technician" className="h-12">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        John Doe (Verified Tech)
                      </div>
                    </SelectItem>
                    <SelectItem value="jane">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Jane Smith (Authorized Shop)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column: Date & Time */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Select Date
                </Label>
                <div className="border rounded-md p-4 flex justify-center bg-card">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Select Time Slot
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'].map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={timeSlot === time ? "default" : "outline"}
                      className={`text-xs ${timeSlot === time ? 'bg-primary text-primary-foreground' : ''}`}
                      onClick={() => setTimeSlot(time)}
                      disabled={time === '11:00 AM'} // Example disabled slot
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end pt-6 border-t">
          <Button
            onClick={handleSubmit}
            size="lg"
            className="w-full sm:w-auto text-lg px-8"
          >
            Proceed to Payment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Schedule;
