import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const allTechniciansData = [
  {
    id: 1,
    name: "ProFix Electronics",
    rating: 4.8,
    reviews: 211,
    services: ["Hardware Upgrade", "Virus Removal", "System Cleaning"],
    price: "$100 - $500",
    priceMin: 100,
    priceMax: 500,
    location: "New York, NY",
    experience: "8 years",
    pcType: "desktop",
    brand: "dell",
    specialization: "Hardware Failure",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBewh8ByxY98AJoMiI4EhZzRjw6eEpXOS_SVO2lGWXEKuYPMLgQ8quGqk9cQjc0g8P5egpfU3LlqafdphqeqYEH10BpQXvn_hPSh5EnTeCyLAJ20mabwfoUY5E834D331O75QW_Kis_Y561pNc3R-IySc73gNF4GT8jS80KqbsgHIOHBqHEV_RH6fYrqMUhS-2IShIeiel5TKen7AeM5PBwwrG2n_eaOwCYYuOwsn9A15Xh1N5kpx8WyGaCDfGSvgYqPKQD97ev0CVX",
    description: "Professional PC repair with over 8 years of experience. Specializing in hardware diagnostics and upgrades.",
    phone: "+1 (555) 123-4567",
    email: "contact@profixelectronics.com"
  },
  {
    id: 2,
    name: "Tech Solutions Hub",
    rating: 4.7,
    reviews: 180,
    services: ["Data Recovery", "OS Troubleshooting", "Network Setup"],
    price: "$75 - $450",
    priceMin: 75,
    priceMax: 450,
    location: "Los Angeles, CA",
    experience: "6 years",
    pcType: "desktop",
    brand: "hp",
    specialization: "Software Issues",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHwkqgjTQre8sA1y8dPpf2pvMYzQGvh3evZycbFw3wZAr-bM70Q49nri6jK6bsaiXRbu6Bp50aRBq8XqRRgQjbCY4mO4tx6Z29EDNCef-K6XSqaV-55F11KuOYgLZ5qBgzIWQxurblCisXHdvAvvVN-5iWK3JnFJkJA-MTz0vC8_lZlgWWcaQThaK6E-n1XBjZze9wcMmIHpa6AC01dJEfvFwMBvT5QL7IXy5Ulc_6-g-R4ZMroMza2rjn4WU3Rn5HkE3ng8xEQmhR",
    description: "Expert in data recovery and system troubleshooting. Fast and reliable service.",
    phone: "+1 (555) 234-5678",
    email: "info@techsolutionshub.com"
  },
  {
    id: 3,
    name: "Circuit Masters",
    rating: 4.9,
    reviews: 302,
    services: ["Hardware Upgrade", "Custom Builds", "Liquid Cooling"],
    price: "$150 - $600",
    priceMin: 150,
    priceMax: 600,
    location: "Chicago, IL",
    experience: "10 years",
    pcType: "desktop",
    brand: "custom",
    specialization: "Hardware Failure",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXpNjbqO5jhUjfaqeN5rLe2orMY3j_JhfW5INZbGo0El9V3PpnvlpsL8sXtclCh62nsaUMlEjHlDl3Dg6ozBbIZQrEMup71NOXwPKtCZ5Vgo4pRmYfunB8AHzhSm8V8UO8KXG7bAF-R9XILyHu6S0l9kj4tk-qKeLsv7TlllipiwzfE2i0yE1gq5bcLPn7dqA7QcnliSf7_mjZ0rfGOTXhQ1KA-aCDjlru_FuDFgcNkZhGsbbN2uLDkYLM9fdwKkRuUwQ1JNe60XB2",
    description: "Specialists in custom PC builds and high-performance upgrades. Premium service quality.",
    phone: "+1 (555) 345-6789",
    email: "support@circuitmasters.com"
  },
  {
    id: 4,
    name: "PC Medics Group",
    rating: 4.6,
    reviews: 155,
    services: ["System Cleaning", "OS Installation", "Driver Updates"],
    price: "$80 - $400",
    priceMin: 80,
    priceMax: 400,
    location: "Houston, TX",
    experience: "5 years",
    pcType: "desktop",
    brand: "any",
    specialization: "Software Issues",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBewh8ByxY98AJoMiI4EhZzRjw6eEpXOS_SVO2lGWXEKuYPMLgQ8quGqk9cQjc0g8P5egpfU3LlqafdphqeqYEH10BpQXvn_hPSh5EnTeCyLAJ20mabwfoUY5E834D331O75QW_Kis_Y561pNc3R-IySc73gNF4GT8jS80KqbsgHIOHBqHEV_RH6fYrqMUhS-2IShIeiel5TKen7AeM5PBwwrG2n_eaOwCYYuOwsn9A15Xh1N5kpx8WyGaCDfGSvgYqPKQD97ev0CVX",
    description: "Quick and affordable PC maintenance and software support.",
    phone: "+1 (555) 456-7890",
    email: "hello@pcmedicsgroup.com"
  },
  {
    id: 5,
    name: "Digital Doctor",
    rating: 4.5,
    reviews: 188,
    services: ["Network Troubleshooting", "Peripheral Setup", "Virus Removal"],
    price: "$60 - $300",
    priceMin: 60,
    priceMax: 300,
    location: "Phoenix, AZ",
    experience: "7 years",
    pcType: "desktop",
    brand: "lenovo",
    specialization: "Network Issues",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHwkqgjTQre8sA1y8dPpf2pvMYzQGvh3evZycbFw3wZAr-bM70Q49nri6jK6bsaiXRbu6Bp50aRBq8XqRRgQjbCY4mO4tx6Z29EDNCef-K6XSqaV-55F11KuOYgLZ5qBgzIWQxurblCisXHdvAvvVN-5iWK3JnFJkJA-MTz0vC8_lZlgWWcaQThaK6E-n1XBjZze9wcMmIHpa6AC01dJEfvFwMBvT5QL7IXy5Ulc_6-g-R4ZMroMza2rjn4WU3Rn5HkE3ng8xEQmhR",
    description: "Network and connectivity specialists. Get your PC online fast.",
    phone: "+1 (555) 567-8901",
    email: "care@digitaldoctor.com"
  },
  {
    id: 6,
    name: "Future Tech Repair",
    rating: 4.7,
    reviews: 129,
    services: ["Liquid Cooling Setup", "Data Backup", "Performance Tuning"],
    price: "$120 - $550",
    priceMin: 120,
    priceMax: 550,
    location: "Philadelphia, PA",
    experience: "9 years",
    pcType: "desktop",
    brand: "asus",
    specialization: "Hardware Failure",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXpNjbqO5jhUjfaqeN5rLe2orMY3j_JhfW5INZbGo0El9V3PpnvlpsL8sXtclCh62nsaUMlEjHlDl3Dg6ozBbIZQrEMup71NOXwPKtCZ5Vgo4pRmYfunB8AHzhSm8V8UO8KXG7bAF-R9XILyHu6S0l9kj4tk-qKeLsv7TlllipiwzfE2i0yE1gq5bcLPn7dqA7QcnliSf7_mjZ0rfGOTXhQ1KA-aCDjlru_FuDFgcNkZhGsbbN2uLDkYLM9fdwKkRuUwQ1JNe60XB2",
    description: "Advanced cooling solutions and performance optimization experts.",
    phone: "+1 (555) 678-9012",
    email: "service@futuretechrepair.com"
  }
];

const PCRepair = () => {
  const navigate = useNavigate();
  
  // Filter states
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('current');
  const [pcType, setPcType] = useState('all');
  const [commonIssues, setCommonIssues] = useState('all');
  const [brand, setBrand] = useState('any');
  const [priceRange, setPriceRange] = useState(500);
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
    const savedFavorites = localStorage.getItem('pc-repair-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...allTechniciansData];

    // Keyword filter
    if (keywords.trim()) {
      const keywordLower = keywords.toLowerCase();
      filtered = filtered.filter(tech => 
        tech.name.toLowerCase().includes(keywordLower) ||
        tech.services.some(service => service.toLowerCase().includes(keywordLower)) ||
        tech.location.toLowerCase().includes(keywordLower) ||
        tech.description.toLowerCase().includes(keywordLower)
      );
    }

    // PC Type filter
    if (pcType !== 'all') {
      filtered = filtered.filter(tech => tech.pcType === pcType);
    }

    // Common Issues filter
    if (commonIssues !== 'all') {
      filtered = filtered.filter(tech => tech.specialization === commonIssues);
    }

    // Brand filter
    if (brand !== 'any') {
      filtered = filtered.filter(tech => tech.brand === brand || tech.brand === 'any');
    }

    // Price range filter
    filtered = filtered.filter(tech => tech.priceMin <= priceRange);

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
  }, [keywords, pcType, commonIssues, brand, priceRange, minimumRating, sortBy]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    // Filters are already applied via useEffect
  };

  const handleResetFilters = () => {
    setKeywords('');
    setLocation('current');
    setPcType('all');
    setCommonIssues('all');
    setBrand('any');
    setPriceRange(500);
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
  const featuredTechnicians = [...allTechniciansData]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        
        <main>
          <section className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 sm:p-12 mt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
              <h2 className="text-4xl sm:text-5xl font-bold leading-tight">Expert PC Repair Services</h2>
              <p className="mt-4 text-lg text-text-secondary-light dark:text-text-secondary-dark">
                Connect with verified technicians specializing in desktop and component-level repairs. Fast, reliable, and convenient service, right at your fingertips.
              </p>
              <button 
                onClick={() => {
                  document.getElementById('featured-technicians')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-8 bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-opacity-90 transition"
              >
                Find Your PC Technician
              </button>
            </div>
            <div className="md:w-1/2">
              <img 
                alt="Illuminated interior of a gaming PC" 
                className="rounded-lg shadow-lg w-full" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnJ_tSRpr66FTTWjRzkzamMTc9fIGebNyU-teO8lPlUfEyeF2tZfwOu0BgDd70OWnzLuDKgBqzNp9VDC9p_lDHuRsrNSj8lwj6q8hGqdok-f9sdE7T8IWXK_XauBu880ykDRzi1sQhQxt0V4POOS_VL8xzhBKp0xpTNSwnnwUqsnRQre4MewLj7HlGntSACnK17wt4OMPnAg6_Pi6R2tF7PIy_jcler0rkZjPGMmBnMIvgLlf8xpu8gOKuZgbLT_wqYnPhYNcmO4gV"
              />
            </div>
          </section>

          <div className="flex flex-col lg:flex-row mt-12 gap-8">
            <aside className="lg:w-1/4">
              <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Refine Your Search</h3>
                <form onSubmit={handleApplyFilters}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2" htmlFor="keywords">
                        Keywords
                      </label>
                      <input 
                        className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary" 
                        id="keywords" 
                        name="keywords" 
                        placeholder="Search for keywords..." 
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2" htmlFor="location">
                        Your Location
                      </label>
                      <select 
                        className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary" 
                        id="location" 
                        name="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      >
                        <option value="current">Current Location</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2" htmlFor="pc-type">
                        PC Type
                      </label>
                      <select 
                        className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary" 
                        id="pc-type" 
                        name="pc-type"
                        value={pcType}
                        onChange={(e) => setPcType(e.target.value)}
                      >
                        <option value="all">All Types</option>
                        <option value="desktop">Desktop Tower</option>
                        <option value="aio">All-in-One</option>
                        <option value="mini">Mini PC</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2" htmlFor="common-issues">
                        Common Issues
                      </label>
                      <select 
                        className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary" 
                        id="common-issues" 
                        name="common-issues"
                        value={commonIssues}
                        onChange={(e) => setCommonIssues(e.target.value)}
                      >
                        <option value="all">All Issues</option>
                        <option value="Hardware Failure">Hardware Failure</option>
                        <option value="Software Issues">Software Issues</option>
                        <option value="Network Issues">Network Issues</option>
                        <option value="Performance">Performance Issues</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2" htmlFor="brand">
                        Brand
                      </label>
                      <select 
                        className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary" 
                        id="brand" 
                        name="brand"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                      >
                        <option value="any">Any Brand</option>
                        <option value="dell">Dell</option>
                        <option value="hp">HP</option>
                        <option value="lenovo">Lenovo</option>
                        <option value="asus">ASUS</option>
                        <option value="acer">Acer</option>
                        <option value="custom">Custom Built</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2" htmlFor="price-range">
                        Price Range
                      </label>
                      <input 
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mt-2" 
                        max="500" 
                        min="50" 
                        type="range" 
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                      />
                      <div className="flex justify-between text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                        <span>$50</span>
                        <span>${priceRange}</span>
                        <span>$500</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2" htmlFor="minimum-rating">
                        Minimum Rating
                      </label>
                      <select 
                        className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary" 
                        id="minimum-rating" 
                        name="minimum-rating"
                        value={minimumRating}
                        onChange={(e) => setMinimumRating(e.target.value)}
                      >
                        <option value="0">Any Rating</option>
                        <option value="3">3+ stars</option>
                        <option value="3.5">3.5+ stars</option>
                        <option value="4">4+ stars</option>
                        <option value="4.5">4.5+ stars</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <button 
                      className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition" 
                      type="submit"
                    >
                      Apply Filters
                    </button>
                    <button 
                      type="button"
                      onClick={handleResetFilters}
                      className="w-full bg-background-light dark:bg-card-dark border border-border-light dark:border-border-dark font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Reset Filters
                    </button>
                  </div>
                </form>
                
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    {filteredTechnicians.length} technician{filteredTechnicians.length !== 1 ? 's' : ''} found
                  </p>
                </div>
              </div>
            </aside>

            <div className="lg:w-3/4">
              <section id="featured-technicians">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Featured Technicians Near You</h3>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

              <section className="mt-12">
                <h3 className="text-2xl font-bold mb-6">
                  All PC Repair Services 
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredTechnicians.slice(0, visibleCount).map((tech) => (
                        <div key={tech.id} className="bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 relative">
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
                              {tech.services.length > 3 && (
                                <p className="text-xs text-primary ml-6">+{tech.services.length - 3} more services</p>
                              )}
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
                      <div className="text-center mt-8">
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
            </div>
          </div>
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
              {/* Image */}
              <div className="mb-6 rounded-lg overflow-hidden">
                <img 
                  src={selectedTechnician.image} 
                  alt={selectedTechnician.name}
                  className="w-full h-64 object-cover"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <span className="material-icons text-primary mr-2">info</span>
                  About
                </h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  {selectedTechnician.description}
                </p>
              </div>

              {/* Details Grid */}
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

              {/* Services */}
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

              {/* Contact Info */}
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

              {/* Actions */}
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

export default PCRepair;
