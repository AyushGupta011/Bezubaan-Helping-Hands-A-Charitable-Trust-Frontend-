import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import connectDB from './config/db.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@bezubaan.com' });
    if (existingAdmin) {
      console.log('✅ Admin already exists');
      process.exit(0);
    }

    // Create new admin
    const admin = new Admin({
      name: 'Admin User',
      email: 'admin@bezubaan.com',
      password: 'admin123456', // Change this in production!
      role: 'super_admin',
      permissions: [
        'view_dashboard',
        'manage_contacts',
        'manage_reports',
        'manage_volunteers',
        'manage_donations',
        'manage_admins'
      ],
      isActive: true
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@bezubaan.com');
    console.log('🔑 Password: admin123456');
    console.log('⚠️  Please change the password after first login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
