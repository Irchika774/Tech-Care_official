import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const techniciansPool = [
  {
    id: 1,
    name: "Mobile Wizards",
    rating: 4.9,
    reviews: 1200,
    services: ["Screen Repair", "Battery Replacement", "Water Damage"],
    priceRange: "$50 - $250",
    avgPrice: 150,
    location: "New York, NY",
    experience: "8 years",
    responseTime: "< 1 hour",
    completionRate: 98,
    warranty: "90 days",
    specialties: ["iPhone", "Samsung", "Google Pixel"],
    certifications: ["Apple Certified", "Samsung Authorized"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpjnPGaHMNfySM0XdsWGFM8Ac4KNQNKiXUS3Y6B3gNfw3PTX9qpxQaSzsRnBaJdznzm0o9gDi_XN7i1hittn0ZBLKollEJYw2JPng1XBJ82gMs0KL8Rle5bHZlwSFnPrdglNHk5jgeBhx0cKwnyTKpYvPXXyX0Auy7nVCgKaZy8xC54es7beBmU6OvPQOkM0MefRI2PFhKld5d-Q-AA8J08pqF23RYVLyxrvWaCzD6B1RxfL3i9302086lobuhNvXmueMbSDoHo7sX"
  },
  {
    id: 2,
    name: "Fone Fixers",
    rating: 4.8,
    reviews: 850,
    services: ["Charging Port Repair", "Water Damage", "Speaker Fix"],
    priceRange: "$70 - $300",
    avgPrice: 185,
    location: "Los Angeles, CA",
    experience: "6 years",
    responseTime: "< 2 hours",
    completionRate: 96,
    warranty: "60 days",
    specialties: ["Samsung", "OnePlus", "Xiaomi"],
    certifications: ["Samsung Authorized"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYOQbF9Rf31b64CLzucTed9New93PsgPBtgxJ84A5qIVGFE4OV4gR7slRLP3NAsLkIyiy7sKdk0sYR-BAaDUAK8UwIY0FdVaHKdXU2DeXWsMBX2klyWNUPjypUw1UjxHPcHWax28skPdRjyyo9IzzXnBwWKmYCzZyg6lSzrRO2ZGqPccfaCK7irz7BAfIiUT8irri9YDNKJVtSu6H4-xMw5f-i9QdPDbG1cgyERN-NIR565NTz8lozduJ4aJghNxrdVSmRJCw4PNqR"
  },
  {
    id: 3,
    name: "Circuit Masters",
    rating: 4.9,
    reviews: 302,
    services: ["Hardware Upgrade", "Custom Builds", "Liquid Cooling"],
    priceRange: "$150 - $600",
    avgPrice: 375,
    location: "Chicago, IL",
    experience: "10 years",
    responseTime: "< 3 hours",
    completionRate: 99,
    warranty: "6 months",
    specialties: ["PC Building", "Gaming PCs", "Overclocking"],
    certifications: ["CompTIA A+", "Microsoft Certified"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXpNjbqO5jhUjfaqeN5rLe2orMY3j_JhfW5INZbGo0El9V3PpnvlpsL8sXtclCh62nsaUMlEjHlDl3Dg6ozBbIZQrEMup71NOXwPKtCZ5Vgo4pRmYfunB8AHzhSm8V8UO8KXG7bAF-R9XILyHu6S0l9kj4tk-qKeLsv7TlllipiwzfE2i0yE1gq5bcLPn7dqA7QcnliSf7_mjZ0rfGOTXhQ1KA-aCDjlru_FuDFgcNkZhGsbbN2uLDkYLM9fdwKkRuUwQ1JNe60XB2"
  }
];

const Compare = () => {
  const navigate = useNavigate();
  const [selectedTechnicians, setSelectedTechnicians] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddTechnician = (tech) => {
    if (selectedTechnicians.length >= 3) {
      alert('You can compare up to 3 technicians');
      return;
    }
    if (selectedTechnicians.find(t => t.id === tech.id)) {
      alert('This technician is already selected');
      return;
    }
    setSelectedTechnicians([...selectedTechnicians, tech]);
    setShowAddModal(false);
  };

  const handleRemoveTechnician = (techId) => {
    setSelectedTechnicians(selectedTechnicians.filter(t => t.id !== techId));
  };

  const getWinner = (metric) => {
    if (selectedTechnicians.length === 0) return null;
    
    switch(metric) {
      case 'rating':
        return selectedTechnicians.reduce((max, tech) => 
          tech.rating > max.rating ? tech : max
        );
      case 'price':
        return selectedTechnicians.reduce((min, tech) => 
          tech.avgPrice < min.avgPrice ? tech : min
        );
      case 'experience':
        return selectedTechnicians.reduce((max, tech) => 
          parseInt(tech.experience) > parseInt(max.experience) ? tech : max
        );
      case 'reviews':
        return selectedTechnicians.reduce((max, tech) => 
          tech.reviews > max.reviews ? tech : max
        );
      case 'response':
        return selectedTechnicians.reduce((min, tech) => 
          parseInt(tech.responseTime) < parseInt(min.responseTime) ? tech : min
        );
      case 'completion':
        return selectedTechnicians.reduce((max, tech) => 
          tech.completionRate > max.completionRate ? tech : max
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        
        <main className="py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Compare Technicians</h1>
            <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark">
              Compare up to 3 technicians side by side to make the best decision for your repair needs.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden">
            {selectedTechnicians.length === 0 ? (
              <div className="text-center py-16">
                <span className="material-icons text-6xl text-text-secondary-light dark:text-text-secondary-dark mb-4">
                  compare_arrows
                </span>
                <h3 className="text-xl font-semibold mb-2">No Technicians Selected</h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                  Add technicians to start comparing their services, prices, and ratings
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-opacity-90 transition inline-flex items-center gap-2"
                >
                  <span className="material-icons">add</span>
                  Add Technician
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background-light dark:bg-background-dark">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold sticky left-0 bg-background-light dark:bg-background-dark">
                        Comparison
                      </th>
                      {selectedTechnicians.map((tech) => (
                        <th key={tech.id} className="px-6 py-4 text-center min-w-[250px]">
                          <div className="relative">
                            <button
                              onClick={() => handleRemoveTechnician(tech.id)}
                              className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                            >
                              <span className="material-icons text-sm">close</span>
                            </button>
                            <img
                              src={tech.image}
                              alt={tech.name}
                              className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
                            />
                            <div className="font-bold">{tech.name}</div>
                            <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                              {tech.location}
                            </div>
                          </div>
                        </th>
                      ))}
                      {selectedTechnicians.length < 3 && (
                        <th className="px-6 py-4 text-center min-w-[250px]">
                          <button
                            onClick={() => setShowAddModal(true)}
                            className="w-20 h-20 rounded-full border-2 border-dashed border-border-light dark:border-border-dark flex items-center justify-center mx-auto hover:border-primary hover:text-primary transition"
                          >
                            <span className="material-icons text-3xl">add</span>
                          </button>
                          <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2">
                            Add Technician
                          </div>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light dark:divide-border-dark">
                    {/* Rating */}
                    <tr>
                      <td className="px-6 py-4 font-semibold sticky left-0 bg-card-light dark:bg-card-dark">
                        <div className="flex items-center gap-2">
                          <span className="material-icons text-yellow-500">star</span>
                          Rating
                        </div>
                      </td>
                      {selectedTechnicians.map((tech) => {
                        const winner = getWinner('rating');
                        const isWinner = winner && winner.id === tech.id;
                        return (
                          <td key={tech.id} className={`px-6 py-4 text-center ${isWinner ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-2xl font-bold">{tech.rating}</span>
                              {isWinner && <span className="material-icons text-green-500">check_circle</span>}
                            </div>
                            <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                              {tech.reviews} reviews
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Price */}
                    <tr className="bg-background-light dark:bg-background-dark">
                      <td className="px-6 py-4 font-semibold sticky left-0 bg-background-light dark:bg-background-dark">
                        <div className="flex items-center gap-2">
                          <span className="material-icons text-green-500">attach_money</span>
                          Avg Price
                        </div>
                      </td>
                      {selectedTechnicians.map((tech) => {
                        const winner = getWinner('price');
                        const isWinner = winner && winner.id === tech.id;
                        return (
                          <td key={tech.id} className={`px-6 py-4 text-center ${isWinner ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-2xl font-bold text-primary">${tech.avgPrice}</span>
                              {isWinner && <span className="material-icons text-green-500">check_circle</span>}
                            </div>
                            <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                              Range: {tech.priceRange}
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Experience */}
                    <tr>
                      <td className="px-6 py-4 font-semibold sticky left-0 bg-card-light dark:bg-card-dark">
                        <div className="flex items-center gap-2">
                          <span className="material-icons text-blue-500">work</span>
                          Experience
                        </div>
                      </td>
                      {selectedTechnicians.map((tech) => {
                        const winner = getWinner('experience');
                        const isWinner = winner && winner.id === tech.id;
                        return (
                          <td key={tech.id} className={`px-6 py-4 text-center ${isWinner ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-2xl font-bold">{tech.experience}</span>
                              {isWinner && <span className="material-icons text-green-500">check_circle</span>}
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Response Time */}
                    <tr className="bg-background-light dark:bg-background-dark">
                      <td className="px-6 py-4 font-semibold sticky left-0 bg-background-light dark:bg-background-dark">
                        <div className="flex items-center gap-2">
                          <span className="material-icons text-purple-500">schedule</span>
                          Response Time
                        </div>
                      </td>
                      {selectedTechnicians.map((tech) => {
                        const winner = getWinner('response');
                        const isWinner = winner && winner.id === tech.id;
                        return (
                          <td key={tech.id} className={`px-6 py-4 text-center ${isWinner ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-xl font-bold">{tech.responseTime}</span>
                              {isWinner && <span className="material-icons text-green-500">check_circle</span>}
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Completion Rate */}
                    <tr>
                      <td className="px-6 py-4 font-semibold sticky left-0 bg-card-light dark:bg-card-dark">
                        <div className="flex items-center gap-2">
                          <span className="material-icons text-green-500">check_circle</span>
                          Completion Rate
                        </div>
                      </td>
                      {selectedTechnicians.map((tech) => {
                        const winner = getWinner('completion');
                        const isWinner = winner && winner.id === tech.id;
                        return (
                          <td key={tech.id} className={`px-6 py-4 text-center ${isWinner ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-2xl font-bold">{tech.completionRate}%</span>
                              {isWinner && <span className="material-icons text-green-500">check_circle</span>}
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Warranty */}
                    <tr className="bg-background-light dark:bg-background-dark">
                      <td className="px-6 py-4 font-semibold sticky left-0 bg-background-light dark:bg-background-dark">
                        <div className="flex items-center gap-2">
                          <span className="material-icons text-blue-500">verified</span>
                          Warranty
                        </div>
                      </td>
                      {selectedTechnicians.map((tech) => (
                        <td key={tech.id} className="px-6 py-4 text-center">
                          <span className="text-xl font-bold">{tech.warranty}</span>
                        </td>
                      ))}
                    </tr>

                    {/* Services */}
                    <tr>
                      <td className="px-6 py-4 font-semibold sticky left-0 bg-card-light dark:bg-card-dark">
                        <div className="flex items-center gap-2">
                          <span className="material-icons text-purple-500">build_circle</span>
                          Services
                        </div>
                      </td>
                      {selectedTechnicians.map((tech) => (
                        <td key={tech.id} className="px-6 py-4 text-center">
                          <div className="space-y-1">
                            {tech.services.map((service, idx) => (
                              <div key={idx} className="text-sm">{service}</div>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Specialties */}
                    <tr className="bg-background-light dark:bg-background-dark">
                      <td className="px-6 py-4 font-semibold sticky left-0 bg-background-light dark:bg-background-dark">
                        <div className="flex items-center gap-2">
                          <span className="material-icons text-orange-500">star_outline</span>
                          Specialties
                        </div>
                      </td>
                      {selectedTechnicians.map((tech) => (
                        <td key={tech.id} className="px-6 py-4 text-center">
                          <div className="flex flex-wrap gap-2 justify-center">
                            {tech.specialties.map((specialty, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Certifications */}
                    <tr>
                      <td className="px-6 py-4 font-semibold sticky left-0 bg-card-light dark:bg-card-dark">
                        <div className="flex items-center gap-2">
                          <span className="material-icons text-green-500">verified_user</span>
                          Certifications
                        </div>
                      </td>
                      {selectedTechnicians.map((tech) => (
                        <td key={tech.id} className="px-6 py-4 text-center">
                          <div className="flex flex-wrap gap-2 justify-center">
                            {tech.certifications.map((cert, idx) => (
                              <span key={idx} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                                {cert}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Actions */}
                    <tr className="bg-background-light dark:bg-background-dark">
                      <td className="px-6 py-4 font-semibold sticky left-0 bg-background-light dark:bg-background-dark">
                        Actions
                      </td>
                      {selectedTechnicians.map((tech) => (
                        <td key={tech.id} className="px-6 py-4 text-center">
                          <button
                            onClick={() => navigate('/schedule', { state: { technician: tech } })}
                            className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition"
                          >
                            Book Now
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Legend */}
          {selectedTechnicians.length > 0 && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center gap-2">
              <span className="material-icons text-green-500">info</span>
              <span className="text-sm text-green-800 dark:text-green-200">
                <span className="material-icons text-sm">check_circle</span> indicates the best value in each category
              </span>
            </div>
          )}
        </main>
        
        <Footer />
      </div>

      {/* Add Technician Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-card-light dark:bg-card-dark rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold">Select Technician</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded-lg transition"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {techniciansPool.map((tech) => (
                <div
                  key={tech.id}
                  className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                    selectedTechnicians.find(t => t.id === tech.id)
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-border-light dark:border-border-dark hover:border-primary'
                  }`}
                  onClick={() => handleAddTechnician(tech)}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={tech.image}
                      alt={tech.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{tech.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        <span className="flex items-center gap-1">
                          <span className="material-icons text-yellow-500 text-sm">star</span>
                          {tech.rating}
                        </span>
                        <span>{tech.location}</span>
                        <span className="text-primary font-semibold">{tech.priceRange}</span>
                      </div>
                    </div>
                    {selectedTechnicians.find(t => t.id === tech.id) && (
                      <span className="material-icons text-green-500 text-3xl">check_circle</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;
