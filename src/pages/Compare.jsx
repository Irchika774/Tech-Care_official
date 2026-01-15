import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Star,
  X,
  Plus,
  Info,
  ArrowRight,
  DollarSign,
  Briefcase,
  Clock,
  Award,
  MapPin,
  Trash2,
  Loader2
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Fallback sample data
const sampleTechnicians = [
  {
    id: 1,
    name: "Mobile Wizards",
    rating: 4.9,
    reviews: 1200,
    services: ["Screen Repair", "Battery Replacement", "Water Damage"],
    priceRange: "LKR 2,500 - LKR 15,000",
    avgPrice: 7500,
    location: "Colombo, Sri Lanka",
    experience: "8 years",
    responseTime: "< 1 hour",
    completionRate: 98,
    warranty: "90 days",
    specialties: ["iPhone", "Samsung", "Google Pixel"],
    certifications: ["Apple Certified", "Samsung Authorized"],
    image: null
  },
  {
    id: 2,
    name: "Fone Fixers",
    rating: 4.8,
    reviews: 850,
    services: ["Charging Port Repair", "Water Damage", "Speaker Fix"],
    priceRange: "LKR 3,500 - LKR 18,000",
    avgPrice: 9000,
    location: "Kandy, Sri Lanka",
    experience: "6 years",
    responseTime: "< 2 hours",
    completionRate: 96,
    warranty: "60 days",
    specialties: ["Samsung", "OnePlus", "Xiaomi"],
    certifications: ["Samsung Authorized"],
    image: null
  },
  {
    id: 3,
    name: "Circuit Masters",
    rating: 4.9,
    reviews: 302,
    services: ["Hardware Upgrade", "Custom Builds", "Liquid Cooling"],
    priceRange: "LKR 7,500 - LKR 35,000",
    avgPrice: 18000,
    location: "Galle, Sri Lanka",
    experience: "10 years",
    responseTime: "< 3 hours",
    completionRate: 99,
    warranty: "6 months",
    specialties: ["PC Building", "Gaming PCs", "Overclocking"],
    certifications: ["CompTIA A+", "Microsoft Certified"],
    image: null
  }
];

const Compare = () => {
  const navigate = useNavigate();
  const [techniciansPool, setTechniciansPool] = useState(sampleTechnicians);
  const [loadingTechnicians, setLoadingTechnicians] = useState(true);
  const [selectedTechnicians, setSelectedTechnicians] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await fetch(`${API_URL}/api/technicians?limit=20`);
        if (response.ok) {
          const data = await response.json();
          const techs = (data.technicians || data || []).map(t => ({
            id: t.id || t._id,
            name: t.name || t.shop_name || 'Technician',
            rating: t.rating || 4.5,
            reviews: t.review_count || 0,
            services: t.services || t.specializations || ['General Repair'],
            priceRange: t.price_range || 'LKR 2,500 - LKR 15,000',
            avgPrice: t.avg_price || 5000,
            location: t.district || t.location || 'Sri Lanka',
            experience: t.experience || '3+ years',
            responseTime: t.response_time || '< 2 hours',
            completionRate: t.completion_rate || 95,
            warranty: t.warranty || '30 days',
            specialties: t.specialties || [],
            certifications: t.certifications || [],
            image: t.profile_image || t.image
          }));

          if (techs.length > 0) {
            setTechniciansPool(techs);
          }
        }
      } catch (error) {
        console.error('Error fetching technicians:', error);
        // Keep using sample data
      } finally {
        setLoadingTechnicians(false);
      }
    };

    fetchTechnicians();
  }, []);

  const handleAddTechnician = (tech) => {
    if (selectedTechnicians.length >= 3) {
      return;
    }
    if (selectedTechnicians.find(t => t.id === tech.id)) {
      return;
    }
    setSelectedTechnicians([...selectedTechnicians, tech]);
    setShowAddModal(false);
  };

  const handleRemoveTechnician = (techId) => {
    setSelectedTechnicians(selectedTechnicians.filter(t => t.id !== techId));
  };

  const getWinner = (metric) => {
    if (selectedTechnicians.length === 0) return null;

    switch (metric) {
      case 'rating':
        return selectedTechnicians.reduce((max, tech) =>
          tech.rating > max.rating ? tech : max
        );
      case 'price':
        return selectedTechnicians.reduce((min, tech) =>
          tech.avgPrice < min.avgPrice ? tech : min
        );
      case 'experience':
        return selectedTechnicians.reduce((max, tech) =>
          parseInt(tech.experience) > parseInt(max.experience) ? tech : max
        );
      case 'reviews':
        return selectedTechnicians.reduce((max, tech) =>
          tech.reviews > max.reviews ? tech : max
        );
      case 'response':
        return selectedTechnicians.reduce((min, tech) =>
          parseInt(tech.responseTime) < parseInt(min.responseTime) ? tech : min
        );
      case 'completion':
        return selectedTechnicians.reduce((max, tech) =>
          tech.completionRate > max.completionRate ? tech : max
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 md:px-6">
      <div className="container mx-auto space-y-8 max-w-7xl">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-white">Compare Technicians</h1>
          <p className="text-lg text-gray-400">
            Compare up to 3 technicians side by side to make the best decision for your repair needs.
          </p>
        </div>

        {/* Comparison Table */}
        <Card className="bg-zinc-900 border-white/10 text-white">
          <CardContent className="p-0 overflow-hidden">
            {selectedTechnicians.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ArrowRight className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">No Technicians Selected</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Add technicians to start comparing their services, prices, and ratings side by side.
                </p>
                <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white border-0">
                      <Plus className="h-5 w-5" />
                      Add Technician
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-white">Select Technician</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Choose a technician to add to the comparison.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {techniciansPool.map((tech) => (
                        <div
                          key={tech.id}
                          className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:border-emerald-500 ${selectedTechnicians.find(t => t.id === tech.id)
                            ? 'bg-emerald-500/10 border-emerald-500'
                            : 'bg-black border-zinc-800'
                            }`}
                          onClick={() => handleAddTechnician(tech)}
                        >
                          <Avatar className="h-12 w-12 border border-white/10">
                            <AvatarImage src={tech.image} alt={tech.name} />
                            <AvatarFallback className="bg-zinc-800 text-white">{tech.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{tech.name}</h4>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              <span className="flex items-center gap-1 text-yellow-500">
                                <Star className="h-3 w-3 fill-yellow-500" />
                                {tech.rating}
                              </span>
                              <span>{tech.location}</span>
                              <span className="font-medium text-emerald-400">{tech.priceRange}</span>
                            </div>
                          </div>
                          {selectedTechnicians.find(t => t.id === tech.id) && (
                            <CheckCircle className="h-6 w-6 text-emerald-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="w-[200px] bg-black/50 text-white">Comparison</TableHead>
                      {selectedTechnicians.map((tech) => (
                        <TableHead key={tech.id} className="text-center min-w-[250px] relative text-white">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 text-gray-500 hover:text-red-400 hover:bg-red-400/10"
                            onClick={() => handleRemoveTechnician(tech.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="flex flex-col items-center py-4">
                            <Avatar className="h-16 w-16 mb-3 border-2 border-white/10">
                              <AvatarImage src={tech.image} alt={tech.name} />
                              <AvatarFallback className="bg-zinc-800 text-white text-xl">{tech.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="font-bold text-lg text-white">{tech.name}</div>
                            <div className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              {tech.location}
                            </div>
                          </div>
                        </TableHead>
                      ))}
                      {selectedTechnicians.length < 3 && (
                        <TableHead className="text-center min-w-[250px] text-white">
                          <div className="flex flex-col items-center justify-center py-8 h-full">
                            <Button
                              variant="outline"
                              className="h-16 w-16 rounded-full border-dashed border-white/20 hover:bg-white/5 hover:text-white hover:border-white/40 mb-2 bg-transparent"
                              onClick={() => setShowAddModal(true)}
                            >
                              <Plus className="h-6 w-6" />
                            </Button>
                            <span className="text-sm text-gray-400">Add Technician</span>
                          </div>
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Rating */}
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-semibold bg-black/30 text-white">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          Rating
                        </div>
                      </TableCell>
                      {selectedTechnicians.map((tech) => {
                        const winner = getWinner('rating');
                        const isWinner = winner && winner.id === tech.id;
                        return (
                          <TableCell key={tech.id} className={`text-center ${isWinner ? 'bg-emerald-500/10' : ''}`}>
                            <div className="flex flex-col items-center">
                              <div className="flex items-center gap-1 text-white">
                                <span className="text-xl font-bold">{tech.rating}</span>
                                {isWinner && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                              </div>
                              <span className="text-xs text-gray-400">{tech.reviews} reviews</span>
                            </div>
                          </TableCell>
                        );
                      })}
                      {selectedTechnicians.length < 3 && <TableCell />}
                    </TableRow>

                    {/* Price */}
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-semibold bg-black/30 text-white">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-emerald-500" />
                          Avg Price
                        </div>
                      </TableCell>
                      {selectedTechnicians.map((tech) => {
                        const winner = getWinner('price');
                        const isWinner = winner && winner.id === tech.id;
                        return (
                          <TableCell key={tech.id} className={`text-center ${isWinner ? 'bg-emerald-500/10' : ''}`}>
                            <div className="flex flex-col items-center">
                              <div className="flex items-center gap-1">
                                <span className="text-xl font-bold text-emerald-400">${tech.avgPrice}</span>
                                {isWinner && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                              </div>
                              <span className="text-xs text-gray-400">Range: {tech.priceRange}</span>
                            </div>
                          </TableCell>
                        );
                      })}
                      {selectedTechnicians.length < 3 && <TableCell />}
                    </TableRow>

                    {/* Experience */}
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-semibold bg-black/30 text-white">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-blue-500" />
                          Experience
                        </div>
                      </TableCell>
                      {selectedTechnicians.map((tech) => {
                        const winner = getWinner('experience');
                        const isWinner = winner && winner.id === tech.id;
                        return (
                          <TableCell key={tech.id} className={`text-center ${isWinner ? 'bg-emerald-500/10' : ''}`}>
                            <div className="flex items-center justify-center gap-1 text-white">
                              <span className="font-semibold">{tech.experience}</span>
                              {isWinner && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                            </div>
                          </TableCell>
                        );
                      })}
                      {selectedTechnicians.length < 3 && <TableCell />}
                    </TableRow>

                    {/* Response Time */}
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-semibold bg-black/30 text-white">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-purple-500" />
                          Response Time
                        </div>
                      </TableCell>
                      {selectedTechnicians.map((tech) => {
                        const winner = getWinner('response');
                        const isWinner = winner && winner.id === tech.id;
                        return (
                          <TableCell key={tech.id} className={`text-center ${isWinner ? 'bg-emerald-500/10' : ''}`}>
                            <div className="flex items-center justify-center gap-1 text-white">
                              <span className="font-semibold">{tech.responseTime}</span>
                              {isWinner && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                            </div>
                          </TableCell>
                        );
                      })}
                      {selectedTechnicians.length < 3 && <TableCell />}
                    </TableRow>

                    {/* Completion Rate */}
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-semibold bg-black/30 text-white">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          Completion Rate
                        </div>
                      </TableCell>
                      {selectedTechnicians.map((tech) => {
                        const winner = getWinner('completion');
                        const isWinner = winner && winner.id === tech.id;
                        return (
                          <TableCell key={tech.id} className={`text-center ${isWinner ? 'bg-emerald-500/10' : ''}`}>
                            <div className="flex items-center justify-center gap-1 text-white">
                              <span className="font-semibold">{tech.completionRate}%</span>
                              {isWinner && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                            </div>
                          </TableCell>
                        );
                      })}
                      {selectedTechnicians.length < 3 && <TableCell />}
                    </TableRow>

                    {/* Warranty */}
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-semibold bg-black/30 text-white">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-orange-500" />
                          Warranty
                        </div>
                      </TableCell>
                      {selectedTechnicians.map((tech) => (
                        <TableCell key={tech.id} className="text-center text-white">
                          <span className="font-semibold">{tech.warranty}</span>
                        </TableCell>
                      ))}
                      {selectedTechnicians.length < 3 && <TableCell />}
                    </TableRow>

                    {/* Services */}
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-semibold bg-black/30 align-top pt-4 text-white">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-indigo-500" />
                          Services
                        </div>
                      </TableCell>
                      {selectedTechnicians.map((tech) => (
                        <TableCell key={tech.id} className="text-center align-top pt-4">
                          <div className="flex flex-col gap-1">
                            {tech.services.map((service, idx) => (
                              <span key={idx} className="text-sm text-gray-400">{service}</span>
                            ))}
                          </div>
                        </TableCell>
                      ))}
                      {selectedTechnicians.length < 3 && <TableCell />}
                    </TableRow>

                    {/* Specialties */}
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-semibold bg-black/30 align-top pt-4 text-white">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-pink-500" />
                          Specialties
                        </div>
                      </TableCell>
                      {selectedTechnicians.map((tech) => (
                        <TableCell key={tech.id} className="text-center align-top pt-4">
                          <div className="flex flex-wrap gap-2 justify-center">
                            {tech.specialties.map((specialty, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs bg-zinc-800 text-gray-300 hover:bg-zinc-700">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      ))}
                      {selectedTechnicians.length < 3 && <TableCell />}
                    </TableRow>

                    {/* Certifications */}
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-semibold bg-black/30 align-top pt-4 text-white">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-teal-500" />
                          Certifications
                        </div>
                      </TableCell>
                      {selectedTechnicians.map((tech) => (
                        <TableCell key={tech.id} className="text-center align-top pt-4">
                          <div className="flex flex-wrap gap-2 justify-center">
                            {tech.certifications.map((cert, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-emerald-500/20 bg-emerald-500/5 text-emerald-400">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      ))}
                      {selectedTechnicians.length < 3 && <TableCell />}
                    </TableRow>

                    {/* Actions */}
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-semibold bg-black/30 text-white">
                        Actions
                      </TableCell>
                      {selectedTechnicians.map((tech) => (
                        <TableCell key={tech.id} className="text-center py-6">
                          <Button
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                            onClick={() => navigate('/schedule', { state: { technician: tech } })}
                          >
                            Book Now
                          </Button>
                        </TableCell>
                      ))}
                      {selectedTechnicians.length < 3 && <TableCell />}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legend */}
        {selectedTechnicians.length > 0 && (
          <Alert className="bg-emerald-900/10 border-emerald-900/30">
            <Info className="h-4 w-4 text-emerald-400" />
            <AlertTitle className="text-emerald-400">Quick Tip</AlertTitle>
            <AlertDescription className="text-emerald-500/80">
              The <CheckCircle className="h-3 w-3 inline mx-1" /> icon indicates the best value or highest rating in each category among the selected technicians.
            </AlertDescription>
          </Alert>
        )}

        {/* Reused Add Technician Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Select Technician</DialogTitle>
              <DialogDescription className="text-gray-400">
                Choose a technician to add to the comparison.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {techniciansPool.map((tech) => (
                <div
                  key={tech.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:border-emerald-500 ${selectedTechnicians.find(t => t.id === tech.id)
                    ? 'bg-emerald-500/10 border-emerald-500'
                    : 'bg-black border-zinc-800'
                    }`}
                  onClick={() => handleAddTechnician(tech)}
                >
                  <Avatar className="h-12 w-12 border border-white/10">
                    <AvatarImage src={tech.image} alt={tech.name} />
                    <AvatarFallback className="bg-zinc-800 text-white">{tech.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{tech.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-3 w-3 fill-yellow-500" />
                        {tech.rating}
                      </span>
                      <span>{tech.location}</span>
                      <span className="font-medium text-emerald-400">{tech.priceRange}</span>
                    </div>
                  </div>
                  {selectedTechnicians.find(t => t.id === tech.id) && (
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                  )}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Compare;
