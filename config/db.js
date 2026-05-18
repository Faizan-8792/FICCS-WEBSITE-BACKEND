import mongoose from 'mongoose';

export const connectDb = async () => {
  const connection = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`MongoDB connected: ${connection.connection.host}`);
};
