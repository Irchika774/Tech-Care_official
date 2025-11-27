import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/techcare';

const sampleTechnicians = [
    {
        name: "Mobile Wizards",
        email: "contact@mobilewizards.com",
        password: "password123",
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
            coordinates: [79.8612, 6.9271], // Colombo, Sri Lanka
            address: "123 Galle Road, Colombo 03, Sri Lanka"
        }
    },
    {
        name: "Quick Fix Mobile",
        email: "info@quickfixmobile.com",
        password: "password123",
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
            coordinates: [79.8738, 6.9319], // Colombo, Sri Lanka
            address: "456 Duplication Road, Colombo 04, Sri Lanka"
        }
    },
    {
        name: "TechCare Solutions",
        email: "support@techcaresolutions.com",
        password: "password123",
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
            coordinates: [79.8553, 6.9155], // Colombo, Sri Lanka
            address: "789 Baseline Road, Colombo 09, Sri Lanka"
        }
    },
    {
        name: "Smart Phone Clinic",
        email: "clinic@smartphoneclinic.lk",
        password: "password123",
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
            coordinates: [79.9595, 7.2906], // Kandy, Sri Lanka
            address: "321 Peradeniya Road, Kandy, Sri Lanka"
        }
    },
    {
        name: "Mobile Masters",
        email: "info@mobilemasters.lk",
        password: "password123",
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
            coordinates: [80.0210, 6.0535], // Galle, Sri Lanka
            address: "555 Main Street, Galle, Sri Lanka"
        }
    },
    {
        name: "Phone Doctor",
        email: "doctor@phonedoctor.lk",
        password: "password123",
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
            coordinates: [79.8428, 6.9897], // Negombo, Sri Lanka
            address: "888 Beach Road, Negombo, Sri Lanka"
        }
    }
];

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');

        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing technicians (optional)
        const existingCount = await User.countDocuments({ role: 'technician' });
        console.log(`📊 Found ${existingCount} existing technicians in database`);

        if (existingCount > 0) {
            console.log('⚠️  Database already has technicians. Skipping seed to avoid duplicates.');
            console.log('💡 To reseed, delete existing technicians first or modify this script.');
        } else {
            // Insert sample technicians
            await User.insertMany(sampleTechnicians);
            console.log(`✅ Successfully added ${sampleTechnicians.length} sample technicians`);
        }

        // Show all technicians
        const allTechs = await User.find({ role: 'technician' }).select('name email location.address');
        console.log('\n📋 Current Technicians:');
        allTechs.forEach((tech, index) => {
            console.log(`${index + 1}. ${tech.name} (${tech.email}) - ${tech.location?.address || 'No address'}`);
        });

        console.log('\n✅ Database seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        process.exit(1);
    }
}

seedDatabase();
