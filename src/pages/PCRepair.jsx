import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { Search, Star, MapPin, Briefcase, CheckCircle, DollarSign, Phone, Mail, Monitor, HardDrive, Cpu, SearchX } from 'lucide-react';

const pcTechniciansData = [
  {
    id: 1,
    name: "PC Masters",
    rating: 4.9,
    reviews: 650,
    services: ["Motherboard Repair", "RAM Upgrade", "SSD Replacement"],
    price: "$80 - $350",
    priceMin: 80,
    priceMax: 350,
    location: "New York, NY",
    experience: "7 years",
    deviceType: "desktop",
    brand: "dell",
    specialization: "Motherboard Repair",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83defb?w=400&h=300&fit=crop",
    description: "Expert PC hardware repairs with focus on desktops and servers.",
    phone: "+1 (555) 123-4567",
    email: "info@pcmaster.com"
  },
  {
    id: 2,
    name: "Laptop Pros",
    rating: 4.8,
    reviews: 520,
    services: ["Screen Replacement", "Battery Fix", "Keyboard Repair"],
    price: "$60 - $250",
    priceMin: 60,
    priceMax: 250,
    location: "Los Angeles, CA",
    experience: "5 years",
    deviceType: "laptop",
    brand: "hp",
    specialization: "Screen Replacement",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    description: "Specialized in laptop repairs for all major brands.",
    phone: "+1 (555) 234-5678",
    email: "service@laptoppros.com"
  },
  {
    id: 3,
    name: "Hardware Heroes",
    rating: 4.7,
    reviews: 430,
    services: ["GPU Upgrade", "Cooling System", "Overheating Fix"],
    price: "$100 - $400",
    priceMin: 100,
    priceMax: 400,
    location: "Chicago, IL",
    experience: "6 years",
    deviceType: "desktop",
    brand: "custom",
    specialization: "GPU Upgrade",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
    description: "Gaming PC specialists for upgrades and performance optimization.",
    phone: "+1 (555) 345-6789",
    email: "support@hardwareheroes.com"
  },
  {
    id: 4,
    name: "Tech Fixers",
    rating: 4.9,
    reviews: 780,
    services: ["Data Recovery", "Virus Removal", "Software Install"],
    price: "$50 - $200",
    priceMin: 50,
    priceMax: 200,
    location: "Houston, TX",
    experience: "8 years",
    deviceType: "laptop",
    brand: "lenovo",
    specialization: "Data Recovery",
    image: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?w=400&h=300&fit=crop",
    description: "Complete PC maintenance and data recovery services.",
    phone: "+1 (555) 456-7890",
    email: "help@techfixers.com"
  },
  {
    id: 5,
    name: "Circuit Experts",
    rating: 4.8,
    reviews: 590,
    services: ["Power Supply Repair", "HDD to SSD", "RAM Upgrade"],
    price: "$70 - $300",
    priceMin: 70,
    priceMax: 300,
    location: "Phoenix, AZ",
    experience: "9 years",
    deviceType: "desktop",
    brand: "asus",
    specialization: "Power Supply Repair",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
    description: "Advanced hardware diagnostics and repairs.",
    phone: "+1 (555) 567-8901",
    email: "contact@circuitexperts.com"
  },
  {
    id: 6,
    name: "PC Wizards",
    rating: 4.9,
    reviews: 710,
    services: ["BIOS Flash", "Custom Builds", "Benchmarking"],
    price: "$90 - $450",
    priceMin: 90,
    priceMax: 450,
    location: "Philadelphia, PA",
    experience: "10 years",
    deviceType: "desktop",
    brand: "custom",
    specialization: "Custom Builds",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
    description: "Custom PC builds and advanced troubleshooting.",
    phone: "+1 (555) 678-9012",
    email: "builds@pcwizards.com"
  }
];

const PCRepair = () => {
  const navigate = useNavigate();

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [brand, setBrand] = useState('any');
  const [issue, setIssue] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [deviceType, setDeviceType] = useState('all');
  const [minimumRating, setMinimumRating] = useState('0');

  // Display states
  const [filteredTechnicians, setFilteredTechnicians] = useState(pcTechniciansData);
  const [visibleCount, setVisibleCount] = useState(6);
  const [favorites, setFavorites] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('pc-repair-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...pcTechniciansData];

    // Keyword filter
    if (searchTerm.trim()) {
      const keywordLower = searchTerm.toLowerCase();
      filtered = filtered.filter(tech =>
        tech.name.toLowerCase().includes(keywordLower) ||
        tech.services.some(service => service.toLowerCase().includes(keywordLower)) ||
        tech.location.toLowerCase().includes(keywordLower) ||
        tech.description.toLowerCase().includes(keywordLower)
      );
    }

    // Brand filter
    if (brand !== 'any') {
      filtered = filtered.filter(tech => tech.brand === brand || tech.brand === 'any');
    }

    // Issue filter
    if (issue !== 'all') {
      filtered = filtered.filter(tech => tech.specialization === issue);
    }

    // Price range filter
    if (priceRange !== 'all') {
      if (priceRange === '0-100') {
        filtered = filtered.filter(tech => tech.priceMin <= 100);
      } else if (priceRange === '100-200') {
        filtered = filtered.filter(tech => tech.priceMax >= 100 && tech.priceMin <= 200);
      } else if (priceRange === '200+') {
        filtered = filtered.filter(tech => tech.priceMax >= 200);
      }
    }

    // Device type filter
    if (deviceType !== 'all') {
      filtered = filtered.filter(tech => tech.deviceType === deviceType);
    }

    // Minimum rating filter
    const minRating = parseFloat(minimumRating);
    if (minRating > 0) {
      filtered = filtered.filter(tech => tech.rating >= minRating);
    }

    // Sort
    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      filtered.sort((a, b) => b.reviews - a.reviews);
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.priceMin - b.priceMin);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.priceMax - a.priceMax);
    }

    setFilteredTechnicians(filtered);
    setVisibleCount(6);
  }, [searchTerm, brand, issue, priceRange, deviceType, minimumRating, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setBrand('any');
    setIssue('all');
    setPriceRange('all');
    setDeviceType('all');
    setMinimumRating('0');
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, filteredTechnicians.length));
  };

  const toggleFavorite = (techId) => {
    const newFavorites = favorites.includes(techId)
      ? favorites.filter(id => id !== techId)
      : [...favorites, techId];

    setFavorites(newFavorites);
    localStorage.setItem('pc-repair-favorites', JSON.stringify(newFavorites));
  };

  const handleViewDetails = (tech) => {
    setSelectedTechnician(tech);
    setShowDetailModal(true);
  };

  const handleScheduleAppointment = (tech) => {
    navigate('/schedule', { state: { technician: tech, service: 'PC Repair' } });
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedTechnician(null);
  };

  // Get featured technicians (top 3 by rating)
  const featuredTechnicians = [...pcTechniciansData]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div className="min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
            PC & Laptop Repair Experts
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Professional hardware and software repairs for desktops, laptops, and gaming rigs. Fast, reliable service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8" onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}>
              <Monitor className="mr-2 h-5 w-5" />
              Find PC Technicians
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              <Cpu className="mr-2 h-5 w-5" />
              View All Services
            </Button>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-muted/50 rounded-2xl p-8 mb-16">
          <div className="flex flex-col md:flex-row gap-4 items-end justify-between mb-8">
            <h2 className="text-2xl font-bold">Refine PC Repair Search</h2>
            <Button variant="ghost" onClick={handleResetFilters} className="text-primary hover:text-primary/80">
              Reset Filters
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-12"
                placeholder="Search PC technicians, services, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Brand</SelectItem>
                <SelectItem value="dell">Dell</SelectItem>
                <SelectItem value="hp">HP</SelectItem>
                <SelectItem value="lenovo">Lenovo</SelectItem>
                <SelectItem value="asus">Asus</SelectItem>
                <SelectItem value="custom">Custom Build</SelectItem>
              </SelectContent>
            </Select>
            <Select value={issue} onValueChange={setIssue}>
              <SelectTrigger>
                <SelectValue placeholder="Issue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Issues</SelectItem>
                <SelectItem value="Motherboard Repair">Motherboard</SelectItem>
                <SelectItem value="RAM Upgrade">RAM Upgrade</SelectItem>
                <SelectItem value="GPU Upgrade">GPU Upgrade</SelectItem>
                <SelectItem value="Data Recovery">Data Recovery</SelectItem>
              </SelectContent>
            </Select>
            <Select value={deviceType} onValueChange={setDeviceType}>
              <SelectTrigger>
                <SelectValue placeholder="Device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="laptop">Laptop</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-100">$0-$100</SelectItem>
                <SelectItem value="100-200">$100-$200</SelectItem>
                <SelectItem value="200+">$200+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-6 p-4 bg-primary/10 rounded-xl">
            <p className="text-lg font-semibold">
              {filteredTechnicians.length} PC technicians found
            </p>
          </div>
        </section>

        {/* Featured */}
        <section id="featured">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured PC Repair Technicians</h2>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="reviews">Reviews</SelectItem>
                <SelectItem value="price-low">Price Low</SelectItem>
                <SelectItem value="price-high">Price High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {featuredTechnicians.map((tech) => (
              <Card key={tech.id} className="overflow-hidden hover:shadow-2xl transition-all group">
                <div className="relative">
                  <img src={tech.image} alt={tech.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(tech.id);
                    }}
                  >
                    <Star className={`h-5 w-5 ${favorites.includes(tech.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  </Button>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2">{tech.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span>{tech.rating}</span>
                    <span className="text-sm text-muted-foreground">({tech.reviews} reviews)</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {tech.location}
                  </p>
                  <div className="space-y-1 mb-4">
                    {tech.services.slice(0, 2).map((service, i) => (
                      <div key={i} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {service}
                      </div>
                    ))}
                  </div>
                  <p className="text-2xl font-bold text-primary mb-6">{tech.price}</p>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => handleViewDetails(tech)} className="flex-1">
                      Details
                    </Button>
                    <Button onClick={() => handleScheduleAppointment(tech)} className="flex-1">
                      Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Results */}
        <section>
          <h2 className="text-3xl font-bold mb-12">
            All PC Repair Services ({filteredTechnicians.length})
          </h2>
          {filteredTechnicians.length === 0 ? (
            <div className="text-center py-20">
              <SearchX className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
              <h3 className="text-2xl font-bold mb-4">No PC technicians found</h3>
              <p className="text-muted-foreground mb-8">Try adjusting your search filters</p>
              <Button onClick={handleResetFilters}>Reset Filters</Button>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTechnicians.slice(0, visibleCount).map((tech) => (
                  <Card key={tech.id} className="overflow-hidden hover:shadow-xl group">
                    <div className="relative">
                      <img src={tech.image} alt={tech.name} className="w-full h-48 object-cover group-hover:scale-105" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(tech.id);
                        }}
                      >
                        <Star className={`h-5 w-5 ${favorites.includes(tech.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      </Button>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg">{tech.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{tech.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{tech.location} • {tech.experience}</p>
                      <div className="space-y-1 mb-4">
                        {tech.services.slice(0, 3).map((s, i) => (
                          <div key={i} className="flex items-center text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                            {s}
                          </div>
                        ))}
                      </div>
                      <p className="text-xl font-bold text-primary mb-6">{tech.price}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(tech)} className="flex-1">
                          View Details
                        </Button>
                        <Button size="sm" onClick={() => handleScheduleAppointment(tech)} className="flex-1">
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {visibleCount < filteredTechnicians.length && (
                <div className="text-center mt-16">
                  <Button onClick={handleLoadMore} size="lg" className="px-12">
                    Load More ({visibleCount} of {filteredTechnicians.length})
                  </Button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Detail Modal */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
            {selectedTechnician && (
              <div className="p-8">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold mb-2">{selectedTechnician.name}</DialogTitle>
                  <div className="flex items-center gap-2 mb-8">
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold">{selectedTechnician.rating}</span>
                    <span className="text-muted-foreground">({selectedTechnician.reviews} reviews)</span>
                  </div>
                </DialogHeader>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <img
                      src={selectedTechnician.image}
                      alt={selectedTechnician.name}
                      className="w-full h-80 object-cover rounded-xl mb-6"
                    />
                    <p className="text-lg leading-relaxed">{selectedTechnician.description}</p>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-xl mb-4 flex items-center">
                        <MapPin className="mr-2 h-5 w-5" />
                        Location & Experience
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center p-3 bg-muted rounded-lg">
                          <MapPin className="h-5 w-5 mr-3 text-primary" />
                          <span>{selectedTechnician.location}</span>
                        </div>
                        <div className="flex items-center p-3 bg-muted rounded-lg">
                          <Briefcase className="h-5 w-5 mr-3 text-primary" />
                          <span>{selectedTechnician.experience}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-4 flex items-center">
                        <DollarSign className="mr-2 h-5 w-5" />
                        Pricing
                      </h4>
                      <div className="p-4 bg-primary/10 rounded-xl text-center">
                        <p className="text-3xl font-bold text-primary">{selectedTechnician.price}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-4">Services</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedTechnician.services.map((service, i) => (
                          <div key={i} className="flex items-center p-3 bg-muted rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                            <span>{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-4 flex items-center">
                        <Phone className="mr-2 h-5 w-5" />
                        Contact
                      </h4>
                      <div className="space-y-3">
                        <a href={`tel:${selectedTechnician.phone}`} className="flex items-center p-4 bg-muted rounded-xl hover:bg-accent transition">
                          <Phone className="h-5 w-5 mr-4 text-primary" />
                          <span className="font-semibold">{selectedTechnician.phone}</span>
                        </a>
                        <a href={`mailto:${selectedTechnician.email}`} className="flex items-center p-4 bg-muted rounded-xl hover:bg-accent transition">
                          <Mail className="h-5 w-5 mr-4 text-primary" />
                          <span className="font-semibold">{selectedTechnician.email}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-12 pt-8 border-t">
                  <Button
                    variant={favorites.includes(selectedTechnician.id) ? "default" : "outline"}
                    onClick={() => toggleFavorite(selectedTechnician.id)}
                    className="flex-1 gap-2"
                  >
                    <Star className="h-5 w-5" />
                    {favorites.includes(selectedTechnician.id) ? 'Saved' : 'Save'}
                  </Button>
                  <Button onClick={() => {
                    handleCloseModal();
                    handleScheduleAppointment(selectedTechnician);
                  }} className="flex-1 gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Schedule Repair
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PCRepair;
