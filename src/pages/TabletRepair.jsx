import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { Search, Star, MapPin, Briefcase, CheckCircle, DollarSign, Phone, Mail, Tablet, Wrench, SearchX, Navigation, Filter, TrendingUp, Map as MapIcon, List, Cpu } from 'lucide-react';
import GoogleMap from '../components/GoogleMap';
import SEO from '../components/SEO';
import { techniciansAPI } from '../lib/api';
import { fetchRepairShops } from '../lib/googleSheetsService';
import { useToast } from '../hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import realtimeService from '../utils/realtimeService';

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

const TabletRepair = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [loading, setLoading] = useState(true);
  const [technicians, setTechnicians] = useState([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
  const [showMap, setShowMap] = useState(false);

  const [userLocation, setUserLocation] = useState(null);
  const [userCountry, setUserCountry] = useState('LK');
  const [currency, setCurrency] = useState('LKR');
  const [locationLoading, setLocationLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [brand, setBrand] = useState('all');
  const [issue, setIssue] = useState('all');
  const [minimumRating, setMinimumRating] = useState('0');
  const [maxDistance, setMaxDistance] = useState('all');

  const [visibleCount, setVisibleCount] = useState(6);
  const [favorites, setFavorites] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  // Fetch technicians directly from Supabase for real-time data
  const fetchTechniciansFromSupabase = useCallback(async () => {
    try {
      setLoading(true);
      const { data: techData, error } = await supabase
        .from('technicians')
        .select('*')
        .order('rating', { ascending: false });

      if (error) {
        console.error('Supabase technicians fetch error:', error);
        throw error;
      }

      if (techData && techData.length > 0) {
        // Transform Supabase data to expected format
        const transformed = techData.map(tech => ({
          _id: tech.id,
          id: tech.id,
          name: tech.name,
          email: tech.email,
          phone: tech.phone,
          status: tech.status || 'active',
          specialization: tech.services || tech.specialization || ['Tablet Repair', 'iPad Repair'],
          rating: tech.rating || 4.5,
          reviewCount: tech.review_count || 0,
          location: {
            address: tech.address || tech.location,
            coordinates: tech.longitude && tech.latitude ? [tech.longitude, tech.latitude] : null
          },
          priceRange: tech.price_range || { min: 800, max: 20000 },
          verified: tech.is_verified,
          experience: tech.experience,
          completedJobs: tech.completed_jobs || 0,
          profileImage: tech.profile_image,
          description: tech.description,
          brands: tech.brands || ['all'],
          district: tech.district
        }));

        // Ensure unique technicians by ID
        const uniqueTechs = Array.from(new Map(transformed.map(t => [t.id, t])).values());

        setTechnicians(uniqueTechs);
        setFilteredTechnicians(uniqueTechs);
        return uniqueTechs;
      }
      return [];
    } catch (err) {
      console.error('Error fetching technicians from Supabase:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUserLocation();
    loadFavorites();

    // Subscribe to real-time technician updates
    const unsubscribe = realtimeService.subscribeToTechnicians((payload) => {
      console.log('[TabletRepair] Real-time update:', payload.eventType);
      fetchTechniciansFromSupabase();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const getUserLocation = async () => {
    setLocationLoading(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const location = { lat: latitude, lng: longitude };
            setUserLocation(location);

            try {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
              );
              const data = await response.json();

              if (data.results && data.results.length > 0) {
                const addressComponents = data.results[0].address_components;
                const countryComponent = addressComponents.find(comp =>
                  comp.types.includes('country')
                );

                if (countryComponent) {
                  const countryCode = countryComponent.short_name;
                  setUserCountry(countryCode);

                  const currencyCode = Object.keys(CURRENCY_INFO).find(key =>
                    CURRENCY_INFO[key].countries.includes(countryCode)
                  ) || 'USD';

                  setCurrency(currencyCode);

                  toast({
                    title: "Location Detected",
                    description: `Currency set to ${CURRENCY_INFO[currencyCode].name}`,
                  });
                }
              }
            } catch (error) {
              console.error('Geocoding error:', error);
            }

            fetchNearbyTechnicians(longitude, latitude);
          },
          (error) => {
            console.warn('Geolocation permission denied:', error.message);
            toast({
              title: "Location Access Denied",
              description: "Showing all available Tablet technicians.",
            });
            fetchAllTechnicians();
          }
        );
      } else {
        fetchAllTechnicians();
      }
    } catch (error) {
      console.error('Location error:', error);
      fetchAllTechnicians();
    } finally {
      setLocationLoading(false);
    }
  };

  const fetchNearbyTechnicians = async (lng, lat) => {
    try {
      setLoading(true);
      const supabaseData = await fetchTechniciansFromSupabase();
      if (supabaseData && supabaseData.length > 0) {
        const nearbyTechs = supabaseData.filter(tech => {
          if (!tech.location?.coordinates) return true;
          const distance = calculateDistance(
            lat, lng,
            tech.location.coordinates[1],
            tech.location.coordinates[0]
          );
          return distance <= 50;
        });
        setTechnicians(nearbyTechs.length > 0 ? nearbyTechs : supabaseData);
        setFilteredTechnicians(nearbyTechs.length > 0 ? nearbyTechs : supabaseData);
      }
    } catch (error) {
      console.error('Error fetching nearby technicians:', error);
      fetchAllTechnicians();
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTechnicians = async () => {
    try {
      setLoading(true);
      const supabaseData = await fetchTechniciansFromSupabase();
      if (supabaseData && supabaseData.length > 0) {
        return;
      }
      await loadFromGoogleSheets();
    } catch (error) {
      console.error('Error fetching technicians:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFromGoogleSheets = async () => {
    try {
      const shops = await fetchRepairShops();
      const techData = shops
        .filter(shop => shop.services?.some(s => s.toLowerCase().includes('tablet') || s.toLowerCase().includes('ipad')))
        .map(shop => ({
          _id: shop.id,
          id: shop.id,
          name: shop.name,
          specialization: shop.services || ['Tablet Repair'],
          rating: shop.rating || 4.5,
          reviewCount: shop.reviews || 40,
          location: {
            address: shop.address,
            coordinates: shop.latitude && shop.longitude ? [shop.longitude, shop.latitude] : null
          },
          priceRange: { min: 800, max: 20000 },
          verified: shop.verified,
          status: 'active',
          phone: shop.phone,
          district: shop.district
        }));
      setTechnicians(techData);
      setFilteredTechnicians(techData);
    } catch (sheetError) {
      console.error('Google Sheets load failed:', sheetError);
      setTechnicians([]);
      setFilteredTechnicians([]);
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('tablet-repair-favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const convertPrice = (usdPrice) => {
    const rate = CURRENCY_INFO[currency]?.rate || 1;
    const converted = Math.round(usdPrice * rate);
    const symbol = CURRENCY_INFO[currency]?.symbol || '$';
    return `${symbol}${converted.toLocaleString()}`;
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, brand, issue, minimumRating, maxDistance, sortBy, technicians]);

  const applyFilters = () => {
    let filtered = [...technicians];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(tech =>
        tech.name?.toLowerCase().includes(search) ||
        tech.specialization?.some(spec => spec.toLowerCase().includes(search)) ||
        tech.location?.address?.toLowerCase().includes(search)
      );
    }

    if (brand !== 'all') {
      filtered = filtered.filter(tech =>
        tech.brands?.includes(brand) || tech.brands?.includes('all')
      );
    }

    if (issue !== 'all') {
      filtered = filtered.filter(tech =>
        tech.specialization?.includes(issue)
      );
    }

    const minRating = parseFloat(minimumRating);
    if (minRating > 0) {
      filtered = filtered.filter(tech => (tech.rating || 0) >= minRating);
    }

    if (maxDistance !== 'all' && userLocation) {
      filtered = filtered.filter(tech => {
        if (!tech.location?.coordinates) return false;
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          tech.location.coordinates[1],
          tech.location.coordinates[0]
        );

        if (maxDistance === '0-5') return distance <= 5;
        if (maxDistance === '5-10') return distance <= 10;
        if (maxDistance === '10-25') return distance <= 25;
        return true;
      });
    }

    if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredTechnicians(filtered);
    setVisibleCount(6);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setBrand('all');
    setIssue('all');
    setMinimumRating('0');
    setMaxDistance('all');
    setSortBy('rating');
  };

  const toggleFavorite = (techId) => {
    const newFavorites = favorites.includes(techId)
      ? favorites.filter(id => id !== techId)
      : [...favorites, techId];
    setFavorites(newFavorites);
    localStorage.setItem('tablet-repair-favorites', JSON.stringify(newFavorites));
  };

  const handleViewDetails = (tech) => {
    setSelectedTechnician(tech);
    setShowDetailModal(true);
  };

  const handleScheduleAppointment = (tech) => {
    navigate('/schedule', { state: { technician: tech, service: 'Tablet Repair' } });
  };

  return (
    <div className="bg-black text-white">
      <SEO
        title="Tablet & iPad Repair - TechCare"
        description="Expert tablet repair services near you. iPad screen repair, battery replacement, and charging port fixes."
      />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-3 h-3 bg-white"></div>
              <span className="text-sm tracking-[0.3em] uppercase text-gray-400">Tablet Repair</span>
              <div className="w-3 h-3 bg-white"></div>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
              Expert Tablet & iPad
              <br />
              <span className="text-gray-500">Repair Services</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
              Professional care for your handheld devices. iPad, Samsung, and more.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              {locationLoading ? (
                <div className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span className="text-sm text-gray-300">Detecting location...</span>
                </div>
              ) : userLocation ? (
                <div className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/20 text-white">
                  <Navigation className="h-4 w-4" />
                  <span className="text-sm font-medium">Location Enabled</span>
                </div>
              ) : (
                <button
                  className="px-6 py-3 border border-white/30 text-white hover:bg-white hover:text-black transition-all flex items-center gap-2"
                  onClick={getUserLocation}
                >
                  <MapPin className="h-4 w-4" />
                  Detect Location
                </button>
              )}

              <div className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10">
                <DollarSign className="h-4 w-4 text-white" />
                <span className="text-sm text-gray-300">Currency: {CURRENCY_INFO[currency]?.name}</span>
              </div>
            </div>
          </div>

          {/* Filters Dashboard */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, specialist, or location..."
                  className="w-full bg-black/50 border border-white/10 pl-12 pr-4 py-4 focus:outline-none focus:border-white transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={brand} onValueChange={setBrand}>
                <SelectTrigger className="bg-black/50 border-white/10 h-auto py-4">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="all">All Brands</SelectItem>
                  <SelectItem value="apple">APPLE iPad</SelectItem>
                  <SelectItem value="samsung">SAMSUNG GALAXY TAB</SelectItem>
                  <SelectItem value="microsoft">MICROSOFT SURFACE</SelectItem>
                  <SelectItem value="lenovo">LENOVO TAB</SelectItem>
                  <SelectItem value="huawei">HUAWEI</SelectItem>
                  <SelectItem value="amazon">AMAZON FIRE</SelectItem>
                </SelectContent>
              </Select>

              <Select value={issue} onValueChange={setIssue}>
                <SelectTrigger className="bg-black/50 border-white/10 h-auto py-4">
                  <SelectValue placeholder="Common Issue" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="all">All Issues</SelectItem>
                  <SelectItem value="Screen Repair">Screen Repair</SelectItem>
                  <SelectItem value="Battery Replacement">Battery Replacement</SelectItem>
                  <SelectItem value="Charging Port">Charging Port</SelectItem>
                  <SelectItem value="Touch Screen">Touch Screen Issues</SelectItem>
                  <SelectItem value="Software Issues">Software/iOS Help</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              <Select value={minimumRating} onValueChange={setMinimumRating}>
                <SelectTrigger className="bg-black/50 border-white/10">
                  <SelectValue placeholder="Min Rating" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="0">Any Rating</SelectItem>
                  <SelectItem value="4.0">4.0+ Stars</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                </SelectContent>
              </Select>

              <Select value={maxDistance} onValueChange={setMaxDistance}>
                <SelectTrigger className="bg-black/50 border-white/10">
                  <SelectValue placeholder="Max Distance" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="all">Any Distance</SelectItem>
                  <SelectItem value="0-5">Within 5 km</SelectItem>
                  <SelectItem value="5-10">Within 10 km</SelectItem>
                  <SelectItem value="10-25">Within 25 km</SelectItem>
                </SelectContent>
              </Select>

              <button
                onClick={() => setShowMap(!showMap)}
                className="flex items-center justify-center gap-2 px-6 py-2 border border-white/10 hover:bg-white hover:text-black transition-all"
              >
                {showMap ? <List className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}
                {showMap ? 'Show List' : 'Show Map View'}
              </button>

              <button
                onClick={handleResetFilters}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {showMap && (
            <div className="mt-6 border border-white/10 h-[500px]">
              <GoogleMap
                technicians={filteredTechnicians}
                center={userLocation}
                onTechnicianClick={handleViewDetails}
              />
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="px-4 md:px-8 py-20 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-2 h-2 bg-white"></div>
            <h2 className="text-3xl font-bold text-white">
              Tablet Specialists ({filteredTechnicians.length})
            </h2>
          </div>

          {loading && technicians.length === 0 ? (
            <div className="text-center py-24">
              <Loader2 className="h-12 w-12 mx-auto animate-spin" />
            </div>
          ) : filteredTechnicians.length === 0 ? (
            <div className="text-center py-24 border border-white/10">
              <SearchX className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-gray-400">No tablet technicians found for these filters.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTechnicians.slice(0, visibleCount).map((tech) => (
                <TechnicianCard
                  key={tech.id}
                  technician={tech}
                  currency={currency}
                  convertPrice={convertPrice}
                  isFavorite={favorites.includes(tech.id)}
                  onToggleFavorite={() => toggleFavorite(tech.id)}
                  onViewDetails={() => handleViewDetails(tech)}
                  onSchedule={() => handleScheduleAppointment(tech)}
                  userLocation={userLocation}
                  calculateDistance={calculateDistance}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-zinc-950 border-white/10">
          {selectedTechnician && (
            <DetailModal
              technician={selectedTechnician}
              currency={currency}
              convertPrice={convertPrice}
              isFavorite={favorites.includes(selectedTechnician.id)}
              onToggleFavorite={() => toggleFavorite(selectedTechnician.id)}
              onSchedule={() => {
                setShowDetailModal(false);
                handleScheduleAppointment(selectedTechnician);
              }}
              userLocation={userLocation}
              calculateDistance={calculateDistance}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const TechnicianCard = ({
  technician,
  convertPrice,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
  onSchedule,
  userLocation,
  calculateDistance
}) => {
  const distance = userLocation && technician.location?.coordinates
    ? calculateDistance(
      userLocation.lat,
      userLocation.lng,
      technician.location.coordinates[1],
      technician.location.coordinates[0]
    )
    : null;

  const priceMin = technician.priceRange?.min || 800;
  const priceMax = technician.priceRange?.max || 20000;
  const priceDisplay = `${convertPrice(priceMin)} - ${convertPrice(priceMax)}`;

  return (
    <div className="group bg-zinc-900 border border-white/10 hover:border-white/30 transition-all">
      <div className="relative overflow-hidden aspect-video">
        <img
          src={technician.profileImage || `https://api.dicebear.com/9.x/micah/svg?seed=${technician.name}&backgroundColor=18181b`}
          alt={technician.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <button
          className="absolute top-4 right-4 w-10 h-10 bg-black/50 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all"
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
        >
          <Star className={`h-5 w-5 ${isFavorite ? 'fill-white text-white' : 'text-white'}`} />
        </button>
        {technician.status && (
          <div className={`absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${technician.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'
            }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${technician.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
              }`}></div>
            {technician.status}
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-xl text-white">{technician.name}</h3>
          <div className="flex items-center gap-1 text-white">
            <Star className="h-4 w-4 fill-white" />
            <span className="font-semibold text-sm">{technician.rating || '4.5'}</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-xs text-gray-400 flex items-center">
            <MapPin className="h-3 w-3 mr-2" />
            {technician.location?.address}
            {distance && <span className="ml-2 font-bold text-white">({distance.toFixed(1)} km)</span>}
          </p>
          <p className="text-xs text-gray-400 flex items-center">
            <Briefcase className="h-3 w-3 mr-2" />
            {technician.experience || 3} years exp
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {(technician.specialization || []).slice(0, 2).map((s, i) => (
            <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider">
              {s}
            </span>
          ))}
        </div>

        <p className="text-xl font-bold text-white mb-6 italic">{priceDisplay}</p>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={onViewDetails} className="py-3 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all">
            Details
          </button>
          <button onClick={onSchedule} className="py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailModal = ({ technician, convertPrice, isFavorite, onToggleFavorite, onSchedule, userLocation, calculateDistance }) => {
  const distance = userLocation && technician.location?.coordinates
    ? calculateDistance(userLocation.lat, userLocation.lng, technician.location.coordinates[1], technician.location.coordinates[0])
    : null;

  const priceMin = technician.priceRange?.min || 800;
  const priceMax = technician.priceRange?.max || 20000;
  const priceDisplay = `${convertPrice(priceMin)} - ${convertPrice(priceMax)}`;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4">{technician.name}</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={technician.profileImage || `https://api.dicebear.com/9.x/micah/svg?seed=${technician.name}&backgroundColor=18181b`} className="w-full aspect-square object-cover mb-4" />
          <p className="text-gray-400 leading-relaxed">{technician.description || 'Expert tablet and handheld device repair services. Quality parts and fast turnaround.'}</p>
        </div>
        <div className="space-y-6">
          <div className="p-4 bg-white/5 border border-white/10">
            <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Estimated Price</h4>
            <p className="text-2xl font-bold">{priceDisplay}</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-gray-500">Service Highlights</h4>
            <div className="grid grid-cols-2 gap-2">
              {(technician.specialization || []).map((s, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-white/5 text-xs">
                  <CheckCircle className="h-3 w-3 text-emerald-400" />
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase text-gray-500">Location</h4>
            <p className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" /> {technician.location?.address}
            </p>
            {distance && <p className="text-xs text-emerald-400 font-bold">{distance.toFixed(1)} km from your location</p>}
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={onSchedule} className="flex-1 bg-white text-black hover:bg-zinc-200">
              Schedule Appointment
            </Button>
            <Button variant="outline" onClick={onToggleFavorite} className="border-white/10">
              <Star className={`h-4 w-4 ${isFavorite ? 'fill-white' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabletRepair;
