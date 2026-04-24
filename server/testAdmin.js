import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const testAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const admin = await User.findOne({ email: 'admin@alirwanda.com' }).select('+password');
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log('Run: npm run seed:admin');
      process.exit();
    }
    
    console.log('📊 Admin User Details:');
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);
    console.log('   Has Password:', admin.password ? 'YES' : 'NO');
    console.log('   Password Hash:', admin.password ? admin.password.substring(0, 30) + '...' : 'NONE');
    
    // Test password
    const testPassword = 'Admin@123';
    const isValid = await bcrypt.compare(testPassword, admin.password);
    
    console.log('\n🔐 Password Test:');
    console.log('   Input:', testPassword);
    console.log('   Valid:', isValid ? '✅ YES' : '❌ NO');
    
    if (!isValid) {
      console.log('\n⚠️  Password is invalid! Re-seeding admin...');
      
      // Re-hash and update
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash('Admin@123', salt);
      admin.role = 'admin';
      admin.isActive = true;
      await admin.save();
      
      console.log('✅ Admin password updated!');
      
      // Verify again
      const verifyAdmin = await User.findOne({ email: 'admin@alirwanda.com' }).select('+password');
      const isNowValid = await bcrypt.compare('Admin@123', verifyAdmin.password);
      console.log('   Verified:', isNowValid ? '✅ YES' : '❌ NO');
    }
    
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testAdmin();
