#!/usr/bin/env node

/**
 * Create Admin User Script
 * Run this to create an initial admin user for testing
 * Usage: node server/scripts/createAdminUser.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techcare');
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@techcare.com' });
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log(`   Email: ${existingAdmin.email}`);
            console.log(`   Name: ${existingAdmin.name}`);
            console.log(`   Role: ${existingAdmin.role}`);
            await mongoose.disconnect();
            process.exit(0);
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('Admin123!', 10);
        const adminUser = new User({
            name: 'TechCare Admin',
            email: 'admin@techcare.com',
            password: hashedPassword,
            role: 'admin',
            isVerified: true
        });

        await adminUser.save();

        console.log('\n🎉 Admin user created successfully!');
        console.log('━'.repeat(50));
        console.log('📧 Email:    admin@techcare.com');
        console.log('🔑 Password: Admin123!');
        console.log('👤 Role:     admin');
        console.log('━'.repeat(50));
        console.log('\n✅ You can now login with these credentials');
        console.log('🌐 Login at: http://localhost:5173/login\n');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        await mongoose.disconnect();
        process.exit(1);
    }
};

createAdminUser();
