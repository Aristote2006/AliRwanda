import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  try {
    await connectDB();

    console.log('🔍 Checking for existing admin user...');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@alirwanda.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists. Updating password...');
      
      // Properly hash the password using bcrypt
      const salt = await bcrypt.genSalt(10);
      existingAdmin.password = await bcrypt.hash('Admin@123', salt);
      existingAdmin.role = 'admin'; // Ensure role is admin
      existingAdmin.isActive = true;
      
      await existingAdmin.save();
      console.log('✅ Admin user updated successfully');
    } else {
      console.log('📝 Creating new admin user...');
      
      // Properly hash the password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@123', salt);
      
      // Create admin user with properly hashed password
      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@alirwanda.com',
        password: hashedPassword, // Already hashed, will not be double-hashed
        role: 'admin',
        isActive: true,
      });
      
      console.log('✅ Admin user created successfully');
      console.log('📧 Email: admin@alirwanda.com');
      console.log('🔑 Password: Admin@123');
    }
    
    // Verify the admin user
    const admin = await User.findOne({ email: 'admin@alirwanda.com' }).select('+password');
    console.log('\n📊 Admin User Details:');
    console.log(`   ID: ${admin._id}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Active: ${admin.isActive}`);
    console.log(`   Password Hashed: ${admin.password.startsWith('$2') ? '✅ Yes' : '❌ No'}`);
    
    console.log('\n🎉 Admin seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding admin user:', error.message);
    process.exit(1);
  }
};

seedAdmin();
