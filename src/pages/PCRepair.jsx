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
} from "../components/ui/dialog";
import { Search, Star, MapPin, Briefcase, CheckCircle, DollarSign, Phone, Mail, Monitor, Cpu, SearchX, Navigation, Filter, TrendingUp, Map as MapIcon, List, ArrowUpRight } from 'lucide-react';
import { techniciansAPI } from '../lib/api';
import { useToast } from '../hooks/use-toast';
import { Loader2 } from 'lucide-react';
import GoogleMap from '../components/GoogleMap';
import SEO from '../components/SEO';

const CURRENCY_INFO = {
  LKR: { symbol: 'Rs.', rate: 330, name: 'Sri Lankan Rupees', countries: ['LK'] },
  INR: { symbol: '₹', rate: 83, name: 'Indian Rupees', countries: ['IN'] },
  USD: { symbol: '$', rate: 1, name: 'US Dollars', countries: ['US'] },
  GBP: { symbol: '£', rate: 0.79, name: 'British Pounds', countries: ['GB'] },
  EUR: { symbol: '€', rate: 0.92, name: 'Euros', countries: ['DE', 'FR', 'IT', 'ES'] },
  AUD: { symbol: 'A$', rate: 1.52, name: 'Australian Dollars', countries: ['AU'] },
  CAD: { symbol: 'C$', rate: 1.36, name: 'Canadian Dollars', countries: ['CA'] },
  SGD: { symbol: 'S$', rate: 1.34, name: 'Singapore Dollars', countries: ['SG'] },
  MYR: { symbol: 'RM', rate: 4.47, name: 'Malaysian Ringgit', countries: ['MY'] },
  AED: { symbol: 'AED', rate: 3.67, name: 'UAE Dirham', countries: ['AE'] },
};

const PCRepair = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [loading, setLoading] = useState(true);
  const [technicians, setTechnicians] = useState([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [currency, setCurrency] = useState('LKR');
  const [locationLoading, setLocationLoading] = useState(false);
  const [manualLocation, setManualLocation] = useState('');
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [brand, setBrand] = useState('any');
  const [issue, setIssue] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [deviceType, setDeviceType] = useState('all');
  const [minimumRating, setMinimumRating] = useState('0');
  const [maxDistance, setMaxDistance] = useState('all');
  const [visibleCount, setVisibleCount] = useState(6);
  const [favorites, setFavorites] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    getUserLocation();
    const saved = localStorage.getItem('pc-repair-favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const getUserLocation = async () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`);
            const data = await response.json();
            if (data.results?.[0]) {
              const countryCode = data.results[0].address_components.find(c => c.types.includes('country'))?.short_name;
              const currencyCode = Object.keys(CURRENCY_INFO).find(key => CURRENCY_INFO[key].countries.includes(countryCode)) || 'USD';
              setCurrency(currencyCode);
            }
          } catch (e) { console.error(e); }
          fetchNearbyTechnicians(longitude, latitude);
        },
        () => {
          toast({ title: "Location Access Denied", description: "Showing all technicians.", variant: "default" });
          fetchAllTechnicians();
        },
        { timeout: 10000 }
      );
    } else {
      fetchAllTechnicians();
    }
    setLocationLoading(false);
  };

  const fetchNearbyTechnicians = async (lng, lat) => {
    setLoading(true);
    try {
      const response = await techniciansAPI.getNearby(lng, lat, 50000);
      setTechnicians(response.data || []);
      setFilteredTechnicians(response.data || []);
    } catch (e) { fetchAllTechnicians(); }
    setLoading(false);
  };

  const fetchAllTechnicians = async () => {
    setLoading(true);
    try {
      const response = await techniciansAPI.getAll();
      setTechnicians(response.data || []);
      setFilteredTechnicians(response.data || []);
    } catch (e) { setTechnicians([]); setFilteredTechnicians([]); }
    setLoading(false);
  };

  useEffect(() => {
    let filtered = [...technicians];
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      filtered = filtered.filter(t => t.name?.toLowerCase().includes(s) || t.specialization?.some(spec => spec.toLowerCase().includes(s)));
    }
    if (brand !== 'any') filtered = filtered.filter(t => t.brands?.includes(brand));
    if (issue !== 'all') filtered = filtered.filter(t => t.specialization?.includes(issue));
    const minRating = parseFloat(minimumRating);
    if (minRating > 0) filtered = filtered.filter(t => (t.rating || 0) >= minRating);

    setFilteredTechnicians(filtered);
  }, [searchTerm, brand, issue, minimumRating, technicians]);

  const convertPrice = (usd) => {
    const info = CURRENCY_INFO[currency];
    return `${info.symbol}${Math.round(usd * info.rate).toLocaleString()}`;
  };

  const toggleFavorite = (id) => {
    const next = favorites.includes(id) ? favorites.filter(fid => fid !== id) : [...favorites, id];
    setFavorites(next);
    localStorage.setItem('pc-repair-favorites', JSON.stringify(next));
  };

  return (
    <div className="bg-black text-white selection:bg-white selection:text-black font-sans overflow-x-hidden">
      <SEO title="PC & Laptop Repair - TechCare" description="Expert PC repair services." />

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-white/3 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-20">
        {/* Header Section */}
        <section className="mb-32">
          <div className="flex items-center gap-2 mb-8 opacity-60">
            <div className="w-2 h-2 bg-white" />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">PC & LAPTOP REPAIR</span>
          </div>

          <h1 className="text-[clamp(3rem,10vw,8rem)] font-bold leading-[0.9] tracking-tighter mb-12 uppercase italic">
            Expert PC<br />Repair Services
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-16 font-light leading-relaxed">
            Find trusted technicians for your computer, laptop, and hardware needs.
          </p>

          <div className="flex flex-wrap items-center gap-8 mb-20">
            {locationLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium tracking-widest uppercase">Detecting location</span>
              </div>
            ) : (
              <div className="flex gap-8">
                <button
                  onClick={getUserLocation}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-gray-400 transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  {userLocation ? "Location Detected" : "Detect Location"}
                </button>
                <button
                  onClick={() => setShowManualLocation(!showManualLocation)}
                  className="text-xs font-bold uppercase tracking-widest hover:text-gray-400 transition-colors"
                >
                  Enter Manually
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 border-l border-white/20 pl-8">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Currency: {CURRENCY_INFO[currency]?.name}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <button
              className="bg-white text-black px-12 py-6 text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-3 group"
              onClick={() => document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' })}
            >
              Find Technicians <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
            <button
              className="border border-white/30 text-white px-12 py-6 text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
              onClick={() => navigate('/register')}
            >
              Register as Technician
            </button>
          </div>
        </section>

        {/* Filters Section */}
        <section id="search-section" className="mb-32">
          <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
            <h2 className="text-3xl font-bold uppercase tracking-tighter italic">Refine Your Search</h2>
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
            >
              Reset All Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-4 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="SEARCH TECHNICIANS, SERVICES, OR LOCATIONS..."
                className="w-full bg-black border border-white/10 px-16 py-8 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-white transition-all placeholder:text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger className="bg-black border-white/10 h-16 rounded-none text-xs font-bold uppercase tracking-widest focus:ring-0 focus:border-white">
                <SelectValue placeholder="BRAND" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/10 text-white rounded-none">
                <SelectItem value="any">ALL BRANDS</SelectItem>
                <SelectItem value="dell">DELL</SelectItem>
                <SelectItem value="hp">HP</SelectItem>
                <SelectItem value="lenovo">LENOVO</SelectItem>
                <SelectItem value="apple">APPLE</SelectItem>
              </SelectContent>
            </Select>

            <Select value={issue} onValueChange={setIssue}>
              <SelectTrigger className="bg-black border-white/10 h-16 rounded-none text-xs font-bold uppercase tracking-widest focus:ring-0 focus:border-white">
                <SelectValue placeholder="ISSUE" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/10 text-white rounded-none">
                <SelectItem value="all">ALL ISSUES</SelectItem>
                <SelectItem value="Motherboard Repair">MOTHERBOARD</SelectItem>
                <SelectItem value="RAM Upgrade">RAM UPGRADE</SelectItem>
                <SelectItem value="Data Recovery">DATA RECOVERY</SelectItem>
              </SelectContent>
            </Select>

            <Select value={minimumRating} onValueChange={setMinimumRating}>
              <SelectTrigger className="bg-black border-white/10 h-16 rounded-none text-xs font-bold uppercase tracking-widest focus:ring-0 focus:border-white">
                <SelectValue placeholder="RATING" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/10 text-white rounded-none">
                <SelectItem value="0">ALL RATINGS</SelectItem>
                <SelectItem value="4">4+ STARS</SelectItem>
                <SelectItem value="4.5">4.5+ STARS</SelectItem>
              </SelectContent>
            </Select>

            <button
              className="bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2 h-16 text-xs font-bold uppercase tracking-widest"
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? <List className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}
              {showMap ? "Show List" : "Show Map"}
            </button>
          </div>

          <div className="mt-12 flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-white/40" />
            <span className="text-sm font-bold tracking-widest uppercase opacity-60">
              {filteredTechnicians.length} TECHNICIANS FOUND
            </span>
          </div>

          {showMap && (
            <div className="mt-12 h-[600px] border border-white/10 animate-in fade-in duration-500">
              <GoogleMap
                technicians={filteredTechnicians}
                center={userLocation}
                onTechnicianClick={(t) => { setSelectedTechnician(t); setShowDetailModal(true); }}
              />
            </div>
          )}
        </section>

        {/* Results Section */}
        <section className="mb-32">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <Loader2 className="h-12 w-12 animate-spin text-white" />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">LOADING EXPERTS</span>
            </div>
          ) : filteredTechnicians.length === 0 ? (
            <div className="text-center py-32 border border-white/5 bg-white/[0.02]">
              <SearchX className="h-12 w-12 mx-auto mb-6 opacity-20" />
              <h3 className="text-2xl font-bold uppercase tracking-tighter mb-4 italic">No technicians found</h3>
              <p className="text-gray-500 font-light max-w-sm mx-auto">Try adjusting your filters to find available experts in your area.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
              {filteredTechnicians.slice(0, visibleCount).map((tech) => (
                <TechnicianCard
                  key={tech._id || tech.id}
                  technician={tech}
                  convertPrice={convertPrice}
                  isFavorite={favorites.includes(tech._id || tech.id)}
                  onToggleFavorite={() => toggleFavorite(tech._id || tech.id)}
                  onViewDetails={() => { setSelectedTechnician(tech); setShowDetailModal(true); }}
                  onSchedule={() => navigate('/schedule', { state: { technician: tech, service: 'PC Repair' } })}
                />
              ))}
            </div>
          )}

          {visibleCount < filteredTechnicians.length && (
            <div className="mt-20 text-center">
              <button
                onClick={() => setVisibleCount(v => v + 6)}
                className="bg-white text-black px-16 py-6 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-all"
              >
                Load More Experts
              </button>
            </div>
          )}
        </section>
      </div>

      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl bg-black border-white/10 text-white p-0 rounded-none overflow-hidden scrollbar-hide">
          {selectedTechnician && (
            <div className="flex flex-col md:flex-row h-full">
              <div className="w-full md:w-1/2 h-[400px] md:h-auto overflow-hidden">
                <img
                  src={selectedTechnician.profileImage || selectedTechnician.image}
                  className="w-full h-full object-cover"
                  alt={selectedTechnician.name}
                />
              </div>
              <div className="w-full md:w-1/2 p-12 overflow-y-auto">
                <div className="flex items-center gap-2 mb-8 opacity-60">
                  <div className="w-1.5 h-1.5 bg-white" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">TECHNICIAN PROFILE</span>
                </div>

                <h2 className="text-4xl font-bold uppercase tracking-tighter mb-4 italic">{selectedTechnician.name}</h2>
                <div className="flex items-center gap-4 mb-10">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-white" />
                    <span className="text-sm font-bold tracking-tighter">{selectedTechnician.rating || '4.5'}</span>
                  </div>
                  <span className="text-xs text-gray-500 uppercase tracking-widest">{selectedTechnician.reviewCount || 0} reviews</span>
                </div>

                <div className="space-y-12 mb-12">
                  <section>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">Location</h4>
                    <p className="text-sm font-light leading-relaxed flex items-center gap-2">
                      <MapPin className="h-3 w-3" /> {selectedTechnician.location?.address}
                    </p>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">Pricing</h4>
                    <p className="text-3xl font-bold tracking-tighter">
                      {convertPrice(selectedTechnician.priceRange?.min || 50)} - {convertPrice(selectedTechnician.priceRange?.max || 250)}
                    </p>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">Experience</h4>
                    <p className="text-sm font-light">{selectedTechnician.experience || 5} Years in field</p>
                  </section>
                </div>

                <button
                  className="w-full bg-white text-black py-6 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-all mb-4"
                  onClick={() => navigate('/schedule', { state: { technician: selectedTechnician, service: 'PC Repair' } })}
                >
                  Schedule Now
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const TechnicianCard = ({ technician, convertPrice, isFavorite, onToggleFavorite, onViewDetails, onSchedule }) => (
  <div className="bg-black p-8 group relative overflow-hidden flex flex-col transition-all hover:bg-white/[0.03]">
    <div className="aspect-[4/5] overflow-hidden mb-8 relative">
      <img
        src={technician.profileImage || technician.image || 'https://images.unsplash.com/photo-1587829741301-dc798b83defb?w=400&h=300&fit=crop'}
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        alt={technician.name}
      />
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
        className="absolute top-6 right-6 p-3 bg-black/80 text-white backdrop-blur-md hover:bg-white hover:text-black transition-all"
      >
        <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
      </button>
    </div>

    <div className="mt-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-2xl font-bold uppercase tracking-tighter italic mb-1">{technician.name}</h3>
          <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
            <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-current" /> {technician.rating || '4.5'}</span>
            <span>{technician.experience || 5}Y EXP</span>
          </div>
        </div>
      </div>

      <div className="space-y-1 mb-8 opacity-60">
        {(technician.specialization || []).slice(0, 2).map((s, i) => (
          <p key={i} className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <div className="w-1 h-1 bg-white" /> {s}
          </p>
        ))}
      </div>

      <p className="text-2xl font-bold tracking-tighter mb-8 italic">
        {convertPrice(technician.priceRange?.min || 50)} - {convertPrice(technician.priceRange?.max || 250)}
      </p>

      <div className="grid grid-cols-2 gap-px bg-white/10">
        <button
          onClick={onViewDetails}
          className="bg-black py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
        >
          Details
        </button>
        <button
          onClick={onSchedule}
          className="bg-white text-black py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-all"
        >
          Schedule
        </button>
      </div>
    </div>
  </div>
);

export default PCRepair;