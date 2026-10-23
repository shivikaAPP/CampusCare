import mongoose from 'mongoose';
import { seedDatabase } from '../utils/seedData.js';

let mongod = null;

export const connectDB = async () => {
  // Reuse existing connection in serverless (e.g. Vercel) warm lambdas
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const primaryUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/campuscare';

  try {
    console.log(`Attempting connection to MongoDB at: ${primaryUri}...`);
    // Attempt standard connection with 5-second timeout
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected successfully to: ${mongoose.connection.host}`);
    await seedDatabase();
    return mongoose.connection;
  } catch (primaryErr) {
    if (process.env.VERCEL) {
      console.error(
        'Vercel Serverless environment: Could not connect to MONGODB_URI. ' +
        'Please verify your MONGODB_URI (e.g. MongoDB Atlas) in your Vercel Project Environment Variables.'
      );
      throw primaryErr;
    }

    console.warn(`Local/Remote MongoDB not reachable (${primaryErr.message}).`);
    console.log('Initiating MongoMemoryServer for standalone zero-config hackathon mode...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      console.log(`In-Memory MongoDB instance active at: ${inMemoryUri}`);

      await mongoose.connect(inMemoryUri);
      console.log('Connected to In-Memory MongoDB successfully.');
      await seedDatabase();
    } catch (memErr) {
      console.error('Failed to initialize MongoMemoryServer:', memErr.message);
      throw memErr;
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};
