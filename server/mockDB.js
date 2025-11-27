// Temporary in-memory storage for development
// This allows the app to work without MongoDB

const inMemoryDB = {
    technicians: [],
    users: [],
    appointments: [],
    reviews: []
};

// Sample technicians data
const sampleTechnicians = [
    {
        _id: '1',
        name: "Mobile Wizards",
        email: "contact@mobilewizards.com",
        role: "technician",
        phone: "+94 77 123 4567",
        profileImage: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop",
        description: "Expert mobile repair service with 10+ years of experience. Specializing in all major smartphone brands.",
        specialization: ["Screen Repair", "Battery Replacement", "Water Damage", "Camera Repair"],
        brands: ["Apple", "Samsung", "Google", "OnePlus"],
        experience: 10,
        priceRange: { min: 15, max: 150 },
        rating: 4.9,
        reviewCount: 1247,
        location: {
            type: "Point",
            coordinates: [79.8612, 6.9271], // Colombo, Sri Lanka [lng, lat]
            address: "123 Galle Road, Colombo 03, Sri Lanka"
        }
    },
    {
        _id: '2',
        name: "Quick Fix Mobile",
        email: "info@quickfixmobile.com",
        role: "technician",
        phone: "+94 71 234 5678",
        profileImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
        description: "Fast and reliable mobile repairs. Same-day service available for most repairs.",
        specialization: ["Screen Repair", "Charging Port", "Speaker/Microphone", "Software Issues"],
        brands: ["Apple", "Samsung", "Xiaomi", "Oppo"],
        experience: 7,
        priceRange: { min: 20, max: 120 },
        rating: 4.8,
        reviewCount: 856,
        location: {
            type: "Point",
            coordinates: [79.8738, 6.9319],
            address: "456 Duplication Road, Colombo 04, Sri Lanka"
        }
    },
    {
        _id: '3',
        name: "TechCare Solutions",
        email: "support@techcaresolutions.com",
        role: "technician",
        phone: "+94 76 345 6789",
        profileImage: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
        description: "Professional technicians providing quality repairs for all smartphone brands. Authorized service center.",
        specialization: ["Screen Repair", "Battery Replacement", "Camera Repair", "Charging Port", "Water Damage"],
        brands: ["Apple", "Samsung", "Google", "Huawei", "Xiaomi"],
        experience: 12,
        priceRange: { min: 25, max: 180 },
        rating: 4.95,
        reviewCount: 2134,
        location: {
            type: "Point",
            coordinates: [79.8553, 6.9155],
            address: "789 Baseline Road, Colombo 09, Sri Lanka"
        }
    },
    {
        _id: '4',
        name: "Smart Phone Clinic",
        email: "clinic@smartphoneclinic.lk",
        role: "technician",
        phone: "+94 75 456 7890",
        profileImage: "https://images.unsplash.com/photo-1587829741301-dc798b83defb?w=400&h=300&fit=crop",
        description: "Your one-stop shop for all mobile repairs. Expert diagnosis and repair services.",
        specialization: ["Screen Repair", "Battery Replacement", "Software Issues"],
        brands: ["Apple", "Samsung", "Vivo", "Oppo"],
        experience: 5,
        priceRange: { min: 18, max: 100 },
        rating: 4.7,
        reviewCount: 543,
        location: {
            type: "Point",
            coordinates: [79.9595, 7.2906],
            address: "321 Peradeniya Road, Kandy, Sri Lanka"
        }
    },
    {
        _id: '5',
        name: "Mobile Masters",
        email: "info@mobilemasters.lk",
        role: "technician",
        phone: "+94 70 567 8901",
        profileImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
        description: "Masters in mobile technology. We fix it right the first time, every time.",
        specialization: ["Screen Repair", "Battery Replacement", "Camera Repair", "Charging Port"],
        brands: ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi"],
        experience: 8,
        priceRange: { min: 22, max: 140 },
        rating: 4.85,
        reviewCount: 1045,
        location: {
            type: "Point",
            coordinates: [80.0210, 6.0535],
            address: "555 Main Street, Galle, Sri Lanka"
        }
    },
    {
        _id: '6',
        name: "Phone Doctor",
        email: "doctor@phonedoctor.lk",
        role: "technician",
        phone: "+94 72 678 9012",
        profileImage: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?w=400&h=300&fit=crop",
        description: "Certified technicians with expertise in diagnosing and repairing all mobile issues.",
        specialization: ["Water Damage", "Screen Repair", "Battery Replacement", "Software Issues"],
        brands: ["Apple", "Samsung", "Huawei"],
        experience: 6,
        priceRange: { min: 20, max: 110 },
        rating: 4.75,
        reviewCount: 678,
        location: {
            type: "Point",
            coordinates: [79.8428, 6.9897],
            address: "888 Beach Road, Negombo, Sri Lanka"
        }
    }
];

// Initialize with sample data
inMemoryDB.technicians = sampleTechnicians;

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lon1, lat1, lon2, lat2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

export const mockDB = {
    // Get all technicians
    getTechnicians: () => {
        return Promise.resolve([...inMemoryDB.technicians]);
    },

    // Get nearby technicians
    getNearbyTechnicians: (lng, lat, maxDistance) => {
        const nearby = inMemoryDB.technicians.filter(tech => {
            if (!tech.location || !tech.location.coordinates) return false;

            const [techLng, techLat] = tech.location.coordinates;
            const distance = calculateDistance(lng, lat, techLng, techLat);

            return distance <= maxDistance;
        });

        // Sort by distance
        nearby.sort((a, b) => {
            const distA = calculateDistance(lng, lat, a.location.coordinates[0], a.location.coordinates[1]);
            const distB = calculateDistance(lng, lat, b.location.coordinates[0], b.location.coordinates[1]);
            return distA - distB;
        });

        return Promise.resolve(nearby);
    },

    // Add new technician
    addTechnician: (techData) => {
        const newTech = {
            _id: String(inMemoryDB.technicians.length + 1),
            ...techData,
            role: 'technician'
        };
        inMemoryDB.technicians.push(newTech);
        return Promise.resolve(newTech);
    },

    // Get all users
    getUsers: () => {
        return Promise.resolve([...inMemoryDB.users]);
    }
};

export default inMemoryDB;
