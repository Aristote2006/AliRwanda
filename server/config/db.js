import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    console.log('\n⚠️  Please ensure MongoDB is running:');
    console.log('   - Local: Run "mongod" in a separate terminal');
    console.log('   - Or update MONGODB_URI in .env to use MongoDB Atlas\n');
    process.exit(1);
  }
};

export default connectDB;
