import app from '../backend/src/app.js';
import { connectDB } from '../backend/src/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection error in Vercel Serverless Function:', err);
    return res.status(500).json({
      error: 'Database connection failed',
      message: err.message,
    });
  }

  return app(req, res);
}
