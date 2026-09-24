import mongoose from 'mongoose';

export const connectDB = async (): Promise<boolean> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log('ℹ️ No MONGODB_URI provided in environment variables.');
    console.log('⚡ TaskFlow will run with high-performance persistent in-memory storage fallback.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.warn(`⚠️ MongoDB connection error: ${error.message}`);
    console.log('⚡ Falling back to in-memory persistence mode.');
    return false;
  }
};

export const isMongoConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};
