import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.log('Database is already connected.');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log('Connected to the database:', db.connection.name);
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to the database');
  }
}
