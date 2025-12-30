import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
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
  Zap
} from 'lucide-react';
import SEO from '../components/SEO';

const Technicians = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const shopsPerPage = 12;

  const districts = [
    'all', 'Colombo', 'Kandy', 'Galle', 'Matara', 'Gampaha', 'Negombo', 
    'Anuradhapura', 'Kurunegala', 'Ratnapura', 'Batticaloa', 'Trincomalee', 'Jaffna'
  ];

  const serviceTypes = [
    { value: 'all', label: 'All Services' },
    { value: 'mobile', label: 'Mobile Repair' },
    { value: 'computer', label: 'Computer/Laptop Repair' },
    { value: 'phone', label: 'Phone Services' }
  ];

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('repair_shops')
        .select('*')
        .order('rank', { ascending: true });

      if (error) throw error;
      setShops(data || []);
    } catch (error) {
      console.error('Error fetching repair shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          shop.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = selectedDistrict === 'all' || shop.district === selectedDistrict;
    const matchesType = selectedType === 'all' || 
      (selectedType === 'mobile' && shop.business_type?.toLowerCase().includes('mobile')) ||
      (selectedType === 'computer' && (shop.business_type?.toLowerCase().includes('computer') || shop.business_type?.toLowerCase().includes('laptop'))) ||
      (selectedType === 'phone' && shop.business_type?.toLowerCase().includes('phone'));
    
    return matchesSearch && matchesDistrict && matchesType;
  });

  const totalPages = Math.ceil(filteredShops.length / shopsPerPage);
  const paginatedShops = filteredShops.slice(
    (currentPage - 1) * shopsPerPage,
    currentPage * shopsPerPage
  );

  const getServiceIcon = (businessType) => {
    if (businessType?.toLowerCase().includes('computer') || businessType?.toLowerCase().includes('laptop')) {
      return <Laptop className="h-4 w-4 text-white" />;
    }
    return <Smartphone className="h-4 w-4 text-white" />;
  };

  const formatPhone = (phone) => {
    if (!phone) return null;
    return phone.replace(/\s/g, '');
  };

  const stats = [
    { value: '100+', label: 'Verified Shops', icon: Users },
    { value: '12', label: 'Districts', icon: MapPin },
    { value: '5.0', label: 'Avg Rating', icon: Star },
    { value: '24/7', label: 'Support', icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="Find Repair Technicians - TechCare"
        description="Find the best mobile and computer repair technicians in Sri Lanka. 100 top-rated repair shops across 12 districts."
        keywords="repair technicians, mobile repair, computer repair, Sri Lanka, phone repair"
      />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-white/10 text-white border-white/30 backdrop-blur-sm px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              100+ Verified Technicians
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Find Repair Technicians
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-400 mb-8 leading-relaxed">
              Browse top-rated mobile and computer repair shops across Sri Lanka. 
              All verified with 5-star ratings.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex p-3 rounded-xl bg-white/10 mb-3">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-zinc-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <Input
                    placeholder="Search by name or location..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-white"
                  />
                </div>
                <Select value={selectedDistrict} onValueChange={(v) => { setSelectedDistrict(v); setCurrentPage(1); }}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {districts.map(d => (
                      <SelectItem key={d} value={d} className="text-white hover:bg-zinc-700">{d === 'all' ? 'All Districts' : d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={(v) => { setSelectedType(v); setCurrentPage(1); }}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Service Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {serviceTypes.map(t => (
                      <SelectItem key={t.value} value={t.value} className="text-white hover:bg-zinc-700">{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4 mt-4 text-sm text-zinc-400">
                <Filter className="h-4 w-4" />
                <span>Showing {filteredShops.length} of {shops.length} repair shops</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Shops Grid */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-zinc-900 border-zinc-800 animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-zinc-800 rounded mb-4 w-3/4" />
                    <div className="h-4 bg-zinc-800 rounded mb-2 w-full" />
                    <div className="h-4 bg-zinc-800 rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedShops.map((shop) => (
                  <Card key={shop.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all duration-500 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-white text-black text-xs font-bold px-2 py-0.5">
                              #{shop.rank}
                            </Badge>
                            <div className="p-1 rounded bg-white/10">
                              {getServiceIcon(shop.business_type)}
                            </div>
                          </div>
                          <CardTitle className="text-white text-lg leading-tight line-clamp-2 group-hover:text-zinc-300 transition-colors">
                            {shop.business_name}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-1 bg-white/10 text-white px-2 py-1 rounded-lg">
                          <Star className="h-4 w-4 fill-white text-white" />
                          <span className="font-bold">{shop.rating}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-zinc-300 text-sm">
                        <MapPin className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                        <span className="line-clamp-2">{shop.address || shop.district}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-zinc-300 text-sm">
                        <Badge className="bg-white/10 text-white border-white/30 text-xs">
                          {shop.district}
                        </Badge>
                        <span className="text-zinc-600">|</span>
                        <span className="text-zinc-400">{shop.reviews_count} reviews</span>
                      </div>

                      {shop.hours && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-zinc-400" />
                          <span className={shop.hours.includes('Open') ? 'text-green-400' : 'text-zinc-400'}>
                            {shop.hours}
                          </span>
                        </div>
                      )}

                      <div className="text-xs text-zinc-500 line-clamp-1">
                        {shop.business_type}
                      </div>

                      <div className="flex gap-2 pt-2">
                        {shop.phone && (
                          <a
                            href={`tel:${formatPhone(shop.phone)}`}
                            className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors border border-zinc-700"
                          >
                            <Phone className="h-4 w-4" />
                            <span className="text-sm">Call</span>
                          </a>
                        )}
                        {shop.website && (
                          <a
                            href={shop.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors border border-zinc-700"
                          >
                            <Globe className="h-4 w-4" />
                            <span className="text-sm">Website</span>
                          </a>
                        )}
                        <Button
                          onClick={() => navigate('/schedule', { state: { shop } })}
                          className="flex-1 bg-white text-black hover:bg-gray-100 font-semibold"
                        >
                          Book
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800 disabled:opacity-50"
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
                          className={currentPage === pageNum 
                            ? "bg-white text-black hover:bg-gray-100" 
                            : "bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800"
                          }
                          size="sm"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800 disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Technicians;
