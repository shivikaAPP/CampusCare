import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
// Support base64 image payloads up to 10MB
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.use(morgan('dev'));
}

// Base / Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'CampusCare - Smart Campus Complaint Management System',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.VERCEL ? 'vercel-serverless' : 'node-server',
  });
});

// Root API info
app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    system: 'CampusCare - Smart Campus Complaint Management System API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      complaints: '/api/complaints',
    },
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
