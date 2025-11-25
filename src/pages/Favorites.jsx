import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Star,
  Calendar,
  MapPin,
  ArrowRight,
  Trash2,
  Clock,
  DollarSign,
  Briefcase
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([
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

  const removeFavorite = (id) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  const getAvailabilityVariant = (availability) => {
    if (availability.includes('Today')) return 'default'; // Green-ish usually
    if (availability.includes('Tomorrow')) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Saved Technicians</h1>
        <p className="text-lg text-muted-foreground">
          Your favorite technicians for quick access and easy booking.
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((tech) => (
            <Card key={tech.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img
                  alt={tech.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src={tech.image}
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 right-4 rounded-full bg-white/90 hover:bg-red-50 text-red-500 hover:text-red-600 shadow-sm"
                  onClick={() => removeFavorite(tech.id)}
                >
                  <Heart className="h-5 w-5 fill-current" />
                </Button>
                <Badge
                  variant={getAvailabilityVariant(tech.availability)}
                  className="absolute bottom-4 left-4 shadow-sm"
                >
                  {tech.availability}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{tech.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Briefcase className="h-3 w-3 mr-1" />
                      {tech.specialization}
                    </CardDescription>
                  </div>
                  <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded text-sm font-medium text-yellow-700 dark:text-yellow-400">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
                    {tech.rating}
                    <span className="text-muted-foreground ml-1 font-normal text-xs">({tech.reviews})</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-3">
                <div className="flex flex-wrap gap-2 mb-4">
                  {tech.services.map((service, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs font-normal">
                      {service}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center text-sm font-medium">
                  <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                  {tech.price}
                </div>
              </CardContent>

              <CardFooter className="pt-3 border-t bg-muted/20 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => navigate(`/technician/${tech.id}`)}>
                  Details
                </Button>
                <Button className="flex-1" onClick={() => navigate('/schedule', { state: { technician: tech } })}>
                  Book Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <div className="bg-muted/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Saved Technicians</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Save your favorite technicians by clicking the heart icon on their profile for quick access and easy booking.
            </p>
            <Button size="lg" onClick={() => navigate('/')}>
              Explore Technicians
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Favorites;
