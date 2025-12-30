import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog";
import { Search, Star, MapPin, Briefcase, CheckCircle, DollarSign, Phone, Mail, Smartphone, Wrench, SearchX, Navigation, Filter, TrendingUp, Map as MapIcon, List } from 'lucide-react';
import GoogleMap from '../components/GoogleMap';
import SEO from '../components/SEO';
import { techniciansAPI } from '../lib/api';
import { useToast } from '../hooks/use-toast';
import { Loader2 } from 'lucide-react';

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

const MobileRepair = () => {
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
    const [manualLocation, setManualLocation] = useState('');
    const [showManualLocation, setShowManualLocation] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [brand, setBrand] = useState('all');
    const [issue, setIssue] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [minimumRating, setMinimumRating] = useState('0');
    const [maxDistance, setMaxDistance] = useState('all');

    const [visibleCount, setVisibleCount] = useState(6);
    const [favorites, setFavorites] = useState([]);
    const [selectedTechnician, setSelectedTechnician] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [sortBy, setSortBy] = useState('rating');

    useEffect(() => {
        getUserLocation();
        loadFavorites();
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
                        console.error('Geolocation error:', error);
                        toast({
                            title: "Location Access Denied",
                            description: "Please enable location services to see nearby technicians.",
                            variant: "destructive",
                        });
                        fetchAllTechnicians();
                    }
                );
            } else {
                toast({
                    title: "Geolocation Not Supported",
                    description: "Your browser doesn't support geolocation.",
                    variant: "destructive",
                });
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
            const response = await techniciansAPI.getNearby(lng, lat, 50000);
            const techData = response.data || [];
            setTechnicians(techData);
            setFilteredTechnicians(techData);
        } catch (error) {
            console.error('Error fetching nearby technicians:', error);
            toast({
                title: "Error",
                description: "Failed to fetch nearby technicians. Loading all technicians...",
                variant: "destructive",
            });
            fetchAllTechnicians();
        } finally {
            setLoading(false);
        }
    };

    const fetchAllTechnicians = async () => {
        try {
            setLoading(true);
            const response = await techniciansAPI.getAll();
            const techData = response.data || [];
            setTechnicians(techData);
            setFilteredTechnicians(techData);
        } catch (error) {
            console.error('Error fetching technicians:', error);
            toast({
                title: "Backend Unavailable",
                description: "Could not connect to server. Please ensure MongoDB and backend server are running.",
                variant: "default",
            });
            setTechnicians([]);
            setFilteredTechnicians([]);
        } finally {
            setLoading(false);
        }
    };

    const loadFavorites = () => {
        const saved = localStorage.getItem('mobile-repair-favorites');
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
    }, [searchTerm, brand, issue, priceRange, minimumRating, maxDistance, sortBy, technicians]);

    const applyFilters = () => {
        let filtered = [...technicians];

        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(tech =>
                tech.name?.toLowerCase().includes(search) ||
                tech.specialization?.some(spec => spec.toLowerCase().includes(search)) ||
                tech.location?.address?.toLowerCase().includes(search) ||
                tech.description?.toLowerCase().includes(search)
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

        if (priceRange !== 'all') {
            filtered = filtered.filter(tech => {
                const minPrice = tech.priceRange?.min || 0;
                const maxPrice = tech.priceRange?.max || 1000;

                if (priceRange === '0-50') return minPrice <= 50;
                if (priceRange === '50-100') return maxPrice >= 50 && minPrice <= 100;
                if (priceRange === '100-200') return maxPrice >= 100 && minPrice <= 200;
                if (priceRange === '200+') return maxPrice >= 200;
                return true;
            });
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
                if (maxDistance === '25+') return distance <= 100;
                return true;
            });
        }

        if (sortBy === 'rating') {
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortBy === 'reviews') {
            filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        } else if (sortBy === 'price-low') {
            filtered.sort((a, b) => (a.priceRange?.min || 0) - (b.priceRange?.min || 0));
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => (b.priceRange?.max || 0) - (a.priceRange?.max || 0));
        } else if (sortBy === 'distance' && userLocation) {
            filtered.sort((a, b) => {
                if (!a.location?.coordinates || !b.location?.coordinates) return 0;
                const distA = calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    a.location.coordinates[1],
                    a.location.coordinates[0]
                );
                const distB = calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    b.location.coordinates[1],
                    b.location.coordinates[0]
                );
                return distA - distB;
            });
        }

        setFilteredTechnicians(filtered);
        setVisibleCount(6);
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setBrand('all');
        setIssue('all');
        setPriceRange('all');
        setMinimumRating('0');
        setMaxDistance('all');
        setSortBy('rating');
        setShowManualLocation(false);
        setManualLocation('');
    };

    const handleManualLocationSubmit = async (e) => {
        e.preventDefault();
        if (!manualLocation.trim()) return;

        setLocationLoading(true);
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(manualLocation)}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry.location;
                const location = { lat, lng };
                setUserLocation(location);
                
                const countryComp = data.results[0].address_components.find(c => c.types.includes('country'));
                if (countryComp) {
                    const countryCode = countryComp.short_name;
                    setUserCountry(countryCode);
                    const currencyCode = Object.keys(CURRENCY_INFO).find(key =>
                        CURRENCY_INFO[key].countries.includes(countryCode)
                    ) || 'USD';
                    setCurrency(currencyCode);
                }

                toast({
                    title: "Location Updated",
                    description: `Showing technicians near ${data.results[0].formatted_address}`,
                });
                
                fetchNearbyTechnicians(lng, lat);
            } else {
                toast({
                    title: "Location Not Found",
                    description: "Could not find the specified location. Please try again.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Manual location error:', error);
            toast({
                title: "Error",
                description: "Failed to update location.",
                variant: "destructive"
            });
        } finally {
            setLocationLoading(false);
        }
    };

    const handleLoadMore = () => {
        setVisibleCount(prev => Math.min(prev + 6, filteredTechnicians.length));
    };

    const toggleFavorite = (techId) => {
        const newFavorites = favorites.includes(techId)
            ? favorites.filter(id => id !== techId)
            : [...favorites, techId];

        setFavorites(newFavorites);
        localStorage.setItem('mobile-repair-favorites', JSON.stringify(newFavorites));

        toast({
            title: newFavorites.includes(techId) ? "Added to Favorites" : "Removed from Favorites",
            description: newFavorites.includes(techId)
                ? "Technician saved to your favorites"
                : "Technician removed from favorites",
        });
    };

    const handleViewDetails = (tech) => {
        setSelectedTechnician(tech);
        setShowDetailModal(true);
    };

    const handleScheduleAppointment = (tech) => {
        navigate('/schedule', { state: { technician: tech, service: 'Mobile Repair' } });
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedTechnician(null);
    };

    const featuredTechnicians = [...filteredTechnicians]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3);

    return (
        <div className="bg-black text-white">
            <SEO
                title="Mobile Repair Services - TechCare"
                description="Expert mobile phone and tablet repair technicians near you. Screen replacement, battery fix, and more."
                keywords="mobile repair, phone repair, screen replacement, battery replacement, smartphone technician"
            />
            
            {/* Hero Section - Landing Page Style */}
            <section className="relative pt-16 pb-24 px-4 md:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                </div>
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <div className="w-3 h-3 bg-white"></div>
                            <span className="text-sm tracking-[0.3em] uppercase text-gray-400">Mobile Repair</span>
                            <div className="w-3 h-3 bg-white"></div>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
                            Expert Mobile
                            <br />
                            <span className="text-gray-500">Repair Services</span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
                            Find trusted technicians for your smartphone and tablet repairs.
                            {userLocation && <span className="text-white font-medium"> Showing technicians near you.</span>}
                        </p>

                        {/* Location and Currency Info */}
                        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                            {locationLoading ? (
                                <div className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-none">
                                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                                    <span className="text-sm text-gray-300">Detecting location...</span>
                                </div>
                            ) : userLocation ? (
                                <div className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/20 rounded-none text-white">
                                    <Navigation className="h-4 w-4" />
                                    <span className="text-sm font-medium">Location Enabled</span>
                                    <button 
                                        className="ml-2 px-3 py-1 text-xs border border-white/30 hover:bg-white hover:text-black transition-all"
                                        onClick={() => setShowManualLocation(true)}
                                    >
                                        Change
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <button 
                                        className="px-6 py-3 border border-white/30 text-white hover:bg-white hover:text-black transition-all flex items-center gap-2"
                                        onClick={getUserLocation}
                                    >
                                        <MapPin className="h-4 w-4" />
                                        Detect Location
                                    </button>
                                    <button 
                                        className="px-6 py-3 text-gray-400 hover:text-white transition-all"
                                        onClick={() => setShowManualLocation(true)}
                                    >
                                        Enter Manually
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-none">
                                <DollarSign className="h-4 w-4 text-white" />
                                <span className="text-sm text-gray-300">Currency: {CURRENCY_INFO[currency]?.name}</span>
                            </div>
                        </div>

                        {showManualLocation && (
                            <div className="max-w-md mx-auto mb-12 p-6 bg-white/5 border border-white/10">
                                <form onSubmit={handleManualLocationSubmit} className="flex gap-3">
                                    <div className="relative flex-1">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input 
                                            type="text"
                                            placeholder="Enter city, zip, or address..."
                                            className="w-full pl-12 pr-4 py-3 bg-black border border-white/20 text-white placeholder-gray-500 focus:border-white focus:outline-none"
                                            value={manualLocation}
                                            onChange={(e) => setManualLocation(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={locationLoading}
                                        className="px-6 py-3 bg-white text-black font-medium hover:bg-gray-200 transition-all disabled:opacity-50"
                                    >
                                        {locationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowManualLocation(false)}
                                        className="px-4 py-3 text-gray-400 hover:text-white transition-all"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                className="group px-8 py-4 bg-white text-black font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
                                onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                <Smartphone className="h-5 w-5" />
                                <span>Find Technicians</span>
                                <svg className="w-4 h-4 group-hover:rotate-45 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                                </svg>
                            </button>
                            <button
                                className="px-8 py-4 border border-white/30 text-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
                                onClick={() => navigate('/register', { state: { role: 'technician' } })}
                            >
                                <Wrench className="h-5 w-5" />
                                <span>Register as Technician</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters Section */}
            <section className="px-4 md:px-8 py-12 bg-gray-950 border-y border-white/10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-4 items-end justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Filter className="h-5 w-5 text-white" />
                            <h2 className="text-xl font-bold text-white">Refine Your Search</h2>
                        </div>
                        <button
                            onClick={handleResetFilters}
                            className="text-gray-400 hover:text-white transition-colors text-sm"
                        >
                            Reset All Filters
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative lg:col-span-3">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                className="w-full pl-12 pr-4 py-4 bg-black border border-white/20 text-white placeholder-gray-500 focus:border-white focus:outline-none"
                                placeholder="Search technicians, services, or locations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Brand */}
                        <Select value={brand} onValueChange={setBrand}>
                            <SelectTrigger className="bg-black border-white/20 text-white h-12">
                                <SelectValue placeholder="Device Brand" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-white/20">
                                <SelectItem value="all">All Brands</SelectItem>
                                <SelectItem value="Apple">Apple</SelectItem>
                                <SelectItem value="Samsung">Samsung</SelectItem>
                                <SelectItem value="Google">Google Pixel</SelectItem>
                                <SelectItem value="OnePlus">OnePlus</SelectItem>
                                <SelectItem value="Xiaomi">Xiaomi</SelectItem>
                                <SelectItem value="Huawei">Huawei</SelectItem>
                                <SelectItem value="Oppo">Oppo</SelectItem>
                                <SelectItem value="Vivo">Vivo</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Issue */}
                        <Select value={issue} onValueChange={setIssue}>
                            <SelectTrigger className="bg-black border-white/20 text-white h-12">
                                <SelectValue placeholder="Issue Type" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-white/20">
                                <SelectItem value="all">All Issues</SelectItem>
                                <SelectItem value="Screen Repair">Screen Repair</SelectItem>
                                <SelectItem value="Battery Replacement">Battery Replacement</SelectItem>
                                <SelectItem value="Camera Repair">Camera Repair</SelectItem>
                                <SelectItem value="Charging Port">Charging Port</SelectItem>
                                <SelectItem value="Water Damage">Water Damage</SelectItem>
                                <SelectItem value="Speaker/Microphone">Speaker/Microphone</SelectItem>
                                <SelectItem value="Software Issues">Software Issues</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Price Range */}
                        <Select value={priceRange} onValueChange={setPriceRange}>
                            <SelectTrigger className="bg-black border-white/20 text-white h-12">
                                <SelectValue placeholder="Price Range" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-white/20">
                                <SelectItem value="all">All Prices</SelectItem>
                                <SelectItem value="0-50">{convertPrice(0)} - {convertPrice(50)}</SelectItem>
                                <SelectItem value="50-100">{convertPrice(50)} - {convertPrice(100)}</SelectItem>
                                <SelectItem value="100-200">{convertPrice(100)} - {convertPrice(200)}</SelectItem>
                                <SelectItem value="200+">{convertPrice(200)}+</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Rating */}
                        <Select value={minimumRating} onValueChange={setMinimumRating}>
                            <SelectTrigger className="bg-black border-white/20 text-white h-12">
                                <SelectValue placeholder="Minimum Rating" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-white/20">
                                <SelectItem value="0">All Ratings</SelectItem>
                                <SelectItem value="3">3+ Stars</SelectItem>
                                <SelectItem value="4">4+ Stars</SelectItem>
                                <SelectItem value="4.5">4.5+ Stars</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Distance */}
                        {userLocation && (
                            <Select value={maxDistance} onValueChange={setMaxDistance}>
                                <SelectTrigger className="bg-black border-white/20 text-white h-12">
                                    <SelectValue placeholder="Distance" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-white/20">
                                    <SelectItem value="all">Any Distance</SelectItem>
                                    <SelectItem value="0-5">Within 5 km</SelectItem>
                                    <SelectItem value="5-10">Within 10 km</SelectItem>
                                    <SelectItem value="10-25">Within 25 km</SelectItem>
                                    <SelectItem value="25+">Within 100 km</SelectItem>
                                </SelectContent>
                            </Select>
                        )}

                        {/* Sort */}
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="bg-black border-white/20 text-white h-12">
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-white/20">
                                <SelectItem value="rating">Highest Rating</SelectItem>
                                <SelectItem value="reviews">Most Reviews</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                                {userLocation && <SelectItem value="distance">Nearest First</SelectItem>}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Results Counter & Map Toggle */}
                    <div className="mt-8 p-6 bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-lg font-medium flex items-center gap-3 text-white">
                            <TrendingUp className="h-5 w-5" />
                            <span>{filteredTechnicians.length} technician{filteredTechnicians.length !== 1 ? 's' : ''} found</span>
                        </p>

                        <div className="flex items-center gap-3">
                            {loading && (
                                <Loader2 className="h-5 w-5 animate-spin text-white" />
                            )}
                            <button
                                onClick={() => setShowMap(!showMap)}
                                className={`flex items-center gap-2 px-6 py-3 border transition-all ${
                                    showMap 
                                        ? 'bg-white text-black border-white' 
                                        : 'border-white/30 text-white hover:bg-white hover:text-black'
                                }`}
                            >
                                {showMap ? <List className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}
                                {showMap ? "Show List" : "Show Map"}
                            </button>
                        </div>
                    </div>

                    {/* Map View */}
                    {showMap && (
                        <div className="mt-6 border border-white/10">
                            <GoogleMap
                                technicians={filteredTechnicians}
                                center={userLocation}
                                onTechnicianClick={handleViewDetails}
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* Loading State */}
            {loading && technicians.length === 0 && (
                <div className="text-center py-24 bg-black">
                    <Loader2 className="h-16 w-16 mx-auto mb-6 text-white animate-spin" />
                    <h3 className="text-2xl font-bold mb-4 text-white">Loading Technicians...</h3>
                    <p className="text-gray-400">Please wait while we fetch the best technicians for you</p>
                </div>
            )}

            {/* Featured Technicians */}
            {!loading && featuredTechnicians.length > 0 && (
                <section id="featured" className="px-4 md:px-8 py-20 bg-black">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-12">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-white"></div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white">Top Rated Technicians</h2>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredTechnicians.map((tech) => (
                                <TechnicianCard
                                    key={tech._id || tech.id}
                                    technician={tech}
                                    currency={currency}
                                    convertPrice={convertPrice}
                                    isFavorite={favorites.includes(tech._id || tech.id)}
                                    onToggleFavorite={() => toggleFavorite(tech._id || tech.id)}
                                    onViewDetails={() => handleViewDetails(tech)}
                                    onSchedule={() => handleScheduleAppointment(tech)}
                                    userLocation={userLocation}
                                    calculateDistance={calculateDistance}
                                    featured={true}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Technicians */}
            <section className="px-4 md:px-8 py-20 bg-gray-950">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-2 h-2 bg-white"></div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            All Mobile Repair Services ({filteredTechnicians.length})
                        </h2>
                    </div>

                    {filteredTechnicians.length === 0 && !loading ? (
                        <div className="text-center py-24">
                            <SearchX className="h-16 w-16 mx-auto mb-6 text-gray-600" />
                            <h3 className="text-2xl font-bold mb-4 text-white">No Technicians Found</h3>
                            <p className="text-gray-400 mb-8">
                                Try adjusting your search filters or reset them to see all available technicians
                            </p>
                            <button 
                                onClick={handleResetFilters}
                                className="px-8 py-4 bg-white text-black font-medium hover:bg-gray-200 transition-all"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredTechnicians.slice(0, visibleCount).map((tech) => (
                                    <TechnicianCard
                                        key={tech._id || tech.id}
                                        technician={tech}
                                        currency={currency}
                                        convertPrice={convertPrice}
                                        isFavorite={favorites.includes(tech._id || tech.id)}
                                        onToggleFavorite={() => toggleFavorite(tech._id || tech.id)}
                                        onViewDetails={() => handleViewDetails(tech)}
                                        onSchedule={() => handleScheduleAppointment(tech)}
                                        userLocation={userLocation}
                                        calculateDistance={calculateDistance}
                                    />
                                ))}
                            </div>

                            {visibleCount < filteredTechnicians.length && (
                                <div className="text-center mt-16">
                                    <button 
                                        onClick={handleLoadMore} 
                                        className="px-12 py-4 border border-white/30 text-white hover:bg-white hover:text-black transition-all"
                                    >
                                        Load More ({visibleCount} of {filteredTechnicians.length})
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Detail Modal */}
            <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-gray-950 border-white/10">
                    {selectedTechnician && (
                        <DetailModal
                            technician={selectedTechnician}
                            currency={currency}
                            convertPrice={convertPrice}
                            isFavorite={favorites.includes(selectedTechnician._id || selectedTechnician.id)}
                            onToggleFavorite={() => toggleFavorite(selectedTechnician._id || selectedTechnician.id)}
                            onClose={handleCloseModal}
                            onSchedule={() => {
                                handleCloseModal();
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
    currency,
    convertPrice,
    isFavorite,
    onToggleFavorite,
    onViewDetails,
    onSchedule,
    userLocation,
    calculateDistance,
    featured = false
}) => {
    const distance = userLocation && technician.location?.coordinates
        ? calculateDistance(
            userLocation.lat,
            userLocation.lng,
            technician.location.coordinates[1],
            technician.location.coordinates[0]
        )
        : null;

    const priceMin = technician.priceRange?.min || 50;
    const priceMax = technician.priceRange?.max || 250;
    const priceDisplay = `${convertPrice(priceMin)} - ${convertPrice(priceMax)}`;

    return (
        <div className={`group bg-black border border-white/10 hover:border-white/30 transition-all ${featured ? 'ring-1 ring-white/20' : ''}`}>
            <div className="relative overflow-hidden">
                <img
                    src={technician.profileImage || technician.image || 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop'}
                    alt={technician.name}
                    className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${featured ? 'h-64' : 'h-48'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <button
                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite();
                    }}
                >
                    <Star className={`h-5 w-5 ${isFavorite ? 'fill-white text-white' : 'text-white'}`} />
                </button>
                {featured && (
                    <div className="absolute top-4 left-4 px-4 py-2 bg-white text-black text-sm font-medium flex items-center gap-2">
                        <Star className="h-4 w-4 fill-black" />
                        Top Rated
                    </div>
                )}
            </div>
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-white">{technician.name}</h3>
                    <div className="flex items-center gap-1 text-white">
                        <Star className="h-5 w-5 fill-white" />
                        <span className="font-semibold">{technician.rating || '4.5'}</span>
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    {technician.location?.address && (
                        <p className="text-sm text-gray-400 flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {technician.location.address}
                            {distance && (
                                <span className="ml-2 text-white font-medium">
                                    ({distance.toFixed(1)} km)
                                </span>
                            )}
                        </p>
                    )}
                    {technician.experience && (
                        <p className="text-sm text-gray-400 flex items-center">
                            <Briefcase className="h-4 w-4 mr-2" />
                            {technician.experience} years experience
                        </p>
                    )}
                    <p className="text-sm text-gray-400">
                        {technician.reviewCount || 0} reviews
                    </p>
                </div>

                <div className="space-y-2 mb-4">
                    {(technician.specialization || []).slice(0, featured ? 3 : 2).map((service, i) => (
                        <div key={i} className="flex items-center text-sm text-gray-300">
                            <CheckCircle className="h-4 w-4 text-white mr-2 flex-shrink-0" />
                            <span>{service}</span>
                        </div>
                    ))}
                </div>

                <p className="text-2xl font-bold text-white mb-6">{priceDisplay}</p>

                <div className="flex gap-3">
                    <button 
                        onClick={onViewDetails} 
                        className="flex-1 py-3 border border-white/30 text-white hover:bg-white hover:text-black transition-all text-sm font-medium"
                    >
                        {featured ? 'Full Details' : 'Details'}
                    </button>
                    <button 
                        onClick={onSchedule} 
                        className="flex-1 py-3 bg-white text-black hover:bg-gray-200 transition-all text-sm font-medium"
                    >
                        {featured ? 'Book Now' : 'Schedule'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const DetailModal = ({
    technician,
    currency,
    convertPrice,
    isFavorite,
    onToggleFavorite,
    onClose,
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

    const priceMin = technician.priceRange?.min || 50;
    const priceMax = technician.priceRange?.max || 250;
    const priceDisplay = `${convertPrice(priceMin)} - ${convertPrice(priceMax)}`;

    return (
        <div className="p-8 text-white">
            <DialogHeader>
                <DialogTitle className="text-3xl font-bold mb-2 text-white">{technician.name}</DialogTitle>
                <div className="flex items-center gap-2 mb-8">
                    <Star className="h-6 w-6 fill-white text-white" />
                    <span className="text-2xl font-bold">{technician.rating || '4.5'}</span>
                    <span className="text-gray-400">({technician.reviewCount || 0} reviews)</span>
                </div>
            </DialogHeader>

            <div className="grid lg:grid-cols-2 gap-8">
                <div>
                    <img
                        src={technician.profileImage || technician.image || 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=400&fit=crop'}
                        alt={technician.name}
                        className="w-full h-80 object-cover mb-6"
                    />
                    <p className="text-lg leading-relaxed text-gray-300">{technician.description || 'Professional mobile repair technician offering quality services.'}</p>
                </div>

                <div className="space-y-6">
                    {/* Location & Experience */}
                    <div>
                        <h4 className="font-bold text-xl mb-4 flex items-center text-white">
                            <MapPin className="mr-2 h-5 w-5" />
                            Location & Experience
                        </h4>
                        <div className="space-y-3">
                            {technician.location?.address && (
                                <div className="flex items-start p-4 bg-white/5 border border-white/10">
                                    <MapPin className="h-5 w-5 mr-3 text-white flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-gray-300">{technician.location.address}</span>
                                        {distance && (
                                            <p className="text-sm text-white font-medium mt-1">
                                                {distance.toFixed(1)} km from your location
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {technician.experience && (
                                <div className="flex items-center p-4 bg-white/5 border border-white/10">
                                    <Briefcase className="h-5 w-5 mr-3 text-white" />
                                    <span className="text-gray-300">{technician.experience} years of experience</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pricing */}
                    <div>
                        <h4 className="font-bold text-xl mb-4 flex items-center text-white">
                            <DollarSign className="mr-2 h-5 w-5" />
                            Pricing
                        </h4>
                        <div className="p-6 bg-white/5 border border-white/10 text-center">
                            <p className="text-3xl font-bold text-white">{priceDisplay}</p>
                            <p className="text-sm text-gray-400 mt-2">Typical service range</p>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-bold text-xl mb-4 text-white">Specializations</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {(technician.specialization || []).map((service, i) => (
                                <div key={i} className="flex items-center p-3 bg-white/5 border border-white/10">
                                    <CheckCircle className="h-4 w-4 text-white mr-3 flex-shrink-0" />
                                    <span className="text-sm text-gray-300">{service}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-xl mb-4 flex items-center text-white">
                            <Phone className="mr-2 h-5 w-5" />
                            Contact Information
                        </h4>
                        <div className="space-y-3">
                            {technician.phone && (
                                <a
                                    href={`tel:${technician.phone}`}
                                    className="flex items-center p-4 bg-white/5 border border-white/10 hover:bg-white/10 transition"
                                >
                                    <Phone className="h-5 w-5 mr-4 text-white" />
                                    <span className="font-semibold text-gray-300">{technician.phone}</span>
                                </a>
                            )}
                            {technician.email && (
                                <a
                                    href={`mailto:${technician.email}`}
                                    className="flex items-center p-4 bg-white/5 border border-white/10 hover:bg-white/10 transition"
                                >
                                    <Mail className="h-5 w-5 mr-4 text-white" />
                                    <span className="font-semibold text-gray-300">{technician.email}</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mt-12 pt-8 border-t border-white/10">
                <button
                    onClick={onToggleFavorite}
                    className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-all ${
                        isFavorite 
                            ? 'bg-white text-black' 
                            : 'border border-white/30 text-white hover:bg-white hover:text-black'
                    }`}
                >
                    <Star className={`h-5 w-5 ${isFavorite ? 'fill-black' : ''}`} />
                    {isFavorite ? 'Saved' : 'Save to Favorites'}
                </button>
                <button 
                    onClick={onSchedule} 
                    className="flex-1 py-4 bg-white text-black font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                >
                    <CheckCircle className="h-5 w-5" />
                    Schedule Appointment
                </button>
            </div>
        </div>
    );
};

export default MobileRepair;
