import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Star,
  MapPin,
  Phone,
  Globe,
  Clock,
  Search,
  Filter,
  Smartphone,
  Laptop,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  Award,
  Zap,
  RefreshCw,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import SEO from '../components/SEO';
import { fetchRepairShops, getDistrictStatistics } from '../lib/googleSheetsService';
import { supabase } from '../lib/supabase';

const Technicians = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [districts, setDistricts] = useState(['all']);
  const shopsPerPage = 12;

    const sriLankaDistricts = [
      'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha',
      'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala',
      'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
      'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
    ];
  
    const serviceTypes = [
      { value: 'all', label: 'All Services' },
      { value: 'mobile', label: 'Mobile Repair' },
      { value: 'pc', label: 'PC/Laptop Repair' },
      { value: 'tablet', label: 'Tablet Repair' },
      { value: 'diagnostics', label: 'Diagnostics' },
      { value: 'screen', label: 'Screen Replacement' },
      { value: 'battery', label: 'Battery Replacement' },
      { value: 'water', label: 'Water Damage' },
      { value: 'software', label: 'Software/OS' },
      { value: 'data', label: 'Data Recovery' }
    ];

    const loadShops = async () => {
      setLoading(true);
      try {
        // Fetch from both Google Sheets (mock/legacy) and Supabase
        const { data: supabaseTechs, error } = await supabase
          .from('technicians')
          .select('*')
          .eq('status', 'active');
        
        const sheetsData = await fetchRepairShops();
        
        // Merge data, prioritizing Supabase technicians
        const combinedData = [...(supabaseTechs || []), ...(sheetsData || [])];
        
        // De-duplicate by name or ID if necessary
        const uniqueShops = combinedData.filter((v, i, a) => a.findIndex(t => (t.id === v.id || t.name === v.name)) === i);
        
        setShops(uniqueShops);
        setDistricts(['all', ...sriLankaDistricts]);
      } catch (error) {
        console.error('Error fetching repair shops:', error);
      } finally {
        setLoading(false);
      }
    };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchRepairShops(true);
      setShops(data || []);
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Apply all filters including rating, verified, and sorting
  const filteredShops = shops
    .filter(shop => {
      const matchesSearch = shop.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.services?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDistrict = selectedDistrict === 'all' || shop.district?.toLowerCase() === selectedDistrict.toLowerCase();
      const matchesType = selectedType === 'all' ||
        shop.services?.some(s => {
          const sLower = s.toLowerCase();
          if (selectedType === 'mobile') return sLower.includes('mobile') || sLower.includes('phone');
          if (selectedType === 'computer') return sLower.includes('laptop') || sLower.includes('pc') || sLower.includes('computer');
          return sLower.includes(selectedType);
        });
      const matchesRating = selectedRating === 'all' || (shop.rating >= parseFloat(selectedRating));
      const matchesVerified = !verifiedOnly || shop.verified;

      return matchesSearch && matchesDistrict && matchesType && matchesRating && matchesVerified;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        case 'reviews': return (b.reviews || 0) - (a.reviews || 0);
        case 'jobs': return (b.completedJobs || 0) - (a.completedJobs || 0);
        case 'name': return (a.name || '').localeCompare(b.name || '');
        default: return 0;
      }
    });

  const totalPages = Math.ceil(filteredShops.length / shopsPerPage);
  const paginatedShops = filteredShops.slice(
    (currentPage - 1) * shopsPerPage,
    currentPage * shopsPerPage
  );

  const getServiceIcon = (services) => {
    const serviceStr = services?.join(' ').toLowerCase() || '';
    if (serviceStr.includes('laptop') || serviceStr.includes('computer') || serviceStr.includes('pc')) {
      return <Laptop className="h-4 w-4 text-white" />;
    }
    return <Smartphone className="h-4 w-4 text-white" />;
  };

  const formatPhone = (phone) => {
    if (!phone) return null;
    return phone.replace(/\s/g, '');
  };

  const stats = [
    { value: shops.length || '100+', label: 'Verified Shops', icon: Users },
    { value: districts.length - 1 || '12', label: 'Districts', icon: MapPin },
    {
      value: shops.length > 0
        ? (shops.reduce((sum, s) => sum + (s.rating || 0), 0) / shops.length).toFixed(1)
        : '4.8',
      label: 'Avg Rating',
      icon: Star
    },
    { value: '24/7', label: 'Support', icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="Find Repair Technicians - TechCare"
        description="Find the best mobile and computer repair technicians in Sri Lanka. Top-rated repair shops with real-time data."
        keywords="repair technicians, mobile repair, computer repair, Sri Lanka, phone repair, LKR"
      />

      {/* Hero Section - Compact */}
      <section className="relative py-12 bg-gradient-to-b from-zinc-900/50 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="outline" className="border-green-500/50 text-green-400">
                <Sparkles className="w-3 h-3 mr-1" />
                {shops.length}+ Verified Technicians
              </Badge>
              <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                <RefreshCw className="w-3 h-3 mr-1" />
                Real-Time Data
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Find Repair Technicians
            </h1>

            <p className="text-zinc-400 mb-6">
              Browse top-rated mobile and computer repair shops across Sri Lanka with verified ratings.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-4 border-y border-zinc-800 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filter Section - Enhanced */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <Card className="border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-900/50">
            <CardContent className="p-5">
              {/* Main Search Row */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <Input
                    placeholder="Search by shop name, location, or service..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="pl-12 h-12 text-base bg-zinc-800/50 border-zinc-700 focus:border-green-500"
                  />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-2">
                  {/* District Filter */}
                  <Select value={selectedDistrict} onValueChange={(v) => { setSelectedDistrict(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-12 w-[160px] bg-zinc-800/50 border-zinc-700">
                      <MapPin className="h-4 w-4 mr-2 text-green-400" />
                      <SelectValue placeholder="District" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map(d => (
                        <SelectItem key={d} value={d}>
                          {d === 'all' ? '📍 All Districts' : d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Service Type Filter */}
                  <Select value={selectedType} onValueChange={(v) => { setSelectedType(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-12 w-[160px] bg-zinc-800/50 border-zinc-700">
                      <Zap className="h-4 w-4 mr-2 text-blue-400" />
                      <SelectValue placeholder="Service" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Rating Filter */}
                  <Select value={selectedRating} onValueChange={(v) => { setSelectedRating(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-12 w-[140px] bg-zinc-800/50 border-zinc-700">
                      <Star className="h-4 w-4 mr-2 text-yellow-400" />
                      <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">⭐ All Ratings</SelectItem>
                      <SelectItem value="4.5">⭐ 4.5+ Stars</SelectItem>
                      <SelectItem value="4">⭐ 4+ Stars</SelectItem>
                      <SelectItem value="3">⭐ 3+ Stars</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Refresh Button */}
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="h-12 px-4 bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>

              {/* Quick Filter Chips & Sort */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-zinc-800">
                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setVerifiedOnly(!verifiedOnly)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${verifiedOnly
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
                      }`}
                  >
                    <CheckCircle className="h-3 w-3" />
                    Verified Only
                  </button>
                  <button
                    onClick={() => { setSelectedType('mobile'); setCurrentPage(1); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedType === 'mobile'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
                      }`}
                  >
                    <Smartphone className="h-3 w-3" />
                    Mobile
                  </button>
                  <button
                    onClick={() => { setSelectedType('computer'); setCurrentPage(1); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedType === 'computer'
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
                      }`}
                  >
                    <Laptop className="h-3 w-3" />
                    Computer
                  </button>
                  {(searchTerm || selectedDistrict !== 'all' || selectedType !== 'all' || selectedRating !== 'all' || verifiedOnly) && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedDistrict('all');
                        setSelectedType('all');
                        setSelectedRating('all');
                        setVerifiedOnly(false);
                        setCurrentPage(1);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 transition-all"
                    >
                      ✕ Clear All
                    </button>
                  )}
                </div>

                {/* Sort & Results Count */}
                <div className="flex items-center gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-8 w-[140px] text-xs bg-transparent border-zinc-700">
                      <span className="text-zinc-400">Sort by:</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="reviews">Most Reviews</SelectItem>
                      <SelectItem value="jobs">Most Jobs</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2 text-sm">
                    <Filter className="h-4 w-4 text-zinc-500" />
                    <span className="text-zinc-400">
                      <span className="text-white font-medium">{filteredShops.length}</span> of {shops.length} shops
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Shops Grid */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="border-zinc-800 animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-5 bg-zinc-800 rounded mb-3 w-3/4" />
                    <div className="h-4 bg-zinc-800 rounded mb-2 w-full" />
                    <div className="h-4 bg-zinc-800 rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredShops.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-zinc-500 mb-4">No repair shops found matching your criteria</div>
              <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedDistrict('all'); setSelectedType('all'); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedShops.map((shop) => (
                  <Card key={shop.id} className="border-zinc-800 hover:border-zinc-600 transition-all group flex flex-col h-full bg-zinc-900/40">
                    <CardContent className="p-5 flex-1 flex flex-col">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-2 mb-2">
                            {shop.verified && (
                              <Badge className="bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/20 text-[10px] px-1.5 py-0.5 h-5">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified Shop
                              </Badge>
                            )}
                            {shop.rating >= 4.5 && (
                              <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 text-[10px] px-1.5 py-0.5 h-5">
                                Top Rated
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-bold text-lg leading-tight group-hover:text-green-400 transition-colors mb-1">
                            {shop.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-zinc-500" />
                            <span className="truncate">{shop.district}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-400 px-2.5 py-1 rounded-md border border-yellow-500/20">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-bold text-sm">{shop.rating}</span>
                          </div>
                          <span className="text-[10px] text-zinc-500">{shop.reviews} reviews</span>
                        </div>
                      </div>

                      {/* Description (Mock for now if missing) */}
                      <div className="mb-4 flex-1">
                        <p className="text-sm text-zinc-400 line-clamp-2">
                          {shop.description || `Professional ${shop.services?.[0] || 'repair'} services in ${shop.district}. Expert technicians for all your device needs.`}
                        </p>
                      </div>

                      {/* Services Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {shop.services?.slice(0, 4).map((service, i) => (
                          <span key={i} className="text-[10px] px-2 py-1 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-300">
                            {service}
                          </span>
                        ))}
                        {shop.services?.length > 4 && (
                          <span className="text-[10px] px-2 py-1 bg-zinc-800/50 text-zinc-500 rounded-md">
                            +{shop.services.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-zinc-400 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                        {shop.hours && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-zinc-500" />
                            <span className="truncate">{shop.hours}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5 text-zinc-500" />
                          <span>{shop.completedJobs || 0} jobs done</span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2">
                          <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                          <span className="truncate">{shop.address}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        {shop.phone && (
                          <a
                            href={`tel:${formatPhone(shop.phone)}`}
                            className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-lg text-xs font-medium transition-colors border border-zinc-700"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            Call
                          </a>
                        )}
                        <Button
                          onClick={() => navigate('/schedule', { state: { shop } })}
                          className={`flex items-center justify-center gap-2 text-xs font-medium h-auto py-2.5 ${!shop.phone ? 'col-span-2' : ''} bg-white text-black hover:bg-gray-200`}
                        >
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          onClick={() => setCurrentPage(pageNum)}
                          size="sm"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 border-t border-zinc-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl font-bold mb-2">Are you a repair technician?</h2>
          <p className="text-zinc-400 text-sm mb-4">Join our network and grow your business</p>
          <Button
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            Register as Technician
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Technicians;
