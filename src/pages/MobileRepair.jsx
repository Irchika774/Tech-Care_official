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
import { Search, Star, MapPin, Briefcase, CheckCircle, DollarSign, Phone, Mail, Smartphone, Wrench, SearchX, Navigation, Filter, TrendingUp } from 'lucide-react';
import { techniciansAPI } from '../lib/api';
import { useToast } from '../hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Currency symbols and rates (relative to USD)
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
    const GOOGLE_MAPS_API_KEY = "AIzaSyALxXDQVaYCn6poLhxXqso5eGxeqB24dZU";

    // State management
    const [loading, setLoading] = useState(true);
    const [technicians, setTechnicians] = useState([]);
    const [filteredTechnicians, setFilteredTechnicians] = useState([]);

    // User location state
    const [userLocation, setUserLocation] = useState(null);
    const [userCountry, setUserCountry] = useState('LK'); // Default to Sri Lanka
    const [currency, setCurrency] = useState('LKR');
    const [locationLoading, setLocationLoading] = useState(false);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [brand, setBrand] = useState('all');
    const [issue, setIssue] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [minimumRating, setMinimumRating] = useState('0');
    const [maxDistance, setMaxDistance] = useState('all');

    // Display states
    const [visibleCount, setVisibleCount] = useState(6);
    const [favorites, setFavorites] = useState([]);
    const [selectedTechnician, setSelectedTechnician] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [sortBy, setSortBy] = useState('rating');

    // Get user's location and determine currency
    useEffect(() => {
        getUserLocation();
        loadFavorites();
    }, []);

    const getUserLocation = async () => {
        setLocationLoading(true);
        try {
            // Get geolocation
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        const location = { lat: latitude, lng: longitude };
                        setUserLocation(location);

                        // Reverse geocode to get country
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

                                    // Find and set appropriate currency
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

                        // Fetch nearby technicians
                        fetchNearbyTechnicians(longitude, latitude);
                    },
                    (error) => {
                        console.error('Geolocation error:', error);
                        toast({
                            title: "Location Access Denied",
                            description: "Please enable location services to see nearby technicians.",
                            variant: "destructive",
                        });
                        // Load all technicians if location is denied
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
            const response = await techniciansAPI.getNearby(lng, lat, 50000); // 50km radius
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

    // Convert price from USD to current currency
    const convertPrice = (usdPrice) => {
        const rate = CURRENCY_INFO[currency]?.rate || 1;
        const converted = Math.round(usdPrice * rate);
        const symbol = CURRENCY_INFO[currency]?.symbol || '$';
        return `${symbol}${converted.toLocaleString()}`;
    };

    // Apply filters whenever filter states change
    useEffect(() => {
        applyFilters();
    }, [searchTerm, brand, issue, priceRange, minimumRating, maxDistance, sortBy, technicians]);

    const applyFilters = () => {
        let filtered = [...technicians];

        // Search filter
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(tech =>
                tech.name?.toLowerCase().includes(search) ||
                tech.specialization?.some(spec => spec.toLowerCase().includes(search)) ||
                tech.location?.address?.toLowerCase().includes(search) ||
                tech.description?.toLowerCase().includes(search)
            );
        }

        // Brand filter
        if (brand !== 'all') {
            filtered = filtered.filter(tech =>
                tech.brands?.includes(brand) || tech.brands?.includes('all')
            );
        }

        // Issue filter
        if (issue !== 'all') {
            filtered = filtered.filter(tech =>
                tech.specialization?.includes(issue)
            );
        }

        // Price range filter (assuming prices in USD)
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

        // Rating filter
        const minRating = parseFloat(minimumRating);
        if (minRating > 0) {
            filtered = filtered.filter(tech => (tech.rating || 0) >= minRating);
        }

        // Distance filter (if location is available)
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

        // Sort
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

    // Calculate distance between two coordinates (Haversine formula)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
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

    // Get top 3 technicians by rating
    const featuredTechnicians = [...filteredTechnicians]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3);

    return (
        <div className="min-h-screen py-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <section className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <Smartphone className="h-12 w-12 text-primary" />
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Mobile Repair Services
                        </h1>
                    </div>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
                        Find trusted technicians for your smartphone and tablet repairs.
                        {userLocation && <span className="text-primary font-semibold"> Showing technicians near you.</span>}
                    </p>

                    {/* Location and Currency Info */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                        {locationLoading ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Detecting location...</span>
                            </div>
                        ) : userLocation ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full text-green-700 dark:text-green-400">
                                <Navigation className="h-4 w-4" />
                                <span className="text-sm font-medium">Location Enabled</span>
                            </div>
                        ) : null}

                        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Currency: {CURRENCY_INFO[currency]?.name}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="px-8"
                            onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            <Smartphone className="mr-2 h-5 w-5" />
                            Find Technicians
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="px-8"
                            onClick={() => navigate('/register', { state: { role: 'technician' } })}
                        >
                            <Wrench className="mr-2 h-5 w-5" />
                            Register as Technician
                        </Button>
                    </div>
                </section>

                {/* Filters Section */}
                <section className="bg-muted/50 rounded-2xl p-8 mb-16">
                    <div className="flex flex-col md:flex-row gap-4 items-end justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Filter className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold">Refine Your Search</h2>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={handleResetFilters}
                            className="text-primary hover:text-primary/80"
                        >
                            Reset All Filters
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative lg:col-span-3">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="pl-12"
                                placeholder="Search technicians, services, or locations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Brand */}
                        <Select value={brand} onValueChange={setBrand}>
                            <SelectTrigger>
                                <SelectValue placeholder="Device Brand" />
                            </SelectTrigger>
                            <SelectContent>
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
                            <SelectTrigger>
                                <SelectValue placeholder="Issue Type" />
                            </SelectTrigger>
                            <SelectContent>
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
                            <SelectTrigger>
                                <SelectValue placeholder="Price Range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Prices</SelectItem>
                                <SelectItem value="0-50">{convertPrice(0)} - {convertPrice(50)}</SelectItem>
                                <SelectItem value="50-100">{convertPrice(50)} - {convertPrice(100)}</SelectItem>
                                <SelectItem value="100-200">{convertPrice(100)} - {convertPrice(200)}</SelectItem>
                                <SelectItem value="200+">{convertPrice(200)}+</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Rating */}
                        <Select value={minimumRating} onValueChange={setMinimumRating}>
                            <SelectTrigger>
                                <SelectValue placeholder="Minimum Rating" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">All Ratings</SelectItem>
                                <SelectItem value="3">3+ Stars</SelectItem>
                                <SelectItem value="4">4+ Stars</SelectItem>
                                <SelectItem value="4.5">4.5+ Stars</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Distance */}
                        {userLocation && (
                            <Select value={maxDistance} onValueChange={setMaxDistance}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Distance" />
                                </SelectTrigger>
                                <SelectContent>
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
                            <SelectTrigger>
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="rating">Highest Rating</SelectItem>
                                <SelectItem value="reviews">Most Reviews</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                                {userLocation && <SelectItem value="distance">Nearest First</SelectItem>}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Results Counter */}
                    <div className="mt-6 p-4 bg-primary/10 rounded-xl flex items-center justify-between">
                        <p className="text-lg font-semibold flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            {filteredTechnicians.length} technician{filteredTechnicians.length !== 1 ? 's' : ''} found
                        </p>
                        {loading && (
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        )}
                    </div>
                </section>

                {/* Loading State */}
                {loading && technicians.length === 0 && (
                    <div className="text-center py-20">
                        <Loader2 className="h-16 w-16 mx-auto mb-6 text-primary animate-spin" />
                        <h3 className="text-2xl font-bold mb-4">Loading Technicians...</h3>
                        <p className="text-muted-foreground">Please wait while we fetch the best technicians for you</p>
                    </div>
                )}

                {/* Featured Technicians */}
                {!loading && featuredTechnicians.length > 0 && (
                    <section id="featured" className="mb-16">
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="text-3xl font-bold flex items-center gap-3">
                                <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                                Top Rated Technicians
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    </section>
                )}

                {/* All Technicians */}
                <section>
                    <h2 className="text-3xl font-bold mb-12">
                        All Mobile Repair Services ({filteredTechnicians.length})
                    </h2>

                    {filteredTechnicians.length === 0 && !loading ? (
                        <div className="text-center py-20">
                            <SearchX className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
                            <h3 className="text-2xl font-bold mb-4">No Technicians Found</h3>
                            <p className="text-muted-foreground mb-8">
                                Try adjusting your search filters or reset them to see all available technicians
                            </p>
                            <Button onClick={handleResetFilters}>Reset All Filters</Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        </div>
    );
};

// Technician Card Component
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
        <Card className={`overflow-hidden hover:shadow-2xl transition-all group ${featured ? 'ring-2 ring-primary' : ''}`}>
            <div className="relative">
                <img
                    src={technician.profileImage || technician.image || 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop'}
                    alt={technician.name}
                    className={`w-full object-cover group-hover:scale-105 transition-transform ${featured ? 'h-64' : 'h-48'}`}
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite();
                    }}
                >
                    <Star className={`h-5 w-5 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                </Button>
                {featured && (
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Star className="h-4 w-4 fill-white" />
                        Top Rated
                    </div>
                )}
            </div>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl">{technician.name}</h3>
                    <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{technician.rating || '4.5'}</span>
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    {technician.location?.address && (
                        <p className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {technician.location.address}
                            {distance && (
                                <span className="ml-2 text-primary font-semibold">
                                    ({distance.toFixed(1)} km away)
                                </span>
                            )}
                        </p>
                    )}
                    {technician.experience && (
                        <p className="text-sm text-muted-foreground flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {technician.experience} years experience
                        </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                        {technician.reviewCount || 0} reviews
                    </p>
                </div>

                <div className="space-y-1 mb-4">
                    {(technician.specialization || []).slice(0, featured ? 3 : 2).map((service, i) => (
                        <div key={i} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            <span>{service}</span>
                        </div>
                    ))}
                </div>

                <p className="text-2xl font-bold text-primary mb-6">{priceDisplay}</p>

                <div className="flex gap-3">
                    <Button variant="outline" onClick={onViewDetails} className="flex-1">
                        {featured ? 'Full Details' : 'Details'}
                    </Button>
                    <Button onClick={onSchedule} className="flex-1">
                        {featured ? 'Book Now' : 'Schedule'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

// Detail Modal Component
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
        <div className="p-8">
            <DialogHeader>
                <DialogTitle className="text-3xl font-bold mb-2">{technician.name}</DialogTitle>
                <div className="flex items-center gap-2 mb-8">
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold">{technician.rating || '4.5'}</span>
                    <span className="text-muted-foreground">({technician.reviewCount || 0} reviews)</span>
                </div>
            </DialogHeader>

            <div className="grid lg:grid-cols-2 gap-8">
                <div>
                    <img
                        src={technician.profileImage || technician.image || 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=400&fit=crop'}
                        alt={technician.name}
                        className="w-full h-80 object-cover rounded-xl mb-6"
                    />
                    <p className="text-lg leading-relaxed">{technician.description || 'Professional mobile repair technician offering quality services.'}</p>
                </div>

                <div className="space-y-6">
                    {/* Location & Experience */}
                    <div>
                        <h4 className="font-bold text-xl mb-4 flex items-center">
                            <MapPin className="mr-2 h-5 w-5" />
                            Location & Experience
                        </h4>
                        <div className="space-y-3">
                            {technician.location?.address && (
                                <div className="flex items-start p-3 bg-muted rounded-lg">
                                    <MapPin className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span>{technician.location.address}</span>
                                        {distance && (
                                            <p className="text-sm text-primary font-semibold mt-1">
                                                {distance.toFixed(1)} km from your location
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {technician.experience && (
                                <div className="flex items-center p-3 bg-muted rounded-lg">
                                    <Briefcase className="h-5 w-5 mr-3 text-primary" />
                                    <span>{technician.experience} years of experience</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pricing */}
                    <div>
                        <h4 className="font-bold text-xl mb-4 flex items-center">
                            <DollarSign className="mr-2 h-5 w-5" />
                            Pricing
                        </h4>
                        <div className="p-4 bg-primary/10 rounded-xl text-center">
                            <p className="text-3xl font-bold text-primary">{priceDisplay}</p>
                            <p className="text-sm text-muted-foreground mt-2">Typical service range</p>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-bold text-xl mb-4">Specializations</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {(technician.specialization || []).map((service, i) => (
                                <div key={i} className="flex items-center p-3 bg-muted rounded-lg">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                                    <span className="text-sm">{service}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-xl mb-4 flex items-center">
                            <Phone className="mr-2 h-5 w-5" />
                            Contact Information
                        </h4>
                        <div className="space-y-3">
                            {technician.phone && (
                                <a
                                    href={`tel:${technician.phone}`}
                                    className="flex items-center p-4 bg-muted rounded-xl hover:bg-accent transition"
                                >
                                    <Phone className="h-5 w-5 mr-4 text-primary" />
                                    <span className="font-semibold">{technician.phone}</span>
                                </a>
                            )}
                            {technician.email && (
                                <a
                                    href={`mailto:${technician.email}`}
                                    className="flex items-center p-4 bg-muted rounded-xl hover:bg-accent transition"
                                >
                                    <Mail className="h-5 w-5 mr-4 text-primary" />
                                    <span className="font-semibold">{technician.email}</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mt-12 pt-8 border-t">
                <Button
                    variant={isFavorite ? "default" : "outline"}
                    onClick={onToggleFavorite}
                    className="flex-1 gap-2"
                >
                    <Star className="h-5 w-5" />
                    {isFavorite ? 'Saved' : 'Save to Favorites'}
                </Button>
                <Button onClick={onSchedule} className="flex-1 gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Schedule Appointment
                </Button>
            </div>
        </div>
    );
};

export default MobileRepair;
