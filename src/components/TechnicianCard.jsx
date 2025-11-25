import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TechnicianCard = ({ technician }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div 
      className="bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img 
          alt={technician.name} 
          className={`w-full h-48 object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
          src={technician.image}
        />
        <button
          onClick={handleFavorite}
          className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900 transition"
        >
          <span className={`material-icons ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}>
            {isFavorite ? 'favorite' : 'favorite_border'}
          </span>
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center text-white">
            <span className="material-icons text-yellow-500 text-base mr-1">star</span>
            <span className="font-semibold">{technician.rating}</span>
            <span className="ml-1 text-sm opacity-90">({technician.reviews}+ reviews)</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h4 className="text-xl font-semibold mb-3">{technician.name}</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {technician.services.map((service, index) => (
            <span 
              key={index}
              className="bg-indigo-100 dark:bg-indigo-900 text-primary dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-medium"
            >
              {service}
            </span>
          ))}
        </div>
        <div className="flex items-center text-text-secondary-light dark:text-text-secondary-dark mb-4">
          <span className="material-icons text-sm mr-1">location_on</span>
          <span className="text-sm">{technician.distance} miles away</span>
        </div>
        <div className="border-t border-border-light dark:border-border-dark pt-4 flex justify-between items-center">
          <p className="font-bold text-xl text-primary">{technician.price}</p>
          <div className="flex space-x-2">
            <button className="text-primary font-semibold py-2 px-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900 transition text-sm">
              Details
            </button>
            <button 
              onClick={() => navigate('/schedule')}
              className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition text-sm flex items-center space-x-1"
            >
              <span>Book</span>
              <span className="material-icons text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianCard;
