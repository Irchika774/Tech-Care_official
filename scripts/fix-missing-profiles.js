import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './server/models/User.js';
import Technician from './server/models/Technician.js';
import Customer from './server/models/Customer.js';

dotenv.config({ path: './server/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/techcare';

async function fixMissingProfiles() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Fix Technicians
        console.log('🔍 Checking for Technician users without Technician profiles...');
        const technicianUsers = await User.find({ role: 'technician' });
        console.log(`Found ${technicianUsers.length} technician users`);

        let fixedTechnicians = 0;
        for (const user of technicianUsers) {
            const existingTech = await Technician.findOne({ userId: user._id });
            if (!existingTech) {
                console.log(`  ⚠️  User ${user.email} (${user.name}) has no Technician profile - creating...`);
                const newTech = new Technician({
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    phone: 'Not provided',
                    location: {
                        type: 'Point',
                        coordinates: [0, 0]
                    }
                });
                await newTech.save();
                console.log(`  ✅ Created Technician profile for ${user.email}`);
                fixedTechnicians++;
            } else {
                console.log(`  ✓ User ${user.email} already has Technician profile`);
            }
        }

        // Fix Customers
        console.log('\n🔍 Checking for Customer/User users without Customer profiles...');
        const customerUsers = await User.find({ role: { $in: ['user', 'customer'] } });
        console.log(`Found ${customerUsers.length} customer/user users`);

        let fixedCustomers = 0;
        for (const user of customerUsers) {
            const existingCust = await Customer.findOne({ userId: user._id });
            if (!existingCust) {
                console.log(`  ⚠️  User ${user.email} (${user.name}) has no Customer profile - creating...`);
                const newCust = new Customer({
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    location: {
                        type: 'Point',
                        coordinates: [0, 0]
                    }
                });
                await newCust.save();
                console.log(`  ✅ Created Customer profile for ${user.email}`);
                fixedCustomers++;
            } else {
                console.log(`  ✓ User ${user.email} already has Customer profile`);
            }
        }

        console.log('\n📊 Summary:');
        console.log(`  - Fixed ${fixedTechnicians} Technician profiles`);
        console.log(`  - Fixed ${fixedCustomers} Customer profiles`);
        console.log('\n✅ All profiles are now in sync!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔒 Database connection closed');
    }
}

fixMissingProfiles();
