import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const allTechniciansData = [
  {
    id: 1,
    name: "Mobile Wizards",
    rating: 4.9,
    reviews: 1200,
    services: ["Screen Repair", "Battery Replacement", "Water Damage"],
    price: "$50 - $250",
    priceMin: 50,
    priceMax: 250,
    location: "New York, NY",
    experience: "8 years",
    deviceType: "smartphone",
    brand: "apple",
    specialization: "Screen Repair",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpjnPGaHMNfySM0XdsWGFM8Ac4KNQNKiXUS3Y6B3gNfw3PTX9qpxQaSzsRnBaJdznzm0o9gDi_XN7i1hittn0ZBLKollEJYw2JPng1XBJ82gMs0KL8Rle5bHZlwSFnPrdglNHk5jgeBhx0cKwnyTKpYvPXXyX0Auy7nVCgKaZy8xC54es7beBmU6OvPQOkM0MefRI2PFhKld5d-Q-AA8J08pqF23RYVLyxrvWaCzD6B1RxfL3i9302086lobuhNvXmueMbSDoHo7sX",
    description: "Expert mobile device repair with 8 years of experience. Specializing in iPhone and Samsung repairs.",
    phone: "+1 (555) 111-2222",
    email: "contact@mobilewizards.com"
  },
  {
    id: 2,
    name: "Fone Fixers",
    rating: 4.8,
    reviews: 850,
    services: ["Charging Port Repair", "Water Damage", "Speaker Fix"],
    price: "$70 - $300",
    priceMin: 70,
    priceMax: 300,
    location: "Los Angeles, CA",
    experience: "6 years",
    deviceType: "smartphone",
    brand: "samsung",
    specialization: "Water Damage",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYOQbF9Rf31b64CLzucTed9New93PsgPBtgxJ84A5qIVGFE4OV4gR7slRLP3NAsLkIyiy7sKdk0sYR-BAaDUAK8UwIY0FdVaHKdXU2DeXWsMBX2klyWNUPjypUw1UjxHPcHWax28skPdRjyyo9IzzXnBwWKmYCzZyg6lSzrRO2ZGqPccfaCK7irz7BAfIiUT8irri9YDNKJVtSu6H4-xMw5f-i9QdPDbG1cgyERN-NIR565NTz8lozduJ4aJghNxrdVSmRJCw4PNqR",
    description: "Fast and reliable phone repairs. We fix all major brands and models.",
    phone: "+1 (555) 222-3333",
    email: "info@fonefixers.com"
  },
  {
    id: 3,
    name: "Pocket Techs",
    rating: 4.7,
    reviews: 700,
    services: ["Camera Repair", "Speaker Fix", "Button Replacement"],
    price: "$60 - $200",
    priceMin: 60,
    priceMax: 200,
    location: "Chicago, IL",
    experience: "5 years",
    deviceType: "smartphone",
    brand: "google",
    specialization: "Camera Repair",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDovMWLM9pCPQ8Ifx2gK6QbFZyjK_8Xszb1KqMH4HoOBNwvibbfjCTHdAJUECnONA5em1tE-3E8gID1-C3bqmvyamYQcczH4g9KvCUQgZHEMY8Fybh67oeuNWDwALrDXujzJyfnliU5GnwThYDmw6U8ZDmhIudwsyYdKnKCb9CKgm93QdTn2l2VplZLQrtlQIGJFsOco4OvJYA_7W4VR-oMNDvJS-O59cvPVpJp0-Rv0dzDuooML-EEQM9WhEj5icklAfaB88WKQDeZ",
    description: "Specialized in camera and audio repairs for all smartphone models.",
    phone: "+1 (555) 333-4444",
    email: "help@pockettechs.com"
  },
  {
    id: 4,
    name: "Gadget Gurus",
    rating: 4.9,
    reviews: 950,
    services: ["Screen Replacement", "Battery Fix", "Software Issues"],
    price: "$40 - $250",
    priceMin: 40,
    priceMax: 250,
    location: "Houston, TX",
    experience: "7 years",
    deviceType: "smartphone",
    brand: "any",
    specialization: "Screen Repair",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVBlUcL_i6v0gf7HT1S32tiSlfqP9XjXZsfRL1Me6FDZyH9ZRGG000GTl6VhcjC1Ye4041mB9hUvKdDAUlNgYulBA4LyCcr4xvNKoiiDVGjv25QtQj2sI9l-d1d6Goy2O-YZABGTHJFv_MmpYtCRCAg3mGBBxnUqVHVWRqV1peD66tPoLSk1kVkxy9I8QPHDaI4vo_Yqw5WC4SByDqjbMCAZToncoUhTF783_sf_XMXcEkzz2xhfpA2X0IXQArOj9O47WIpJdtSmSj",
    description: "Affordable phone repairs with quick turnaround. We work on all brands.",
    phone: "+1 (555) 444-5555",
    email: "support@gadgetgurus.com"
  },
  {
    id: 5,
    name: "Smart Device Solutions",
    rating: 4.8,
    reviews: 1100,
    services: ["All Device Repair", "Troubleshooting", "Data Recovery"],
    price: "$50 - $450",
    priceMin: 50,
    priceMax: 450,
    location: "Phoenix, AZ",
    experience: "10 years",
    deviceType: "tablet",
    brand: "any",
    specialization: "Battery Replacement",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJVH4GGJ9HAziqsTCiIS5yDwLQioof-9lMTxK8C7AXPg6oNXt8W7sAjnwVXl2cSHwS9NrxVISjP0sSQUA6wXFtnXhr5ECzWXhefODI5d0rJxzW2z8wcGw89f_xFayyRLhq4cDxcbaXadfsKl7N2lB128Ru-xWK92pcFNcWyU4QPbu1DxGCnh7mXdKSlkpl1m6ORlBMh7e8-5HAdSJpOyLXwRfE8PhaEvp3JJrDjUOPkGTETIB_69CixuBfadL3r-0p8pHEjEOg2ZM8",
    description: "Complete mobile and tablet repair service. 10 years of excellence.",
    phone: "+1 (555) 555-6666",
    email: "service@smartdevicesolutions.com"
  },
  {
    id: 6,
    name: "Circuit Saviors",
    rating: 4.9,
    reviews: 600,
    services: ["Motherboard Repair", "Soldering", "Micro Soldering"],
    price: "$80 - $350",
    priceMin: 80,
    priceMax: 350,
    location: "Philadelphia, PA",
    experience: "9 years",
    deviceType: "smartphone",
    brand: "any",
    specialization: "Water Damage",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuALlmvVTUunr20eDi-YYDYe1yN3H6X4tx-WEPxHc08nuF3-fvg-FvBWh4Mn4JAinBIWEWAYZ-bucMOAyTkIRWt8NcothFt4yCImqYjln4BQExKiS_0vSSLXDvdXAj3vMfAe2Vo31FcjWS7Th7WBXNq4uX-X8u_ZsNQ2BNlSVBU7AIOk4Vd_ZLU2n3RngClXHoqBbkOPwQKBFb3ulAlCBmBsYfECPJP3vepSimljJyyS_REFzNPzYTlV_O54nNBznN98nJd3aT2E3E8C",
    description: "Advanced board-level repairs and micro soldering specialists.",
    phone: "+1 (555) 666-7777",
    email: "repairs@circuitsaviors.com"
  }
];

const Home = () => {
  const navigate = useNavigate();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [brand, setBrand] = useState('any');
  const [issue, setIssue] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [deviceType, setDeviceType] = useState('all');
  const [minimumRating, setMinimumRating] = useState('0');
  
  // Display states
  const [filteredTechnicians, setFilteredTechnicians] = useState(allTechniciansData);
  const [visibleCount, setVisibleCount] = useState(6);
  const [favorites, setFavorites] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('mobile-repair-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...allTechniciansData];

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
    setVisibleCount(6); // Reset visible count when filters change
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
    localStorage.setItem('mobile-repair-favorites', JSON.stringify(newFavorites));
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

  // Get featured technicians (top 3 by rating)
  const featuredTechnicians = [...allTechniciansData]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        
        <main>
          {/* Hero Section */}
          <section className="py-16 sm:py-24">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Your Trusted Partner for Mobile Device Repairs
                </h2>
                <p className="mt-4 text-lg text-text-secondary-light dark:text-text-secondary-dark">
                  Find trusted and skilled technicians for smartphones and tablets. Fast, reliable, and convenient service, right at your fingertips.
                </p>
                <button 
                  onClick={() => {
                    document.getElementById('featured-technicians')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-8 bg-primary text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-opacity-90 transition"
                >
                  Find Technicians Now
                </button>
              </div>
              <div>
                <img 
                  alt="Technician repairing a mobile phone" 
                  className="rounded-lg shadow-lg" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_lzbEzJb4eEjVp0CIkCF6L2MNjhlw1xLi7dmxYmuqoLwryRiNBI1VTAwgtvBqiY7LXEiNQZB2hXrT4aeQNiqUhsYxCkwRNztvR21MVk2g35oQSp7KS8aId4T60lKrASdFVY3xvLRljwUZow5uCZ3rBp4Ug5pkwiLRL1Wm8PXR1hqcd9jT08Iq-m20c787tlth48nRiT1RkQ_tfcrAihjmPFyFDQDRI8UVGeLZXOlB3S3Q1QRh60nsPYF7UvdwI3IQ1euw5jlCjtFR"
                />
              </div>
            </div>
          </section>

          {/* Filter Section */}
          <section className="py-12 bg-card-light dark:bg-card-dark rounded-lg shadow-md">
            <div className="px-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Refine Your Search</h3>
                <button
                  onClick={handleResetFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Reset Filters
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="relative lg:col-span-2">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">
                    search
                  </span>
                  <input 
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary" 
                    placeholder="Search technicians or services..." 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  className="w-full py-3 px-4 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                  <option value="any">Any Brand</option>
                  <option value="apple">Apple</option>
                  <option value="samsung">Samsung</option>
                  <option value="google">Google</option>
                  <option value="oneplus">OnePlus</option>
                  <option value="xiaomi">Xiaomi</option>
                </select>
                <select 
                  className="w-full py-3 px-4 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                >
                  <option value="all">All Issues</option>
                  <option value="Screen Repair">Screen Repair</option>
                  <option value="Battery Replacement">Battery Replacement</option>
                  <option value="Camera Repair">Camera Repair</option>
                  <option value="Water Damage">Water Damage</option>
                </select>
                <select 
                  className="w-full py-3 px-4 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="all">All Prices</option>
                  <option value="0-100">$0 - $100</option>
                  <option value="100-200">$100 - $200</option>
                  <option value="200+">$200+</option>
                </select>
                <select 
                  className="w-full py-3 px-4 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value)}
                >
                  <option value="all">All Devices</option>
                  <option value="smartphone">Smartphones</option>
                  <option value="tablet">Tablets</option>
                </select>
              </div>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  {filteredTechnicians.length} technician{filteredTechnicians.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
          </section>

          {/* Featured Technicians */}
          <section id="featured-technicians" className="py-16">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold">Featured Mobile Technicians Near You</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="rating">Highest Rating</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTechnicians.map((tech) => (
                <div key={tech.id} className="bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 relative group">
                  <div className="relative overflow-hidden">
                    <img 
                      alt={`${tech.name} technician working`} 
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" 
                      src={tech.image}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(tech.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                      <span className={`material-icons ${favorites.includes(tech.id) ? 'text-red-500' : 'text-gray-400'}`}>
                        {favorites.includes(tech.id) ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold">{tech.name}</h4>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark flex items-center">
                      <span className="material-icons text-yellow-500 text-base mr-1">star</span>
                      {tech.rating} ({tech.reviews} reviews)
                    </p>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1 flex items-center">
                      <span className="material-icons text-sm mr-1">location_on</span>
                      {tech.location}
                    </p>
                    <div className="mt-3 text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-1">
                      {tech.services.slice(0, 2).map((service, idx) => (
                        <p key={idx} className="flex items-center">
                          <span className="material-icons text-green-500 text-base mr-2">check_circle</span>
                          {service}
                        </p>
                      ))}
                    </div>
                    <p className="mt-3 text-lg font-bold text-primary">{tech.price}</p>
                    <div className="mt-4 flex justify-between items-center gap-2">
                      <button 
                        onClick={() => handleViewDetails(tech)}
                        className="text-primary font-semibold hover:underline"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handleScheduleAppointment(tech)}
                        className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition"
                      >
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* All Technicians */}
          <section className="py-16">
            <h3 className="text-3xl font-bold mb-8">
              All Mobile Repair Services
              <span className="text-lg font-normal text-text-secondary-light dark:text-text-secondary-dark ml-2">
                ({filteredTechnicians.length} results)
              </span>
            </h3>
            
            {filteredTechnicians.length === 0 ? (
              <div className="text-center py-12 bg-card-light dark:bg-card-dark rounded-lg">
                <span className="material-icons text-6xl text-text-secondary-light dark:text-text-secondary-dark mb-4">
                  search_off
                </span>
                <h4 className="text-xl font-semibold mb-2">No technicians found</h4>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-opacity-90 transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredTechnicians.slice(0, visibleCount).map((tech) => (
                    <div key={tech.id} className="bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-semibold flex-1">{tech.name}</h4>
                          <button
                            onClick={() => toggleFavorite(tech.id)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <span className={`material-icons text-xl ${favorites.includes(tech.id) ? 'text-red-500' : 'text-gray-400'}`}>
                              {favorites.includes(tech.id) ? 'favorite' : 'favorite_border'}
                            </span>
                          </button>
                        </div>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark flex items-center">
                          <span className="material-icons text-yellow-500 text-base mr-1">star</span>
                          {tech.rating} ({tech.reviews} reviews)
                        </p>
                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1 flex items-center">
                          <span className="material-icons text-sm mr-1">location_on</span>
                          {tech.location}
                        </p>
                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1 flex items-center">
                          <span className="material-icons text-sm mr-1">work</span>
                          {tech.experience} experience
                        </p>
                        <div className="mt-3 text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-1">
                          {tech.services.slice(0, 3).map((service, idx) => (
                            <p key={idx} className="flex items-center">
                              <span className="material-icons text-green-500 text-base mr-2">check_circle</span>
                              {service}
                            </p>
                          ))}
                        </div>
                        <p className="mt-3 text-lg font-bold text-primary">{tech.price}</p>
                        <div className="mt-4 flex justify-between items-center gap-2">
                          <button 
                            onClick={() => handleViewDetails(tech)}
                            className="text-primary font-semibold hover:underline"
                          >
                            View Details
                          </button>
                          <button 
                            onClick={() => handleScheduleAppointment(tech)}
                            className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition"
                          >
                            Schedule
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {visibleCount < filteredTechnicians.length && (
                  <div className="text-center mt-12">
                    <button 
                      onClick={handleLoadMore}
                      className="bg-background-light dark:bg-card-dark border border-border-light dark:border-border-dark font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition inline-flex items-center space-x-2"
                    >
                      <span>Load More Services</span>
                      <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        ({visibleCount} of {filteredTechnicians.length})
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </main>
        
        <Footer />
      </div>

      {/* Technician Detail Modal */}
      {showDetailModal && selectedTechnician && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-card-light dark:bg-card-dark rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark p-6 flex justify-between items-start z-10">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">{selectedTechnician.name}</h2>
                <p className="text-text-secondary-light dark:text-text-secondary-dark flex items-center mt-2">
                  <span className="material-icons text-yellow-500 mr-1">star</span>
                  <span className="font-semibold">{selectedTechnician.rating}</span>
                  <span className="mx-2">•</span>
                  <span>{selectedTechnician.reviews} reviews</span>
                </p>
              </div>
              <button 
                onClick={handleCloseModal}
                className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded-lg transition"
              >
                <span className="material-icons text-text-secondary-light dark:text-text-secondary-dark">close</span>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 rounded-lg overflow-hidden">
                <img 
                  src={selectedTechnician.image} 
                  alt={selectedTechnician.name}
                  className="w-full h-64 object-cover"
                />
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <span className="material-icons text-primary mr-2">info</span>
                  About
                </h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  {selectedTechnician.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-background-light dark:bg-background-dark rounded-lg">
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">Location</p>
                  <p className="font-semibold flex items-center">
                    <span className="material-icons text-sm mr-2">location_on</span>
                    {selectedTechnician.location}
                  </p>
                </div>
                <div className="p-4 bg-background-light dark:bg-background-dark rounded-lg">
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">Experience</p>
                  <p className="font-semibold flex items-center">
                    <span className="material-icons text-sm mr-2">work</span>
                    {selectedTechnician.experience}
                  </p>
                </div>
                <div className="p-4 bg-background-light dark:bg-background-dark rounded-lg">
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">Price Range</p>
                  <p className="font-semibold text-primary flex items-center">
                    <span className="material-icons text-sm mr-2">attach_money</span>
                    {selectedTechnician.price}
                  </p>
                </div>
                <div className="p-4 bg-background-light dark:bg-background-dark rounded-lg">
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">Specialization</p>
                  <p className="font-semibold flex items-center">
                    <span className="material-icons text-sm mr-2">build</span>
                    {selectedTechnician.specialization}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <span className="material-icons text-primary mr-2">build_circle</span>
                  Services Offered
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedTechnician.services.map((service, idx) => (
                    <div key={idx} className="flex items-center p-3 bg-background-light dark:bg-background-dark rounded-lg">
                      <span className="material-icons text-green-500 mr-3">check_circle</span>
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <span className="material-icons text-primary mr-2">contact_phone</span>
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <a 
                    href={`tel:${selectedTechnician.phone}`}
                    className="flex items-center p-3 bg-background-light dark:bg-background-dark rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <span className="material-icons text-primary mr-3">phone</span>
                    <span>{selectedTechnician.phone}</span>
                  </a>
                  <a 
                    href={`mailto:${selectedTechnician.email}`}
                    className="flex items-center p-3 bg-background-light dark:bg-background-dark rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <span className="material-icons text-primary mr-3">email</span>
                    <span>{selectedTechnician.email}</span>
                  </a>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border-light dark:border-border-dark">
                <button
                  onClick={() => toggleFavorite(selectedTechnician.id)}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition flex items-center justify-center space-x-2 ${
                    favorites.includes(selectedTechnician.id)
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-2 border-red-600'
                      : 'bg-background-light dark:bg-background-dark border-2 border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="material-icons">
                    {favorites.includes(selectedTechnician.id) ? 'favorite' : 'favorite_border'}
                  </span>
                  <span>{favorites.includes(selectedTechnician.id) ? 'Saved' : 'Save'}</span>
                </button>
                <button
                  onClick={() => {
                    handleCloseModal();
                    handleScheduleAppointment(selectedTechnician);
                  }}
                  className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition flex items-center justify-center space-x-2"
                >
                  <span className="material-icons">event</span>
                  <span>Schedule Appointment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
