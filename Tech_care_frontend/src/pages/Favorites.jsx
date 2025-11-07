import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites] = useState([
    {
      id: 1,
      name: 'Mobile Wizards',
      rating: 4.9,
      reviews: 1200,
      services: ['Screen Repair', 'Battery Fix'],
      specialization: 'Mobile Devices',
      availability: 'Available Today',
      price: '$50 - $250',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpjnPGaHMNfySM0XdsWGFM8Ac4KNQNKiXUS3Y6B3gNfw3PTX9qpxQaSzsRnBaJdznzm0o9gDi_XN7i1hittn0ZBLKollEJYw2JPng1XBJ82gMs0KL8Rle5bHZlwSFnPrdglNHk5jgeBhx0cKwnyTKpYvPXXyX0Auy7nVCgKaZy8xC54es7beBmU6OvPQOkM0MefRI2PFhKld5d-Q-AA8J08pqF23RYVLyxrvWaCzD6B1RxfL3i9302086lobuhNvXmueMbSDoHo7sX'
    },
    {
      id: 2,
      name: 'Circuit Masters',
      rating: 4.9,
      reviews: 302,
      services: ['Hardware Upgrade', 'Custom Builds'],
      specialization: 'PC Repair',
      availability: 'Available Tomorrow',
      price: '$150 - $600',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXpNjbqO5jhUjfaqeN5rLe2orMY3j_JhfW5INZbGo0El9V3PpnvlpsL8sXtclCh62nsaUMlEjHlDl3Dg6ozBbIZQrEMup71NOXwPKtCZ5Vgo4pRmYfunB8AHzhSm8V8UO8KXG7bAF-R9XILyHu6S0l9kj4tk-qKeLsv7TlllipiwzfE2i0yE1gq5bcLPn7dqA7QcnliSf7_mjZ0rfGOTXhQ1KA-aCDjlru_FuDFgcNkZhGsbbN2uLDkYLM9fdwKkRuUwQ1JNe60XB2'
    },
    {
      id: 3,
      name: 'Tech Solutions Hub',
      rating: 4.7,
      reviews: 180,
      services: ['Data Recovery', 'OS Troubleshooting'],
      specialization: 'All Devices',
      availability: 'Available Today',
      price: '$75 - $450',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHwkqgjTQre8sA1y8dPpf2pvMYzQGvh3evZycbFw3wZAr-bM70Q49nri6jK6bsaiXRbu6Bp50aRBq8XqRRgQjbCY4mO4tx6Z29EDNCef-K6XSqaV-55F11KuOYgLZ5qBgzIWQxurblCisXHdvAvvVN-5iWK3JnFJkJA-MTz0vC8_lZlgWWcaQThaK6E-n1XBjZze9wcMmIHpa6AC01dJEfvFwMBvT5QL7IXy5Ulc_6-g-R4ZMroMza2rjn4WU3Rn5HkE3ng8xEQmhR'
    },
    {
      id: 4,
      name: 'Pocket Techs',
      rating: 4.7,
      reviews: 700,
      services: ['Camera Repair', 'Speaker Fix'],
      specialization: 'Mobile Devices',
      availability: 'Booked Until Next Week',
      price: '$60 - $200',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDovMWLM9pCPQ8Ifx2gK6QbFZyjK_8Xszb1KqMH4HoOBNwvibbfjCTHdAJUECnONA5em1tE-3E8gID1-C3bqmvyamYQcczH4g9KvCUQgZHEMY8Fybh67oeuNWDwALrDXujzJyfnliU5GnwThYDmw6U8ZDmhIudwsyYdKnKCb9CKgm93QdTn2l2VplZLQrtlQIGJFsOco4OvJYA_7W4VR-oMNDvJS-O59cvPVpJp0-Rv0dzDuooML-EEQM9WhEj5icklAfaB88WKQDeZ'
    },
    {
      id: 5,
      name: 'ProFix Electronics',
      rating: 4.8,
      reviews: 211,
      services: ['Hardware Upgrade', 'Virus Removal'],
      specialization: 'PC Repair',
      availability: 'Available Today',
      price: '$100 - $500',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBewh8ByxY98AJoMiI4EhZzRjw6eEpXOS_SVO2lGWXEKuYPMLgQ8quGqk9cQjc0g8P5egpfU3LlqafdphqeqYEH10BpQXvn_hPSh5EnTeCyLAJ20mabwfoUY5E834D331O75QW_Kis_Y561pNc3R-IySc73gNF4GT8jS80KqbsgHIOHBqHEV_RH6fYrqMUhS-2IShIeiel5TKen7AeM5PBwwrG2n_eaOwCYYuOwsn9A15Xh1N5kpx8WyGaCDfGSvgYqPKQD97ev0CVX'
    }
  ]);

  const getAvailabilityColor = (availability) => {
    if (availability.includes('Today')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    } else if (availability.includes('Tomorrow')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        
        <main className="py-12">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Saved Technicians</h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
                Your favorite technicians for quick booking
              </p>
            </div>

            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((tech) => (
                  <div key={tech.id} className="bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                    <div className="relative">
                      <img 
                        alt={tech.name} 
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                        src={tech.image}
                      />
                      <button className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900 transition">
                        <span className="material-icons text-red-500">favorite</span>
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold">{tech.name}</h3>
                        <div className="flex items-center space-x-1">
                          <span className="material-icons text-yellow-500 text-base">star</span>
                          <span className="font-semibold">{tech.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">
                        {tech.reviews}+ reviews • {tech.specialization}
                      </p>
                      <div className="mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getAvailabilityColor(tech.availability)}`}>
                          {tech.availability}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tech.services.map((service, idx) => (
                          <span 
                            key={idx}
                            className="bg-indigo-100 dark:bg-indigo-900 text-primary dark:text-indigo-300 px-2 py-1 rounded-full text-xs"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-border-light dark:border-border-dark">
                        <p className="font-bold text-lg text-primary">{tech.price}</p>
                        <div className="flex space-x-2">
                          <button className="text-primary font-semibold py-2 px-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900 transition text-sm">
                            Details
                          </button>
                          <button 
                            onClick={() => navigate('/schedule')}
                            className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition text-sm"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-12 text-center">
                <span className="material-icons text-6xl text-text-secondary-light dark:text-text-secondary-dark mb-4">
                  favorite_border
                </span>
                <h3 className="text-xl font-bold mb-2">No Saved Technicians</h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                  Save your favorite technicians for quick access and easy booking
                </p>
                <button 
                  onClick={() => navigate('/')}
                  className="bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-opacity-90 transition"
                >
                  Explore Technicians
                </button>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Favorites;
