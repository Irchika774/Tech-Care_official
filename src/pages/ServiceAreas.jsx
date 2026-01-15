import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
    MapPin,
    Search,
    Navigation,
    Phone,
    Clock,
    Star,
    ChevronRight,
    Loader2,
    CheckCircle,
    Building,
    Users,
    RefreshCw,
    Sparkles
} from 'lucide-react';
import SEO from '../components/SEO';
import { fetchRepairShops, getDistrictStatistics } from '../lib/googleSheetsService';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            background: ${color};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

// Map controller to fly to selected district
const MapController = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom, { duration: 1 });
        }
    }, [center, zoom, map]);
    return null;
};

const ServiceAreas = () => {
    const navigate = useNavigate();
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [serviceCenters, setServiceCenters] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [mapCenter, setMapCenter] = useState([7.8731, 80.7718]); // Sri Lanka center
    const [mapZoom, setMapZoom] = useState(8);

    // Default district coordinates for Sri Lanka
    const districtCoords = {
        'colombo': [6.9271, 79.8612],
        'gampaha': [7.0917, 80.0156],
        'kalutara': [6.5854, 79.9607],
        'kandy': [7.2906, 80.6337],
        'galle': [6.0535, 80.2210],
        'matara': [5.9549, 80.5550],
        'jaffna': [9.6615, 80.0255],
        'kurunegala': [7.4863, 80.3647],
        'ratnapura': [6.6828, 80.4028],
        'anuradhapura': [8.3114, 80.4037],
        'badulla': [6.9934, 81.0550],
        'trincomalee': [8.5874, 81.2152],
        'negombo': [7.2094, 79.8358],
        'batticaloa': [7.7310, 81.6747],
        'nuwara eliya': [6.9497, 80.7891],
    };

    // Fetch real data from Google Sheets
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [shops, districtStats] = await Promise.all([
                    fetchRepairShops(),
                    getDistrictStatistics()
                ]);

                setServiceCenters(shops);

                const formattedDistricts = districtStats.map(d => {
                    const id = d.name.toLowerCase().replace(/\s+/g, '-');
                    const coords = districtCoords[d.name.toLowerCase()] || [7.8731, 80.7718];
                    const coverage = d.coverage || Math.min(100, d.shops * 10 + 50);

                    return {
                        id,
                        name: d.name,
                        coords,
                        technicians: d.technicians || d.shops * 2,
                        shops: d.shops,
                        coverage,
                        color: coverage >= 85 ? '#22c55e' : coverage >= 70 ? '#eab308' : '#f97316'
                    };
                });

                setDistricts(formattedDistricts.length > 0 ? formattedDistricts : getDefaultDistricts());
            } catch (error) {
                console.error('Error loading data:', error);
                setDistricts(getDefaultDistricts());
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const shops = await fetchRepairShops(true);
            setServiceCenters(shops);
        } catch (error) {
            console.error('Error refreshing:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const getDefaultDistricts = () => [
        { id: 'colombo', name: 'Colombo', coords: [6.9271, 79.8612], technicians: 45, shops: 23, coverage: 100, color: '#22c55e' },
        { id: 'gampaha', name: 'Gampaha', coords: [7.0917, 80.0156], technicians: 32, shops: 18, coverage: 95, color: '#22c55e' },
        { id: 'kalutara', name: 'Kalutara', coords: [6.5854, 79.9607], technicians: 18, shops: 9, coverage: 85, color: '#22c55e' },
        { id: 'kandy', name: 'Kandy', coords: [7.2906, 80.6337], technicians: 28, shops: 15, coverage: 90, color: '#22c55e' },
        { id: 'galle', name: 'Galle', coords: [6.0535, 80.2210], technicians: 22, shops: 12, coverage: 88, color: '#22c55e' },
        { id: 'matara', name: 'Matara', coords: [5.9549, 80.5550], technicians: 15, shops: 8, coverage: 80, color: '#eab308' },
        { id: 'jaffna', name: 'Jaffna', coords: [9.6615, 80.0255], technicians: 12, shops: 6, coverage: 75, color: '#eab308' },
        { id: 'kurunegala', name: 'Kurunegala', coords: [7.4863, 80.3647], technicians: 20, shops: 11, coverage: 82, color: '#22c55e' },
        { id: 'ratnapura', name: 'Ratnapura', coords: [6.6828, 80.4028], technicians: 10, shops: 5, coverage: 70, color: '#eab308' },
        { id: 'anuradhapura', name: 'Anuradhapura', coords: [8.3114, 80.4037], technicians: 14, shops: 7, coverage: 72, color: '#eab308' },
        { id: 'badulla', name: 'Badulla', coords: [6.9934, 81.0550], technicians: 8, shops: 4, coverage: 65, color: '#f97316' },
        { id: 'trincomalee', name: 'Trincomalee', coords: [8.5874, 81.2152], technicians: 6, shops: 3, coverage: 55, color: '#f97316' },
    ];

    const filteredDistricts = districts.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const loc = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserLocation(loc);
                    setMapCenter([loc.lat, loc.lng]);
                    setMapZoom(11);
                },
                (error) => console.error('Geolocation error:', error)
            );
        }
    };

    const getCoverageColor = (coverage) => {
        if (coverage >= 85) return 'text-green-400 bg-green-500/20 border-green-500/30';
        if (coverage >= 70) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
        return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    };

    const selectedCenters = selectedDistrict
        ? serviceCenters.filter(c =>
            c.district?.toLowerCase() === selectedDistrict.name?.toLowerCase() ||
            c.district?.toLowerCase() === selectedDistrict.id?.toLowerCase()
        )
        : [];

    const handleDistrictSelect = (district) => {
        setSelectedDistrict(district);
        setMapCenter(district.coords);
        setMapZoom(11);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <SEO
                title="Service Areas - TechCare"
                description="Find TechCare device repair services near you. We cover all districts in Sri Lanka."
                keywords="service areas, locations, Sri Lanka, Colombo, repair centers"
            />

            {/* Hero Section - Compact */}
            <section className="relative py-12 bg-gradient-to-b from-green-900/20 to-black">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Badge variant="outline" className="border-green-500/50 text-green-400">
                                <MapPin className="w-3 h-3 mr-1" />
                                Island-wide Coverage
                            </Badge>
                            <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Real-Time Data
                            </Badge>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-3">
                            Service Areas & Locations
                        </h1>
                        <p className="text-zinc-400 mb-6">
                            Find certified repair technicians and {serviceCenters.length}+ service centers across Sri Lanka
                        </p>

                        {/* Search & Actions */}
                        <div className="flex gap-2 max-w-lg mx-auto">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                <Input
                                    type="text"
                                    placeholder="Search districts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-10"
                                />
                            </div>
                            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing} className="h-10 w-10">
                                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={getUserLocation} className="h-10 w-10">
                                <Navigation className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="py-4 border-y border-zinc-800 bg-zinc-900/50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-green-400">{districts.length || 12}</div>
                            <div className="text-xs text-zinc-500">Districts</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-blue-400">
                                {districts.reduce((sum, d) => sum + (d.technicians || 0), 0) || '200+'}
                            </div>
                            <div className="text-xs text-zinc-500">Technicians</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-purple-400">{serviceCenters.length || '100+'}</div>
                            <div className="text-xs text-zinc-500">Centers</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-yellow-400">24/7</div>
                            <div className="text-xs text-zinc-500">Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map and Districts - Main Content */}
            <section className="py-6">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* District List */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Districts</h2>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {filteredDistricts.map((district) => (
                                        <button
                                            key={district.id}
                                            onClick={() => handleDistrictSelect(district)}
                                            className={`w-full p-3 rounded-lg border transition-all text-left ${selectedDistrict?.id === district.id
                                                ? 'bg-green-500/10 border-green-500'
                                                : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-2.5 h-2.5 rounded-full"
                                                        style={{ backgroundColor: district.color }}
                                                    />
                                                    <span className="font-medium text-sm">{district.name}</span>
                                                </div>
                                                <Badge variant="outline" className={`text-xs ${getCoverageColor(district.coverage)}`}>
                                                    {district.coverage}%
                                                </Badge>
                                            </div>
                                            <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    {district.technicians}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Building className="h-3 w-3" />
                                                    {district.shops}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Interactive Map */}
                        <div className="lg:col-span-2">
                            <Card className="overflow-hidden h-full border-zinc-800">
                                <CardHeader className="py-3 border-b border-zinc-800">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-green-400" />
                                        {selectedDistrict ? `${selectedDistrict.name} District` : 'Sri Lanka Coverage Map'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {/* Leaflet Map */}
                                    <div className="h-[400px] w-full">
                                        <MapContainer
                                            center={mapCenter}
                                            zoom={mapZoom}
                                            style={{ height: '100%', width: '100%' }}
                                            className="z-0"
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                            />
                                            <MapController center={mapCenter} zoom={mapZoom} />

                                            {/* District Markers */}
                                            {districts.map((district) => (
                                                <Marker
                                                    key={district.id}
                                                    position={district.coords}
                                                    icon={createCustomIcon(district.color)}
                                                    eventHandlers={{
                                                        click: () => handleDistrictSelect(district),
                                                    }}
                                                >
                                                    <Popup className="custom-popup">
                                                        <div className="text-black p-1">
                                                            <h3 className="font-bold">{district.name}</h3>
                                                            <p className="text-sm">{district.technicians} technicians</p>
                                                            <p className="text-sm">{district.shops} service centers</p>
                                                            <p className="text-sm font-medium text-green-600">{district.coverage}% coverage</p>
                                                        </div>
                                                    </Popup>
                                                </Marker>
                                            ))}

                                            {/* Coverage circles for selected district */}
                                            {selectedDistrict && (
                                                <Circle
                                                    center={selectedDistrict.coords}
                                                    radius={20000}
                                                    pathOptions={{
                                                        color: selectedDistrict.color,
                                                        fillColor: selectedDistrict.color,
                                                        fillOpacity: 0.15,
                                                        weight: 2
                                                    }}
                                                />
                                            )}

                                            {/* User location marker */}
                                            {userLocation && (
                                                <Marker
                                                    position={[userLocation.lat, userLocation.lng]}
                                                    icon={createCustomIcon('#3b82f6')}
                                                >
                                                    <Popup>Your Location</Popup>
                                                </Marker>
                                            )}
                                        </MapContainer>
                                    </div>

                                    {/* Legend */}
                                    <div className="p-3 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-xs">
                                            <div className="flex items-center gap-1">
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                                <span className="text-zinc-400">Full (85%+)</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                                                <span className="text-zinc-400">Partial (70-84%)</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                                                <span className="text-zinc-400">Limited (&lt;70%)</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selected District Details */}
                                    {selectedDistrict && (
                                        <div className="p-4 border-t border-zinc-800">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-lg font-bold">{selectedDistrict.name}</h3>
                                                    <p className="text-sm text-zinc-400">{selectedDistrict.coverage}% coverage</p>
                                                </div>
                                                <Badge className={getCoverageColor(selectedDistrict.coverage)}>
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Active
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <div className="p-3 rounded-lg bg-zinc-800/50 text-center">
                                                    <div className="text-xl font-bold text-green-400">{selectedDistrict.technicians}</div>
                                                    <div className="text-xs text-zinc-500">Technicians</div>
                                                </div>
                                                <div className="p-3 rounded-lg bg-zinc-800/50 text-center">
                                                    <div className="text-xl font-bold text-blue-400">{selectedCenters.length || selectedDistrict.shops}</div>
                                                    <div className="text-xs text-zinc-500">Centers</div>
                                                </div>
                                            </div>

                                            {/* Service Centers */}
                                            {selectedCenters.length > 0 && (
                                                <div className="space-y-2 mb-4">
                                                    <h4 className="text-sm font-medium text-zinc-300">Top Service Centers</h4>
                                                    {selectedCenters.slice(0, 5).map((center) => (
                                                        <div key={center.id} className="p-2 rounded bg-zinc-800/50 text-sm">
                                                            <div className="flex justify-between items-start">
                                                                <span className="font-medium">{center.name}</span>
                                                                <div className="flex items-center gap-1 text-yellow-400 text-xs">
                                                                    <Star className="h-3 w-3 fill-current" />
                                                                    {center.rating}
                                                                </div>
                                                            </div>
                                                            {center.phone ? (
                                                                <div className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                                                                    <Phone className="h-3 w-3" /> {center.phone}
                                                                </div>
                                                            ) : (
                                                                <div className="text-xs text-zinc-600 mt-1 italic">
                                                                    No phone available
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {selectedCenters.length > 5 && (
                                                        <p className="text-xs text-zinc-500 text-center">+ {selectedCenters.length - 5} more centers</p>
                                                    )}
                                                </div>
                                            )}

                                            <Button
                                                className="w-full bg-green-600 hover:bg-green-700 h-9 text-sm"
                                                onClick={() => navigate('/technicians', { state: { district: selectedDistrict.name } })}
                                            >
                                                Find Technicians in {selectedDistrict.name}
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 border-t border-zinc-800">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-3">Don't See Your Area?</h2>
                    <p className="text-zinc-400 mb-6 max-w-xl mx-auto text-sm">
                        We're rapidly expanding across Sri Lanka. Register your interest and we'll notify you when we launch in your district.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            className="bg-white text-black hover:bg-gray-200"
                            onClick={() => navigate('/support')}
                        >
                            Request Coverage
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/register')}
                        >
                            Become a Technician
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServiceAreas;
