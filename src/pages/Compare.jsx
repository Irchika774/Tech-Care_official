import { useState } from 'react';
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
  Trash2
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

const techniciansPool = [
  {
    id: 1,
    name: "Mobile Wizards",
    rating: 4.9,
    reviews: 1200,
    services: ["Screen Repair", "Battery Replacement", "Water Damage"],
    priceRange: "$50 - $250",
    avgPrice: 150,
    location: "New York, NY",
    experience: "8 years",
    responseTime: "< 1 hour",
    completionRate: 98,
    warranty: "90 days",
    specialties: ["iPhone", "Samsung", "Google Pixel"],
    certifications: ["Apple Certified", "Samsung Authorized"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpjnPGaHMNfySM0XdsWGFM8Ac4KNQNKiXUS3Y6B3gNfw3PTX9qpxQaSzsRnBaJdznzm0o9gDi_XN7i1hittn0ZBLKollEJYw2JPng1XBJ82gMs0KL8Rle5bHZlwSFnPrdglNHk5jgeBhx0cKwnyTKpYvPXXyX0Auy7nVCgKaZy8xC54es7beBmU6OvPQOkM0MefRI2PFhKld5d-Q-AA8J08pqF23RYVLyxrvWaCzD6B1RxfL3i9302086lobuhNvXmueMbSDoHo7sX"
  },
  {
    id: 2,
    name: "Fone Fixers",
    rating: 4.8,
    reviews: 850,
    services: ["Charging Port Repair", "Water Damage", "Speaker Fix"],
    priceRange: "$70 - $300",
    avgPrice: 185,
    location: "Los Angeles, CA",
    experience: "6 years",
    responseTime: "< 2 hours",
    completionRate: 96,
    warranty: "60 days",
    specialties: ["Samsung", "OnePlus", "Xiaomi"],
    certifications: ["Samsung Authorized"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYOQbF9Rf31b64CLzucTed9New93PsgPBtgxJ84A5qIVGFE4OV4gR7slRLP3NAsLkIyiy7sKdk0sYR-BAaDUAK8UwIY0FdVaHKdXU2DeXWsMBX2klyWNUPjypUw1UjxHPcHWax28skPdRjyyo9IzzXnBwWKmYCzZyg6lSzrRO2ZGqPccfaCK7irz7BAfIiUT8irri9YDNKJVtSu6H4-xMw5f-i9QdPDbG1cgyERN-NIR565NTz8lozduJ4aJghNxrdVSmRJCw4PNqR"
  },
  {
    id: 3,
    name: "Circuit Masters",
    rating: 4.9,
    reviews: 302,
    services: ["Hardware Upgrade", "Custom Builds", "Liquid Cooling"],
    priceRange: "$150 - $600",
    avgPrice: 375,
    location: "Chicago, IL",
    experience: "10 years",
    responseTime: "< 3 hours",
    completionRate: 99,
    warranty: "6 months",
    specialties: ["PC Building", "Gaming PCs", "Overclocking"],
    certifications: ["CompTIA A+", "Microsoft Certified"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXpNjbqO5jhUjfaqeN5rLe2orMY3j_JhfW5INZbGo0El9V3PpnvlpsL8sXtclCh62nsaUMlEjHlDl3Dg6ozBbIZQrEMup71NOXwPKtCZ5Vgo4pRmYfunB8AHzhSm8V8UO8KXG7bAF-R9XILyHu6S0l9kj4tk-qKeLsv7TlllipiwzfE2i0yE1gq5bcLPn7dqA7QcnliSf7_mjZ0rfGOTXhQ1KA-aCDjlru_FuDFgcNkZhGsbbN2uLDkYLM9fdwKkRuUwQ1JNe60XB2"
  }
];

const Compare = () => {
  const navigate = useNavigate();
  const [selectedTechnicians, setSelectedTechnicians] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

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
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Compare Technicians</h1>
        <p className="text-lg text-muted-foreground">
          Compare up to 3 technicians side by side to make the best decision for your repair needs.
        </p>
      </div>

      {/* Comparison Table */}
      <Card>
        <CardContent className="p-0 overflow-hidden">
          {selectedTechnicians.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="bg-muted/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowRight className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Technicians Selected</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Add technicians to start comparing their services, prices, and ratings side by side.
              </p>
              <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Add Technician
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Select Technician</DialogTitle>
                    <DialogDescription>
                      Choose a technician to add to the comparison.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {techniciansPool.map((tech) => (
                      <div
                        key={tech.id}
                        className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:border-primary ${selectedTechnicians.find(t => t.id === tech.id)
                            ? 'bg-primary/5 border-primary'
                            : 'bg-card'
                          }`}
                        onClick={() => handleAddTechnician(tech)}
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={tech.image} alt={tech.name} />
                          <AvatarFallback>{tech.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold">{tech.name}</h4>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                              {tech.rating}
                            </span>
                            <span>{tech.location}</span>
                            <span className="font-medium text-foreground">{tech.priceRange}</span>
                          </div>
                        </div>
                        {selectedTechnicians.find(t => t.id === tech.id) && (
                          <CheckCircle className="h-6 w-6 text-primary" />
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
                  <TableRow>
                    <TableHead className="w-[200px] bg-muted/50">Comparison</TableHead>
                    {selectedTechnicians.map((tech) => (
                      <TableHead key={tech.id} className="text-center min-w-[250px] relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveTechnician(tech.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="flex flex-col items-center py-4">
                          <Avatar className="h-16 w-16 mb-3">
                            <AvatarImage src={tech.image} alt={tech.name} />
                            <AvatarFallback>{tech.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="font-bold text-lg">{tech.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {tech.location}
                          </div>
                        </div>
                      </TableHead>
                    ))}
                    {selectedTechnicians.length < 3 && (
                      <TableHead className="text-center min-w-[250px]">
                        <div className="flex flex-col items-center justify-center py-8 h-full">
                          <Button
                            variant="outline"
                            className="h-16 w-16 rounded-full border-dashed mb-2"
                            onClick={() => setShowAddModal(true)}
                          >
                            <Plus className="h-6 w-6" />
                          </Button>
                          <span className="text-sm text-muted-foreground">Add Technician</span>
                        </div>
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Rating */}
                  <TableRow>
                    <TableCell className="font-semibold bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Rating
                      </div>
                    </TableCell>
                    {selectedTechnicians.map((tech) => {
                      const winner = getWinner('rating');
                      const isWinner = winner && winner.id === tech.id;
                      return (
                        <TableCell key={tech.id} className={`text-center ${isWinner ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
                          <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1">
                              <span className="text-xl font-bold">{tech.rating}</span>
                              {isWinner && <CheckCircle className="h-4 w-4 text-green-500" />}
                            </div>
                            <span className="text-xs text-muted-foreground">{tech.reviews} reviews</span>
                          </div>
                        </TableCell>
                      );
                    })}
                    {selectedTechnicians.length < 3 && <TableCell />}
                  </TableRow>

                  {/* Price */}
                  <TableRow>
                    <TableCell className="font-semibold bg-muted/50">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        Avg Price
                      </div>
                    </TableCell>
                    {selectedTechnicians.map((tech) => {
                      const winner = getWinner('price');
                      const isWinner = winner && winner.id === tech.id;
                      return (
                        <TableCell key={tech.id} className={`text-center ${isWinner ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
                          <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1">
                              <span className="text-xl font-bold text-primary">${tech.avgPrice}</span>
                              {isWinner && <CheckCircle className="h-4 w-4 text-green-500" />}
                            </div>
                            <span className="text-xs text-muted-foreground">Range: {tech.priceRange}</span>
                          </div>
                        </TableCell>
                      );
                    })}
                    {selectedTechnicians.length < 3 && <TableCell />}
                  </TableRow>

                  {/* Experience */}
                  <TableRow>
                    <TableCell className="font-semibold bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-blue-500" />
                        Experience
                      </div>
                    </TableCell>
                    {selectedTechnicians.map((tech) => {
                      const winner = getWinner('experience');
                      const isWinner = winner && winner.id === tech.id;
                      return (
                        <TableCell key={tech.id} className={`text-center ${isWinner ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-semibold">{tech.experience}</span>
                            {isWinner && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </div>
                        </TableCell>
                      );
                    })}
                    {selectedTechnicians.length < 3 && <TableCell />}
                  </TableRow>

                  {/* Response Time */}
                  <TableRow>
                    <TableCell className="font-semibold bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-500" />
                        Response Time
                      </div>
                    </TableCell>
                    {selectedTechnicians.map((tech) => {
                      const winner = getWinner('response');
                      const isWinner = winner && winner.id === tech.id;
                      return (
                        <TableCell key={tech.id} className={`text-center ${isWinner ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-semibold">{tech.responseTime}</span>
                            {isWinner && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </div>
                        </TableCell>
                      );
                    })}
                    {selectedTechnicians.length < 3 && <TableCell />}
                  </TableRow>

                  {/* Completion Rate */}
                  <TableRow>
                    <TableCell className="font-semibold bg-muted/50">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Completion Rate
                      </div>
                    </TableCell>
                    {selectedTechnicians.map((tech) => {
                      const winner = getWinner('completion');
                      const isWinner = winner && winner.id === tech.id;
                      return (
                        <TableCell key={tech.id} className={`text-center ${isWinner ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-semibold">{tech.completionRate}%</span>
                            {isWinner && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </div>
                        </TableCell>
                      );
                    })}
                    {selectedTechnicians.length < 3 && <TableCell />}
                  </TableRow>

                  {/* Warranty */}
                  <TableRow>
                    <TableCell className="font-semibold bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-orange-500" />
                        Warranty
                      </div>
                    </TableCell>
                    {selectedTechnicians.map((tech) => (
                      <TableCell key={tech.id} className="text-center">
                        <span className="font-semibold">{tech.warranty}</span>
                      </TableCell>
                    ))}
                    {selectedTechnicians.length < 3 && <TableCell />}
                  </TableRow>

                  {/* Services */}
                  <TableRow>
                    <TableCell className="font-semibold bg-muted/50 align-top pt-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-indigo-500" />
                        Services
                      </div>
                    </TableCell>
                    {selectedTechnicians.map((tech) => (
                      <TableCell key={tech.id} className="text-center align-top pt-4">
                        <div className="flex flex-col gap-1">
                          {tech.services.map((service, idx) => (
                            <span key={idx} className="text-sm text-muted-foreground">{service}</span>
                          ))}
                        </div>
                      </TableCell>
                    ))}
                    {selectedTechnicians.length < 3 && <TableCell />}
                  </TableRow>

                  {/* Specialties */}
                  <TableRow>
                    <TableCell className="font-semibold bg-muted/50 align-top pt-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-pink-500" />
                        Specialties
                      </div>
                    </TableCell>
                    {selectedTechnicians.map((tech) => (
                      <TableCell key={tech.id} className="text-center align-top pt-4">
                        <div className="flex flex-wrap gap-2 justify-center">
                          {tech.specialties.map((specialty, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    ))}
                    {selectedTechnicians.length < 3 && <TableCell />}
                  </TableRow>

                  {/* Certifications */}
                  <TableRow>
                    <TableCell className="font-semibold bg-muted/50 align-top pt-4">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-teal-500" />
                        Certifications
                      </div>
                    </TableCell>
                    {selectedTechnicians.map((tech) => (
                      <TableCell key={tech.id} className="text-center align-top pt-4">
                        <div className="flex flex-wrap gap-2 justify-center">
                          {tech.certifications.map((cert, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-primary/20 bg-primary/5">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    ))}
                    {selectedTechnicians.length < 3 && <TableCell />}
                  </TableRow>

                  {/* Actions */}
                  <TableRow>
                    <TableCell className="font-semibold bg-muted/50">
                      Actions
                    </TableCell>
                    {selectedTechnicians.map((tech) => (
                      <TableCell key={tech.id} className="text-center py-6">
                        <Button
                          className="w-full"
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
        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900">
          <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-300">Quick Tip</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
            The <CheckCircle className="h-3 w-3 inline mx-1" /> icon indicates the best value or highest rating in each category among the selected technicians.
          </AlertDescription>
        </Alert>
      )}

      {/* Add Technician Modal (Reused for button click if needed, but mainly handled inline) */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Technician</DialogTitle>
            <DialogDescription>
              Choose a technician to add to the comparison.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {techniciansPool.map((tech) => (
              <div
                key={tech.id}
                className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:border-primary ${selectedTechnicians.find(t => t.id === tech.id)
                    ? 'bg-primary/5 border-primary'
                    : 'bg-card'
                  }`}
                onClick={() => handleAddTechnician(tech)}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={tech.image} alt={tech.name} />
                  <AvatarFallback>{tech.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold">{tech.name}</h4>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      {tech.rating}
                    </span>
                    <span>{tech.location}</span>
                    <span className="font-medium text-foreground">{tech.priceRange}</span>
                  </div>
                </div>
                {selectedTechnicians.find(t => t.id === tech.id) && (
                  <CheckCircle className="h-6 w-6 text-primary" />
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Compare;
