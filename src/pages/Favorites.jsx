import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { techniciansAPI } from '../lib/api';
import {
  Heart,
  Star,
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
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      // 1. Try to fetch from API if user is logged in
      if (user) {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (token) {
          const response = await fetch(`${API_URL}/api/customers/favorites`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            if (data.favorites && data.favorites.length > 0) {
              setFavorites(data.favorites.map(tech => ({
                id: tech.id || tech._id,
                name: tech.name,
                rating: tech.rating || 4.5,
                reviews: tech.reviewCount || 0,
                services: tech.services || [],
                specialization: tech.specialization?.[0] || 'General',
                availability: 'Available',
                price: tech.priceRange ? `$${tech.priceRange.min} - $${tech.priceRange.max}` : 'Contact for Price',
                image: tech.profileImage || tech.image || 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=300'
              })));
              setLoading(false);
              return;
            }
          }
        }
      }

      // 2. Fallback to localStorage
      const storedIds = JSON.parse(localStorage.getItem('pc-repair-favorites') || '[]');
      if (storedIds.length > 0) {
        const response = await techniciansAPI.getAll();
        const allTechs = response.data || [];
        const favTechs = allTechs.filter(t => storedIds.includes(t.id || t._id));

        const mappedFavorites = favTechs.map(tech => ({
          id: tech.id || tech._id,
          name: tech.name,
          rating: tech.rating || 4.5,
          reviews: tech.reviewCount || 0,
          services: tech.services || [],
          specialization: tech.specialization?.[0] || 'General',
          availability: 'Available',
          price: tech.priceRange ? `$${tech.priceRange.min} - $${tech.priceRange.max}` : 'Contact for Price',
          image: tech.profileImage || tech.image || 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=300'
        }));
        setFavorites(mappedFavorites);
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.error("Failed to load favorites", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (id) => {
    const storedIds = JSON.parse(localStorage.getItem('pc-repair-favorites') || '[]');
    const newIds = storedIds.filter(fid => fid !== id);
    localStorage.setItem('pc-repair-favorites', JSON.stringify(newIds));
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
